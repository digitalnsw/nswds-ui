# Why the system is built this way

This page explains the design decisions behind NSWDS UI — two distribution channels, four token
layers, headless-first components, and a stylesheet that has to survive being loaded into someone
else's build. It is background reading, not instructions. For those, see the
[tutorial](tutorial-build-your-first-page.md) and [how-to](howto-theme-and-rebrand.md).

The thread running through all of it: **this is not an application.** It is a system consumed by
other teams' codebases, which we do not control and cannot test against. Almost every decision
below is downstream of that.

---

## Two distribution channels

### The problem

Government delivery teams sit at opposite ends of a spectrum. Some want a versioned dependency
they can upgrade with Renovate and never think about. Others have a design deviation, an
accessibility audit finding, or a legacy shell to integrate with, and need to edit the component.

Ship only a package and the second group vendors a fork, which drifts and stops receiving fixes.
Ship only copyable source and the first group inherits maintenance they never wanted, and a
security fix has to be re-applied by hand in every consuming repo.

### The approach

Both, from one source of truth.

```
packages/ui/src/components/*.tsx
        │
        ├── tsup ──────────→ dist/ ──────→ npm  @nswds/ui        (compiled, versioned)
        │
        └── shadcn build ──→ r/*.json ───→ registry              (source, editable)
                                             ui.digital.nsw.gov.au/registry
```

Same files, two artefacts. A fix lands once and reaches both.

|          | npm                                    | Registry                             |
| -------- | -------------------------------------- | ------------------------------------ |
| You get  | Compiled ESM + types + precompiled CSS | `.tsx` source in your repo           |
| Upgrades | `npm update`                           | Re-run `shadcn add`, resolve by hand |
| Editing  | Via props, `className`, `cva`          | Edit the file                        |
| Tokens   | Inlined into `styles.css`              | You import `@nswds/tokens` yourself  |
| Blocks   | Not included                           | Included                             |

### Trade-offs

**Two artefacts can disagree.** The registry deploy is therefore gated: `apps/registry/vercel.json`
skips the build unless the commit is a semantic-release commit, so the deployed registry only ever
moves in lockstep with an npm release.

**Registry consumers pay a setup cost.** The npm stylesheet has token values baked in; copied
source references the raw token CSS, so registry users install `@nswds/tokens` and wire the layers
themselves. This is the single most common failure — components render, every colour is
transparent. It is why the `theme` item is a dependency of every component, and why its `docs`
field prints the imports after install.

**Deletion is asymmetric.** `shadcn build` writes but never deletes, so removing an item from
`registry.json` leaves its JSON deployed forever. `description-list` survived three releases that
way. `check:registry-resolves` now fails on the orphan.

**Blocks are deliberately registry-only.** A block is a starting point you own and edit. Exporting
it from npm would make it an API we version and cannot change.

---

## Headless-first

### The problem

Accessibility bugs in a design system are the worst kind of bug: invisible to the team that wrote
them, invisible in code review, and multiplied across every consuming service. A focus trap that
leaks, a menu that doesn't wrap arrow keys, a dialog that forgets to restore focus — these are
subtle enough that hand-rolled implementations get them wrong for years.

For NSW Government the stakes are legal as well as ethical: WCAG 2.2 AA is a baseline obligation.

### The approach

Every interactive component wraps a [Base UI](https://base-ui.com/) primitive. Base UI owns focus
management, keyboard navigation, ARIA semantics and the WAI-ARIA patterns. We own visual design.

The rule is absolute: **never hand-roll ARIA, focus traps or keyboard handlers.** If a component
needs behaviour Base UI doesn't provide, that is a conversation about the primitive, not licence to
write a `role` attribute.

The dividend shows up in the tutorial: `SkipLinks` gives you a conformant WCAG 2.4.1 bypass
mechanism, `Section labelledBy` gives you a named region landmark, and `Header` gives you a
`banner` — none of which anyone had to remember.

### Trade-offs

**We inherit Base UI's API decisions**, including breaking changes and gaps. When we scaffold from
shadcn's catalogue, its Radix primitives have to be swapped for Base UI equivalents whose APIs
differ.

**Some components have no primitive** — `Masthead`, `Footer`, `StepIndicator` are ours, so their
semantics are ours to get right. They carry the heaviest test coverage for that reason.

**Verification is not optional.** Every story across the 96 story files runs in real Chromium
with axe at WCAG 2.x AA enforced as an error (`apps/storybook/.storybook/preview.tsx`). A
component whose accessibility is inherited still has to prove it.

---

## Four token layers

### The problem

A design system needs to satisfy three demands that pull apart:

1. **NSW brand fidelity** — exact palette values, no drift.
2. **Re-branding** — agencies need their own colours without forking.
3. **Dark mode** — every colour needs a counterpart, and nobody wants to maintain two lists by hand.

Reference raw palette values in components and (2) and (3) become impossible. Invent purely
abstract names and (1) drifts.

### The approach

Four layers, each resolving into the one above:

```
Layer 4  Tailwind bridges       bg-primary, fill-nsw-blue-800
Layer 3  Shadcn semantic        --primary, --background, --radius
Layer 2  NSW role tokens        --action-default, --text-default, --danger-solid
Layer 1  NSW primitive palette  --nsw-blue-800, --primary-800
```

Layer 2 carries the whole design. Role tokens are **mode-aware**: light values on `:root`, dark
values scoped `[data-theme='dark'], .dark`, both shipped by `@nswds/tokens`. Because layer 3 is
defined purely in terms of layer 2, **there is no `.dark` override block in this repository.** Dark
mode is a property of the token package, not a second stylesheet we maintain.

That is the payoff: adding a component means picking the right role token, and dark mode is done.

### Trade-offs

**Indirection costs debuggability.** Four hops from `bg-primary` to a colour is a lot of
`var()`-chasing in devtools.

**Scoped re-branding is awkward**, because substitution happens where a property is _declared_ and
every layer is declared at `:root`. Overriding a lower layer on a subtree silently does nothing.
The [how-to](howto-theme-and-rebrand.md#the-rule-that-governs-all-of-this) documents the escape
hatch. A system optimised for per-subtree theming would resolve tokens at the component instead —
we optimised for the common case, which is one brand per site.

**Not every component reads the same layer.** `Button`'s primary colour resolves to the masterbrand
ramp; `Callout` reads role tokens directly. Both are defensible locally and the inconsistency is
real.

**Order is load-bearing, in a file we don't control.** `:root` and `.dark` have identical
specificity, so a consumer importing a `@nswds/tokens` bridge _after_ our stylesheet silently kills
dark mode — light values land last, backgrounds flip, text doesn't. Nothing errors. The durable fix
is upstream: raise the dark block's specificity in `@nswds/tokens` so no bare `:root` can undercut
it. Until then it is documented in three places.

---

## Surviving someone else's build

### The problem

This one is peculiar to shipping precompiled CSS.

An npm consumer imports our compiled utilities **and** runs their own Tailwind build. Both emit
into the same `utilities` cascade layer, and each build sorts only within itself. Within one build,
Tailwind guarantees `.lg\:justify-start` is emitted after `.justify-center`; across two builds
nothing does.

A media query adds no specificity. So a consumer who happens to use `.justify-center` anywhere in
their app re-emits it after ours — and it outranks our `.lg\:justify-start` on an element they
never referenced. Their footer's desktop layout breaks, in their app only, from a class they wrote
for something else.

This actually happened, on `Footer`, in v4.3.0.

### The approach

Two rules.

**Import order.** Ours first, theirs last, so their utilities win ties. A class you wrote should
beat one you didn't.

**Components never rely on that tiebreak.** Where a component needs a responsive override it uses
mutually exclusive variants — `max-lg:justify-center lg:justify-start`, never
`justify-center lg:justify-start`. Two variants whose conditions cannot both match resolve by
matching, not by order.

`scripts/check-cascade-safety.mjs` runs inside every build, reads the built `dist/styles.css`, and
fails on any rule paired with an overlapping conditional override of the same property.

### Trade-offs

**Cascade layers look like the fix and are not.** `@import '@nswds/ui/styles.css' layer(nswds)`
would pin utility order — but it also layers the `:root` and `.dark` token blocks the file carries,
and layered custom properties lose to _any_ unlayered `:root`. That trades a rare utility collision
for guaranteed dark-mode failure with no recovery.

**Authors carry a rule that looks like a style preference.** `motion-safe:transition-colors` over
`transition-colors motion-reduce:transition-none` renders identically here and differently in a
consumer's app. It needs a CI check because it is invisible locally.

**One consumer configuration is the only real test.** `fixtures/consumer` runs its own Tailwind
build alongside ours, which is the only place the two-build cascade is exercised end to end —
Storybook and `apps/` consume the dev entry and cannot reproduce it.

---

## Two entry stylesheets

`globals.css` (dev) scans the whole monorepo so Storybook and the sandboxes get their utilities.
`package.css` (publish) scans **only** `packages/ui/src`, so the published artefact contains
exactly the utilities the components use.

If the published stylesheet were built from the dev entry, every consumer would download utility
classes that exist only because a Storybook demo page used them — and, worse, would inherit
whatever those classes happened to override.

---

## Releasing only what changed

semantic-release runs from the repo root and sees every commit on `main`, but the monorepo
publishes exactly one package. Without a scope test, a `fix(deps)` bump confined to `apps/web` —
which is `private: true` and ships nowhere — cuts a full `@nswds/ui` patch release whose tarball is
functionally identical to its predecessor.

Before the gate existed, roughly a third of releases were empty that way, and each one opened a
Renovate PR with a full CI run in every consuming repo. At least eight repos, for no change.

So a release requires **both** a releasable commit type **and** a change under `packages/ui/`,
tested per commit across the range since the last tag.

Two consequences that look like bugs:

- A `chore:`/`refactor:` change to `packages/ui/` cannot ship by piggybacking on an unrelated
  `fix:` elsewhere. It waits for a genuinely releasable commit.
- `git commit --allow-empty -m 'fix: …'` still forces a release. An empty commit reports no files,
  and no-files deliberately fails _open_. That is the supported escape hatch.

---

## Related

- [Component reference](reference-components.md) · [Token reference](reference-tokens.md)
- [Theme and re-brand](howto-theme-and-rebrand.md) — the scoped-override rule in practice
- [CI gates](reference-ci-gates.md) — the checks enforcing all of the above
- [AGENTS.md](../AGENTS.md) — the operational detail behind this page

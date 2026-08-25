# CI gates reference

Every check that can block a merge, what it actually runs, and what a failure means. Written as a
lookup table for when CI is red and you need the answer fast.

`lint` + `typecheck` + `build` is **not** the merge gate. Several checks below fail for reasons
that trio cannot see, and **the job stops at its first failure** — fixing one can reveal another
underneath. A green run is the only evidence that all of them pass.

Source: `.github/workflows/pr-checks.yml`.

---

## The full sequence

Run in this order, in one job:

| #   | Step                       | Command                                                    |
| --- | -------------------------- | ---------------------------------------------------------- |
| 1   | Lint                       | `npm run lint`                                             |
| 2   | Typecheck                  | `npm run typecheck`                                        |
| 3   | Format check               | `npm run format:check`                                     |
| 4   | Component drift            | `npm run check:drift -w @nswds/ui`                         |
| 5   | Radius scale               | `npm run check:radius -w @nswds/ui`                        |
| 6   | Icon module parity         | `npm run check:icons -w @nswds/ui`                         |
| 7   | Release config tests       | `npm test -w @workspace/semantic-release-config`           |
| 8   | Build                      | `npm run build -w @nswds/ui` (runs `check:cascade` inside) |
| 9   | Unit tests                 | `npm test -w @nswds/ui`                                    |
| 10  | Package checks             | `npm run check:package -w @nswds/ui`                       |
| 11  | Consumer fixture           | `./scripts/test-consumer-fixture.sh`                       |
| 12  | Registry freshness         | rebuild + `git status` comparison                          |
| 13  | Registry resolution        | `npm run check:registry-resolves -w @nswds/ui`             |
| 14  | Storybook pre-bundle drift | `npm run check:optimize-deps -w @workspace/storybook`      |
| 15  | Storybook tests            | `npm run test -w @workspace/storybook`                     |

A separate `visual-change-release-guard` job runs in parallel.

---

## The ones that surprise people

### 3 · `format:check`

`prettier --check .` over the **whole repo**. A path-scoped
`npx prettier --check packages/ui/src` passes while an unformatted file anywhere else fails the
merge.

**Fix:** `npm run format`

### 4 · `check:drift`

`packages/ui/scripts/check-component-drift.mjs` enforces the two-channel rule:

- every non-story file in `src/components/` must be exported from `src/index.ts` **and**
  registered in `registry.json` as `registry:ui`
- everything in `src/patterns/` must be `registry:block` and must **never** reach the npm barrel

Removing a component from the public API is therefore never just deleting a barrel line.

**Escape hatch:** the `INTERNAL` allowlist at the top of that script — for a component that owns no
registry item but ships as a supporting file inside another item's `files` list.

### 5 · `check:radius`

Components may only use the token radius scale (`--radius-none|sm|md|lg|pill`). Catches a
hand-rolled `rounded-[6px]`.

### 6 · `check:icons`

Regenerates the icon barrel and byte-compares. The barrel is generated and lint/format-exempt, so
it drifts silently otherwise.

**Fix:** regenerate from `packages/ui` and commit the result.

### 7 · Release config tests

Cover the path-scoped release gate. They exist because `release.yml` commits with `[skip ci]`, so
nothing else in CI ever exercises the release configuration — a mistake there is invisible until it
has already published, or silently failed to.

They build a throwaway git repo per case, so they pass under this job's shallow checkout.

### 8 · `check:cascade` (inside `build`)

Runs **inside** `build`, not as its own step, because it reads the built `dist/styles.css` — so a
`build` that "succeeded" without it has not actually been run.

Fails when a class string pairs a rule with an overlapping conditional override of the same
property, because that pair resolves by emission order alone and a consumer's Tailwind build can
re-emit the loser after ours.

```
✗  transition-colors motion-reduce:transition-none
✓  motion-safe:transition-colors

✗  justify-center lg:justify-start
✓  max-lg:justify-center lg:justify-start
```

Cascade layers cannot fix this — see
[Surviving someone else's build](explanation-architecture.md#surviving-someone-elses-build).

### 9 · Unit tests

`node --test` over `packages/ui/tests/`, covering the package's **pure exported logic**. Runs
against `dist/`, not `src/` (Node cannot strip JSX), so it must come after `build` and fails with a
"run build first" message if you forget.

The Storybook suite does not replace it: that renders components, so it never reaches an exported
helper like `generatePushMenuBreadcrumb` — which shipped on both channels across thirteen releases
with no coverage and two bugs.

**Pure logic goes here; rendered behaviour goes in a story.**

### 10 · `check:package`

`publint --strict` + `are-the-types-wrong` against the built tarball. Catches export-map and
type-resolution faults that `build` alone will happily produce.

### 11 · Consumer fixture

**The only gate with no npm script** — invisible from `package.json`. Run it by path:

```bash
./scripts/test-consumer-fixture.sh
```

Packs the tarball, cold-installs into `fixtures/consumer`, runs `tsc --noEmit` and `vite build`,
then asserts:

- an imported icon's path data reaches the bundle
- an unimported icon's does **not** (tree-shaking)
- the compiled stylesheet shipped
- the combined stylesheet is cascade-safe

Build `@nswds/ui` first. Not redundant with `check:package`: that validates the package's _shape_,
this exercises it as a consumer receives it. The fixture runs its **own** Tailwind build alongside
ours, the only place the two-build cascade is tested end to end.

### 12 · Registry freshness

Rebuilds the registry and fails if committed output differs. Run `npm run registry:build` and
commit `apps/registry/public/r/` whenever component source, `registry.json` or `components.json`
change.

> **Removal is not symmetric.** `shadcn build` writes but never deletes, and this check compares
> `git status`, which cannot see a file nothing regenerates. Deleting an item from `registry.json`
> also means deleting `apps/registry/public/r/<name>.json` by hand.

### 13 · `check:registry-resolves`

The companion to `check:drift`, and easy to confuse with it. **Drift proves an item is registered;
this proves it would actually compile** once `shadcn add` copies it.

Reads the built JSON (post alias-rewrite, content inline — what consumers actually fetch), resolves
each item's transitive `registryDependencies`, and requires that every `@/…` import is delivered by
that closure and every npm import is declared in the item's **own** `dependencies`.

Also fails on a relative import that escaped the rewrite, a `registryDependency` naming no such
item, and an orphaned output file.

Four real bugs motivated it, all of which passed drift, validate **and** the freshness rebuild:

- `sheet`/`sonner` imported the icons barrel (`@/icons/index` — ~3,900 modules the icons item can
  never ship)
- `footer-contact` imported two icons absent from the icons item's file list
- `field` imported `@base-ui/react` while declaring only `cva`/`clsx`/`tailwind-merge`, working
  purely because `separator` happened to pull it in
- `description-list` stayed deployed for three releases after removal

**Import icons per-icon (`../icons/close.js`), never through the barrel.**

### 14 · `check:optimize-deps`

Asserts every bare import reachable from `packages/ui/src` appears in `optimizeDeps.include` in
`apps/storybook/vitest.config.ts`.

Stories import `@nswds/ui` as a workspace-**linked** package, which Vite treats as source and never
pre-bundles, so its third-party imports are invisible to the cold-start scanner and get discovered
one at a time as stories execute. Each discovery triggers a re-optimisation and a full-page reload
that kills whichever story was mid-flight.

Add a component with a new dependency, forget this list, and the Storybook job starts failing
intermittently **somewhere else entirely**.

### 15 · Storybook tests

Every story rendered in real Chromium, with axe at WCAG 2.x AA enforced as an error. This is the
suite that actually proves the components work. Takes roughly 80–170s.

### `visual-change-release-guard`

A PR touching `packages/ui/src/styles/**` must carry a **releasable** title type. Those files change
what every consumer renders, so a `style:`/`chore:`/`refactor:` change there would ship to nobody.

Use `fix:` for a tweak, `feat:` for a new or retuned token, and a `BREAKING CHANGE` footer for a
token removal or a value change that alters rendered output.

---

## Running the gates locally

The fast pre-push subset:

```bash
npm run lint && npm run typecheck && npm run format:check
```

The full local equivalent, in CI order:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run check:drift -w @nswds/ui
npm run check:radius -w @nswds/ui
npm run check:icons -w @nswds/ui
npm test -w @workspace/semantic-release-config
npm run build -w @nswds/ui
npm test -w @nswds/ui
npm run check:package -w @nswds/ui
./scripts/test-consumer-fixture.sh
npm run registry:build
npm run check:registry-resolves -w @nswds/ui
npm run check:optimize-deps -w @workspace/storybook
npm run test -w @workspace/storybook
```

---

## Two checks that are green without testing anything

Worth knowing so you don't read false confidence into the check count:

- **`install/test`** logs _"No vitest config and no npm test script — nothing to run"_. The shared
  workflow looks for a **root** test script, but both live in workspaces.
- **Visual regression (Chromatic)** can log _"Snapshot quota reached"_ and pass without comparing.

Judge a PR on the **Lint, Typecheck & Storybook a11y** job, not on how many checks are green.

---

## Node version

`.npmrc` sets `engine-strict=true`, which applies to **every installed package**. Any dependency,
however deep, whose `engines` excludes the running Node makes `npm ci` fail with `EBADENGINE`.

Use `.nvmrc` (24.16.0) and this never comes up.

The effective floor is the strictest range anywhere in the tree. Two rules that pull in opposite
directions:

- **Root `engines.node` must track that floor** — it is a promise `npm ci` enforces.
- **`packages/ui` `engines.node` must not.** That is the _published_ package, and none of the
  packages imposing the floor are runtime dependencies of it. Raising it would cut off consumer
  Node versions for no reason.

To find what blocks a given Node version — silence means it is installable:

```bash
node -e 'const l=require("./package-lock.json"),s=require("semver"),v=process.argv[1];for(const[k,p]of Object.entries(l.packages))if(p.engines?.node&&!p.optional&&!s.satisfies(v,p.engines.node))console.log(k||"(root)","->",p.engines.node)' 22.22.2
```

Run it against both ends of the root range. The `!p.optional` filter matters — platform-specific
optional packages declare ranges excluding the running Node but are never installed here.

---

## Related

- [Add a component](tutorial-add-a-component.md) — the walkthrough these gates guard
- [Architecture](explanation-architecture.md) — why each gate exists
- [AGENTS.md](../AGENTS.md) — the canonical contributor instructions

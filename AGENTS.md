# NSWDS UI — Agent & Developer Guide

> **Primary goal of every decision:** is this reusable and consumable by external projects?
> Judge every component, token, or API choice against that question first.

---

## 1. Purpose & Philosophy

This is a **reusable design system** for NSW Government digital products. It is NOT an application.
It is built to be consumed by _other_ teams' projects — the apps inside this monorepo
(`apps/web`, `apps/storybook`) exist only to develop and preview the system, not as end products.

**Two distribution channels:**

| Channel                 | How consumers use it                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| npm package `@nswds/ui` | `import { Button } from '@nswds/ui'` — compiled ESM, shipped with types and CSS                         |
| shadcn registry         | `npx shadcn add https://<registry-url>/r/button.json` — copies source directly into the consumer's repo |

**Headless-first.** All interactive components wrap [@base-ui/react](https://base-ui.com/) primitives.
Base UI handles focus management, keyboard navigation, ARIA, and WAI-ARIA patterns.
We style on top; we never hand-roll accessibility behaviour.

**Token-driven.** Every visual property is expressed through CSS custom property tokens.
Components reference _semantic_ tokens only — never raw values, never Tailwind palette colours.

**Scope:** everything published sits under `@nswds/ui`. Internal workspace packages use
`@workspace/<name>`. Never mix the two.

---

## 2. Architecture & Monorepo Layout

```
nswds-ui/                        ← private monorepo root (name: "design")
├── apps/
│   ├── web/                     ← private Next.js 16 sandbox (name: "web")
│   │   └── next.config.mjs      transpilePackages: ["@nswds/ui"]
│   ├── storybook/               ← private Storybook 10 + Vitest (name: "@workspace/storybook")
│   │   └── .storybook/
│   │       ├── main.ts          stories glob: packages/ui/src/**/*.stories.*
│   │       └── preview.tsx      imports @nswds/ui/globals.css, light/dark toggle
│   └── registry/                ← private static Vite server for built registry JSON
│       └── public/r/            ← OUTPUT: button.json, icons.json, logo.json, registry.json
│
├── packages/
│   ├── ui/                      ← @nswds/ui — THE published package
│   ├── eslint-config/           ← @workspace/eslint-config
│   ├── prettier-config/         ← @workspace/prettier-config
│   ├── typescript-config/       ← @workspace/typescript-config
│   └── semantic-release-config/ ← @workspace/semantic-release-config
│
├── turbo.json                   pipeline orchestration
├── release.config.cjs           extends @workspace/semantic-release-config
└── package.json                 root scripts (build, dev, release, registry:build, …)
                                 + workspaces: "workspaces": ["apps/*", "packages/*"]
```

### How `@nswds/ui` imports resolve

Two alias families are mapped in `packages/ui/tsconfig.json`:

**`@/*` — the shadcn-CLI write target.** `components.json` aliases point here, so `shadcn add`
writes new components into `src/components/` (not `dist/`). These paths are also what ends up
in registry JSON output for downstream consumers.

```
@/components/*  →  ./src/components/*
@/hooks/*       →  ./src/hooks/*
@/lib/*         →  ./src/lib/*
@/*             →  ./src/*
```

**`@nswds/ui/*` — the in-repo self-reference map.** Resolved here so the package (and the
workspace apps) can refer to its published API by its public name while developing against
source. These tsconfig paths point at `src/`:

```
@nswds/ui/components/*   →  ./src/components/*.tsx
@nswds/ui/icons          →  ./src/icons/index.ts
@nswds/ui/icons/*        →  ./src/icons/*.tsx
@nswds/ui/postcss.config →  ./postcss.config.mjs
@nswds/ui/*              →  ./src/*
```

External consumers do **not** resolve through tsconfig — they resolve through the `exports`
field in `package.json`, which points at `dist/`. The two surfaces are deliberately close but
not identical; the published export surface is:

```
.                →  ./dist/index.js        (types: ./dist/index.d.ts)
./styles.css     →  ./dist/styles.css       (compiled CSS, token values inlined)
./postcss.config →  ./postcss.config.mjs
./components/*   →  ./dist/components/*.js  (types: ./dist/components/*.d.ts)
./icons          →  ./dist/icons/index.js   (types: ./dist/icons/index.d.ts)
./icons/*        →  ./dist/icons/*.js       (types: ./dist/icons/*.d.ts)
./package.json   →  ./package.json
```

Differences from the tsconfig map worth knowing: the stylesheet is published as
`@nswds/ui/styles.css` — the in-repo dev specifier `@nswds/ui/globals.css` is a Storybook/Vite
alias only (see `apps/storybook/.storybook/main.ts`) and is **not** a published subpath. There
are no `@nswds/ui/hooks/*` or `@nswds/ui/lib/*` exports; `cn` (from `lib/utils`) is re-exported
from the root barrel, so consumers import it as `import { cn } from '@nswds/ui'`.

**Files under `packages/ui/src/` themselves use relative imports** (`'../lib/utils.js'`),
not either alias. Reason: `apps/web` consumes our source via `transpilePackages`, and its
own `@/* → ./*` alias would silently misresolve any `@/...` import inside our src; and
`@nswds/ui/...` self-imports leak into registry output. An ESLint `no-restricted-imports`
rule enforces this in `packages/ui/eslint.config.js`.

---

## 3. Design Tokens & Theming

Tokens live in `packages/ui/src/styles/theme.css` (imported by the `globals.css` dev entry).
There are **four layers**, built on top of `@nswds/tokens` (the companion token library):

### Layer 1 — NSW primitive palette (`@nswds/tokens`)

Imported from `@nswds/tokens/css/colors/global/oklch.css`. Defines raw named palette values
as CSS custom properties on `:root`:

```css
/* from @nswds/tokens */
:root {
  --nsw-blue-50: oklch(…);
  --nsw-blue-800: oklch(…); /* NSW brand blue */
  --nsw-red-600: oklch(…); /* NSW brand red (waratah) */
  --nsw-grey-900: oklch(…);
  /* … full palette: grey, green, teal, blue, purple, red, orange, yellow … */
}
```

Also imported: `@nswds/tokens/css/colors/semantic/oklch.css` — defines utility scales
(`--success-*`, `--danger-*`, `--info-*`, `--warning-*`).

### Layer 2 — Masterbrand theme (`@nswds/tokens`)

Imported from `@nswds/tokens/css/colors/themes/masterbrand/oklch.css`. Maps abstract
semantic role names to the NSW primitive palette:

```css
:root {
  --primary-800: oklch(…); /* = --nsw-blue-800 */
  --accent-600: oklch(…); /* = --nsw-red-600 */
  /* … */
}
```

### Layer 3 — Shadcn semantic tokens

Defined directly in `:root` and `.dark` blocks in theme.css as single-value tokens for
the shadcn/Base UI component system:

```css
:root {
  --primary: oklch(0.488 0.243 264.376); /* single interactive primary */
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --radius: 0.45rem;
  /* … border, ring, muted, accent, destructive, sidebar, chart … */
}

.dark {
  /* same names, different values */
}
```

The `.dark` class is toggled by `next-themes` or Storybook's `addon-themes`.

### Layer 4 — Tailwind bridges (`@theme` blocks)

Two `@theme` blocks make all the above available as Tailwind utility classes:

```css
/* From @nswds/tokens — makes fill-nsw-blue-800, bg-nsw-red-600, etc. work */
@import '@nswds/tokens/tailwind/colors/global/oklch.css';

/* From @nswds/tokens — makes fill-primary-800, bg-accent-600, etc. work */
@import '@nswds/tokens/tailwind/colors/themes/masterbrand/oklch.css';

/* Inline in theme.css — makes bg-primary, text-foreground, rounded-lg, etc. work */
@theme inline {
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
  /* … */
}
```

### Rule: components ONLY reference semantic tokens

```tsx
// CORRECT — shadcn semantic token (layer 3)
'bg-primary text-primary-foreground hover:bg-primary/80'

// CORRECT — NSW primitive utility (layer 1, for brand-specific things like the logo)
'fill-nsw-blue-800 dark:fill-white'

// WRONG — raw Tailwind palette
'bg-blue-600 text-white'

// WRONG — hardcoded value
'bg-[#0055a4]'
```

### Adding a new theme / brand

1. Add a selector block that overrides the shadcn semantic tokens (layer 3), e.g. `.nsw-health { --primary: oklch(…); }`.
2. `@nswds/tokens` ships additional brand themes under `dist/css/colors/themes/` — import the relevant one.
3. Consumers switch themes by toggling the class on their root element.

---

## 4. How to Add a New Component

### Optional — scaffold from the shadcn registry

For components that already exist in shadcn's catalogue, scaffold first then adapt:

```bash
cd packages/ui
npx shadcn@latest add <component>   # or a block URL
```

Files land in `src/components/` (and `src/lib/`, `src/hooks/` as needed) via the `@/*`
alias in `components.json` / `tsconfig.json`. Then perform the standard NSWDS cleanup
before committing:

1. **Convert any `@/...` imports the CLI generated to relative paths** (`@/lib/utils` →
   `../lib/utils.js`). The ESLint rule will flag any you miss.
2. **Swap Radix primitives for Base UI equivalents** (`@radix-ui/react-*` → `@base-ui/react/*`).
   APIs differ — check [base-ui.com](https://base-ui.com/).
3. **Replace any raw-palette / hardcoded colours** with semantic tokens (see §3).
4. Continue with Step 2 (barrel export), Step 3 (registry entry), Step 4 (story).

For components without a shadcn equivalent, skip the scaffold and start at Step 1.

### Step 1 — Create the source file

```
packages/ui/src/components/<name>.tsx
```

**Pattern (mirrors `button.tsx`):**

```tsx
'use client' // include if the component uses hooks or browser APIs

import { <Primitive> } from '@base-ui/react/<primitive>'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils.js' // relative — see §2 "How `@nswds/ui` imports resolve"

const <name>Variants = cva(
  // base classes using ONLY semantic token utilities
  '...',
  {
    variants: { /* … */ },
    defaultVariants: { /* … */ },
  }
)

function <Name>({ className, variant, size, ...props }:
  <Primitive>.Props & VariantProps<typeof <name>Variants>) {
  return (
    <Primitive
      data-slot="<name>"
      className={cn(<name>Variants({ variant, size, className }))}
      {...props}
    />
  )
}

export { <Name>, <name>Variants }
```

**Layering rules:**

- **Primitive** — wraps a single Base UI element; no layout, no composition.
- **Component** — may combine multiple primitives; still self-contained.
- **Pattern** — a composed UI pattern (e.g. `SearchBar`); documented separately from primitives.

**Accessibility:** inherit from Base UI. Never add `role`, `aria-*`, or custom focus
management unless Base UI explicitly provides an escape hatch for it. Check the
[Base UI docs](https://base-ui.com/) for which primitive to use.

**Responsive class strings must be cascade-safe.** Never pair a bare utility with a
responsive override of the same property — write `max-lg:justify-center lg:justify-start`,
not `justify-center lg:justify-start`, and `motion-safe:transition-colors`, not
`transition-colors motion-reduce:transition-none`. The two forms render identically here,
but the first survives being dropped into a consumer's stylesheet and the second does not:
npm consumers import our precompiled utilities _and_ run their own Tailwind build, which
re-emits any class they also use after ours, and a media query carries no extra specificity
to defend the override. `check:cascade` runs on every build and fails on the unsafe form;
its script header has the full explanation.

### Step 2 — Export from the package barrel

Add to `packages/ui/src/index.ts`:

```ts
export * from './components/<name>.js'
```

tsup auto-discovers new `.ts`/`.tsx` files in `src/` (excluding `.stories.tsx`), so the
`dist/components/<name>.js` entry point is created automatically on the next `build`.

### Step 3 — Register in registry.json

Add an entry to `packages/ui/registry.json`:

```json
{
  "name": "<name>",
  "type": "registry:ui",
  "title": "<Human Name>",
  "description": "One sentence.",
  "dependencies": ["@base-ui/react", "class-variance-authority", "clsx", "tailwind-merge"],
  "files": [
    {
      "path": "src/components/<name>.tsx",
      "type": "registry:ui",
      "target": "components/<name>.tsx"
    },
    {
      "path": "src/lib/utils.ts",
      "type": "registry:lib",
      "target": "lib/utils.ts"
    }
  ]
}
```

Only list `src/lib/utils.ts` if the component uses `cn()`. Only list deps the component
actually imports — consumers install them on `shadcn add`.

Then regenerate the registry output and commit it with your source change:

```bash
npm run registry:build   # writes apps/registry/public/r/*.json
```

The generated JSON in `apps/registry/public/r/` is committed to git. The PR check
(`.github/workflows/pr-checks.yml`) rebuilds the registry and fails if the committed
output doesn't match — a stale or missing JSON file blocks the merge.

### Step 4 — Write a Storybook story

```
packages/ui/src/components/<name>.stories.tsx
```

**Minimum required stories** (follow `button.stories.tsx` as the canonical example):

- `Default` — with a `play()` test proving the component mounts and is interactive.
- `Variants` — one story rendering all meaningful variant combinations.
- A `CssCheck` story asserting a computed style property — this proves globals.css loaded.

Stories live in `packages/ui/src/` but are **excluded from the tsup build** (see tsup.config.ts:
`name.endsWith('.stories.tsx')` check).

---

## 5. Local Commands

Run from the **repo root** unless noted.

| What                    | Command                                                        |
| ----------------------- | -------------------------------------------------------------- |
| Install deps            | `npm install`                                                  |
| Dev all apps            | `npm run dev`                                                  |
| Storybook only          | `npm run dev -w @workspace/storybook` → http://localhost:6006  |
| Web sandbox only        | `npm run dev -w web` → http://localhost:3000                   |
| Build everything        | `npm run build`                                                |
| Build UI package only   | `npm run build -w @nswds/ui`                                   |
| Build JS only           | `npm run build:js -w @nswds/ui`                                |
| Build CSS only          | `npm run build:css -w @nswds/ui`                               |
| Lint all                | `npm run lint`                                                 |
| Format all              | `npm run format`                                               |
| Check formatting        | `npm run format:check`                                         |
| Type check all          | `npm run typecheck`                                            |
| Check component drift   | `npm run check:drift -w @nswds/ui`                             |
| Check cascade safety    | `npm run check:cascade -w @nswds/ui` (needs `dist/styles.css`) |
| Check icons parity      | `npm run check:icons -w @nswds/ui`                             |
| Check published package | `npm run check:package -w @nswds/ui`                           |
| Test consumer fixture   | `./scripts/test-consumer-fixture.sh`                           |
| Build registry JSON     | `npm run registry:build`                                       |
| Validate registry.json  | `npm run registry:validate`                                    |
| Run Storybook tests     | `npm run test -w @workspace/storybook`                         |

The registry commands run in `packages/ui` but output to `apps/registry/public/r/`.

### What the PR check actually runs

`lint` + `typecheck` + `build` is **not** the merge gate.
`.github/workflows/pr-checks.yml` runs, in order: `lint`, `typecheck`,
`format:check`, `check:drift`, `check:icons`, `build -w @nswds/ui`,
`check:package`, `scripts/test-consumer-fixture.sh`, a registry-freshness
rebuild, a Playwright Chromium install, and the Storybook suite. The middle ones
are easy to miss locally, and each fails for a reason the usual trio cannot see
(`check:cascade` is not a step of its own — it runs inside `build`):

- **`format:check`** is `prettier --check .` over the **whole repo**. A
  path-scoped `npx prettier --check packages/ui/src` passes while an unformatted
  file anywhere else fails the merge.
- **`check:drift`** (`packages/ui/scripts/check-component-drift.mjs`) enforces
  the two-channel rule: every non-story file in `src/components/` must be
  exported from `src/index.ts` **and** registered in `registry.json` as a
  `registry:ui` item, while everything in `src/patterns/` must be a
  `registry:block` and must never reach the npm barrel. Removing a component
  from the public API is therefore never just deleting a barrel line. The escape
  hatch is the `INTERNAL` allowlist at the top of that script — for a component
  that owns no registry item but still ships as a supporting file inside another
  item's `files` list, which is how a public component's internal building block
  reaches registry consumers (they copy source, so it has to travel with it).
- **`check:icons`** regenerates the icon barrel and fails on any difference —
  see §4 and the icon generator for the regeneration command.
- **`check:cascade`** (`packages/ui/scripts/check-cascade-safety.mjs`) runs
  inside `build`, not as its own CI step, because it reads the built
  `dist/styles.css` — so a `build` that "succeeds" locally without it has not
  actually been run. It fails when a component's class string pairs a rule with
  a conditional (media or container query) override of the same property whose
  conditions overlap, because that pair resolves by emission order alone and an
  npm consumer's own Tailwind build can re-emit the loser after ours. See §4
  Step 1 for the authoring rule and the script header for why cascade layers
  cannot fix it instead.
- **`check:package`** runs `publint` and `are-the-types-wrong` against the built
  tarball, so it catches export-map and type-resolution faults that `build`
  alone will happily produce.
- **`scripts/test-consumer-fixture.sh`** is the only gate with **no npm script**,
  so it is invisible from `package.json` — run it by path. It packs the tarball,
  cold-installs it into `fixtures/consumer`, then runs `tsc --noEmit`,
  `vite build`, and asserts that an imported icon reaches the bundle, an
  unimported one does not (tree-shaking), and the compiled stylesheet shipped.
  Build `@nswds/ui` first. It is not redundant with `check:package`: that
  validates the package's _shape_, this exercises it as a consumer receives it.
  The fixture runs its OWN Tailwind build alongside our stylesheet (see
  `fixtures/consumer/src/app.css`), which is the only place the two-build
  cascade configuration is exercised end to end — Storybook and `apps/` consume
  `globals.css`, the dev entry, so they cannot reproduce it. It re-runs
  `check:cascade` against the combined stylesheet, having first located the CSS
  asset containing a marker from each half. The app-side marker has to be a
  class **we never emit** — every colliding utility in the fixture's markup is
  by definition one we emit too, so none of them can tell the halves apart — and
  the script re-verifies that against the installed stylesheet each run. Without
  both of those the check passes against our half alone, which is to say it
  silently stops testing anything.

Note that the job stops at its first failing step, so fixing one can reveal
another underneath — a green run is the only evidence that all of them pass.

### Node version — the engine floor

`.npmrc` sets `engine-strict=true`. That applies to **every installed package**,
not just the workspace ones: any dependency, however deep, whose `engines` field
excludes the running Node makes `npm ci` fail outright with `EBADENGINE` — it is
a hard error, not a warning.

So the effective floor is the strictest `engines` range anywhere in the tree,
which is **`^22.22.2 || >=24.15.0`** (set by `@nswds/tokens` and by
`@semantic-release/{changelog,git}`). Use `.nvmrc` (24.16.0) and this never
comes up. CI already does: `pr-checks.yml` and `chromatic.yml` read `.nvmrc`,
and `release.yml` pins 24.19.0.

Two rules follow, and they pull in opposite directions:

- **Root `package.json` `engines.node` must track that floor.** It is a promise
  about what `npm ci` accepts, and `engine-strict` makes a too-wide range a lie
  that fails at install time. It drifted once already: a transitive bump moved
  the floor while the root still advertised `^22.14.0 || >=24.10.0`, so Node
  22.14–22.22.1 and 24.10–24.14 were inside the declared range yet could not
  install.
- **`packages/ui` `engines.node` must NOT track it.** That is the _published_
  package, and none of the packages imposing the floor are runtime dependencies
  of it — `@nswds/tokens` is a devDependency whose values are inlined into
  `dist/styles.css` at build time. Consumers never install it, so raising the
  published floor would cut off consumer Node versions for no reason. The
  asymmetry with the root is deliberate.

When a dependency bump raises the floor, check it before assuming the root range
still holds. This lists everything in the lockfile that blocks a given Node
version — silence means the version is installable:

```bash
node -e 'const l=require("./package-lock.json"),s=require("semver"),v=process.argv[1];for(const[k,p]of Object.entries(l.packages))if(p.engines?.node&&!p.optional&&!s.satisfies(v,p.engines.node))console.log(k||"(root)","->",p.engines.node)' 22.22.2
```

Run it against both ends of the root range (`22.22.2` and `24.15.0`). The
`!p.optional` filter matters: platform-specific optional packages like
`@img/sharp-win32-ia32` declare ranges that exclude the running Node but are
never installed on this platform, so without it every run reports false
positives.

---

## 6. Publishing & Releases

### Commit convention → version bump

Conventional Commits drive the release. Allowed types (from `git-conventional-commits.yaml`):

| Commit type                                                                   | Release |
| ----------------------------------------------------------------------------- | ------- |
| `feat:`                                                                       | minor   |
| `fix:`, `perf:`, `revert:`                                                    | patch   |
| `BREAKING CHANGE` footer                                                      | major   |
| `docs:`, `style:`, `test:`, `build:`, `ops:`, `chore:`, `merge:`, `refactor:` | none    |

Use `npm run commit` (runs `scripts/git-commit.sh`) for interactive commit message building.

How the notes body is rendered from those commits — and the root
`conventional-changelog-conventionalcommits` pin that must not move to a v10, or every
release silently ships blank notes — is in
[docs/release-notes.md](docs/release-notes.md).

**Visual/token changes must ship a release.** Anything under `packages/ui/src/styles/**`
(theme tokens, the `globals.css`/`package.css` entries) changes what every consumer renders,
so it must carry a releasable type — `fix:` for a tweak, `feat:` for a new/retuned token, and a
`BREAKING CHANGE` footer for a token removal or a value change that alters rendered output. A
`style:`/`refactor:`/`chore:` change to these files ships to nobody (no release). The
`visual-change-release-guard` job in `pr-checks.yml` enforces this: a PR touching
`packages/ui/src/styles/**` with a non-releasable title type fails until retitled.

### What happens on push to `main`

`.github/workflows/release.yml` runs automatically:

1. Checks out full git history (`fetch-depth: 0`).
2. Sets up Node 22.14.0 and ensures npm ≥ 11.5.1 (required for Trusted Publishing OIDC).
3. Runs `npm ci`.
4. Builds `@nswds/ui` (`npm run build -w @nswds/ui`).
5. Runs `npm run release` (semantic-release):
   - Analyses commits since the last `@nswds/ui-v*` tag.
   - If a release is warranted: bumps version in `packages/ui/package.json`, writes `packages/ui/CHANGELOG.md`, regenerates `package-lock.json` (`npm install --package-lock-only` via `@semantic-release/exec`), publishes to npm via OIDC (no `NPM_TOKEN` needed — uses `id-token: write` permission), creates a GitHub release + tag (`@nswds/ui-vX.Y.Z`), commits the updated `packages/ui/package.json`, CHANGELOG, and `package-lock.json` back.
6. If a new tag was created: runs `npm run registry:build` and uploads the output as a GitHub Actions artifact (`shadcn-registry-<sha>`).

**The registry artifact is uploaded but NOT yet deployed.** See TODO below.

### npm Trusted Publishing (OIDC) — first-publish bootstrap

OIDC publishing requires the npm package to already exist. Before the first automated release:

1. Build: `npm run build -w @nswds/ui`
2. Publish once with a token: `cd packages/ui && npm publish --access public`
   (you need a classic npm token with publish rights for this one-time step)
3. On npmjs.com, go to `@nswds/ui` → "Publishing" → add a Trusted Publisher for this
   GitHub repo (owner/repo, workflow `release.yml`, optional environment name).
4. After that, all subsequent releases run tokenlessly via OIDC.

`.npmrc` sets `provenance=false` — npm provenance requires a PUBLIC source
repository; on this private repo it fails every publish with E422 (this
silently stranded v1.8.0–v2.1.0 as tags that never reached npm). Re-enable
only if the repo is made public.

### What is automated vs. manual

| Action                           | Where                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Version bump, changelog, git tag | Automated (CI semantic-release)                                                                           |
| npm publish                      | Automated (CI, OIDC — after bootstrap)                                                                    |
| GitHub release notes             | Automated (CI)                                                                                            |
| Registry JSON build              | Automated (CI, only on new release)                                                                       |
| Registry deployment              | Vercel Git integration — deploys only on release commits (`ignoreCommand` in `apps/registry/vercel.json`) |
| First npm publish (bootstrap)    | Manual, once                                                                                              |
| npm Trusted Publisher setup      | Manual, once                                                                                              |

---

## 7. Vercel Deployments

Three separate Vercel projects, each linked to `github.com/digitalnsw/nswds-ui`. Vercel
detects npm from `package-lock.json` and runs `npm install` from the git root regardless of
which project's Root Directory is set.

| Vercel project       | Root Directory   | URL purpose                    |
| -------------------- | ---------------- | ------------------------------ |
| `nswds-ui-web`       | `apps/web`       | Dev sandbox / design docs site |
| `nswds-ui-storybook` | `apps/storybook` | Component catalogue            |
| `nswds-ui-registry`  | `apps/registry`  | shadcn registry JSON endpoint  |

### Per-project settings

Each app has its own [`vercel.json`](apps/web/vercel.json) — Vercel reads this from the
Root Directory. Do not put a repo-root `vercel.json` (it would conflict with the registry
project which also uses the repo root for npm install).

**`apps/web`** — `apps/web/vercel.json`

```
Framework:        Next.js (auto-detected from apps/web/next.config.mjs)
Root Directory:   apps/web
Build Command:    npm run build -w @nswds/ui && next build
Output Directory: .next  (auto)
```

**`apps/storybook`** — `apps/storybook/vercel.json`

```
Framework:        None
Root Directory:   apps/storybook
Build Command:    npm run build -w @nswds/ui && npm run build  (runs storybook build)
Output Directory: storybook-static
```

Storybook resolves `@nswds/ui` directly from source via the tsconfig paths in
`apps/storybook/tsconfig.json`; the `@nswds/ui` pre-build in the Build Command
matches the current `vercel.json`.

**`apps/registry`** — `apps/registry/vercel.json`

```
Framework:        None
Root Directory:   apps/registry
Build Command:    npm run build -w @nswds/ui
                  && npm run registry:build -w @nswds/ui
                  && npm run build  (vite build)
Output Directory: dist
```

`registry:build` writes JSON to `apps/registry/public/r/`. Vite copies `public/` into
`dist/`, so the JSON is served at `<registry-url>/r/<component>.json`.

### Trigger behaviour

All three projects are Git-integrated. `nswds-ui-web` and `nswds-ui-storybook`
auto-deploy on every push to `main`.

The **registry** project is gated: `apps/registry/vercel.json` sets an `ignoreCommand`
that skips the build unless the latest commit is a semantic-release commit
(`chore(release): @nswds/ui …`). This keeps the deployed registry JSON in lockstep with
the npm release — the two distribution channels can't drift apart between releases.
(Note: this also skips registry preview deployments on PRs; the PR Checks workflow
verifies registry output freshness instead.)

---

## 8. Conventions & Guardrails

### Always

- Use **semantic tokens** in component classes (`bg-primary`, not `bg-blue-600`).
- Import from **`@base-ui/react/<primitive>`** for any interactive element.
- Use **`cva`** (class-variance-authority) for variant logic; export both the component and
  the `<name>Variants` function so consumers can extend styling.
- Use **`cn()` from `../lib/utils.js`** (relative import — not raw `clsx` or `twMerge`, not `@nswds/ui/lib/utils`).
- Write a **`.stories.tsx`** file alongside every new component.
- Run **`npm run registry:build`** and commit the regenerated `apps/registry/public/r/`
  JSON whenever component source, `registry.json`, or `components.json` change — the
  PR check fails on stale output.
- Follow **Conventional Commits** — the release pipeline depends on it.
- Keep all published code under the **`@nswds`** npm scope.

### Never

- **Never hand-roll ARIA, focus traps, keyboard handlers** — use the Base UI primitive that
  already implements the pattern (Button, Dialog, Select, Menu, etc.).
- **Never let `@/*` or `@nswds/ui/*` imports survive in `packages/ui/src/`** — use relative
  imports. The ESLint `no-restricted-imports` rule in `packages/ui/eslint.config.js` enforces this; the
  registry build script also throws if any `@nswds/ui/` strings leak into JSON output.
  `shadcn add` will generate `@/...` imports — convert them as part of the Radix → Base UI
  cleanup.
- **Never publish `@nswds/ui` manually** once OIDC is configured. All releases go through CI.
- **Never commit directly to `main`** — use PRs; the branch name validator runs on push.
- **Never add raw colour values** to component classes; all colours must trace back to a token.
- **Never put `.stories.tsx` in the tsup build** — tsup.config.ts already excludes them;
  don't add an explicit entry that overrides this.
- **Never change `exports` in `packages/ui/package.json`** without updating the corresponding
  `tsconfig.json` paths and verifying `registry:build` still passes.
- **Never widen root `engines.node` past the tree's real floor, and never raise
  `packages/ui`'s to match it.** With `engine-strict=true` the root range is a promise
  `npm ci` enforces, while `packages/ui`'s range is a constraint on consumers who never
  install the packages setting that floor. See §5 "Node version — the engine floor".

---

## 9. TODOs / Known Gaps

| #   | Issue                                                    | Where                                                                                       |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | ~~`fill-nsw-blue-800` / `fill-nsw-red-600` not defined~~ | Fixed — `@nswds/tokens` imported                                                            |
| 2   | ~~Registry not deployed~~                                | Fixed — Vercel project `nswds-ui-registry` deploys from `apps/registry`                     |
| 3   | ~~`.npmrc` provenance~~                                  | Reversed — provenance requires a public repo; `provenance=false` with rationale in `.npmrc` |
| 4   | ~~First npm publish (bootstrap) not yet done~~           | Fixed — v1.2.0 published via OIDC on 2026-05-24                                             |
| 5   | ~~`shadcn` listed as runtime dependency~~                | Fixed — moved to `devDependencies`                                                          |
| 6   | ~~`zod` listed as runtime dependency but unused~~        | Fixed — removed (no imports found)                                                          |
| 7   | ~~No primitive token layer~~                             | Fixed — `@nswds/tokens` provides the full primitive → semantic hierarchy                    |
| 8   | `apps/web` has no content (`page.tsx` returns null)      | Expected; it's a dev sandbox                                                                |

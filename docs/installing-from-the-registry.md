# Installing NSWDS components from the registry

The `@nswds/ui` components are distributed through a [shadcn](https://ui.shadcn.com/) registry
served at **https://ui.digital.nsw.gov.au/registry**. This guide covers installing them into
_your own_ project with the `shadcn` CLI.

> Prefer the npm package? If you don't need the source copied into your repo, you can instead
> `npm install @nswds/ui` and import compiled components and CSS directly. See
> [the npm channel](#alternative-the-npm-package) at the bottom. The rest of this guide is the
> **registry / copy-source** channel.

---

## 1. Prerequisites

Your project must already be a shadcn project (it needs a `components.json` and a Tailwind v4
setup). If it isn't:

```bash
npx shadcn@latest init
```

---

## 2. Add the `@nswds` namespace (one-time)

Add a `registries` entry to your project's **`components.json`** so the CLI knows where
`@nswds/*` resolves to:

```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  // ...your existing config...
  "registries": {
    "@nswds": "https://ui.digital.nsw.gov.au/registry/r/{name}.json",
  },
}
```

The `{name}` placeholder is required — the CLI substitutes the component name into it. With this
in place, `@nswds/button` resolves to `https://ui.digital.nsw.gov.au/registry/r/button.json`.

The registry is public, so no token or auth headers are needed.

> The registry base above is maintained in one place. Maintainers set `REGISTRY_LOCATION` in
> `.env` and run `npm run registry:sync`, which propagates it to `registry.config.json` (the
> committed source of truth), the generated registry JSON, these docs, the web app's `/registry`
> proxy, and the release drift audit together. Consumers should use whatever base is published here.

---

## 3. Install components

With the namespace configured, use the short form:

```bash
npx shadcn@latest add @nswds/button
```

Install several at once:

```bash
npx shadcn@latest add @nswds/button @nswds/link @nswds/badge
```

### Available components

The registry serves **78 items**: 62 components, 2 icon items, 12 blocks, 1 hook, and the
`theme` foundation that every one of them depends on.

The complete list — with each item's exports and a one-line description — is in the
[component reference](reference-components.md#the-catalogue). A few worth knowing by name:

| Namespace ref                                                                 | Installs                                                                    |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `@nswds/button` · `@nswds/link` · `@nswds/badge` · `@nswds/card`              | The everyday primitives                                                     |
| `@nswds/field` · `@nswds/input` · `@nswds/label` · `@nswds/select`            | Form building blocks                                                        |
| `@nswds/masthead` · `@nswds/header` · `@nswds/footer` · `@nswds/skip-link`    | NSW page chrome                                                             |
| `@nswds/main-nav` · `@nswds/side-nav` · `@nswds/tab-nav` · `@nswds/push-menu` | Navigation                                                                  |
| `@nswds/icons`                                                                | Curated icon subset used by the shipped components                          |
| `@nswds/icon-brands`                                                          | The six social brand marks for the footer                                   |
| `@nswds/theme`                                                                | Semantic token CSS variables — installed automatically with every component |
| `@nswds/login-form` · `@nswds/footer-sitemap` · `@nswds/mobile-nav`           | Blocks (worked examples)                                                    |

> **Blocks are registry-only.** They are copy-and-adapt starting points you own, deliberately not
> exported from the npm package.

> Without the namespace configured, the same installs work with the full URL, e.g.
> `npx shadcn@latest add https://ui.digital.nsw.gov.au/registry/r/button.json`.

The CLI writes the component source into your project (per your `components.json` aliases) and
installs each component's runtime dependencies (`@base-ui/react`, `class-variance-authority`,
`clsx`, `tailwind-merge`).

---

## 4. Finish the token wiring

Every component depends on the `@nswds/theme` registry item, so `shadcn add` automatically:

- installs the [`@nswds/tokens`](https://www.npmjs.com/package/@nswds/tokens) npm package, and
- writes the semantic CSS variables (`--primary`, `--background`, `--border`, …) into your
  Tailwind entry CSS.

One step remains manual. Those semantic variables are only a _mapping_ — they point at the NSW
palette and role tokens, which ship as plain CSS in `@nswds/tokens`. Add these imports to your
Tailwind entry CSS (the file containing `@import "tailwindcss";`), **after** the Tailwind import:

```css
@import '@nswds/tokens/tailwind/preset.css';
@import '@nswds/tokens/css/colors/global/oklch.css';
@import '@nswds/tokens/css/colors/semantic/oklch.css';
@import '@nswds/tokens/css/colors/semantic/oklch.dark.css';
@import '@nswds/tokens/css/colors/themes/masterbrand/oklch.css';
@import '@nswds/tokens/tailwind/colors/themes/masterbrand/oklch.css';
```

The CLI prints this same list after installing the theme item.

What each line does:

- **`preset.css`** wires every token category — colour, radius, spacing, typography, motion,
  shadow, border, z-index — into Tailwind in one import.
- **The `css/colors/*` lines** supply the raw values. Keep them **after** `preset.css`: preset
  bundles hex values, and these re-assert the palette as oklch, which is the project standard.
- **`semantic/oklch.dark.css`** is the dark half. See [dark mode](#dark-mode) below — this line is
  easy to skip and its absence is silent.
- **The masterbrand lines** add the brand theme (`--primary-*` → NSW blue, `--accent-*` → NSW red),
  which `preset.css` deliberately excludes. The Tailwind one is load-bearing, not decorative:
  `Button`'s primary colour compiles to `var(--color-primary-800)`, and that bridge is the only
  thing that defines it. Omit the line and your buttons render transparent.

If you skip this section the components render, but every colour falls back to unstyled or
transparent — `bg-primary` resolves to nothing.

The source of truth for the full token foundation is
[`packages/ui/src/styles/theme.css`](../packages/ui/src/styles/theme.css); the layering is
explained in the [token reference](reference-tokens.md).

### Dark mode

Toggle `class="dark"` **or** `data-theme="dark"` on a root element (for example with
[`next-themes`](https://github.com/pacocoursey/next-themes)):

```tsx
<html lang='en' className='dark'>
```

**There is no separate dark variable block to write, and none is generated for you.** The
semantic variables the theme item writes map onto `@nswds/tokens` _role_ tokens, which are
themselves mode-aware — the light values come from `semantic/oklch.css` and the dark values from
`semantic/oklch.dark.css`, scoped `[data-theme='dark'], .dark`. Dark mode happens one layer below
the variables you can see.

Which means: **omit the `oklch.dark.css` import above and dark mode silently does nothing.**
Backgrounds and text both stay light, no error is raised, and the `.dark` class appears to be
ignored. If dark mode isn't working, check that import first.

Order matters here too. `:root` and `[data-theme='dark'], .dark` have identical specificity, so
the dark import must come **after** the light one — as listed above.

**Put the marker on the root element, not a wrapper `<div>`.** The semantic variables are declared
on `:root` in terms of role tokens (`--primary: var(--action-default)`), and a `var()` is
substituted where it is _declared_. On `<html>` the dark override lands on the same element and
everything follows. On a nested wrapper you change the role token too late — `dark:` utilities flip
but the semantic colours stay light, which reads as a half-applied theme with no error.

## 5. Verify

```tsx
import { Button } from '@/components/button'

export default function Demo() {
  return <Button>NSW button</Button>
}
```

If the button renders with a solid NSW-blue background, the tokens are wired correctly. If it's
transparent/unstyled, step 4 is incomplete — confirm `@nswds/tokens` is installed and the CSS
above is imported by the stylesheet Tailwind actually compiles.

---

## Alternative: the npm package

If you don't need the source copied into your repo, consume the compiled package instead — the
tokens come bundled, so there's no step 4:

```bash
npm install @nswds/ui @nswds/tokens
```

```tsx
import '@nswds/ui/styles.css' // ships the full token foundation + component styles
import { Button } from '@nswds/ui'
```

Trade-off: you get versioned, upgradeable components but cannot edit their source. The registry
channel above is for teams that want the source in-repo to adapt.

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

| Namespace ref              | Installs                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `@nswds/button`            | Button                                                                                    |
| `@nswds/badge`             | Badge                                                                                     |
| `@nswds/card`              | Card                                                                                      |
| `@nswds/field`             | Form field layout primitives                                                              |
| `@nswds/input`             | Input                                                                                     |
| `@nswds/label`             | Label                                                                                     |
| `@nswds/link`              | Link                                                                                      |
| `@nswds/logo`              | NSW logo                                                                                  |
| `@nswds/icons`             | Curated icon subset (the full set ships per-icon in the npm package: `@nswds/ui/icons`)   |
| `@nswds/separator`         | Separator                                                                                 |
| `@nswds/spinner`           | Spinner                                                                                   |
| `@nswds/labeled-separator` | Labeled separator                                                                         |
| `@nswds/theme`             | Semantic token CSS variables (installed automatically as a dependency of every component) |

> Without the namespace configured, the same installs work with the full URL, e.g.
> `npx shadcn@latest add https://ui.digital.nsw.gov.au/registry/r/button.json`.

The CLI writes the component source into your project (per your `components.json` aliases) and
installs each component's runtime dependencies (`@base-ui/react`, `class-variance-authority`,
`clsx`, `tailwind-merge`).

---

## 4. Finish the token wiring

Every component depends on the `@nswds/theme` registry item, so `shadcn add` automatically:

- installs the [`@nswds/tokens`](https://www.npmjs.com/package/@nswds/tokens) npm package, and
- writes the semantic CSS variables (`--primary`, `--background`, `--border`, … for `:root` and
  `.dark`) into your Tailwind entry CSS.

One step remains manual — the semantic variables reference the NSW palette
(`--primary-800`, `--grey-*`, `--danger-*`), which ships as plain CSS in `@nswds/tokens`. Add
these imports to your Tailwind entry CSS (the file with `@import "tailwindcss";`), after the
Tailwind import:

```css
@import '@nswds/tokens/css/colors/global/oklch.css';
@import '@nswds/tokens/css/colors/semantic/oklch.css';
@import '@nswds/tokens/css/colors/themes/masterbrand/oklch.css';
@import '@nswds/tokens/tailwind/colors/global/oklch.css';
@import '@nswds/tokens/tailwind/colors/themes/masterbrand/oklch.css';
@import '@nswds/tokens/tailwind/colors/semantic/oklch.css';
```

(The CLI prints this reminder after installing the theme item.)

If you skip this, the components render but every colour falls back to unstyled / transparent —
`bg-primary` resolves to nothing. The source of truth for the full token foundation is
[`packages/ui/src/styles/globals.css`](../packages/ui/src/styles/globals.css).

### Dark mode

Toggle the `.dark` class on a root element (e.g. with
[`next-themes`](https://github.com/pacocoursey/next-themes)). The `.dark` block above remaps the
same semantic tokens to their dark values.

---

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

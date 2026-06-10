# Installing NSWDS components from the registry

The `@nswds/ui` components are distributed through a [shadcn](https://ui.shadcn.com/) registry
served at **https://ui.digital.nsw.gov.au/registry**. This guide covers installing them into
*your own* project with the `shadcn` CLI.

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
    "@nswds": "https://ui.digital.nsw.gov.au/registry/r/{name}.json"
  }
}
```

The `{name}` placeholder is required — the CLI substitutes the component name into it. With this
in place, `@nswds/button` resolves to `https://ui.digital.nsw.gov.au/registry/r/button.json`.

The registry is public, so no token or auth headers are needed.

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

| Namespace ref | Installs |
|---|---|
| `@nswds/button` | Button |
| `@nswds/badge` | Badge |
| `@nswds/link` | Link |
| `@nswds/logo` | NSW logo |
| `@nswds/icons` | Icon set |
| `@nswds/spinner` | Spinner |
| `@nswds/description-list` | Description list |
| `@nswds/labeled-separator` | Labeled separator |

> Without the namespace configured, the same installs work with the full URL, e.g.
> `npx shadcn@latest add https://ui.digital.nsw.gov.au/registry/r/button.json`.

The CLI writes the component source into your project (per your `components.json` aliases) and
installs each component's runtime dependencies (`@base-ui/react`, `class-variance-authority`,
`clsx`, `tailwind-merge`).

---

## 4. ⚠️ Required: install the design tokens

**This is the step people miss.** `shadcn add` copies the component source but **not** the CSS
token layers the components depend on. Every NSWDS component styles itself with *semantic* tokens
(`bg-primary`, `text-foreground`, `border-border`, `bg-destructive`, …). Those semantic tokens are
in turn defined in terms of the NSW palette shipped by [`@nswds/tokens`](https://www.npmjs.com/package/@nswds/tokens)
(`--primary-*`, `--grey-*`, `--danger-*`).

If you skip this, the components render but every colour falls back to unstyled / transparent —
`bg-primary` resolves to nothing.

### 4a. Install the token package

```bash
npm install @nswds/tokens
```

### 4b. Add the token layers to your global stylesheet

Paste the following into your Tailwind entry CSS (the file with `@import "tailwindcss";` — often
`globals.css` or `app.css`), after the Tailwind import. This is the same token foundation NSWDS
uses internally; the source of truth is
[`packages/ui/src/styles/globals.css`](../packages/ui/src/styles/globals.css).

```css
/* --- NSW primitive palette + Tailwind bridges (from @nswds/tokens) --- */
@import "@nswds/tokens/css/colors/global/oklch.css";
@import "@nswds/tokens/css/colors/semantic/oklch.css";
@import "@nswds/tokens/css/colors/themes/masterbrand/oklch.css";
@import "@nswds/tokens/tailwind/colors/global/oklch.css";
@import "@nswds/tokens/tailwind/colors/themes/masterbrand/oklch.css";
@import "@nswds/tokens/tailwind/colors/semantic/oklch.css";

@custom-variant dark (&:is(.dark *));

/* --- Map shadcn semantic tokens onto the NSW palette --- */
:root {
  --background: var(--grey-50);
  --foreground: var(--grey-800);
  --card: var(--grey-50);
  --card-foreground: var(--grey-800);
  --popover: var(--grey-50);
  --popover-foreground: var(--grey-800);
  --primary: var(--primary-600);
  --primary-foreground: var(--primary-50);
  --secondary: var(--grey-100);
  --secondary-foreground: var(--grey-800);
  --muted: var(--grey-100);
  --muted-foreground: var(--grey-550);
  --accent: var(--grey-100);
  --accent-foreground: var(--grey-800);
  --destructive: var(--danger-500);
  --border: var(--grey-250);
  --input: var(--grey-250);
  --ring: var(--grey-450);
  --radius: 0.45rem;
}

.dark {
  --background: var(--grey-950);
  --foreground: var(--grey-50);
  --card: var(--grey-850);
  --card-foreground: var(--grey-50);
  --popover: var(--grey-850);
  --popover-foreground: var(--grey-50);
  --primary: var(--primary-700);
  --primary-foreground: var(--primary-50);
  --secondary: var(--grey-800);
  --secondary-foreground: var(--grey-50);
  --muted: var(--grey-800);
  --muted-foreground: var(--grey-450);
  --accent: var(--grey-800);
  --accent-foreground: var(--grey-50);
  --destructive: var(--danger-350);
  --border: var(--grey-800);
  --input: var(--grey-750);
  --ring: var(--grey-550);
}

/* --- Expose the semantic tokens as Tailwind utilities (bg-primary, text-foreground, …) --- */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}
```

> This is a trimmed foundation covering what the current components use. NSWDS's full token set
> (sidebar, chart, heading-font tokens) lives in
> [`packages/ui/src/styles/globals.css`](../packages/ui/src/styles/globals.css) — copy from there
> if you add components that need them.

### 4c. Dark mode

Toggle the `.dark` class on a root element (e.g. with
[`next-themes`](https://github.com/pacocoursey/next-themes)). The `.dark` block above remaps the
same semantic tokens to their dark values.

---

## 5. Verify

```tsx
import { Button } from "@/components/button"

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
import "@nswds/ui/globals.css"   // ships the full token foundation + component styles
import { Button } from "@nswds/ui"
```

Trade-off: you get versioned, upgradeable components but cannot edit their source. The registry
channel above is for teams that want the source in-repo to adapt.

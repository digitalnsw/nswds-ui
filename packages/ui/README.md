# @nswds/ui

Reusable design system components for NSW Government digital products. Accessible, headless-first React components built on [Base UI](https://base-ui.com/) primitives and styled with NSW design tokens from [`@nswds/tokens`](https://www.npmjs.com/package/@nswds/tokens).

## Installation

```bash
npm install @nswds/ui
```

Requires React 19. The package is ESM-only and ships compiled JavaScript, TypeScript types, and a precompiled stylesheet — it needs no Tailwind setup and no separate `@nswds/tokens` install. `@nswds/ui/styles.css` already has the token values inlined; `@nswds/tokens` is a build-time dependency only.

> The **registry** channel is different: because it copies editable source (which references the raw token CSS) rather than the precompiled stylesheet, it _does_ install `@nswds/tokens`. See the [registry installation guide](https://github.com/digitalnsw/nswds-ui/blob/main/docs/installing-from-the-registry.md).

## Usage

Import the stylesheet once at your app's entry point, then use the components:

```tsx
import '@nswds/ui/styles.css'

import { Button } from '@nswds/ui'

export default function Demo() {
  return <Button color='primary'>NSW button</Button>
}
```

`@nswds/ui/styles.css` ships the full token foundation (NSW palette, masterbrand theme, semantic tokens) plus all component styles, so components render correctly with no extra wiring.

### Using it with your own Tailwind build

Most apps import this stylesheet _and_ run Tailwind over their own markup. That gives you two independently-sorted sets of utilities in the same `utilities` cascade layer, so **import ours first**:

```css
@import '@nswds/ui/styles.css';
@import 'tailwindcss';
```

Order matters because a media query adds no specificity. Within one Tailwind build the sorter guarantees `.lg\:justify-start` is emitted after `.justify-center`; across two builds nothing does, so whichever half comes last wins any tie. Importing ours first means your utilities always win a tie, which is what you want: a class you wrote should beat one you didn't.

Reverse the order and the same mechanism works against you — our plain `.inline-flex` (Button's base) would outrank your `hidden sm:inline-flex`, showing a button you meant to hide on mobile.

Our components no longer depend on that tiebreak. Where a component needs a responsive override it uses mutually exclusive variants (`max-lg:justify-center lg:justify-start`) rather than a bare utility plus an override of it, so no rule you emit can displace one of ours on an element you never referenced. This is enforced on every build — see `scripts/check-cascade-safety.mjs`.

If you do hit a conflict, a call-site override outranks both halves:

```tsx
<Footer className='[&_[data-slot=footer-legal-links]]:lg:justify-start' />
```

> **Don't import this stylesheet into a named cascade layer.** `@import '@nswds/ui/styles.css' layer(nswds)` looks like a tidy way to pin the order, but it also layers the `:root` and `[data-theme=dark], .dark` token blocks the file carries. Layered custom properties lose to any unlayered `:root` — including the one `@nswds/tokens` ships — and your theme will resolve to the wrong values.

### Icons

Icons are tree-shakeable from the barrel, or importable individually:

```tsx
import { IconSearch } from '@nswds/ui/icons'
import { IconAdd } from '@nswds/ui/icons/add'

export function Toolbar() {
  return (
    <>
      <Button leadingVisual={IconSearch}>Search</Button>
      <Button leadingVisual={IconAdd}>Add</Button>
    </>
  )
}
```

### Dark mode

Toggle the `dark` class on a root element (for example with [`next-themes`](https://github.com/pacocoursey/next-themes)). The semantic tokens remap automatically.

## Components

Badge, Button, ButtonLink, Card, DescriptionList, Field, Input, Label, LabeledSeparator, Link, Logo (NSW Government logo), Separator, Spinner — plus the icon set under `@nswds/ui/icons`.

Every interactive component wraps a Base UI primitive, which provides focus management, keyboard navigation, and ARIA semantics. Each component also exports its `cva` variants function (for example `buttonVariants`) so you can extend styling.

## Theming

Every visual property traces back to a CSS custom property token. Components reference semantic tokens (`--primary`, `--background`, `--border`, …), which resolve through the NSW masterbrand theme to the NSW primitive palette. To re-brand, override the semantic tokens in a scoped selector and toggle that class on your root element.

## Prefer the source in your repo?

The same components are distributed through a [shadcn](https://ui.shadcn.com/) registry at **https://nswds-ui-registry.vercel.app**, which copies the component source directly into your project for teams that want to adapt it:

```bash
npx shadcn@latest add https://nswds-ui-registry.vercel.app/r/button.json
```

The npm package gives you versioned, upgradeable components; the registry gives you editable source. See the [registry installation guide](https://github.com/digitalnsw/nswds-ui/blob/main/docs/installing-from-the-registry.md) for the full setup, including the one-time `@nswds` namespace configuration.

## License

[MIT](https://github.com/digitalnsw/nswds-ui/blob/main/LICENSE)

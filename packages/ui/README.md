# @nswds/ui

Reusable design system components for NSW Government digital products. Accessible, headless-first React components built on [Base UI](https://base-ui.com/) primitives and styled with NSW design tokens from [`@nswds/tokens`](https://www.npmjs.com/package/@nswds/tokens).

## Installation

```bash
npm install @nswds/ui @nswds/tokens
```

Requires React 19. The package is ESM-only and ships compiled JavaScript, TypeScript types, and a precompiled stylesheet — no Tailwind setup is required to use it.

## Usage

Import the stylesheet once at your app's entry point, then use the components:

```tsx
import '@nswds/ui/styles.css'

import { Button } from '@nswds/ui'

export default function Demo() {
  return <Button color="primary">NSW button</Button>
}
```

`@nswds/ui/styles.css` ships the full token foundation (NSW palette, masterbrand theme, semantic tokens) plus all component styles, so components render correctly with no extra wiring.

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

# Migrating from @nswds/ui 1.x to 2.0

2.0 is an API-surface release: no component changed its visual design, but
several import paths and prop shapes did. Registry (copy-source) consumers are
unaffected unless they re-add components — installed copies keep working.

## Quick reference

| 1.x                                                                   | 2.0                                                                                        |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Icons.arrow_forward` (from `@nswds/ui`)                              | `import { IconArrowForward } from '@nswds/ui/icons'`                                       |
| `import { Icons, type IconName } from '@nswds/ui'`                    | Removed — import icons by name from `@nswds/ui/icons` (or `@nswds/ui/icons/arrow-forward`) |
| `<Button href="…">`                                                   | `<ButtonLink href="…">`                                                                    |
| `<BadgeButton href="…">`                                              | `<BadgeLink href="…">`                                                                     |
| `import '@nswds/ui/globals.css'`                                      | `import '@nswds/ui/styles.css'`                                                            |
| `import { cn } from '@nswds/ui/lib/utils'`                            | `import { cn } from '@nswds/ui'`                                                           |
| `truncate` / `kebabCase` / `camelCase` / `humaniseVariant`            | Removed (internal tooling; copy them if you relied on them)                                |
| `generateColorThemes`, `buildThemeVars`, `colorThemes`, palette types | Removed — Storybook docs tooling, no longer public API                                     |
| `<Spinner className="…">` styles the **svg**                          | `className` styles the outer `role="status"` span; use `svgClassName` for the svg          |
| Spinner is silent for screen readers                                  | Announces `"Loading"` by default — pass `label=""` to suppress, or your own label          |
| `Button` ref: `HTMLElement`                                           | `HTMLButtonElement` (`ButtonLink`: `HTMLAnchorElement`)                                    |
| `Button` blocks Base UI's `render` prop                               | `render` is supported for composition                                                      |

## Details

### Icons are per-module and tree-shakable

The 1.x `Icons` object bundled all ~3,900 Material Symbols (~3 MB) into any
app that referenced a single icon. 2.0 ships one module per icon:

```tsx
// 1.x
import { Icons } from '@nswds/ui'
;<Icons.search />

// 2.0
import { IconSearch } from '@nswds/ui/icons'
;<IconSearch />
```

Name mapping: snake_case key → PascalCase with an `Icon` prefix
(`arrow_forward` → `IconArrowForward`, `_10k` → `Icon10k`). Your bundle now
contains only the icons you import.

### Button-styled navigation

`Button`/`BadgeButton` no longer switch element type on an `href` prop — the
union typing made TS errors unreadable and hid Base UI's `render` escape
hatch. Use the dedicated link components, which render through `Link` and
pick up your `LinkProvider` framework link (e.g. next/link):

```tsx
<ButtonLink href="/docs" variant="outline">View documentation</ButtonLink>
<BadgeLink href="/tags/x" color="accent">x</BadgeLink>
```

### Spinner accessibility

`Spinner` now has an accessible name by default. If a parent already conveys
the busy state (like `Button loading` does internally), suppress it with
`label=""`. `Button` additionally sets `aria-busy` while loading.

### DescriptionList class overrides

`DescriptionList` / `DescriptionTerm` / `DescriptionDetails` previously
resolved Tailwind class conflicts in favour of their _base_ styles (the
opposite of every other component). Consumer `className` now wins; audit any
description lists that relied on overrides being ignored.

### CSS entry point

`@nswds/ui/globals.css` was an alias of the compiled stylesheet that shared a
name with the (different) source file. The single CSS export is now:

```tsx
import '@nswds/ui/styles.css'
```

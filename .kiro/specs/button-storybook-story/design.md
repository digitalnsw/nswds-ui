# Design Document — Button Storybook Stories

## Overview

This design covers the full story suite for the `Button` component in `@nswds/ui`. The goal is a structured, navigable Storybook catalogue that serves three audiences simultaneously:

- **Designers** doing visual QA across variants, colours, sizes, and dark mode.
- **Developers** looking for copy-paste usage examples (link button, block button, icon button).
- **CI / QA engineers** running automated interaction tests and accessibility scans.

The existing `button.stories.tsx` already contains the `Default` and `Playground` stories plus the shared constants and helpers. The work here extends that file and adds three companion sub-group files. No changes to `button.tsx` itself are required.

### Key constraints

- Storybook 10 (`@storybook/react-vite` `10.5.0-alpha.2`) with `addon-a11y`, `addon-themes`, `addon-vitest`.
- Stories are picked up by the glob `packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)` in `apps/storybook/.storybook/main.ts`.
- Story files are excluded from the tsup build by the `name.endsWith('.stories.tsx')` guard in `tsup.config.ts` — no action needed.
- The `Button` component renders as a `<button>` (via Headless UI) when no `href` is given, and as an `<a>` (via the internal `Link` component) when `href` is present.
- `data-variant` is set on the root element in both render paths, enabling attribute assertions in play functions.

---

## Architecture

### File structure

```
packages/ui/src/components/
├── button.tsx                        ← component source (unchanged)
├── button.stories.tsx                ← Root: Components/Button  (Default, Playground)
├── button.features.stories.tsx       ← Sub-group: Components/Button/Features
├── button.examples.stories.tsx       ← Sub-group: Components/Button/Examples
└── button.tests.stories.tsx          ← Sub-group: Components/Button/Tests
```

### Sidebar hierarchy

| File | Storybook title | Stories |
|---|---|---|
| `button.stories.tsx` | `Components/Button` | Default, Playground |
| `button.features.stories.tsx` | `Components/Button/Features` | AllVariants, AllColors, AllSizes, AllStates, DarkMode |
| `button.examples.stories.tsx` | `Components/Button/Examples` | AsLink, BlockButton, IconButton |
| `button.tests.stories.tsx` | `Components/Button/Tests` | CssCheck, AccessibilityCheck |

The `/`-delimited title is the only mechanism Storybook 10 uses to create sidebar folders — no additional configuration is needed.

### Dependency graph

```
button.features.stories.tsx ──┐
button.examples.stories.tsx ──┤──► button.tsx  (via @nswds/ui or relative ./button.js)
button.tests.stories.tsx    ──┘
button.stories.tsx          ──┘
```

Sub-story files do **not** import from `button.stories.tsx`. Each file is self-contained: it imports `Button` directly and declares its own `Meta` with a narrower `title`. This avoids circular imports and keeps each file independently compilable.

---

## Components and Interfaces

### Shared constants (defined once in `button.stories.tsx`, re-exported)

```ts
export const variants = ['solid', 'soft', 'surface', 'outline', 'ghost', 'link'] as const
export const colors = [
  'primary/grey', 'light', 'primary/white', 'white', 'grey',
  'primary', 'secondary', 'tertiary', 'accent', 'danger',
] as const
export const sizes    = ['sm', 'default', 'lg', 'icon'] as const
export const iconSizes = ['sm', 'default', 'lg', 'xl'] as const
```

These are typed `as const` tuples so they can be used both as `options` arrays in `argTypes` and as iteration sources in render functions. Sub-story files import them from `./button.stories.js` (the compiled path) or, during Storybook dev, from the relative source path `./button.stories.js` — Storybook resolves `.js` extensions to `.tsx` via its Vite config.

> **Decision:** exporting constants from the root story file rather than a separate `button.stories.constants.ts` keeps the number of files minimal and matches the pattern already established in the existing `button.stories.tsx`.

### Import strategy per file

#### `button.stories.tsx` (root)

```ts
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './button.js'
```

- `Meta` / `StoryObj` come from `@storybook/react-vite` (the framework package, already used in the existing file).
- `fn` comes from `storybook/test` (the Storybook 10 test utilities barrel — **not** `@storybook/test`).
- Play-function assertions use plain `throw new Error(…)` — no `expect` import needed for the simple attribute checks in this file.

#### `button.features.stories.tsx`, `button.examples.stories.tsx`, `button.tests.stories.tsx`

```ts
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Button } from './button.js'
import { variants, colors, sizes } from './button.stories.js'
```

- `expect` and `within` from `storybook/test` are used for the richer assertions in play functions (attribute checks, element counts, accessible name checks).
- `within` scopes queries to `canvasElement` to avoid false positives from Storybook's own UI chrome.

### Play function helpers

Defined in `button.stories.tsx` and **exported** so sub-story files can import them:

```ts
/** Find a button or anchor by text content or aria-label. Throws if absent. */
export function getButton(canvasElement: HTMLElement, name: string): HTMLElement {
  const el = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('button, a[href]')
  ).find(
    (el) => el.textContent?.trim() === name || el.getAttribute('aria-label') === name
  )
  if (!el) throw new Error(`Could not find button/anchor named "${name}".`)
  return el
}

/** Assert an attribute value. Throws with a descriptive message on mismatch. */
export function expectAttribute(
  element: Element,
  name: string,
  expectedValue: string
): void {
  const received = element.getAttribute(name)
  if (received !== expectedValue)
    throw new Error(`Expected ${name}="${expectedValue}", got "${received}".`)
}
```

The existing `button.stories.tsx` already defines these as unexported helpers. The design calls for making them exported so sub-story files can reuse them without duplication.

### Meta shape — root file (`button.stories.tsx`)

```ts
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
  },
  args: { /* sensible defaults for all controls */ },
  argTypes: { /* see Requirement 2 — full argTypes table below */ },
} satisfies Meta<typeof Button>

export default meta
```

### Meta shape — sub-story files

Sub-story files declare a **minimal Meta** — just `title` and `component`. They do **not** re-declare `argTypes` or `parameters.controls`. This is intentional: the Controls panel in sub-story files will be empty/minimal, which is fine because those stories are matrix/test stories, not interactive playgrounds.

```ts
const meta = {
  title: 'Components/Button/Features',   // or /Examples, /Tests
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
```

---

## Data Models

### ArgTypes table (Requirement 2)

| Prop | Control | Category | Notes |
|---|---|---|---|
| `children` | `text` | Content | Button label |
| `href` | `text` | Behavior | Triggers anchor render |
| `disabled` | `boolean` | Behavior | |
| `loading` | `boolean` | Behavior | Also sets `disabled` on the element |
| `variant` | `inline-radio` | Appearance | Options: `variants` constant |
| `color` | `select` | Appearance | Options: `colors` constant |
| `size` | `inline-radio` | Appearance | Options: `sizes` constant |
| `iconSize` | `inline-radio` | Appearance | Options: `iconSizes` constant |
| `block` | `boolean` | Appearance | |
| `alignContent` | `inline-radio` | Appearance | Options: `['center', 'start']` |
| `onClick` | *(action)* | Events | Wired via `fn()` in `args` |
| `aria-label` | `text` | Accessibility | |
| `className` | `table.disable: true` | *(hidden)* | Not exposed in Controls |

### Story args defaults (root Meta)

```ts
args: {
  children: 'Continue',
  variant: 'solid',
  color: 'primary',
  size: 'default',
  iconSize: 'default',
  disabled: false,
  loading: false,
  block: false,
  alignContent: 'center',
  onClick: fn(),
}
```

### Story-by-story specification

#### `button.stories.tsx`

**Default**
- `args`: `{ children: 'Continue', variant: 'solid' }`
- `play`: locate button by text `'Continue'`; assert `data-variant="solid"`.

**Playground**
- `render`: wraps `<Button {...args}>{args.children}</Button>` in `<div className="w-full max-w-xl rounded-sm border border-border bg-background p-6">`.
- `parameters.controls.expanded: false` (compact panel).
- No play function.

#### `button.features.stories.tsx`

**AllVariants**
- `render`: flex row (`flex flex-wrap gap-4 items-center`), one `<Button>` per entry in `variants`, all with `color="primary"` and `size="default"`. Label = variant name.
- `play`: assert `canvasElement.querySelectorAll('button, a[href]').length === variants.length` (6).

**AllColors**
- `render`: flex row (`flex flex-wrap gap-4 items-center`), one `<Button>` per entry in `colors`, all with `variant="solid"`. Label = color name.
- `play`: assert button count equals `colors.length` (10).

**AllSizes**
- `render`: flex row (`flex flex-wrap gap-4 items-end`), one `<Button>` per entry in `sizes`. `sm`/`default`/`lg` labelled with size name; `icon` size gets `aria-label="Icon button"` and an inline SVG child (a simple `<svg>` with a placeholder path — no external icon dependency).
- `play`: assert 4 elements present; throw with descriptive message if any size is missing.

**AllStates**
- `render`: flex row (`flex flex-wrap gap-4 items-center`), five buttons:
  1. Default — `children="Default"`
  2. Disabled — `disabled={true}`, `children="Disabled"`
  3. Loading — `loading={true}`, `children="Loading"`
  4. Block — `block={true}`, `children="Block"`, wrapped in a `<div className="w-full max-w-xs">` so the block behaviour is visible
  5. Link — `href="#"`, `children="Link"`
- `play`:
  - `within(canvasElement).getByText('Disabled')` → assert `disabled` attribute present.
  - `within(canvasElement).getByText('Loading')` → assert `disabled` attribute present (because `loading` sets `effectiveDisabled`).
  - Query `canvasElement.querySelector('a[href]')` → assert it is not null.

**DarkMode**
- `parameters.themes.themeOverride: 'dark'`
- `render`: `<div className="bg-background p-6 rounded-sm flex flex-wrap gap-4 items-center">`, one `<Button>` per variant, `color="primary"`.
- No play function (visual-only story).

#### `button.examples.stories.tsx`

**AsLink**
- `args`: `{ href: '#', children: 'Go to page', variant: 'solid', color: 'primary' }`
- `play`:
  - `const anchor = canvasElement.querySelector('a')` — assert not null.
  - Assert `anchor.getAttribute('href')` is not null/empty.

**BlockButton**
- `render`: `<div className="max-w-sm"><Button {...args} block>{args.children}</Button></div>`
- `args`: `{ children: 'Submit form', variant: 'solid', color: 'primary' }`
- `play`: locate button; assert it has class `w-full`.

**IconButton**
- `args`: `{ size: 'icon', 'aria-label': 'Settings', variant: 'solid', color: 'primary' }`
- `render`: `<Button {...args}><SettingsIcon /></Button>` where `SettingsIcon` is an inline SVG defined in the same file (no external import).
- `play`: locate button by `aria-label`; assert `aria-label` attribute is non-empty.

#### `button.tests.stories.tsx`

**CssCheck**
- No args, no render override (renders a default button as a canvas anchor).
- `play`:
  ```ts
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary').trim()
  if (!value)
    throw new Error('globals.css did not load: --color-primary is not defined')
  ```
  > Uses `--color-primary` because `globals.css` defines `@theme inline { --color-primary: var(--primary); }` — this token is guaranteed to be non-empty when the stylesheet loads.

**AccessibilityCheck**
- `tags: ['a11y-addon-test']`
- `render`: flex row, one `<Button>` per variant, `color="primary"`, each labelled with its variant name.
- `play`:
  - Query all `button, a[href]` elements.
  - For each, assert `el.getAttribute('aria-label') || el.textContent?.trim()` is non-empty. Throw immediately on first failure.

---

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The stories in this spec are themselves the test harness. Each play function is an executable property. The properties below are the formal statements that each play function must satisfy.

**PBT applicability assessment:** This feature is primarily UI rendering and story configuration. Most acceptance criteria are SMOKE or EXAMPLE tests. However, several play functions encode universal behavioral properties of the `Button` component that hold across all inputs — these are worth formalising. Full property-based testing (random input generation) is not appropriate here because the stories render fixed configurations; the "for all" quantification is over the component's prop contract, verified by the play function assertions.

**Property reflection:** After reviewing all PROPERTY-classified criteria:
- 5.2 and 5.6 are identical (AllVariants count) — merged into Property 1.
- 6.2, 6.3, and 6.5 all concern AllColors completeness — merged into Property 2.
- 8.4 and 8.5 both assert that a disabling prop produces the DOM `disabled` attribute — merged into Property 3.
- 8.6, 12.3, and 12.4 all assert the href-renders-as-anchor contract — merged into Property 4.
- 13.3 (block → w-full) and 14.4 (icon button aria-label) are independent — Properties 5 and 6.
- 11.4 (accessible name on all elements) is independent — Property 7.

### Property 1: Variant matrix completeness

*For any* array of button variants, rendering one Button per variant should produce exactly as many interactive elements (buttons or anchors) in the DOM as there are entries in the variants array.

**Validates: Requirements 5.2, 5.6**

### Property 2: Color matrix completeness and labelling

*For any* array of color tokens, rendering one Button per color should produce exactly as many button elements as there are color tokens, and each button's text content should match its corresponding color token name.

**Validates: Requirements 6.2, 6.3, 6.5**

### Property 3: Disabling props produce the DOM disabled attribute

*For any* Button rendered with `disabled={true}` or `loading={true}`, the resulting DOM element should carry the HTML `disabled` attribute, preventing interaction.

**Validates: Requirements 8.4, 8.5**

### Property 4: href prop renders Button as an anchor with href attribute

*For any* Button rendered with an `href` prop, the resulting DOM element should be an `<a>` tag and should have a non-empty `href` attribute.

**Validates: Requirements 8.6, 12.3, 12.4**

### Property 5: block prop applies full-width class

*For any* Button rendered with `block={true}`, the resulting DOM element should have the `w-full` CSS class applied.

**Validates: Requirements 13.3**

### Property 6: Icon button exposes accessible name

*For any* Button rendered with `size="icon"` and an `aria-label` prop, the resulting DOM element should have a non-empty `aria-label` attribute.

**Validates: Requirements 14.4**

### Property 7: All rendered buttons and anchors have an accessible name

*For any* set of rendered Button elements, every `<button>` and `<a>` in the canvas should have a non-empty accessible name — either via `aria-label` or non-whitespace text content.

**Validates: Requirements 11.4**

---

## Error Handling

### Play function failures

All play functions use a fail-fast strategy: the first assertion failure throws an `Error` with a descriptive message identifying the missing element or unexpected value. Storybook's `addon-vitest` runner treats an uncaught throw as a test failure and surfaces the message in the test UI.

| Scenario | Error message pattern |
|---|---|
| Button not found by name | `Could not find button/anchor named "<name>".` |
| Wrong attribute value | `Expected <attr>="<expected>", got "<received>".` |
| Wrong element count | `Expected <n> buttons, found <m>.` |
| CSS token not loaded | `globals.css did not load: --color-primary is not defined` |
| Missing accessible name | `Button at index <i> has no accessible name.` |

### Missing element guard (`getButton` helper)

The `getButton` helper queries both `button` and `a[href]` selectors and matches on `textContent.trim()` or `aria-label`. This handles both the `<button>` and `<a>` render paths of the Button component without the caller needing to know which path was taken.

### `loading` state and `disabled` attribute

The Button component sets `effectiveDisabled = disabled || loading` and passes it to `Headless.Button`. This means a `loading` button has `disabled` in the DOM even though the prop passed was `loading`, not `disabled`. Play functions must query by text/aria-label (not by `[disabled]` selector) to locate the element first, then assert the attribute.

---

## Testing Strategy

### Dual approach

| Layer | Tool | What it covers |
|---|---|---|
| Play functions (interaction tests) | `addon-vitest` + `storybook/test` | DOM assertions, attribute checks, element counts, accessible names, CSS token presence |
| Axe accessibility scan | `addon-a11y` | WCAG violations on the `AccessibilityCheck` story (tagged `a11y-addon-test`) |

Play functions are the primary automated test mechanism. They run in the browser via Vitest's browser mode and have access to the real rendered DOM, computed styles, and ARIA tree.

### Running tests

```bash
# From repo root — runs all Storybook interaction tests
pnpm --filter @workspace/storybook test
```

This runs `vitest --project storybook run` (single-pass, no watch mode).

### Story tagging

| Tag | Purpose |
|---|---|
| `autodocs` | Root meta only — generates the automatic docs page |
| `a11y-addon-test` | `AccessibilityCheck` story only — triggers axe scan in CI |

### Unit test balance

These stories are themselves the unit tests. No separate `*.test.ts` files are needed for the story structure — the play functions cover all behavioral properties. The `CssCheck` story covers the CSS loading smoke test that would otherwise require a separate environment check.

### Property test configuration

Each play function implements exactly one correctness property from the list above. The mapping is:

| Play function location | Property validated |
|---|---|
| `AllVariants` play | Property 1 |
| `AllColors` play | Property 2 |
| `AllStates` play (disabled + loading assertions) | Property 3 |
| `AllStates` play (anchor assertion) + `AsLink` play | Property 4 |
| `BlockButton` play | Property 5 |
| `IconButton` play | Property 6 |
| `AccessibilityCheck` play | Property 7 |

Each play function should include a comment referencing its property:
```ts
// Feature: button-storybook-story, Property 1: variant matrix completeness
```

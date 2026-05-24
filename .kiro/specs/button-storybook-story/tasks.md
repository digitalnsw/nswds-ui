# Implementation Plan: Button Storybook Stories

## Overview

Extend the existing `button.stories.tsx` and create three companion story files that give designers, developers, and CI engineers a structured, navigable Button catalogue in Storybook 10. The design document specifies exact story shapes, play-function assertions, and correctness properties — tasks below map directly to those specs.

All files live at `packages/ui/src/components/`. No changes to `button.tsx` or any other source file are required.

---

## Tasks

- [ ] 1. Update `button.stories.tsx` — shared exports, helpers, and root Meta
  - [ ] 1.1 Export shared constants from `button.stories.tsx`
    - Add `export` keyword to the existing `variants`, `colors`, and `sizes` `as const` arrays so sub-story files can import them
    - Add `export const iconSizes = ['sm', 'default', 'lg', 'xl'] as const` alongside the other constants
    - Verify the JSDoc comment at the top of the file lists all three sub-group files and their sidebar paths (add/update if missing)
    - _Requirements: 1.2, 15.1_

  - [ ] 1.2 Export play-function helpers from `button.stories.tsx`
    - Add `export` to the existing `getButton` helper; update its query to also match `a[href]` elements (not just `button`) so it handles the link render path
    - Add `export` to the existing `expectAttribute` helper
    - _Requirements: 3.3, 3.4, 3.5_

  - [ ] 1.3 Verify and complete the root Meta `argTypes`
    - Confirm `iconSize` argType is present with `control: 'inline-radio'` and `options: iconSizes`, category `Appearance`
    - Confirm `aria-label` argType is present with `control: 'text'`, category `Accessibility`
    - Confirm `className` has `table.disable: true`
    - Confirm `parameters.controls.sort: 'requiredFirst'` and `parameters.controls.expanded: true` are set on the root Meta
    - _Requirements: 2.1, 2.2, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13_

  - [ ] 1.4 Verify Default and Playground stories
    - Confirm `Default` story has `args: { children: 'Continue', variant: 'solid' }` and a play function that calls `getButton` then `expectAttribute(button, 'data-variant', 'solid')`
    - Confirm `Playground` story wraps the Button in `<div className="w-full max-w-xl rounded-sm border border-border bg-background p-6">` and sets `parameters.controls.expanded: false`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 2. Create `button.features.stories.tsx`
  - [ ] 2.1 Scaffold the features file with Meta and imports
    - Create `packages/ui/src/components/button.features.stories.tsx`
    - Import `Meta`, `StoryObj` from `@storybook/react-vite`; `expect`, `within` from `storybook/test`; `Button` from `./button.js`; `variants`, `colors`, `sizes` from `./button.stories.js`
    - Declare minimal Meta: `{ title: 'Components/Button/Features', component: Button }`
    - _Requirements: 1.3, 15.2_

  - [ ] 2.2 Implement `AllVariants` story
    - Render one `<Button>` per entry in `variants` in a `flex flex-wrap gap-4 items-center` row, all with `color="primary"` and `size="default"`, label = variant name
    - Play function: assert `canvasElement.querySelectorAll('button, a[href]').length === variants.length` (6); throw `Expected 6 buttons, found <n>.` on mismatch
    - Add comment: `// Feature: button-storybook-story, Property 1: variant matrix completeness`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 2.3 Write property test for AllVariants (Property 1)
    - **Property 1: Variant matrix completeness**
    - **Validates: Requirements 5.2, 5.6**
    - The play function in 2.2 is the executable property — confirm it throws with the exact message `Expected 6 buttons, found <n>.` when the count is wrong

  - [ ] 2.4 Implement `AllColors` story
    - Render one `<Button>` per entry in `colors` in a `flex flex-wrap gap-4 items-center` row, all with `variant="solid"`, label = color name
    - Play function: assert button count equals `colors.length` (10); throw `Expected 10 buttons, found <n>.` on mismatch
    - Add comment: `// Feature: button-storybook-story, Property 2: color matrix completeness`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 2.5 Write property test for AllColors (Property 2)
    - **Property 2: Color matrix completeness and labelling**
    - **Validates: Requirements 6.2, 6.3, 6.5**
    - The play function in 2.4 is the executable property — confirm each button's `textContent.trim()` matches its color token name

  - [ ] 2.6 Implement `AllSizes` story
    - Render one `<Button>` per entry in `sizes` in a `flex flex-wrap gap-4 items-end` row, all with `variant="solid"` and `color="primary"`
    - `sm`, `default`, `lg` buttons labelled with their size name; `icon` button gets `aria-label="Icon button"` and an inline SVG child (simple placeholder path, no external import)
    - Play function: assert 4 elements present; throw `Expected 4 size buttons, found <n>.` on mismatch
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ] 2.7 Implement `AllStates` story
    - Render five buttons in a `flex flex-wrap gap-4 items-center` row:
      1. Default — `children="Default"`
      2. Disabled — `disabled={true}`, `children="Disabled"`
      3. Loading — `loading={true}`, `children="Loading"`
      4. Block — `block={true}`, `children="Block"`, wrapped in `<div className="w-full max-w-xs">`
      5. Link — `href="#"`, `children="Link"`
    - Play function:
      - `within(canvasElement).getByText('Disabled')` → assert `disabled` attribute present (Property 3)
      - `within(canvasElement).getByText('Loading')` → assert `disabled` attribute present (Property 3)
      - `canvasElement.querySelector('a[href]')` → assert not null (Property 4)
    - Add comments: `// Property 3: disabling props produce DOM disabled` and `// Property 4: href renders as anchor`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 2.8 Write property tests for AllStates (Properties 3 and 4)
    - **Property 3: Disabling props produce the DOM disabled attribute**
    - **Validates: Requirements 8.4, 8.5**
    - **Property 4: href prop renders Button as an anchor with href attribute**
    - **Validates: Requirements 8.6**
    - The play function in 2.7 is the executable property for both

  - [ ] 2.9 Implement `DarkMode` story
    - Set `parameters: { themes: { themeOverride: 'dark' } }`
    - Render all six variants with `color="primary"` in a `<div className="bg-background p-6 rounded-sm flex flex-wrap gap-4 items-center">`
    - No play function (visual-only story)
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 3. Checkpoint — verify features file compiles and stories load
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Create `button.examples.stories.tsx`
  - [ ] 4.1 Scaffold the examples file with Meta and imports
    - Create `packages/ui/src/components/button.examples.stories.tsx`
    - Import `Meta`, `StoryObj` from `@storybook/react-vite`; `expect`, `within` from `storybook/test`; `Button` from `./button.js`
    - Declare minimal Meta: `{ title: 'Components/Button/Examples', component: Button }`
    - _Requirements: 1.4, 15.3_

  - [ ] 4.2 Implement `AsLink` story
    - `args: { href: '#', children: 'Go to page', variant: 'solid', color: 'primary' }`
    - Play function:
      - `const anchor = canvasElement.querySelector('a')` — assert not null
      - Assert `anchor.getAttribute('href')` is not null/empty
    - Add comment: `// Feature: button-storybook-story, Property 4: href renders as anchor`
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ]* 4.3 Write property test for AsLink (Property 4)
    - **Property 4: href prop renders Button as an anchor with href attribute**
    - **Validates: Requirements 12.3, 12.4**
    - The play function in 4.2 is the executable property

  - [ ] 4.4 Implement `BlockButton` story
    - `args: { children: 'Submit form', variant: 'solid', color: 'primary' }`
    - `render`: `<div className="max-w-sm"><Button {...args} block>{args.children}</Button></div>`
    - Play function: locate button; assert it has class `w-full`
    - Add comment: `// Feature: button-storybook-story, Property 5: block prop applies w-full`
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ]* 4.5 Write property test for BlockButton (Property 5)
    - **Property 5: block prop applies full-width class**
    - **Validates: Requirements 13.3**
    - The play function in 4.4 is the executable property

  - [ ] 4.6 Implement `IconButton` story
    - `args: { size: 'icon', 'aria-label': 'Settings', variant: 'solid', color: 'primary' }`
    - Define an inline `SettingsIcon` SVG component in the same file (no external import)
    - `render`: `<Button {...args}><SettingsIcon /></Button>`
    - Play function: locate button by `aria-label`; assert `aria-label` attribute is non-empty
    - Add comment: `// Feature: button-storybook-story, Property 6: icon button exposes accessible name`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ]* 4.7 Write property test for IconButton (Property 6)
    - **Property 6: Icon button exposes accessible name**
    - **Validates: Requirements 14.4**
    - The play function in 4.6 is the executable property

- [ ] 5. Create `button.tests.stories.tsx`
  - [ ] 5.1 Scaffold the tests file with Meta and imports
    - Create `packages/ui/src/components/button.tests.stories.tsx`
    - Import `Meta`, `StoryObj` from `@storybook/react-vite`; `expect`, `within` from `storybook/test`; `Button` from `./button.js`; `variants` from `./button.stories.js`
    - Declare minimal Meta: `{ title: 'Components/Button/Tests', component: Button }`
    - _Requirements: 1.5, 15.4_

  - [ ] 5.2 Implement `CssCheck` story
    - No args override, no render override (renders a default button)
    - Play function:
      ```ts
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary').trim()
      if (!value)
        throw new Error('globals.css did not load: --color-primary is not defined')
      ```
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 5.3 Implement `AccessibilityCheck` story
    - `tags: ['a11y-addon-test']`
    - Render all six variants with `color="primary"` in a flex row, each labelled with its variant name
    - Play function: query all `button, a[href]` elements; for each assert `el.getAttribute('aria-label') || el.textContent?.trim()` is non-empty; throw `Button at index <i> has no accessible name.` on first failure
    - Add comment: `// Feature: button-storybook-story, Property 7: all rendered buttons have accessible name`
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 5.4 Write property test for AccessibilityCheck (Property 7)
    - **Property 7: All rendered buttons and anchors have an accessible name**
    - **Validates: Requirements 11.4**
    - The play function in 5.3 is the executable property

- [ ] 6. Final checkpoint — run the Storybook test suite
  - Run `pnpm --filter @workspace/storybook test` from the repo root
  - All play functions in all four story files must pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP — the play functions they describe are already embedded in the non-optional implementation tasks above
- Each task references specific requirements for traceability
- The design document's correctness properties map 1-to-1 to play functions: Properties 1–7 are validated by `AllVariants`, `AllColors`, `AllStates`, `AsLink`, `BlockButton`, `IconButton`, and `AccessibilityCheck` respectively
- Sub-story files import constants from `./button.stories.js` — Storybook's Vite config resolves `.js` to `.tsx` at dev time; this is the correct import path
- The `getButton` helper must query both `button` and `a[href]` to handle both render paths of the Button component

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "4.1", "5.1"] },
    { "id": 3, "tasks": ["2.2", "2.4", "2.6", "2.7", "2.9", "4.2", "4.4", "4.6", "5.2", "5.3"] },
    { "id": 4, "tasks": ["2.3", "2.5", "2.8", "4.3", "4.5", "4.7", "5.4"] }
  ]
}
```

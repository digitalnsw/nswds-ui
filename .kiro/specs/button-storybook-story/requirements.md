# Requirements Document

## Introduction

This feature defines the requirements for a consistent, well-structured Storybook story layout for the `Button` component in the `@nswds/ui` design system. The story file (`button.stories.tsx`) and its companion sub-group files serve as the canonical reference for design QA, interaction regression testing, and accessibility verification. Every story must follow a predictable structure so that contributors can add new stories without ambiguity, and consumers can navigate the catalogue reliably.

The Button component supports six visual variants (`solid`, `soft`, `surface`, `outline`, `ghost`, `link`), ten colour tokens, three size presets plus an icon-only mode, and several behavioural states (`disabled`, `loading`, `block`, `alignContent`). Stories must surface all of these in a structured, navigable way.

## Glossary

- **Story_File**: The primary story file `packages/ui/src/components/button.stories.tsx`.
- **Sub_Story_File**: A companion story file that groups related stories under a Storybook sidebar folder (e.g. `button.features.stories.tsx`).
- **Story**: A named export from a story file that renders the Button in a specific state or configuration.
- **Meta**: The default export of a story file that configures the Storybook title, component, tags, parameters, args, and argTypes.
- **ArgTypes**: The Storybook control definitions that appear in the Controls panel for a story.
- **Play_Function**: An async function attached to a story that runs Vitest/Storybook interaction assertions after the story renders.
- **Variant**: One of the six visual treatments of the Button: `solid`, `soft`, `surface`, `outline`, `ghost`, `link`.
- **Color**: One of the ten colour tokens: `primary`, `primary/grey`, `primary/white`, `secondary`, `tertiary`, `accent`, `danger`, `grey`, `white`, `light`.
- **Size**: One of the four size presets: `sm`, `default`, `lg`, `icon`.
- **State**: A behavioural condition of the Button: default (interactive), `disabled`, `loading`, `block`, or `link` (rendered as anchor).
- **Matrix_Story**: A story that renders a grid of Button instances covering all combinations of a set of props.
- **CssCheck_Story**: A story with a Play_Function that asserts a computed CSS custom property value, proving that `globals.css` loaded correctly.
- **Storybook**: The Storybook 10 instance at `apps/storybook`, configured with `addon-a11y`, `addon-themes`, `addon-vitest`, and `storybook-addon-performance`.
- **Sidebar_Group**: A collapsible folder in the Storybook sidebar created by using a `/`-delimited title (e.g. `Components/Button/Features`).

---

## Requirements

### Requirement 1: Story File Structure and Sidebar Organisation

**User Story:** As a design system contributor, I want the Button stories to be split into clearly named sidebar groups, so that I can navigate directly to the category of story I need without scrolling through an undifferentiated list.

#### Acceptance Criteria

1. THE Story_File SHALL export a Meta with `title: 'Components/Button'`, making it the root entry in the sidebar.
2. THE Story_File SHALL include a JSDoc comment at the top listing each Sub_Story_File and its corresponding sidebar path, and THE Story_File's JSDoc comment SHALL be updated whenever a Sub_Story_File is added or removed.
3. WHEN a Sub_Story_File is created for features, THE Sub_Story_File SHALL use `title: 'Components/Button/Features'`.
4. WHEN a Sub_Story_File is created for examples, THE Sub_Story_File SHALL use `title: 'Components/Button/Examples'`.
5. WHEN a Sub_Story_File is created for tests, THE Sub_Story_File SHALL use `title: 'Components/Button/Tests'`.
6. THE Story_File SHALL set `tags: ['autodocs']` on the Meta so that Storybook generates an automatic docs page for the Button.
7. THE Story_File SHALL set `parameters.layout: 'padded'` on the Meta so that all stories render with consistent canvas padding.

---

### Requirement 2: Meta ArgTypes Definition

**User Story:** As a developer using the Storybook Controls panel, I want every Button prop to have a labelled, categorised control, so that I can explore the component API without reading source code.

#### Acceptance Criteria

1. THE Meta SHALL define an `argTypes` entry for each of the following props: `children`, `href`, `disabled`, `loading`, `variant`, `color`, `size`, `iconSize`, `block`, `alignContent`, `onClick`, and `aria-label`.
2. WHEN an `argTypes` entry is defined for a prop, THE Meta SHALL assign the prop to exactly one of the following `table.category` values: `Content`, `Behavior`, `Appearance`, `Events`, or `Accessibility`.
3. THE Meta SHALL assign `children` to the `Content` category.
4. THE Meta SHALL assign `disabled`, `loading`, and `href` to the `Behavior` category.
5. THE Meta SHALL assign `variant`, `color`, `size`, `iconSize`, `block`, and `alignContent` to the `Appearance` category.
6. THE Meta SHALL assign `onClick` to the `Events` category.
7. THE Meta SHALL assign `aria-label` to the `Accessibility` category.
8. THE Meta SHALL set `control: 'inline-radio'` for `variant`, `size`, `iconSize`, and `alignContent`.
9. THE Meta SHALL set `control: 'select'` for `color`.
10. THE Meta SHALL set `control: 'boolean'` for `disabled`, `loading`, and `block`.
11. THE Meta SHALL set `control: 'text'` for `children`, `href`, and `aria-label`.
12. THE Meta SHALL disable the `className` control by setting `table.disable: true`.
13. THE Meta SHALL set `parameters.controls.sort: 'requiredFirst'` and `parameters.controls.expanded: true` on the root Meta.

---

### Requirement 3: Default Story

**User Story:** As a contributor running the Storybook test suite, I want a Default story with a Play_Function, so that I have a fast regression check that the Button mounts, renders its label, and exposes the correct `data-variant` attribute.

#### Acceptance Criteria

1. THE Story_File SHALL export a story named `Default`.
2. THE Default story SHALL set `args.children: 'Continue'` and `args.variant: 'solid'`.
3. WHEN the Default story renders, THE Play_Function SHALL locate the button element by its text content `'Continue'`.
4. WHEN the Default story renders, THE Play_Function SHALL assert that the button element has `data-variant="solid"`.
5. IF the button element is completely absent from the canvas, THEN THE Play_Function SHALL throw an error with a descriptive message identifying the missing element.

---

### Requirement 4: Playground Story

**User Story:** As a designer doing visual QA, I want a Playground story that renders a single Button inside a constrained, styled container, so that I can tweak every control and see the result in a realistic layout context.

#### Acceptance Criteria

1. THE Story_File SHALL export a story named `Playground`.
2. THE Playground story SHALL use a custom `render` function that wraps the Button in a container element.
3. THE Playground container SHALL apply `rounded-sm border border-border bg-background` classes so that the button is shown against a surface that reflects the active theme.
4. THE Playground container SHALL constrain its width to `max-w-xl` and apply `p-6` padding.
5. THE Playground story SHALL set `parameters.controls.expanded: false` to show a compact controls panel.
6. THE Playground story SHALL pass all `args` through to the Button, including `args.children` as the button label.

---

### Requirement 5: Variant Matrix Story (Features sub-group)

**User Story:** As a designer reviewing the design system, I want a single story that renders every variant of the Button side by side, so that I can compare visual treatments at a glance without switching stories.

#### Acceptance Criteria

1. THE Sub_Story_File for features SHALL export a story named `AllVariants`.
2. THE AllVariants story SHALL render one Button for each of the six Variants: `solid`, `soft`, `surface`, `outline`, `ghost`, `link`.
3. THE AllVariants story SHALL render all six Buttons in a single horizontal row using a flex container.
4. THE AllVariants story SHALL use the `primary` Color for all Buttons so that variant differences are isolated from colour differences.
5. THE AllVariants story SHALL use the `default` Size for all Buttons.
6. WHEN the AllVariants story renders, THE Play_Function SHALL assert that exactly six button or anchor elements are present in the canvas.

---

### Requirement 6: Colour Matrix Story (Features sub-group)

**User Story:** As a designer reviewing token coverage, I want a story that renders every colour token applied to the solid variant, so that I can verify all ten colour tokens resolve correctly.

#### Acceptance Criteria

1. THE Sub_Story_File for features SHALL export a story named `AllColors`.
2. THE AllColors story SHALL render one Button for each Color token defined in the `colors` constant, using `variant: 'solid'`.
3. THE AllColors story SHALL label each Button with the name of its Color token.
4. THE AllColors story SHALL arrange the Buttons in a wrapping flex row.
5. WHEN the AllColors story renders, THE Play_Function SHALL assert that the number of button elements equals the number of Color tokens in the `colors` constant.

---

### Requirement 7: Size Matrix Story (Features sub-group)

**User Story:** As a developer integrating the Button, I want a story that shows all size presets side by side, so that I can choose the right size for a given layout context.

#### Acceptance Criteria

1. THE Sub_Story_File for features SHALL export a story named `AllSizes`.
2. THE AllSizes story SHALL render one Button for each of the four Sizes: `sm`, `default`, `lg`, `icon`, and IF any Size is absent, THEN THE Play_Function SHALL throw an error identifying the missing Size.
3. THE AllSizes story SHALL use `variant: 'solid'` and `color: 'primary'` for all Buttons.
4. THE AllSizes story SHALL label the `sm`, `default`, and `lg` Buttons with their size name.
5. THE AllSizes story SHALL render the `icon` Size Button with an `aria-label` of `'Icon button'` and an SVG icon as its child.
6. THE AllSizes story SHALL align all Buttons to the bottom of the flex container so that size differences are visually apparent.

---

### Requirement 8: State Matrix Story (Features sub-group)

**User Story:** As a QA engineer, I want a story that renders all interactive states of the Button, so that I can verify disabled, loading, and link states are visually and semantically correct.

#### Acceptance Criteria

1. THE Sub_Story_File for features SHALL export a story named `AllStates`.
2. THE AllStates story SHALL render the following five States: default (interactive), `disabled`, `loading`, `block`, and `link` (rendered as anchor via `href` prop), and each Button SHALL visually and semantically reflect its intended State.
3. THE AllStates story SHALL label each Button with its state name.
4. WHEN the AllStates story renders, THE Play_Function SHALL assert that the `disabled` Button has the HTML `disabled` attribute.
5. WHEN the AllStates story renders, THE Play_Function SHALL assert that the `loading` Button has the HTML `disabled` attribute.
6. WHEN the AllStates story renders, THE Play_Function SHALL assert that the `link` Button renders as an `<a>` element.

---

### Requirement 9: Dark Mode Story (Features sub-group)

**User Story:** As a designer reviewing dark mode, I want a story that forces the dark theme and renders the full variant matrix, so that I can verify all variants are legible on dark backgrounds without manually toggling the theme switcher.

#### Acceptance Criteria

1. THE Sub_Story_File for features SHALL export a story named `DarkMode`.
2. THE DarkMode story SHALL set `parameters.themes.themeOverride: 'dark'` to force the dark theme for that story only.
3. THE DarkMode story SHALL render all six Variants using the `primary` Color, arranged in a horizontal flex row.
4. THE DarkMode story SHALL wrap its content in a container with `bg-background p-6 rounded-sm` classes so the dark background is visible in the canvas.

---

### Requirement 10: CssCheck Story (Tests sub-group)

**User Story:** As a CI engineer, I want a CssCheck story with a Play_Function that asserts a computed CSS custom property, so that the test suite fails immediately if `globals.css` fails to load.

#### Acceptance Criteria

1. THE Sub_Story_File for tests SHALL export a story named `CssCheck`.
2. WHEN the CssCheck story renders, THE Play_Function SHALL read the computed value of `--color-primary` (or an equivalent token defined in `globals.css`) from the document root.
3. WHEN the CssCheck story renders, THE Play_Function SHALL assert that the computed value is a non-empty string.
4. IF the computed value is empty or undefined, THEN THE Play_Function SHALL throw an error with the message `'globals.css did not load: --color-primary is not defined'`.

---

### Requirement 11: Accessibility Story (Tests sub-group)

**User Story:** As an accessibility engineer, I want a story that renders all six variants and is tagged for automated axe scanning, so that accessibility regressions are caught in CI.

#### Acceptance Criteria

1. THE Sub_Story_File for tests SHALL export a story named `AccessibilityCheck`.
2. THE AccessibilityCheck story SHALL render all six Variants using the `primary` Color.
3. THE AccessibilityCheck story SHALL set `tags: ['a11y-addon-test']` so that `addon-a11y` runs axe on this story during the test run.
4. WHEN the AccessibilityCheck story renders, THE Play_Function SHALL assert that every Button and anchor element has an accessible name, and IF any element lacks an accessible name, THEN THE Play_Function SHALL fail the test immediately.

---

### Requirement 12: Link Button Example Story (Examples sub-group)

**User Story:** As a developer integrating the Button as a navigation element, I want an example story showing the Button rendered as an anchor, so that I can see the correct prop usage and expected DOM output.

#### Acceptance Criteria

1. THE Sub_Story_File for examples SHALL export a story named `AsLink`.
2. THE AsLink story SHALL render a Button with an `href` prop set to `'#'`.
3. WHEN the AsLink story renders, THE Play_Function SHALL assert that the rendered element is an `<a>` tag with full anchor semantics.
4. WHEN the AsLink story renders, THE Play_Function SHALL assert that the `<a>` element has an `href` attribute.

---

### Requirement 13: Block Button Example Story (Examples sub-group)

**User Story:** As a developer building a form layout, I want an example story showing the full-width block Button, so that I can verify it stretches correctly inside a constrained container.

#### Acceptance Criteria

1. THE Sub_Story_File for examples SHALL export a story named `BlockButton`.
2. THE BlockButton story SHALL render a Button with `block: true` inside a container with a fixed width of `max-w-sm`.
3. WHEN the BlockButton story renders and the story has rendered successfully, THE Play_Function SHALL assert that the button element has the `w-full` class applied.

---

### Requirement 14: Icon Button Example Story (Examples sub-group)

**User Story:** As a developer building a toolbar, I want an example story showing an icon-only Button with a proper accessible label, so that I can verify the touch-target and aria-label pattern.

#### Acceptance Criteria

1. THE Sub_Story_File for examples SHALL export a story named `IconButton`.
2. THE IconButton story SHALL render a Button with `size: 'icon'` and an `aria-label` prop.
3. THE IconButton story SHALL render an SVG icon as the Button's child content.
4. WHEN the IconButton story renders, THE Play_Function SHALL assert that the button element has a non-empty `aria-label` attribute.

---

### Requirement 15: Story File Naming and Co-location

**User Story:** As a contributor adding a new story group, I want a clear naming convention for story files, so that Storybook's glob picks them up automatically and the sidebar hierarchy is predictable.

#### Acceptance Criteria

1. THE Story_File SHALL be located at `packages/ui/src/components/button.stories.tsx`.
2. THE Sub_Story_File for features SHALL be located at `packages/ui/src/components/button.features.stories.tsx`.
3. THE Sub_Story_File for examples SHALL be located at `packages/ui/src/components/button.examples.stories.tsx`.
4. THE Sub_Story_File for tests SHALL be located at `packages/ui/src/components/button.tests.stories.tsx`.
5. THE Story_File and all Sub_Story_Files SHALL match the glob pattern `packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)` defined in `apps/storybook/.storybook/main.ts`.
6. THE Story_File and all Sub_Story_Files SHALL be excluded from the tsup build by the existing `name.endsWith('.stories.tsx')` guard in `tsup.config.ts`.

# Reference: the Storybook standard

Every component's stories take Button's shape, so a reader who has learnt Button's pages can use
them all. Button is the reference — `packages/ui/src/components/button.stories.tsx`,
`button.features.stories.tsx` and `button.accessibility.stories.tsx` — and the docs kit in
`story-helpers.tsx` reproduces its docs page. When a page and Button disagree, Button wins.

`npm run check:stories -w @nswds/ui` enforces everything marked **(gated)**. The rest is held by
review.

## Files

Each source file in `src/components/` and `src/patterns/` has these story files beside it
**(gated)**:

| File                               | Sidebar                           | Holds                                                  |
| ---------------------------------- | --------------------------------- | ------------------------------------------------------ |
| `<file>.stories.tsx`               | `Components/<Name>`               | the docs page, `Default`, `Playground`                 |
| `<file>.features.stories.tsx`      | `Components/<Name>/Features`      | one story per docs section, plus any feature matrices  |
| `<file>.accessibility.stories.tsx` | `Components/<Name>/Accessibility` | one story per WCAG 2.2 criterion, asserted in `play()` |
| `<file>.tests.stories.tsx`         | `Components/<Name>/Tests`         | optional: CSS checks and regressions, hidden           |

- `<Name>` is the main export as it is imported: `AlertDialog`, `TabNav` **(gated)**. Patterns file
  under `Patterns/`, hooks under `Hooks/` **(gated)**. Hooks need only the main file.
- Features and Accessibility are for readers and show in the sidebar. Tests are tagged
  `['!dev', '!autodocs']` **(gated)**: they run in the Vitest suite and Chromatic but stay out of
  the sidebar.
- The recorded exceptions — `button-link.stories.tsx` under Button's folder, the footer blocks
  sharing one page, the icon galleries, Breadcrumb's per-look guide pages — are listed with their
  reasons in `scripts/check-stories.mjs`.

## The docs page

Button's page, built from the kit **(gated)**, with four additions Button's own page does not
carry: the install lines, "When to use", a code snippet under each example, and the props table.

```tsx
export function SizesSection() {
  return (
    <ExampleSection title='Sizes' description='…'>
      <Example code={`<Widget size="lg" />`}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <Widget size={size} />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function WidgetDocs() {
  return (
    <DocsPage title='Widget' npm='Widget' registry='widget' summary={…}>
      <DocsUsage use={[…]} avoid={[…]} />
      <VariantsSection />
      <SizesSection />
      …
      <DocsApi />
    </DocsPage>
  )
}
```

| Part             | What it is                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `DocsPage`       | Button's intro — a large title and one paragraph — then the npm and registry install lines. |
| `DocsUsage`      | "When to use": the cases for it, and for something else, naming the alternative component.  |
| `ExampleSection` | Button's section: a bold heading, a short description, then its panels.                     |
| `Example`        | Button's tinted preview panel, with the example's code underneath.                          |
| `ExampleCell`    | Button's specimen: centred, with its label underneath.                                      |
| `DocsApi`        | The generated props table. Always last.                                                     |

**Content is Button's depth.** Show every meaningful option the way Button does: each variant
labelled and described, sizes on one row, colours grouped by role with a heading and a sentence
each (`surface='brand'` for colours made for dark surfaces), states side by side, then the
component in context with realistic NSW Government copy. A page that existed before this standard
keeps every section it had.

**Sections are exported** from the main file and kept out of the story index with
`excludeStories: /Section$/`, so the Features file renders the same examples:

```tsx
// widget.features.stories.tsx
import { SizesSection, VariantsSection } from './widget.stories.js'

export const Variants: Story = { render: () => <VariantsSection /> }
export const Sizes: Story = { render: () => <SizesSection /> }
```

## Stories

- The main file exports `Default` and `Playground` **(gated)**. `Default` is the out-of-the-box
  configuration with a `play()` proving it mounted; `Playground` spreads `args` with every control
  working.
- `meta` sets `tags: ['autodocs']`, `parameters.docs.page` **(gated)** and `layout: 'padded'` — or
  `'fullscreen'` for page chrome. Never `'centered'` **(gated)**.
- `argTypes` cover every public prop, each with a `description` and a `table.category` of
  `Content`, `Appearance`, `Behavior`, `Events` or `Accessibility`.

## Accessibility

One story per WCAG 2.2 criterion the component has to meet, named
`<W3C criterion title> — <number>` — `'Focus Visible — 2.4.7 / 2.4.11'`,
`'Target Size (Minimum) — 2.5.8'`, optionally ending `(dark)` **(gated)**. Each story's description
comes from `wcagStoryMeta`, and each **asserts** its criterion in `play()`: contrast measured with
`expectContrast`, focus and keyboard driven with `userEvent`, names and roles read with
`getByRole`. Button and Tooltip are the models. Overlays close themselves at the end of `play()`
with `closeOverlay`, so the end-of-play axe pass never races a closing popup.

## Text and tokens

- **16px floor.** No `text-xs` or `text-sm` in any story file **(gated)**.
- **Tokens.** Story chrome uses semantic tokens like components do. No raw palette colours outside
  the recorded exceptions (AGENTS.md §3).

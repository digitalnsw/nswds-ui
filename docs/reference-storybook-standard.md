# Reference: the Storybook standard

Every component's stories follow one shape, so a reader who has learnt one page can use them
all. Button is the reference implementation — `packages/ui/src/components/button.stories.tsx`,
`button.tests.stories.tsx` and `button.accessibility.stories.tsx`. When this page and Button
disagree, fix whichever is wrong; don't add a third way.

`npm run check:stories -w @nswds/ui` enforces everything marked **(gated)**. The rest is held by
review.

## Files

Each source file in `src/components/`, `src/patterns/` and `src/hooks/` has up to three story
files beside it, and no others **(gated)**:

| File                               | Sidebar                           | Holds                                         |
| ---------------------------------- | --------------------------------- | --------------------------------------------- |
| `<file>.stories.tsx`               | `Components/<Name>`               | the docs page, Default, Playground, examples  |
| `<file>.tests.stories.tsx`         | `Components/<Name>/Tests`         | regression, CSS-check and edge-case stories   |
| `<file>.accessibility.stories.tsx` | `Components/<Name>/Accessibility` | one story per WCAG 2.2 criterion demonstrated |

- **One story set per source file.** Everything a file exports is documented in that file's
  stories — `ButtonLink` lives in Button's, not in a `button-link.stories.tsx`.
- `<Name>` is the main export, written as it is imported: `AlertDialog`, `TabNav`, not
  `Alert Dialog` or `Tab Navigation` **(gated)**. Patterns file under `Patterns/`, hooks under
  `Hooks/` **(gated)**.
- There is no Features folder. A feature worth showing is an example on the docs page; a
  combination matrix worth keeping is a test.
- The recorded exceptions — the footer blocks sharing one page, the icon galleries, Breadcrumb's
  per-look guide pages — are listed with their reasons in `scripts/check-stories.mjs`.

## The main file

```
Components/Button
  Docs          ← the custom docs page
  Default       ← the out-of-the-box configuration, with a play() smoke test
  Playground    ← args only; every control works
  Variants      ┐
  Sizes         │ example stories: one per docs section,
  …             │ in the same order as the docs page
  As a link     ┘
  Tests/        ← hidden from the sidebar
  Accessibility/
```

- **`Default` then `Playground` come first** **(gated)**. `Default` renders the component from
  `meta.args` (and `meta.render`, where the component needs composing) and carries a `play()` proving it mounted.
  `Playground` is `{}` (or a render that only spreads `args`): no frame, no wrapper, no copy.
- **Every other story is an example**, and every example is one section of the docs page: the
  story renders the same `…Section` component the page does, so the two can never drift.
- **Names are sentence case** and set with `name:` **(gated)** — `'With icons'`, not
  `WithIcons` → "With Icons". The section heading is the same string. Australian spelling
  (`Colours`, `Behaviour`).
- `meta` sets `tags: ['autodocs']`, `parameters.docs.page` **(gated)**, and
  `layout: 'padded'` — or `'fullscreen'` for page chrome (Header, Footer, MainNav, Masthead).
  Never `'centered'` **(gated)**: examples start top-left, where they would on a page.
- `argTypes` cover every public prop, each with a `description` and a `table.category` of
  `Content`, `Appearance`, `Behavior`, `Events` or `Accessibility`. Hide `className`.

## The docs page

Built only from the docs kit in `src/components/story-helpers.tsx` **(gated)**:

```tsx
function ButtonDocs() {
  return (
    <DocsPage title='Button' npm={['Button', 'ButtonLink']} registry='button' summary={…}>
      <DocsUsage use={[…]} avoid={[…]} />
      <VariantsSection />
      <SizesSection />
      …
      <DocsApi />
    </DocsPage>
  )
}
```

| Part        | What it is                                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocsPage`  | The header: eyebrow, title, one-paragraph summary, and the install line for each channel. `from` names a subpath (`@nswds/ui/icons`); patterns pass `registry` only. |
| `DocsUsage` | "When to use": three or so cases for it, and three for something else — naming the alternative component each time.                                                  |
| Sections    | One `ExampleSection` per example story, in story order.                                                                                                              |
| `DocsApi`   | The generated props table. Always last.                                                                                                                              |

**Section order.** Use the sections that apply, in this order, and name them exactly so:
`Variants`, `Sizes`, `Colours`, `States`, `With icons`, then component-specific sections
(composition, behaviour, `Controlled`, `Right to left`), then `In context` last. A component
with one look and no options may have only `In context`.

## Examples

```tsx
function SizesSection() {
  return (
    <ExampleSection title='Sizes' description='…'>
      <Example code={`<Button size="lg">Continue</Button>`}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <Button size={size}>Continue</Button>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}
```

- **`Example` frames one idea**: a hairline frame, the live specimens, and the code to write
  them attached underneath. Two ideas are two `Example`s, or two sections. Give every `Example`
  on the docs page a `code` snippet unless the section is purely a scene (`In context`).
- **Label every specimen** whose difference isn't self-evident, with `ExampleCell label=…` —
  the prop value it shows (`soft`, `sm`) or the state (`disabled`). An unlabelled row of
  near-identical controls is the failure this standard exists to remove.
- **`layout`** arranges the specimens: `row` (default — side by side, labels aligned), `stack`
  (one under another), `grid` (two columns), `fill` (the child fills the frame: tables, page
  chrome, scenes). Don't hand-roll a flex wrapper inside an `Example`.
- **`surface`** is what they sit on: `default`; `subtle` for white surfaces (cards, menus) that
  need a page; `brand` for colours made for dark surfaces (`white`, `secondary`); `dark` for a
  dark page inside a light docs page.
- **Real content.** Write copy an NSW Government service would ship — "Apply for a
  Working with Children Check", "Your application has been approved" — never lorem ipsum, "Item
  1", "Option A", "Click me" or "foo". Keep it short: the content is a specimen, not the point.
- **Width.** Form controls and anything that fills its container sit in a `max-w-sm`/`max-w-md`
  wrapper so they read at a realistic width rather than stretched across the page.

## Tests

`<file>.tests.stories.tsx`, titled `<main title>/Tests`, tagged `['!dev', '!autodocs']`
**(gated)** — so they run in the Vitest suite and Chromatic but stay out of the sidebar, which
is for readers. Everything that exists to prove something rather than to show something goes
here: `CssCheck` stories, combination matrices, dark-mode parity, regressions, edge cases with
long names. Names are free-form (`name:` is optional) but descriptive; a test asserts in
`play()` — a story that asserts nothing is an example, and belongs in the main file.

## Accessibility

`<file>.accessibility.stories.tsx`, titled `<main title>/Accessibility`, tagged
`['!autodocs']` **(gated)**. One story per WCAG 2.2 criterion the component demonstrates,
named `<W3C criterion title> — <number>` — `'Focus Visible — 2.4.7 / 2.4.11'`,
`'Target Size (Minimum) — 2.5.8'`, optionally ending `(dark)` **(gated)**. The description comes
from `wcagStoryMeta`, and each asserts its criterion in `play()`.

## Text and tokens

- **16px floor.** No `text-xs` or `text-sm` in any story file **(gated)** — the same floor the
  components hold.
- **Tokens.** Story chrome uses semantic tokens like components do: `text-muted-foreground`,
  `ring-foreground/10`, `bg-foreground/5`. No raw palette colours outside the recorded exceptions
  (AGENTS.md §3).
- **Hierarchy.** The kit owns all docs typography: the page `h1`, section `h2`s and the
  `DocsUsage` `h3`s. An example adds headings only when the specimen itself is a page
  (`In context`).

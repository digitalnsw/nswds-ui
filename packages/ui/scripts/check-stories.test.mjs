/**
 * Tests for the story-standard gate.
 *
 * These exist for the reason the portal-boundary tests do (AGENTS.md §5): the
 * gate guards something nothing else in CI reads — the SHAPE of a story file —
 * so a mistake in it is invisible until the catalogue has drifted again. A
 * gate that stops gating exits 0, which reads exactly like success.
 *
 * The passing cases matter as much as the failing ones: a gate that fails on
 * the shapes the real files use (a `satisfies` meta, a docs page in a named
 * function, proper nouns in a story name) gets switched off.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { checkStoryFile, isSentenceCase, kindOf } from './check-stories.mjs'

const messages = (source, path = 'components/widget.stories.tsx', options) =>
  checkStoryFile(source, path, options).map((failure) => failure.message)

const main = ({
  title = 'Components/Widget',
  tags = "['autodocs']",
  docs = 'docs: { page: WidgetDocs },',
  layout = "layout: 'padded',",
  stories = `export const Default: Story = {}
export const Playground: Story = {}
export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }`,
  body = '',
} = {}) => `
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocsApi, DocsPage, DocsUsage } from './story-helpers.js'
${body}
function WidgetDocs() {
  return (
    <DocsPage title='Widget' summary='A widget.'>
      <DocsUsage use={['a']} avoid={['b']} />
      <DocsApi />
    </DocsPage>
  )
}
const meta = {
  title: '${title}',
  tags: ${tags},
  parameters: { ${layout} ${docs} },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
${stories}
`

// ─── Shapes that must pass ──────────────────────────────────────────────────

test('passes a main file that follows the standard', () => {
  assert.deepEqual(messages(main()), [])
})

test('passes a tests file and an accessibility file', () => {
  const tests = `const meta = { title: 'Components/Widget/Tests', tags: ['!dev', '!autodocs'] }
export default meta
export const CssCheck = { play: async () => {} }`
  assert.deepEqual(messages(tests, 'components/widget.tests.stories.tsx'), [])

  const a11y = `const meta = { title: 'Components/Widget/Accessibility', tags: ['!autodocs'] }
export default meta
export const Focus = { name: 'Focus Visible — 2.4.7 / 2.4.11' }
export const Contrast = { name: 'Contrast (Minimum) — 1.4.3 (dark)' }`
  assert.deepEqual(messages(a11y, 'components/widget.accessibility.stories.tsx'), [])
})

test('passes a meta exported directly, and a pattern under Patterns/', () => {
  const direct = main().replace(
    /const meta = ([\s\S]*?) satisfies Meta\nexport default meta/,
    'export default $1',
  )
  assert.deepEqual(messages(direct), [])
  assert.deepEqual(
    messages(main({ title: 'Patterns/LoginForm' }), 'patterns/login-form.stories.tsx'),
    [],
  )
})

test('passes proper nouns, acronyms and code in a sentence-case name', () => {
  const nouns = new Set(['Header'])
  for (const name of ['Under Header dark', 'CSS check', 'In a Field', 'Right to left (RTL)']) {
    assert.ok(isSentenceCase(name, new Set([...nouns, 'Field'])), `${name} should be sentence case`)
  }
  assert.ok(isSentenceCase('With ButtonLink and iconOnly'))
})

test('treats a hooks main file as needing only title, names and the floor', () => {
  const hook = `const meta = { title: 'Hooks/useThing' }
export default meta
export const Basic = { name: 'Basic use' }`
  assert.deepEqual(messages(hook, 'hooks/use-thing.stories.tsx'), [])
})

// ─── Shapes that must fail ──────────────────────────────────────────────────

test('fails a story kind the standard does not have', () => {
  assert.equal(kindOf('widget.features.stories.tsx'), null)
  assert.match(messages(main(), 'components/widget.features.stories.tsx')[0], /not a story kind/)
})

test('fails a title that is not Components/<ExportName>', () => {
  assert.match(messages(main({ title: 'Components/Alert Dialog' }))[0], /export name/)
  assert.match(messages(main({ title: 'Components/Widget/Extra' }))[0], /should be "Components/)
  assert.match(
    messages(main({ title: 'Components/LoginForm' }), 'patterns/login-form.stories.tsx')[0],
    /should be "Patterns\//,
  )
})

test('fails a main file without Default then Playground first', () => {
  const swapped = main({
    stories: `export const Playground: Story = {}
export const Default: Story = {}`,
  })
  assert.ok(messages(swapped).some((m) => /Default then Playground/.test(m)))
})

test('fails an example story with no name, or one in title case', () => {
  const unnamed = main({
    stories: `export const Default = {}
export const Playground = {}
export const WithIcons = { render: () => null }`,
  })
  assert.ok(messages(unnamed).some((m) => /needs a sentence-case `name`/.test(m)))

  const titleCase = main({
    stories: `export const Default = {}
export const Playground = {}
export const WithIcons = { name: 'With Icons' }`,
  })
  assert.ok(messages(titleCase).some((m) => /not sentence case/.test(m)))
})

test('fails a main file on the generated autodocs page', () => {
  const failures = messages(main({ docs: '' }))
  assert.ok(failures.some((m) => /docs\.page/.test(m)))
  const untagged = messages(main({ tags: '[]' }))
  assert.ok(untagged.some((m) => /'autodocs'/.test(m)))
})

test('fails a docs page not built from the kit', () => {
  const source = main()
    .replace(/<DocsUsage[^>]*\/>/, '')
    .replace('<DocsApi />', '')
  const failures = messages(source)
  assert.ok(failures.some((m) => /<DocsUsage>/.test(m)))
  assert.ok(failures.some((m) => /<DocsApi>/.test(m)))
})

test('fails a tests file that shows in the sidebar, or sits under the wrong title', () => {
  const visible = `const meta = { title: 'Components/Widget/Tests', tags: ['!autodocs'] }
export default meta`
  assert.ok(messages(visible, 'components/widget.tests.stories.tsx').some((m) => /'!dev'/.test(m)))

  const misfiled = `const meta = { title: 'Components/Widget', tags: ['!dev', '!autodocs'] }
export default meta`
  assert.ok(
    messages(misfiled, 'components/widget.tests.stories.tsx').some((m) =>
      /Components\/<Name>\/Tests/.test(m),
    ),
  )
})

test('fails a tests file with no main file beside it', () => {
  const tests = `const meta = { title: 'Components/Widget/Tests', tags: ['!dev', '!autodocs'] }
export default meta`
  assert.ok(
    messages(tests, 'components/widget.tests.stories.tsx', { hasMain: () => false }).some((m) =>
      /no widget\.stories\.tsx/.test(m),
    ),
  )
})

test('fails an accessibility story not named for its criterion', () => {
  const a11y = `const meta = { title: 'Components/Widget/Accessibility', tags: ['!autodocs'] }
export default meta
export const Numbered = { name: '1.3.1 Info and Relationships' }
export const Unnamed = {}`
  const failures = messages(a11y, 'components/widget.accessibility.stories.tsx')
  assert.equal(failures.filter((m) => /<WCAG title> — <criterion>/.test(m)).length, 2)
})

test('fails text under the floor and a centred layout, wherever they are', () => {
  const failures = messages(
    main({
      layout: "layout: 'centered',",
      body: "const Caption = () => <span className='text-sm text-muted-foreground'>x</span>",
    }),
  )
  assert.ok(failures.some((m) => /"text-sm"/.test(m)))
  assert.ok(failures.some((m) => /centered/.test(m)))
})

test('does not read a title out of a nested object or a comment', () => {
  const decoy = main({
    title: 'Components/Alert Dialog',
    body: "// title: 'Components/Widget'\nconst section = { title: 'Components/Widget' }",
  })
  assert.ok(messages(decoy).some((m) => /export name/.test(m)))
})

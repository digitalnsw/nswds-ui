/**
 * Tests for the story-standard gate.
 *
 * These exist for the reason the portal-boundary tests do (AGENTS.md §5): the
 * gate guards something nothing else in CI reads — the SHAPE of a story file —
 * so a mistake in it is invisible until the catalogue has drifted again. A
 * gate that stops gating exits 0, which reads exactly like success.
 *
 * The passing cases matter as much as the failing ones. The shape is Button's,
 * so Button's own files — a hand-written page, Title Case story names, no
 * `!autodocs` on Features or Accessibility — must pass; a gate that fails on
 * its own reference gets switched off.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { checkStoryFile, kindOf, missingSiblings } from './check-stories.mjs'

const messages = (source, path = 'components/widget.stories.tsx', options) =>
  checkStoryFile(source, path, options).map((failure) => failure.message)

const main = ({
  title = 'Components/Widget',
  tags = "['autodocs']",
  docs = 'docs: { page: WidgetDocs },',
  layout = "layout: 'padded',",
  stories = `export const Default: Story = {}
export const Playground: Story = {}`,
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

test('passes Default and Playground in any order, beside other stories', () => {
  const stories = `export const Default = {}
export const IconSlotForms = { name: 'Icon Slot Forms' }
export const Playground = {}`
  assert.deepEqual(messages(main({ stories })), [])
})

test('passes Button, the reference, with a hand-written page', () => {
  const button = `const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: { docs: { page: () => <div /> } },
}
export default meta
export const Default = {}
export const Playground = {}`
  assert.deepEqual(messages(button, 'components/button.stories.tsx'), [])
})

test('passes features, accessibility and tests files', () => {
  const features = `const meta = { title: 'Components/Widget/Features' }
export default meta
export const ByVariant = { name: 'By Variant - Theme' }`
  assert.deepEqual(messages(features, 'components/widget.features.stories.tsx'), [])

  const a11y = `const meta = { title: 'Components/Widget/Accessibility' }
export default meta
export const Focus = { name: 'Focus Visible — 2.4.7 / 2.4.11' }
export const Contrast = { name: 'Contrast (Minimum) — 1.4.3 (dark)' }`
  assert.deepEqual(messages(a11y, 'components/widget.accessibility.stories.tsx'), [])

  const tests = `const meta = { title: 'Components/Widget/Tests', tags: ['!dev', '!autodocs'] }
export default meta
export const CssCheck = { play: async () => {} }`
  assert.deepEqual(messages(tests, 'components/widget.tests.stories.tsx'), [])
})

test('passes a meta exported directly, a pattern, and an EXTRAS file', () => {
  const direct = main().replace(
    /const meta = ([\s\S]*?) satisfies Meta\nexport default meta/,
    'export default $1',
  )
  assert.deepEqual(messages(direct), [])
  assert.deepEqual(
    messages(main({ title: 'Patterns/LoginForm' }), 'patterns/login-form.stories.tsx'),
    [],
  )
  const link = `const meta = { title: 'Components/Button/ButtonLink' }
export default meta
export const Default = {}`
  assert.deepEqual(messages(link, 'components/button-link.stories.tsx'), [])
})

test('treats a hooks main file as needing only its title and the floor', () => {
  const hook = `const meta = { title: 'Hooks/useThing' }
export default meta
export const Basic = { name: 'Basic use' }`
  assert.deepEqual(messages(hook, 'hooks/use-thing.stories.tsx'), [])
})

// ─── Shapes that must fail ──────────────────────────────────────────────────

test('fails a story kind the standard does not have', () => {
  assert.equal(kindOf('widget.examples.stories.tsx'), null)
  assert.match(messages(main(), 'components/widget.examples.stories.tsx')[0], /not a story kind/)
})

test('fails a title that is not Components/<ExportName>', () => {
  assert.match(messages(main({ title: 'Components/Alert Dialog' }))[0], /export name/)
  assert.match(messages(main({ title: 'Components/Widget/Extra' }))[0], /should be "Components/)
  assert.match(
    messages(main({ title: 'Components/LoginForm' }), 'patterns/login-form.stories.tsx')[0],
    /should be "Patterns\//,
  )
  const link = `const meta = { title: 'Components/ButtonLink' }
export default meta`
  assert.match(
    messages(link, 'components/button-link.stories.tsx')[0],
    /Components\/Button\/ButtonLink/,
  )
})

test('fails a main file missing Default or Playground', () => {
  const failures = messages(main({ stories: 'export const Default: Story = {}' }))
  assert.ok(failures.some((m) => /export a Playground story/.test(m)))
})

test('fails a main file on the generated autodocs page', () => {
  assert.ok(messages(main({ docs: '' })).some((m) => /docs\.page/.test(m)))
  assert.ok(messages(main({ tags: '[]' })).some((m) => /'autodocs'/.test(m)))
})

test('fails a docs page not built from the kit, unless it is the reference', () => {
  const source = main()
    .replace(/<DocsUsage[^>]*\/>/, '')
    .replace('<DocsApi />', '')
  const failures = messages(source)
  assert.ok(failures.some((m) => /<DocsUsage>/.test(m)))
  assert.ok(failures.some((m) => /<DocsApi>/.test(m)))
  assert.deepEqual(
    messages(
      source.replace("'Components/Widget'", "'Components/Button'"),
      'components/button.stories.tsx',
    ),
    [],
  )
})

test('fails a sibling file under the wrong title, or with no main file', () => {
  const misfiled = `const meta = { title: 'Components/Widget' }
export default meta`
  assert.ok(
    messages(misfiled, 'components/widget.features.stories.tsx').some((m) =>
      /Components\/<Name>\/Features/.test(m),
    ),
  )
  const orphan = `const meta = { title: 'Components/Widget/Accessibility' }
export default meta`
  assert.ok(
    messages(orphan, 'components/widget.accessibility.stories.tsx', {
      hasMain: () => false,
    }).some((m) => /no widget\.stories\.tsx/.test(m)),
  )
})

test('fails a tests file that shows in the sidebar', () => {
  const visible = `const meta = { title: 'Components/Widget/Tests', tags: ['!autodocs'] }
export default meta`
  assert.ok(messages(visible, 'components/widget.tests.stories.tsx').some((m) => /'!dev'/.test(m)))
})

test('fails an accessibility story not named for its criterion', () => {
  const a11y = `const meta = { title: 'Components/Widget/Accessibility' }
export default meta
export const Numbered = { name: '1.3.1 Info and Relationships' }
export const Unnamed = {}`
  const failures = messages(a11y, 'components/widget.accessibility.stories.tsx')
  assert.equal(failures.filter((m) => /<WCAG title> — <criterion>/.test(m)).length, 2)
})

test('fails a component or pattern without Features and Accessibility files', () => {
  const failures = missingSiblings('components', ['widget.tsx', 'widget.stories.tsx'])
  assert.equal(failures.length, 2)
  assert.ok(failures.some((m) => /widget\.features\.stories\.tsx/.test(m)))
  assert.ok(failures.some((m) => /widget\.accessibility\.stories\.tsx/.test(m)))
  assert.deepEqual(
    missingSiblings('components', [
      'widget.stories.tsx',
      'widget.features.stories.tsx',
      'widget.accessibility.stories.tsx',
      'button-link.stories.tsx',
    ]),
    [],
  )
  assert.deepEqual(missingSiblings('hooks', ['use-thing.stories.tsx']), [])
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

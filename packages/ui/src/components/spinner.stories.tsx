/**
 * Spinner — a busy-state indicator for work in flight.
 *
 *   Components/Spinner                → this file: Docs, Default, Playground
 *                                       and the label-naming stories
 *   Components/Spinner/Features       → spinner.features.stories.tsx
 *   Components/Spinner/Accessibility  → spinner.accessibility.stories.tsx
 *   Components/Spinner/Tests          → spinner.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button.js'
import { Spinner } from './spinner.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const colors = ['primary', 'accent', 'white', 'current'] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description={
        <>
          A medium <code>primary</code> spinner, named &ldquo;Loading&rdquo; for screen readers with
          no props at all.
        </>
      }
    >
      <Example code={`<Spinner />`}>
        <ExampleCell label='md · primary'>
          <Spinner />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          Five fixed diameters, from <code>xs</code> (12px) to <code>xl</code> (40px). They do not
          scale with the text around them. Use <code>md</code> for most regions and <code>lg</code>{' '}
          or <code>xl</code> when the spinner stands in for a whole panel.
        </>
      }
    >
      <Example code={`<Spinner size="lg" />`}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <Spinner size={size} label={`Loading (${size})`} />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          <code>primary</code> suits most pages and <code>accent</code> an accent surface.{' '}
          <code>current</code> takes the colour of the text around it, dimming the track from the
          same hue. <code>white</code> is for dark or coloured surfaces only — on a light page it
          all but disappears.
        </>
      }
    >
      <Example code={`<Spinner color="accent" />`}>
        {(['primary', 'accent', 'current'] as const).map((color) => (
          <ExampleCell key={color} label={color}>
            <Spinner color={color} size='lg' />
          </ExampleCell>
        ))}
      </Example>
      <Example surface='brand' code={`<Spinner color="white" />`}>
        <ExampleCell label='white'>
          <Spinner color='white' size='lg' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function UsageSection() {
  return (
    <ExampleSection
      title='Usage'
      description={
        <>
          A Spinner is named out of the box: <code>label</code> defaults to &quot;Loading&quot; and
          renders as visually-hidden text inside a <code>role=&quot;status&quot;</code> region, so
          assistive tech announces it politely when the spinner appears. Set <code>label</code> to
          describe what is loading, or to an empty string when the surroundings already convey the
          busy state — that drops the live region rather than leaving an empty one.
        </>
      }
    >
      <Example
        code={`<Spinner label="Loading results" />
<span>Loading results…</span>`}
      >
        <div className='flex items-center gap-3'>
          <Spinner label='Loading results' />
          <span className='text-base text-foreground'>Loading results…</span>
        </div>
      </Example>
      <Example code={`<Spinner label="Loading your applications" />`}>
        <ExampleCell label='default — “Loading”'>
          <Spinner />
        </ExampleCell>
        <ExampleCell label='label="Loading your applications"'>
          <Spinner label='Loading your applications' />
        </ExampleCell>
        <ExampleCell label='label="" — no live region'>
          <Spinner label='' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InAButtonSection() {
  return (
    <ExampleSection
      title='In a button'
      description={
        <>
          Don&apos;t put a Spinner in a Button by hand. Button&apos;s <code>loading</code> prop
          shows one, keeps the label, blocks interaction and marks the button busy for you.
        </>
      }
    >
      <Example code={`<Button loading>Submitting</Button>`}>
        <ExampleCell label='Button loading'>
          <Button loading>Submitting</Button>
        </ExampleCell>
        <ExampleCell label='outline'>
          <Button loading variant='outline'>
            Refreshing
          </Button>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A region loading its content, with the spinner centred in a placeholder sized like what will arrive.'
    >
      <Example
        layout='fill'
        code={`<div className="flex h-48 items-center justify-center">
  <Spinner size="lg" label="Loading your applications" />
</div>`}
      >
        <div className='space-y-4'>
          <p className='text-2xl font-semibold'>Your applications</p>
          <div className='flex h-48 items-center justify-center rounded-md ring-1 ring-foreground/10'>
            <Spinner size='lg' label='Loading your applications' />
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SpinnerDocs() {
  return (
    <DocsPage
      title='Spinner'
      npm='Spinner'
      registry='spinner'
      summary={
        <>
          Spinner is a busy-state indicator for in-flight asynchronous work. Use it to communicate
          that the page or a region is loading content, submitting a form, or otherwise waiting on a
          response before the result can be shown.
        </>
      }
    >
      <DocsUsage
        use={[
          'A region waiting on a response before it can show anything.',
          'A short wait of unknown length after an action.',
          'Inside custom controls that have no loading state of their own.',
        ]}
        avoid={[
          'A button that is submitting — use Button’s loading prop.',
          'The wait has a known length or steps — use Progress.',
          'Content with a known shape is loading — use Skeleton, so the layout does not jump.',
        ]}
      />
      <DefaultSection />
      <SizesSection />
      <UsageSection />
      <ColoursSection />
      <InAButtonSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      page: SpinnerDocs,
      description: {
        component:
          'Spinner is a compact busy-state indicator for in-flight asynchronous work. It announces loading politely via role="status", naming itself from the `label` prop (default "Loading") rendered as visually-hidden text — no consumer wiring required.',
      },
    },
  },
  // No `aria-label` here. It used to be a meta-level arg, which made every
  // story — including the docs examples — look as though a consumer must supply
  // one. The component names itself from `label` (default "Loading"), so the
  // default story now exercises that path instead. It also removed a real axe
  // violation: with `label=""` the root drops role="status", and an inherited
  // aria-label on the resulting role-less <span> is aria-prohibited-attr.
  args: {
    size: 'md',
    color: 'primary',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes,
      description:
        'Diameter preset for the spinner. Maps to fixed Tailwind size utilities (xs=12px through xl=40px).',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'inline-radio',
      options: colors,
      description:
        'Colour of the arc and track. `primary` and `accent` use the masterbrand theme; `white` is for dark or coloured surfaces; `current` follows the surrounding text colour.',
      table: { category: 'Appearance' },
    },
    svgClassName: {
      control: false,
      description: 'Classes for the inner svg, where sizing and colour live.',
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      description:
        'Accessible name for the role="status" live region, rendered as visually-hidden text. Defaults to "Loading" — a Spinner is named out of the box and needs no consumer wiring. Set it to describe what is loading (e.g. "Loading results"), or to an empty string to suppress the live region entirely when the surroundings already convey the busy state (inside a Button, whose aria-busy says it).',
      table: { category: 'Accessibility', defaultValue: { summary: 'Loading' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Optional override. Passed straight through to the root element, where it wins over the `label` text for the accessible name. Prefer `label` — it is the supported API and keeps the name in the live region contents.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  // Exercises the component's OWN naming path, with no `aria-label` in args.
  // The previous version passed `aria-label` in args and then asserted the DOM
  // carried it back — `aria-label` is a pass-through prop that the component
  // never reads or transforms, so that assertion only proved object spread
  // works. It could not fail, and it left `label` (the real API, which has a
  // default and renders the sr-only text) with no coverage at all.
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')

    if (!status) {
      throw new Error('Could not find element with role="status".')
    }

    if (status.hasAttribute('aria-label')) {
      throw new Error(
        `A default Spinner must not set aria-label — it names itself with sr-only text. Received "${status.getAttribute('aria-label')}".`,
      )
    }

    // With no aria-label, role="status" takes its accessible name from its
    // contents, which is the sr-only span carrying the default label.
    if (status.textContent?.trim() !== 'Loading') {
      throw new Error(
        `Expected the default label "Loading" as the accessible name, received "${status.textContent?.trim()}".`,
      )
    }
  },
}

export const CustomLabel: Story = {
  name: 'Custom label',
  args: { label: 'Loading results' },
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')
    if (!status) {
      throw new Error('Could not find element with role="status".')
    }
    if (status.textContent?.trim() !== 'Loading results') {
      throw new Error(
        `Expected the label prop to drive the accessible name, received "${status.textContent?.trim()}".`,
      )
    }
  },
}

export const SuppressedLabel: Story = {
  name: 'Suppressed label',
  // `label=""` is the documented escape hatch for a Spinner whose busy state is
  // already conveyed by its surroundings (a Button's aria-busy, a toast). It
  // must drop role="status" entirely — an empty live region is redundant noise,
  // not a silent one.
  args: { label: '' },
  play: async ({ canvasElement }) => {
    if (canvasElement.querySelector('[role="status"]')) {
      throw new Error(
        'label="" must suppress role="status" rather than leave an empty live region.',
      )
    }
    if (canvasElement.querySelector('.sr-only')) {
      throw new Error('label="" must render no sr-only text.')
    }
  },
}

export const AriaLabelOverride: Story = {
  name: 'aria-label override',
  // Supplying aria-label is still supported — it wins over the contents for the
  // accessible name. Asserted as an OVERRIDE of the default path above, not as
  // the component's naming requirement.
  args: { 'aria-label': 'Loading search results' },
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')
    if (!status) {
      throw new Error('Could not find element with role="status".')
    }
    if (status.getAttribute('aria-label') !== 'Loading search results') {
      throw new Error(
        `Expected the aria-label override to reach the DOM, received "${status.getAttribute('aria-label')}".`,
      )
    }
  },
}

export const Playground: Story = {}

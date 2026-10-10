/**
 * Separator — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Separator                → this file: Docs, Default, Playground
 *                                         and one story per docs section
 *   Components/Separator/Tests          → separator.tests.stories.tsx
 *   Components/Separator/Accessibility  → separator.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Link } from './link.js'
import { Separator } from './separator.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function OrientationSection() {
  return (
    <ExampleSection
      title='Orientation'
      description={
        <>
          A horizontal separator fills the width of its container. A vertical one fills the height
          of a flex or grid row, so its parent needs a height — or <code>items-stretch</code> — for
          it to show.
        </>
      }
    >
      <Example layout='grid' code={`<Separator orientation="vertical" />`}>
        <ExampleCell label='horizontal'>
          <div className='w-64 space-y-3'>
            <p>Personal details</p>
            <Separator />
            <p>Contact details</p>
          </div>
        </ExampleCell>
        <ExampleCell label='vertical'>
          <div className='flex h-8 items-stretch gap-4'>
            <span className='flex items-center'>Licences</span>
            <Separator orientation='vertical' />
            <span className='flex items-center'>Permits</span>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function DecorativeSection() {
  return (
    <ExampleSection
      title='Decorative'
      description={
        <>
          By default a separator is announced as a boundary (<code>role=&quot;separator&quot;</code>
          ). Pass <code>decorative</code> when the line only tidies the layout and the content
          either side is already grouped another way — headings, lists or landmarks — so assistive
          technology is not told about a boundary twice.
        </>
      }
    >
      <Example layout='grid' code={`<Separator decorative />`}>
        <ExampleCell label='semantic (default)'>
          <div className='w-64 space-y-3'>
            <p>Your application</p>
            <Separator />
            <p>Supporting documents</p>
          </div>
        </ExampleCell>
        <ExampleCell label='decorative'>
          <div className='w-64 space-y-3'>
            <p className='font-semibold'>Payment</p>
            <Separator decorative />
            <p>Pay the $95 application fee by card.</p>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Horizontal separators split the sections of an application summary; vertical ones divide a row of footer links.'
    >
      <Example layout='fill'>
        <div className='max-w-md space-y-4 rounded-md p-6 ring-1 ring-foreground/10'>
          <div className='space-y-1'>
            <p className='font-semibold'>Applicant</p>
            <p className='text-muted-foreground'>Alex Nguyen, Parramatta NSW 2150</p>
          </div>
          <Separator />
          <div className='space-y-1'>
            <p className='font-semibold'>Licence</p>
            <p className='text-muted-foreground'>Recreational fishing licence, 1 year</p>
          </div>
          <Separator />
          <div className='space-y-1'>
            <p className='font-semibold'>Fee</p>
            <p className='text-muted-foreground'>$40.00</p>
          </div>
        </div>
      </Example>
      <Example layout='fill'>
        <nav aria-label='Legal' className='flex h-7 flex-wrap items-stretch gap-4'>
          <Link href='#privacy' className='self-center'>
            Privacy
          </Link>
          <Separator orientation='vertical' decorative />
          <Link href='#copyright' className='self-center'>
            Copyright
          </Link>
          <Separator orientation='vertical' decorative />
          <Link href='#accessibility' className='self-center'>
            Accessibility
          </Link>
        </nav>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SeparatorDocs() {
  return (
    <DocsPage
      title='Separator'
      npm='Separator'
      registry='separator'
      summary={
        <>
          A one-pixel rule, horizontal or vertical, that splits related content into groups — the
          hairline the system draws in place of a shadow. It is announced as a boundary unless
          marked <strong>decorative</strong>.
        </>
      }
    >
      <DocsUsage
        use={[
          'Splitting the sections of a summary, card or panel.',
          'Dividing groups of items in a menu or a row of links.',
          'Marking a boundary that whitespace alone would leave unclear.',
        ]}
        avoid={[
          'A divider with a word in it, like “or” between sign-in methods — use LabeledSeparator.',
          'Separating top-level page sections — use Section with divider.',
          'Grouping form fields under a heading — use FieldSet.',
        ]}
      />
      <OrientationSection />
      <DecorativeSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SeparatorDocs },
  },
  args: {
    orientation: 'horizontal',
    decorative: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Axis the rule is drawn along — horizontal fills the width, vertical fills the height.',
      table: { category: 'Appearance' },
    },
    decorative: {
      control: 'boolean',
      description:
        'Hide the rule from assistive technology (`role="none"`). Off, it is announced as a separator.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const separator = canvasElement.querySelector('[data-slot="separator"]')
    if (!separator) {
      throw new Error('Could not find an element with [data-slot="separator"].')
    }
    const orientation = separator.getAttribute('data-orientation')
    const expected = args.orientation ?? 'horizontal'
    if (orientation !== expected) {
      throw new Error(`Expected data-orientation="${expected}", received "${orientation}".`)
    }
  },
}

export const Playground: Story = {}

export const Orientation: Story = { name: 'Orientation', render: () => <OrientationSection /> }

export const Decorative: Story = { name: 'Decorative', render: () => <DecorativeSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

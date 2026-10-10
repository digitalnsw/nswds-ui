/**
 * Badge — follows docs/reference-storybook-standard.md.
 *
 *   Components/Badge        → this file: Docs, Default, Playground and one
 *                             story per docs section
 *   Components/Badge/Tests  → badge.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { IconCheck } from '../icons/check.js'
import { Badge } from './badge.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const variants = ['solid', 'soft', 'surface', 'outline'] as const
const sizes = ['sm', 'default', 'lg'] as const
const colors = [
  'primary',
  'tertiary',
  'accent',
  'grey',
  'success',
  'warning',
  'danger',
  'white',
  'secondary',
] as const

function ColourRow({ color }: { color: (typeof colors)[number] }) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <span className='w-24 shrink-0 font-semibold'>{color}</span>
      {variants.map((variant) => (
        <Badge key={variant} color={color} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description='Soft is the quiet default. Solid adds emphasis; surface and outline add a visible border for busy or tinted backgrounds.'
    >
      <Example code={`<Badge variant="outline">New</Badge>`}>
        {variants.map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <Badge variant={variant}>New</Badge>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description='Every size keeps 16px text; only the padding changes. Use default for most content and sm where space is tight.'
    >
      <Example code={`<Badge size="sm" color="success" dot>Approved</Badge>`}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <Badge size={size} color='success' dot>
              Approved
            </Badge>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Badge shares Button&apos;s colour roles. Primary, tertiary and accent follow the brand
          theme and grey is neutral; success, warning and danger keep their meaning in every theme;{' '}
          <code>white</code> and <code>secondary</code> are for dark surfaces.
        </>
      }
    >
      <Example layout='stack' code={`<Badge color="tertiary" variant="surface">Surface</Badge>`}>
        {(['primary', 'tertiary', 'accent', 'grey'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack' code={`<Badge color="warning">Pending</Badge>`}>
        {(['success', 'warning', 'danger'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
      <Example layout='stack' surface='brand' code={`<Badge color="white">New</Badge>`}>
        {(['white', 'secondary'] as const).map((color) => (
          <ColourRow key={color} color={color} />
        ))}
      </Example>
    </ExampleSection>
  )
}

function WithIconsSection() {
  return (
    <ExampleSection
      title='With icons'
      description='One decorative icon can sit before the label. The label still carries the meaning, so hide the icon from screen readers.'
    >
      <Example code={`<Badge color="success"><IconCheck aria-hidden /> Approved</Badge>`}>
        <Badge color='success'>
          <IconCheck aria-hidden /> Approved
        </Badge>
      </Example>
    </ExampleSection>
  )
}

function StatusSection() {
  return (
    <ExampleSection
      title='Status'
      description={
        <>
          Pair a status colour with a written label. The optional <code>dot</code> reinforces the
          status and is hidden from screen readers, so never rely on it alone.
        </>
      }
    >
      <Example code={`<Badge color="success" dot>Approved</Badge>`}>
        <ExampleCell label='success'>
          <Badge color='success' dot>
            Approved
          </Badge>
        </ExampleCell>
        <ExampleCell label='warning'>
          <Badge color='warning' dot>
            Pending
          </Badge>
        </ExampleCell>
        <ExampleCell label='danger'>
          <Badge color='danger' dot>
            Declined
          </Badge>
        </ExampleCell>
        <ExampleCell label='grey'>
          <Badge color='grey' dot>
            Draft
          </Badge>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function CountsSection() {
  return (
    <ExampleSection
      title='Counts'
      description='Place a count beside the content it describes. A number on its own does not say what is being counted.'
    >
      <Example code={`<span>Applications <Badge color="grey">3</Badge></span>`}>
        <span className='inline-flex items-center gap-2'>
          Applications <Badge color='grey'>3</Badge>
        </span>
        <span className='inline-flex items-center gap-2'>
          Unread messages <Badge>99+</Badge>
        </span>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Keep the badge beside the item whose status it describes.'
    >
      <Example layout='fill' surface='subtle'>
        <article className='max-w-xl space-y-4 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-lg font-semibold'>Community garden grant</p>
            <Badge color='success' dot>
              Approved
            </Badge>
          </div>
          <p className='text-muted-foreground'>
            Your application has been approved. We will email you the funding agreement.
          </p>
          <p className='text-muted-foreground'>Application reference: CG-1042</p>
        </article>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function BadgeDocs() {
  return (
    <DocsPage
      title='Badge'
      npm={['Badge', 'badgeVariants']}
      registry='badge'
      summary={
        <>
          Badges show a status or a count beside related content. They are informational: a badge
          has no hover, press or focus treatment and cannot be selected.
        </>
      }
    >
      <DocsUsage
        use={[
          'The status of an application, payment or request — Approved, Pending, Declined.',
          'A count beside the content it counts, such as unread messages.',
          'A short “New” or “Updated” marker on a listing.',
        ]}
        avoid={[
          'Labelling a category or topic, or filtering by one — use Tag.',
          'Explaining a problem or a next step in a sentence or more — use Callout.',
          'Anything a person should be able to press — use Button or Tag.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <ColoursSection />
      <WithIconsSection />
      <StatusSection />
      <CountsSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: BadgeDocs },
  },
  args: { children: 'New', variant: 'soft', color: 'primary', size: 'default', dot: false },
  argTypes: {
    children: {
      control: 'text',
      description: 'Short status or count label.',
      table: { category: 'Content' },
    },
    dot: {
      control: 'boolean',
      description: 'Decorative dot beside the visible label. Hidden from screen readers.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Surface treatment.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Colour role shared with Button. White and secondary need a dark surface.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Padding step. Text is 16px at every size.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[data-slot=badge]')
    await expect(badge).toHaveTextContent('New')
    await expect(badge).toHaveAttribute('data-variant', 'soft')
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const Status: Story = { name: 'Status', render: () => <StatusSection /> }

export const Counts: Story = { name: 'Counts', render: () => <CountsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

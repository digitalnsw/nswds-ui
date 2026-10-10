/**
 * Collapsible — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Collapsible        → this file: Docs, Default, Playground and
 *                                   one story per docs section
 *   Components/Collapsible/Tests  → collapsible.tests.stories.tsx
 *
 * Base UI owns the disclosure ARIA wiring (aria-expanded / aria-controls) and
 * keyboard handling; the stories only style the trigger and panel.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { IconExpandMore } from '../icons/expand-more.js'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const triggerClasses =
  'group flex w-full items-center justify-between gap-4 rounded-sm px-3 py-2 text-start font-semibold text-primary hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
const panelClasses = 'px-3 pt-2 pb-3 text-foreground'

function Chevron() {
  return (
    <IconExpandMore
      aria-hidden='true'
      className='size-6 shrink-0 group-data-[panel-open]:rotate-180 motion-safe:transition-transform'
    />
  )
}

function Disclosure({ defaultOpen, label }: { defaultOpen?: boolean; label: string }) {
  return (
    <Collapsible defaultOpen={defaultOpen} className='w-80'>
      <CollapsibleTrigger className={triggerClasses}>
        {label}
        <Chevron />
      </CollapsibleTrigger>
      <CollapsibleContent className={panelClasses}>
        Bring photo ID and proof of your NSW address.
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          A collapsible starts closed. Pass <code>defaultOpen</code> to start it open when most
          people will need what is inside. The panel only mounts while open.
        </>
      }
    >
      <Example
        code={`<Collapsible defaultOpen>
  <CollapsibleTrigger>What to bring</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>`}
      >
        <ExampleCell label='closed (default)'>
          <Disclosure label='What to bring' />
        </ExampleCell>
        <ExampleCell label='defaultOpen'>
          <Disclosure label='What to bring' defaultOpen />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ControlledExample() {
  const [open, setOpen] = useState(false)
  return (
    <div className='w-80 space-y-3'>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className={triggerClasses}>
          Opening hours
          <Chevron />
        </CollapsibleTrigger>
        <CollapsibleContent className={panelClasses}>
          Monday to Friday, 8:30am to 5pm. Closed on public holidays.
        </CollapsibleContent>
      </Collapsible>
      <p className='text-muted-foreground'>The panel is {open ? 'open' : 'closed'}.</p>
    </div>
  )
}

function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          Pass <code>open</code> and <code>onOpenChange</code> to hold the state yourself — to open
          the panel from elsewhere on the page, or to remember it between visits.
        </>
      }
    >
      <Example
        code={`const [open, setOpen] = useState(false)

<Collapsible open={open} onOpenChange={setOpen}>…</Collapsible>`}
      >
        <ControlledExample />
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Optional detail tucked under an application summary, so the summary stays short for the people who do not need it.'
    >
      <Example layout='fill'>
        <div className='max-w-md space-y-3 rounded-md p-6 ring-1 ring-foreground/10'>
          <p className='font-semibold'>Recreational fishing licence</p>
          <p className='text-muted-foreground'>3 years · $85.00</p>
          <Collapsible>
            <CollapsibleTrigger className={triggerClasses}>
              Who is exempt from the fee
              <Chevron />
            </CollapsibleTrigger>
            <CollapsibleContent className={panelClasses}>
              You do not need to pay if you are under 18, or if you hold a Pensioner Concession
              Card.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function CollapsibleDocs() {
  return (
    <DocsPage
      title='Collapsible'
      npm={['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent']}
      registry='collapsible'
      summary={
        <>
          A single trigger that shows and hides one panel of content. Base UI wires up the
          disclosure semantics and keyboard support; you style the <strong>trigger</strong> and the{' '}
          <strong>panel</strong>.
        </>
      }
    >
      <DocsUsage
        use={[
          'One piece of optional detail most people can skip.',
          'A “Show more” for a long summary or list.',
          'An advanced-options panel under a short form.',
        ]}
        avoid={[
          'Several related sections that open and close together — use Accordion.',
          'Switching between parallel views of the same thing — use Tabs.',
          'Information everyone needs to read — show it on the page.',
        ]}
      />
      <StatesSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: CollapsibleDocs },
  },
  args: {
    defaultOpen: false,
    disabled: false,
    className: 'w-full max-w-md',
    children: [
      <CollapsibleTrigger key='trigger' className={triggerClasses}>
        What to bring
        <Chevron />
      </CollapsibleTrigger>,
      <CollapsibleContent key='content' className={panelClasses}>
        Bring photo ID and proof of your NSW address.
      </CollapsibleContent>,
    ],
  },
  argTypes: {
    children: {
      control: false,
      description: 'A CollapsibleTrigger and the CollapsibleContent it shows and hides.',
      table: { category: 'Content' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the panel starts open (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: 'boolean',
      description: 'Whether the panel is open (controlled). Pair with `onOpenChange`.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Stops the trigger from opening or closing the panel.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called when the panel opens or closes.',
      table: { category: 'Events' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="collapsible-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="collapsible-trigger"].')
    }
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Controlled: Story = { name: 'Controlled', render: () => <ControlledSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

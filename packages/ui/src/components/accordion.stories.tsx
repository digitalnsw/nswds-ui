/**
 * Accordion — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Accordion        → this file: Docs, Default, Playground and one
 *                                 story per docs section
 *   Components/Accordion/Tests  → accordion.tests.stories.tsx
 *
 * Base UI owns the open/close state, ARIA (aria-expanded / aria-controls) and
 * keyboard handling; the component only styles the trigger and panel.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionVariant,
} from './accordion.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

/** Three questions from a licence page, the first open. */
function LicenceQuestions({ variant }: { variant?: AccordionVariant }) {
  return (
    <Accordion variant={variant} defaultValue={['who']} className='max-w-md'>
      <AccordionItem value='who'>
        <AccordionTrigger>Who needs a licence</AccordionTrigger>
        <AccordionContent>
          Anyone fishing in NSW waters, including from the shore, unless they are exempt.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='cost'>
        <AccordionTrigger>How much it costs</AccordionTrigger>
        <AccordionContent>Fees depend on how long the licence lasts.</AccordionContent>
      </AccordionItem>
      <AccordionItem value='where'>
        <AccordionTrigger>Where to buy one</AccordionTrigger>
        <AccordionContent>Online, by phone, or at a Service NSW centre.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          <code>default</code> separates items with hairlines. <code>accent</code> slides a
          waratah-red rule in beside the open item, so it is clear which one is expanded.{' '}
          <code>band</code> sets every heading on a grey band, for FAQ and support pages that need
          strong grouping.
        </>
      }
    >
      <Example code={`<Accordion>…</Accordion>`}>
        <LicenceQuestions />
      </Example>
      <Example code={`<Accordion variant="accent">…</Accordion>`}>
        <LicenceQuestions variant='accent' />
      </Example>
      <Example code={`<Accordion variant="band">…</Accordion>`}>
        <LicenceQuestions variant='band' />
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          List an item’s <code>value</code> in <code>defaultValue</code> to start it open. A{' '}
          <code>disabled</code> item cannot be opened — say why nearby, or leave it out.
        </>
      }
    >
      <Example
        code={`<Accordion defaultValue={['status']}>
  <AccordionItem value="status">…</AccordionItem>
  <AccordionItem value="renew" disabled>…</AccordionItem>
</Accordion>`}
      >
        <Accordion defaultValue={['status']} className='max-w-md'>
          <AccordionItem value='status'>
            <AccordionTrigger>Application status</AccordionTrigger>
            <AccordionContent>Your application was received on 2 October.</AccordionContent>
          </AccordionItem>
          <AccordionItem value='renew' disabled>
            <AccordionTrigger>Renew your licence</AccordionTrigger>
            <AccordionContent>Renewal opens 30 days before your licence expires.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>
    </ExampleSection>
  )
}

function MultipleOpenSection() {
  return (
    <ExampleSection
      title='Multiple open'
      description={
        <>
          By default, opening one item closes the others. Add <code>multiple</code> when people are
          likely to compare answers side by side.
        </>
      }
    >
      <Example code={`<Accordion multiple defaultValue={['before', 'after']}>…</Accordion>`}>
        <Accordion multiple defaultValue={['before', 'after']} className='max-w-md'>
          <AccordionItem value='before'>
            <AccordionTrigger>Before you apply</AccordionTrigger>
            <AccordionContent>Check you have photo ID and proof of address.</AccordionContent>
          </AccordionItem>
          <AccordionItem value='after'>
            <AccordionTrigger>After you apply</AccordionTrigger>
            <AccordionContent>We will email you within 5 business days.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Frequently asked questions at the end of a service page. Panels hold rich content, and links inside them take the accordion’s link styling.'
    >
      <Example layout='fill'>
        <div className='max-w-xl space-y-4'>
          <p className='text-2xl font-bold'>Frequently asked questions</p>
          <Accordion>
            <AccordionItem value='lost'>
              <AccordionTrigger>What if I lose my licence card?</AccordionTrigger>
              <AccordionContent>
                <p>Your licence is still valid. You can carry a digital copy instead.</p>
                <p>
                  <a href='#replace'>Order a replacement card</a> online at any time.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='refund'>
              <AccordionTrigger>Can I get a refund?</AccordionTrigger>
              <AccordionContent>
                Licence fees are not refundable once the licence has started.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='visitor'>
              <AccordionTrigger>
                I am visiting from interstate. Do I need a licence?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Visitors need a NSW licence to fish in NSW waters.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function AccordionDocs() {
  return (
    <DocsPage
      title='Accordion'
      npm={['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent']}
      registry='accordion'
      summary={
        <>
          A stack of headings that each show and hide a section of content. Use it to shorten a long
          page of related information people read selectively. Give every{' '}
          <strong>AccordionItem</strong> a unique <code>value</code>.
        </>
      }
    >
      <DocsUsage
        use={[
          'Frequently asked questions on a service page.',
          'Related sections people only need some of, such as eligibility rules by situation.',
          'Long reference content on a narrow screen.',
        ]}
        avoid={[
          'One piece of optional detail — use Collapsible.',
          'Parallel views of the same content — use Tabs.',
          'Steps people must complete in order — use StepIndicator with separate pages.',
        ]}
      />
      <VariantsSection />
      <StatesSection />
      <MultipleOpenSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: AccordionDocs },
  },
  args: {
    variant: 'default',
    multiple: false,
    disabled: false,
    className: 'max-w-md',
    children: [
      <AccordionItem key='who' value='who'>
        <AccordionTrigger>Who needs a licence</AccordionTrigger>
        <AccordionContent>
          Anyone fishing in NSW waters, including from the shore, unless they are exempt.
        </AccordionContent>
      </AccordionItem>,
      <AccordionItem key='where' value='where'>
        <AccordionTrigger>Where to buy one</AccordionTrigger>
        <AccordionContent>Online, by phone, or at a Service NSW centre.</AccordionContent>
      </AccordionItem>,
    ],
  },
  argTypes: {
    children: {
      control: false,
      description: 'AccordionItem elements, each with a unique `value`.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'accent', 'band'],
      description: 'Visual treatment: hairlines, a red rule on the open item, or grey bands.',
      table: { category: 'Appearance' },
    },
    multiple: {
      control: 'boolean',
      description: 'Allow more than one item to be open at once.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable every item.',
      table: { category: 'Behavior' },
    },
    defaultValue: {
      control: 'object',
      description: 'Values of the items open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'object',
      description: 'Values of the open items (controlled). Pair with `onValueChange`.',
      table: { category: 'Behavior' },
    },
    onValueChange: {
      description: 'Called with the open values when an item opens or closes.',
      table: { category: 'Events' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>(
      '[data-slot="accordion-trigger"]',
    )
    if (!trigger) {
      throw new Error('Could not find [data-slot="accordion-trigger"].')
    }

    // Base UI owns the disclosure ARIA — assert it starts collapsed rather than
    // re-implementing the wiring.
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    // A real click must expand the section. Base UI toggles aria-expanded and
    // mounts the panel content.
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const panel = canvasElement.querySelector('[data-slot="accordion-content"]')
    await expect(panel).toBeInTheDocument()
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const MultipleOpen: Story = { name: 'Multiple open', render: () => <MultipleOpenSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

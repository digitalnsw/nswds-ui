/**
 * HoverCard — a rich preview surface shown on hover or focus, on the Base UI
 * preview-card primitive. Use it for link previews and other supplementary
 * content that should not steal focus.
 *
 *   Components/HoverCard        → this file: Docs, Default, Playground and one
 *                                 story per docs section
 *   Components/HoverCard/Tests  → hover-card.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, fn, within } from 'storybook/test'

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js'
import { Link } from './link.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

type Side = NonNullable<ComponentProps<typeof HoverCardContent>['side']>

const sides: Side[] = ['bottom', 'top', 'left', 'right']

/** The preview every example shows: what a reader will find behind the link. */
function AgencyPreview() {
  return (
    <div className='space-y-2'>
      <p className='text-base font-semibold'>Service NSW</p>
      <p className='text-base text-muted-foreground'>
        Apply for licences, permits and rebates online, by phone on 13 77 88, or at a service
        centre.
      </p>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function PlacementSection() {
  return (
    <ExampleSection
      title='Placement'
      description={
        <>
          <code>side</code> on <code>HoverCardContent</code> picks the edge of the trigger the card
          opens from. It is a preference: Base UI flips the card to keep it on screen. Hover or
          focus a link to open its card.
        </>
      }
    >
      <Example code={`<HoverCardContent side="right">…</HoverCardContent>`}>
        {sides.map((side) => (
          <ExampleCell key={side} label={`side="${side}"`}>
            <HoverCard>
              <HoverCardTrigger render={<Link href='#' />}>Service NSW ({side})</HoverCardTrigger>
              <HoverCardContent side={side}>
                <AgencyPreview />
              </HoverCardContent>
            </HoverCard>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A preview of where a link in running text goes, so a reader can decide whether to follow it. Everything in the card must also be reachable without it — a touch reader never sees a hover card.'
    >
      <Example
        code={`<HoverCard>
  <HoverCardTrigger render={<Link href="https://www.service.nsw.gov.au" />}>Service NSW</HoverCardTrigger>
  <HoverCardContent>…</HoverCardContent>
</HoverCard>`}
      >
        <p className='max-w-[65ch]'>
          You can renew your licence online, or visit{' '}
          <HoverCard>
            <HoverCardTrigger render={<Link href='#' />}>Service NSW</HoverCardTrigger>
            <HoverCardContent>
              <AgencyPreview />
            </HoverCardContent>
          </HoverCard>{' '}
          with your current licence and proof of address.
        </p>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function HoverCardDocs() {
  return (
    <DocsPage
      title='HoverCard'
      npm={['HoverCard', 'HoverCardTrigger', 'HoverCardContent']}
      registry='hover-card'
      summary={
        <>
          A preview card that opens when a reader hovers over or focuses a link, showing what is
          behind it without following it. It never takes focus and closes when the pointer or focus
          moves away. Base UI owns the timing and positioning.
        </>
      }
    >
      <DocsUsage
        use={[
          'Previewing a person, agency or page behind a link.',
          'Extra detail a sighted mouse reader may like, but nobody needs.',
          'Content that adds to a link without replacing what the link says.',
        ]}
        avoid={[
          'The content is needed to complete a task — put it on the page, or use Popover.',
          'A short label for an icon button — use Tooltip.',
          'The card would hold buttons or form fields — use Popover, which a click opens.',
        ]}
      />
      <PlacementSection />
      <InContextSection />
      <DocsApi description='Props of the HoverCard root, plus the side set on HoverCardContent. Try them live in the Playground story.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * The side is a prop of `HoverCardContent`, not of the root the meta documents,
 * so the args type is widened to let the Playground switch it.
 */
type StoryArgs = ComponentProps<typeof HoverCard> & { side?: Side }

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: HoverCardDocs },
  },
  args: {
    side: 'bottom',
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: sides,
      description: 'Set on HoverCardContent: the edge of the trigger the card opens from.',
      table: { category: 'Appearance' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the card is open on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Whether the card is open. Pair with onOpenChange to control it.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      description: 'Called when the card opens or closes (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    onOpenChangeComplete: {
      description: 'Called once the open or close transition has finished.',
      table: { category: 'Events' },
    },
    actionsRef: { table: { disable: true } },
    handle: { table: { disable: true } },
    triggerId: { table: { disable: true } },
    defaultTriggerId: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: ({ side, ...args }) => (
    <HoverCard {...args}>
      <HoverCardTrigger render={<Link href='#' />}>Service NSW</HoverCardTrigger>
      <HoverCardContent side={side}>
        <AgencyPreview />
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The trigger stays a real link: the card adds to it, never replaces it.
    const trigger = within(canvasElement).getByRole('link', { name: 'Service NSW' })
    await expect(trigger).toHaveAttribute('data-slot', 'hover-card-trigger')
    await expect(trigger).toHaveAttribute('href', '#')
  },
}

export const Playground: Story = {}

export const Placement: Story = { name: 'Placement', render: () => <PlacementSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

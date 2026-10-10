/**
 * Tabs — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Tabs        → this file: Docs, Default, Playground and one
 *                            story per docs section
 *   Components/Tabs/Tests  → tabs.tests.stories.tsx
 *
 * Base UI owns the roving-tabindex keyboard model, ARIA and active-panel
 * switching; the component styles the list, triggers and panels. Each
 * TabsTrigger pairs with a TabsContent sharing the same `value`.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

type ListVariant = 'default' | 'line' | 'fullwidth' | 'bordered'

/** The three tabs of a licence page, in the given list variant. */
function LicenceTabs({ variant }: { variant: ListVariant }) {
  return (
    <Tabs defaultValue='eligibility' className='w-full max-w-xl'>
      <TabsList variant={variant}>
        <TabsTrigger value='eligibility'>Eligibility</TabsTrigger>
        <TabsTrigger value='apply'>How to apply</TabsTrigger>
        <TabsTrigger value='fees'>Fees</TabsTrigger>
      </TabsList>
      <TabsContent value='eligibility' className='pt-2 text-base'>
        You must be 18 or older and live in NSW.
      </TabsContent>
      <TabsContent value='apply' className='pt-2 text-base'>
        Apply online with your MyServiceNSW Account.
      </TabsContent>
      <TabsContent value='fees' className='pt-2 text-base'>
        The fee depends on how long the licence lasts.
      </TabsContent>
    </Tabs>
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
          Set <code>variant</code> on <code>TabsList</code>; each trigger picks it up.{' '}
          <code>default</code> is a compact segmented control; <code>line</code> underlines the
          active tab on a full-width rule; <code>fullwidth</code> and <code>bordered</code> split
          the bar into equal columns, and scroll rather than clip when the labels stop fitting.
        </>
      }
    >
      <Example code={`<TabsList>…</TabsList>`}>
        <LicenceTabs variant='default' />
      </Example>
      <Example code={`<TabsList variant="line">…</TabsList>`}>
        <LicenceTabs variant='line' />
      </Example>
      <Example code={`<TabsList variant="fullwidth">…</TabsList>`}>
        <LicenceTabs variant='fullwidth' />
      </Example>
      <Example code={`<TabsList variant="bordered">…</TabsList>`}>
        <LicenceTabs variant='bordered' />
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
          A <code>disabled</code> trigger stays in the bar but cannot be selected, and the arrow
          keys skip it. Prefer leaving out a tab that will never apply.
        </>
      }
    >
      <Example code={`<TabsTrigger value="renew" disabled>Renew</TabsTrigger>`}>
        <Tabs defaultValue='details' className='w-full max-w-xl'>
          <TabsList variant='line'>
            <TabsTrigger value='details'>Licence details</TabsTrigger>
            <TabsTrigger value='history'>History</TabsTrigger>
            <TabsTrigger value='renew' disabled>
              Renew
            </TabsTrigger>
          </TabsList>
          <TabsContent value='details' className='pt-2 text-base'>
            Recreational fishing licence, valid until 30 June 2027.
          </TabsContent>
          <TabsContent value='history' className='pt-2 text-base'>
            First issued 1 July 2024.
          </TabsContent>
          <TabsContent value='renew' className='pt-2 text-base'>
            Renewal opens 30 days before your licence expires.
          </TabsContent>
        </Tabs>
      </Example>
    </ExampleSection>
  )
}

function VerticalSection() {
  return (
    <ExampleSection
      title='Vertical'
      description={
        <>
          <code>orientation=&quot;vertical&quot;</code> stacks the triggers beside the panel, and
          the Up and Down arrow keys move between them. Use it with the <code>line</code> or{' '}
          <code>default</code> list — the equal-column variants have no vertical form.
        </>
      }
    >
      <Example code={`<Tabs orientation="vertical" defaultValue="profile">…</Tabs>`}>
        <Tabs orientation='vertical' defaultValue='profile' className='w-full max-w-xl'>
          <TabsList variant='line'>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
          </TabsList>
          <TabsContent value='profile' className='ps-4 text-base'>
            Your name, date of birth and address.
          </TabsContent>
          <TabsContent value='notifications' className='ps-4 text-base'>
            Choose how we contact you about renewals.
          </TabsContent>
          <TabsContent value='security' className='ps-4 text-base'>
            Change your password and set up two-step verification.
          </TabsContent>
        </Tabs>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Account settings split across a bordered bar. Each panel is a self-contained task, so nobody needs to see two at once.'
    >
      <Example layout='fill'>
        <div className='max-w-2xl space-y-4'>
          <p className='text-2xl font-bold'>Account settings</p>
          <Tabs defaultValue='details'>
            <TabsList variant='bordered'>
              <TabsTrigger value='details'>My details</TabsTrigger>
              <TabsTrigger value='licences'>Licences</TabsTrigger>
              <TabsTrigger value='payments'>Payments</TabsTrigger>
            </TabsList>
            <TabsContent value='details' className='space-y-1 pt-4 text-base'>
              <p className='font-semibold'>Alex Nguyen</p>
              <p className='text-muted-foreground'>alex.nguyen@example.com</p>
            </TabsContent>
            <TabsContent value='licences' className='pt-4 text-base'>
              You hold 2 active licences.
            </TabsContent>
            <TabsContent value='payments' className='pt-4 text-base'>
              No payments are due.
            </TabsContent>
          </Tabs>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function TabsDocs() {
  return (
    <DocsPage
      title='Tabs'
      npm={['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent']}
      registry='tabs'
      summary={
        <>
          Parallel panels of content shown one at a time, switched with a row of triggers. Pair each{' '}
          <strong>TabsTrigger</strong> with a <strong>TabsContent</strong> of the same{' '}
          <code>value</code>, and give <code>Tabs</code> a <code>defaultValue</code>.
        </>
      }
    >
      <DocsUsage
        use={[
          'Parallel views of one thing that people rarely need side by side.',
          'Splitting account or settings pages into self-contained tasks.',
          'Switching the format of the same data, such as a table and a chart.',
        ]}
        avoid={[
          'Moving between pages, where each tab has its own URL — use TabNav.',
          'Content people need to compare or read in sequence — use headings, or Accordion.',
          'Steps that must be completed in order — use StepIndicator.',
        ]}
      />
      <VariantsSection />
      <StatesSection />
      <VerticalSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: TabsDocs },
  },
  args: {
    defaultValue: 'eligibility',
    orientation: 'horizontal',
    className: 'max-w-md',
    children: [
      <TabsList key='list'>
        <TabsTrigger value='eligibility'>Eligibility</TabsTrigger>
        <TabsTrigger value='apply'>How to apply</TabsTrigger>
      </TabsList>,
      <TabsContent key='eligibility' value='eligibility'>
        You must be 18 or older and live in NSW.
      </TabsContent>,
      <TabsContent key='apply' value='apply'>
        Apply online with your MyServiceNSW Account.
      </TabsContent>,
    ],
  },
  argTypes: {
    children: {
      control: false,
      description: 'A TabsList of TabsTriggers, and a TabsContent for each trigger’s `value`.',
      table: { category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Value of the tab selected on first render (uncontrolled).',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'text',
      description: 'Value of the selected tab (controlled). Pair with `onValueChange`.',
      table: { category: 'Behavior' },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Lay the triggers out in a row or a column; sets the arrow keys to match.',
      table: { category: 'Appearance' },
    },
    onValueChange: {
      description: 'Called with the new value when the selected tab changes.',
      table: { category: 'Events' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')
    await expect(triggers.length).toBe(2)

    // The first tab is active on mount — Base UI reflects it in data-selected /
    // aria-selected.
    await expect(triggers[0]).toHaveAttribute('aria-selected', 'true')

    // Activating the second tab must switch the visible panel. Base UI mounts
    // the matching panel and marks the trigger selected.
    await userEvent.click(triggers[1]!)
    await expect(triggers[1]).toHaveAttribute('aria-selected', 'true')

    // The matching panel becomes visible. findByText waits for the switch and
    // is agnostic to whether Base UI unmounts or just hides the inactive panel.
    const panel = await within(canvasElement).findByText(
      'Apply online with your MyServiceNSW Account.',
    )
    await expect(panel).toBeVisible()
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Vertical: Story = { name: 'Vertical', render: () => <VerticalSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

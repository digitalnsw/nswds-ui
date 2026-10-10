/**
 * LinkCard — follows docs/reference-storybook-standard.md.
 *
 *   Components/LinkCard        → this file: Docs, Default, Playground and one
 *                                story per docs section
 *   Components/LinkCard/Tests  → link-card.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LinkCard } from './link-card.js'
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

function ContentSection() {
  return (
    <ExampleSection
      title='Content'
      description={
        <>
          <code>title</code> is required: it is the card&apos;s heading and the link&apos;s
          accessible name. Add a short <code>label</code> above it for a category, date or type, and
          a <code>description</code> under it when the title alone does not say where the link goes.
        </>
      }
    >
      <Example
        layout='grid'
        surface='subtle'
        code={`<LinkCard href="/fishing-licence" label="Licences" title="Get a fishing licence"
  description="Buy a recreational fishing licence online." />`}
      >
        <ExampleCell label='label, title and description'>
          <LinkCard
            href='#fishing-licence'
            label='Licences'
            title='Get a fishing licence'
            description='Buy a recreational fishing licence online.'
          />
        </ExampleCell>
        <ExampleCell label='title and description'>
          <LinkCard
            href='#fishing-rules'
            title='Fishing rules'
            description='Bag and size limits for every species.'
          />
        </ExampleCell>
        <ExampleCell label='title only'>
          <LinkCard href='#fishing-closures' title='Fishing closures' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ExternalLinksSection() {
  return (
    <ExampleSection
      title='External links'
      description={
        <>
          Set <code>external</code> when the link leaves the site. The link opens in a new tab,
          screen readers hear &ldquo;opens in a new tab&rdquo;, and the corner arrow points outward.
        </>
      }
    >
      <Example
        layout='grid'
        surface='subtle'
        code={`<LinkCard external href="https://www.service.nsw.gov.au" title="Service NSW" />`}
      >
        <ExampleCell label='internal'>
          <LinkCard
            href='#help'
            title='Help with your application'
            description='Answers to common questions.'
          />
        </ExampleCell>
        <ExampleCell label='external'>
          <LinkCard
            href='https://www.service.nsw.gov.au'
            external
            title='Service NSW'
            description='Transactions and services across NSW Government.'
          />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A grid of related destinations. Each card stretches to the tallest in its row.'
    >
      <Example layout='fill' surface='subtle'>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <LinkCard
            href='#births'
            label='Life events'
            title='Register a birth'
            description='Register your baby within 60 days and apply for a birth certificate.'
          />
          <LinkCard
            href='#driving'
            label='Driving'
            title='Renew a driver licence'
            description='Renew online, at a service centre or by phone.'
          />
          <LinkCard
            href='#housing'
            label='Housing'
            title='Find rental assistance'
            description='Help with bond, advance rent and private rental costs.'
          />
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function LinkCardDocs() {
  return (
    <DocsPage
      title='LinkCard'
      npm='LinkCard'
      registry='link-card'
      summary={
        <>
          A card whose whole surface is one link. A single anchor is stretched over the card, so the
          accessibility tree sees exactly one link, named by the title — not three tab stops for one
          destination. It follows that the card cannot hold a second interactive element, and that
          its text is not drag-selectable.
        </>
      }
    >
      <DocsUsage
        use={[
          'A grid of destinations on a landing page — services, topics or life events.',
          'Promoting a related page at the end of an article.',
          'Linking out to another government site, with external.',
        ]}
        avoid={[
          'The card needs a second action, such as a button — compose Card by hand.',
          'A link within running text — use Link.',
          'The destination starts a task and should look like an action — use ButtonLink.',
        ]}
      />
      <ContentSection />
      <ExternalLinksSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: LinkCardDocs },
  },
  args: {
    href: '#fishing-licence',
    title: 'Get a fishing licence',
    label: 'Licences',
    description: 'Buy a recreational fishing licence online.',
    external: false,
    className: 'max-w-sm',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The card’s heading, and the link’s accessible name.',
      table: { category: 'Content' },
    },
    label: {
      control: 'text',
      description: 'Optional short kicker above the title — a category, date or type.',
      table: { category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Supporting copy under the title.',
      table: { category: 'Content' },
    },
    href: {
      control: 'text',
      description: 'Destination. Routed through Link, so LinkProvider applies.',
      table: { category: 'Behavior' },
    },
    external: {
      control: 'boolean',
      description:
        'Render the link as an ExternalLink — adds the new-tab treatment and swaps the corner glyph.',
      table: { category: 'Behavior' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof LinkCard>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCard(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="link-card"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="link-card"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const card = getCard(canvasElement)

    // The whole point of the component: exactly one link, whatever else the
    // card renders.
    const anchors = card.querySelectorAll('a')
    if (anchors.length !== 1) {
      throw new Error(`Expected exactly one anchor in the card, received ${anchors.length}.`)
    }

    const anchor = anchors[0]
    if (anchor?.getAttribute('href') !== args.href) {
      throw new Error(
        `Expected href="${String(args.href)}", received "${anchor?.getAttribute('href')}".`,
      )
    }

    // The corner glyph must be decorative — it is a duplicate affordance for a
    // link that already has an accessible name.
    const icon = card.querySelector('[data-slot="link-card-icon"]')
    if (icon?.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the corner icon to be aria-hidden.')
    }
  },
}

export const Playground: Story = {}

export const Content: Story = { name: 'Content', render: () => <ContentSection /> }

export const External: Story = { name: 'External links', render: () => <ExternalLinksSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

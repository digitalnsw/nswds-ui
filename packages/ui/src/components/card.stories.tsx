/**
 * Card — follows docs/reference-storybook-standard.md.
 *
 *   Components/Card                → this file: Docs, Default, Playground and
 *                                    one story per docs section
 *   Components/Card/Accessibility  → card.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { IconArrowForward } from '../icons/index.js'
import { Button, ButtonLink } from './button.js'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const sizes = ['default', 'sm'] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          <code>default</code> pads the card by 32px with 16px between regions; <code>sm</code>{' '}
          tightens that to 24px and 12px for dense lists and dashboards. Type does not change.
        </>
      }
    >
      <Example layout='grid' surface='subtle' code={`<Card size="sm">…</Card>`}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <Card size={size} className='w-full'>
              <CardHeader>
                <CardTitle>Renew your boat licence</CardTitle>
                <CardDescription>Licence BL-48213 expires on 30 June.</CardDescription>
              </CardHeader>
              <CardContent>Renew online in about 10 minutes.</CardContent>
            </Card>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function CompositionSection() {
  return (
    <ExampleSection
      title='Composition'
      description={
        <>
          Build a card from its parts: <code>CardHeader</code> holds the <code>CardTitle</code>,{' '}
          <code>CardDescription</code> and an optional <code>CardAction</code>, which sits top right
          across both header rows; <code>CardContent</code> and <code>CardFooter</code> follow. Keep{' '}
          <code>CardAction</code> a direct child of the header so the layout can find it.
        </>
      }
    >
      <Example
        surface='subtle'
        code={`<Card>
  <CardHeader>
    <CardTitle>Your applications</CardTitle>
    <CardDescription>Applications you started in the last 12 months.</CardDescription>
    <CardAction><Button size="sm" variant="outline">View all</Button></CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>`}
      >
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Your applications</CardTitle>
            <CardDescription>Applications you started in the last 12 months.</CardDescription>
            <CardAction>
              <Button size='sm' variant='outline'>
                View all
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>2 in progress, 1 waiting for documents and 4 completed.</CardContent>
          <CardFooter className='text-muted-foreground'>Updated 5 minutes ago</CardFooter>
        </Card>
      </Example>
      <Example
        surface='subtle'
        code={`<CardHeader>
  <CardTitle>Contact details</CardTitle>
  <CardAction>…</CardAction>
</CardHeader>`}
      >
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
            <CardAction>
              <Button size='sm' variant='outline'>
                Edit
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>alex.citizen@example.com · 0400 000 000</CardContent>
        </Card>
      </Example>
    </ExampleSection>
  )
}

function WithAnImageSection() {
  return (
    <ExampleSection
      title='With an image'
      description='An image placed as the card’s first child sits flush against the top edge, its corners following the card’s. The image sets its own aspect ratio; Card does not.'
    >
      <Example
        surface='subtle'
        code={`<Card>
  <img src="…" alt="" className="aspect-video w-full object-cover" />
  <CardHeader>…</CardHeader>
</Card>`}
      >
        <Card className='w-full max-w-sm'>
          <img
            src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60'
            alt=''
            className='aspect-video h-auto w-full object-cover'
          />
          <CardHeader>
            <CardTitle>Drought support for farmers</CardTitle>
            <CardDescription>Grants and loans for primary producers.</CardDescription>
          </CardHeader>
          <CardContent>Check what you can apply for in your region.</CardContent>
        </Card>
      </Example>
    </ExampleSection>
  )
}

function ContentOnlySection() {
  return (
    <ExampleSection
      title='Content only'
      description='For a compact summary tile, a card can hold just CardContent. It keeps the card’s padding, hairline and corners.'
    >
      <Example
        surface='subtle'
        code={`<Card>
  <CardContent>…</CardContent>
</Card>`}
      >
        <Card className='w-full max-w-md'>
          <CardContent>Your Working with Children Check is valid until 14 March 2029.</CardContent>
        </Card>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A row of service cards, each leading to the start of a task.'
    >
      <Example layout='fill' surface='subtle'>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Apply for a Working with Children Check</CardTitle>
              <CardDescription>For paid and volunteer work with children.</CardDescription>
            </CardHeader>
            <CardContent>It takes about 15 minutes. You will need proof of identity.</CardContent>
            <CardFooter>
              <ButtonLink href='#apply' trailingVisual={IconArrowForward}>
                Start now
              </ButtonLink>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Check your application status</CardTitle>
              <CardDescription>Use the reference number from your email.</CardDescription>
            </CardHeader>
            <CardContent>Most applications are processed within 5 working days.</CardContent>
            <CardFooter>
              <ButtonLink href='#status' variant='outline'>
                Check status
              </ButtonLink>
            </CardFooter>
          </Card>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function CardDocs() {
  return (
    <DocsPage
      title='Card'
      npm={[
        'Card',
        'CardHeader',
        'CardTitle',
        'CardDescription',
        'CardAction',
        'CardContent',
        'CardFooter',
      ]}
      registry='card'
      summary={
        <>
          A card groups related content on a white surface drawn with a hairline, not a shadow. It
          is composed from parts — header, title, description, action, content and footer — so a
          layout never needs ad-hoc wrappers.
        </>
      }
    >
      <DocsUsage
        use={[
          'Grouping a summary, its details and its actions — an application, a licence, an account.',
          'A dashboard of related figures or tasks.',
          'A set of services shown side by side.',
        ]}
        avoid={[
          'The whole card should be one link to another page — use LinkCard.',
          'Showing a message about the page or a task — use Callout.',
          'Laying out rows of data to compare — use Table or DescriptionList.',
        ]}
      />
      <SizesSection />
      <CompositionSection />
      <WithAnImageSection />
      <ContentOnlySection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: CardDocs },
  },
  args: {
    size: 'default',
    className: 'max-w-md',
    children: (
      <>
        <CardHeader>
          <CardTitle>Renew your boat licence</CardTitle>
          <CardDescription>Licence BL-48213 expires on 30 June.</CardDescription>
        </CardHeader>
        <CardContent>Renew online in about 10 minutes.</CardContent>
        <CardFooter className='text-muted-foreground'>Updated today</CardFooter>
      </>
    ),
  },
  argTypes: {
    children: {
      control: false,
      description: 'The card parts: CardHeader, CardContent, CardFooter, or a first-child image.',
      table: { category: 'Content' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Padding and gap step. Use `sm` for dense lists or compact dashboards.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="card"]')
    await expect(card).toHaveAttribute('data-size', 'default')
    await expect(card).toHaveTextContent('Renew your boat licence')
  },
}

export const Playground: Story = {}

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Composition: Story = { name: 'Composition', render: () => <CompositionSection /> }

export const WithImage: Story = { name: 'With an image', render: () => <WithAnImageSection /> }

export const ContentOnly: Story = { name: 'Content only', render: () => <ContentOnlySection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

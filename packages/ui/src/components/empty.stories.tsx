/**
 * Empty — follows docs/reference-storybook-standard.md.
 *
 *   Components/Empty        → this file: Docs, Default, Playground and one
 *                             story per docs section
 *   Components/Empty/Tests  → empty.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconFolderOpen } from '../icons/folder-open.js'
import { IconSearchOff } from '../icons/search-off.js'
import { Button } from './button.js'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty.js'
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

function MediaSection() {
  return (
    <ExampleSection
      title='Media'
      description={
        <>
          <code>EmptyMedia</code> holds an icon above the title.{' '}
          <code>variant=&quot;icon&quot;</code> sets a 24px icon on a 48px tile; the{' '}
          <code>default</code> variant adds no tile, so the icon or illustration sets its own size.
        </>
      }
    >
      <Example
        layout='grid'
        code={`<EmptyMedia variant="icon">
  <IconSearchOff aria-hidden="true" />
</EmptyMedia>`}
      >
        <ExampleCell label='variant="icon"'>
          <Empty className='border'>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <IconSearchOff aria-hidden='true' />
              </EmptyMedia>
              <EmptyTitle>No results</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </ExampleCell>
        <ExampleCell label='variant="default"'>
          <Empty className='border'>
            <EmptyHeader>
              <EmptyMedia>
                <IconFolderOpen aria-hidden='true' className='size-16 text-muted-foreground' />
              </EmptyMedia>
              <EmptyTitle>Nothing archived</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function WaysForwardSection() {
  return (
    <ExampleSection
      title='Ways forward'
      description={
        <>
          Say why it is empty and offer a next step. Put actions in <code>EmptyContent</code>; a
          bare link in <code>EmptyDescription</code> is underlined for you.
        </>
      }
    >
      <Example
        layout='grid'
        code={`<EmptyContent>
  <Button>Start an application</Button>
</EmptyContent>`}
      >
        <ExampleCell label='EmptyContent'>
          <Empty className='border'>
            <EmptyHeader>
              <EmptyTitle>No saved searches</EmptyTitle>
              <EmptyDescription>Save a search to get alerts about new results.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className='flex flex-wrap justify-center gap-2'>
                <Button variant='outline'>Learn more</Button>
                <Button>Search services</Button>
              </div>
            </EmptyContent>
          </Empty>
        </ExampleCell>
        <ExampleCell label='link in EmptyDescription'>
          <Empty className='border'>
            <EmptyHeader>
              <EmptyTitle>No results for “parking permit”</EmptyTitle>
              <EmptyDescription>
                Check the spelling, or try a shorter search. You can also{' '}
                <a href='#browse'>browse all services</a>.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function HeadingsSection() {
  return (
    <ExampleSection
      title='Headings'
      description={
        <>
          <code>EmptyTitle</code> renders a <code>div</code>, because the right heading level
          depends on where the empty state sits. Where it stands in for a section&apos;s content,
          put a heading inside it so it joins the page outline.
        </>
      }
    >
      <Example
        code={`<EmptyTitle>
  <h2>No applications yet</h2>
</EmptyTitle>`}
      >
        <Empty className='border'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <IconFolderOpen aria-hidden='true' />
            </EmptyMedia>
            {/* Shown without the heading so the specimen stays out of this page's outline. */}
            <EmptyTitle>No applications yet</EmptyTitle>
            <EmptyDescription>
              Applications you start are saved here, so you can come back to them later.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A dashboard section with nothing in it yet, on a muted surface instead of a dashed outline.'
    >
      <Example layout='fill'>
        <div className='space-y-4'>
          <p className='text-2xl font-semibold'>Your licences</p>
          <Empty className='bg-muted'>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <IconFolderOpen aria-hidden='true' />
              </EmptyMedia>
              <EmptyTitle>You have no licences linked to your account</EmptyTitle>
              <EmptyDescription>
                Link a licence to renew it and get reminders before it expires.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Link a licence</Button>
            </EmptyContent>
          </Empty>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function EmptyDocs() {
  return (
    <DocsPage
      title='Empty'
      npm={[
        'Empty',
        'EmptyHeader',
        'EmptyMedia',
        'EmptyTitle',
        'EmptyDescription',
        'EmptyContent',
        'emptyMediaVariants',
      ]}
      registry='empty'
      summary={
        <>
          An empty state: what a list, table or search shows when it has nothing to show. It says
          why it is empty and offers a way forward. Add a <code>border</code> class for a dashed
          outline — the dashed style is already set.
        </>
      }
    >
      <DocsUsage
        use={[
          'A search with no results.',
          'A list or table the person has not added anything to yet.',
          'A section of a dashboard with nothing to show.',
        ]}
        avoid={[
          'Content is still loading — use Skeleton or Spinner.',
          'Something went wrong — use Callout with status="danger".',
          'A whole page that does not exist — show a not-found page.',
        ]}
      />
      <MediaSection />
      <WaysForwardSection />
      <HeadingsSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: EmptyDocs },
  },
  args: {
    className: 'border',
    children: (
      <>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <IconFolderOpen aria-hidden='true' />
          </EmptyMedia>
          <EmptyTitle>
            <h2>No applications yet</h2>
          </EmptyTitle>
          <EmptyDescription>
            Applications you start are saved here, so you can come back to them later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Start an application</Button>
        </EmptyContent>
      </>
    ),
  },
  argTypes: {
    children: {
      control: false,
      description: 'EmptyHeader (media, title, description) and an optional EmptyContent.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'No applications yet' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Start an application' })).toBeEnabled()
  },
}

export const Playground: Story = {}

export const Media: Story = { name: 'Media', render: () => <MediaSection /> }

export const WaysForward: Story = { name: 'Ways forward', render: () => <WaysForwardSection /> }

export const Headings: Story = { name: 'Headings', render: () => <HeadingsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

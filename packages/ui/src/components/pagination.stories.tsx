/**
 * Pagination — links between the pages of a long list.
 *
 *   Components/Pagination                → this file: Docs, Default, Playground
 *   Components/Pagination/Features       → pagination.features.stories.tsx
 *   Components/Pagination/Accessibility  → pagination.accessibility.stories.tsx
 *   Components/Pagination/Tests          → pagination.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Link } from './link.js'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

/** Page links for `pages`, with `current` marked. */
function PageLinks({ pages, current }: { pages: number[]; current: number }) {
  return (
    <>
      {pages.map((page) => (
        <PaginationItem key={page}>
          <PaginationLink href={`?page=${page}`} isActive={page === current}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
    </>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Set <code>isActive</code> on the page being shown. It takes the outline treatment and is
          announced with <code>aria-current=&quot;page&quot;</code>; every other page link is a
          ghost button.
        </>
      }
    >
      <Example code={`<PaginationLink href="?page=2" isActive>2</PaginationLink>`}>
        <ExampleCell label='default'>
          <Pagination aria-label='Search results pages, idle link'>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink href='?page=2'>2</PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ExampleCell>
        <ExampleCell label='isActive'>
          <Pagination aria-label='Search results pages, current link'>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink href='?page=2' isActive>
                  2
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function WithEllipsisSection() {
  return (
    <ExampleSection
      title='With ellipsis'
      description={
        <>
          For a long run of pages, show the first and last pages and the neighbours of the current
          one, and stand a <code>PaginationEllipsis</code> in for each gap. It is decorative and
          hidden from assistive technology, so the gap is never announced.
        </>
      }
    >
      <Example
        code={`<PaginationItem>
  <PaginationEllipsis />
</PaginationItem>`}
      >
        <Pagination aria-label='Search results pages, long range'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='?page=4' />
            </PaginationItem>
            <PageLinks pages={[1]} current={5} />
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PageLinks pages={[4, 5, 6]} current={5} />
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PageLinks pages={[10]} current={5} />
            <PaginationItem>
              <PaginationNext href='?page=6' />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Example>
    </ExampleSection>
  )
}

export function FirstAndLastPagesSection() {
  return (
    <ExampleSection
      title='First and last pages'
      description={
        <>
          Previous and next have no disabled state. Leave out <code>PaginationPrevious</code> on the
          first page and <code>PaginationNext</code> on the last, rather than offering a link that
          goes nowhere. Their labels hide on narrow screens, leaving the chevron.
        </>
      }
    >
      <Example
        layout='stack'
        code={`{page > 1 && (
  <PaginationItem>
    <PaginationPrevious href={\`?page=\${page - 1}\`} />
  </PaginationItem>
)}`}
      >
        <ExampleCell label='first page'>
          <Pagination aria-label='Search results pages, first page'>
            <PaginationContent>
              <PageLinks pages={[1, 2, 3]} current={1} />
              <PaginationItem>
                <PaginationNext href='?page=2' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ExampleCell>
        <ExampleCell label='last page'>
          <Pagination aria-label='Search results pages, last page'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='?page=2' />
              </PaginationItem>
              <PageLinks pages={[1, 2, 3]} current={3} />
            </PaginationContent>
          </Pagination>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function LabelsSection() {
  return (
    <ExampleSection
      title='Previous and next labels'
      description={
        <>
          <code>PaginationPrevious</code> and <code>PaginationNext</code> show “Previous” and “Next”
          beside a chevron, and are named “Go to previous page” and “Go to next page”, which contain
          the words on screen. Change the words with <code>text</code>; when you do, pass an{' '}
          <code>aria-label</code> that contains them too, so speech-input users can say what they
          see.
        </>
      }
    >
      <Example
        code={`<PaginationPrevious href="?page=1" text="Newer" aria-label="Newer results" />
<PaginationNext href="?page=3" text="Older" aria-label="Older results" />`}
      >
        <ExampleCell label='default'>
          <Pagination aria-label='Search results pages, default labels'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='?page=1' />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='?page=3' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ExampleCell>
        <ExampleCell label='text + aria-label'>
          <Pagination aria-label='News pages'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='?page=1' text='Newer' aria-label='Newer results' />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='?page=3' text='Older' aria-label='Older results' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

const RESULTS = [
  'Apply for a Working with Children Check',
  'Renew a Working with Children Check',
  'Update your Working with Children Check details',
]

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          Under a page of search results. The landmark is named &quot;pagination&quot; by default;
          name it after what it pages through when a page has more than one.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Pagination aria-label="Search results pages">
  <PaginationContent>…</PaginationContent>
</Pagination>`}
      >
        <div className='max-w-2xl space-y-6'>
          <p className='text-muted-foreground'>Showing 11 to 20 of 42 results</p>
          <ul className='space-y-4'>
            {RESULTS.map((result) => (
              <li key={result}>
                <Link href='#result'>{result}</Link>
              </li>
            ))}
          </ul>
          <Pagination aria-label='Search results pages'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='?page=1' />
              </PaginationItem>
              <PageLinks pages={[1, 2, 3, 4, 5]} current={2} />
              <PaginationItem>
                <PaginationNext href='?page=3' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function PaginationDocs() {
  return (
    <DocsPage
      title='Pagination'
      npm={[
        'Pagination',
        'PaginationContent',
        'PaginationEllipsis',
        'PaginationItem',
        'PaginationLink',
        'PaginationNext',
        'PaginationPrevious',
      ]}
      registry='pagination'
      summary={
        <>
          Links between the pages of a long list, such as search results. Every page is a real link,
          rendered as a button: the page being shown is marked with <code>isActive</code>, and
          previous and next step one page either way.
        </>
      }
    >
      <DocsUsage
        use={[
          'Search results or a listing too long to show on one page.',
          'Lists where a reader may want to return to a particular page by its link.',
          'Long tables of records split into pages on the server.',
        ]}
        avoid={[
          'Stepping through the parts of a form or journey — use StepIndicator.',
          'Moving between the peer pages of a section — use TabNav.',
          'Switching between views of the same content — use Tabs.',
        ]}
      />
      <StatesSection />
      <WithEllipsisSection />
      <FirstAndLastPagesSection />
      <LabelsSection />
      <InContextSection />
      <DocsApi description='Props of Pagination, the nav landmark. The other parts take the props of the element they render; PaginationLink adds isActive and size.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: PaginationDocs },
  },
  argTypes: {
    'aria-label': {
      control: 'text',
      description:
        'Names the navigation landmark. Defaults to "pagination"; name it after what it pages through.',
      table: { category: 'Accessibility' },
    },
    children: {
      control: false,
      description: 'A PaginationContent list of PaginationItems.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='#prev' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#1'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#2' isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#3'>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='#next' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The landmark and its accessible name come from the component.
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="pagination"]')
    await expect(nav).toBeInTheDocument()
    await expect(nav).toHaveAttribute('aria-label', 'pagination')

    // Real anchors are rendered for each page.
    const links = canvasElement.querySelectorAll('[data-slot="pagination-link"]')
    await expect(links.length).toBeGreaterThanOrEqual(3)

    // The active page must be marked for assistive technology.
    const active = canvasElement.querySelector('[data-slot="pagination-link"][data-active="true"]')
    await expect(active).toHaveAttribute('aria-current', 'page')
  },
}

export const Playground: Story = {}

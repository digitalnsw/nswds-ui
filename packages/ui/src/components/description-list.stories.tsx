/**
 * DescriptionList — a <dl> of terms and their details.
 *
 *   Components/DescriptionList                → this file: Docs, Default, Playground
 *   Components/DescriptionList/Features       → description-list.features.stories.tsx
 *   Components/DescriptionList/Accessibility  → description-list.accessibility.stories.tsx
 *   Components/DescriptionList/Tests          → description-list.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment, type ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from './card.js'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from './description-list.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

const FACTS = [
  { term: 'Reference number', detail: 'WWC-2210-4471' },
  { term: 'Submitted', detail: '12 September 2026' },
  { term: 'Status', detail: 'In review' },
  { term: 'Check type', detail: 'Volunteer' },
]

function Facts() {
  return (
    <>
      {FACTS.map(({ term, detail }) => (
        <div key={term}>
          <DescriptionTerm>{term}</DescriptionTerm>
          <DescriptionDetails>{detail}</DescriptionDetails>
        </div>
      ))}
    </>
  )
}

/**
 * A full-width specimen with its label above it. A list fills its column, so
 * Button's centred cell would shrink it to its text.
 */
function Specimen({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className='w-full space-y-2'>
      <p className='text-base font-medium tracking-wide text-muted-foreground'>{label}</p>
      {children}
    </div>
  )
}

const layouts = [
  {
    layout: 'stacked',
    title: 'stacked',
    description:
      'The default. Each term sits above its detail in one column, so a long term is never truncated. Use it in narrow columns and on small screens.',
  },
  {
    layout: 'columns',
    title: 'columns',
    description:
      'Terms and details side by side from sm up, for a summary that is scanned down the left. It stacks again on narrow screens.',
  },
  {
    layout: 'inline',
    title: 'inline',
    description:
      'Facts in a row that wraps, like the strip of key facts under a page banner. Keep each detail short.',
  },
] as const

const pairCode = `  <div>
    <DescriptionTerm>Reference number</DescriptionTerm>
    <DescriptionDetails>WWC-2210-4471</DescriptionDetails>
  </div>`

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function LayoutsSection() {
  return (
    <ExampleSection
      title='Layouts'
      description={
        <>
          <code>stacked</code> (the default) puts each term above its detail in one column — it
          never truncates a long term. <code>columns</code> puts terms and details side by side from{' '}
          <code>sm</code> up. <code>inline</code> lays facts out in a row that wraps, like the strip
          under a page banner.
        </>
      }
    >
      <div className='space-y-10'>
        {layouts.map(({ layout, title, description }) => (
          <div key={layout} className='space-y-4'>
            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>{title}</h3>
              <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
                {description}
              </p>
            </div>
            <Example
              layout='fill'
              code={
                layout === 'stacked'
                  ? `<DescriptionList>\n${pairCode}\n</DescriptionList>`
                  : `<DescriptionList layout="${layout}">…</DescriptionList>`
              }
            >
              <DescriptionList layout={layout}>
                <Facts />
              </DescriptionList>
            </Example>
          </div>
        ))}
      </div>
    </ExampleSection>
  )
}

export function GroupingPairsSection() {
  return (
    <ExampleSection
      title='Grouping pairs'
      description={
        <>
          <code>columns</code> and <code>inline</code> place their own children, so wrap each term
          and its detail in one <code>div</code>. That is valid inside a <code>dl</code> and keeps
          the list semantics; without it the grid places every term and detail on its own, and pairs
          come apart where the row wraps. <code>stacked</code> reads the same either way.
        </>
      }
    >
      <Example
        layout='stack'
        className='gap-8'
        code={`<DescriptionList layout="inline">\n${pairCode}\n</DescriptionList>`}
      >
        <Specimen label='each pair wrapped in a div'>
          <DescriptionList layout='inline'>
            <Facts />
          </DescriptionList>
        </Specimen>
        <Specimen label='not wrapped — terms and details come apart'>
          <DescriptionList layout='inline'>
            {FACTS.map(({ term, detail }) => (
              <Fragment key={term}>
                <DescriptionTerm>{term}</DescriptionTerm>
                <DescriptionDetails>{detail}</DescriptionDetails>
              </Fragment>
            ))}
          </DescriptionList>
        </Specimen>
      </Example>
    </ExampleSection>
  )
}

const longFacts = [
  {
    term: 'Organisation receiving the grant',
    detail: 'Riverina Community Gardens Incorporated (ABN 12 345 678 901)',
  },
  {
    term: 'Purpose',
    detail:
      'Building raised garden beds and an accessible path so residents who use wheelchairs can take part.',
  },
]

export function LongContentSection() {
  return (
    <ExampleSection
      title='Long content'
      description={
        <>
          Terms and details wrap rather than truncate in every layout. In <code>columns</code> the
          term column takes the width it needs, so keep terms short and let the detail carry the
          length.
        </>
      }
    >
      <Example
        layout='stack'
        className='gap-8'
        code={`<DescriptionList layout="columns">…</DescriptionList>`}
      >
        {(['stacked', 'columns'] as const).map((layout) => (
          <Specimen key={layout} label={layout}>
            <DescriptionList layout={layout}>
              {longFacts.map(({ term, detail }) => (
                <div key={term}>
                  <DescriptionTerm>{term}</DescriptionTerm>
                  <DescriptionDetails>{detail}</DescriptionDetails>
                </div>
              ))}
            </DescriptionList>
          </Specimen>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection title='In context' description='The summary of an application, inside a Card.'>
      <Example
        layout='fill'
        surface='subtle'
        code={`<Card>
  <CardHeader><CardTitle>Working with Children Check</CardTitle></CardHeader>
  <CardContent>
    <DescriptionList layout="columns">…</DescriptionList>
  </CardContent>
</Card>`}
      >
        <Card className='max-w-xl'>
          <CardHeader>
            <CardTitle>Working with Children Check</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList layout='columns'>
              <Facts />
            </DescriptionList>
          </CardContent>
        </Card>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function DescriptionListDocs() {
  return (
    <DocsPage
      title='DescriptionList'
      npm={['DescriptionList', 'DescriptionTerm', 'DescriptionDetails', 'descriptionListVariants']}
      registry='description-list'
      summary={
        <>
          A list of terms and their details — the facts about an application, a licence or a
          document. It renders a real <code>&lt;dl&gt;</code>, so each term stays tied to its detail
          for screen readers.
        </>
      }
    >
      <DocsUsage
        use={[
          'Summarising an application or record: reference number, date, status.',
          'A strip of key facts under a page heading.',
          'A check-your-answers summary before someone submits a form.',
        ]}
        avoid={[
          'Several records to compare across the same fields — use Table.',
          'A sequence of steps — use an ordered list or StepIndicator.',
          'A single status on its own — use Badge.',
        ]}
      />
      <LayoutsSection />
      <GroupingPairsSection />
      <LongContentSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: DescriptionListDocs },
  },
  args: {
    layout: 'stacked',
    children: <Facts />,
  },
  argTypes: {
    children: {
      control: false,
      description: 'Term/detail pairs, each wrapped in one element for columns and inline.',
      table: { category: 'Content' },
    },
    layout: {
      control: 'inline-radio',
      options: ['stacked', 'columns', 'inline'],
      description: 'How pairs are placed.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof DescriptionList>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getList(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="description-list"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="description-list"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const list = getList(canvasElement)

    if (list.tagName !== 'DL') {
      throw new Error(`Expected a <dl> element, received <${list.tagName.toLowerCase()}>.`)
    }

    const terms = list.querySelectorAll('[data-slot="description-term"]')
    const details = list.querySelectorAll('[data-slot="description-details"]')
    if (terms.length !== FACTS.length || details.length !== FACTS.length) {
      throw new Error(
        `Expected ${FACTS.length} term/detail pairs, received ${terms.length}/${details.length}.`,
      )
    }
    if (terms[0]?.tagName !== 'DT' || details[0]?.tagName !== 'DD') {
      throw new Error('Expected terms to render as <dt> and details as <dd>.')
    }
  },
}

export const Playground: Story = {}

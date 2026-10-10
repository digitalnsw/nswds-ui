/**
 * DescriptionList — follows docs/reference-storybook-standard.md.
 *
 *   Components/DescriptionList        → this file: Docs, Default, Playground
 *                                       and one story per docs section
 *   Components/DescriptionList/Tests  → description-list.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from './card.js'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from './description-list.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

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

const pairCode = `  <div>
    <DescriptionTerm>Reference number</DescriptionTerm>
    <DescriptionDetails>WWC-2210-4471</DescriptionDetails>
  </div>`

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function LayoutsSection() {
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
      <Example code={`<DescriptionList>\n${pairCode}\n</DescriptionList>`}>
        <DescriptionList>
          <Facts />
        </DescriptionList>
      </Example>
      <Example layout='fill' code={`<DescriptionList layout="columns">…</DescriptionList>`}>
        <DescriptionList layout='columns'>
          <Facts />
        </DescriptionList>
      </Example>
      <Example layout='fill' code={`<DescriptionList layout="inline">…</DescriptionList>`}>
        <DescriptionList layout='inline'>
          <Facts />
        </DescriptionList>
      </Example>
    </ExampleSection>
  )
}

function GroupingPairsSection() {
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
        code={`<DescriptionList layout="inline">\n${pairCode}\n</DescriptionList>`}
      >
        <ExampleCell label='each pair wrapped in a div'>
          <DescriptionList layout='inline'>
            <Facts />
          </DescriptionList>
        </ExampleCell>
        <ExampleCell label='not wrapped — terms and details come apart'>
          <DescriptionList layout='inline'>
            {FACTS.map(({ term, detail }) => (
              <Fragment key={term}>
                <DescriptionTerm>{term}</DescriptionTerm>
                <DescriptionDetails>{detail}</DescriptionDetails>
              </Fragment>
            ))}
          </DescriptionList>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection title='In context' description='The summary of an application, inside a Card.'>
      <Example layout='fill' surface='subtle'>
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

export const Layouts: Story = { name: 'Layouts', render: () => <LayoutsSection /> }

export const GroupingPairs: Story = {
  name: 'Grouping pairs',
  render: () => <GroupingPairsSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

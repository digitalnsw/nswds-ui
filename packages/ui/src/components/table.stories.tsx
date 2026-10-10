/**
 * Table — follows docs/reference-storybook-standard.md.
 *
 *   Components/Table                → this file: Docs, Default, Playground and
 *                                     one story per docs section
 *   Components/Table/Tests          → table.tests.stories.tsx
 *   Components/Table/Accessibility  → table.accessibility.stories.tsx
 *
 * A styled data table built from native table elements. The parts map onto the
 * corresponding HTML elements (table, thead, tbody, tfoot, tr, th, td, caption)
 * so semantics and accessibility come from the platform. The one thing the
 * component adds is the scroll container around the table.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { Badge } from './badge.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table.js'

const rows = [
  { service: 'Driver licence', agency: 'Transport for NSW', fee: '$186' },
  {
    service: 'Working with children check',
    agency: 'Office of the Children’s Guardian',
    fee: '$0',
  },
  { service: 'Business name registration', agency: 'Service NSW', fee: '$44' },
]

function ServiceRows() {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Agency</TableHead>
          <TableHead>Fee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.service}>
            <TableCell>{row.service}</TableCell>
            <TableCell>{row.agency}</TableCell>
            <TableCell>{row.fee}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function CompositionSection() {
  return (
    <ExampleSection
      title='Composition'
      description={
        <>
          The parts are the native table elements, styled: <code>TableHeader</code>,{' '}
          <code>TableBody</code> and <code>TableFooter</code> hold <code>TableRow</code>s of{' '}
          <code>TableHead</code> and <code>TableCell</code>. Give every table a{' '}
          <code>TableCaption</code> — it names the table for everyone, and names its scroll region
          too.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Table>
  <TableCaption>NSW Government services and fees</TableCaption>
  <TableHeader>
    <TableRow><TableHead>Service</TableHead>…</TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>Driver licence</TableCell>…</TableRow>
  </TableBody>
  <TableFooter>…</TableFooter>
</Table>`}
      >
        <Table>
          <TableCaption>NSW Government services and fees</TableCaption>
          <ServiceRows />
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell />
              <TableCell>$230</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Example>
    </ExampleSection>
  )
}

const feeRows = [
  {
    licence: 'Recreational fishing — 1 year',
    fee: '$40',
    concession: 'Pensioner Concession Card holders are exempt',
    renewal: 'Online, by phone or at a service centre',
  },
  {
    licence: 'Recreational fishing — 3 years',
    fee: '$105',
    concession: 'Pensioner Concession Card holders are exempt',
    renewal: 'Online, by phone or at a service centre',
  },
]

function ScrollingSection() {
  return (
    <ExampleSection
      title='Scrolling'
      description={
        <>
          Cells do not wrap, so a table wider than its column scrolls sideways. While it overflows,
          the scroll container becomes a focusable region named by the caption, so a keyboard user
          can Tab to it and scroll with the arrow keys. A table that fits adds no tab stop.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Table>\n  <TableCaption>Fishing licence fees</TableCaption>\n  …\n</Table>`}
      >
        <div className='max-w-sm'>
          <Table>
            <TableCaption>Fishing licence fees</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Licence</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Concession</TableHead>
                <TableHead>How to renew</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeRows.map((row) => (
                <TableRow key={row.licence}>
                  <TableCell>{row.licence}</TableCell>
                  <TableCell>{row.fee}</TableCell>
                  <TableCell>{row.concession}</TableCell>
                  <TableCell>{row.renewal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A list of a person’s applications, with each status as a Badge.'
    >
      <Example layout='fill'>
        <div className='space-y-4'>
          <p className='text-2xl font-semibold'>Your applications</p>
          <Table>
            <TableCaption>Applications started in the last 12 months</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Working with Children Check</TableCell>
                <TableCell>WWC-2210-4471</TableCell>
                <TableCell>
                  <Badge color='warning' dot>
                    In review
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Boat licence renewal</TableCell>
                <TableCell>BL-48213</TableCell>
                <TableCell>
                  <Badge color='success' dot>
                    Approved
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function TableDocs() {
  return (
    <DocsPage
      title='Table'
      npm={[
        'Table',
        'TableCaption',
        'TableHeader',
        'TableBody',
        'TableFooter',
        'TableRow',
        'TableHead',
        'TableCell',
      ]}
      registry='table'
      summary={
        <>
          A data table over native table elements, so its semantics come from the platform. The one
          thing it adds is a scroll container that becomes a named, focusable region whenever the
          table is wider than its column.
        </>
      }
    >
      <DocsUsage
        use={[
          'Comparing several records across the same fields — fees, applications, results.',
          'Data people scan by column, such as dates or amounts.',
          'Reference information with a clear row and column structure.',
        ]}
        avoid={[
          'The facts about a single record — use DescriptionList.',
          'Laying out a page or a form — use the grid utilities or Field.',
          'A short list of links or items — use a list.',
        ]}
      />
      <CompositionSection />
      <ScrollingSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: TableDocs },
  },
  args: {
    children: <ServiceRows />,
  },
  argTypes: {
    children: {
      control: false,
      description: 'TableCaption, TableHeader, TableBody and TableFooter.',
      table: { category: 'Content' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name, when there is no TableCaption. Also names the scroll region.',
      table: { category: 'Accessibility' },
    },
    'aria-labelledby': {
      control: 'text',
      description: 'Id of an element naming the table. Takes precedence over the caption.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // A real <table> is rendered inside the scroll container.
    const table = canvasElement.querySelector<HTMLTableElement>('[data-slot="table"]')
    await expect(table).toBeInTheDocument()

    // Header cells and body rows must be present.
    const heads = canvasElement.querySelectorAll('[data-slot="table-head"]')
    await expect(heads.length).toBe(3)

    const bodyRows = canvasElement.querySelectorAll(
      '[data-slot="table-body"] [data-slot="table-row"]',
    )
    await expect(bodyRows.length).toBe(rows.length)

    const firstCell = canvasElement.querySelector('[data-slot="table-cell"]')
    await expect(firstCell).toHaveTextContent('Driver licence')
  },
}

export const Playground: Story = {}

export const Composition: Story = { name: 'Composition', render: () => <CompositionSection /> }

export const Scrolling: Story = {
  name: 'Scrolling',
  render: () => <ScrollingSection />,
  // The container turns focusable from a ResizeObserver callback, a frame
  // after mount; wait for it so the end-of-play axe pass sees the region.
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('[data-slot="table-container"]')
    await waitFor(() => expect(container).toHaveAttribute('tabindex', '0'))
  },
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

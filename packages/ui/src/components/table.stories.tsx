/**
 * Table — Default, Variants, Scrollable, CssCheck
 *
 * A styled data table built from native table elements. The parts map onto the
 * corresponding HTML elements (table, thead, tbody, tfoot, tr, th, td, caption)
 * so semantics and accessibility come from the platform.
 *
 * The one thing the component adds is the scroll container around the table,
 * and its keyboard behaviour has its own criterion-driven file:
 *   Components/Table/Accessibility → table.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

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

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A styled data table over native table elements. Compose TableHeader / TableBody / TableFooter with TableRow, TableHead and TableCell; TableCaption provides an accessible description. A table wider than its column scrolls horizontally, and while it overflows the scroll container becomes a focusable region named by the caption, so keyboard users can reach the clipped columns; a table that fits gains no tab stop.',
      },
    },
  },
  render: (args) => (
    <Table {...args}>
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
    </Table>
  ),
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

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <Table>
      <TableCaption>NSW Government services and fees</TableCaption>
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
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell />
          <TableCell>$230</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

/**
 * A four-column props table in a 390px column — the case that surfaced the
 * defect in a docs app. TableHead and TableCell are whitespace-nowrap, so the
 * table cannot shrink to fit and the container scrolls instead.
 */
const propRows = [
  {
    prop: 'variant',
    type: "'solid' | 'soft' | 'surface' | 'outline' | 'ghost' | 'link'",
    defaultValue: "'solid'",
    description: 'Visual treatment of the button.',
  },
  {
    prop: 'color',
    type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger' | 'success' | 'warning' | 'grey' | 'white'",
    defaultValue: "'primary'",
    description: 'Ink the variant derives its states from.',
  },
  {
    prop: 'size',
    type: "'sm' | 'default' | 'lg' | 'icon'",
    defaultValue: "'default'",
    description: 'Padding step; the label stays 16px bold at every size.',
  },
]

export const Scrollable: Story = {
  name: 'Scrollable',
  parameters: {
    docs: {
      description: {
        story:
          'A table wider than its column scrolls horizontally. While it overflows, the container is a focusable region (tabindex="0", role="region") named by explicit ARIA naming or the TableCaption, so a keyboard user can Tab to it and scroll with the arrow keys; once the table fits, the container is a plain div again. The table’s own aria-labelledby or aria-label takes precedence over its caption; without an explicit name or caption, the region uses the name "Scrollable table" — give the table a caption.',
      },
    },
  },
  render: () => (
    <div style={{ width: 390 }}>
      <Table>
        <TableCaption>Button props</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {propRows.map((row) => (
            <TableRow key={row.prop}>
              <TableCell>
                <code>{row.prop}</code>
              </TableCell>
              <TableCell>
                <code>{row.type}</code>
              </TableCell>
              <TableCell>
                <code>{row.defaultValue}</code>
              </TableCell>
              <TableCell>{row.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector<HTMLElement>('[data-slot="table-container"]')
    if (!container) {
      throw new Error('Could not find [data-slot="table-container"].')
    }

    // The overflow measurement lands in a ResizeObserver callback, one frame
    // after mount, so the region attributes are awaited rather than read at
    // once.
    await waitFor(() => expect(container).toHaveAttribute('tabindex', '0'))
    await expect(container).toHaveAttribute('role', 'region')

    const caption = canvasElement.querySelector<HTMLElement>('[data-slot="table-caption"]')
    if (!caption?.id) {
      throw new Error('Expected TableCaption to carry an id for the region to reference.')
    }
    await expect(container).toHaveAttribute('aria-labelledby', caption.id)
  },
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: a body row's `border-b` resolves to a real
    // --border colour rather than staying unset.
    const row = canvasElement.querySelector<HTMLElement>(
      '[data-slot="table-body"] [data-slot="table-row"]',
    )
    if (!row) {
      throw new Error('Could not find a body [data-slot="table-row"].')
    }
    const borderColor = getComputedStyle(row).borderBottomColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected the --border token to resolve, received "${borderColor}".`)
    }
  },
}

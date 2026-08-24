/**
 * Table — Default, Variants, CssCheck
 *
 * A styled data table built from native table elements. The parts map onto the
 * corresponding HTML elements (table, thead, tbody, tfoot, tr, th, td, caption)
 * so semantics and accessibility come from the platform.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

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
          'A styled data table over native table elements. Compose TableHeader / TableBody / TableFooter with TableRow, TableHead and TableCell; TableCaption provides an accessible description.',
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

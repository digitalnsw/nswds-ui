/**
 * Table — Tests
 *
 * Stories that prove the scroll container's behaviour rather than show it.
 * They stay out of the sidebar (`!dev`) but run in the Vitest suite. The
 * WCAG-mapped keyboard, name, focus-order and focus-visible stories are in
 * table.accessibility.stories.tsx.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
  title: 'Components/Table/Tests',
  component: Table,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
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

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/**
 * The column width the defect was observed at: a four-column props table in a
 * docs app at a 390px viewport.
 */
const NARROW_COLUMN_WIDTH = 390

/** The accessible name the region falls back to when nothing names the table. */
const DEFAULT_REGION_LABEL = 'Scrollable table'

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

/** A four-column props table, wider than any narrow column it is placed in. */
function PropsTable({ caption, ...props }: ComponentProps<typeof Table> & { caption?: string }) {
  return (
    <Table {...props}>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
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
  )
}

/** A narrow column, the width the defect was observed at. */
function NarrowColumn({ children }: { children: ReactNode }) {
  return <div style={{ width: NARROW_COLUMN_WIDTH }}>{children}</div>
}

function getContainers(canvasElement: HTMLElement): HTMLElement[] {
  const containers = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="table-container"]'),
  )
  if (containers.length === 0) throw new Error('Could not find [data-slot="table-container"].')
  return containers
}

function getContainer(canvasElement: HTMLElement): HTMLElement {
  const [container] = getContainers(canvasElement)
  if (!container) throw new Error('Could not find [data-slot="table-container"].')
  return container
}

/**
 * The overflow measurement lands in a ResizeObserver callback, one frame
 * after mount, so the region attributes are awaited rather than read at once.
 */
async function waitForRegion(container: HTMLElement) {
  await waitFor(() => expect(container).toHaveAttribute('tabindex', '0'))
  await expect(container).toHaveAttribute('role', 'region')
}

async function waitForPlainContainer(container: HTMLElement) {
  await waitFor(() => expect(container).not.toHaveAttribute('tabindex'))
  await expect(container).not.toHaveAttribute('role')
  await expect(container).not.toHaveAttribute('aria-label')
  await expect(container).not.toHaveAttribute('aria-labelledby')
}

// ─── Stories ──────────────────────────────────────────────────────────────────

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

function ExplicitNamesExample() {
  const headingId = useId()
  return (
    <div>
      <h2 id={headingId}>Published fees</h2>
      <NarrowColumn>
        <PropsTable caption='Fee details' aria-label='Current fees' />
      </NarrowColumn>
      <NarrowColumn>
        <PropsTable caption='Fee details' aria-label='Current fees' aria-labelledby={headingId} />
      </NarrowColumn>
      <NarrowColumn>
        <PropsTable caption='Fee details' aria-label=' ' aria-labelledby='' />
      </NarrowColumn>
      <NarrowColumn>
        <PropsTable aria-label='' aria-labelledby=' ' />
      </NarrowColumn>
    </div>
  )
}

export const ExplicitNames: Story = {
  name: 'Explicit ARIA names win over the caption',
  render: () => <ExplicitNamesExample />,
  play: async ({ canvasElement }) => {
    const containers = getContainers(canvasElement)
    const names = ['Current fees', 'Published fees', 'Fee details', DEFAULT_REGION_LABEL]
    for (const [index, container] of containers.entries()) {
      await waitForRegion(container)
      await expect(container).toHaveAccessibleName(names[index])
      if (index < 3) {
        await expect(container.querySelector('table')).toHaveAccessibleName(names[index])
      }
    }
  },
}

function ContentChangesExample() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>Change cell content</button>
      <div style={{ width: 390, height: 160 }}>
        <Table>
          <TableCaption>Service fees</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                {expanded
                  ? 'A long service name that grows beyond the fixed column width '.repeat(5)
                  : 'Licence'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export const ContentChanges: Story = {
  name: 'Region follows content changes',
  render: () => <ContentChangesExample />,
  play: async ({ canvasElement }) => {
    const container = getContainer(canvasElement)
    const button = canvasElement.querySelector('button')
    if (!button) throw new Error('Expected the content toggle.')
    // Allow the initial observer delivery before changing content.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )
    await waitForPlainContainer(container)
    const { width, height } = container.getBoundingClientRect()
    await expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth)
    await userEvent.click(button)
    await waitForRegion(container)
    await expect(container).toHaveAccessibleName('Service fees')
    await expect(container.scrollWidth).toBeGreaterThan(container.clientWidth)
    await expect(container.getBoundingClientRect().width).toBe(width)
    await expect(container.getBoundingClientRect().height).toBe(height)
    await userEvent.click(button)
    await waitForPlainContainer(container)
    await expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth)
    await expect(container.getBoundingClientRect().width).toBe(width)
    await expect(container.getBoundingClientRect().height).toBe(height)
  },
}

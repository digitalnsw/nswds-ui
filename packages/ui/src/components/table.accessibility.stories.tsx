/**
 * Table — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Table scroll container.
 *
 * Table itself is native `<table>` markup, so its own semantics come from the
 * platform. What the component adds is the horizontally scrolling container
 * around the table, and that is where the criteria below apply:
 *
 *   - 2.1.1 Keyboard        (a region that scrolls must be reachable and
 *                            scrollable from the keyboard)
 *   - 2.4.3 Focus Order     (a table that fits must NOT add a tab stop)
 *   - 2.4.7 Focus Visible   (the focused region shows the house outline)
 *   - 4.1.2 Name, Role, Value (the focus stop has a role and a name)
 *
 * Every story here also runs the suite's axe pass. The overflowing stories
 * fail `scrollable-region-focusable` on a container that cannot take focus,
 * which is the defect these stories exist to pin.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps, ReactNode } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'

import { wcagStoryMeta } from './story-helpers.js'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Table/Accessibility',
  component: Table,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/**
 * The column width the defect was observed at: a four-column props table in a
 * docs app at a 390px viewport. TableHead and TableCell are whitespace-nowrap,
 * so the table cannot shrink to fit and the container scrolls instead.
 */
const NARROW_COLUMN_WIDTH = 390

/** The accessible name the region falls back to when nothing names the table. */
const DEFAULT_REGION_LABEL = 'Scrollable table'

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

const serviceRows = [
  { service: 'Driver licence', agency: 'Transport for NSW', fee: '$186' },
  { service: 'Business name registration', agency: 'Service NSW', fee: '$44' },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'A table wider than its column scrolls horizontally, but a scroll container is not focusable by default, so a keyboard user has no way to reach the clipped columns. axe reports this as scrollable-region-focusable.',
          how: 'Tab: the scroll container is the first stop and takes the house focus outline. Arrow keys then scroll the table sideways. The play() function asserts the container carries tabindex="0" and receives focus on Tab; the suite-wide axe pass asserts scrollable-region-focusable no longer fires.',
          caveat:
            'The tab stop exists only while the table overflows — widen the canvas until the table fits and it disappears (see Focus Order below). Overflow is measured on the client, so a server render has no tab stop until hydration.',
        }),
      },
    },
  },
  render: () => (
    <NarrowColumn>
      <PropsTable caption='Button props' />
    </NarrowColumn>
  ),
  play: async ({ canvasElement }) => {
    const container = getContainer(canvasElement)
    await waitForRegion(container)

    // The container really does overflow — otherwise the assertions above
    // would be passing on a table that fits and prove nothing.
    if (container.scrollWidth <= container.clientWidth) {
      throw new Error(
        `Expected the table to overflow a ${NARROW_COLUMN_WIDTH}px column (scrollWidth ${container.scrollWidth}, clientWidth ${container.clientWidth}).`,
      )
    }

    // Tab from the canvas: the container is the only tabbable element, so
    // this is the keyboard user's route to the clipped columns.
    await userEvent.tab()
    if (document.activeElement !== container) {
      throw new Error('Expected Tab to move focus to the scroll container.')
    }
  },
}

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A focus stop with no role or name is announced as nothing — the user lands on it and cannot tell what it is. The scroll container is exposed as a region, and it takes its name from the table it wraps so the two announce consistently.',
          how: 'With a screen reader, Tab to each container: the first announces its caption, the second the aria-label given to the table, the third the fallback name. The play() function asserts the resolution order: TableCaption (by id), else the table’s own aria-labelledby or aria-label, else "Scrollable table".',
          caveat:
            'Give the table a TableCaption. It names the table for everyone and is the region’s preferred name; the fallback label is generic on purpose. aria-label / aria-labelledby passed to Table stay on the <table> as well, so the table is never left unnamed by the region taking the value.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-6'>
      <NarrowColumn>
        <PropsTable caption='Named by its caption' />
      </NarrowColumn>
      <NarrowColumn>
        <PropsTable aria-label='Named by aria-label' />
      </NarrowColumn>
      <NarrowColumn>
        <PropsTable />
      </NarrowColumn>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [byCaption, byLabel, byDefault] = getContainers(canvasElement)
    if (!byCaption || !byLabel || !byDefault) {
      throw new Error('Expected three table containers.')
    }

    // 1. A TableCaption names the region by id.
    await waitForRegion(byCaption)
    const caption = byCaption.querySelector<HTMLElement>('[data-slot="table-caption"]')
    if (!caption?.id) {
      throw new Error('Expected TableCaption to carry an id for the region to reference.')
    }
    await expect(byCaption).toHaveAttribute('aria-labelledby', caption.id)
    await expect(byCaption).not.toHaveAttribute('aria-label')
    await expect(byCaption).toHaveAccessibleName('Named by its caption')

    // 2. Without a caption, the table's own aria-label is mirrored onto the
    //    region, and stays on the <table> too.
    await waitForRegion(byLabel)
    await expect(byLabel).toHaveAttribute('aria-label', 'Named by aria-label')
    await expect(byLabel).not.toHaveAttribute('aria-labelledby')
    await expect(byLabel.querySelector('[data-slot="table"]')).toHaveAttribute(
      'aria-label',
      'Named by aria-label',
    )

    // 3. With neither, the region still has a name.
    await waitForRegion(byDefault)
    await expect(byDefault).toHaveAttribute('aria-label', DEFAULT_REGION_LABEL)
  },
}

export const FocusOrder: Story = {
  name: 'Focus Order — 2.4.3',
  parameters: {
    wcag: ['2.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.3',
          why: 'A tab stop that leads nowhere is a cost: every keyboard user pays it on every table. A table that fits its column has nothing to scroll, so its container must stay a plain <div> — no tabindex, no landmark — and the stop must appear only while the table actually overflows.',
          how: 'Resize the canvas: as soon as the table is wider than its column the container gains tabindex="0" and role="region"; widen it again and both go. The play() function shrinks the column to 390px, waits for the stop to appear, restores the width and waits for it to go.',
          caveat:
            'Overflow is measured with a ResizeObserver on the container AND the table, so the stop also follows content changes — a table that grows a column after data loads is covered without a viewport resize.',
        }),
      },
    },
  },
  render: () => (
    // Wide by default: the story canvas is far wider than this three-column
    // table, so the container starts out fitting.
    <div data-testid='column'>
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
          {serviceRows.map((row) => (
            <TableRow key={row.service}>
              <TableCell>{row.service}</TableCell>
              <TableCell>{row.agency}</TableCell>
              <TableCell>{row.fee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>('[data-testid="column"]')
    if (!column) throw new Error('Could not find the column wrapper.')
    const container = getContainer(canvasElement)

    // Fits: no tab stop, no landmark.
    await waitForPlainContainer(container)
    if (container.scrollWidth > container.clientWidth) {
      throw new Error('Expected the three-column table to fit the canvas.')
    }
    await userEvent.tab()
    if (document.activeElement === container) {
      throw new Error('A table that fits must not be a tab stop.')
    }

    // Overflows: the stop appears without a remount.
    column.style.width = '200px'
    await waitForRegion(container)

    // Fits again: the stop goes.
    column.style.width = ''
    await waitForPlainContainer(container)
  },
}

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'Once the container can take focus it has to show it. A keyboard user who tabs onto a silent region cannot tell where they are, or that arrow keys will now scroll the table.',
          how: 'Tab onto the scroll container: it draws the house 2px --ring outline, offset 2px onto the page. The play() function focuses the container and asserts the computed outline width and style.',
          caveat:
            'The outline is drawn outside the container’s box, so a parent that clips overflow will cut it. Give the table 2px of room, or set overflow on the parent to visible.',
        }),
      },
    },
  },
  render: () => (
    <NarrowColumn>
      <PropsTable caption='Button props' />
    </NarrowColumn>
  ),
  play: async ({ canvasElement }) => {
    const container = getContainer(canvasElement)
    await waitForRegion(container)

    await userEvent.tab()
    if (document.activeElement !== container) {
      throw new Error('Expected Tab to move focus to the scroll container.')
    }

    const style = getComputedStyle(container)
    if (style.outlineStyle !== 'solid' || style.outlineWidth !== '2px') {
      throw new Error(
        `Expected a 2px solid focus outline on the scroll container, received "${style.outlineWidth} ${style.outlineStyle}".`,
      )
    }
  },
}

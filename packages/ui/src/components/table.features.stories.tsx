/**
 * Table — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { Table } from './table.js'
import {
  CompositionSection,
  InContextSection,
  NamingSection,
  RowStatesSection,
  ScrollingSection,
} from './table.stories.js'

const meta = {
  title: 'Components/Table/Features',
  component: Table,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Composition: Story = { render: () => <CompositionSection /> }

export const Naming: Story = {
  render: () => <NamingSection />,
  play: async ({ canvasElement }) => {
    const tables = canvasElement.querySelectorAll('[data-slot="table"]')
    await expect(tables[0]).toHaveAccessibleName('Driver licence fees')
    await expect(tables[1]).toHaveAccessibleName('Boat licence fees')
  },
}

export const RowStates: Story = { name: 'Row states', render: () => <RowStatesSection /> }

export const Scrolling: Story = {
  render: () => <ScrollingSection />,
  // The container turns focusable from a ResizeObserver callback, a frame
  // after mount; wait for it so the end-of-play axe pass sees the region.
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('[data-slot="table-container"]')
    await waitFor(() => expect(container).toHaveAttribute('tabindex', '0'))
  },
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

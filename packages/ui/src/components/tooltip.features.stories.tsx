/**
 * Tooltip — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from './tooltip.js'
import {
  InContextSection,
  PlacementSection,
  StatesSection,
  WithShortcutSection,
} from './tooltip.stories.js'

const meta = {
  title: 'Components/Tooltip/Features',
  component: Tooltip,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Placement: Story = { render: () => <PlacementSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const WithShortcut: Story = {
  name: 'With a shortcut',
  render: () => <WithShortcutSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

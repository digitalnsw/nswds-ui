/**
 * Popover — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Popover } from './popover.js'
import { InContextSection, PlacementSection, WithAFormSection } from './popover.stories.js'

const meta = {
  title: 'Components/Popover/Features',
  component: Popover,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Placement: Story = { render: () => <PlacementSection /> }

export const WithAForm: Story = {
  name: 'With a form',
  render: () => <WithAFormSection />,
}

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

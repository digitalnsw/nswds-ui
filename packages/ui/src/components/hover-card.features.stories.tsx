/**
 * HoverCard — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { HoverCard } from './hover-card.js'
import {
  AlignmentSection,
  DelaySection,
  InContextSection,
  PlacementSection,
} from './hover-card.stories.js'

const meta = {
  title: 'Components/HoverCard/Features',
  component: HoverCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

export const Placement: Story = { render: () => <PlacementSection /> }

export const Alignment: Story = { render: () => <AlignmentSection /> }

export const Delay: Story = { render: () => <DelaySection /> }

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

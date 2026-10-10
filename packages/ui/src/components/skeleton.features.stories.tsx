/**
 * Skeleton — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from './skeleton.js'
import {
  AnnouncingTheWaitSection,
  InContextSection,
  ListsSection,
  ShapesSection,
  VariantsSection,
} from './skeleton.stories.js'

const meta = {
  title: 'Components/Skeleton/Features',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const Shapes: Story = { render: () => <ShapesSection /> }

export const Lists: Story = { render: () => <ListsSection /> }

export const AnnouncingTheWait: Story = {
  name: 'Announcing the wait',
  render: () => <AnnouncingTheWaitSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

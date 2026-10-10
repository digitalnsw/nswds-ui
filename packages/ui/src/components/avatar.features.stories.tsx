/**
 * Avatar — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar } from './avatar.js'
import {
  GroupsSection,
  ImageAndFallbackSection,
  InContextSection,
  SizesSection,
  StatusBadgeSection,
} from './avatar.stories.js'

const meta = {
  title: 'Components/Avatar/Features',
  component: Avatar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = { render: () => <SizesSection /> }

export const ImageAndFallback: Story = {
  name: 'Image and fallback',
  render: () => <ImageAndFallbackSection />,
}

export const StatusBadge: Story = { name: 'Status badge', render: () => <StatusBadgeSection /> }

export const Groups: Story = { render: () => <GroupsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

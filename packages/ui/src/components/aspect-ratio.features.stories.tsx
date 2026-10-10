/**
 * AspectRatio — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { AspectRatio } from './aspect-ratio.js'
import { InContextSection, RatiosSection, WidthSection } from './aspect-ratio.stories.js'

const meta = {
  title: 'Components/AspectRatio/Features',
  component: AspectRatio,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

export const Ratios: Story = { name: 'Ratios', render: () => <RatiosSection /> }

export const Width: Story = { name: 'Width', render: () => <WidthSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

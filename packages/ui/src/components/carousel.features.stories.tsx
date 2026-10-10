/**
 * Carousel — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Carousel } from './carousel.js'
import {
  ControlLabelsSection,
  InContextSection,
  RightToLeftSection,
  SlidesPerViewSection,
  VerticalSection,
} from './carousel.stories.js'

const meta = {
  title: 'Components/Carousel/Features',
  component: Carousel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

export const SlidesPerView: Story = {
  name: 'Slides per view',
  render: () => <SlidesPerViewSection />,
}

export const Vertical: Story = { name: 'Vertical', render: () => <VerticalSection /> }

export const RightToLeft: Story = { name: 'Right to left', render: () => <RightToLeftSection /> }

export const ControlLabels: Story = {
  name: 'Control labels',
  render: () => <ControlLabelsSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

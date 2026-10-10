/**
 * Slider — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Slider } from './slider.js'
import {
  InContextSection,
  OrientationSection,
  RangeSection,
  StatesSection,
  StepsSection,
} from './slider.stories.js'

const meta = {
  title: 'Components/Slider/Features',
  component: Slider,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = { render: () => <StatesSection /> }

export const Steps: Story = { render: () => <StepsSection /> }

export const Range: Story = { render: () => <RangeSection /> }

export const Orientation: Story = { render: () => <OrientationSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

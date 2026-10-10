/**
 * ToggleGroup — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ToggleGroup } from './toggle-group.js'
import {
  InContextSection,
  OrientationSection,
  SingleOrMultipleSection,
  SizesSection,
  SpacingSection,
  StatesSection,
  VariantsSection,
} from './toggle-group.stories.js'

const meta = {
  title: 'Components/ToggleGroup/Features',
  component: ToggleGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const SingleOrMultiple: Story = {
  name: 'Single or multiple',
  render: () => <SingleOrMultipleSection />,
}

export const Spacing: Story = { render: () => <SpacingSection /> }

export const Orientation: Story = { render: () => <OrientationSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

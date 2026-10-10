/**
 * Select — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select } from './select.js'
import {
  GroupedOptionsSection,
  InContextSection,
  SizesSection,
  StatesSection,
  VariantsSection,
  WithFieldSection,
} from './select.stories.js'

const meta = {
  title: 'Components/Select/Features',
  component: Select,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const GroupedOptions: Story = {
  name: 'Grouped options',
  render: () => <GroupedOptionsSection />,
}

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

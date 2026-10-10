/**
 * NativeSelect — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { NativeSelect } from './native-select.js'
import {
  InContextSection,
  OptionGroupsSection,
  SizesSection,
  StatesSection,
  VariantsSection,
  WithALabelSection,
} from './native-select.stories.js'

const meta = {
  title: 'Components/NativeSelect/Features',
  component: NativeSelect,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NativeSelect>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const OptionGroups: Story = {
  name: 'Option groups',
  render: () => <OptionGroupsSection />,
}

export const WithALabel: Story = { name: 'With a label', render: () => <WithALabelSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

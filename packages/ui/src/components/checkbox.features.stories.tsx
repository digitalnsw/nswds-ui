/**
 * Checkbox — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './checkbox.js'
import {
  ControlledMixedStateSection,
  DefaultSection,
  InContextSection,
  SelectAllSection,
  StatesSection,
  ValidationSection,
  WithFieldSection,
} from './checkbox.stories.js'

const meta = {
  title: 'Components/Checkbox/Features',
  component: Checkbox,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <DefaultSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const Validation: Story = { render: () => <ValidationSection /> }

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const ControlledMixedState: Story = {
  name: 'Controlled mixed state',
  render: () => <ControlledMixedStateSection />,
}

export const SelectAll: Story = { name: 'Select all', render: () => <SelectAllSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

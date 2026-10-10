/**
 * RadioGroup — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup } from './radio-group.js'
import {
  ControlledSelectionSection,
  DefaultSection,
  InContextSection,
  OptionsWithHintsSection,
  StatesSection,
  ValidationSection,
  WithFieldSection,
} from './radio-group.stories.js'

const meta = {
  title: 'Components/RadioGroup/Features',
  component: RadioGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <DefaultSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const Validation: Story = { render: () => <ValidationSection /> }

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const OptionsWithHints: Story = {
  name: 'Options with hints',
  render: () => <OptionsWithHintsSection />,
}

export const ControlledSelection: Story = {
  name: 'Controlled selection',
  render: () => <ControlledSelectionSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

/**
 * Combobox — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Combobox } from './combobox.js'
import {
  ButtonsSection,
  GroupedOptionsSection,
  InContextSection,
  MultipleSelectionSection,
  StatesSection,
  WithFieldSection,
} from './combobox.stories.js'

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox/Features',
  component: Combobox,
  parameters: {
    layout: 'padded',
    // Base UI's hidden form-value input is focusable by design; see the note in
    // combobox.stories.tsx for why only this rule is scoped off.
    a11y: { options: { rules: { 'aria-hidden-focus': { enabled: false } } } },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = { render: () => <StatesSection /> }

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const Buttons: Story = {
  name: 'Suggestions and clear buttons',
  render: () => <ButtonsSection />,
}

export const GroupedOptions: Story = {
  name: 'Grouped options',
  render: () => <GroupedOptionsSection />,
}

export const MultipleSelection: Story = {
  name: 'Multiple selection',
  render: () => <MultipleSelectionSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

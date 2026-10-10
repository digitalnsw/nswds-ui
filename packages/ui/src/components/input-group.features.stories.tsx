/**
 * InputGroup — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { InputGroup } from './input-group.js'
import {
  AddonsSection,
  AttachedActionSection,
  InContextSection,
  InlineButtonsSection,
  StatesSection,
  WithIconsSection,
} from './input-group.stories.js'

const meta = {
  title: 'Components/InputGroup/Features',
  component: InputGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = { render: () => <StatesSection /> }

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const Addons: Story = { render: () => <AddonsSection /> }

export const InlineButtons: Story = {
  name: 'Inline buttons',
  render: () => <InlineButtonsSection />,
}

export const AttachedAction: Story = {
  name: 'Attached action',
  render: () => <AttachedActionSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

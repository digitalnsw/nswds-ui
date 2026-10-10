/**
 * Switch — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Switch } from './switch.js'
import {
  DefaultSection,
  InASettingsListSection,
  SizesSection,
  StatesSection,
  WithFieldSection,
} from './switch.stories.js'

const meta = {
  title: 'Components/Switch/Features',
  component: Switch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <DefaultSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const InASettingsList: Story = {
  name: 'In a settings list',
  render: () => <InASettingsListSection />,
}

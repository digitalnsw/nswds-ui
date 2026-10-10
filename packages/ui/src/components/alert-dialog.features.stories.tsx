/**
 * AlertDialog — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { AlertDialog } from './alert-dialog.js'
import {
  ControlledSection,
  DestructiveActionsSection,
  InContextSection,
  SizesSection,
  VariantsSection,
  WithIconsSection,
} from './alert-dialog.stories.js'

const meta = {
  title: 'Components/AlertDialog/Features',
  component: AlertDialog,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const WithIcons: Story = {
  name: 'With icons',
  render: () => <WithIconsSection />,
}

export const DestructiveActions: Story = {
  name: 'Destructive actions',
  render: () => <DestructiveActionsSection />,
}

export const Controlled: Story = { render: () => <ControlledSection /> }

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

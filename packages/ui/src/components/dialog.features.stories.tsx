/**
 * Dialog — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Dialog } from './dialog.js'
import {
  CloseButtonSection,
  ControlledSection,
  InContextSection,
  LongContentSection,
  VariantsSection,
} from './dialog.stories.js'

const meta = {
  title: 'Components/Dialog/Features',
  component: Dialog,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const CloseButton: Story = {
  name: 'Close button',
  render: () => <CloseButtonSection />,
}

export const LongContent: Story = {
  name: 'Long content',
  render: () => <LongContentSection />,
}

export const Controlled: Story = { render: () => <ControlledSection /> }

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

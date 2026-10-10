/**
 * Sheet — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Sheet } from './sheet.js'
import {
  CloseButtonSection,
  InContextSection,
  InitialFocusSection,
  SidesSection,
} from './sheet.stories.js'

const meta = {
  title: 'Components/Sheet/Features',
  component: Sheet,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

export const Sides: Story = { render: () => <SidesSection /> }

export const CloseButton: Story = {
  name: 'Close button',
  render: () => <CloseButtonSection />,
}

export const InitialFocus: Story = {
  name: 'Initial focus',
  render: () => <InitialFocusSection />,
}

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

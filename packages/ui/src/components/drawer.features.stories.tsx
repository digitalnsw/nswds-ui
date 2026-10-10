/**
 * Drawer — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Drawer } from './drawer.js'
import {
  ControlledSection,
  DirectionsSection,
  FooterActionsSection,
  InContextSection,
} from './drawer.stories.js'

const meta = {
  title: 'Components/Drawer/Features',
  component: Drawer,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

export const Directions: Story = { render: () => <DirectionsSection /> }

export const FooterActions: Story = {
  name: 'Footer actions',
  render: () => <FooterActionsSection />,
}

export const Controlled: Story = { render: () => <ControlledSection /> }

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

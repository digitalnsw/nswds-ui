/**
 * MobileNav — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ControlledSection,
  MenuTreeSection,
  PlacementSection,
  WithExtraContentSection,
} from './mobile-nav.stories.js'

// No `component`: MobileNav's `navigation` is required, and every story here
// renders a section that supplies its own.
const meta = {
  title: 'Patterns/MobileNav/Features',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Placement: Story = { render: () => <PlacementSection /> }

export const MenuTree: Story = { name: 'Menu tree', render: () => <MenuTreeSection /> }

export const WithExtraContent: Story = {
  name: 'With extra content',
  render: () => <WithExtraContentSection />,
}

export const Controlled: Story = { render: () => <ControlledSection /> }

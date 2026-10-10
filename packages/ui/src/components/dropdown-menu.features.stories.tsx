/**
 * DropdownMenu — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { DropdownMenu } from './dropdown-menu.js'
import {
  CheckboxesAndRadiosSection,
  DestructiveAndDisabledSection,
  GroupsAndLabelsSection,
  InContextSection,
  LinksSection,
  SubmenusSection,
  VariantsSection,
  WithIconsSection,
} from './dropdown-menu.stories.js'

const meta = {
  title: 'Components/DropdownMenu/Features',
  component: DropdownMenu,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const WithIcons: Story = {
  name: 'With icons',
  render: () => <WithIconsSection />,
}

export const GroupsAndLabels: Story = {
  name: 'Groups and labels',
  render: () => <GroupsAndLabelsSection />,
}

export const CheckboxesAndRadios: Story = {
  name: 'Checkboxes and radios',
  render: () => <CheckboxesAndRadiosSection />,
}

export const Submenus: Story = { render: () => <SubmenusSection /> }

export const Links: Story = { render: () => <LinksSection /> }

export const DestructiveAndDisabledItems: Story = {
  name: 'Destructive and disabled items',
  render: () => <DestructiveAndDisabledSection />,
}

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

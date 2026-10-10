/**
 * TabNav — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { TabNav } from './tab-nav.js'
import {
  CustomMatchingSection,
  InContextSection,
  OverflowSection,
  StatesSection,
  VariantsSection,
} from './tab-nav.stories.js'

const meta = {
  title: 'Components/TabNav/Features',
  component: TabNav,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TabNav>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const CustomMatching: Story = {
  name: 'Custom matching',
  render: () => <CustomMatchingSection />,
}

export const Overflow: Story = { render: () => <OverflowSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

/**
 * Tabs — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs } from './tabs.js'
import {
  InContextSection,
  StatesSection,
  VariantsSection,
  VerticalSection,
} from './tabs.stories.js'

const meta = {
  title: 'Components/Tabs/Features',
  component: Tabs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Vertical: Story = { name: 'Vertical', render: () => <VerticalSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

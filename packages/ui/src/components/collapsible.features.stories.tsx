/**
 * Collapsible — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Collapsible } from './collapsible.js'
import {
  ControlledSection,
  InContextSection,
  StatesSection,
  StylingSection,
} from './collapsible.stories.js'

const meta = {
  title: 'Components/Collapsible/Features',
  component: Collapsible,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Controlled: Story = { name: 'Controlled', render: () => <ControlledSection /> }

export const Styling: Story = { name: 'Styling', render: () => <StylingSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

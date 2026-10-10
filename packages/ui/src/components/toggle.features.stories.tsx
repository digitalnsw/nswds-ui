/**
 * Toggle — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Toggle } from './toggle.js'
import {
  InContextSection,
  SizesSection,
  StatesSection,
  VariantsSection,
  WithIconsSection,
} from './toggle.stories.js'

const meta = {
  title: 'Components/Toggle/Features',
  component: Toggle,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

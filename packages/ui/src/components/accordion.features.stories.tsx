/**
 * Accordion — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Accordion } from './accordion.js'
import {
  InContextSection,
  MultipleOpenSection,
  StatesSection,
  VariantsSection,
} from './accordion.stories.js'

const meta = {
  title: 'Components/Accordion/Features',
  component: Accordion,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const MultipleOpen: Story = { name: 'Multiple open', render: () => <MultipleOpenSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

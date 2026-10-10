/**
 * Textarea — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Textarea } from './textarea.js'
import {
  GrowsWithContentSection,
  InContextSection,
  StatesSection,
  WithFieldSection,
} from './textarea.stories.js'

const meta = {
  title: 'Components/Textarea/Features',
  component: Textarea,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = { render: () => <StatesSection /> }

export const GrowsWithContent: Story = {
  name: 'Grows with content',
  render: () => <GrowsWithContentSection />,
}

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

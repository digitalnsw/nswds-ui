/**
 * LabeledSeparator — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LabeledSeparator } from './labeled-separator.js'
import { InContextSection, LabelsSection, WidthSection } from './labeled-separator.stories.js'

const meta = {
  title: 'Components/LabeledSeparator/Features',
  component: LabeledSeparator,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LabeledSeparator>

export default meta

type Story = StoryObj<typeof meta>

export const Labels: Story = { name: 'Labels', render: () => <LabelsSection /> }

export const Width: Story = { name: 'Width', render: () => <WidthSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

/**
 * Progress — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Progress } from './progress.js'
import {
  InContextSection,
  RangeAndFormatSection,
  StatesSection,
  WithALabelSection,
} from './progress.stories.js'

const meta = {
  title: 'Components/Progress/Features',
  component: Progress,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Progress>

export default meta

// Every story renders its own example, so none takes the component's
// required props as args.
type Story = StoryObj

export const States: Story = { render: () => <StatesSection /> }

export const WithALabel: Story = { name: 'With a label', render: () => <WithALabelSection /> }

export const RangeAndFormat: Story = {
  name: 'Range and format',
  render: () => <RangeAndFormatSection />,
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    await expect(bar).toHaveAttribute('aria-valuemax', '5')
    await expect(bar).toHaveAttribute('aria-valuetext', '3 of 5 files')
    await expect(bar).toHaveTextContent('3 of 5 files')
  },
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

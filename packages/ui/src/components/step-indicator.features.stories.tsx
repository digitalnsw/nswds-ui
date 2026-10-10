/**
 * StepIndicator — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepIndicator } from './step-indicator.js'
import {
  CurrentStepSection,
  GroupedWithStepNavSection,
  InContextSection,
  StatusesSection,
} from './step-indicator.stories.js'

const meta = {
  title: 'Components/StepIndicator/Features',
  component: StepIndicator,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StepIndicator>

export default meta

// Every story renders its own example, so none takes the component's
// required props as args.
type Story = StoryObj

export const Statuses: Story = { render: () => <StatusesSection /> }

export const CurrentStep: Story = { name: 'Current step', render: () => <CurrentStepSection /> }

export const GroupedWithStepNav: Story = {
  name: 'Grouped with StepNav',
  render: () => <GroupedWithStepNavSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

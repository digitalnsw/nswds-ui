/**
 * InputOTP — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { InputOTP } from './input-otp.js'
import {
  GroupingSection,
  InContextSection,
  PatternSection,
  StatesSection,
} from './input-otp.stories.js'

const meta = {
  title: 'Components/InputOTP/Features',
  component: InputOTP,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InputOTP>

export default meta

// Every story renders its own example, so none takes the component's
// required props as args.
type Story = StoryObj

export const States: Story = { render: () => <StatesSection /> }

export const Grouping: Story = { render: () => <GroupingSection /> }

export const Pattern: Story = { render: () => <PatternSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

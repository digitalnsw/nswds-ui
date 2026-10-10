/**
 * Toaster — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Toaster } from './sonner.js'
import {
  ClosingAndDurationSection,
  DescriptionAndActionSection,
  InContextSection,
  PromisesSection,
  ToastTypesSection,
} from './sonner.stories.js'

const meta = {
  title: 'Components/Toaster/Features',
  component: Toaster,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const ToastTypes: Story = {
  name: 'Toast types',
  render: () => <ToastTypesSection />,
}

export const DescriptionAndAction: Story = {
  name: 'Description and action',
  render: () => <DescriptionAndActionSection />,
}

export const Promises: Story = { render: () => <PromisesSection /> }

export const ClosingAndDuration: Story = {
  name: 'Closing and duration',
  render: () => <ClosingAndDurationSection />,
}

export const InContext: Story = {
  name: 'In context',
  render: () => <InContextSection />,
}

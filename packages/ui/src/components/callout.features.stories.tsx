/**
 * Callout — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Callout } from './callout.js'
import {
  AnnouncingSection,
  AsAlertSection,
  ContentSection,
  IconsSection,
  InContextSection,
  StatusSection,
} from './callout.stories.js'

const meta = {
  title: 'Components/Callout/Features',
  component: Callout,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Callout>

export default meta

type Story = StoryObj<typeof meta>

export const Status: Story = { render: () => <StatusSection /> }

export const Content: Story = { render: () => <ContentSection /> }

export const Icons: Story = { render: () => <IconsSection /> }

export const AsAlert: Story = { name: 'As Alert', render: () => <AsAlertSection /> }

export const Announcing: Story = {
  name: 'Announcing a callout',
  render: () => <AnnouncingSection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('status')
    await expect(region).toBeEmptyDOMElement()
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))
    await expect(region).toHaveTextContent('Draft saved')
  },
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

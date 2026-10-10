/**
 * Container — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './container.js'
import { CustomWidthSection, InContextSection, SizesSection } from './container.stories.js'

const meta = {
  title: 'Components/Container/Features',
  component: Container,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const CustomWidth: Story = {
  name: 'Custom maximum width',
  render: () => <CustomWidthSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

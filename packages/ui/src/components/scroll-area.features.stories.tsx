/**
 * ScrollArea — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ScrollArea } from './scroll-area.js'
import { InContextSection, KeyboardSection, ScrollDirectionSection } from './scroll-area.stories.js'

const meta = {
  title: 'Components/ScrollArea/Features',
  component: ScrollArea,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

export const ScrollDirection: Story = {
  name: 'Scroll direction',
  render: () => <ScrollDirectionSection />,
}

export const Keyboard: Story = { name: 'Keyboard', render: () => <KeyboardSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

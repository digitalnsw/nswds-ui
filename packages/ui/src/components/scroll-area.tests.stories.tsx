/**
 * ScrollArea — Tests
 *
 * CSS check: proves globals.css loaded and the frame's border token resolves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ScrollArea } from './scroll-area.js'

const meta = {
  title: 'Components/ScrollArea/Tests',
  component: ScrollArea,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <ScrollArea {...args} className='h-48 w-64 rounded-md border border-border bg-background'>
      <div className='p-4'>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className='py-1 text-base text-foreground'>
            Row {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the root border resolves the semantic
    // --border token to a real, non-transparent colour.
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area"]')
    if (!root) throw new Error('ScrollArea root not found.')
    const borderColor = getComputedStyle(root).borderTopColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --border token to resolve to a visible colour, got "${borderColor}". Is globals.css loaded?`,
      )
    }
  },
}

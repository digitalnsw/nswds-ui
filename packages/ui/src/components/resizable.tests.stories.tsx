/**
 * ResizablePanelGroup — Tests
 *
 * CSS check: proves globals.css loaded and the handle's border token resolves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable.js'

const meta = {
  title: 'Components/ResizablePanelGroup/Tests',
  component: ResizablePanelGroup,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: { orientation: 'horizontal' },
  render: (args) => (
    <ResizablePanelGroup {...args} className='h-48 max-w-md rounded-md border border-border'>
      <ResizablePanel
        defaultSize='50%'
        className='flex items-center justify-center bg-muted p-4 text-base text-muted-foreground'
      >
        One
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize='50%'
        className='flex items-center justify-center p-4 text-base text-foreground'
      >
        Two
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the handle resolves the semantic --border
    // token to a real, non-transparent background colour.
    const handle = canvasElement.querySelector<HTMLElement>('[data-slot="resizable-handle"]')
    if (!handle) throw new Error('Resizable handle not found.')
    const bg = getComputedStyle(handle).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --border token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

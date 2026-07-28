/**
 * Resizable — resizable panel groups with draggable handles, built on
 * react-resizable-panels. The handle is keyboard-operable and exposes the
 * separator role.
 *
 * Panel content is kept short so the panels do not become scrollable regions:
 * react-resizable-panels v4 gives each panel `overflow: auto`, and an
 * overflowing panel would need its own keyboard-focusable scroll container
 * (wrap the content in a ScrollArea for long content).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable.js'

const fillPanel = 'flex items-center justify-center bg-muted p-4 text-sm text-muted-foreground'
const plainPanel = 'flex items-center justify-center p-4 text-sm text-foreground'

const meta = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Resizable panel groups with draggable handles, built on react-resizable-panels. Handles are keyboard-operable and expose the separator role.',
      },
    },
  },
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Axis the panels are laid out and resized along.',
      table: { category: 'Appearance' },
    },
  },
  render: (args) => (
    <ResizablePanelGroup {...args} className='h-48 max-w-md rounded-md border border-border'>
      <ResizablePanel defaultSize={50} className={fillPanel}>
        One
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} className={plainPanel}>
        Two
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="resizable-panel-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="resizable-panel-group"].')
    }
    const handle = canvasElement.querySelector('[data-slot="resizable-handle"]')
    if (!handle) {
      throw new Error('Could not find [data-slot="resizable-handle"].')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-col gap-8'>
      <ResizablePanelGroup
        orientation='horizontal'
        className='h-40 max-w-md rounded-md border border-border'
      >
        <ResizablePanel defaultSize={60} className={fillPanel}>
          Left
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} className={plainPanel}>
          Right
        </ResizablePanel>
      </ResizablePanelGroup>
      <ResizablePanelGroup
        orientation='vertical'
        className='h-56 max-w-md rounded-md border border-border'
      >
        <ResizablePanel defaultSize={50} className={fillPanel}>
          Top
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} className={plainPanel}>
          Bottom
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
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

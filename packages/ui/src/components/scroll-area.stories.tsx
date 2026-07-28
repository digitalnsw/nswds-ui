/**
 * ScrollArea — a custom scrollable region with styled scrollbars, on the Base
 * UI scroll-area primitive. Native scrolling and keyboard behaviour are
 * preserved; only the scrollbar chrome is restyled.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ScrollArea } from './scroll-area.js'

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A scrollable region with styled scrollbars. Native scrolling and keyboard behaviour are preserved; only the scrollbar chrome is restyled.',
      },
    },
  },
  render: (args) => (
    <ScrollArea {...args} className='h-48 w-64 rounded-md border border-border bg-background'>
      <div className='p-4'>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className='py-1 text-sm text-foreground'>
            Row {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="scroll-area"]')
    if (!root) throw new Error('Could not find [data-slot="scroll-area"].')
    const viewport = canvasElement.querySelector('[data-slot="scroll-area-viewport"]')
    if (!viewport) {
      throw new Error('Could not find [data-slot="scroll-area-viewport"].')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-wrap gap-8'>
      <ScrollArea className='h-48 w-64 rounded-md border border-border bg-background'>
        <div className='p-4'>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i} className='py-1 text-sm text-foreground'>
              Vertical row {i + 1}
            </p>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className='w-64 rounded-md border border-border bg-background'>
        <div className='flex gap-3 p-4'>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className='flex size-20 shrink-0 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground'
            >
              {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
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

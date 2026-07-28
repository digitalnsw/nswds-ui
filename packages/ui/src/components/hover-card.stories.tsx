/**
 * HoverCard — a rich preview surface shown on hover or focus, on the Base UI
 * preview-card primitive. Use it for link previews and other supplementary
 * content that should not steal focus.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js'

const triggerClasses = 'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A rich preview surface shown on hover or focus. Base UI owns the open timing, positioning, and dismissal; the preview never steals focus.',
      },
    },
  },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger className={triggerClasses}>Hover me</HoverCardTrigger>
      <HoverCardContent>
        <p className='text-popover-foreground'>
          Rich preview content shown on hover or focus — useful for link previews and supplementary
          detail.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="hover-card-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="hover-card-trigger"].')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground'>
            {side}
          </HoverCardTrigger>
          <HoverCardContent side={side}>
            <p className='text-popover-foreground'>Opens on the {side} side.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="hover-card-trigger"]')
    if (!trigger) throw new Error('HoverCard trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

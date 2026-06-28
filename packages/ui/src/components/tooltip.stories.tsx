/**
 * Tooltip — a small label shown on hover or focus, on the Base UI tooltip
 * primitive. Wrap one or more tooltips in a single TooltipProvider to share
 * the open delay.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip.js'

const triggerClasses =
  'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small label shown on hover or focus. Base UI owns the timing, positioning, and ARIA wiring; a TooltipProvider shares the delay across tooltips.',
      },
    },
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger className={triggerClasses}>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip label</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="tooltip-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="tooltip-trigger"].')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <TooltipProvider>
      <div className="flex flex-wrap gap-4">
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>Side: {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>(
      '[data-slot="tooltip-trigger"]'
    )
    if (!trigger) throw new Error('Tooltip trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`
      )
    }
  },
}

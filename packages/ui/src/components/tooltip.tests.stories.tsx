/**
 * Tooltip — Tests
 *
 * The CSS check: proves globals.css loaded by reading a semantic token off a
 * trigger painted with it. Hidden from the sidebar; it runs in the Vitest
 * suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js'

// A raw trigger painted with the semantic --primary token, which CssCheck reads.
const triggerClasses =
  'rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground'

const meta = {
  title: 'Components/Tooltip/Tests',
  component: Tooltip,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  render: (args) => (
    <TooltipProvider>
      <Tooltip {...args}>
        <TooltipTrigger className={triggerClasses}>Print</TooltipTrigger>
        <TooltipContent>Print this page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="tooltip-trigger"]')
    if (!trigger) throw new Error('Tooltip trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

/**
 * Popover — a floating panel anchored to a trigger, on the Base UI popover
 * primitive. Base UI handles focus management, positioning, and dismissal.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover.js'

const triggerClasses =
  'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating panel anchored to a trigger. Base UI handles focus management, positioning, and outside-click / Escape dismissal.',
      },
    },
  },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger className={triggerClasses}>Open popover</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>You have 3 unread messages.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="popover-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="popover-trigger"].')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
            {side}
          </PopoverTrigger>
          <PopoverContent side={side}>
            <PopoverTitle>Side: {side}</PopoverTitle>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>(
      '[data-slot="popover-trigger"]'
    )
    if (!trigger) throw new Error('Popover trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`
      )
    }
  },
}

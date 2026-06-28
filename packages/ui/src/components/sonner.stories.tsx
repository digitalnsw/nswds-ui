/**
 * Sonner (Toaster) — a toast notification surface wired to next-themes, with
 * NSWDS status icons. Mount one Toaster near the app root and fire toasts with
 * the `toast()` helper from the `sonner` package.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'

import { Toaster } from './sonner.js'

const triggerClasses =
  'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

const meta = {
  title: 'Components/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toast notification surface wired to next-themes, with NSWDS status icons. Mount one Toaster near the app root and dispatch toasts with `toast()` from the `sonner` package.',
      },
    },
  },
  render: (args) => (
    <div>
      <Toaster {...args} />
      <button
        type="button"
        data-slot="sonner-demo-trigger"
        className={triggerClasses}
        onClick={() =>
          toast.success('Event created', {
            description: 'Sunday, December 03 at 9:00 AM',
          })
        }
      >
        Show toast
      </button>
    </div>
  ),
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector(
      '[data-slot="sonner-demo-trigger"]'
    )
    if (!trigger) {
      throw new Error('Could not find the demo toast trigger.')
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => {
    const fire: Array<[string, () => void]> = [
      ['Success', () => toast.success('Saved successfully')],
      ['Info', () => toast.info('A new version is available')],
      ['Warning', () => toast.warning('Your session expires soon')],
      ['Error', () => toast.error('Something went wrong')],
      [
        'Loading',
        () =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: 'Saving…',
            success: 'Saved',
            error: 'Failed',
          }),
      ],
    ]
    return (
      <div>
        <Toaster />
        <div className="flex flex-wrap gap-3">
          {fire.map(([label, onClick]) => (
            <button
              key={label}
              type="button"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
              onClick={onClick}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    )
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the demo trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>(
      '[data-slot="sonner-demo-trigger"]'
    )
    if (!trigger) throw new Error('Sonner demo trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`
      )
    }
  },
}

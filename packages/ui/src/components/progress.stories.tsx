/**
 * Progress — Default, Variants, CssCheck
 *
 * A determinate progress bar on the Base UI progress primitive. The Root
 * (`data-slot="progress"`) carries `role="progressbar"` and the ARIA value
 * attributes; pass a numeric `value` (0–100). Progress renders its own Track
 * and Indicator, and optionally a ProgressLabel / ProgressValue passed as
 * children.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Progress, ProgressLabel, ProgressValue } from './progress.js'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A determinate progress indicator built on the Base UI progress primitive. The role and ARIA value attributes come from Base UI; give it a numeric `value` and optionally a ProgressLabel and ProgressValue.',
      },
    },
  },
  args: {
    value: 60,
    // A progressbar needs an accessible name; a consumer supplies it via
    // aria-label (or a ProgressLabel, as the Variants story shows).
    'aria-label': 'Upload progress',
  },
  render: (args) => (
    <div className='max-w-md'>
      <Progress {...args} />
    </div>
  ),
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="progress"]')
    if (!root) {
      throw new Error('Could not find [data-slot="progress"].')
    }

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    await expect(root).toHaveAttribute('role', 'progressbar')
    await expect(root).toHaveAttribute('aria-valuenow', String(args.value))
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex max-w-md flex-col gap-8'>
      <Progress value={0} aria-label='Empty' />
      <Progress value={40} aria-label='Downloading' />
      <Progress value={100} aria-label='Complete' />

      {/* With a label and a live value read-out — ProgressLabel names it */}
      <Progress value={72}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  // A non-zero value gives the indicator a width so it is laid out.
  args: { value: 60 },
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector<HTMLElement>('[data-slot="progress-indicator"]')
    if (!indicator) {
      throw new Error('Could not find [data-slot="progress-indicator"].')
    }

    // Proves globals.css loaded: bg-primary resolves to a real colour rather
    // than staying transparent.
    const background = getComputedStyle(indicator).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

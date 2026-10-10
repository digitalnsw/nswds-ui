/**
 * Progress — Accessibility
 *
 * One story per WCAG 2.2 criterion a progress bar has to meet, each asserting
 * it in play(). Base UI supplies the progressbar role, the value attributes
 * and the label wiring; these pin that they arrive and keep up with the work,
 * and that the bar and its text can be seen.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Button } from './button.js'
import { Progress, ProgressLabel, ProgressValue } from './progress.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Progress/Accessibility',
  component: Progress,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Progress>

export default meta

// Every story renders its own example, so none takes the component's
// required props as args.
type Story = StoryObj

function UploadingBar({ value }: { value: number }) {
  return (
    <Progress value={value}>
      <ProgressLabel>Uploading passport.pdf</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

function AdvancingUpload() {
  const [value, setValue] = useState(20)
  return (
    <div className='max-w-md space-y-4'>
      <UploadingBar value={value} />
      <Progress value={50} aria-label='Processing your application' />
      <Button variant='outline' onClick={() => setValue((current) => current + 30)}>
        Advance upload
      </Button>
    </div>
  )
}

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user has to know a bar is a progress bar, what it measures and how far along it is — and hear the new value when it moves.',
          how: 'A bar named by its ProgressLabel and one named by aria-label. The play() asserts both are progressbars with those names and a 0–100 range, then advances the first and asserts aria-valuenow follows.',
          caveat:
            'A bar with neither a ProgressLabel nor an aria-label has no name; Progress cannot supply one, so the consumer must.',
        }),
      },
    },
  },
  render: () => <AdvancingUpload />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const upload = canvas.getByRole('progressbar', { name: 'Uploading passport.pdf' })
    const processing = canvas.getByRole('progressbar', { name: 'Processing your application' })

    for (const bar of [upload, processing]) {
      await expect(bar).toHaveAttribute('aria-valuemin', '0')
      await expect(bar).toHaveAttribute('aria-valuemax', '100')
    }
    await expect(upload).toHaveAttribute('aria-valuenow', '20')

    await userEvent.click(canvas.getByRole('button', { name: 'Advance upload' }))
    await expect(upload).toHaveAttribute('aria-valuenow', '50')
    await expect(upload).toHaveTextContent('50%')
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextStory: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'How far along the work is shows only as where the filled indicator ends and the empty track begins; the indicator must stand out from both the track and the page at 3:1.',
          how: 'A bar part-way along, on the page. The play() measures the indicator against the track and against the page.',
          caveat:
            'The empty track is a faint guide and is not itself held to 3:1 against the page; the indicator’s edge is what carries the value.',
        }),
      },
    },
  },
  render: () => (
    <div className='max-w-md bg-background p-6'>
      <UploadingBar value={60} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = getComputedStyle(canvasElement.firstElementChild!).backgroundColor
    const track = getComputedStyle(
      canvasElement.querySelector('[data-slot="progress-track"]')!,
    ).backgroundColor
    const indicator = getComputedStyle(
      canvasElement.querySelector('[data-slot="progress-indicator"]')!,
    ).backgroundColor
    expectContrast(indicator, track, { minimum: 3, label: 'Indicator against the track' })
    expectContrast(indicator, page, { minimum: 3, label: 'Indicator against the page' })
  },
}

export const NonTextContrast: Story = { ...nonTextStory, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextStory,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The label says what is in progress and the value how far; both are small text and the value is muted, so both must clear 4.5:1.',
          how: 'A labelled bar on the page. The play() measures the label and the value against the page background.',
          caveat: 'Measured on the page surface; on a tinted panel, measure again.',
        }),
      },
    },
  },
  render: () => (
    <div className='max-w-md bg-background p-6'>
      <UploadingBar value={60} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = getComputedStyle(canvasElement.firstElementChild!).backgroundColor
    for (const slot of ['progress-label', 'progress-value']) {
      const part = canvasElement.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!
      expectContrast(getComputedStyle(part).color, page, { label: slot })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

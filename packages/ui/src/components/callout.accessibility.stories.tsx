/**
 * Callout — Accessibility
 *
 * One story per WCAG 2.2 criterion a callout has to meet, each asserting it in
 * play(). Callout is a static div: no role, no live region, a decorative glyph.
 * What it owes readers is a status that never rests on colour, text that reads
 * on every status surface, and silence when it is simply part of the page.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Button } from './button.js'
import { Callout } from './callout.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Callout/Accessibility',
  component: Callout,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Callout>

export default meta

type Story = StoryObj<typeof meta>

const statuses = [
  ['info', 'You will need your licence number', 'It is printed on the front of your licence card.'],
  ['success', 'Your application has been approved', 'We will email your certificate soon.'],
  ['warning', 'Planned outage', 'This service will be unavailable on Sunday from 2am to 4am.'],
  ['danger', 'We could not process your payment', 'Your card was declined.'],
] as const

function AllStatuses() {
  return (
    <div className='space-y-4'>
      {statuses.map(([status, title, body]) => (
        <Callout key={status} status={status} title={title}>
          {body}
        </Callout>
      ))}
    </div>
  )
}

const callouts = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="callout"]'))

// ─── 1.4.1 — Use of Color ─────────────────────────────────────────────────────

export const UseOfColor: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'Blue, green, amber and red surfaces look much alike to many readers. Each status needs a shape of its own, and its meaning in words.',
          how: 'One callout per status. The play() asserts each draws a different glyph, and each title states the status in words.',
          caveat:
            'The words are the consumer’s: Callout draws the glyph, but only the title and body can say “approved” or “declined”.',
        }),
      },
    },
  },
  render: () => <AllStatuses />,
  play: async ({ canvasElement }) => {
    const glyphs = callouts(canvasElement).map(
      (callout) => callout.querySelector('[data-slot="callout-icon"]')!.innerHTML,
    )
    await expect(new Set(glyphs).size).toBe(statuses.length)
    for (const [index, callout] of callouts(canvasElement).entries()) {
      await expect(callout.querySelector('[data-slot="callout-title"]')).toHaveTextContent(
        statuses[index]![1],
      )
    }
  },
}

// ─── 1.1.1 — Non-text Content ─────────────────────────────────────────────────

export const NonTextContent: Story = {
  name: 'Non-text Content — 1.1.1',
  parameters: {
    wcag: ['1.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.1.1',
          why: 'The glyph repeats the status the copy states. Exposed, it would be read as an unnamed image, or as a bare word, before the message.',
          how: 'One callout per status. The play() asserts every glyph is aria-hidden and nothing in a callout is exposed as an image.',
          caveat:
            'A custom icon passed through the icon prop is hidden the same way, because Callout sets aria-hidden on whatever it renders.',
        }),
      },
    },
  },
  render: () => <AllStatuses />,
  play: async ({ canvasElement }) => {
    for (const callout of callouts(canvasElement)) {
      await expect(callout.querySelector('[data-slot="callout-icon"]')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
      await expect(within(callout).queryAllByRole('img')).toHaveLength(0)
    }
  },
}

// ─── 4.1.3 — Status Messages ──────────────────────────────────────────────────

function AnnouncedCallout() {
  const [saved, setSaved] = useState(false)
  return (
    <div className='space-y-4'>
      <Callout title='Before you start'>You will need proof of identity.</Callout>
      <Button variant='outline' onClick={() => setSaved(true)}>
        Save draft
      </Button>
      <div role='status'>
        {saved ? (
          <Callout status='success' title='Draft saved'>
            You can come back within 30 days.
          </Callout>
        ) : null}
      </div>
    </div>
  )
}

export const StatusMessages: Story = {
  name: 'Status Messages — 4.1.3',
  parameters: {
    wcag: ['4.1.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.3',
          why: 'A callout that is part of the page is not a status message and must not interrupt a screen reader user on arrival; one shown in response to an action is, and must reach them without moving focus.',
          how: 'A static callout, and one revealed by Save draft inside a role="status" region already on the page. The play() asserts the static one carries no role or aria-live, then saves and asserts the new callout arrives inside the live region while focus stays on the button.',
          caveat:
            'Callout never announces itself, by design. The live region is the consumer’s — or use Toaster, which provides one.',
        }),
      },
    },
  },
  render: () => <AnnouncedCallout />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [staticCallout] = callouts(canvasElement)
    await expect(staticCallout).not.toHaveAttribute('role')
    await expect(staticCallout).not.toHaveAttribute('aria-live')

    const save = canvas.getByRole('button', { name: 'Save draft' })
    await userEvent.click(save)
    await expect(canvas.getByRole('status')).toHaveTextContent('Draft saved')
    await expect(save).toHaveFocus()
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'Each status paints its own surface and ink. The copy must clear 4.5:1 on every one of the four, in both themes.',
          how: 'One callout per status. The play() measures the title and the body text against the callout’s own surface.',
          caveat:
            'The colours are @nswds/tokens role tokens that flip with the theme on their own; the dark story measures that flip.',
        }),
      },
    },
  },
  render: () => <AllStatuses />,
  play: async ({ canvasElement }) => {
    for (const callout of callouts(canvasElement)) {
      const surface = getComputedStyle(callout).backgroundColor
      const title = callout.querySelector<HTMLElement>('[data-slot="callout-title"]')!
      const body = callout.querySelector<HTMLElement>('[data-slot="callout-content"]')!
      const status = callout.dataset.status
      expectContrast(getComputedStyle(title).color, surface, { label: `${status} title` })
      expectContrast(getComputedStyle(body).color, surface, { label: `${status} body` })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextStory: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The glyph is what tells the statuses apart at a glance, so it must stand out from the surface it sits on at 3:1.',
          how: 'One callout per status. The play() measures each glyph’s ink against the callout’s surface.',
          caveat:
            'The border and the tinted surface frame the message but are not needed to understand it, so they are not held to 3:1.',
        }),
      },
    },
  },
  render: () => <AllStatuses />,
  play: async ({ canvasElement }) => {
    for (const callout of callouts(canvasElement)) {
      const glyph = callout.querySelector<SVGElement>('[data-slot="callout-icon"]')!
      expectContrast(getComputedStyle(glyph).color, getComputedStyle(callout).backgroundColor, {
        minimum: 3,
        label: `${callout.dataset.status} glyph`,
      })
    }
  },
}

export const NonTextContrast: Story = { ...nonTextStory, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextStory,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

/**
 * AspectRatio — Accessibility
 *
 * One story per WCAG 2.2 criterion a ratio box has to meet, each asserting it
 * in play(). AspectRatio is a plain sized `<div>`: it adds no role, name or
 * focus stop, so what it must guarantee is that it stays out of the way — the
 * media inside keeps its own text alternative and structure.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { AspectRatio } from './aspect-ratio.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/AspectRatio/Accessibility',
  component: AspectRatio,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

/** A stand-in map: an inline SVG named the way a real image would be. */
function MapGraphic() {
  return (
    <svg
      role='img'
      aria-label='Map of Service NSW centres near Parramatta'
      viewBox='0 0 160 90'
      className='size-full rounded-md bg-muted text-muted-foreground'
    >
      <circle cx='50' cy='40' r='6' fill='currentColor' />
      <circle cx='100' cy='55' r='6' fill='currentColor' />
      <circle cx='120' cy='30' r='6' fill='currentColor' />
    </svg>
  )
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
          why: 'An image or video placed in the frame needs a text alternative, and the frame must pass it through untouched — a wrapper that hid its children, or named itself, would replace the media’s own description.',
          how: 'The play() finds the map by its accessible name inside the frame, and asserts the frame itself carries no role, name or aria-hidden.',
          caveat:
            'AspectRatio cannot supply the alternative: give the image an alt, the video a title or captions, the SVG role="img" and an aria-label.',
        }),
      },
    },
  },
  render: () => (
    <AspectRatio ratio={16 / 9} className='w-80'>
      <MapGraphic />
    </AspectRatio>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector<HTMLElement>('[data-slot="aspect-ratio"]')!
    const map = within(frame).getByRole('img', {
      name: 'Map of Service NSW centres near Parramatta',
    })
    await expect(map).toBeVisible()
    await expect(frame).not.toHaveAttribute('role')
    await expect(frame).not.toHaveAttribute('aria-label')
    await expect(frame).not.toHaveAttribute('aria-hidden')
  },
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The structure around the media — a figure and its caption — has to survive the wrapper, so the caption is still announced as describing the image.',
          how: 'The frame sits inside a figure with a figcaption. The play() asserts the image and its caption are both parts of the one figure, and that the frame is a generic div that adds nothing to the accessibility tree.',
          caveat:
            'Put the figure around the AspectRatio, not inside it: the frame clips to its ratio, so a caption inside it would be cut off or overlap the image.',
        }),
      },
    },
  },
  render: () => (
    <figure className='w-80 space-y-2'>
      <AspectRatio ratio={16 / 9}>
        <MapGraphic />
      </AspectRatio>
      <figcaption className='text-muted-foreground'>
        Three service centres within 5 km of Parramatta station.
      </figcaption>
    </figure>
  ),
  play: async ({ canvasElement }) => {
    // The image and its caption stay direct parts of one figure.
    const figure = within(canvasElement).getByRole('figure')
    const caption = figure.querySelector(':scope > figcaption')
    await expect(caption).toHaveTextContent(
      'Three service centres within 5 km of Parramatta station.',
    )
    await expect(within(figure).getByRole('img')).toBeVisible()
    const frame = figure.querySelector<HTMLElement>('[data-slot="aspect-ratio"]')!
    await expect(frame.tagName).toBe('DIV')
    await expect(frame).not.toHaveAttribute('role')
    await expect(frame).not.toHaveAttribute('tabindex')
  },
}

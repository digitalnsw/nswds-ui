/**
 * Avatar — Accessibility
 *
 * One story per WCAG 2.2 criterion an avatar has to meet, each asserting it in
 * play(). Avatar is a non-interactive span on the Base UI avatar primitive:
 * the image carries the person's name as alt text, the initials stand in when
 * it cannot load, and the status badge is decoration that text must back up.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Avatar/Accessibility',
  component: Avatar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

/** A 1×1 transparent GIF: a real image that loads without a network request. */
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// ─── 1.1.1 — Non-text Content ─────────────────────────────────────────────────

export const NonTextContent: Story = {
  name: 'Non-text Content — 1.1.1',
  parameters: {
    wcag: ['1.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.1.1',
          why: 'A photo of a person is non-text content: a screen reader user needs the person’s name in its place, and nothing at all from a photo that only repeats a name printed beside it.',
          how: 'An avatar whose image has loaded and is named by alt, one beside a printed name with alt="", and one whose image failed and shows initials. The play() asserts the named image is exposed with its name, the decorative one is not exposed, and the failed one falls back to its initials.',
          caveat:
            'Avatar passes alt straight to the img; it cannot tell whether a name is printed nearby. Choose alt="" in that case, as the In context example does, so the name is not read twice.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap items-center gap-8'>
      <Avatar size='lg' data-case='named'>
        <AvatarImage src={PIXEL} alt='Jordan Chen' />
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>
      <div className='flex items-center gap-3' data-case='decorative'>
        <Avatar size='lg'>
          <AvatarImage src={PIXEL} alt='' />
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
        <p className='font-semibold'>Priya Sharma</p>
      </div>
      <Avatar size='lg' data-case='failed'>
        <AvatarImage src='data:,' alt='Mia Nguyen' />
        <AvatarFallback>MN</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The loaded image is exposed by its name…
    const named = await waitFor(() => canvas.getByRole('img', { name: 'Jordan Chen' }))
    await expect(named).toHaveAttribute('data-slot', 'avatar-image')

    // …the decorative one, once loaded, is not exposed at all.
    const decorative = canvasElement.querySelector('[data-case="decorative"]')!
    await waitFor(() => expect(decorative.querySelector('img')).toBeInTheDocument())
    await expect(within(decorative as HTMLElement).queryByRole('img')).toBeNull()

    // …and the one that failed shows its initials instead.
    const failed = canvasElement.querySelector('[data-case="failed"]')!
    await waitFor(() =>
      expect(failed.querySelector('[data-slot="avatar-fallback"]')).toHaveTextContent('MN'),
    )
  },
}

// ─── 1.4.1 — Use of Color ─────────────────────────────────────────────────────

export const UseOfColor: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'The status badge is a coloured dot. Readers who cannot see its colour, or cannot see it at all, must get the status from words.',
          how: 'An avatar with a badge, its status written beside it. The play() asserts the badge holds no text and no accessible name — it is decoration — and the status is present as visible text.',
          caveat:
            'AvatarBadge is an empty span; it cannot say anything itself. Always write the status, as the In context example does.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex items-center gap-4'>
      <Avatar size='lg'>
        <AvatarFallback>PS</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <div>
        <p className='font-semibold'>Priya Sharma</p>
        <p className='text-muted-foreground'>Case officer · Available</p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector<HTMLElement>('[data-slot="avatar-badge"]')!
    await expect(badge).toBeVisible()
    await expect(badge).toHaveTextContent(/^$/)
    await expect(badge).not.toHaveAttribute('role')
    await expect(badge).not.toHaveAttribute('aria-label')
    await expect(within(canvasElement).getByText(/Available/)).toBeVisible()
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
          why: 'Initials and the group count are short text on a muted disc; they must still clear 4.5:1 to be read.',
          how: 'The fallback at every size and a group count. The play() measures each one’s text against its own background.',
          caveat:
            'The fallback and the count paint their own opaque muted background, so they are measured against it rather than the page.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap items-center gap-8 bg-background p-6'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>JC</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const parts = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="avatar-fallback"], [data-slot="avatar-group-count"]',
    )
    await expect(parts).toHaveLength(5)
    for (const part of parts) {
      const style = getComputedStyle(part)
      expectContrast(style.color, style.backgroundColor, { label: `"${part.textContent}"` })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

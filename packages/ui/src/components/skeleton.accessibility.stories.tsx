/**
 * Skeleton — Accessibility
 *
 * One story per WCAG 2.2 criterion a loading placeholder has to meet, each
 * asserting it in play(). Skeleton is a bare div with no role and no text: it
 * is purely visual, so the loading state reaches assistive technology only
 * through the region around it, which these pin.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Skeleton } from './skeleton.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Skeleton/Accessibility',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

function LoadingProfile() {
  return (
    <section aria-labelledby='profile-heading' aria-busy='true' className='max-w-md space-y-4'>
      <h2 id='profile-heading' className='text-xl font-semibold'>
        Your profile
      </h2>
      <span className='sr-only'>Loading your profile</span>
      <div className='flex items-center gap-4'>
        <Skeleton className='size-12 rounded-full' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-4 w-48' />
        </div>
      </div>
    </section>
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
          why: 'The grey blocks tell a sighted reader that content is on its way. A screen reader user needs the same message in text, and nothing from the blocks themselves.',
          how: 'A profile region loading. The play() asserts every skeleton block is empty with no role, so nothing of it is announced, and the region carries the text alternative — “Loading your profile”.',
          caveat:
            'Skeleton cannot supply that text itself; the visually hidden status is the consumer’s, as the Announcing the wait example shows.',
        }),
      },
    },
  },
  render: () => <LoadingProfile />,
  play: async ({ canvasElement }) => {
    const blocks = canvasElement.querySelectorAll<HTMLElement>('[data-slot="skeleton"]')
    await expect(blocks).toHaveLength(3)
    for (const block of blocks) {
      await expect(block).toHaveTextContent(/^$/)
      await expect(block).not.toHaveAttribute('role')
    }
    const region = within(canvasElement).getByRole('region', { name: 'Your profile' })
    await expect(region).toHaveTextContent('Loading your profile')
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
          why: 'That a region is still loading is information a sighted reader gets from the pulse; assistive technology needs it in the markup.',
          how: 'A named profile region loading. The play() asserts the region is exposed with its name and marked aria-busy="true" while its skeletons are in it.',
          caveat:
            'Remove aria-busy, or set it to false, when the real content replaces the skeletons — otherwise some screen readers keep skipping the region.',
        }),
      },
    },
  },
  render: () => <LoadingProfile />,
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Your profile' })
    await expect(region).toHaveAttribute('aria-busy', 'true')
    await expect(region.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
  },
}

/**
 * Empty — Accessibility
 *
 * One story per WCAG 2.2 criterion an empty state has to meet, each asserting
 * it in play(). Empty is a set of styled divs with no role of its own: these
 * pin the heading a consumer passes in, the decorative media, the underlined
 * link and the contrast of its text.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconFolderOpen } from '../icons/folder-open.js'
import { Button } from './button.js'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Empty/Accessibility',
  component: Empty,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

function NoApplications({ className }: { className?: string }) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconFolderOpen aria-hidden='true' />
        </EmptyMedia>
        <EmptyTitle>
          <h2>No applications yet</h2>
        </EmptyTitle>
        <EmptyDescription>
          Applications you start are saved here. You can also{' '}
          <a href='#browse'>browse all services</a>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Start an application</Button>
      </EmptyContent>
    </Empty>
  )
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
          why: 'Where an empty state stands in for a section, its title is that section’s heading. A screen reader user navigating by headings has to find it there.',
          how: 'An empty state whose EmptyTitle holds an h2. The play() asserts the heading is exposed at level 2 with the title’s words, and that the media holds nothing exposed as an image.',
          caveat:
            'EmptyTitle is a div by design, because the right level depends on the page; the heading is the consumer’s to pass in. A plain-text title adds no heading, which is right for an empty state inside a section that already has one.',
        }),
      },
    },
  },
  render: () => <NoApplications className='border' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('No applications yet')
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
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
          why: 'A link inside the description sits in the same muted ink as the words around it. Without an underline, nothing but a hover colour would show it is a link.',
          how: 'An empty state with a bare link in EmptyDescription. The play() asserts the link is underlined at rest, so it is told apart from the text by shape, not colour.',
          caveat:
            'Only bare anchors are underlined. A link that carries its own class — the package’s Link — keeps its own treatment, which underlines by default.',
        }),
      },
    },
  },
  render: () => <NoApplications className='border' />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'browse all services' })
    await expect(getComputedStyle(link).textDecorationLine).toContain('underline')
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
          why: 'The description is set in the muted ink and often explains what to do next; it has to read as clearly as the title.',
          how: 'The empty state on the page with a dashed outline and on a muted fill. The play() measures the title, the description and its link against each surface.',
          caveat:
            'The muted fill is the darkest surface the docs suggest; a consumer’s own tinted background needs measuring on its own.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-6 bg-background p-6 sm:grid-cols-2'>
      <NoApplications className='border' />
      <NoApplications className='bg-muted' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = getComputedStyle(canvasElement.firstElementChild!).backgroundColor
    const empties = canvasElement.querySelectorAll<HTMLElement>('[data-slot="empty"]')
    await expect(empties).toHaveLength(2)
    for (const empty of empties) {
      const own = getComputedStyle(empty).backgroundColor
      const surface = own === 'rgba(0, 0, 0, 0)' ? page : own
      for (const part of [
        empty.querySelector<HTMLElement>('[data-slot="empty-title"]')!,
        empty.querySelector<HTMLElement>('[data-slot="empty-description"]')!,
        empty.querySelector<HTMLElement>('[data-slot="empty-description"] a')!,
      ]) {
        expectContrast(getComputedStyle(part).color, surface, {
          label: `${part.dataset.slot ?? 'link'} on ${empty.className.includes('bg-muted') ? 'muted' : 'page'}`,
        })
      }
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

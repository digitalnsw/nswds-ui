/**
 * Masthead — Accessibility
 *
 * One story per WCAG 2.2 criterion the masthead has to meet, each asserting it
 * in play(). It is a static strip of text with nothing to operate, so what it
 * owes a reader is structure (it says what it is without posing as a landmark
 * or a heading) and legibility, in every colour and both themes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Header, HeaderBrand } from './header.js'
import { Masthead } from './masthead.js'
import { SkipLinks } from './skip-link.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const MASTHEAD_COLORS = ['dark', 'light', 'white', 'grey'] as const

const meta = {
  title: 'Components/Masthead/Accessibility',
  component: Masthead,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Masthead>

export default meta

type Story = StoryObj<typeof meta>

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: "The masthead is a statement, not a region or a title. Exposed as a landmark or a heading it would add an entry to every landmark and heading list on the site, ahead of the page's own.",
          how: 'With a screen reader, read from the top: the skip links, then "A NSW Government website" as plain text, then the banner landmark. List landmarks or headings: the masthead is in neither. The play() asserts the text is exposed, carries no role and holds no heading, and sits between the skip links and the banner in reading order.',
          caveat:
            'A consumer passing children can still put a heading inside it; keep the replacement message to a sentence of plain text.',
        }),
      },
    },
  },
  render: () => (
    <>
      <SkipLinks />
      <Masthead />
      <Header sticky={false}>
        <HeaderBrand sitename='Department of Primary Industries' />
      </Header>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const masthead = canvasElement.querySelector<HTMLElement>('[data-slot="masthead"]')!
    await expect(canvas.getByText('A NSW Government website')).toBeVisible()
    await expect(masthead).not.toHaveAttribute('role')
    await expect(masthead).not.toHaveAttribute('aria-hidden')
    await expect(within(masthead).queryAllByRole('heading')).toHaveLength(0)

    const skipLinks = canvas.getByRole('navigation', { name: 'Skip links' })
    const banner = canvas.getByRole('banner')
    // DOCUMENT_POSITION_FOLLOWING: the argument comes after the node.
    await expect(skipLinks.compareDocumentPosition(masthead) & 4).toBe(4)
    await expect(masthead.compareDocumentPosition(banner) & 4).toBe(4)
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The masthead sits at the 12px step — the one place in the system that size is right — so its colours have to carry it. Every pair is designed to AAA (7:1), well past the 4.5:1 that small text needs.',
          how: 'All four colours are shown. The play() measures each message against its strip with the same contrast maths axe uses, and holds it to the 7:1 the pairs are designed to.',
          caveat:
            'Every colour deepens in dark mode onto the same ramp steps as Header (The Whole-Set Flip Rule); the (dark) story measures those.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-2'>
      {MASTHEAD_COLORS.map((color) => (
        <Masthead key={color} id={`masthead-contrast-${color}`} color={color} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const strips = canvasElement.querySelectorAll<HTMLElement>('[data-slot="masthead"]')
    await expect(strips).toHaveLength(MASTHEAD_COLORS.length)
    for (const strip of strips) {
      const style = getComputedStyle(strip)
      expectContrast(style.color, style.backgroundColor, {
        minimum: 7,
        label: `"${strip.dataset.color}" masthead`,
      })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

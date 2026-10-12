/**
 * HeroBlocks — Accessibility
 *
 * One story per WCAG 2.2 criterion the hero blocks have to meet, each
 * asserting it in play(). Every block is built on the published Hero, so the
 * landmark naming and the surface inks come from it; these pin what a
 * consumer relies on when they install a block — a named region with one
 * h1, two actions named as links, readable text on every surface, and a
 * decorative illustration that is announced as nothing.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import type { HeroColor } from '../components/hero.js'

import { expectContrast, wcagStoryMeta } from '../components/story-helpers.js'
import { HeroCentred } from './hero-centred.js'
import { HeroFramed } from './hero-framed.js'
import { HeroPanel } from './hero-panel.js'
import { HeroSplit } from './hero-split.js'
import { HeroStatement } from './hero-statement.js'

const illustration = { src: '/images/hero-illustration.png', alt: '' }
const heroColors: HeroColor[] = ['white', 'light', 'tint', 'dark']

const meta = {
  title: 'Patterns/HeroBlocks/Accessibility',
  component: HeroSplit,
  parameters: { layout: 'fullscreen' },
  args: { media: illustration },
} satisfies Meta<typeof HeroSplit>

export default meta

type Story = StoryObj<typeof meta>

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'A screen reader user reaches the opener by landmark or by its heading. The structure a sighted reader sees — a title, a sentence, two ways in — has to be in the markup too: one region named by the one h1, and the actions as links.',
          how: 'The play() asserts the split block is a region named by its title, that the title is the only h1, and that both actions are links with their visible labels as names.',
          caveat:
            'Each block gives its title a default id; change labelledBy when two heroes share a page, or the second region points at the first’s title.',
        }),
      },
    },
  },
  render: () => <HeroSplit media={illustration} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Made to send.' })
    await expect(region).toHaveAttribute('aria-labelledby', 'hero-split-title')
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    await expect(canvas.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '#start',
    )
    await expect(canvas.getByRole('link', { name: 'View components' })).toHaveAttribute(
      'href',
      '#components',
    )
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

export const ContrastMinimum: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'A block ships on the surface it was designed for, but takes any of the four. Whichever a consumer picks, the title and description have to clear 4.5:1 on it.',
          how: 'The statement block renders on all four surfaces. The play() measures the painted title and description against the surface each sits on.',
          caveat:
            'Measured in the light theme; dark mode deepens every surface and the inks go white. The actions’ own contrast is Button’s contract, asserted in Button’s accessibility stories.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      {heroColors.map((color) => (
        <HeroStatement key={color} color={color} labelledBy={`a11y-contrast-${color}`} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heroes = canvasElement.querySelectorAll<HTMLElement>('[data-slot="hero"]')
    await expect(heroes).toHaveLength(heroColors.length)
    for (const hero of heroes) {
      const surface = getComputedStyle(hero).backgroundColor
      const color = hero.dataset.color
      const title = hero.querySelector<HTMLElement>('[data-slot="hero-title"]')
      const text = hero.querySelector<HTMLElement>('[data-slot="hero-description"]')
      if (!title || !text) throw new Error(`Expected a title and description on ${color}.`)
      expectContrast(getComputedStyle(title).color, surface, { label: `Title on ${color}` })
      expectContrast(getComputedStyle(text).color, surface, {
        label: `Description on ${color}`,
      })
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
          why: 'In every illustrated block the picture decorates the title. It must be announced as nothing — not as a file name — so the four blocks with artwork render the consumer’s alt unchanged and the statement block renders no image at all.',
          how: 'All five blocks render with an empty alt. The play() asserts each illustrated block has exactly one img with alt="", that none is exposed as an image, and that the statement block has none.',
          caveat:
            'Pass a descriptive alt when the artwork carries meaning the title and description do not; the blocks never write one for you.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      <HeroSplit media={illustration} labelledBy='a11y-img-split' />
      <HeroFramed media={illustration} labelledBy='a11y-img-framed' />
      <HeroPanel media={illustration} labelledBy='a11y-img-panel' />
      <HeroCentred media={illustration} labelledBy='a11y-img-centred' />
      <HeroStatement labelledBy='a11y-img-statement' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heroes = canvasElement.querySelectorAll<HTMLElement>('[data-slot="hero"]')
    await expect(heroes).toHaveLength(5)
    for (const hero of Array.from(heroes).slice(0, 4)) {
      const images = hero.querySelectorAll<HTMLImageElement>('[data-slot="hero-media"] img')
      await expect(images).toHaveLength(1)
      await expect(images[0]).toHaveAttribute('alt', '')
    }
    await expect(heroes.item(4).querySelector('img')).toBeNull()
    await expect(within(canvasElement).queryByRole('img')).toBeNull()
  },
}

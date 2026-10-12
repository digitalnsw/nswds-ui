/**
 * Hero — Accessibility
 *
 * One story per WCAG 2.2 criterion the opening band has to meet, each
 * asserting it in play(). The hero is a named region whose title is the
 * page's h1; its four surfaces each set the inks the title and description
 * read, and the illustration is an image whose alt is the consumer's.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconArrowForward } from '../icons/index.js'
import { ButtonLink } from './button.js'
import {
  Hero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroMedia,
  HeroRule,
  HeroTitle,
  type HeroColor,
} from './hero.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const illustration = { src: 'images/hero-illustration.png', alt: '' }
const description =
  'Reusable components, layouts and tools for NSW Government email: accessible, on-brand and proven in every major client, Outlook included.'
const colors: HeroColor[] = ['white', 'light', 'tint', 'dark']

const meta = {
  title: 'Components/Hero/Accessibility',
  component: Hero,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Hero>

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
          why: 'The hero opens the page, so its title is the page’s title. A screen reader user who jumps to the first heading, or to the first landmark, has to land on it and hear it named.',
          how: 'The play() asserts the hero is a region named by its title, that the title is the document’s one h1, and that the accent rule is hidden from assistive technology.',
          caveat:
            'Pass headingLevel={2} for a hero that opens a section of a page whose h1 sits elsewhere, so the outline keeps one h1. The rule is decorative and must stay aria-hidden.',
        }),
      },
    },
  },
  render: () => (
    <Hero layout='stack' labelledBy='a11y-structure-title'>
      <HeroContent>
        <HeroRule />
        <HeroTitle id='a11y-structure-title'>On-brand in every inbox.</HeroTitle>
        <HeroDescription>{description}</HeroDescription>
      </HeroContent>
    </Hero>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'On-brand in every inbox.' })
    await expect(region).toHaveAttribute('aria-labelledby', 'a11y-structure-title')
    const headings = canvas.getAllByRole('heading', { level: 1 })
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveAttribute('id', 'a11y-structure-title')
    const rule = canvasElement.querySelector('[data-slot="hero-rule"]')
    await expect(rule).toHaveAttribute('aria-hidden', 'true')
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
          why: 'Each surface sets the inks its slots read. A retuned token could drop the description below 4.5:1 on one surface without any other gate noticing, since the description’s colour is a custom property, not a role token axe can follow.',
          how: 'All four surfaces render side by side. The play() measures the painted title and description colours against each surface and asserts 4.5:1, the large-text title included.',
          caveat:
            'Measured in the light theme here; the dark theme deepens each surface and the inks go white, which clears the same bar by more. Button colours are Button’s own contract.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      {colors.map((color) => (
        <Hero key={color} color={color} layout='stack' labelledBy={`a11y-contrast-${color}`}>
          <HeroContent className='max-sm:py-10 sm:max-lg:py-10 lg:py-12'>
            <HeroTitle id={`a11y-contrast-${color}`} headingLevel={2}>
              {color}
            </HeroTitle>
            <HeroDescription>{description}</HeroDescription>
          </HeroContent>
        </Hero>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heroes = canvasElement.querySelectorAll<HTMLElement>('[data-slot="hero"]')
    await expect(heroes).toHaveLength(colors.length)
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
          why: 'The illustration usually decorates the title and says nothing the text does not, so it must be announced as nothing at all — not as its file name, which is what an image with no alt attribute becomes.',
          how: 'The media slot renders the consumer’s img unchanged. The play() asserts the image carries an alt attribute, and that an empty one removes it from the accessibility tree.',
          caveat:
            'HeroMedia never writes alt for you. Pass alt="" for a decorative picture, or describe it when it carries meaning the title and description do not.',
        }),
      },
    },
  },
  render: () => (
    <Hero color='dark' layout='split' labelledBy='a11y-media-title'>
      <HeroContent>
        <HeroTitle id='a11y-media-title'>Made to send.</HeroTitle>
        <HeroDescription>{description}</HeroDescription>
        <HeroActions>
          <ButtonLink href='#start' color='white' trailingVisual={IconArrowForward}>
            Get started
          </ButtonLink>
        </HeroActions>
      </HeroContent>
      <HeroMedia fit='bleed'>
        <img src={illustration.src} alt={illustration.alt} />
      </HeroMedia>
    </Hero>
  ),
  play: async ({ canvasElement }) => {
    const img = canvasElement.querySelector<HTMLImageElement>('[data-slot="hero-media"] img')
    if (!img) throw new Error('Expected an img inside HeroMedia.')
    await expect(img).toHaveAttribute('alt', '')
    await expect(within(canvasElement).queryByRole('img')).toBeNull()
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'On the dark surface the actions are white buttons on navy. Their focus ring is Button’s, drawn in the button’s own ink and offset onto the page, so it has to read against the hero’s surface rather than the button’s.',
          how: 'The play() focuses the first action and asserts a visible outline whose colour clears 3:1 against the hero’s surface.',
          caveat:
            'Button paints the ring on pointer focus too, by design. The ring colour is the button’s ink, which is why the actions on a dark hero take color="white".',
        }),
      },
    },
  },
  render: () => (
    <Hero color='dark' layout='stack' labelledBy='a11y-focus-title'>
      <HeroContent>
        <HeroTitle id='a11y-focus-title'>Made to send.</HeroTitle>
        <HeroActions>
          <ButtonLink href='#start' color='white' trailingVisual={IconArrowForward}>
            Get started
          </ButtonLink>
          <ButtonLink href='#components' variant='outline' color='white'>
            View components
          </ButtonLink>
        </HeroActions>
      </HeroContent>
    </Hero>
  ),
  play: async ({ canvasElement }) => {
    const hero = canvasElement.querySelector<HTMLElement>('[data-slot="hero"]')!
    const first = within(canvasElement).getByRole('link', { name: 'Get started' })
    first.focus()
    await expect(first).toHaveFocus()
    const style = getComputedStyle(first)
    await expect(style.outlineStyle).not.toBe('none')
    await expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0)
    expectContrast(style.outlineColor, getComputedStyle(hero).backgroundColor, {
      minimum: 3,
      label: 'Focus ring on the dark hero',
    })
  },
}

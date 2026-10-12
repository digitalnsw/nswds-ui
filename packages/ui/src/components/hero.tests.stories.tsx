/**
 * Hero — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { Hero, HeroContent, HeroMedia, HeroTitle } from './hero.js'

const meta = {
  title: 'Components/Hero/Tests',
  component: Hero,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Hero>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * `null` is what cva's `VariantProps` admits and `??` falls through, but the
 * native `color?: string` attribute `HeroProps` intersects narrows it away for
 * TypeScript consumers. Untyped consumers — the shadcn registry copies, plain
 * JS — can still pass it, so the story reaches that path the way they would.
 * `layout`, `container` and `fit` collide with no native attribute and take
 * `null` as typed.
 */
const nullColour = { color: null } as unknown as Pick<ComponentProps<typeof Hero>, 'color'>

const illustration = { src: 'images/hero-illustration.png', alt: '' }

function querySlot(root: HTMLElement, slot: string) {
  const el = root.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  if (!el) {
    throw new Error(`Could not find an element with [data-slot="${slot}"] inside #${root.id}.`)
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * `null` is the value cva and `??` disagree on: cva reads an explicit `null`
 * as "no variant" (no classes for that axis at all) where `??` falls through
 * to the default. Before the variants were normalised once, that produced a
 * section whose `data-color` said `white`, `data-layout` said `split` and
 * `data-fit` said `framed` while the classes painted none of them. This
 * renders the two spellings of every default side by side and holds them to
 * the same output — classes, data attributes and painted surface.
 */
export const NullVariantsAreTheDefaults: Story = {
  name: 'Null variants are the defaults',
  render: () => (
    <div className='space-y-4'>
      <Hero id='hero-default' labelledBy='hero-default-title'>
        <HeroContent>
          <HeroTitle id='hero-default-title'>Default variants</HeroTitle>
        </HeroContent>
        <HeroMedia>
          <img src={illustration.src} alt={illustration.alt} />
        </HeroMedia>
      </Hero>
      <Hero
        id='hero-null'
        {...nullColour}
        layout={null}
        container={null}
        labelledBy='hero-null-title'
      >
        <HeroContent>
          <HeroTitle id='hero-null-title'>Null variants</HeroTitle>
        </HeroContent>
        <HeroMedia fit={null}>
          <img src={illustration.src} alt={illustration.alt} />
        </HeroMedia>
      </Hero>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heroes = canvasElement.querySelectorAll<HTMLElement>('[data-slot="hero"]')
    const [byDefault, byNull] = heroes
    if (!byDefault || !byNull || heroes.length !== 2) {
      throw new Error(`Expected 2 heroes, got ${heroes.length}.`)
    }

    const expected = { color: 'white', layout: 'split' }
    for (const [key, value] of Object.entries(expected)) {
      if (byNull.dataset[key] !== value) {
        throw new Error(
          `Expected null ${key} to report data-${key}="${value}", got "${byNull.dataset[key]}".`,
        )
      }
    }
    if (!byNull.classList.contains('bg-white')) {
      throw new Error(
        `Expected color={null} to carry the default surface classes (bg-white), got "${byNull.className}".`,
      )
    }
    if (byNull.className !== byDefault.className) {
      throw new Error(
        `Expected color={null} to render the same classes as the default:\n  default: ${byDefault.className}\n  null:    ${byNull.className}`,
      )
    }

    const defaultBg = getComputedStyle(byDefault).backgroundColor
    const nullBg = getComputedStyle(byNull).backgroundColor
    if (nullBg !== defaultBg) {
      throw new Error(
        `Expected color={null} to paint the default surface (${defaultBg}), got ${nullBg}.`,
      )
    }

    // layout and container live on the inner column.
    const innerDefault = querySlot(byDefault, 'hero-inner')
    const innerNull = querySlot(byNull, 'hero-inner')
    if (!innerNull.classList.contains('grid')) {
      throw new Error(
        `Expected layout={null} to carry the split layout classes (grid), got "${innerNull.className}".`,
      )
    }
    if (innerNull.className !== innerDefault.className) {
      throw new Error(
        `Expected layout={null} and container={null} to render the same inner classes as the defaults:\n  default: ${innerDefault.className}\n  null:    ${innerNull.className}`,
      )
    }

    // fit lives on the media slot.
    const mediaDefault = querySlot(byDefault, 'hero-media')
    const mediaNull = querySlot(byNull, 'hero-media')
    if (mediaNull.dataset.fit !== 'framed') {
      throw new Error(
        `Expected fit={null} to report data-fit="framed", got "${mediaNull.dataset.fit}".`,
      )
    }
    if (mediaNull.className !== mediaDefault.className) {
      throw new Error(
        `Expected fit={null} to render the same media classes as the default:\n  default: ${mediaDefault.className}\n  null:    ${mediaNull.className}`,
      )
    }
  },
}

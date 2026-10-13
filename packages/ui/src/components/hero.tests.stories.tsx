/**
 * Hero — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Hero, HeroContent, HeroMedia, HeroTitle } from './hero.js'
import { expectNullVariantsMatchDefault, queryVariantPair } from './story-helpers.js'

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

const illustration = { src: 'images/hero-illustration.png', alt: '' }

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * `null` is the value cva and `??` disagree on: cva reads an explicit `null`
 * as "no variant" (no classes for that axis at all) where `??` falls through
 * to the default. Each variant is now resolved once (`resolveVariant`), so the
 * null spelling and the default spelling must render identically: classes,
 * data attributes and painted result, on the band (`color`), the inner column
 * (`layout`, `container`) and the media slot (`fit`).
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
      <Hero id='hero-null' color={null} layout={null} container={null} labelledBy='hero-null-title'>
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
    const [byDefault, byNull] = queryVariantPair(canvasElement, 'hero')
    expectNullVariantsMatchDefault(byDefault, byNull, {
      attrs: { color: 'white', layout: 'split' },
      sentinelClass: 'bg-white',
      innerSlot: 'hero-inner',
    })
    const [mediaDefault, mediaNull] = queryVariantPair(canvasElement, 'hero-media')
    expectNullVariantsMatchDefault(mediaDefault, mediaNull, {
      attrs: { fit: 'framed' },
      sentinelClass: 'aspect-3/2',
      style: [],
    })
  },
}

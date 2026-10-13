/**
 * Hero blocks — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { expectNullVariantsMatchDefault, queryVariantPair } from '../components/story-helpers.js'
import { HeroPanel } from './hero-panel.js'

const media = { src: 'images/hero-illustration.png', alt: '' }

const meta = {
  title: 'Patterns/HeroBlocks/Tests',
  component: HeroPanel,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  // `media` is required, so every story carries it through args.
  args: { media },
} satisfies Meta<typeof HeroPanel>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Each block resolves its own colour default before handing it to `Hero`, so
 * a `null` from an untyped consumer lands on the block's documented surface
 * (`tint` here) rather than falling through to Hero's `white`. HeroPanel is
 * the block whose default differs most visibly from Hero's.
 */
export const NullColourIsTheBlockDefault: Story = {
  name: 'Null colour is the block default',
  render: (args) => (
    <div className='space-y-4'>
      <HeroPanel {...args} labelledBy='hero-panel-default-title' />
      <HeroPanel {...args} color={null} labelledBy='hero-panel-null-title' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [byDefault, byNull] = queryVariantPair(canvasElement, 'hero')
    expectNullVariantsMatchDefault(byDefault, byNull, {
      attrs: { color: 'tint' },
      sentinelClass: 'bg-primary-200',
      innerSlot: 'hero-inner',
    })
  },
}

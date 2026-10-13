/**
 * Hero blocks — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { expectNullVariantsMatchDefault, queryVariantPair } from '../components/story-helpers.js'
import { HeroPanel } from './hero-panel.js'
import { HeroSplit } from './hero-split.js'

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

/**
 * HeroSplit's own default is the `dark` brand band with white actions. Before
 * the block resolved its colour, `null` fell through to Hero's `white` surface
 * and the actions took `primary`, a coherent-looking but wrong block. The band
 * and the primary action are both held to the default spelling.
 */
export const NullColourIsTheSplitDefault: Story = {
  name: 'Null colour is the split default',
  render: (args) => (
    <div className='space-y-4'>
      <HeroSplit media={args.media} labelledBy='hero-split-default-title' />
      <HeroSplit media={args.media} color={null} labelledBy='hero-split-null-title' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [byDefault, byNull] = queryVariantPair(canvasElement, 'hero')
    expectNullVariantsMatchDefault(byDefault, byNull, {
      attrs: { color: 'dark' },
      sentinelClass: 'bg-primary-800',
      innerSlot: 'hero-inner',
    })
    const actionDefault = byDefault.querySelector<HTMLElement>('[data-slot="hero-actions"] a')
    const actionNull = byNull.querySelector<HTMLElement>('[data-slot="hero-actions"] a')
    if (!actionDefault || !actionNull) {
      throw new Error('Expected a primary action inside each hero.')
    }
    if (actionNull.className !== actionDefault.className) {
      throw new Error(
        `Expected the null spelling's action to keep the default styling:\n  default: ${actionDefault.className}\n  null:    ${actionNull.className}`,
      )
    }
  },
}

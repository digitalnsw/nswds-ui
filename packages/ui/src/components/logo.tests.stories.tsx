/**
 * Logo — Tests
 *
 * Regression coverage for every `logoType`. The colourway matrix renders all
 * four types for visual review, each on the surface it is chosen for (DESIGN.md,
 * The Fixed-Mark Rule): light types on the page, reversed on the -800 brand
 * band, the restricted mono-white on a -600 surface. The wordmark check lives
 * in logo.features.stories.tsx (Wordmark), where it has always been.
 *
 * The Logo has no `data-slot`, so assertions query the SVG and the sr-only
 * accessible-name span directly.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Logo } from './logo.js'

const meta = {
  title: 'Components/Logo/Tests',
  component: Logo,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    logoType: 'default',
  },
} satisfies Meta<typeof Logo>

export default meta

type Story = StoryObj<typeof meta>

const pageTile = 'space-y-3 rounded-md bg-background p-6 ring-1 ring-foreground/10'
const bandTile = 'space-y-3 rounded-md bg-primary-800 p-6 text-white dark:bg-primary-950'
// The -600 surface the restricted mono-white mark is chosen for (Footer's fallback).
const midTile = 'space-y-3 rounded-md bg-primary-600 p-6 text-white'

export const AllLogoTypes: Story = {
  name: 'All logo types',
  render: () => (
    <div className='grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2'>
      <div className={pageTile}>
        <Logo logoType='default' className='h-16 w-auto' />
        <p className='text-base text-muted-foreground'>default</p>
      </div>
      <div className={pageTile}>
        <Logo logoType='mono-black' className='h-16 w-auto' />
        <p className='text-base text-muted-foreground'>mono-black</p>
      </div>
      <div className={bandTile}>
        <Logo logoType='reversed' className='h-16 w-auto' />
        <p className='text-base'>reversed</p>
      </div>
      <div className={midTile}>
        <Logo logoType='mono-white' className='h-16 w-auto' />
        <p className='text-base'>mono-white</p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Every type keeps the same accessible name and hides its geometry.
    const svgs = canvasElement.querySelectorAll('svg')
    if (svgs.length !== 4) {
      throw new Error(`Expected 4 rendered marks, found ${svgs.length}.`)
    }
    for (const svg of svgs) {
      if (svg.getAttribute('aria-hidden') !== 'true') {
        throw new Error('Expected every Logo svg to carry aria-hidden="true".')
      }
    }
    for (const span of canvasElement.querySelectorAll('span.sr-only')) {
      if (span.textContent !== 'NSW Government') {
        throw new Error(
          `Expected accessible name "NSW Government", received "${span.textContent}".`,
        )
      }
    }
  },
}

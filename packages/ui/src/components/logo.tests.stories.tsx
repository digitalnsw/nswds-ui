/**
 * Logo — Tests
 *
 * Regression coverage for every `logoType` and both wordmarks. The colourway
 * matrix renders all four types for visual review — including the restricted
 * mono marks, which the docs page deliberately never shows as an example (see
 * DESIGN.md, The Fixed-Mark Rule). Each type sits on the surface it resolves
 * against: light types on the page, light-on-dark types on the brand band.
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
      <div className={bandTile}>
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

export const Wordmark: Story = {
  name: 'Wordmark',
  render: () => (
    <div className='flex flex-wrap items-end gap-8'>
      <div className={pageTile}>
        <Logo className='h-20 w-auto' />
        <p className='text-base text-muted-foreground'>full (default)</p>
      </div>
      <div className={pageTile}>
        <Logo wordmark='nsw' className='h-20 w-auto' />
        <p className='text-base text-muted-foreground'>nsw</p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg')
    const nsw = [...svgs].find((s) => s.getAttribute('viewBox') === '0 0 259 247')
    if (!nsw) {
      throw new Error('Expected an nsw-wordmark Logo with viewBox "0 0 259 247".')
    }
    // The full mark draws four paths; the nsw mark drops the "Government" row,
    // so it must draw exactly three.
    const pathCount = nsw.querySelectorAll('path').length
    if (pathCount !== 3) {
      throw new Error(`Expected the nsw wordmark to draw 3 paths, found ${pathCount}.`)
    }
    const srOnly = canvasElement.querySelectorAll('span.sr-only')
    for (const span of srOnly) {
      if (span.textContent !== 'NSW Government') {
        throw new Error(
          `Expected every Logo accessible name to stay "NSW Government", received "${span.textContent}".`,
        )
      }
    }
  },
}

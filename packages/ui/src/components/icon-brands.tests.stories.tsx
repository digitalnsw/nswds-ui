/**
 * IconBrands — Tests
 *
 * Every mark is exported and paints with currentColor, and a CSS check.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import * as BrandIcons from '../icons/brands/index.js'

const brandEntries = Object.entries(BrandIcons) as Array<
  [string, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element]
>

const meta = {
  title: 'Components/IconBrands/Tests',
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AllSixMarks: Story = {
  name: 'All six marks',
  render: () => (
    <ul className='flex flex-wrap gap-6'>
      {brandEntries.map(([name, Icon]) => (
        <li key={name} className='flex w-28 flex-col items-center gap-2 text-center'>
          <Icon aria-hidden='true' className='size-8 text-foreground' />
          <code className='text-base text-muted-foreground'>{name}</code>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    // All six must be present — a mark silently dropped from the barrel would
    // leave a consumer's footer row one channel short with no error.
    const expected = [
      'IconFacebook',
      'IconGitHub',
      'IconInstagram',
      'IconLinkedIn',
      'IconX',
      'IconYouTube',
    ]
    const exported = brandEntries.map(([name]) => name).sort()
    if (exported.join(',') !== expected.join(',')) {
      throw new Error(`Expected ${expected.join(', ')}, received ${exported.join(', ')}.`)
    }

    const svgs = canvasElement.querySelectorAll('svg')
    if (svgs.length !== expected.length) {
      throw new Error(`Expected ${expected.length} rendered marks, received ${svgs.length}.`)
    }

    // They must paint with currentColor, or they cannot follow the ink of the
    // button slot that renders them (and would vanish on a dark footer).
    for (const svg of svgs) {
      if (svg.getAttribute('fill') !== 'currentColor') {
        throw new Error(`Expected fill="currentColor", received "${svg.getAttribute('fill')}".`)
      }
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
  render: () => (
    <div className='text-primary'>
      <BrandIcons.IconLinkedIn aria-hidden='true' className='size-8' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    if (!svg) {
      throw new Error('Could not find a rendered mark.')
    }

    const styles = getComputedStyle(svg)

    // Proves globals.css loaded: size-8 resolves to 32px rather than the
    // browser's default SVG sizing.
    if (styles.width !== '32px') {
      throw new Error(`Expected size-8 to resolve to 32px, received "${styles.width}".`)
    }

    // currentColor must inherit the surrounding ink, which is what lets the
    // button slot colour these without the mark hardcoding anything.
    if (styles.color === '' || styles.color === 'rgba(0, 0, 0, 0)') {
      throw new Error(`Expected the mark to inherit a resolved colour, received "${styles.color}".`)
    }
  },
}

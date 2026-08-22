/**
 * Icons / Brands — Default, Variants, CssCheck
 *
 * The six third-party brand marks, which the generated Material Symbols set
 * does not contain. They sit in their own sidebar folder under Icons because
 * `icons.stories.tsx` builds its gallery from the generated barrel, and these
 * are deliberately not in it — see `../icons/brands/index.tsx`.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import * as BrandIcons from '../icons/brands/index.js'
import { FooterSocialLink } from './footer.js'

const brandEntries = Object.entries(BrandIcons) as Array<
  [string, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element]
>

/** The channels a NSW Government footer actually links to. */
const CHANNELS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/NSWGovernment',
    icon: BrandIcons.IconFacebook,
  },
  { name: 'X', href: 'https://x.com/NSWGovernment', icon: BrandIcons.IconX },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/user/nswgovernment',
    icon: BrandIcons.IconYouTube,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/nswgovernment',
    icon: BrandIcons.IconLinkedIn,
  },
  { name: 'Instagram', href: 'https://www.instagram.com/nswgov/', icon: BrandIcons.IconInstagram },
  { name: 'GitHub', href: 'https://github.com/digitalnsw', icon: BrandIcons.IconGitHub },
]

const meta = {
  title: 'Components/Icons/Brands',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Third-party brand marks for the footer social row. The NSWDS icon set is Material Symbols and contains none, but FooterSocialLinkItem requires an icon — so without these the footer cannot be completed from the package alone, and every site re-copies the same SVG paths. Unlike the generated set these are client references, so they can be passed as a component (not just an element) from a server component. Marks are the trademarks of their respective owners; do not restyle them beyond colour.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ul className='flex flex-wrap gap-6'>
      {brandEntries.map(([name, Icon]) => (
        <li key={name} className='flex w-28 flex-col items-center gap-2 text-center'>
          <Icon aria-hidden='true' className='size-8 text-foreground' />
          <code className='text-sm text-muted-foreground'>{name}</code>
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

export const Variants: Story = {
  name: 'In a footer social row',
  render: () => (
    <div className='flex flex-col gap-8'>
      <div>
        <h3 className='mb-3 font-bold text-foreground'>On the page surface</h3>
        <ul className='flex flex-wrap items-center gap-1'>
          {CHANNELS.map(({ name, href, icon }) => (
            <li key={name}>
              <FooterSocialLink href={href} label={`Follow us on ${name}`} icon={icon} />
            </li>
          ))}
        </ul>
      </div>

      <div className='rounded-md bg-primary p-6'>
        <h3 className='mb-3 font-bold text-primary-foreground'>On a dark footer surface</h3>
        <ul className='flex flex-wrap items-center gap-1 text-primary-foreground'>
          {CHANNELS.map(({ name, href, icon }) => (
            <li key={name}>
              <FooterSocialLink href={href} label={`Follow us on ${name}`} icon={icon} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
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

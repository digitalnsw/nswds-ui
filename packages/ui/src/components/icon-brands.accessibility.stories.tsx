/**
 * IconBrands — Accessibility
 *
 * One story per WCAG 2.2 criterion the brand marks have to meet, each
 * asserting it in play(). A mark is an inline SVG that paints with
 * currentColor and has no name of its own; in use it sits inside a
 * FooterSocialLink, which names the link and gives it its target. These pin
 * the naming, the target size and the colours.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconFacebook, IconLinkedIn, IconX, IconYouTube } from '../icons/brands/index.js'
import { FooterSocialLink } from './footer.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/IconBrands/Accessibility',
  component: IconLinkedIn,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof IconLinkedIn>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The opaque colour an element is painted on: its own background composited
 * over each ancestor's until an opaque one is reached.
 */
function paintedBackground(element: Element): string {
  const layers: string[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const background = getComputedStyle(node).backgroundColor
    layers.push(background)
    if (resolveColor(background).a === 1) {
      const [base, ...tints] = layers.reverse()
      let painted = resolveColor(base!)
      for (const tint of tints) painted = { ...compositeOver(resolveColor(tint), painted), a: 1 }
      return `rgb(${painted.r} ${painted.g} ${painted.b})`
    }
  }
  throw new Error('No opaque background behind the element.')
}

const channels = [
  { name: 'Facebook', href: 'https://www.facebook.com/NSWGovernment', icon: IconFacebook },
  { name: 'X', href: 'https://x.com/NSWGovernment', icon: IconX },
  { name: 'YouTube', href: 'https://www.youtube.com/user/nswgovernment', icon: IconYouTube },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/nswgovernment',
    icon: IconLinkedIn,
  },
]

function SocialRow() {
  return (
    <ul className='flex flex-wrap items-center gap-1' aria-label='Follow NSW Government'>
      {channels.map(({ name, href, icon }) => (
        <li key={name}>
          <FooterSocialLink href={href} label={`Follow us on ${name}`} icon={icon} />
        </li>
      ))}
    </ul>
  )
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
          why: 'A row of logos means nothing to someone who cannot see them. Each link needs a text alternative that says where it goes, and the logo inside must not be read out as an unnamed graphic as well.',
          how: 'The play() asserts each social link is named “Follow us on …”, that the name is the whole of it — the mark adds nothing — and that no mark is exposed as an image of its own.',
          caveat:
            'Name the link with what it does (“Follow us on LinkedIn”), not the brand alone. FooterSocialLink takes that as label and sets it as aria-label.',
        }),
      },
    },
  },
  render: () => <SocialRow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const { name } of channels) {
      const link = canvas.getByRole('link', { name: `Follow us on ${name}` })
      await expect(link).toHaveAccessibleName(`Follow us on ${name}`)
      await expect(link.querySelector('svg')).toBeInTheDocument()
    }
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSizeMinimum: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Social links sit in a tight row of small marks, which is exactly where a mis-tap lands on the neighbour. Each target must be at least 24 by 24 CSS pixels.',
          how: 'The play() measures every social link’s rendered box and asserts it is at least 24px in both directions.',
          caveat:
            'The links are Button-based at the 40px icon size, larger than the mark they hold, so the hit area is the button, not the glyph.',
        }),
      },
    },
  },
  render: () => <SocialRow />,
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    await expect(links).toHaveLength(channels.length)
    for (const link of links) {
      const { width, height } = link.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(24)
      await expect(height).toBeGreaterThanOrEqual(24)
    }
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Non-text Contrast — 1.4.11',
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'A mark is the only thing that tells a sighted reader which channel a link leads to, so it must stand out from its surface by 3:1.',
          how: 'The marks are shown as the Colours section uses them: in the foreground colour on the page, and inheriting white on the brand band. The play() measures each against the colour painted behind it. The (dark) story repeats it in dark mode.',
          caveat:
            'The marks inherit currentColor, so this measures the inks they are documented with. Recolouring them for a brand palette needs re-checking.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      <div className='flex gap-4 p-4'>
        {channels.map(({ name, icon: Icon }) => (
          <Icon key={name} aria-hidden='true' className='size-8 text-foreground' />
        ))}
      </div>
      <div className='flex gap-4 rounded-md bg-primary p-4 text-primary-foreground'>
        {channels.map(({ name, icon: Icon }) => (
          <Icon key={name} aria-hidden='true' className='size-8' />
        ))}
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const marks = canvasElement.querySelectorAll('svg')
    await expect(marks).toHaveLength(channels.length * 2)
    marks.forEach((mark, i) => {
      expectContrast(getComputedStyle(mark).color, paintedBackground(mark), {
        minimum: 3,
        label: `${channels[i % channels.length]!.name} ${i < channels.length ? 'on the page' : 'on the brand band'}`,
      })
    })
  },
}

export const NonTextContrast: Story = { ...contrastStory, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...contrastStory,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

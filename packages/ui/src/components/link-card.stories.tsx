/**
 * LinkCard — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LinkCard } from './link-card.js'

const meta = {
  title: 'Components/Link Card',
  component: LinkCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'LinkCard is a card whose entire surface is one link. The obvious hand-built version puts an anchor on the title, another on the description and a third on the arrow — three tab stops and three competing accessible names for one destination. This stretches a single anchor over the card instead, so the accessibility tree sees exactly one link, named by the title. It follows that the card cannot contain a second interactive element, and that its text is not drag-selectable.',
      },
    },
  },
  args: {
    href: '#specimen',
    title: 'Public Sans on GitHub',
    label: 'Source',
    description: 'The upstream repository, issue tracker and release archive for the typeface.',
    external: false,
  },
  argTypes: {
    external: {
      control: 'boolean',
      description:
        'Render the link as an ExternalLink — adds the new-tab treatment and swaps the corner glyph.',
      table: { category: 'Behaviour' },
    },
    label: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    className: { table: { disable: true, category: 'Advanced' } },
  },
  render: (args) => (
    <div className='max-w-sm'>
      <LinkCard {...args} />
    </div>
  ),
} satisfies Meta<typeof LinkCard>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCard(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="link-card"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="link-card"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const card = getCard(canvasElement)

    // The whole point of the component: exactly one link, whatever else the
    // card renders.
    const anchors = card.querySelectorAll('a')
    if (anchors.length !== 1) {
      throw new Error(`Expected exactly one anchor in the card, received ${anchors.length}.`)
    }

    const anchor = anchors[0]
    if (anchor?.getAttribute('href') !== args.href) {
      throw new Error(
        `Expected href="${String(args.href)}", received "${anchor?.getAttribute('href')}".`,
      )
    }

    // The corner glyph must be decorative — it is a duplicate affordance for a
    // link that already has an accessible name.
    const icon = card.querySelector('[data-slot="link-card-icon"]')
    if (icon?.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the corner icon to be aria-hidden.')
    }
  },
}

export const Variants: Story = {
  render: () => (
    <div className='grid gap-6 sm:grid-cols-2'>
      <LinkCard
        href='#internal'
        label='Guidance'
        title='How to install the typeface'
        description='Step-by-step instructions for Windows and macOS.'
      />
      <LinkCard
        href='https://public-sans.digital.gov/'
        external
        label='Upstream'
        title='Public Sans project site'
        description='The full character set, including extended Latin and currency symbols.'
      />
      <LinkCard href='#minimal' title='Title only' />
      <LinkCard
        href='#no-label'
        title='No kicker'
        description='A card with a description but no label above the title.'
      />
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const card = getCard(canvasElement)

    // The stretched-link technique needs a positioned ancestor, or the
    // anchor's ::after would size against the viewport instead of the card.
    const position = getComputedStyle(card).position
    if (position !== 'relative') {
      throw new Error(`Expected the card to be position: relative, received "${position}".`)
    }

    const anchor = card.querySelector('a')
    if (!anchor) {
      throw new Error('Could not find the card anchor.')
    }
    const overlay = getComputedStyle(anchor, '::after')
    if (overlay.position !== 'absolute') {
      throw new Error(
        `Expected the anchor ::after overlay to be absolutely positioned, received "${overlay.position}".`,
      )
    }
  },
}

/**
 * LinkCard — Tests
 *
 * Stories that prove the stretched-link technique holds, rather than show it.
 * They stay out of the sidebar (`!dev`) but run in the Vitest suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LinkCard } from './link-card.js'

const meta = {
  title: 'Components/LinkCard/Tests',
  component: LinkCard,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  args: {
    href: '#specimen',
    title: 'Public Sans on GitHub',
    label: 'Source',
    description: 'The upstream repository, issue tracker and release archive for the typeface.',
    external: false,
  },
  render: (args) => (
    <div className='max-w-sm'>
      <LinkCard {...args} />
    </div>
  ),
} satisfies Meta<typeof LinkCard>

export default meta

type Story = StoryObj<typeof meta>

function getCard(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="link-card"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="link-card"].')
  }
  return el
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

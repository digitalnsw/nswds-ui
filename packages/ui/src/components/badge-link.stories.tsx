/**
 * BadgeLink — badge-styled navigation.
 *
 * Exercises the anchor rendering path created by the v2 BadgeButton/BadgeLink
 * split: anchor semantics, focus-ring wrapper, and LinkProvider integration.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { expect } from 'storybook/test'

import { BadgeLink } from './badge.js'
import { LinkProvider } from './link.js'
import { surfaceClasses } from './story-helpers.js'

const colors = ['primary', 'secondary', 'tertiary', 'accent', 'grey'] as const
const variants = ['solid', 'soft', 'surface', 'outline'] as const

const meta = {
  title: 'Components/Badge/BadgeLink',
  component: BadgeLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Badge-styled anchor. Renders through `Link` (so `LinkProvider` framework links apply) and wraps the inner Badge with its own focus ring and 44px touch target.',
      },
    },
  },
  args: {
    href: '#',
    children: 'Documentation',
  },
} satisfies Meta<typeof BadgeLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const anchor = canvasElement.querySelector('a')
    if (!anchor) throw new Error('BadgeLink did not render an <a> element.')
    await expect(anchor).toHaveAttribute('href', '#')
    await expect(anchor.tabIndex).toBe(0)
    // The visible badge is inside the anchor (focus ring wraps it).
    const badge = anchor.querySelector('[data-variant], span')
    if (!badge) throw new Error('BadgeLink did not render its inner Badge.')
  },
}

export const Variants: Story = {
  render: (args) => (
    <div className='space-y-3'>
      {variants.map((variant) => (
        <div key={variant} className='flex flex-wrap items-center gap-3'>
          {colors.map((color) => (
            // On-dark colours (secondary, white) need their designed surface
            // — same convention as the Badge/Button matrix stories.
            <div key={color} className={surfaceClasses(color)}>
              <BadgeLink {...args} variant={variant} color={color}>
                {variant}/{color}
              </BadgeLink>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const WithLinkProvider: Story = {
  render: (args) => (
    <LinkProvider
      component={(props: React.ComponentPropsWithoutRef<'a'>) => (
        <a data-framework-link='true' {...props} />
      )}
    >
      <BadgeLink {...args}>Provider-routed badge</BadgeLink>
    </LinkProvider>
  ),
  play: async ({ canvasElement }) => {
    const anchor = canvasElement.querySelector('a')
    if (!anchor) throw new Error('BadgeLink did not render an <a> element.')
    await expect(anchor).toHaveAttribute('data-framework-link', 'true')
  },
}

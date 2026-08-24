/**
 * Avatar — Default, Variants, CssCheck
 *
 * Built on the Base UI avatar primitive. `AvatarImage` loads a real image and
 * falls back to `AvatarFallback` when the source is missing or fails — in the
 * test environment the network image never resolves, so the fallback is what
 * actually renders, and assertions target it.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from './avatar.js'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A user avatar built on the Base UI avatar primitive. Renders an image when one loads and a text/graphic fallback otherwise; compose with AvatarGroup, AvatarGroupCount and AvatarBadge for stacked and status presentations.',
      },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const fallback = canvasElement.querySelector<HTMLElement>('[data-slot="avatar-fallback"]')
    if (!fallback) {
      throw new Error('Could not find [data-slot="avatar-fallback"].')
    }

    // With no loadable image, Base UI renders the fallback — assert the
    // initials arrived rather than testing a hidden image element.
    await expect(fallback).toHaveTextContent('AB')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col items-start gap-8'>
      {/* Sizes */}
      <div className='flex items-center gap-4'>
        <Avatar size='sm'>
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar size='default'>
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size='lg'>
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
      </div>

      {/* With a status badge */}
      <Avatar size='lg'>
        <AvatarFallback>ON</AvatarFallback>
        <AvatarBadge className='bg-primary' />
      </Avatar>

      {/* Stacked group with an overflow count */}
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const fallback = canvasElement.querySelector<HTMLElement>('[data-slot="avatar-fallback"]')
    if (!fallback) {
      throw new Error('Could not find [data-slot="avatar-fallback"].')
    }

    // Proves globals.css loaded: bg-muted resolves to a real colour rather
    // than staying transparent.
    const background = getComputedStyle(fallback).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-muted to resolve, received "${background}".`)
    }
  },
}

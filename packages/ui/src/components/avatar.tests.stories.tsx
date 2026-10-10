/**
 * Avatar — Tests
 *
 * Stories that prove something rather than show it. They stay out of the
 * sidebar (`!dev`) but run in the Vitest suite.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar, AvatarFallback } from './avatar.js'

const meta = {
  title: 'Components/Avatar/Tests',
  component: Avatar,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

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

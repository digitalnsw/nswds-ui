/**
 * Kbd — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Kbd } from './kbd.js'

const meta = {
  title: 'Components/Kbd/Tests',
  component: Kbd,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Esc',
  },
  render: (args) => <Kbd {...args} />,
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const kbd = canvasElement.querySelector<HTMLElement>('[data-slot="kbd"]')
    if (!kbd) {
      throw new Error('Could not find [data-slot="kbd"].')
    }

    // Proves globals.css loaded: bg-muted resolves to a real colour rather than
    // staying transparent.
    const background = getComputedStyle(kbd).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-muted to resolve, received "${background}".`)
    }
  },
}

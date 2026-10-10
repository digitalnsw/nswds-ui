/**
 * Toggle — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconFormatBold } from '../icons/format-bold.js'
import { Toggle } from './toggle.js'

const meta = {
  title: 'Components/Toggle/Tests',
  component: Toggle,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    'aria-label': 'Bold',
  },
  render: (args) => (
    <Toggle {...args}>
      <IconFormatBold />
    </Toggle>
  ),
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  args: { defaultPressed: true },
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector<HTMLElement>('[data-slot="toggle"]')
    if (!toggle) {
      throw new Error('Could not find [data-slot="toggle"].')
    }

    // Proves globals.css loaded: a pressed toggle has bg-muted, which must
    // resolve to a real colour rather than staying transparent.
    const background = getComputedStyle(toggle).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-muted to resolve, received "${background}".`)
    }
  },
}

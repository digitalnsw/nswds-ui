/**
 * InputOTP — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp.js'

const meta = {
  title: 'Components/InputOTP/Tests',
  component: InputOTP,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    maxLength: 6,
    'aria-label': 'One-time passcode',
    children: (
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    ),
  },
} satisfies Meta<typeof InputOTP>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const slot = canvasElement.querySelector<HTMLElement>('[data-slot="input-otp-slot"]')
    if (!slot) {
      throw new Error('Could not find [data-slot="input-otp-slot"].')
    }

    // Proves globals.css loaded. An unstyled div has no border (0px, none) yet
    // still computes a visible currentColor, so the colour alone proves
    // nothing — the 1px solid border is what only the stylesheet draws.
    const style = getComputedStyle(slot)
    if (style.borderTopWidth !== '1px' || style.borderTopStyle !== 'solid') {
      throw new Error(
        `Expected the slot's 1px solid border, received ${style.borderTopWidth} ${style.borderTopStyle}.`,
      )
    }
    const borderColor = style.borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected border-input to resolve, received "${borderColor}".`)
    }
  },
}

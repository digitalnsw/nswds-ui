/**
 * InputOTP — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp.js'

const meta = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A one-time-passcode field built on `input-otp`. A single hidden input captures the value while `InputOTPSlot`s render each character cell; the library owns caret movement, paste handling, and keyboard navigation. Group slots with `InputOTPGroup` and split them with `InputOTPSeparator`.',
      },
    },
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // input-otp renders one hidden <input> that owns the value, plus a slot
    // element per character cell. Target the input, not the visual slots.
    const input = canvasElement.querySelector<HTMLInputElement>('[data-slot="input-otp"]')
    if (!input) {
      throw new Error('Could not find [data-slot="input-otp"].')
    }
    await expect(input).toBeEnabled()

    const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')
    await expect(slots).toHaveLength(6)

    // Typing must round-trip through the single hidden input.
    input.focus()
    await userEvent.keyboard('123456')
    await expect(input).toHaveValue('123456')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col items-start gap-6'>
      {/* Four digits */}
      <InputOTP maxLength={4} aria-label='Four digit code'>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>

      {/* Six digits split 3 + 3 with a separator */}
      <InputOTP maxLength={6} aria-label='Six digit code'>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {/* Disabled */}
      <InputOTP maxLength={4} aria-label='Disabled code' disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const slot = canvasElement.querySelector<HTMLElement>('[data-slot="input-otp-slot"]')
    if (!slot) {
      throw new Error('Could not find [data-slot="input-otp-slot"].')
    }

    // Proves globals.css loaded: border-input resolves to a real colour rather
    // than staying transparent.
    const borderColor = getComputedStyle(slot).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected border-input to resolve, received "${borderColor}".`)
    }
  },
}

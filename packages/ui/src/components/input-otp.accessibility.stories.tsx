/**
 * InputOTP — Accessibility
 *
 * One story per WCAG 2.2 criterion a one-time passcode field has to meet, each
 * asserting it in play(). InputOTP is one real <input> under a row of slots
 * drawn for each character, so assistive technology meets an ordinary text
 * field; these pin that, and the parts drawn on top of it.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { expect, userEvent, within } from 'storybook/test'

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp.js'
import { Label } from './label.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/InputOTP/Accessibility',
  component: InputOTP,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InputOTP>

export default meta

type Story = StoryObj<typeof meta>

function SixSlots() {
  return (
    <>
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
    </>
  )
}

function VerificationCode() {
  return (
    <div className='max-w-md space-y-3'>
      <Label htmlFor='otp-a11y'>Enter your verification code</Label>
      <p id='otp-a11y-hint' className='text-muted-foreground'>
        We sent a 6 digit code to the mobile number ending in 123.
      </p>
      <InputOTP
        id='otp-a11y'
        aria-describedby='otp-a11y-hint'
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <SixSlots />
      </InputOTP>
    </div>
  )
}

const codeField = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', { name: 'Enter your verification code' })

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'However the slots look, a screen reader user has to meet one named text field that holds the whole code, and hear what they have typed.',
          how: 'Inspect the field: it is a single textbox named by its label, with a maximum length of 6. Type a code: the textbox’s value is the whole code, and each slot shows one character. The play() asserts all of it.',
          caveat:
            'The slots are presentation; only the input is exposed. Name it with a visible label (id + htmlFor), or aria-label where there is none.',
        }),
      },
    },
  },
  render: () => <VerificationCode />,
  play: async ({ canvasElement }) => {
    const field = codeField(canvasElement)
    await expect(field).toHaveAttribute('maxlength', '6')
    await userEvent.click(field)
    await userEvent.keyboard('482913')
    await expect(field).toHaveValue('482913')
    const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')
    await expect([...slots].map((slot) => slot.textContent)).toEqual(['4', '8', '2', '9', '1', '3'])
  },
}

// ─── 1.3.5 — Identify Input Purpose ───────────────────────────────────────────

export const IdentifyInputPurpose: Story = {
  name: 'Identify Input Purpose — 1.3.5',
  parameters: {
    wcag: ['1.3.5'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.5',
          why: 'When the field says what it is for, the phone can offer the code it just received and people never have to copy it from a message by hand — the biggest help there is for anyone who finds typing it hard.',
          how: 'Inspect the input: autocomplete="one-time-code", and with a digits-only pattern, inputmode="numeric" for the number keypad. The play() asserts both.',
          caveat:
            'Both come from the input-otp library; pass autoComplete only to override it for a code that is not a one-time passcode.',
        }),
      },
    },
  },
  render: () => <VerificationCode />,
  play: async ({ canvasElement }) => {
    const field = codeField(canvasElement)
    await expect(field).toHaveAttribute('autocomplete', 'one-time-code')
    await expect(field).toHaveAttribute('inputmode', 'numeric')
  },
}

// ─── 3.3.2 — Labels or Instructions ───────────────────────────────────────────

export const LabelsOrInstructions: Story = {
  name: 'Labels or Instructions — 3.3.2',
  parameters: {
    wcag: ['3.3.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.2',
          why: 'People need to know what code to enter and where to find it before they start — and a row of empty boxes says neither.',
          how: 'The field has a visible label and a hint saying where the code was sent. The play() asserts the label is the field’s accessible name and the hint its accessible description.',
          caveat:
            'Tie the hint with aria-describedby on InputOTP; it is passed to the input, not the slots.',
        }),
      },
    },
  },
  render: () => <VerificationCode />,
  play: async ({ canvasElement }) => {
    const field = codeField(canvasElement)
    await expect(field).toHaveAccessibleDescription(
      'We sent a 6 digit code to the mobile number ending in 123.',
    )
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'The code has to be entered and corrected from the keyboard alone, without clicking into a particular slot.',
          how: 'Tab to the field and type the code; press Backspace to take back the last character, then type it again. Characters the pattern refuses never land. The play() asserts each step.',
          caveat:
            'Focus stays on the one input throughout — the slots never take focus, so Tab moves on after the field, not through six boxes.',
        }),
      },
    },
  },
  render: () => <VerificationCode />,
  play: async ({ canvasElement }) => {
    const field = codeField(canvasElement)
    await userEvent.tab()
    await expect(field).toHaveFocus()
    await userEvent.keyboard('48291')
    await expect(field).toHaveValue('48291')
    await userEvent.keyboard('{Backspace}')
    await expect(field).toHaveValue('4829')
    await userEvent.keyboard('x13')
    await expect(field).toHaveValue('482913')
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'The real input is invisible, so the slots have to show focus for it — and show where the next character will go.',
          how: 'Tab to the field: the first slot is drawn active, with a ring and the ring-coloured border, and a caret. Type two characters: the ring moves to the third slot. The play() asserts the active slot carries the ring and the others do not.',
          caveat:
            'Focus is shown by the slot input-otp marks active, not by the input’s own outline.',
        }),
      },
    },
  },
  render: () => <VerificationCode />,
  play: async ({ canvasElement }) => {
    const slots = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]')]
    const ringed = () => slots.map((slot) => getComputedStyle(slot).boxShadow !== 'none')
    await expect(ringed()).toEqual([false, false, false, false, false, false])
    await userEvent.tab()
    await expect(ringed()).toEqual([true, false, false, false, false, false])
    await userEvent.keyboard('48')
    await expect(ringed()).toEqual([false, false, true, false, false, false])
  },
}

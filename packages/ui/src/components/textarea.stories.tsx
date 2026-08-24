/**
 * Textarea — Default, Variants, CssCheck
 *
 * A styled multi-line text input. This is a plain `<textarea>` (not a Base UI
 * primitive), so it inherits native textarea semantics; we layer token-backed
 * styling, focus rings and an `aria-invalid` error state on top.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { Textarea } from './textarea.js'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A styled multi-line text input wrapping the native `<textarea>`. Token-backed borders, focus rings and an `aria-invalid` error state are layered on top; pair it with a visible label or `aria-label` in a real form.',
      },
    },
  },
  args: {
    'aria-label': 'Message',
    placeholder: 'Type your message…',
  },
  render: (args) => (
    <div className='max-w-md'>
      <Textarea {...args} />
    </div>
  ),
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector<HTMLTextAreaElement>('[data-slot="textarea"]')
    if (!textarea) {
      throw new Error('Could not find [data-slot="textarea"].')
    }

    await expect(textarea).toHaveAccessibleName('Message')

    // Prove it is a real, interactive textarea by typing into it.
    await userEvent.type(textarea, 'Hello NSW')
    await expect(textarea).toHaveValue('Hello NSW')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex max-w-md flex-col gap-6'>
      <Textarea aria-label='Default' placeholder='Default' />
      <Textarea aria-label='With value' defaultValue='Some prefilled content.' />
      <Textarea aria-label='Disabled' placeholder='Disabled' disabled />
      <Textarea aria-label='Invalid' placeholder='Invalid' aria-invalid />
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector<HTMLTextAreaElement>('[data-slot="textarea"]')
    if (!textarea) {
      throw new Error('Could not find [data-slot="textarea"].')
    }

    // Proves globals.css loaded: the border-input token must resolve to a real
    // colour rather than staying transparent.
    const borderColor = getComputedStyle(textarea).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected border-input to resolve, received "${borderColor}".`)
    }
  },
}

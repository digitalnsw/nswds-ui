/**
 * Textarea — Tests
 *
 * Stories that exist to prove something rather than to show it: controlled
 * state through Base UI's change handler, the Field wiring, parity with Input,
 * and that the theme tokens resolved. Hidden from the sidebar; they run in the
 * Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect, userEvent } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel } from './field.js'
import { Input } from './input.js'
import { Textarea } from './textarea.js'

const meta = {
  title: 'Components/Textarea/Tests',
  component: Textarea,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTextarea(canvasElement: HTMLElement) {
  const textarea = canvasElement.querySelector<HTMLTextAreaElement>('[data-slot="textarea"]')
  if (!textarea) {
    throw new Error('Could not find [data-slot="textarea"].')
  }
  return textarea
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlled',
  parameters: {
    docs: {
      description: {
        story:
          'Base UI composes its own change handler onto the control, so a controlled `value` + `onChange` pair has to keep working through it — this story types into a React-state-backed Textarea and asserts the state, not just the DOM node, followed the keystrokes.',
      },
    },
  },
  render: function ControlledTextarea() {
    const [value, setValue] = React.useState('')

    return (
      <div className='max-w-md space-y-2'>
        <Textarea
          aria-label='Message'
          placeholder='Type your message…'
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <p data-testid='echo' className='text-base/relaxed text-muted-foreground'>
          {value}
        </p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const textarea = getTextarea(canvasElement)

    await userEvent.type(textarea, 'Pothole on King St')
    await expect(textarea).toHaveValue('Pothole on King St')

    // The echo only updates if React state — not just the DOM — received it.
    const echo = canvasElement.querySelector('[data-testid="echo"]')
    await expect(echo).toHaveTextContent('Pothole on King St')
  },
}

export const InField: Story = {
  name: 'In a Field',
  parameters: {
    docs: {
      description: {
        story:
          'The functional half of Input parity: because Textarea renders Base UI’s `Field.Control`, dropping it into a `<Field invalid>` associates the label, appends the description and error to `aria-describedby`, and sets `aria-invalid` — none of which a bare `<textarea>` would get.',
      },
    },
  },
  render: () => (
    <div className='max-w-md'>
      <Field invalid>
        <FieldLabel>Tell us what happened</FieldLabel>
        <Textarea placeholder='Type your message…' />
        <FieldDescription>Do not include personal information.</FieldDescription>
        <FieldError>Enter a description of what happened.</FieldError>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const textarea = getTextarea(canvasElement)

    await expect(textarea).toHaveAccessibleName('Tell us what happened')
    await expect(textarea).toHaveAttribute('aria-invalid', 'true')

    // Base UI points aria-describedby at the description and error it rendered.
    const describedBy = (textarea.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean)
    if (describedBy.length === 0) {
      throw new Error('Expected Field to wire aria-describedby onto the textarea.')
    }
    const described = describedBy
      .map((id) => canvasElement.ownerDocument.getElementById(id)?.textContent ?? '')
      .join(' ')
    await expect(described).toContain('Do not include personal information.')
    await expect(described).toContain('Enter a description of what happened.')
  },
}

export const MatchesInput: Story = {
  name: 'Matches Input',
  parameters: {
    docs: {
      description: {
        story:
          'Guards the restyle: the box metrics and colours are read off a live Textarea and a live Input and compared, so any future drift between the two controls fails here rather than in a consumer’s form.',
      },
    },
  },
  render: () => (
    <div className='flex max-w-md flex-col gap-3'>
      <Input aria-label='Single line' placeholder='Single line' />
      <Textarea aria-label='Multi line' placeholder='Multi line' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const textarea = getTextarea(canvasElement)
    const input = canvasElement.querySelector<HTMLInputElement>('[data-slot="input"]')
    if (!input) {
      throw new Error('Could not find [data-slot="input"].')
    }

    const a = getComputedStyle(textarea)
    const b = getComputedStyle(input)

    // Every property the two controls are meant to share. Height is absent on
    // purpose — Textarea grows with its content, Input does not.
    for (const property of [
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'fontSize',
      'borderTopLeftRadius',
      'borderTopWidth',
      'borderTopColor',
      'backgroundColor',
      'color',
    ] as const) {
      await expect(`${property}: ${a[property]}`).toBe(`${property}: ${b[property]}`)
    }
  },
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const textarea = getTextarea(canvasElement)
    const styles = getComputedStyle(textarea)

    // Proves globals.css loaded: the --input-border token must resolve to a
    // real colour rather than leaving the border transparent.
    const borderColor = styles.borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected --input-border to resolve, received "${borderColor}".`)
    }

    // …and that the token itself is defined, not merely inherited from a
    // browser default border colour.
    if (styles.getPropertyValue('--input-border').trim() === '') {
      throw new Error('Expected --input-border to be defined by the theme layer.')
    }
  },
}

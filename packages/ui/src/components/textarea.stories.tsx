/**
 * Textarea — Default, Controlled, Variants, InField, MatchesInput, CssCheck
 *
 * The multi-line sibling of Input. It renders Base UI's Input primitive
 * (which is `Field.Control`) as a `<textarea>`, so it inherits the same Field
 * wiring — label association, `aria-describedby`, `aria-invalid` — and carries
 * the same `--input-*` token styling. Only the sizing differs: the box grows
 * with its content from a three-line floor instead of Input's fixed height.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect, userEvent } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel } from './field.js'
import { Input } from './input.js'
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
          'A multi-line text input built on the Base UI Input primitive, rendered as a `<textarea>`. It matches Input pixel for pixel — same padding, radius, type size, token-driven borders, hover surface, focus outline and `aria-invalid` error state — and gains the same automatic Field wiring, so inside a `<Field>` the label, description and error are associated for you. It grows with its content from a three-line floor rather than sitting at Input’s fixed height.',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTextarea(canvasElement: HTMLElement) {
  const textarea = canvasElement.querySelector<HTMLTextAreaElement>('[data-slot="textarea"]')
  if (!textarea) {
    throw new Error('Could not find [data-slot="textarea"].')
  }
  return textarea
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const textarea = getTextarea(canvasElement)

    // The `render` prop must produce a real <textarea>, not Base UI's default
    // <input> — otherwise Enter would submit instead of inserting a newline.
    await expect(textarea.tagName).toBe('TEXTAREA')
    await expect(textarea).toHaveAccessibleName('Message')

    // Prove it is a real, interactive textarea by typing into it. Multi-line
    // input is the whole point, so type a newline rather than a flat string.
    await userEvent.type(textarea, 'Hello NSW{enter}Second line')
    await expect(textarea).toHaveValue('Hello NSW\nSecond line')
  },
}

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
        <p data-testid='echo' className='text-sm/relaxed text-muted-foreground'>
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

export const Variants: Story = {
  name: 'Variants',
  parameters: {
    docs: {
      description: {
        story:
          'The interaction-state ladder, mirroring Input/Features/States. Focus is forced with the same `--input-ring` outline utilities the component applies on `:focus-visible`, so the row renders deterministically in visual diffs; hover the default row manually to check the hover surface.',
      },
    },
  },
  render: () => (
    <div className='flex max-w-md flex-col gap-6'>
      <Textarea aria-label='Default' placeholder='Default' />
      <Textarea
        aria-label='Focused'
        placeholder='Focused'
        className='outline outline-2 outline-offset-2 outline-(--input-ring)'
      />
      <Textarea aria-label='Disabled' placeholder='Disabled' disabled />
      <Textarea aria-label='Read-only' readOnly defaultValue='Read-only value' />
      <Textarea aria-label='Invalid' placeholder='Invalid' aria-invalid='true' />
      <Textarea aria-label='With value' defaultValue='Some prefilled content.' />
    </div>
  ),
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

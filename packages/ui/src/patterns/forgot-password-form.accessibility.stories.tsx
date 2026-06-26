/**
 * ForgotPasswordForm — Accessibility (WCAG 2.2)
 *
 * A single-field reset-request pattern. Covered here:
 *
 *   1.3.1 Info and Relationships          (A)  — LabelAssociation
 *   4.1.2 Name, Role, Value               (A)  — NameRoleValue
 *
 * The form sets no hardcoded id: the Field associates the label with the email
 * control via Base UI, generating an id per instance. The play() functions
 * locate controls by type / role / accessible name rather than by id.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { wcagStoryMeta } from '../components/story-helpers.js'
import { ForgotPasswordForm } from './forgot-password-form.js'

const meta = {
  title: 'Components/ForgotPasswordForm/Accessibility',
  component: ForgotPasswordForm,
  parameters: {
    layout: 'padded',
  },
  args: {},
} satisfies Meta<typeof ForgotPasswordForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const LabelAssociation: Story = {
  name: '1.3.1 Info and Relationships',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The email input must be programmatically associated with its visible label so a screen reader announces "Email, edit text" when the field receives focus.',
          how: 'The play() function asserts the email input exposes at least one entry in its .labels collection.',
          caveat:
            'The form sets no id — Field associates the label with the control automatically and scopes the generated id per instance, so two ForgotPasswordForms on one page do not collide.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <ForgotPasswordForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const email = canvasElement.querySelector<HTMLInputElement>(
      'input[type="email"]'
    )
    if (!email) {
      throw new Error('WCAG 1.3.1: could not find the email input.')
    }
    if (!email.labels || email.labels.length < 1) {
      throw new Error('WCAG 1.3.1: the email input has no associated <label>.')
    }
    if ((email.labels[0]?.textContent ?? '').trim().length === 0) {
      throw new Error('WCAG 1.3.1: the email input’s label has empty text.')
    }
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: '4.1.2 Name, Role, Value',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'The email input must expose its label as its accessible name, and the submit button must announce as "Send reset link, button".',
          how: 'The play() function asserts the email input has non-empty label text and that the submit button’s accessible name is "Send reset link".',
          caveat:
            'If you change the submit button text, update this assertion. The name derives from the button’s visible text via the Base UI Button primitive.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <ForgotPasswordForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const email = canvasElement.querySelector<HTMLInputElement>(
      'input[type="email"]'
    )
    if (!email) {
      throw new Error('WCAG 4.1.2: could not find the email input.')
    }
    if ((email.labels?.[0]?.textContent ?? '').trim().length === 0) {
      throw new Error(
        'WCAG 4.1.2: the email input has no accessible name (label text is empty).'
      )
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )
    if (!submit) {
      throw new Error('WCAG 4.1.2: could not find the submit button.')
    }
    const submitName = submit.textContent?.trim() ?? ''
    if (!submitName.includes('Send reset link')) {
      throw new Error(
        `WCAG 4.1.2: submit button accessible name should contain "Send reset link", got "${submitName}".`
      )
    }
  },
}

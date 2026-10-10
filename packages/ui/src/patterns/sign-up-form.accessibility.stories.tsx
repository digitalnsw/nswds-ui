/**
 * SignUpForm — Accessibility (WCAG 2.2)
 *
 * SignUpForm is a composed registration pattern, so the applicable success
 * criteria are those of a form pattern as a whole. Covered here:
 *
 *   1.3.1 Info and Relationships          (A)  — LabelAssociation
 *   1.3.5 Identify Input Purpose          (AA) — IdentifyInputPurpose
 *   3.3.2 Labels or Instructions          (A)  — LabelsAndInstructions
 *   4.1.2 Name, Role, Value               (A)  — NameRoleValue
 *
 * The form sets no hardcoded ids: each Field associates its label (and the
 * password's requirements description) with the control via Base UI, generating
 * ids per instance. The play() functions therefore locate controls by type /
 * role / accessible name rather than by id.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { wcagStoryMeta } from '../components/story-helpers.js'
import { SignUpForm } from './sign-up-form.js'

const meta = {
  title: 'Patterns/SignUpForm/Accessibility',
  component: SignUpForm,
  tags: ['!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {},
} satisfies Meta<typeof SignUpForm>

export default meta

type Story = StoryObj<typeof meta>

function allInputs(canvasElement: HTMLElement): HTMLInputElement[] {
  return Array.from(canvasElement.querySelectorAll<HTMLInputElement>('input'))
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const LabelAssociation: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'Every field must be programmatically associated with its visible label, and the related fields must sit under a group name, so assistive technology announces each control and the section it belongs to.',
          how: 'The play() function asserts every input exposes at least one entry in its .labels collection, and that the registration fields are wrapped in a <fieldset> with a non-empty <legend>.',
          caveat:
            'The form sets no ids — Field associates each label with its control automatically and scopes the generated ids per instance, so two SignUpForms on one page do not collide.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <SignUpForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const inputs = allInputs(canvasElement)
    if (inputs.length < 4) {
      throw new Error(
        `WCAG 1.3.1: expected the sign-up inputs (name, email, password, confirm password), found ${inputs.length}.`,
      )
    }
    for (const input of inputs) {
      if (!input.labels || input.labels.length < 1) {
        throw new Error(
          `WCAG 1.3.1: an input (type="${input.type}", autocomplete="${input.autocomplete}") has no associated <label>.`,
        )
      }
    }

    const fieldset = canvasElement.querySelector<HTMLFieldSetElement>('[data-slot="field-set"]')
    if (!fieldset) {
      throw new Error('WCAG 1.3.1: expected a <fieldset> grouping the registration fields.')
    }
    const legend = fieldset.querySelector('[data-slot="field-legend"]')
    if (!legend || (legend.textContent ?? '').trim().length === 0) {
      throw new Error(
        'WCAG 1.3.1: the registration fieldset has no non-empty legend naming the group.',
      )
    }
  },
}

// ─── 3.3.2 — Labels or Instructions ───────────────────────────────────────────

export const LabelsAndInstructions: Story = {
  name: 'Labels or Instructions — 3.3.2',
  parameters: {
    wcag: ['3.3.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.2',
          why: 'The password rules are an instruction the user needs before typing, so they must be programmatically associated with the password input — not just placed nearby — so screen readers announce them when the field receives focus.',
          how: 'The play() function reads the password input’s aria-describedby (wired automatically by Field) and asserts it resolves to text describing the requirements.',
          caveat:
            'The association is automatic via Base UI Field; no manual aria-describedby is set in the source. If you replace FieldDescription with plain text, re-add the wiring.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <SignUpForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // First password input is "Password" (the second is "Confirm password").
    const password = canvasElement.querySelector<HTMLInputElement>('input[type="password"]')
    if (!password) {
      throw new Error('WCAG 3.3.2: could not find the password input.')
    }

    const describedBy = password.getAttribute('aria-describedby')
    if (!describedBy) {
      throw new Error(
        'WCAG 3.3.2: the password input has no aria-describedby — its requirements are not programmatically associated.',
      )
    }
    const describedText = describedBy
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => canvasElement.querySelector(`#${CSS.escape(id)}`)?.textContent ?? '')
      .join(' ')
    if (!/\b8 characters\b/i.test(describedText)) {
      throw new Error(
        `WCAG 3.3.2: aria-describedby does not resolve to the password requirements (got "${describedText.trim()}").`,
      )
    }
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Each interactive control must expose an accessible name and role: the inputs take their name from their label, and the submit button must announce as "Create account, button".',
          how: 'The play() function asserts every input has non-empty label text and that the submit button’s accessible name is "Create account".',
          caveat:
            'If you change the submit button text, update this assertion. The name derives from the button’s visible text via the Base UI Button primitive.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <SignUpForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const input of allInputs(canvasElement)) {
      const name = input.labels?.[0]?.textContent?.trim() ?? ''
      if (name.length === 0) {
        throw new Error(
          `WCAG 4.1.2: an input (type="${input.type}") has no accessible name (label text is empty).`,
        )
      }
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!submit) {
      throw new Error('WCAG 4.1.2: could not find the submit button.')
    }
    const submitName = submit.textContent?.trim() ?? ''
    if (!submitName.includes('Create account')) {
      throw new Error(
        `WCAG 4.1.2: submit button accessible name should contain "Create account", got "${submitName}".`,
      )
    }
  },
}

// ─── 1.3.5 — Identify Input Purpose ───────────────────────────────────────────

const purposes = [
  ['Full name', 'name'],
  ['Email', 'email'],
  ['Password', 'new-password'],
  ['Confirm password', 'new-password'],
] as const

export const IdentifyInputPurpose: Story = {
  name: 'Identify Input Purpose — 1.3.5',
  parameters: {
    wcag: ['1.3.5'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.5',
          why: 'Inputs that collect information about the reader must say what they collect in a way software can read, so browsers can fill in a name and email and a password manager can offer a strong new password.',
          how: 'Inspect the four inputs: name, email, and new-password on both password fields. The play() finds each by its visible label and asserts its autocomplete token.',
          caveat:
            'new-password on BOTH password fields is deliberate — it is what tells a manager to generate and save one password, rather than offer a saved one. axe cannot catch a missing token, because its autocomplete-valid rule only checks values that are present.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <SignUpForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const [label, token] of purposes) {
      await expect(canvas.getByLabelText(label)).toHaveAttribute('autocomplete', token)
    }
  },
}

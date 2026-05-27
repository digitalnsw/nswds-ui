/**
 * Field — Accessibility (WCAG 2.2)
 *
 * One story per WCAG 2.2 success criterion that meaningfully applies to a
 * form-field composition. Each story renders Field in a way that demonstrates
 * the criterion and includes a `play()` function that programmatically
 * asserts the conformance condition.
 *
 * Criteria covered:
 *   1.3.1 Info and Relationships          (A)   — InfoAndRelationships
 *   3.3.1 Error Identification            (A)   — ErrorIdentification
 *   3.3.2 Labels or Instructions          (A)   — LabelsOrInstructions
 *   4.1.2 Name, Role, Value               (A)   — NameRoleValue
 *   4.1.3 Status Messages                 (AA)  — StatusMessages
 *
 * Target size (2.5.8) is not given its own story: Field has no explicit size
 * variants — it inherits the height of whichever control it wraps. The Input
 * accessibility file already covers control-level target size.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './field.js'
import { Input } from './input.js'
import { wcagStoryMeta } from './story-helpers.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Field/Accessibility',
  component: Field,
  parameters: {
    layout: 'padded',
  },
  args: {
    orientation: 'vertical',
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInputById(
  canvasElement: HTMLElement,
  id: string,
): HTMLInputElement {
  const input = canvasElement.querySelector<HTMLInputElement>(
    `input[id="${id}"]`,
  )
  if (!input) throw new Error(`Could not find input #${id} in canvas.`)
  return input
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: '1.3.1 Info and Relationships',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The relationship between a label and its control, and between grouped controls and their legend, must be programmatically determinable so assistive technology can announce the correct context as users move through the form.',
          how: 'Inspect each input with a screen reader — the label is announced before the input, and grouped fields are announced under their legend. The play() function asserts the FieldLabel is in the input.labels collection and that the FieldSet contains a <legend>.',
          caveat:
            'FieldLabel htmlFor must exactly match the input id. Mismatched ids silently break the relationship — there is no runtime warning from the browser.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <Field>
        <FieldLabel htmlFor="a11y-info-email">Email address</FieldLabel>
        <Input
          id="a11y-info-email"
          type="email"
          placeholder="you@example.com"
        />
      </Field>

      <FieldSet>
        <FieldLegend>Contact details</FieldLegend>
        <Field>
          <FieldLabel htmlFor="a11y-info-tel">Phone number</FieldLabel>
          <Input
            id="a11y-info-tel"
            type="tel"
            placeholder="0400 000 000"
          />
        </Field>
      </FieldSet>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const email = getInputById(canvasElement, 'a11y-info-email')
    if (!email.labels || email.labels.length === 0) {
      throw new Error(
        'WCAG 1.3.1: input #a11y-info-email has no associated <label>.',
      )
    }
    const labelText = email.labels[0]?.textContent?.trim() ?? ''
    if (labelText.length === 0) {
      throw new Error(
        'WCAG 1.3.1: associated <label> for #a11y-info-email has empty text.',
      )
    }

    const fieldset = canvasElement.querySelector<HTMLFieldSetElement>(
      '[data-slot="field-set"]',
    )
    if (!fieldset) {
      throw new Error(
        'WCAG 1.3.1: expected a <fieldset> wrapping the grouped fields.',
      )
    }
    const legend = fieldset.querySelector('[data-slot="field-legend"]')
    if (!legend) {
      throw new Error(
        'WCAG 1.3.1: FieldSet is missing a FieldLegend — the group has no programmatic name.',
      )
    }
  },
}

// ─── 3.3.1 — Error Identification ─────────────────────────────────────────────

export const ErrorIdentification: Story = {
  name: '3.3.1 Error Identification',
  parameters: {
    wcag: ['3.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.1',
          why: 'When a form control rejects input, the affected field and the nature of the problem must be identified in text so users can understand what went wrong and correct it.',
          how: 'Inspect the rendered error: FieldError renders inside the Field with role="alert" and visible destructive-token text. The play() function asserts the FieldError element exists, carries role="alert", and contains the error message text.',
          caveat:
            'FieldError on its own does not set aria-invalid on the input — the input must also receive aria-invalid="true" (and ideally aria-describedby pointing at the error id) for the relationship to be programmatically discoverable.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <Field data-invalid="true">
        <FieldLabel htmlFor="a11y-error-email">Email address</FieldLabel>
        <Input
          id="a11y-error-email"
          type="email"
          defaultValue="not-an-email"
          aria-invalid="true"
          aria-describedby="a11y-error-message"
        />
        <FieldError
          id="a11y-error-message"
          errors={[{ message: 'Please enter a valid email address.' }]}
        />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('[data-slot="field-error"]')
    if (!error) {
      throw new Error(
        'WCAG 3.3.1: FieldError element is missing from the canvas.',
      )
    }
    if (error.getAttribute('role') !== 'alert') {
      throw new Error(
        `WCAG 3.3.1: FieldError expected role="alert", got "${error.getAttribute('role')}".`,
      )
    }
    const text = error.textContent?.trim() ?? ''
    if (text.length === 0) {
      throw new Error(
        'WCAG 3.3.1: FieldError rendered but contains no message text.',
      )
    }
  },
}

// ─── 3.3.2 — Labels or Instructions ───────────────────────────────────────────

export const LabelsOrInstructions: Story = {
  name: '3.3.2 Labels or Instructions',
  parameters: {
    wcag: ['3.3.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.2',
          why: 'Form controls that require user input must be paired with a label or instruction so users know what data to enter and in what format.',
          how: 'Each Field shows a FieldLabel as the visible name and a FieldDescription as supplementary instructional text. The play() function asserts each input has an associated label and that descriptive helper text is present in the Field.',
          caveat:
            'FieldDescription is not automatically linked to the input via aria-describedby — wire it explicitly with describedby on the input when the description should be announced by AT.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <Field>
        <FieldLabel htmlFor="a11y-labels-postcode">Postcode</FieldLabel>
        <Input
          id="a11y-labels-postcode"
          inputMode="numeric"
          maxLength={4}
          placeholder="2000"
          aria-describedby="a11y-labels-postcode-help"
        />
        <FieldDescription id="a11y-labels-postcode-help">
          Enter a 4-digit Australian postcode.
        </FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = getInputById(canvasElement, 'a11y-labels-postcode')
    if (!input.labels || input.labels.length === 0) {
      throw new Error(
        'WCAG 3.3.2: input #a11y-labels-postcode has no associated <label>.',
      )
    }

    const description = canvasElement.querySelector(
      '[data-slot="field-description"]',
    )
    if (!description) {
      throw new Error(
        'WCAG 3.3.2: Field is missing a FieldDescription for instructional text.',
      )
    }
    const text = description.textContent?.trim() ?? ''
    if (text.length === 0) {
      throw new Error(
        'WCAG 3.3.2: FieldDescription rendered but contains no instructional text.',
      )
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
          why: 'Assistive technology must be able to determine each user-interface component\'s name, role, and current value. The Field wrapper announces itself as a group, and the input it contains exposes its accessible name via the associated FieldLabel.',
          how: 'Inspect the wrapper element: it carries role="group" and data-slot="field". Inspect the input: HTMLInputElement.labels exposes the FieldLabel and contains the accessible name text. The play() function asserts both.',
          caveat:
            'role="group" alone does not give the group an accessible name — pair Field with aria-labelledby pointing at a heading or FieldLegend when the group needs to be announced by name.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <Field>
        <FieldLabel htmlFor="a11y-nrv-email">Email address</FieldLabel>
        <Input
          id="a11y-nrv-email"
          type="email"
          placeholder="you@example.com"
        />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('[data-slot="field"]')
    if (!field) {
      throw new Error('WCAG 4.1.2: Field wrapper is missing from the canvas.')
    }
    if (field.getAttribute('role') !== 'group') {
      throw new Error(
        `WCAG 4.1.2: Field expected role="group", got "${field.getAttribute('role')}".`,
      )
    }

    const input = getInputById(canvasElement, 'a11y-nrv-email')
    if (!input.labels || input.labels.length === 0) {
      throw new Error(
        'WCAG 4.1.2: input has no associated <label> — accessible name is missing.',
      )
    }
    const name = input.labels[0]?.textContent?.trim() ?? ''
    if (name.length === 0) {
      throw new Error(
        'WCAG 4.1.2: associated label has empty text — accessible name is empty.',
      )
    }
  },
}

// ─── 4.1.3 — Status Messages ──────────────────────────────────────────────────

export const StatusMessages: Story = {
  name: '4.1.3 Status Messages',
  parameters: {
    wcag: ['4.1.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.3',
          why: 'Status messages — including validation errors that appear in response to user input — must be programmatically determinable and announced by assistive technology without moving keyboard focus.',
          how: 'FieldError renders with role="alert" so screen readers announce the message when it appears in the DOM. The play() function asserts the alert role is set and the message is non-empty.',
          caveat:
            'role="alert" implies aria-live="assertive" and interrupts other speech. For non-critical status messages prefer a polite live region — keep role="alert" for errors that block form submission or signal data loss.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <Field data-invalid="true">
        <FieldLabel htmlFor="a11y-status-email">Email address</FieldLabel>
        <Input
          id="a11y-status-email"
          type="email"
          defaultValue="not-an-email"
          aria-invalid="true"
        />
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('[data-slot="field-error"]')
    if (!error) {
      throw new Error(
        'WCAG 4.1.3: FieldError element is missing from the canvas.',
      )
    }
    if (error.getAttribute('role') !== 'alert') {
      throw new Error(
        `WCAG 4.1.3: FieldError expected role="alert" so AT announces it as a status message, got "${error.getAttribute('role')}".`,
      )
    }
    const text = error.textContent?.trim() ?? ''
    if (text.length === 0) {
      throw new Error(
        'WCAG 4.1.3: FieldError rendered but contains no status text to announce.',
      )
    }
  },
}

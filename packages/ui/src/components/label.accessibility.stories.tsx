/**
 * Label — Accessibility (WCAG 2.2)
 *
 * One story per WCAG 2.2 success criterion that meaningfully applies to a
 * presentational <label> element associated with a form control. Each story
 * renders Label in a way that demonstrates the criterion and includes a
 * play() function that programmatically asserts the conformance condition.
 *
 * Criteria covered:
 *   1.3.1 Info and Relationships          (A)   — InfoAndRelationships
 *   2.5.3 Label in Name                   (A)   — LabelInName
 *   3.3.2 Labels or Instructions          (A)   — LabelsOrInstructions
 *   4.1.2 Name, Role, Value               (A)   — NameRoleValue
 *
 * Focus visibility (2.4.7), target size (2.5.8), and contrast (1.4.3) are
 * not given their own stories — a <label> is not focusable, has no hit
 * target of its own, and inherits text colour from its surrounding
 * context, so those criteria apply to the input it names, not to the
 * label itself.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from './label.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Label/Accessibility',
  component: Label,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Email address',
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInputById(
  canvasElement: HTMLElement,
  id: string
): HTMLInputElement {
  const input = canvasElement.querySelector<HTMLInputElement>(
    `input[id="${id}"]`
  )
  if (!input) throw new Error(`Could not find input #${id} in canvas.`)
  return input
}

function getLabelFor(
  canvasElement: HTMLElement,
  htmlFor: string
): HTMLLabelElement {
  const label = canvasElement.querySelector<HTMLLabelElement>(
    `label[for="${htmlFor}"]`
  )
  if (!label) {
    throw new Error(`Could not find <label for="${htmlFor}"> in canvas.`)
  }
  return label
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
          why: 'The relationship between a label and its form control must be programmatically determinable so assistive tech can present them as a single unit.',
          how: 'Inspect the input with a screen reader — it should announce the label text as the field name. The play() function asserts the input exposes a non-empty .labels collection and that the associated label carries data-slot="label".',
          caveat:
            'Programmatic association requires htmlFor on the label to match the input id (or the label to wrap the input). Visual proximity alone is not enough — many assistive technologies will not infer a relationship from layout.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-1.5">
      <Label htmlFor="a11y-relationships-email">Email address</Label>
      <input
        id="a11y-relationships-email"
        type="email"
        placeholder="you@example.com"
        className="border-input bg-background h-9 rounded-sm border px-3 text-sm"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = getInputById(canvasElement, 'a11y-relationships-email')

    if (!input.labels || input.labels.length === 0) {
      throw new Error(
        'WCAG 1.3.1: input has no associated <label> via htmlFor/labels.'
      )
    }

    const label = input.labels[0]
    if (!label) {
      throw new Error('WCAG 1.3.1: input.labels[0] is undefined.')
    }

    if (label.getAttribute('data-slot') !== 'label') {
      throw new Error(
        `WCAG 1.3.1: associated label is not the @nswds/ui Label component (data-slot="${label.getAttribute('data-slot')}").`
      )
    }

    const text = label.textContent?.trim() ?? ''
    if (text.length === 0) {
      throw new Error(
        'WCAG 1.3.1: associated <label> has empty text — relationship exists but conveys no information.'
      )
    }
  },
}

// ─── 2.5.3 — Label in Name ────────────────────────────────────────────────────

export const LabelInName: Story = {
  name: '2.5.3 Label in Name',
  parameters: {
    wcag: ['2.5.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.3',
          why: 'The accessible name of a form control must contain its visible label text so speech-input users can activate the field by saying what they see.',
          how: 'Inspect the input — its accessible name (sourced from the associated <label>) should equal or contain the visible label text. The play() function reads HTMLInputElement.labels[0].textContent and asserts the visible string is present.',
          caveat:
            'Adding an aria-label or aria-labelledby that overrides the visible label will silently fail this criterion. Prefer the visible label as the sole source of the accessible name unless you have a strong reason to override it.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-1.5">
      <Label htmlFor="a11y-label-in-name-input">Search NSW services</Label>
      <input
        id="a11y-label-in-name-input"
        type="search"
        placeholder="e.g. driver licence"
        className="border-input bg-background h-9 rounded-sm border px-3 text-sm"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = getInputById(canvasElement, 'a11y-label-in-name-input')
    const visibleLabel = 'Search NSW services'

    const labelText = input.labels?.[0]?.textContent?.trim() ?? ''
    if (!labelText.includes(visibleLabel)) {
      throw new Error(
        `WCAG 2.5.3: accessible name "${labelText}" does not contain visible label "${visibleLabel}".`
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
          why: 'Fields that require user input must be labelled or include instructions so users understand what is expected before they type.',
          how: 'Verify each input has a visible <label> above it and that any extra guidance (format hints, character limits) is linked via aria-describedby. The play() function asserts the helper text element exists and is referenced.',
          caveat:
            'Placeholder text is not a substitute for a label — it disappears as soon as the user types, is often low-contrast, and is inconsistently exposed to assistive tech. Always pair an input with a visible Label.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-1.5">
      <Label htmlFor="a11y-instructions-phone">Mobile phone number</Label>
      <input
        id="a11y-instructions-phone"
        type="tel"
        autoComplete="tel"
        placeholder="0400 000 000"
        aria-describedby="a11y-instructions-phone-hint"
        className="border-input bg-background h-9 rounded-sm border px-3 text-sm"
      />
      <p
        id="a11y-instructions-phone-hint"
        className="text-muted-foreground text-xs"
      >
        Enter an Australian mobile number starting with 04.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = getInputById(canvasElement, 'a11y-instructions-phone')

    if (!input.labels || input.labels.length === 0) {
      throw new Error(
        'WCAG 3.3.2: input has no visible <label> — labels or instructions missing.'
      )
    }

    const describedBy = input.getAttribute('aria-describedby')
    if (!describedBy) {
      throw new Error(
        'WCAG 3.3.2: input has no aria-describedby linking to its format instructions.'
      )
    }

    const hint = canvasElement.querySelector(`[id="${describedBy}"]`)
    if (!hint || (hint.textContent?.trim() ?? '').length === 0) {
      throw new Error(
        `WCAG 3.3.2: aria-describedby="${describedBy}" but the referenced element is missing or empty.`
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
          why: 'Assistive tech must be able to programmatically determine each control’s name, role, and state — the Label component supplies the name for its associated input.',
          how: 'Open the browser accessibility tree (e.g. Chrome DevTools → Accessibility tab) and confirm the input’s accessible name equals the Label text. The play() function asserts the accessible name resolves through HTMLInputElement.labels.',
          caveat:
            'Role and value still come from the native input element; Label only contributes the name. If the input is missing a type or is replaced with a non-semantic element, those parts of 4.1.2 will fail regardless of the label.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-md gap-1.5">
      <Label htmlFor="a11y-name-role-value-input">Postcode</Label>
      <input
        id="a11y-name-role-value-input"
        type="text"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="2000"
        className="border-input bg-background h-9 rounded-sm border px-3 text-sm"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = getInputById(canvasElement, 'a11y-name-role-value-input')
    const label = getLabelFor(canvasElement, 'a11y-name-role-value-input')

    const labelText = label.textContent?.trim() ?? ''
    if (labelText.length === 0) {
      throw new Error(
        'WCAG 4.1.2: associated label has empty text — input has no accessible name.'
      )
    }

    const accessibleName =
      input.labels?.[0]?.textContent?.trim() ??
      input.getAttribute('aria-label') ??
      ''

    if (accessibleName !== labelText) {
      throw new Error(
        `WCAG 4.1.2: input accessible name "${accessibleName}" does not match label text "${labelText}".`
      )
    }

    if (input.tagName !== 'INPUT') {
      throw new Error(
        `WCAG 4.1.2: expected native <input> element, got <${input.tagName.toLowerCase()}>.`
      )
    }
  },
}

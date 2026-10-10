/**
 * Textarea — Accessibility
 *
 * One story per WCAG 2.2 criterion a multi-line text field has to meet, each
 * asserting it in play(). Textarea is Base UI's Field control rendered as a
 * `<textarea>`, so inside a Field its label, hint, error and aria-invalid are
 * wired for it. These pin that wiring, the keyboard behaviour a multi-line
 * field needs, a visible focus ring, and the contrast of its text and edge.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import { Field, FieldDescription, FieldError, FieldLabel } from './field.js'
import { expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'
import { Textarea } from './textarea.js'

const meta = {
  title: 'Components/Textarea/Accessibility',
  component: Textarea,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

function ReportField({ invalid }: { invalid?: boolean }) {
  return (
    <Field className='max-w-md' invalid={invalid}>
      <FieldLabel>Tell us what happened</FieldLabel>
      <Textarea placeholder='For example, where and when it happened' />
      <FieldDescription>Do not include personal information.</FieldDescription>
      {invalid ? <FieldError>Enter a description of what happened.</FieldError> : null}
    </Field>
  )
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

/**
 * Resolve a custom property to a colour by painting it on a probe. The probe
 * goes on the parent — a textarea cannot hold children. Mutates the DOM: never
 * call inside waitFor.
 */
function tokenColour(element: HTMLElement, token: string): string {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  ;(element.parentElement ?? element).append(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
}

/** Computed colour strings differ in rounding and colour space, so compare painted pixels. */
function sameColour(a: string, b: string): boolean {
  const [x, y] = [resolveColor(a), resolveColor(b)]
  return x.r === y.r && x.g === y.g && x.b === y.b && x.a === y.a
}

/** The colour the control sits on: the nearest ancestor with a painted background. Read-only. */
function pageBackdrop(element: HTMLElement): string {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const colour = getComputedStyle(node).backgroundColor
    if (colour !== 'rgba(0, 0, 0, 0)' && colour !== 'transparent') return colour
  }
  return getComputedStyle(document.body).backgroundColor
}

/** Story globals apply after mount: wait for the theme class before resolving tokens. */
async function settleTheme(theme: unknown) {
  const dark = theme === 'dark'
  await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(dark))
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The label and hint beside the field must be tied to it in code, so a screen reader announces them when the field takes focus.',
          how: 'Inside a Field, FieldLabel becomes the textarea’s accessible name and FieldDescription its accessible description, with no ids to wire. The play() reads both.',
          caveat:
            'A placeholder is not a label: it disappears as soon as someone types, and it does not name the field.',
        }),
      },
    },
  },
  render: () => <ReportField />,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', { name: 'Tell us what happened' })
    await expect(textarea.tagName).toBe('TEXTAREA')
    await expect(textarea).toHaveAccessibleDescription('Do not include personal information.')
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
          why: 'A multi-line answer has to be typed in full from the keyboard, including new lines, and the field must not trap focus.',
          how: 'Tab into the field, type, and press Enter: it inserts a new line rather than submitting. Tab again and focus moves on. The play() does all three.',
          caveat:
            'Tab always leaves the field; it never inserts a tab character, which is what keeps it from trapping keyboard users.',
        }),
      },
    },
  },
  render: () => (
    <form className='grid max-w-md gap-4' onSubmit={(event) => event.preventDefault()}>
      <ReportField />
      <div>
        <Button type='submit'>Send report</Button>
      </div>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox', { name: 'Tell us what happened' })
    await userEvent.tab()
    await expect(textarea).toHaveFocus()
    await userEvent.keyboard('Crack in the footpath{Enter}Near the bus stop')
    await expect(textarea).toHaveValue('Crack in the footpath\nNear the bus stop')
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Send report' })).toHaveFocus()
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
          why: 'Keyboard users need to see which field they are typing into.',
          how: 'Tab into the field: a 2px outline in the ring colour appears 2px outside its border (the danger ring when invalid). The play() reads the outline on a valid and an invalid field.',
          caveat:
            'Browsers treat text fields as focus-visible on click as well, so the ring also shows for mouse users.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      <ReportField />
      <ReportField invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const textarea of within(canvasElement).getAllByRole('textbox')) {
      await userEvent.tab()
      await expect(textarea).toHaveFocus()
      const style = getComputedStyle(textarea)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(style.outlineOffset).toBe('2px')
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastMinimum: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'What people type, and any placeholder, must be readable against the field: 4.5:1 for text this size.',
          how: 'The play() measures the typed text and the ::placeholder colour against the field’s surface, in light mode and again in dark.',
          caveat:
            'axe does not check ::placeholder, so this story is the only gate on it. Placeholders use text-muted, never text-subtle, for that reason.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid max-w-md gap-4'>
      <Textarea aria-label='Filled' defaultValue='Pothole on King Street, near the bus stop.' />
      <Textarea aria-label='Empty' placeholder='For example, where and when it happened' />
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const filled = canvas.getByRole('textbox', { name: 'Filled' })
    const empty = canvas.getByRole('textbox', { name: 'Empty' })
    const surface = tokenColour(filled, '--input-surface')
    await waitFor(() =>
      expect(sameColour(getComputedStyle(filled).backgroundColor, surface)).toBe(true),
    )
    expectContrast(getComputedStyle(filled).color, surface, { label: 'Typed text' })
    expectContrast(getComputedStyle(empty, '::placeholder').color, surface, {
      label: 'Placeholder text',
    })
  },
}

export const ContrastMinimum: Story = { ...contrastMinimum, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastMinimum,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextContrast: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The border is what shows where to type, so it needs 3:1 against the page and against the field’s own fill.',
          how: 'The play() measures the border colour against the page, the input surface and the hover surface, and the invalid border against the page — in light mode and again in dark.',
          caveat:
            'Disabled fields are exempt and are not measured. Colours are painted through a canvas, so oklch tokens are measured as drawn.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid max-w-md gap-4'>
      <Textarea aria-label='Default' />
      <Textarea aria-label='Invalid' aria-invalid />
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Default' })
    const invalid = canvas.getByRole('textbox', { name: 'Invalid' })
    const border = tokenColour(field, '--input-border')
    const surface = tokenColour(field, '--input-surface')
    const hover = tokenColour(field, '--input-surface-hover')
    const invalidBorder = tokenColour(invalid, '--input-invalid-border')
    await waitFor(() => {
      expect(sameColour(getComputedStyle(field).borderTopColor, border)).toBe(true)
      expect(sameColour(getComputedStyle(invalid).borderTopColor, invalidBorder)).toBe(true)
    })
    const page = pageBackdrop(field)
    expectContrast(border, page, { minimum: 3, label: 'Border against the page' })
    expectContrast(border, surface, { minimum: 3, label: 'Border against the field' })
    expectContrast(border, hover, { minimum: 3, label: 'Border against the hover surface' })
    expectContrast(invalidBorder, page, { minimum: 3, label: 'Invalid border against the page' })
  },
}

export const NonTextContrast: Story = { ...nonTextContrast, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 3.3.1 — Error Identification ─────────────────────────────────────────────

export const ErrorIdentification: Story = {
  name: 'Error Identification — 3.3.1',
  parameters: {
    wcag: ['3.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.1',
          why: 'When the answer is missing or wrong, the error has to be identified in text and tied to the field, not shown by colour alone.',
          how: 'Field invalid marks the textarea aria-invalid and adds the FieldError to its accessible description, after the hint. The play() asserts both.',
          caveat:
            'The red border is a second signal, never the only one: always render the FieldError text.',
        }),
      },
    },
  },
  render: () => <ReportField invalid />,
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', { name: 'Tell us what happened' })
    await expect(textarea).toHaveAttribute('aria-invalid', 'true')
    await expect(textarea).toHaveAccessibleDescription(
      'Do not include personal information. Enter a description of what happened.',
    )
  },
}

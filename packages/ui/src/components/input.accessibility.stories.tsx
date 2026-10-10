/**
 * Input — Accessibility (WCAG 2.2)
 *
 * One story per WCAG 2.2 success criterion that meaningfully applies to a
 * single-line text input. Each story renders the input in a way that
 * demonstrates the criterion and includes a `play()` function that
 * programmatically asserts the conformance condition.
 *
 * Criteria covered:
 *   1.3.1 Info and Relationships          (A)   — LabelAssociation
 *   1.3.5 Identify Input Purpose          (AA)  — InputPurpose
 *   1.4.11 Non-text Contrast              (AA)  — FocusAppearance (focus ring contrast),
 *                                                  InvalidBorderContrast (invalid boundary)
 *   2.4.7 Focus Visible                   (AA)  — FocusAppearance
 *   2.4.13 Focus Appearance               (AAA, new in 2.2) — FocusAppearance
 *   3.3.1 Error Identification            (A)   — ErrorIdentification
 *   3.3.2 Labels or Instructions          (A)   — LabelAssociation
 *   4.1.2 Name, Role, Value               (A)   — LabelAssociation (asserts accessible name)
 *
 * Touch-target geometry (WCAG 2.5.8 Target Size — Minimum, AA in 2.2) is not
 * given its own story: the input ships at 48px tall, which trivially exceeds
 * the 24×24 CSS-pixel minimum. 2.4.11 Focus Not Obscured (AA, new in 2.2) is
 * also omitted because it is a layout concern, not a component-level one.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { waitFor } from 'storybook/test'

import { Checkbox } from './checkbox.js'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './input-group.js'
import { Input } from './input.js'
import { NativeSelect, NativeSelectOption } from './native-select.js'
import { RadioGroup, RadioGroupItem } from './radio-group.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.js'
import { expectContrast, resolveColor } from './story-helpers.js'
import { Textarea } from './textarea.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Input/Accessibility',
  component: Input,
  tags: ['!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    type: 'text',
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const docsTemplate = ({
  what,
  why,
  how,
  caveat,
}: {
  what: string
  why: string
  how: string
  caveat: string
}) => `${what}\n\nWhy it matters: ${why}\n\nHow to test: ${how}\n\nCaveats: ${caveat}`

function getInputById(canvasElement: HTMLElement, id: string): HTMLInputElement {
  const input = canvasElement.querySelector<HTMLInputElement>(`input[id="${id}"]`)
  if (!input) throw new Error(`Could not find input #${id} in canvas.`)
  return input
}

// ─── 1.3.1 / 3.3.2 / 4.1.2 — Label Association ────────────────────────────────

export const LabelAssociation: Story = {
  name: 'Info and Relationships — 1.3.1 / 3.3.2 / 4.1.2',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Inputs are paired with a visible <label> connected via htmlFor → id, so the field has a programmatic accessible name reported by HTMLInputElement.labels.',
          why: 'WCAG 1.3.1 Info and Relationships (A) requires the label-input relationship to be programmatically determinable. 3.3.2 Labels or Instructions (A) requires labels when content needs user input. 4.1.2 Name, Role, Value (A) requires the accessible name to be exposed to assistive technology.',
          how: 'Tab to the input with VoiceOver or NVDA — the screen reader announces "Email address, edit text". The play() function asserts the input has a matching <label> in its .labels collection and that the label text is non-empty.',
          caveat:
            'When a visible label is not possible, fall back to aria-label or aria-labelledby. Placeholder text is NOT an accessible name — it disappears as soon as the user types and is invisible to many ATs.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-md gap-1.5'>
      <label htmlFor='a11y-label-email' className='text-base font-medium text-foreground'>
        Email address
      </label>
      <Input id='a11y-label-email' type='email' placeholder='you@example.com' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = getInputById(canvasElement, 'a11y-label-email')

    if (!input.labels || input.labels.length === 0) {
      throw new Error('WCAG 1.3.1: input has no associated <label> via htmlFor/labels.')
    }

    const labelText = input.labels[0]?.textContent?.trim() ?? ''
    if (labelText.length === 0) {
      throw new Error('WCAG 4.1.2: associated <label> has empty text — accessible name is missing.')
    }
  },
}

// ─── 1.3.5 — Identify Input Purpose ───────────────────────────────────────────

export const InputPurpose: Story = {
  name: 'Identify Input Purpose — 1.3.5',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Inputs collecting personal information declare their purpose via the autoComplete attribute, using tokens drawn from the WCAG 1.3.5 input-purpose list.',
          why: 'WCAG 1.3.5 Identify Input Purpose (AA) requires the purpose of fields collecting user data to be programmatically determinable, so browsers and password managers can autofill and AT can adapt the UI for the user.',
          how: 'Open the browser autofill prompt on each field — suggestions should match the declared token. The play() function asserts each input exposes the correct autocomplete attribute value.',
          caveat:
            'autoComplete only applies to fields whose purpose matches a token in the WCAG 1.3.5 input-purpose list (name, email, tel, postal-code, street-address, …). For purpose-less fields, omit the attribute rather than setting "off".',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-md gap-3'>
      <div className='grid gap-1.5'>
        <label htmlFor='a11y-purpose-name' className='text-base font-medium'>
          Full name
        </label>
        <Input id='a11y-purpose-name' type='text' autoComplete='name' placeholder='Jane Citizen' />
      </div>
      <div className='grid gap-1.5'>
        <label htmlFor='a11y-purpose-email' className='text-base font-medium'>
          Email address
        </label>
        <Input
          id='a11y-purpose-email'
          type='email'
          autoComplete='email'
          placeholder='you@example.com'
        />
      </div>
      <div className='grid gap-1.5'>
        <label htmlFor='a11y-purpose-tel' className='text-base font-medium'>
          Phone number
        </label>
        <Input id='a11y-purpose-tel' type='tel' autoComplete='tel' placeholder='0400 000 000' />
      </div>
      <div className='grid gap-1.5'>
        <label htmlFor='a11y-purpose-postal' className='text-base font-medium'>
          Postcode
        </label>
        <Input id='a11y-purpose-postal' type='text' autoComplete='postal-code' placeholder='2000' />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const expected: ReadonlyArray<readonly [string, string]> = [
      ['a11y-purpose-name', 'name'],
      ['a11y-purpose-email', 'email'],
      ['a11y-purpose-tel', 'tel'],
      ['a11y-purpose-postal', 'postal-code'],
    ]

    for (const [id, token] of expected) {
      const input = getInputById(canvasElement, id)
      const actual = input.getAttribute('autocomplete')
      if (actual !== token) {
        throw new Error(
          `WCAG 1.3.5: #${id} expected autocomplete="${token}", got "${actual ?? 'null'}".`,
        )
      }
    }
  },
}

// ─── 2.4.7 / 2.4.13 / 1.4.11 — Focus Appearance ───────────────────────────────

export const FocusAppearance: Story = {
  name: 'Focus Visible — 2.4.7 / 2.4.13',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The focus indicator is a 2px solid NSW-blue (primary-800) outline with a 2px offset, drawn outside the field bounds so it is never clipped by adjacent content.',
          why: 'WCAG 2.4.7 Focus Visible (AA) requires a visible keyboard focus indicator. 2.4.13 Focus Appearance (AAA, new in 2.2) requires the indicator to be at least 2 CSS pixels thick and to have a contrast ratio of at least 3:1 against adjacent colours. 1.4.11 Non-text Contrast (AA) requires the same 3:1 ratio for the field border itself.',
          how: 'Tab to the first input or hover the second (which has the focus utilities forced on). The play() function asserts the forced input has computed outline-style: solid, outline-width ≥ 2px, and outline-offset ≥ 2px.',
          caveat:
            'Forced focus is shown so the indicator is visible without Storybook stealing keyboard focus on render. The first input still meets all three criteria when focused live — Tab to confirm.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-md gap-4'>
      <div className='grid gap-1.5'>
        <label htmlFor='a11y-focus-live' className='text-base font-medium text-foreground'>
          Tab into me (live focus)
        </label>
        <Input id='a11y-focus-live' placeholder='Click or tab to focus' />
      </div>

      <div className='grid gap-1.5'>
        <label htmlFor='a11y-focus-forced' className='text-base font-medium text-foreground'>
          Forced focus (utilities applied directly)
        </label>
        <Input
          id='a11y-focus-forced'
          placeholder='Always shows focus indicator'
          className='outline outline-2 outline-offset-2 outline-primary-800'
        />
      </div>

      <p className='text-base text-foreground'>
        Indicator:{' '}
        <code className='rounded bg-muted px-1 py-0.5 text-base text-foreground'>
          outline: 2px solid var(--color-primary-800); outline-offset: 2px
        </code>
        . NSW blue against white surface ≈ 9:1 contrast — comfortably above the 3:1 floor required
        by 2.4.13 and 1.4.11.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const forced = getInputById(canvasElement, 'a11y-focus-forced')
    const cs = getComputedStyle(forced)

    if (cs.outlineStyle !== 'solid') {
      throw new Error(`WCAG 2.4.13: outline-style expected "solid", got "${cs.outlineStyle}".`)
    }

    const width = parseFloat(cs.outlineWidth)
    if (!Number.isFinite(width) || width < 2) {
      throw new Error(`WCAG 2.4.13: outline-width expected ≥ 2px, got "${cs.outlineWidth}".`)
    }

    const offset = parseFloat(cs.outlineOffset)
    if (!Number.isFinite(offset) || offset < 2) {
      throw new Error(
        `outline-offset expected ≥ 2px (so the ring isn't clipped), got "${cs.outlineOffset}".`,
      )
    }
  },
}

// ─── 3.3.1 — Error Identification ─────────────────────────────────────────────

export const ErrorIdentification: Story = {
  name: 'Error Identification — 3.3.1',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Invalid inputs set aria-invalid="true" and link to an error message via aria-describedby, so the error is announced as part of the field when it receives focus.',
          why: 'WCAG 3.3.1 Error Identification (A) requires that input errors are identified in text and that the affected item is identified to the user. aria-invalid alone is not enough — the field must also point to a programmatic description of the problem.',
          how: 'Focus the field with a screen reader running — VoiceOver announces "Email address, invalid entry, edit text. Please enter a valid email address". The play() function asserts aria-invalid="true", that aria-describedby is set, and that it resolves to a non-empty element in the DOM.',
          caveat:
            'Clear aria-invalid and aria-describedby once the user corrects the value, otherwise AT will keep announcing the (stale) error. This story shows the persistent error state for design review.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-md gap-1.5'>
      <label htmlFor='a11y-error-input' className='text-base font-medium text-foreground'>
        Email address
      </label>
      <Input
        id='a11y-error-input'
        type='email'
        defaultValue='not-an-email'
        aria-invalid='true'
        aria-describedby='a11y-error-message'
      />
      <p
        id='a11y-error-message'
        // danger-600 (#b81237) passes AA against white but only ~3:1 against
        // the dark-mode --background. danger-300 is the lightest red that
        // still reads as "error" against the dark surface.
        className='text-base text-danger-600 dark:text-danger-300'
        role='alert'
      >
        Please enter a valid email address.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = getInputById(canvasElement, 'a11y-error-input')

    if (input.getAttribute('aria-invalid') !== 'true') {
      throw new Error('WCAG 3.3.1: aria-invalid="true" is missing.')
    }

    const describedBy = input.getAttribute('aria-describedby')
    if (!describedBy) {
      throw new Error('WCAG 3.3.1: aria-describedby is missing on the input.')
    }

    const errEl = canvasElement.querySelector(`[id="${describedBy}"]`)
    if (!errEl) {
      throw new Error(
        `WCAG 3.3.1: aria-describedby="${describedBy}" but no element with that id exists.`,
      )
    }

    const errText = errEl.textContent?.trim() ?? ''
    if (errText.length === 0) {
      throw new Error('WCAG 3.3.1: error message element exists but has empty text.')
    }
  },
}

// ─── 1.4.11 — Invalid Border Contrast ─────────────────────────────────────────

// Resolve a custom property to a computed colour string the canvas can parse.
// The probe goes on the parent: an <input> or <textarea> cannot hold children.
function tokenColour(element: HTMLElement, token: string): string {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  ;(element.parentElement ?? element).append(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
}

// Computed colour strings differ in rounding, so compare the painted pixels.
function sameColour(a: string, b: string): boolean {
  const [x, y] = [resolveColor(a), resolveColor(b)]
  return x.r === y.r && x.g === y.g && x.b === y.b && x.a === y.a
}

// The page colour the control's border meets on its outer side.
function pageBackdrop(element: HTMLElement): string {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const colour = getComputedStyle(node).backgroundColor
    if (colour !== 'rgba(0, 0, 0, 0)' && colour !== 'transparent') return colour
  }
  return tokenColour(element, '--background-default')
}

export const InvalidBorderContrast: Story = {
  name: 'Non-text Contrast — 1.4.11',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: "Every control that shares Input's invalid roles draws its invalid boundary in --input-invalid-border: Input, Textarea, InputGroup, Select (both variants), NativeSelect, Checkbox and Radio.",
          why: 'WCAG 1.4.11 Non-text Contrast (AA) requires a 3:1 ratio for the visual boundary that identifies a control and its state. The invalid border is that boundary for a field in error. The previous mapping, danger-border, measured 2.32:1 in light mode and 1.72:1 in dark mode.',
          how: "The play() function reads each control's rendered border colour and measures it against the control's own fill, the invalid hover surface and the page behind it, requiring 3:1 against all three. It runs again in dark mode.",
          caveat:
            'Colours are resolved through a canvas, so oklch values are measured as painted rather than parsed as strings. The ratio is asserted rather than a specific token, so a later retune only has to stay above 3:1.',
        }),
      },
    },
  },
  // pointer-events-none: the test browser's real pointer can rest wherever an
  // earlier story left it, and a hovered control swaps its fill for the hover
  // surface. Both are measured below anyway, but the reading should not depend
  // on where the pointer happens to be.
  render: () => (
    <div className='pointer-events-none grid w-full max-w-md gap-6'>
      <Input aria-label='Invalid input' aria-invalid defaultValue='not-an-email' />
      <Textarea aria-label='Invalid textarea' aria-invalid defaultValue='Too short' />
      <InputGroup>
        <InputGroupInput aria-label='Invalid input group' aria-invalid defaultValue='12.5' />
        <InputGroupAddon align='inline-end'>
          <InputGroupText>kg</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <Select defaultValue='nsw'>
        <SelectTrigger aria-label='Invalid select' aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='nsw'>New South Wales</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue='nsw'>
        <SelectTrigger aria-label='Invalid filled select' variant='filled' aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='nsw'>New South Wales</SelectItem>
        </SelectContent>
      </Select>
      <NativeSelect aria-label='Invalid native select' aria-invalid defaultValue='nsw'>
        <NativeSelectOption value='nsw'>New South Wales</NativeSelectOption>
      </NativeSelect>
      <Checkbox aria-label='Invalid checkbox' aria-invalid />
      <RadioGroup aria-label='Invalid radio group'>
        <RadioGroupItem aria-label='Invalid radio' value='a' aria-invalid />
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const named = (label: string) => {
      const element = canvasElement.querySelector<HTMLElement>(`[aria-label="${label}"]`)
      if (!element) throw new Error(`Could not find "${label}".`)
      return element
    }
    // The element that draws each boundary. InputGroup draws it on the group,
    // not on the borderless input that carries aria-invalid.
    const controls = [
      ['Invalid input', named('Invalid input')],
      ['Invalid textarea', named('Invalid textarea')],
      [
        'Invalid input group',
        named('Invalid input group').closest<HTMLElement>('[data-slot="input-group"]')!,
      ],
      ['Invalid select', named('Invalid select')],
      ['Invalid filled select', named('Invalid filled select')],
      ['Invalid native select', named('Invalid native select')],
      ['Invalid checkbox', named('Invalid checkbox')],
      ['Invalid radio', named('Invalid radio')],
    ] as const

    for (const [name, control] of controls) {
      // Prove the control really draws the shared token, so the ratio below
      // is measuring --input-invalid-border and not some local colour. Story
      // globals apply after mount, so let a colour transition settle first;
      // the expected value is resolved outside waitFor, because the token probe
      // mutates the DOM and waitFor re-runs its callback on every mutation.
      const token = tokenColour(control, '--input-invalid-border')
      await waitFor(() => {
        if (!sameColour(getComputedStyle(control).borderTopColor, token)) {
          throw new Error(
            `${name}: border is ${getComputedStyle(control).borderTopColor}, not --input-invalid-border.`,
          )
        }
      })
      const style = getComputedStyle(control)
      const border = style.borderTopColor
      if (parseFloat(style.borderTopWidth) < 2) {
        throw new Error(`${name}: invalid border is ${style.borderTopWidth}, expected 2px.`)
      }

      expectContrast(border, style.backgroundColor, {
        minimum: 3,
        label: `${name} invalid border against its own fill`,
      })
      expectContrast(border, tokenColour(control, '--input-invalid-surface-hover'), {
        minimum: 3,
        label: `${name} invalid border against the invalid hover surface`,
      })
      expectContrast(border, pageBackdrop(control), {
        minimum: 3,
        label: `${name} invalid border against the page`,
      })
    }
  },
}

// ─── Dark-mode variants ───────────────────────────────────────────────────────
//
// Each light-mode story above is re-exported with `globals.theme = 'dark'`.
// The render, play(), and docs are inherited via object spread so any change
// to the source story automatically applies to its dark counterpart — the
// only purpose of these extras is to feed a second axe-core scan against the
// dark palette so CI enforces AA in both modes.
//
// The custom theme decorator in apps/storybook/.storybook/preview.tsx reads
// `context.globals.theme` and toggles the `.dark` class on <html>, which
// flips the `--background`, `--foreground`, and component-level `dark:*`
// utilities.

export const LabelAssociationDark: Story = {
  ...LabelAssociation,
  name: 'Info and Relationships — 1.3.1 / 3.3.2 / 4.1.2 (dark)',
  globals: { theme: 'dark' },
}

export const InputPurposeDark: Story = {
  ...InputPurpose,
  name: 'Identify Input Purpose — 1.3.5 (dark)',
  globals: { theme: 'dark' },
}

export const FocusAppearanceDark: Story = {
  ...FocusAppearance,
  name: 'Focus Visible — 2.4.7 / 2.4.13 (dark)',
  globals: { theme: 'dark' },
}

export const ErrorIdentificationDark: Story = {
  ...ErrorIdentification,
  name: 'Error Identification — 3.3.1 (dark)',
  globals: { theme: 'dark' },
}

export const InvalidBorderContrastDark: Story = {
  ...InvalidBorderContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

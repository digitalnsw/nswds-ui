/**
 * Checkbox — Accessibility
 *
 * One story per WCAG 2.2 criterion a checkbox has to meet, each asserting it in
 * play(). Behaviour comes from the Base UI checkbox (role, checked state,
 * keyboard, form value); these pin the parts a consumer relies on — that it is
 * named by its visible label, toggles from the keyboard, shows where focus is,
 * is drawn with enough contrast, is big enough to hit, and reports its group
 * and its error.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Checkbox } from './checkbox.js'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './field.js'
import { expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Checkbox/Accessibility',
  component: Checkbox,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

function Labelled({ label, ...props }: { label: string } & ComponentProps<typeof Checkbox>) {
  return (
    <Field orientation='horizontal' className='min-h-11 gap-4'>
      <Checkbox {...props} />
      <FieldLabel className='font-normal'>{label}</FieldLabel>
    </Field>
  )
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

/** Resolve a custom property to a colour by painting it on a probe. Mutates the DOM: never call inside waitFor. */
function tokenColour(element: HTMLElement, token: string): string {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  element.append(probe)
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

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader has to announce what the control is, what it is for and whether it is ticked — and announce the change when it is ticked.',
          how: 'Each checkbox exposes the checkbox role, takes its name from the FieldLabel beside it, and reports aria-checked: false, true, or mixed for the indeterminate one. The play() asserts all three and that pressing the label flips the value.',
          caveat:
            'Base UI renders the role on a span and keeps a hidden input for form submission; the span is the control assistive technology sees.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-2'>
      <Labelled label='Email me about my application' />
      <Labelled label='Send me appointment reminders' defaultChecked />
      <Labelled label='All contact methods' indeterminate />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const updates = canvas.getByRole('checkbox', { name: 'Email me about my application' })
    await expect(updates).toHaveAttribute('aria-checked', 'false')
    await expect(
      canvas.getByRole('checkbox', { name: 'Send me appointment reminders' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByRole('checkbox', { name: 'All contact methods' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    )

    await userEvent.click(canvas.getByText('Email me about my application'))
    await expect(updates).toHaveAttribute('aria-checked', 'true')
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
          why: 'People who cannot use a pointer must be able to reach every checkbox and change it.',
          how: 'Tab moves to each checkbox in turn; Space ticks and unticks the focused one. The play() tabs to both and toggles the second with Space.',
          caveat:
            'Space is the checkbox key, as for a native checkbox; Enter does not toggle it, and submits the form instead when there is one.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-2'>
      <Labelled label='Housing and homelessness' />
      <Labelled label='Transport and concessions' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const housing = canvas.getByRole('checkbox', { name: 'Housing and homelessness' })
    const transport = canvas.getByRole('checkbox', { name: 'Transport and concessions' })

    await userEvent.tab()
    await expect(housing).toHaveFocus()
    await userEvent.tab()
    await expect(transport).toHaveFocus()

    await userEvent.keyboard('[Space]')
    await expect(transport).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('[Space]')
    await expect(transport).toHaveAttribute('aria-checked', 'false')
    await expect(housing).toHaveAttribute('aria-checked', 'false')
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
          why: 'Keyboard users need to see which checkbox Space will change.',
          how: 'Tab to the checkbox: a 2px outline in the ink colour appears 3px outside the box (2px outside an invalid one). The play() tabs to each and reads the outline.',
          caveat:
            'The ring is on :focus-visible, so it shows for keyboard focus and not after a mouse click — the browser decides which.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-2'>
      <Labelled label='Accept terms' />
      <Labelled label='Confirm the information is correct' aria-invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Accept terms', 'Confirm the information is correct']) {
      await userEvent.tab()
      const checkbox = canvas.getByRole('checkbox', { name })
      await expect(checkbox).toHaveFocus()
      const style = getComputedStyle(checkbox)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
    }
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextContrast: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The box edge is what shows a checkbox is there, and the tick is what shows it is on, so both need 3:1 against what they sit on.',
          how: 'The play() measures the unticked border against the page and the input surface, the ticked inset against the input surface, the tick against the inset, and the invalid border against the page — in light mode and again in dark.',
          caveat:
            'Disabled checkboxes are exempt from 1.4.11 and are not measured. Colours are painted through a canvas, so oklch tokens are measured as drawn.',
        }),
      },
    },
  },
  // pointer-events-none: a pointer resting on a box from an earlier story
  // would paint its hover tint, which is correct but not what is measured.
  render: () => (
    <div className='pointer-events-none grid gap-2'>
      <Labelled label='Unticked' />
      <Labelled label='Ticked' defaultChecked />
      <Labelled label='Invalid' aria-invalid />
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const unticked = canvas.getByRole('checkbox', { name: 'Unticked' })
    const ticked = canvas.getByRole('checkbox', { name: 'Ticked' })
    const invalid = canvas.getByRole('checkbox', { name: 'Invalid' })
    const inset = ticked.querySelector<HTMLElement>('[data-slot="checkbox-indicator"]')!

    // Resolved outside waitFor: the probe mutates the DOM.
    const border = tokenColour(unticked, '--text-default')
    const surface = tokenColour(unticked, '--input-surface')
    const ink = tokenColour(
      ticked,
      document.documentElement.classList.contains('dark')
        ? '--color-primary-200'
        : '--color-primary-800',
    )
    const invalidBorder = tokenColour(invalid, '--input-invalid-border')

    // Wait for the controls to finish any colour transition onto these tokens.
    await waitFor(() => {
      expect(sameColour(getComputedStyle(unticked).borderTopColor, border)).toBe(true)
      expect(sameColour(getComputedStyle(inset).backgroundColor, ink)).toBe(true)
      expect(sameColour(getComputedStyle(invalid).borderTopColor, invalidBorder)).toBe(true)
    })

    const page = pageBackdrop(unticked)
    expectContrast(border, page, { minimum: 3, label: 'Unticked border against the page' })
    expectContrast(border, surface, { minimum: 3, label: 'Unticked border against its fill' })
    expectContrast(ink, surface, { minimum: 3, label: 'Ticked inset against the input surface' })
    expectContrast(getComputedStyle(inset).color, ink, {
      minimum: 3,
      label: 'Tick against the ticked inset',
    })
    expectContrast(invalidBorder, page, { minimum: 3, label: 'Invalid border against the page' })
  },
}

export const NonTextContrast: Story = { ...nonTextContrast, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSize: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Small targets are hard to hit for people with tremors or on a phone; WCAG asks for at least 24×24px.',
          how: 'The box itself is 32×32px, and a 44×44px hit area is layered over it. The play() measures both.',
          caveat:
            'The label is a target too: pressing it toggles the checkbox, so a horizontal Field makes the whole row hittable.',
        }),
      },
    },
  },
  render: () => <Labelled label='Accept terms' />,
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Accept terms' })
    const box = checkbox.getBoundingClientRect()
    await expect(box.width).toBeGreaterThanOrEqual(24)
    await expect(box.height).toBeGreaterThanOrEqual(24)
    const hitArea = getComputedStyle(checkbox, '::after')
    await expect(parseFloat(hitArea.width)).toBeGreaterThanOrEqual(44)
    await expect(parseFloat(hitArea.height)).toBeGreaterThanOrEqual(44)
  },
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
          why: 'A set of checkboxes answers one question. The question, and any hint, must be tied to the controls in code, not only placed near them.',
          how: 'The options sit in a FieldSet whose FieldLegend names the group; an option’s FieldDescription is its accessible description. The play() reads the group’s name and the description.',
          caveat:
            'Use FieldSet and FieldLegend for the question. A heading or paragraph above the options looks the same but is not announced with them.',
        }),
      },
    },
  },
  render: () => (
    <FieldSet className='max-w-md'>
      <FieldLegend>Which services do you need help with?</FieldLegend>
      <div className='grid gap-2'>
        <Labelled label='Housing and homelessness' />
        <Field orientation='horizontal' className='gap-4'>
          <Checkbox />
          <FieldContent className='pt-1'>
            <FieldLabel className='font-normal'>Legal help</FieldLabel>
            <FieldDescription>Free advice from Legal Aid NSW.</FieldDescription>
          </FieldContent>
        </Field>
      </div>
    </FieldSet>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Which services do you need help with?' })
    await expect(
      within(group).getByRole('checkbox', { name: 'Housing and homelessness' }),
    ).toBeInTheDocument()
    await expect(canvas.getByRole('checkbox', { name: 'Legal help' })).toHaveAccessibleDescription(
      'Free advice from Legal Aid NSW.',
    )
  },
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
          why: 'When a required declaration is left unticked, the error has to be identified in text, and tied to the checkbox, not shown by colour alone.',
          how: 'Field invalid marks the checkbox aria-invalid and the FieldError becomes its accessible description. The play() asserts both.',
          caveat:
            'The red border is a second signal, never the only one: always render the FieldError text.',
        }),
      },
    },
  },
  render: () => (
    <Field orientation='horizontal' className='max-w-md gap-4' invalid>
      <Checkbox />
      <FieldContent className='pt-1'>
        <FieldLabel className='font-normal'>
          I confirm the information I have given is correct
        </FieldLabel>
        <FieldError>Confirm the information is correct to continue.</FieldError>
      </FieldContent>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'I confirm the information I have given is correct',
    })
    await expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    await expect(checkbox).toHaveAccessibleDescription(
      'Confirm the information is correct to continue.',
    )
  },
}

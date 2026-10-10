/**
 * Switch — Accessibility
 *
 * One story per WCAG 2.2 criterion a switch has to meet, each asserting it in
 * play(). Behaviour comes from the Base UI switch (the `switch` role, its
 * checked state and keyboard toggling); these pin the parts a consumer relies
 * on — that it is named by its label, toggles from the keyboard, shows where
 * focus is, reads on or off without colour, is drawn with enough contrast and
 * is big enough to hit.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldLabel } from './field.js'
import { expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'
import { Switch } from './switch.js'

const meta = {
  title: 'Components/Switch/Accessibility',
  component: Switch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

function Labelled({ label, ...props }: { label: string } & ComponentProps<typeof Switch>) {
  return (
    <Field orientation='horizontal' className='min-h-11 gap-4'>
      <Switch {...props} />
      <FieldLabel className='font-normal'>{label}</FieldLabel>
    </Field>
  )
}

const thumbOf = (control: HTMLElement) =>
  control.querySelector<HTMLElement>('[data-slot="switch-thumb"]')!

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
          why: 'A screen reader has to announce that this is an on/off switch, what it controls, and whether it is on — and announce the change.',
          how: 'The control exposes the switch role, takes its name from the FieldLabel beside it, and reports aria-checked. The play() asserts the role and name, and that pressing the label turns it on.',
          caveat:
            'Base UI renders the role on a span and keeps a hidden input for form submission; the span is the control assistive technology sees.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-2'>
      <Labelled label='Email updates' />
      <Labelled label='SMS reminders' defaultChecked />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const updates = canvas.getByRole('switch', { name: 'Email updates' })
    await expect(updates).toHaveAttribute('aria-checked', 'false')
    await expect(canvas.getByRole('switch', { name: 'SMS reminders' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await userEvent.click(canvas.getByText('Email updates'))
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
          why: 'People who cannot use a pointer must be able to reach every switch and turn it on or off.',
          how: 'Tab moves to each switch in turn; Space toggles the focused one. The play() tabs to the second switch and toggles it twice.',
          caveat: 'Focus stays on the switch after it toggles, so it can be toggled back.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-2'>
      <Labelled label='Email updates' />
      <Labelled label='SMS reminders' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reminders = canvas.getByRole('switch', { name: 'SMS reminders' })
    await userEvent.tab()
    await expect(canvas.getByRole('switch', { name: 'Email updates' })).toHaveFocus()
    await userEvent.tab()
    await expect(reminders).toHaveFocus()
    await userEvent.keyboard('[Space]')
    await expect(reminders).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('[Space]')
    await expect(reminders).toHaveAttribute('aria-checked', 'false')
    await expect(reminders).toHaveFocus()
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
          why: 'Keyboard users need to see which switch Space will toggle.',
          how: 'Tab to a switch: a 2px outline in the ink colour appears 3px outside the track (2px outside an invalid one). The play() tabs to each and reads the outline.',
          caveat:
            'The ring is on :focus-visible, so it shows for keyboard focus and not after a mouse click — the browser decides which.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-2'>
      <Labelled label='Email updates' />
      <Labelled label='Two-step verification' aria-invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Email updates', 'Two-step verification']) {
      await userEvent.tab()
      const control = canvas.getByRole('switch', { name })
      await expect(control).toHaveFocus()
      const style = getComputedStyle(control)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
    }
  },
}

// ─── 1.4.1 — Use of Color ─────────────────────────────────────────────────────

export const UseOfColor: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'People who cannot tell the track colours apart still need to know whether a setting is on.',
          how: 'Off is a hollow ring at the start of the track; on is a solid thumb with a tick at the end. The play() asserts the tick is drawn only when on, the off thumb carries a 2px ring and the on thumb none, and that the thumb moves.',
          caveat:
            'The label should still say what the setting is, not whether it is on — the state belongs to the control.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid gap-2'>
      <Labelled label='Off' />
      <Labelled label='On' defaultChecked />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const off = canvas.getByRole('switch', { name: 'Off' })
    const on = canvas.getByRole('switch', { name: 'On' })
    await expect(thumbOf(off).querySelector('svg')).toBeNull()
    await expect(thumbOf(on).querySelector('svg')).not.toBeNull()

    // The off thumb's ring is a 2px inset box-shadow; the on thumb has none.
    await waitFor(() => {
      expect(getComputedStyle(thumbOf(off)).boxShadow).toMatch(/0px 0px 0px 2px inset/)
      expect(getComputedStyle(thumbOf(on)).boxShadow).not.toMatch(/0px 0px 0px 2px inset/)
    })

    // Position: the off thumb sits at the start of the track, the on thumb at the end.
    await waitFor(() => {
      const offTrack = off.getBoundingClientRect()
      const onTrack = on.getBoundingClientRect()
      const offThumb = thumbOf(off).getBoundingClientRect()
      const onThumb = thumbOf(on).getBoundingClientRect()
      expect(offThumb.left - offTrack.left).toBeLessThan(offTrack.right - offThumb.right)
      expect(onTrack.right - onThumb.right).toBeLessThan(onThumb.left - onTrack.left)
    })
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
          why: 'The track edge shows the switch is there, and the thumb shows its state, so both need 3:1 against what they sit on.',
          how: 'The play() measures the off track’s border and the off thumb’s ring against the page and the input surface, the on track against the page, and the on thumb against its track — in light mode and again in dark.',
          caveat:
            'Disabled switches are exempt from 1.4.11 and are not measured. Colours are painted through a canvas, so oklch tokens are measured as drawn.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid gap-2'>
      <Labelled label='Off' />
      <Labelled label='On' defaultChecked />
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const off = canvas.getByRole('switch', { name: 'Off' })
    const on = canvas.getByRole('switch', { name: 'On' })

    // Resolved outside waitFor: the probe mutates the DOM.
    const border = tokenColour(off, '--text-default')
    const surface = tokenColour(off, '--input-surface')
    const ink = tokenColour(
      on,
      document.documentElement.classList.contains('dark')
        ? '--color-primary-200'
        : '--color-primary-800',
    )
    const mark = tokenColour(on, '--surface-default')

    await waitFor(() => {
      expect(sameColour(getComputedStyle(off).borderTopColor, border)).toBe(true)
      expect(sameColour(getComputedStyle(on).backgroundColor, ink)).toBe(true)
      expect(sameColour(getComputedStyle(thumbOf(on)).backgroundColor, mark)).toBe(true)
    })

    const page = pageBackdrop(off)
    expectContrast(border, page, { minimum: 3, label: 'Off track border against the page' })
    expectContrast(border, surface, {
      minimum: 3,
      label: 'Off track border and thumb ring against the input surface',
    })
    expectContrast(ink, page, { minimum: 3, label: 'On track against the page' })
    expectContrast(mark, ink, { minimum: 3, label: 'On thumb against its track' })
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
          how: 'The default track is 56×32px and the small one 40×24px; both carry a hit area at least 44px tall and 44px wide. The play() measures both sizes.',
          caveat:
            'The label is a target too: pressing it toggles the switch, so a horizontal Field makes the whole row hittable.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-2'>
      <Labelled label='Email updates' />
      <Labelled label='SMS reminders' size='sm' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Email updates', 'SMS reminders']) {
      const control = canvas.getByRole('switch', { name })
      const box = control.getBoundingClientRect()
      await expect(box.width).toBeGreaterThanOrEqual(24)
      await expect(box.height).toBeGreaterThanOrEqual(24)
      const hitArea = getComputedStyle(control, '::after')
      await expect(parseFloat(hitArea.width)).toBeGreaterThanOrEqual(44)
      await expect(parseFloat(hitArea.height)).toBeGreaterThanOrEqual(44)
    }
  },
}

/**
 * Checkbox — Tests
 *
 * Stories that exist to prove something rather than to show it: the Field
 * wiring, the controlled mixed state and form submission, geometry and colour
 * checks in light, dark and a brand theme, and a dark-mode snapshot of every
 * state. Hidden from the sidebar; they run in the Vitest suite and Chromatic.
 *
 * The fixed theme globals are why these live here: inline autodocs stories
 * share documentElement, and a story with fixed globals would repaint the
 * whole docs page as it mounted.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Checkbox } from './checkbox.js'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from './field.js'
import { Input } from './input.js'

const meta = {
  title: 'Components/Checkbox/Tests',
  component: Checkbox,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const states = [
  { label: 'Unchecked' },
  { label: 'Checked', defaultChecked: true },
  { label: 'Mixed', indeterminate: true },
  { label: 'Disabled', disabled: true },
  { label: 'Disabled checked', disabled: true, defaultChecked: true },
  { label: 'Disabled mixed', disabled: true, indeterminate: true },
  { label: 'Invalid', 'aria-invalid': true },
  { label: 'Invalid checked', 'aria-invalid': true, defaultChecked: true },
  { label: 'Invalid mixed', 'aria-invalid': true, indeterminate: true },
] as const

function CheckboxStates() {
  return (
    <div className='grid max-w-xl grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2'>
      {states.map(({ label, ...props }) => (
        <Field
          key={label}
          orientation='horizontal'
          className='min-h-11 gap-4'
          disabled={'disabled' in props && props.disabled}
        >
          <Checkbox {...props} />
          <FieldLabel className='font-normal'>{label}</FieldLabel>
        </Field>
      ))}
    </div>
  )
}

function ControlledExample() {
  const [checked, setChecked] = useState(false)
  const [mixed, setMixed] = useState(true)
  return (
    <form className='grid gap-6'>
      <Field orientation='horizontal' className='min-h-11 gap-4'>
        <Checkbox
          name='updates'
          value='email'
          checked={checked}
          indeterminate={mixed}
          onCheckedChange={(value) => {
            setChecked(value)
            setMixed(false)
          }}
        />
        <FieldLabel className='font-normal'>Email updates</FieldLabel>
      </Field>
      <Field orientation='horizontal' className='min-h-11 gap-4'>
        <Checkbox defaultChecked readOnly />
        <FieldLabel className='font-normal'>Read only</FieldLabel>
      </Field>
    </form>
  )
}

// Compare resolved colours, so these assertions follow consumer token overrides.
function tokenColour(element: HTMLElement, token: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  element.append(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Every state on a dark page, so Chromatic holds the dark treatment of each. */
export const DarkVariants: Story = {
  render: () => <CheckboxStates />,
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
    const canvas = within(canvasElement)
    for (const { label } of states) {
      await expect(canvas.getByRole('checkbox', { name: label })).toBeInTheDocument()
    }
  },
}

export const WithField: Story = {
  render: () => (
    <div className='grid max-w-md gap-8'>
      <Field orientation='horizontal' className='gap-4' invalid>
        <Checkbox defaultChecked />
        <FieldContent className='pt-1'>
          <FieldLabel className='font-normal'>Receive service updates</FieldLabel>
          <FieldDescription>Choose how we contact you about your application.</FieldDescription>
          <FieldError>Select another contact method to continue.</FieldError>
        </FieldContent>
      </Field>
      <Field orientation='horizontal' className='min-h-11 gap-4' disabled>
        <Checkbox defaultChecked />
        <FieldLabel className='font-normal'>Email is unavailable</FieldLabel>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const invalid = canvas.getByRole('checkbox', { name: 'Receive service updates' })
    await expect(invalid).toHaveAttribute('aria-invalid', 'true')
    await expect(invalid).toHaveAccessibleDescription(
      'Choose how we contact you about your application. Select another contact method to continue.',
    )
    const disabled = canvas.getByRole('checkbox', { name: 'Email is unavailable' })
    await expect(disabled).toHaveAttribute('data-disabled')
    await userEvent.click(disabled)
    await expect(disabled).toHaveAttribute('aria-checked', 'true')
    await expect(getComputedStyle(disabled).opacity).toBe('1')
  },
}

export const ControlledMixed: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Email updates' })
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    await expect(checkbox.querySelectorAll('svg')).toHaveLength(1)
    const dash = checkbox.querySelector('path')?.getAttribute('d')
    await userEvent.click(checkbox)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await expect(checkbox.querySelector('path')?.getAttribute('d')).not.toBe(dash)
    await expect(new FormData(canvasElement.querySelector('form')!).get('updates')).toBe('email')
    await userEvent.keyboard('[Space]')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await expect(new FormData(canvasElement.querySelector('form')!).has('updates')).toBe(false)
    const readOnly = canvas.getByRole('checkbox', { name: 'Read only' })
    await userEvent.click(readOnly)
    await expect(readOnly).toHaveAttribute('aria-checked', 'true')
  },
}

export const CssCheck: Story = {
  render: () => (
    <div className='grid gap-6'>
      {states.map(({ label, ...props }) => (
        <Checkbox key={label} aria-label={label} {...props} />
      ))}
      <Input aria-label='Invalid input reference' aria-invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    for (const { label } of states) {
      const checkbox = canvas.getByRole('checkbox', { name: label })
      const box = checkbox.getBoundingClientRect()
      await expect(box.width).toBe(32)
      await expect(box.height).toBe(32)
      await expect(getComputedStyle(checkbox).borderRadius).toBe('4px')
      await expect(getComputedStyle(checkbox, '::after').width).toBe('44px')
      await expect(getComputedStyle(checkbox, '::after').height).toBe('44px')
      const indicator = checkbox.querySelector<HTMLElement>('[data-slot="checkbox-indicator"]')
      if (indicator) {
        const inset = indicator.getBoundingClientRect()
        const icon = indicator.querySelector('svg')!.getBoundingClientRect()
        await expect(inset.width).toBe(22)
        await expect(inset.height).toBe(22)
        await expect(inset.x + inset.width / 2).toBe(box.x + box.width / 2)
        await expect(inset.y + inset.height / 2).toBe(box.y + box.height / 2)
        await expect(icon.width).toBe(24)
        await expect(icon.x + icon.width / 2).toBe(inset.x + inset.width / 2)
        await expect(icon.y + icon.height / 2).toBe(inset.y + inset.height / 2)
        const token = label.startsWith('Invalid')
          ? '--danger-solid'
          : label.startsWith('Disabled')
            ? '--text-subtle'
            : document.documentElement.classList.contains('dark')
              ? '--color-primary-200'
              : '--color-primary-800'
        await expect(getComputedStyle(indicator).backgroundColor).toBe(tokenColour(checkbox, token))
        await expect(getComputedStyle(indicator).color).toBe(
          tokenColour(checkbox, label.startsWith('Invalid') ? '--white' : '--surface-default'),
        )
      }
      if (label.startsWith('Invalid')) {
        await expect(getComputedStyle(checkbox).borderTopWidth).toBe('2px')
        await expect(getComputedStyle(checkbox).borderTopColor).toBe(
          getComputedStyle(input).borderTopColor,
        )
      }
    }
    const invalid = canvas.getByRole('checkbox', { name: 'Invalid checked' })
    // CSS :hover needs a real pointer; Storybook userEvent only dispatches events.
    // Establish keyboard modality, then focus the control to inspect the real ring.
    await userEvent.tab()
    invalid.focus()
    await expect(invalid).toHaveFocus()
    await expect(getComputedStyle(invalid).outlineStyle).toBe('solid')
    await expect(getComputedStyle(invalid).outlineWidth).toBe('2px')
    await expect(getComputedStyle(invalid).outlineOffset).toBe('2px')
    const focusColour = tokenColour(invalid, '--input-invalid-ring')
    await waitFor(() => expect(getComputedStyle(invalid).outlineColor).toBe(focusColour))
  },
}

export const DarkCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'dark' },
}

export const BrandThemeCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'light', themeCategory: 'brand', themePrimary: 'purple' },
}

export const DarkBrandThemeCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'dark', themeCategory: 'brand', themePrimary: 'purple' },
}

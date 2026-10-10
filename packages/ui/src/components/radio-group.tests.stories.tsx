/**
 * RadioGroup — Tests
 *
 * Stories that exist to prove something rather than to show it: the Field
 * wiring, controlled selection and form submission, geometry and colour checks
 * in light, dark and a brand theme, and a dark-mode snapshot of every state.
 * Hidden from the sidebar; they run in the Vitest suite and Chromatic.
 *
 * The fixed theme globals are why these live here: inline autodocs stories
 * share documentElement, and a story with fixed globals would repaint the
 * whole docs page as it mounted.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldItem, FieldLabel } from './field.js'
import { Input } from './input.js'
import { RadioGroup, RadioGroupItem } from './radio-group.js'

const meta = {
  title: 'Components/RadioGroup/Tests',
  component: RadioGroup,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function TopicOptions(props: ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup {...props}>
      {[
        ['government', 'NSW Government'],
        ['business', 'Business and Economy'],
        ['community', 'Community services'],
      ].map(([value, label]) => (
        <FieldItem
          key={value}
          className='flex min-h-11 items-center gap-4 text-base text-foreground has-data-disabled:text-muted-foreground'
        >
          <RadioGroupItem value={value} />
          <FieldLabel className='font-normal'>{label}</FieldLabel>
        </FieldItem>
      ))}
    </RadioGroup>
  )
}

function RadioStates() {
  return (
    <div className='grid max-w-xl gap-6'>
      {[
        { name: 'Default', disabled: false, invalid: false },
        { name: 'Disabled', disabled: true, invalid: false },
        { name: 'Invalid', disabled: false, invalid: true },
      ].map(({ name, disabled, invalid }) => (
        <Field key={name} disabled={disabled} invalid={invalid}>
          <RadioGroup aria-label={name} defaultValue='selected' className='grid-cols-2 gap-6'>
            {['unselected', 'selected'].map((value) => (
              <FieldItem
                key={value}
                className='flex min-h-11 items-center gap-4 text-base text-foreground has-data-disabled:text-muted-foreground'
              >
                <RadioGroupItem value={value} />
                <FieldLabel className='font-normal'>
                  {name} {value}
                </FieldLabel>
              </FieldItem>
            ))}
          </RadioGroup>
        </Field>
      ))}
    </div>
  )
}

function InvalidExample() {
  return (
    <Field className='max-w-xl' invalid>
      <FieldLabel>Preferred topic</FieldLabel>
      <FieldDescription>Choose the topic that best matches your enquiry.</FieldDescription>
      <TopicOptions defaultValue='business' />
      <FieldError>Select an available option to continue.</FieldError>
    </Field>
  )
}

function ControlledExample() {
  const [value, setValue] = useState('government')
  return (
    <form>
      <Field className='max-w-xl'>
        <FieldLabel>Selected topic</FieldLabel>
        <TopicOptions name='topic' value={value} onValueChange={setValue} />
      </Field>
    </form>
  )
}

function tokenColour(element: HTMLElement, token: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  element.append(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Every state on a dark page, so Chromatic holds the dark treatment of each. */
export const DarkVariants: Story = {
  render: () => <RadioStates />,
  globals: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
    const canvas = within(canvasElement)
    for (const group of ['Default', 'Disabled', 'Invalid']) {
      await expect(
        within(canvas.getByRole('radiogroup', { name: group })).getAllByRole('radio'),
      ).toHaveLength(2)
    }
  },
}

export const WithField: Story = {
  render: () => (
    <div className='grid gap-8'>
      <InvalidExample />
      <Field className='max-w-xl' disabled>
        <FieldLabel>Unavailable topic</FieldLabel>
        <TopicOptions defaultValue='government' />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const invalid = canvas.getByRole('radiogroup', { name: 'Preferred topic' })
    await expect(invalid).toHaveAttribute('aria-invalid', 'true')
    await expect(invalid).toHaveAccessibleDescription(
      'Choose the topic that best matches your enquiry. Select an available option to continue.',
    )
    for (const radio of within(invalid).getAllByRole('radio')) {
      await expect(radio).toHaveAttribute('aria-invalid', 'true')
    }
    const disabled = canvas.getByRole('radiogroup', { name: 'Unavailable topic' })
    const option = within(disabled).getByRole('radio', { name: 'Business and Economy' })
    await expect(option).toHaveAttribute('data-disabled')
    await userEvent.click(option)
    await expect(option).toHaveAttribute('aria-checked', 'false')
    await expect(getComputedStyle(option).opacity).toBe('1')
  },
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Business and Economy'))
    await expect(canvas.getByRole('radio', { name: 'Business and Economy' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(new FormData(canvasElement.querySelector('form')!).getAll('topic')).toEqual([
      'business',
    ])
  },
}

export const CssCheck: Story = {
  render: () => (
    <div className='grid gap-6'>
      <RadioStates />
      <Input aria-label='Invalid input reference' aria-invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const radio of canvas.getAllByRole('radio')) {
      const box = radio.getBoundingClientRect()
      await expect(box.width).toBe(32)
      await expect(box.height).toBe(32)
      await expect(Number.parseFloat(getComputedStyle(radio).borderRadius)).toBeGreaterThanOrEqual(
        16,
      )
      await expect(getComputedStyle(radio, '::after').width).toBe('44px')
      await expect(getComputedStyle(radio, '::after').height).toBe('44px')
      const invalid = radio.getAttribute('aria-invalid') === 'true'
      const disabled = radio.hasAttribute('data-disabled')
      const indicator = radio.querySelector<HTMLElement>('[data-slot="radio-group-indicator"]')
      if (indicator) {
        const dot = indicator.getBoundingClientRect()
        await expect(dot.width).toBe(22)
        await expect(dot.height).toBe(22)
        await expect(dot.x + dot.width / 2).toBe(box.x + box.width / 2)
        await expect(dot.y + dot.height / 2).toBe(box.y + box.height / 2)
        const token = disabled
          ? '--text-subtle'
          : invalid
            ? '--danger-solid'
            : document.documentElement.classList.contains('dark')
              ? '--color-primary-200'
              : '--color-primary-800'
        await expect(getComputedStyle(indicator).backgroundColor).toBe(tokenColour(radio, token))
      }
      if (invalid) {
        await expect(getComputedStyle(radio).borderTopWidth).toBe('2px')
        await expect(getComputedStyle(radio).borderTopColor).toBe(
          getComputedStyle(canvas.getByRole('textbox')).borderTopColor,
        )
      }
    }
    const invalid = canvas.getByRole('radio', { name: 'Invalid selected' })
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

export const DarkCssCheck: Story = { ...CssCheck, globals: { theme: 'dark' } }
export const BrandThemeCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'light', themeCategory: 'brand', themePrimary: 'purple' },
}
export const DarkBrandThemeCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'dark', themeCategory: 'brand', themePrimary: 'purple' },
}

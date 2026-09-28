import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Checkbox } from './checkbox.js'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from './field.js'
import { Input } from './input.js'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      // Inline autodocs stories share documentElement. Stories with fixed
      // globals would repaint the entire docs page as they mount.
      page: () => <CheckboxDocs />,
      description: {
        component:
          'A 32px NSW checkbox with a crisp inset tick or mixed-state dash, a 44px hit area and theme-aware ink. Base UI owns keyboard interaction, form submission and accessibility. Compose with Field and FieldLabel for a visible label; set Field invalid to share the error treatment used by Input.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Field orientation='horizontal' className='min-h-11 gap-4'>
      <Checkbox {...args} />
      <FieldLabel className='font-normal'>Accept terms</FieldLabel>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept terms' })
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(canvas.getByText('Accept terms'))
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    checkbox.focus()
    await userEvent.keyboard('[Space]')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await expect(checkbox).toHaveFocus()
  },
}

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

export const Variants: Story = {
  render: () => <CheckboxStates />,
}

export const DarkVariants: Story = {
  ...Variants,
  globals: { theme: 'dark' },
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

function CheckboxDocs() {
  return (
    <div className='max-w-3xl space-y-8 text-foreground'>
      <section className='space-y-3'>
        <h1 className='text-4xl font-bold tracking-normal'>Checkbox</h1>
        <p className='text-base text-muted-foreground'>
          Checkboxes let people select one or more options. Pair each control with a visible label.
          Use a mixed state when only some options in a group are selected.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
        <Field orientation='horizontal' className='min-h-11 gap-4'>
          <Checkbox />
          <FieldLabel className='font-normal'>Accept terms</FieldLabel>
        </Field>
        <pre className='overflow-x-auto rounded-sm bg-muted p-4 text-sm'>
          <code>{`import { Checkbox, Field, FieldLabel } from '@nswds/ui'

<Field orientation="horizontal" className="min-h-11 gap-4">
  <Checkbox name="terms" />
  <FieldLabel className="font-normal">Accept terms</FieldLabel>
</Field>`}</code>
        </pre>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>States</h2>
        <p className='text-base text-muted-foreground'>
          Use the theme toolbar to preview the selected primary palette in light or dark mode.
          Invalid controls use the same danger colours as other form elements.
        </p>
        <CheckboxStates />
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>Validation</h2>
        <Field orientation='horizontal' className='gap-4' invalid>
          <Checkbox />
          <FieldContent className='pt-1'>
            <FieldLabel className='font-normal'>Confirm the information is correct</FieldLabel>
            <FieldError>Confirm before continuing.</FieldError>
          </FieldContent>
        </Field>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>Controlled mixed state</h2>
        <p className='text-base text-muted-foreground'>
          Set indeterminate for a mixed selection. Update checked and indeterminate together in
          onCheckedChange. Base UI handles focus, Space to toggle and form submission.
        </p>
        <ControlledExample />
      </section>
    </div>
  )
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

// Compare resolved colours, so these assertions follow consumer token overrides.
function tokenColour(element: HTMLElement, token: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  element.append(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
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

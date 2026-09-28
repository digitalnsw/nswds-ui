import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldItem, FieldLabel } from './field.js'
import { Input } from './input.js'
import { RadioGroup, RadioGroupItem } from './radio-group.js'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      // Fixed-theme test stories must not repaint an inline autodocs document.
      page: () => <RadioGroupDocs />,
      description: {
        component:
          'An NSW radio group with a 32px circular control, a centred 22px selection dot and a 44px hit area. Theme and validation colours match Checkbox. Base UI owns single selection, roving focus, keyboard navigation and form submission.',
      },
    },
  },
  render: (args) => (
    <Field className='max-w-xl'>
      <FieldLabel>Topic</FieldLabel>
      <FieldDescription>Select the closest match.</FieldDescription>
      <TopicOptions defaultValue='government' {...args} />
    </Field>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('radiogroup')).toHaveAccessibleName('Topic')
    const government = canvas.getByRole('radio', { name: 'NSW Government' })
    const business = canvas.getByRole('radio', { name: 'Business and Economy' })
    await expect(government).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(canvas.getByText('Business and Economy'))
    await expect(business).toHaveAttribute('aria-checked', 'true')
    await expect(government).toHaveAttribute('aria-checked', 'false')
    business.focus()
    await userEvent.keyboard('[ArrowDown]')
    const community = canvas.getByRole('radio', { name: 'Community services' })
    await expect(community).toHaveFocus()
    await expect(community).toHaveAttribute('aria-checked', 'true')
    await expect(
      canvasElement.querySelectorAll('[role="radio"][aria-checked="true"]'),
    ).toHaveLength(1)
  },
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

export const Variants: Story = { render: () => <RadioStates /> }
export const DarkVariants: Story = { ...Variants, globals: { theme: 'dark' } }

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

function tokenColour(element: HTMLElement, token: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  element.append(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value
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

function RadioGroupDocs() {
  return (
    <div className='max-w-3xl space-y-8 text-foreground'>
      <section className='space-y-3'>
        <h1 className='text-4xl font-bold tracking-normal'>RadioGroup</h1>
        <p className='text-base text-muted-foreground'>
          Radio buttons let people select one option from a list. Give the group a label and provide
          a visible label for every option. Use arrow keys to move between options.
        </p>
      </section>
      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
        <Field>
          <FieldLabel>Topic</FieldLabel>
          <FieldDescription>Select the closest match.</FieldDescription>
          <TopicOptions />
        </Field>
        <pre className='overflow-x-auto rounded-sm bg-muted p-4 text-sm'>
          <code>{`import { Field, FieldItem, FieldLabel, RadioGroup, RadioGroupItem } from '@nswds/ui'

<Field>
  <FieldLabel>Topic</FieldLabel>
  <RadioGroup name="topic">
    <FieldItem className="flex min-h-11 items-center gap-4">
      <RadioGroupItem value="government" />
      <FieldLabel className="font-normal">NSW Government</FieldLabel>
    </FieldItem>
    <FieldItem className="flex min-h-11 items-center gap-4">
      <RadioGroupItem value="business" />
      <FieldLabel className="font-normal">Business and Economy</FieldLabel>
    </FieldItem>
  </RadioGroup>
</Field>`}</code>
        </pre>
      </section>
      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>States</h2>
        <p className='text-base text-muted-foreground'>
          The selected dot follows the primary palette in light and dark mode. Invalid controls use
          the same danger colours as Checkbox and Input. Use the theme toolbar to preview them.
        </p>
        <RadioStates />
      </section>
      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>Validation</h2>
        <InvalidExample />
      </section>
      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>Controlled selection</h2>
        <p className='text-base text-muted-foreground'>
          Pass value and onValueChange to control selection. Set name to include the selected value
          when the form is submitted.
        </p>
        <ControlledExample />
      </section>
    </div>
  )
}

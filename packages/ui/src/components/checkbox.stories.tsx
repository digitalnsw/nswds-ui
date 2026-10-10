/**
 * Checkbox — the docs page, Default, Playground and one story per docs section.
 *
 *   Components/Checkbox        → this file
 *   Components/Checkbox/Tests  → checkbox.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button.js'
import { Checkbox } from './checkbox.js'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './field.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

const stateRows = [
  {
    code: `<Checkbox indeterminate />`,
    cells: [
      { label: 'unchecked' },
      { label: 'checked', defaultChecked: true },
      { label: 'indeterminate', indeterminate: true },
    ],
  },
  {
    code: `<Checkbox disabled defaultChecked />`,
    cells: [
      { label: 'disabled', disabled: true },
      { label: 'disabled checked', disabled: true, defaultChecked: true },
      { label: 'disabled indeterminate', disabled: true, indeterminate: true },
    ],
  },
  {
    code: `<Checkbox aria-invalid defaultChecked />`,
    cells: [
      { label: 'invalid', 'aria-invalid': true },
      { label: 'invalid checked', 'aria-invalid': true, defaultChecked: true },
      { label: 'invalid indeterminate', 'aria-invalid': true, indeterminate: true },
    ],
  },
] as const

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Checked shows a tick, and <code>indeterminate</code> a dash for a parent whose options are
          only partly selected. Disabled greys the control without fading it; invalid takes
          Input&apos;s 2px danger border, and a danger fill once selected.
        </>
      }
    >
      {stateRows.map(({ code, cells }) => (
        <Example key={code} code={code}>
          {cells.map(({ label, ...props }) => (
            <ExampleCell key={label} label={label}>
              <Checkbox aria-label={`Example checkbox, ${label}`} {...props} />
            </ExampleCell>
          ))}
        </Example>
      ))}
    </ExampleSection>
  )
}

function WithFieldSection() {
  return (
    <ExampleSection
      title='With Field'
      description={
        <>
          Put the checkbox first in a horizontal <code>Field</code>, with a regular-weight label
          16px away. Pressing the label toggles the checkbox. Add a <code>FieldContent</code> for a
          hint or an error, which are announced with it.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field orientation="horizontal" className="gap-4" invalid>
  <Checkbox name="declaration" />
  <FieldContent className="pt-1">
    <FieldLabel className="font-normal">I confirm the information I have given is correct</FieldLabel>
    <FieldError>Confirm the information is correct to continue.</FieldError>
  </FieldContent>
</Field>`}
      >
        <div className='grid max-w-md gap-8'>
          <Field orientation='horizontal' className='min-h-11 gap-4'>
            <Checkbox name='updates' />
            <FieldLabel className='font-normal'>Email me about my application</FieldLabel>
          </Field>
          <Field orientation='horizontal' className='gap-4'>
            <Checkbox name='reminders' defaultChecked />
            <FieldContent className='pt-1'>
              <FieldLabel className='font-normal'>Send me appointment reminders</FieldLabel>
              <FieldDescription>We will text you two days before.</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation='horizontal' className='gap-4' invalid>
            <Checkbox name='declaration' />
            <FieldContent className='pt-1'>
              <FieldLabel className='font-normal'>
                I confirm the information I have given is correct
              </FieldLabel>
              <FieldError>Confirm the information is correct to continue.</FieldError>
            </FieldContent>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

const channels = [
  ['email', 'Email'],
  ['sms', 'Text message'],
  ['post', 'Post'],
] as const

function SelectAllExample() {
  const [selected, setSelected] = useState<string[]>(['email'])
  const all = selected.length === channels.length
  const some = selected.length > 0 && !all
  return (
    <div className='grid gap-2'>
      <Field orientation='horizontal' className='min-h-11 gap-4'>
        <Checkbox
          checked={all}
          indeterminate={some}
          onCheckedChange={(checked) => setSelected(checked ? channels.map(([v]) => v) : [])}
        />
        <FieldLabel className='font-normal'>All contact methods</FieldLabel>
      </Field>
      <div className='grid gap-2 ps-12'>
        {channels.map(([value, label]) => (
          <Field key={value} orientation='horizontal' className='min-h-11 gap-4'>
            <Checkbox
              name='contact'
              value={value}
              checked={selected.includes(value)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked ? [...current, value] : current.filter((item) => item !== value),
                )
              }
            />
            <FieldLabel className='font-normal'>{label}</FieldLabel>
          </Field>
        ))}
      </div>
    </div>
  )
}

function SelectAllSection() {
  return (
    <ExampleSection
      title='Select all'
      description={
        <>
          A parent checkbox is checked when every option is, empty when none are, and{' '}
          <code>indeterminate</code> in between. Control <code>checked</code> and{' '}
          <code>indeterminate</code> together from the options&apos; state; Base UI handles focus,
          Space to toggle and form submission.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Checkbox
  checked={all}
  indeterminate={some}
  onCheckedChange={(checked) => setSelected(checked ? allValues : [])}
/>`}
      >
        <SelectAllExample />
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A multiple-choice question: a legend asks it, a hint says how many to pick, and each option is its own horizontal Field.'
    >
      <Example layout='fill'>
        <form className='max-w-md' onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Which services do you need help with?</FieldLegend>
              <FieldDescription>Select all that apply.</FieldDescription>
              <div className='grid gap-2'>
                {[
                  ['housing', 'Housing and homelessness'],
                  ['transport', 'Transport and concessions'],
                  ['health', 'Health and mental health'],
                  ['legal', 'Legal help'],
                ].map(([value, label]) => (
                  <Field key={value} orientation='horizontal' className='min-h-11 gap-4'>
                    <Checkbox name='services' value={value} />
                    <FieldLabel className='font-normal'>{label}</FieldLabel>
                  </Field>
                ))}
              </div>
            </FieldSet>
            <div>
              <Button type='submit'>Continue</Button>
            </div>
          </FieldGroup>
        </form>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function CheckboxDocs() {
  return (
    <DocsPage
      title='Checkbox'
      npm='Checkbox'
      registry='checkbox'
      summary={
        <>
          Checkboxes let people pick any number of options, or confirm a single statement. The
          control is 32px with a 44px hit area and a crisp tick in the theme&apos;s ink. Base UI
          owns keyboard use, form submission and the <code>checkbox</code> role; pair each one with
          a visible label in a <code>Field</code>.
        </>
      }
    >
      <DocsUsage
        use={[
          'Choosing any number of options from a list — “Select all that apply”.',
          'Agreeing to a declaration or terms before continuing.',
          'A yes/no choice that is sent with the rest of a form.',
        ]}
        avoid={[
          'Only one option can be chosen — use RadioGroup.',
          'A setting that takes effect straight away — use Switch.',
          'A long list someone filters as they type — use Combobox with multiple.',
        ]}
      />
      <StatesSection />
      <WithFieldSection />
      <SelectAllSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    // Inline autodocs stories share documentElement, so stories with fixed
    // theme globals live in the Tests file, never on this page.
    docs: { page: CheckboxDocs },
  },
  args: {
    disabled: false,
    indeterminate: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Controlled checked state. Pair with onCheckedChange.',
      table: { category: 'Behavior' },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state when uncontrolled.',
      table: { category: 'Behavior' },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows the mixed-state dash, for a partly selected parent.',
      table: { category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and greys the control.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Keeps the value but prevents changing it.',
      table: { category: 'Behavior' },
    },
    required: {
      control: 'boolean',
      description: 'Must be checked before the form is submitted.',
      table: { category: 'Behavior' },
    },
    name: {
      control: 'text',
      description: 'Name submitted with the form.',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'text',
      description: 'Value submitted with the form when checked.',
      table: { category: 'Behavior' },
    },
    onCheckedChange: {
      description: 'Called with the new checked state (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Error treatment. Inside a Field, set Field invalid instead.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Field orientation='horizontal' className='min-h-11 gap-4'>
      <Checkbox {...args} />
      <FieldLabel className='font-normal'>Email me about my application</FieldLabel>
    </Field>
  ),
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Email me about my application' })
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(canvas.getByText('Email me about my application'))
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    checkbox.focus()
    await userEvent.keyboard('[Space]')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await expect(checkbox).toHaveFocus()
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const SelectAll: Story = { name: 'Select all', render: () => <SelectAllSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

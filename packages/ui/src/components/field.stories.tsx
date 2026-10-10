/**
 * Field — the docs page, Default, Playground and one story per docs section.
 *
 *   Components/Field                → this file
 *   Components/Field/Accessibility  → field.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Button } from './button.js'
import { Checkbox } from './checkbox.js'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from './field.js'
import { Input } from './input.js'
import { RadioGroup, RadioGroupItem } from './radio-group.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { Switch } from './switch.js'

const orientations = ['vertical', 'horizontal', 'responsive'] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Set <code>disabled</code> or <code>invalid</code> on the Field, not on each part: Base UI
          passes the state to the control (<code>disabled</code>, <code>aria-invalid</code>) and to
          the label, hint and error, so they can never disagree.
        </>
      }
    >
      <Example layout='grid' code={`<Field invalid>…</Field>`}>
        <ExampleCell label='default'>
          <div className='w-72'>
            <Field>
              <FieldLabel>Postcode</FieldLabel>
              <Input defaultValue='2000' />
              <FieldDescription>Your 4-digit NSW postcode.</FieldDescription>
            </Field>
          </div>
        </ExampleCell>
        <ExampleCell label='invalid'>
          <div className='w-72'>
            <Field invalid>
              <FieldLabel>Postcode</FieldLabel>
              <Input defaultValue='2OOO' />
              <FieldError>Enter a postcode with 4 numbers.</FieldError>
            </Field>
          </div>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <div className='w-72'>
            <Field disabled>
              <FieldLabel>Postcode</FieldLabel>
              <Input defaultValue='2000' />
              <FieldDescription>Taken from your verified address.</FieldDescription>
            </Field>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ErrorsSection() {
  return (
    <ExampleSection
      title='Errors'
      description={
        <>
          <code>FieldError</code> takes the message as children, or an <code>errors</code> array
          straight from a validation library. Repeated messages are removed, and two or more render
          as a list. With nothing to show it renders nothing, so it can stay mounted.
        </>
      }
    >
      <Example
        layout='grid'
        code={`<FieldError errors={[{ message: 'Enter an email address.' }, …]} />`}
      >
        <ExampleCell label='children'>
          <div className='w-72'>
            <Field invalid>
              <FieldLabel>Email address</FieldLabel>
              <Input type='email' defaultValue='alex@example' />
              <FieldError>Enter an email address in the correct format.</FieldError>
            </Field>
          </div>
        </ExampleCell>
        <ExampleCell label='errors array'>
          <div className='w-72'>
            <Field invalid>
              <FieldLabel>Create a password</FieldLabel>
              <Input type='password' defaultValue='nsw' />
              <FieldError
                errors={[
                  { message: 'Use at least 12 characters.' },
                  { message: 'Include a number.' },
                  { message: 'Use at least 12 characters.' },
                ]}
              />
            </Field>
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function OrientationSection() {
  return (
    <ExampleSection
      title='Orientation'
      description={
        <>
          <code>vertical</code> stacks the label over the control, for text fields.{' '}
          <code>horizontal</code> puts them on one line, for a checkbox or switch.{' '}
          <code>responsive</code> stacks on narrow containers and goes side by side from the{' '}
          <code>@md</code> container width — it needs a <code>FieldGroup</code> around it.
        </>
      }
    >
      <Example layout='stack' code={`<Field orientation="vertical">…</Field>`}>
        <ExampleCell label='vertical'>
          <div className='w-72'>
            <Field orientation='vertical'>
              <FieldLabel>Full name</FieldLabel>
              <Input autoComplete='name' />
            </Field>
          </div>
        </ExampleCell>
      </Example>
      <Example layout='stack' code={`<Field orientation="horizontal">…</Field>`}>
        <ExampleCell label='horizontal'>
          <Field orientation='horizontal' className='gap-4'>
            <Checkbox />
            <FieldContent className='pt-1'>
              <FieldLabel className='font-normal'>Email me about my application</FieldLabel>
              <FieldDescription>Updates are sent when your status changes.</FieldDescription>
            </FieldContent>
          </Field>
        </ExampleCell>
      </Example>
      <Example
        layout='fill'
        code={`<FieldGroup>
  <Field orientation="responsive">…</Field>
</FieldGroup>`}
      >
        <FieldGroup className='max-w-2xl'>
          <Field orientation='responsive'>
            <FieldContent>
              <FieldLabel>Business name</FieldLabel>
              <FieldDescription>As shown on your ABN registration.</FieldDescription>
            </FieldContent>
            <Input autoComplete='organization' />
          </Field>
        </FieldGroup>
      </Example>
    </ExampleSection>
  )
}

function GroupingSection() {
  return (
    <ExampleSection
      title='Grouping'
      description={
        <>
          <code>FieldSet</code> and <code>FieldLegend</code> give related questions one name that
          screen readers announce with each of them. <code>FieldGroup</code> spaces a run of fields
          evenly, and <code>FieldSeparator</code> breaks a long one into parts, with or without a
          label.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<FieldSet>
  <FieldLegend>Your contact details</FieldLegend>
  <FieldGroup>
    <Field>…</Field>
    <FieldSeparator>Postal address</FieldSeparator>
    <Field>…</Field>
  </FieldGroup>
</FieldSet>`}
      >
        <FieldSet className='w-full max-w-md'>
          <FieldLegend>Your contact details</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>Email address</FieldLabel>
              <Input type='email' autoComplete='email' />
            </Field>
            <Field>
              <FieldLabel>Mobile number</FieldLabel>
              <Input type='tel' autoComplete='tel' />
            </Field>
            <FieldSeparator>Postal address</FieldSeparator>
            <Field>
              <FieldLabel>Street address</FieldLabel>
              <Input autoComplete='street-address' />
            </Field>
            <Field>
              <FieldLabel>Postcode</FieldLabel>
              <Input inputMode='numeric' autoComplete='postal-code' className='max-w-32' />
            </Field>
          </FieldGroup>
        </FieldSet>
      </Example>
    </ExampleSection>
  )
}

function OptionsSection() {
  return (
    <ExampleSection
      title='Options'
      description={
        <>
          A radio group is one question with one Field. Wrap each option and its{' '}
          <code>FieldLabel</code> in <code>FieldItem</code>, so every option gets its own label
          while the group keeps the Field&apos;s label, hint and validation.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field>
  <FieldLabel>How should we contact you?</FieldLabel>
  <RadioGroup>
    <FieldItem className="flex min-h-11 items-center gap-4">
      <RadioGroupItem value="email" />
      <FieldLabel className="font-normal">Email</FieldLabel>
    </FieldItem>
    …
  </RadioGroup>
</Field>`}
      >
        <Field className='max-w-md'>
          <FieldLabel>How should we contact you?</FieldLabel>
          <FieldDescription>We will only use this for your application.</FieldDescription>
          <RadioGroup defaultValue='email'>
            {[
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['post', 'Post'],
            ].map(([value, label]) => (
              <FieldItem key={value} className='flex min-h-11 items-center gap-4'>
                <RadioGroupItem value={value} />
                <FieldLabel className='font-normal'>{label}</FieldLabel>
              </FieldItem>
            ))}
          </RadioGroup>
        </Field>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='One step of an application: a legend for the step, text fields stacked, and a horizontal Field for the setting at the end.'
    >
      <Example layout='fill'>
        <form className='max-w-md' onSubmit={(event) => event.preventDefault()}>
          <FieldSet>
            <FieldLegend>About you</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Full name</FieldLabel>
                <Input autoComplete='name' />
                <FieldDescription>As it appears on your photo ID.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Date of birth</FieldLabel>
                <Input type='date' autoComplete='bday' className='max-w-48' />
              </Field>
              <Field orientation='horizontal' className='justify-between gap-6'>
                <FieldContent>
                  <FieldLabel>Text me reminders</FieldLabel>
                  <FieldDescription>Two days before your appointment.</FieldDescription>
                </FieldContent>
                <Switch defaultChecked />
              </Field>
              <div>
                <Button type='submit'>Continue</Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function FieldDocs() {
  return (
    <DocsPage
      title='Field'
      npm={[
        'Field',
        'FieldLabel',
        'FieldDescription',
        'FieldError',
        'FieldContent',
        'FieldItem',
        'FieldSet',
        'FieldLegend',
        'FieldGroup',
        'FieldSeparator',
        'FieldTitle',
      ]}
      registry='field'
      summary={
        <>
          Field puts a form control together with its label, hint and error. It wraps Base UI&apos;s
          Field, so the label is associated with the control and the hint and error are announced
          with it — no <code>id</code>, <code>htmlFor</code> or <code>aria-describedby</code> to
          keep in step. Its companions group fields into sets and sections.
        </>
      }
    >
      <DocsUsage
        use={[
          'Every form control that takes an answer: Input, Textarea, Select, Checkbox, RadioGroup, Switch.',
          'Showing a hint and a validation error that screen readers announce with the control.',
          'Grouping related questions under one legend with FieldSet.',
        ]}
        avoid={[
          'A unit, icon or button belongs inside the control’s border — use InputGroup inside the Field.',
          'Showing answers back for checking, not collecting them — use DescriptionList.',
          'Naming a control that sits outside any form layout — Label alone is enough.',
        ]}
      />
      <StatesSection />
      <ErrorsSection />
      <OrientationSection />
      <GroupingSection />
      <OptionsSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: FieldDocs },
  },
  args: {
    orientation: 'vertical',
    disabled: false,
    invalid: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: orientations,
      description: 'Layout of the label, control and description within the field.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description: 'Typically FieldLabel, a control, FieldDescription and FieldError.',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the control and dims the label, hint and error with it.',
      table: { category: 'Behavior' },
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the control aria-invalid and shows the error treatment.',
      table: { category: 'Behavior' },
    },
    name: {
      control: 'text',
      description: 'Name of the field, used for form submission and validation.',
      table: { category: 'Behavior' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div className='max-w-md'>
      <Field {...args}>
        <FieldLabel>Email address</FieldLabel>
        <Input type='email' autoComplete='email' />
        <FieldDescription>We will send your confirmation here.</FieldDescription>
      </Field>
    </div>
  ),
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const field = canvasElement.querySelector('[data-slot="field"]')
    await expect(field).toHaveAttribute('data-orientation', args.orientation)
    await expect(canvasElement.querySelector('input')).toHaveAccessibleName('Email address')
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Errors: Story = { name: 'Errors', render: () => <ErrorsSection /> }

export const Orientation: Story = { name: 'Orientation', render: () => <OrientationSection /> }

export const Grouping: Story = { name: 'Grouping', render: () => <GroupingSection /> }

export const Options: Story = { name: 'Options', render: () => <OptionsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

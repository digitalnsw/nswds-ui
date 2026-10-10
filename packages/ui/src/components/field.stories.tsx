/**
 * Field — the docs page, Default and Playground.
 *
 *   Components/Field                → this file
 *   Components/Field/Features       → field.features.stories.tsx
 *   Components/Field/Accessibility  → field.accessibility.stories.tsx
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
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
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description={
        <>
          A <code>FieldLabel</code>, the control and a <code>FieldDescription</code>, stacked with
          the form&apos;s standard spacing.
        </>
      }
    >
      <Example
        code={`<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" placeholder="you@example.com" />
  <FieldDescription>We'll never share your email.</FieldDescription>
</Field>`}
      >
        <div className='w-full max-w-sm'>
          <Field>
            <FieldLabel htmlFor='field-docs-default'>Email</FieldLabel>
            <Input id='field-docs-default' type='email' placeholder='you@example.com' />
            <FieldDescription>We&apos;ll never share your email.</FieldDescription>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function StatesSection() {
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

export function ErrorsSection() {
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

export function OrientationsSection() {
  return (
    <ExampleSection
      title='Orientations'
      description={
        <>
          <code>vertical</code> stacks the label over the control, for text fields.{' '}
          <code>horizontal</code> puts them on one line, for a checkbox or switch.{' '}
          <code>responsive</code> stacks on narrow containers and goes side by side from the{' '}
          <code>@md</code> container width of the <code>FieldGroup</code> around it, so put one
          around it.
        </>
      }
    >
      <Example layout='stack' code={`<Field orientation="horizontal">…</Field>`}>
        <div className='grid w-full gap-8'>
          {orientations.map((orientation) => (
            <div key={orientation} className='grid gap-3'>
              <p className='text-base font-semibold'>{orientation}</p>
              <Field orientation={orientation}>
                <FieldLabel htmlFor={`field-docs-${orientation}`}>Email</FieldLabel>
                <Input
                  id={`field-docs-${orientation}`}
                  type='email'
                  placeholder='you@example.com'
                />
                <FieldDescription>We&apos;ll never share your email.</FieldDescription>
              </Field>
            </div>
          ))}
        </div>
      </Example>
      <Example
        layout='stack'
        code={`<Field orientation="horizontal" className="gap-4">
  <Checkbox />
  <FieldContent className="pt-1">
    <FieldLabel className="font-normal">Email me about my application</FieldLabel>
    <FieldDescription>Updates are sent when your status changes.</FieldDescription>
  </FieldContent>
</Field>

<FieldGroup>
  <Field orientation="responsive">…</Field>
</FieldGroup>`}
      >
        <div className='grid w-full gap-8'>
          <div className='grid gap-3'>
            <p className='text-base font-semibold'>horizontal, with a checkbox</p>
            <Field orientation='horizontal' className='gap-4'>
              <Checkbox />
              <FieldContent className='pt-1'>
                <FieldLabel className='font-normal'>Email me about my application</FieldLabel>
                <FieldDescription>Updates are sent when your status changes.</FieldDescription>
              </FieldContent>
            </Field>
          </div>
          <div className='grid gap-3'>
            <p className='text-base font-semibold'>responsive, inside a FieldGroup</p>
            <FieldGroup className='max-w-2xl'>
              <Field orientation='responsive'>
                <FieldContent>
                  <FieldLabel>Business name</FieldLabel>
                  <FieldDescription>As shown on your ABN registration.</FieldDescription>
                </FieldContent>
                <Input autoComplete='organization' />
              </Field>
            </FieldGroup>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function GroupingSection() {
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

export function OptionsSection() {
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

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='One step of an application: a legend for the step, text fields stacked, and a horizontal Field for the setting at the end.'
    >
      <Example
        layout='fill'
        code={`<FieldSet>
  <FieldLegend>About you</FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel>Full name</FieldLabel>
      <Input autoComplete="name" />
      <FieldDescription>As it appears on your photo ID.</FieldDescription>
    </Field>
    …
    <Field orientation="horizontal" className="justify-between gap-6">
      <FieldContent>
        <FieldLabel>Text me reminders</FieldLabel>
        <FieldDescription>Two days before your appointment.</FieldDescription>
      </FieldContent>
      <Switch defaultChecked />
    </Field>
  </FieldGroup>
</FieldSet>`}
      >
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
          Field is a composition wrapper that groups a form control with its label, helper
          description, and error message. It standardises spacing and orientation so every input in
          a form shares a consistent vertical rhythm and label-to-control relationship. It wraps
          Base UI&apos;s Field, so the label is associated with the control and the hint and error
          are announced with it — no <code>id</code>, <code>htmlFor</code> or{' '}
          <code>aria-describedby</code> to keep in step. Its companions group fields into sets and
          sections.
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
      <DefaultSection />
      <OrientationsSection />
      <StatesSection />
      <ErrorsSection />
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
  excludeStories: /Section$/,
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

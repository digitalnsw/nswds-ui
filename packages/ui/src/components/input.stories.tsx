/**
 * Input — the docs page, Default, Playground and one story per docs section.
 *
 *   Components/Input                → this file
 *   Components/Input/Accessibility  → input.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Button } from './button.js'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from './field.js'
import { Input } from './input.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const types = [
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'file',
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

// The forced focus ring uses the same token the component paints on
// :focus-visible, so the specimen shows the real ring without stealing focus.
const forcedFocus = 'outline outline-2 outline-offset-2 outline-(--input-ring)'

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          The field shifts to the sunken surface on hover and draws a 2px ring on focus. An invalid
          field takes a 2px danger border — set <code>aria-invalid</code>, or let{' '}
          <code>Field invalid</code> set it for you. Prefer read-only over disabled when people
          still need to read or copy the value.
        </>
      }
    >
      <Example layout='grid' code={`<Input aria-invalid defaultValue="2OOO" />`}>
        <ExampleCell label='empty'>
          <div className='w-72'>
            <Input aria-label='Postcode, empty' />
          </div>
        </ExampleCell>
        <ExampleCell label='filled'>
          <div className='w-72'>
            <Input aria-label='Postcode, filled' defaultValue='2000' />
          </div>
        </ExampleCell>
        <ExampleCell label='focus'>
          <div className='w-72'>
            <Input aria-label='Postcode, focused' defaultValue='2000' className={forcedFocus} />
          </div>
        </ExampleCell>
        <ExampleCell label='invalid'>
          <div className='w-72'>
            <Input aria-label='Postcode, invalid' aria-invalid defaultValue='2OOO' />
          </div>
        </ExampleCell>
        <ExampleCell label='readOnly'>
          <div className='w-72'>
            <Input aria-label='Postcode, read only' readOnly defaultValue='2000' />
          </div>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <div className='w-72'>
            <Input aria-label='Postcode, disabled' disabled defaultValue='2000' />
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

const typeSpecimens: Record<(typeof types)[number], { label: string; value?: string }> = {
  text: { label: 'Full name', value: 'Alex Citizen' },
  email: { label: 'Email address', value: 'alex@example.com' },
  password: { label: 'Password', value: 'correct-horse' },
  search: { label: 'Search NSW Government', value: 'Driver licence' },
  tel: { label: 'Mobile number', value: '0400 000 000' },
  url: { label: 'Business website', value: 'https://www.nsw.gov.au' },
  number: { label: 'Number of people in your household', value: '3' },
  date: { label: 'Date of birth', value: '1990-07-14' },
  file: { label: 'Upload your proof of address' },
}

function TypesSection() {
  return (
    <ExampleSection
      title='Types'
      description={
        <>
          Use the HTML <code>type</code> that matches the answer: it brings up the right keyboard on
          phones, and the browser can check and autofill the value. Every type keeps the same
          height, border and focus ring.
        </>
      }
    >
      <Example layout='grid' code={`<Input type="tel" autoComplete="tel" />`}>
        {types.map((type) => (
          <ExampleCell key={type} label={type}>
            <div className='w-72'>
              <Input
                type={type}
                aria-label={typeSpecimens[type].label}
                defaultValue={typeSpecimens[type].value}
              />
            </div>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function WithFieldSection() {
  return (
    <ExampleSection
      title='With Field'
      description={
        <>
          Give every input a visible label. Inside a <code>Field</code>, <code>FieldLabel</code>,{' '}
          <code>FieldDescription</code> and <code>FieldError</code> are wired to the input for you —
          no <code>id</code>, <code>htmlFor</code> or <code>aria-describedby</code> to keep in step.
          A placeholder is not a label: it disappears as soon as someone types.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field invalid>
  <FieldLabel>Postcode</FieldLabel>
  <Input inputMode="numeric" autoComplete="postal-code" />
  <FieldDescription>Your 4-digit NSW postcode.</FieldDescription>
  <FieldError>Enter a postcode with 4 numbers, like 2000.</FieldError>
</Field>`}
      >
        <div className='grid w-full max-w-sm gap-8'>
          <Field>
            <FieldLabel>Postcode</FieldLabel>
            <Input inputMode='numeric' autoComplete='postal-code' />
            <FieldDescription>Your 4-digit NSW postcode.</FieldDescription>
          </Field>
          <Field invalid>
            <FieldLabel>Postcode</FieldLabel>
            <Input inputMode='numeric' autoComplete='postal-code' defaultValue='2OOO' />
            <FieldDescription>Your 4-digit NSW postcode.</FieldDescription>
            <FieldError>Enter a postcode with 4 numbers, like 2000.</FieldError>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          A contact details step. Each field states its purpose with <code>autoComplete</code>, so
          browsers and password managers can fill it in.
        </>
      }
    >
      <Example layout='fill'>
        <form className='max-w-md' onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel>Full name</FieldLabel>
              <Input autoComplete='name' />
            </Field>
            <Field>
              <FieldLabel>Email address</FieldLabel>
              <Input type='email' autoComplete='email' />
              <FieldDescription>We will send your confirmation here.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Mobile number</FieldLabel>
              <Input type='tel' autoComplete='tel' />
            </Field>
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

function InputDocs() {
  return (
    <DocsPage
      title='Input'
      npm='Input'
      registry='input'
      summary={
        <>
          A single-line text field for short, free-form answers such as a name, an email address or
          a postcode. It is 48px tall, takes its colours from the shared <code>--input-*</code>{' '}
          tokens, and works with <code>Field</code> for its label, hint and error.
        </>
      }
    >
      <DocsUsage
        use={[
          'Short answers someone types: a name, an email address, a phone number, a postcode.',
          'A search box, with a visible label or an aria-label.',
          'A number or date where typing is quicker than picking.',
        ]}
        avoid={[
          'The answer runs to more than one line — use Textarea.',
          'The answer comes from a known list — use Select, NativeSelect or Combobox.',
          'A unit, icon or button belongs inside the border — use InputGroup.',
          'A one-time verification code — use InputOTP.',
        ]}
      />
      <StatesSection />
      <TypesSection />
      <WithFieldSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: InputDocs },
  },
  args: {
    type: 'email',
    'aria-label': 'Email address',
    autoComplete: 'email',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: types,
      description:
        'Native HTML input type — controls the mobile keyboard, parsing and browser validation.',
      table: { category: 'Behavior' },
    },
    placeholder: {
      control: 'text',
      description: 'Example text shown while the input is empty. Never a substitute for a label.',
      table: { category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial uncontrolled value of the input.',
      table: { category: 'Content' },
    },
    value: {
      control: 'text',
      description: 'Controlled value of the input. Pair with onChange.',
      table: { category: 'Content' },
    },
    autoComplete: {
      control: 'text',
      description: 'The purpose of the field (name, email, tel, postal-code…), for autofill.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables typing and applies disabled styles; the field is skipped in tab order.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents editing while still allowing focus, selection and copy.',
      table: { category: 'Behavior' },
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required for native form submission.',
      table: { category: 'Behavior' },
    },
    onChange: {
      description: 'Change handler fired on every keystroke (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Applies the 2px danger border to indicate a validation failure.',
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name, when there is no associated visible label.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div className='max-w-sm'>
      <Input {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')
    await expect(input).toHaveAccessibleName('Email address')
    await expect(input).toHaveAttribute('data-slot', 'input')
    await expect(input).toHaveAttribute('data-type', 'email')
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const Types: Story = { name: 'Types', render: () => <TypesSection /> }

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

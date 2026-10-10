/**
 * Label — the docs page, Default, Playground and one story per docs section.
 *
 *   Components/Label                → this file
 *   Components/Label/Accessibility  → label.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Checkbox } from './checkbox.js'
import { Input } from './input.js'
import { Label } from './label.js'
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

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          A label dims with its control. It follows an ancestor marked <code>group</code> with{' '}
          <code>data-disabled=&quot;true&quot;</code> — the pattern <code>Field</code> uses — or a
          disabled <code>peer</code> control placed before it.
        </>
      }
    >
      <Example
        layout='grid'
        code={`<div data-disabled="true" className="group grid gap-2">
  <Label htmlFor="licence">Licence number</Label>
  <Input id="licence" disabled />
</div>`}
      >
        <ExampleCell label='default'>
          <div className='grid w-72 gap-2'>
            <Label htmlFor='label-states-default'>Licence number</Label>
            <Input id='label-states-default' defaultValue='12345678' />
          </div>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <div data-disabled='true' className='group grid w-72 gap-2'>
            <Label htmlFor='label-states-disabled'>Licence number</Label>
            <Input id='label-states-disabled' disabled defaultValue='12345678' />
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function NamingAControlSection() {
  return (
    <ExampleSection
      title='Naming a control'
      description={
        <>
          Point <code>htmlFor</code> at the control&apos;s <code>id</code>, or wrap the control in
          the label. Either way the label becomes the control&apos;s accessible name, and clicking
          it focuses or toggles the control.
        </>
      }
    >
      <Example
        code={`<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" />`}
      >
        <ExampleCell label='htmlFor'>
          <div className='grid w-72 gap-2'>
            <Label htmlFor='label-naming-email'>Email address</Label>
            <Input id='label-naming-email' type='email' autoComplete='email' />
          </div>
        </ExampleCell>
      </Example>
      <Example
        code={`<Label className="gap-4 font-normal">
  <Checkbox name="updates" />
  Email me about my application
</Label>`}
      >
        <ExampleCell label='wrapping'>
          <Label className='gap-4 font-normal'>
            <Checkbox name='updates' />
            Email me about my application
          </Label>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function OptionalFieldsSection() {
  return (
    <ExampleSection
      title='Optional fields'
      description={
        <>
          Ask only for what the service needs, and mark the exceptions. Write
          &ldquo;(optional)&rdquo; in the label text itself, so everyone hears it with the name.
        </>
      }
    >
      <Example code={`<Label htmlFor="middle-name">Middle name (optional)</Label>`}>
        <div className='grid w-72 gap-2'>
          <Label htmlFor='label-optional-middle'>Middle name (optional)</Label>
          <Input id='label-optional-middle' autoComplete='additional-name' />
        </div>
      </Example>
    </ExampleSection>
  )
}

function LongLabelsSection() {
  return (
    <ExampleSection
      title='Long labels'
      description='Labels wrap onto as many lines as they need. Keep them short, but never truncate one: the hidden words are often the ones that matter.'
    >
      <Example
        code={`<Label htmlFor="abn">Australian Business Number (ABN) of the business…</Label>`}
      >
        <div className='grid w-72 gap-2'>
          <Label htmlFor='label-long-abn'>
            Australian Business Number (ABN) of the business making the application
          </Label>
          <Input id='label-long-abn' inputMode='numeric' />
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function LabelDocs() {
  return (
    <DocsPage
      title='Label'
      npm='Label'
      registry='label'
      summary={
        <>
          Label names a form control. Point it at the control with <code>htmlFor</code>, or wrap the
          control in it, and the text becomes the control&apos;s accessible name. Inside a{' '}
          <code>Field</code>, use <code>FieldLabel</code> — it renders this Label and does the
          association for you.
        </>
      }
    >
      <DocsUsage
        use={[
          'Naming a single control that sits outside a Field.',
          'Wrapping a Checkbox or Switch so its text is part of the target.',
          'Building your own field layout where Field does not fit.',
        ]}
        avoid={[
          'The control is inside a Field — use FieldLabel.',
          'Naming a group of controls, such as radio options — use FieldLegend in a FieldSet.',
          'A heading for a section of a form — use a heading, or FieldLegend.',
        ]}
      />
      <StatesSection />
      <NamingAControlSection />
      <OptionalFieldsSection />
      <LongLabelsSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: LabelDocs },
  },
  args: {
    children: 'Email address',
    htmlFor: 'label-default-input',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text shown to the user — and the control’s accessible name.',
      table: { category: 'Content' },
    },
    htmlFor: {
      control: 'text',
      description: 'The id of the control this label names.',
      table: { category: 'Accessibility' },
    },
    id: {
      control: 'text',
      description: 'Optional id for the label, when another element references it.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div className='grid max-w-sm gap-2'>
      <Label {...args} />
      {args.htmlFor ? <Input id={args.htmlFor} type='email' autoComplete='email' /> : null}
    </div>
  ),
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const label = canvasElement.querySelector('[data-slot="label"]')
    await expect(label).toHaveTextContent('Email address')
    await expect(label).toHaveAttribute('for', args.htmlFor)
    await expect(canvasElement.querySelector('input')).toHaveAccessibleName('Email address')
  },
}

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const NamingAControl: Story = {
  name: 'Naming a control',
  render: () => <NamingAControlSection />,
}

export const OptionalFields: Story = {
  name: 'Optional fields',
  render: () => <OptionalFieldsSection />,
}

export const LongLabels: Story = { name: 'Long labels', render: () => <LongLabelsSection /> }

/**
 * RadioGroup — the docs page, Default, Playground and one story per docs section.
 *
 *   Components/RadioGroup        → this file
 *   Components/RadioGroup/Tests  → radio-group.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button.js'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldItem,
  FieldLabel,
} from './field.js'
import { RadioGroup, RadioGroupItem } from './radio-group.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const optionClassName =
  'flex min-h-11 items-center gap-4 text-base text-foreground has-data-disabled:text-muted-foreground'

function TopicOptions(props: ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup {...props}>
      {[
        ['government', 'NSW Government'],
        ['business', 'Business and Economy'],
        ['community', 'Community services'],
      ].map(([value, label]) => (
        <FieldItem key={value} className={optionClassName}>
          <RadioGroupItem value={value} />
          <FieldLabel className='font-normal'>{label}</FieldLabel>
        </FieldItem>
      ))}
    </RadioGroup>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

const stateRows = [
  { code: `<RadioGroupItem value="email" />`, label: '', group: {} },
  { code: `<RadioGroup disabled>…</RadioGroup>`, label: 'disabled', group: { disabled: true } },
  { code: `<RadioGroupItem value="email" aria-invalid />`, label: 'invalid', group: {} },
] as const

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          The selected option shows a solid dot in the theme&apos;s ink. Disable one item, the whole
          group, or the surrounding <code>Field</code>; an invalid group takes Input&apos;s 2px
          danger border and a danger dot.
        </>
      }
    >
      {stateRows.map(({ code, label, group }) => (
        <Example key={code} code={code}>
          {(['unselected', 'selected'] as const).map((selection) => {
            const name = label ? `${label} ${selection}` : selection
            return (
              <ExampleCell key={selection} label={name}>
                <RadioGroup
                  aria-label={`Contact method, ${name}`}
                  defaultValue={selection === 'selected' ? 'email' : undefined}
                  {...group}
                >
                  <RadioGroupItem
                    value='email'
                    aria-label='Email'
                    aria-invalid={label === 'invalid' || undefined}
                  />
                </RadioGroup>
              </ExampleCell>
            )
          })}
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
          The group is one question, so it takes one <code>Field</code>: the <code>FieldLabel</code>{' '}
          names the group, and <code>Field invalid</code> or <code>disabled</code> reaches every
          option. Wrap each option in <code>FieldItem</code> so its own label is associated with it.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field invalid>
  <FieldLabel>Preferred topic</FieldLabel>
  <FieldDescription>Choose the topic that best matches your enquiry.</FieldDescription>
  <RadioGroup>
    <FieldItem className="flex min-h-11 items-center gap-4">
      <RadioGroupItem value="government" />
      <FieldLabel className="font-normal">NSW Government</FieldLabel>
    </FieldItem>
    …
  </RadioGroup>
  <FieldError>Select a topic to continue.</FieldError>
</Field>`}
      >
        <div className='grid w-full max-w-md gap-10'>
          <Field invalid>
            <FieldLabel>Preferred topic</FieldLabel>
            <FieldDescription>Choose the topic that best matches your enquiry.</FieldDescription>
            <TopicOptions />
            <FieldError>Select a topic to continue.</FieldError>
          </Field>
          <Field disabled>
            <FieldLabel>Topic</FieldLabel>
            <FieldDescription>Fixed for this type of enquiry.</FieldDescription>
            <TopicOptions defaultValue='government' />
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

function OptionsWithHintsSection() {
  return (
    <ExampleSection
      title='Options with hints'
      description={
        <>
          When an option needs explaining, put its label and a <code>FieldDescription</code> in a{' '}
          <code>FieldContent</code> beside the radio. The hint is announced with that option.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<FieldItem className="flex items-start gap-4">
  <RadioGroupItem value="online" />
  <FieldContent className="pt-1">
    <FieldLabel className="font-normal">Online</FieldLabel>
    <FieldDescription>Get a decision in about 10 minutes.</FieldDescription>
  </FieldContent>
</FieldItem>`}
      >
        <Field className='max-w-md'>
          <FieldLabel>How do you want to apply?</FieldLabel>
          <RadioGroup defaultValue='online'>
            {[
              ['online', 'Online', 'Get a decision in about 10 minutes.'],
              ['centre', 'At a service centre', 'Bring your documents to any Service NSW centre.'],
              ['post', 'By post', 'Allow up to 4 weeks for a decision.'],
            ].map(([value, label, hint]) => (
              <FieldItem key={value} className='flex items-start gap-4'>
                <RadioGroupItem value={value} />
                <FieldContent className='pt-1'>
                  <FieldLabel className='font-normal'>{label}</FieldLabel>
                  <FieldDescription>{hint}</FieldDescription>
                </FieldContent>
              </FieldItem>
            ))}
          </RadioGroup>
        </Field>
      </Example>
    </ExampleSection>
  )
}

function ControlledExample() {
  const [value, setValue] = useState('business')
  const labels: Record<string, string> = {
    government: 'NSW Government',
    business: 'Business and Economy',
    community: 'Community services',
  }
  return (
    <Field className='max-w-md'>
      <FieldLabel>Topic</FieldLabel>
      <TopicOptions name='topic' value={value} onValueChange={(next) => setValue(String(next))} />
      <FieldDescription>We will send your enquiry to the {labels[value]} team.</FieldDescription>
    </Field>
  )
}

function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          Pass <code>value</code> and <code>onValueChange</code> to drive the selection from your
          own state — here, to update the hint. Set <code>name</code> so the selected value is
          submitted with the form.
        </>
      }
    >
      <Example
        layout='stack'
        code={`const [topic, setTopic] = useState('business')

<RadioGroup name="topic" value={topic} onValueChange={setTopic}>…</RadioGroup>`}
      >
        <ControlledExample />
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='One question on a page: the label asks it, the options answer it, and the form moves on.'
    >
      <Example layout='fill'>
        <form className='max-w-md' onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel>Have you held a NSW driver licence before?</FieldLabel>
              <RadioGroup name='previous-licence'>
                {[
                  ['yes', 'Yes'],
                  ['no', 'No'],
                ].map(([value, label]) => (
                  <FieldItem key={value} className={optionClassName}>
                    <RadioGroupItem value={value} />
                    <FieldLabel className='font-normal'>{label}</FieldLabel>
                  </FieldItem>
                ))}
              </RadioGroup>
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

function RadioGroupDocs() {
  return (
    <DocsPage
      title='RadioGroup'
      npm={['RadioGroup', 'RadioGroupItem']}
      registry='radio-group'
      summary={
        <>
          Radio buttons let people choose exactly one option from a short list. Each is a 32px
          circle with a 44px hit area and a solid dot when selected. Base UI owns single selection,
          arrow-key movement and form submission; give the group a label in a <code>Field</code> and
          every option a visible label of its own.
        </>
      }
    >
      <DocsUsage
        use={[
          'Choosing exactly one answer from two to about seven options.',
          'Yes/no questions where both answers need to be stated.',
          'Options that each need a short explanation beside them.',
        ]}
        avoid={[
          'People can choose more than one — use Checkbox.',
          'There are many options, or space is tight — use Select or NativeSelect.',
          'The choice switches a view straight away — use Tabs or ToggleGroup.',
        ]}
      />
      <StatesSection />
      <WithFieldSection />
      <OptionsWithHintsSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    // Inline autodocs stories share documentElement, so stories with fixed
    // theme globals live in the Tests file, never on this page.
    docs: { page: RadioGroupDocs },
  },
  args: {
    defaultValue: 'government',
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled selected value. Pair with onValueChange.',
      table: { category: 'Behavior' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initially selected value when uncontrolled.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every option in the group.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Keeps the selection but prevents changing it.',
      table: { category: 'Behavior' },
    },
    required: {
      control: 'boolean',
      description: 'An option must be selected before the form is submitted.',
      table: { category: 'Behavior' },
    },
    name: {
      control: 'text',
      description: 'Name submitted with the form.',
      table: { category: 'Behavior' },
    },
    onValueChange: {
      description: 'Called with the newly selected value (logged in the Actions panel).',
      table: { category: 'Events' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Field className='max-w-md'>
      <FieldLabel>Topic</FieldLabel>
      <FieldDescription>Select the closest match.</FieldDescription>
      <TopicOptions {...args} />
    </Field>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

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

export const Playground: Story = {}

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

export const OptionsWithHints: Story = {
  name: 'Options with hints',
  render: () => <OptionsWithHintsSection />,
}

export const Controlled: Story = { name: 'Controlled', render: () => <ControlledSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

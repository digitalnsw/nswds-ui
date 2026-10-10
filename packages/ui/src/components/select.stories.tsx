/**
 * Select — the docs page, Default, Playground and one story per docs section.
 *
 *   Components/Select        → this file
 *   Components/Select/Tests  → select.tests.stories.tsx
 *
 * Built on the Base UI Select primitive: the trigger renders in the canvas, but
 * the option list is PORTALED to document.body, so it must be queried there.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Field, FieldDescription, FieldError, FieldLabel } from './field.js'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const states = [
  ['nsw', 'New South Wales'],
  ['act', 'Australian Capital Territory'],
  ['vic', 'Victoria'],
  ['qld', 'Queensland'],
  ['sa', 'South Australia'],
  ['wa', 'Western Australia'],
  ['tas', 'Tasmania'],
  ['nt', 'Northern Territory'],
] as const

// Maps each value to its label, so the closed trigger shows the label rather
// than the raw value before the popup has mounted its items.
const stateItems = Object.fromEntries(states)

function StateItems() {
  return (
    <>
      {states.map(([value, label]) => (
        <SelectItem key={value} value={value}>
          {label}
        </SelectItem>
      ))}
    </>
  )
}

const centreItems = {
  parramatta: 'Parramatta',
  penrith: 'Penrith',
  liverpool: 'Liverpool',
  dubbo: 'Dubbo',
  tamworth: 'Tamworth',
  wagga: 'Wagga Wagga',
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          <code>default</code> is the bordered field that matches Input. <code>filled</code> is a
          borderless tinted band that shows its border on hover, for filters and toolbars where a
          row of boxed fields would be heavy.
        </>
      }
    >
      <Example code={`<SelectTrigger variant="filled">…</SelectTrigger>`}>
        {(['default', 'filled'] as const).map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <Select items={stateItems} defaultValue='nsw'>
              <SelectTrigger
                variant={variant}
                className='w-72'
                aria-label={`State or territory (${variant})`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <StateItems />
              </SelectContent>
            </Select>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          <code>default</code> is 48px, level with Input. <code>sm</code> is 40px, for dense
          filters; keep it out of forms people fill in.
        </>
      }
    >
      <Example code={`<SelectTrigger size="sm">…</SelectTrigger>`}>
        {(['default', 'sm'] as const).map((size) => (
          <ExampleCell key={size} label={size}>
            <Select items={stateItems} defaultValue='nsw'>
              <SelectTrigger
                size={size}
                className='w-72'
                aria-label={`State or territory (${size})`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <StateItems />
              </SelectContent>
            </Select>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          With nothing chosen, the trigger shows the <code>SelectValue</code> placeholder in the
          muted ink. Invalid takes Input&apos;s 2px danger border and focus ring; disabled fades the
          trigger and stops it opening.
        </>
      }
    >
      <Example code={`<SelectValue placeholder="Select a state or territory" />`}>
        <ExampleCell label='placeholder'>
          <Select items={stateItems}>
            <SelectTrigger className='w-72' aria-label='State or territory (placeholder)'>
              <SelectValue placeholder='Select a state or territory' />
            </SelectTrigger>
            <SelectContent>
              <StateItems />
            </SelectContent>
          </Select>
        </ExampleCell>
        <ExampleCell label='invalid'>
          <Select items={stateItems}>
            <SelectTrigger aria-invalid className='w-72' aria-label='State or territory (invalid)'>
              <SelectValue placeholder='Select a state or territory' />
            </SelectTrigger>
            <SelectContent>
              <StateItems />
            </SelectContent>
          </Select>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <Select items={stateItems} defaultValue='nsw' disabled>
            <SelectTrigger className='w-72' aria-label='State or territory (disabled)'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <StateItems />
            </SelectContent>
          </Select>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function GroupedOptionsSection() {
  return (
    <ExampleSection
      title='Grouped options'
      description={
        <>
          <code>SelectGroup</code> and <code>SelectLabel</code> sort a long list under headings;{' '}
          <code>SelectSeparator</code> draws a hairline between groups.
        </>
      }
    >
      <Example
        code={`<SelectGroup>
  <SelectLabel>Greater Sydney</SelectLabel>
  <SelectItem value="parramatta">Parramatta</SelectItem>
</SelectGroup>
<SelectSeparator />`}
      >
        <Select items={centreItems} defaultValue='parramatta'>
          <SelectTrigger className='w-72' aria-label='Nearest service centre'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Greater Sydney</SelectLabel>
              <SelectItem value='parramatta'>Parramatta</SelectItem>
              <SelectItem value='penrith'>Penrith</SelectItem>
              <SelectItem value='liverpool'>Liverpool</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Regional NSW</SelectLabel>
              <SelectItem value='dubbo'>Dubbo</SelectItem>
              <SelectItem value='tamworth'>Tamworth</SelectItem>
              <SelectItem value='wagga'>Wagga Wagga</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
          Inside a <code>Field</code>, the <code>FieldLabel</code> names the trigger, and{' '}
          <code>Field invalid</code> and <code>disabled</code> reach it — no <code>aria-label</code>{' '}
          needed.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field invalid>
  <FieldLabel>State or territory</FieldLabel>
  <Select name="state" items={states}>
    <SelectTrigger className="w-72">
      <SelectValue placeholder="Select a state or territory" />
    </SelectTrigger>
    <SelectContent>…</SelectContent>
  </Select>
  <FieldError>Select the state or territory you live in.</FieldError>
</Field>`}
      >
        <div className='grid w-72 gap-8'>
          <Field>
            <FieldLabel>State or territory</FieldLabel>
            <Select name='state' items={stateItems} defaultValue='nsw'>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <StateItems />
              </SelectContent>
            </Select>
            <FieldDescription>Where you live now.</FieldDescription>
          </Field>
          <Field invalid>
            <FieldLabel>State or territory</FieldLabel>
            <Select name='state-invalid' items={stateItems}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a state or territory' />
              </SelectTrigger>
              <SelectContent>
                <StateItems />
              </SelectContent>
            </Select>
            <FieldError>Select the state or territory you live in.</FieldError>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SelectDocs() {
  return (
    <DocsPage
      title='Select'
      npm={[
        'Select',
        'SelectTrigger',
        'SelectValue',
        'SelectContent',
        'SelectItem',
        'SelectGroup',
        'SelectLabel',
        'SelectSeparator',
      ]}
      registry='select'
      summary={
        <>
          A custom-styled list for choosing one option. The trigger matches Input; the list opens in
          a popup portalled to the end of the page. Base UI owns focus, typeahead, keyboard
          movement, ARIA and positioning.
        </>
      }
    >
      <DocsUsage
        use={[
          'Choosing one option from a list too long for radio buttons.',
          'A choice that needs the system’s styling in its list, such as grouped options.',
          'Filters and settings where the list stays out of the way until opened.',
        ]}
        avoid={[
          'The platform’s own picker would serve phones better — use NativeSelect.',
          'People need to type to find their answer in a long list — use Combobox.',
          'There are only a few options, and seeing them all helps — use RadioGroup.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <StatesSection />
      <GroupedOptionsSection />
      <WithFieldSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SelectDocs },
  },
  args: {
    items: stateItems,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    items: {
      control: false,
      description: 'Map of values to labels, so the trigger can show a label before opening.',
      table: { category: 'Content' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initially selected value when uncontrolled.',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'text',
      description: 'Controlled selected value. Pair with onValueChange.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the select from opening.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Keeps the value but prevents changing it.',
      table: { category: 'Behavior' },
    },
    required: {
      control: 'boolean',
      description: 'A value must be chosen before the form is submitted.',
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
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className='w-72' aria-label='State or territory'>
        <SelectValue placeholder='Select a state or territory' />
      </SelectTrigger>
      <SelectContent>
        <StateItems />
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The trigger renders in the canvas; assert it first — this is the robust
    // half of the check.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="select-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="select-trigger"].')
    }
    await expect(trigger).toBeEnabled()

    // Opening reveals the PORTALED list on document.body, not in canvasElement.
    await userEvent.click(trigger)
    const body = within(document.body)
    const option = await body.findByRole('option', { name: 'Victoria' })
    await expect(option).toBeInTheDocument()
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const GroupedOptions: Story = {
  name: 'Grouped options',
  render: () => <GroupedOptionsSection />,
}

export const WithField: Story = { name: 'With Field', render: () => <WithFieldSection /> }

/**
 * NativeSelect — the docs page, Default and Playground.
 *
 *   Components/NativeSelect                → this file
 *   Components/NativeSelect/Features       → native-select.features.stories.tsx
 *   Components/NativeSelect/Accessibility  → native-select.accessibility.stories.tsx
 *   Components/NativeSelect/Tests          → native-select.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './button.js'
import { Input } from './input.js'

import { Label } from './label.js'
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from './native-select.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

function StateOptions() {
  return (
    <>
      <NativeSelectOption value='nsw'>New South Wales</NativeSelectOption>
      <NativeSelectOption value='act'>Australian Capital Territory</NativeSelectOption>
      <NativeSelectOption value='vic'>Victoria</NativeSelectOption>
      <NativeSelectOption value='qld'>Queensland</NativeSelectOption>
    </>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          <code>default</code> is the bordered field that matches Input and Select.{' '}
          <code>filled</code> is a borderless tinted band that shows its border on hover, for
          filters and toolbars where a row of boxed fields would be heavy.
        </>
      }
    >
      <Example code={`<NativeSelect variant="filled">…</NativeSelect>`}>
        {(['default', 'filled'] as const).map((variant) => (
          <ExampleCell key={variant} label={variant}>
            <NativeSelect
              variant={variant}
              aria-label={`State or territory (${variant})`}
              defaultValue='nsw'
              className='w-72'
            >
              <StateOptions />
            </NativeSelect>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function SizesSection() {
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
      <Example code={`<NativeSelect size="sm">…</NativeSelect>`}>
        {(['default', 'sm'] as const).map((size) => (
          <ExampleCell key={size} label={size}>
            <NativeSelect
              size={size}
              aria-label={`State or territory (${size})`}
              defaultValue='nsw'
              className='w-72'
            >
              <StateOptions />
            </NativeSelect>
          </ExampleCell>
        ))}
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
          The default field shifts to the sunken surface on hover and draws Input&apos;s 2px ring on
          focus. Invalid takes Input&apos;s 2px danger border; set <code>aria-invalid</code>.
          Disabled fades the whole control, chevron included.
        </>
      }
    >
      <Example code={`<NativeSelect aria-invalid>…</NativeSelect>`}>
        <ExampleCell label='default'>
          <NativeSelect aria-label='State or territory (default)' defaultValue='' className='w-72'>
            <NativeSelectOption value=''>Select a state or territory</NativeSelectOption>
            <StateOptions />
          </NativeSelect>
        </ExampleCell>
        <ExampleCell label='invalid'>
          <NativeSelect aria-label='State or territory (invalid)' aria-invalid className='w-72'>
            <NativeSelectOption value=''>Select a state or territory</NativeSelectOption>
            <StateOptions />
          </NativeSelect>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <NativeSelect
            aria-label='State or territory (disabled)'
            disabled
            defaultValue='nsw'
            className='w-72'
          >
            <StateOptions />
          </NativeSelect>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function OptionGroupsSection() {
  return (
    <ExampleSection
      title='Option groups'
      description={
        <>
          <code>NativeSelectOptGroup</code> sorts a long list under headings the browser renders in
          its own picker.
        </>
      }
    >
      <Example
        code={`<NativeSelectOptGroup label="Greater Sydney">
  <NativeSelectOption value="parramatta">Parramatta</NativeSelectOption>
</NativeSelectOptGroup>`}
      >
        <NativeSelect
          aria-label='Nearest service centre'
          defaultValue='parramatta'
          className='w-72'
        >
          <NativeSelectOptGroup label='Greater Sydney'>
            <NativeSelectOption value='parramatta'>Parramatta</NativeSelectOption>
            <NativeSelectOption value='penrith'>Penrith</NativeSelectOption>
            <NativeSelectOption value='liverpool'>Liverpool</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label='Regional NSW'>
            <NativeSelectOption value='dubbo'>Dubbo</NativeSelectOption>
            <NativeSelectOption value='tamworth'>Tamworth</NativeSelectOption>
            <NativeSelectOption value='wagga'>Wagga Wagga</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </Example>
    </ExampleSection>
  )
}

export function WithALabelSection() {
  return (
    <ExampleSection
      title='With a label'
      description={
        <>
          NativeSelect is a plain <code>&lt;select&gt;</code>, so name it with a <code>Label</code>{' '}
          pointed at its <code>id</code>. Start with an empty option that asks the question, rather
          than preselecting an answer people may not notice.
        </>
      }
    >
      <Example
        code={`<Label htmlFor="state">State or territory</Label>
<NativeSelect id="state" name="state" defaultValue="">
  <NativeSelectOption value="">Select a state or territory</NativeSelectOption>
  …
</NativeSelect>`}
      >
        <div className='grid w-72 gap-2'>
          <Label htmlFor='native-select-docs-state'>State or territory</Label>
          <NativeSelect
            id='native-select-docs-state'
            name='state'
            defaultValue=''
            className='w-full'
          >
            <NativeSelectOption value=''>Select a state or territory</NativeSelectOption>
            <StateOptions />
          </NativeSelect>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='An address step on a phone-first form: the state is a NativeSelect, so people on a phone get the platform picker, and it sits level with the Input beside it.'
    >
      <Example
        layout='fill'
        code={`<Label htmlFor="suburb">Suburb or town</Label>
<Input id="suburb" autoComplete="address-level2" />

<Label htmlFor="state">State or territory</Label>
<NativeSelect id="state" name="state" autoComplete="address-level1" defaultValue="nsw">
  <NativeSelectOption value="nsw">New South Wales</NativeSelectOption>
  …
</NativeSelect>`}
      >
        <form className='grid max-w-md gap-6' onSubmit={(event) => event.preventDefault()}>
          <div className='grid gap-2'>
            <Label htmlFor='native-select-context-suburb'>Suburb or town</Label>
            <Input id='native-select-context-suburb' autoComplete='address-level2' />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='native-select-context-state'>State or territory</Label>
            <NativeSelect
              id='native-select-context-state'
              name='state'
              autoComplete='address-level1'
              defaultValue='nsw'
              className='w-full'
            >
              <StateOptions />
            </NativeSelect>
          </div>
          <div>
            <Button type='submit'>Continue</Button>
          </div>
        </form>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function NativeSelectDocs() {
  return (
    <DocsPage
      title='NativeSelect'
      npm={['NativeSelect', 'NativeSelectOption', 'NativeSelectOptGroup']}
      registry='native-select'
      summary={
        <>
          A styled native <code>&lt;select&gt;</code>. The browser owns the option list and every
          keyboard and pointer behaviour — on phones, that means the platform&apos;s own picker. We
          style the closed control to match Input and draw the chevron.
        </>
      }
    >
      <DocsUsage
        use={[
          'Choosing one option from a list that is too long for radio buttons.',
          'Forms used mostly on phones, where the platform picker is easiest.',
          'Dense filters where a lightweight control is enough.',
        ]}
        avoid={[
          'Options need icons, descriptions or custom styling — use Select.',
          'The list is long enough that people need to type to find their answer — use Combobox.',
          'There are only a few options, and seeing them all helps — use RadioGroup.',
        ]}
      />
      <VariantsSection />
      <SizesSection />
      <StatesSection />
      <OptionGroupsSection />
      <WithALabelSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: NativeSelectDocs },
  },
  args: {
    'aria-label': 'State or territory',
    defaultValue: 'nsw',
    variant: 'default',
    size: 'default',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'filled'],
      description: 'Bordered field, or a borderless tinted band.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
      description: '48px, or a 40px compact control for dense filters.',
      table: { category: 'Appearance' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initially selected value when uncontrolled.',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'text',
      description: 'Controlled selected value. Pair with onChange.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and fades the control.',
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
    onChange: {
      description: 'Called when the selection changes (logged in the Actions panel).',
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
    <NativeSelect {...args}>
      <StateOptions />
    </NativeSelect>
  ),
} satisfies Meta<typeof NativeSelect>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // A native <select> exposes the implicit `combobox` role and carries its
    // options directly in the DOM — assert both rather than the wrapper div.
    const select = canvas.getByRole('combobox') as HTMLSelectElement
    await expect(select).toBeInTheDocument()
    await expect(select).toHaveValue(String(args.defaultValue))
    await expect(select.options.length).toBeGreaterThan(1)

    // Selecting an option is browser-owned; prove it round-trips a real value.
    await userEvent.selectOptions(select, 'vic')
    await expect(select).toHaveValue('vic')
  },
}

export const Playground: Story = {}

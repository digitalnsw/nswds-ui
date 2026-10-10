/**
 * Switch — the docs page, Default and Playground.
 *
 *   Components/Switch                → this file
 *   Components/Switch/Features       → switch.features.stories.tsx
 *   Components/Switch/Accessibility  → switch.accessibility.stories.tsx
 *   Components/Switch/Tests          → switch.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * An on/off toggle built on the Base UI Switch primitive — the `switch` role,
 * keyboard toggling and focus come from there. We style the track and thumb,
 * and add a `size` variant (`sm` | `default`).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from './field.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { Switch } from './switch.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description={
        <>
          A leading switch in a horizontal <code>Field</code>, 16px from a regular-weight label.
          Pressing the label toggles it.
        </>
      }
    >
      <Example
        code={`<Field orientation="horizontal" className="min-h-11 gap-4">
  <Switch name="updates" />
  <FieldLabel className="font-normal">Email updates</FieldLabel>
</Field>`}
      >
        <Field orientation='horizontal' className='min-h-11 gap-4'>
          <Switch />
          <FieldLabel className='font-normal'>Email updates</FieldLabel>
        </Field>
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
          <code>default</code> is 56×32px, level with Checkbox; <code>sm</code> is 40×24px, for
          dense settings tables. Both keep the 44px hit area.
        </>
      }
    >
      <Example code={`<Switch size="sm" />`}>
        {(['default', 'sm'] as const).map((size) => (
          <ExampleCell key={size} label={size}>
            <div className='flex items-center gap-6'>
              <Switch size={size} aria-label={`Email updates (${size}, off)`} />
              <Switch size={size} aria-label={`Email updates (${size}, on)`} defaultChecked />
            </div>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

const stateRows = [
  { code: `<Switch defaultChecked />`, prefix: '', props: {} },
  { code: `<Switch disabled />`, prefix: 'disabled', props: { disabled: true } },
  { code: `<Switch aria-invalid />`, prefix: 'invalid', props: { 'aria-invalid': true } },
] as const

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          Off is a hollow ring; on fills the track and turns the thumb solid with a tick, so the
          state reads by shape as well as colour and side. Disabled greys the switch without fading
          it; invalid takes Input&apos;s 2px danger edge, and a danger fill when on. Use the theme
          toolbar to preview the selected primary palette in light or dark mode. Invalid switches
          use the same danger colours as other form elements. The small size is 24px tall and keeps
          the 44px hit area.
        </>
      }
    >
      {stateRows.map(({ code, prefix, props }) => (
        <Example key={code} code={code}>
          {(['default', 'sm'] as const).flatMap((size) =>
            (['off', 'on'] as const).map((state) => {
              const label = [prefix, size === 'sm' ? 'sm' : '', state].filter(Boolean).join(' ')
              return (
                <ExampleCell key={`${size} ${state}`} label={label}>
                  <Switch
                    size={size}
                    aria-label={`Email updates, ${label}`}
                    defaultChecked={state === 'on'}
                    {...props}
                  />
                </ExampleCell>
              )
            }),
          )}
        </Example>
      ))}
    </ExampleSection>
  )
}

export function WithFieldSection() {
  return (
    <ExampleSection
      title='With Field'
      description={
        <>
          A leading switch sits in a horizontal <code>Field</code>, 16px from a regular-weight
          label. Pressing the label toggles it. <code>Field invalid</code> sets the error treatment
          and announces the <code>FieldError</code> with the switch.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<Field orientation="horizontal" className="min-h-11 gap-4">
  <Switch name="updates" />
  <FieldLabel className="font-normal">Email updates</FieldLabel>
</Field>`}
      >
        <div className='grid max-w-md gap-8'>
          <Field orientation='horizontal' className='min-h-11 gap-4'>
            <Switch name='updates' />
            <FieldLabel className='font-normal'>Email updates</FieldLabel>
          </Field>
          <Field orientation='horizontal' className='gap-4' invalid>
            <Switch name='two-step' />
            <FieldContent className='pt-1'>
              <FieldLabel className='font-normal'>Two-step verification</FieldLabel>
              <FieldError>Turn on two-step verification. Staff accounts need it.</FieldError>
            </FieldContent>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

function SettingsList() {
  const rows = [
    {
      name: 'Email updates',
      description: 'Get an email when your application status changes.',
      defaultChecked: true,
    },
    { name: 'SMS reminders', description: 'We will text you 2 days before your appointment.' },
    {
      name: 'Share usage data',
      description: 'Available after you verify your mobile number.',
      disabled: true,
    },
  ]
  return (
    <div className='w-full max-w-xl divide-y divide-border border-y border-border'>
      {rows.map(({ name, description, ...props }) => (
        <Field
          key={name}
          orientation='horizontal'
          className='justify-between gap-6 py-5'
          disabled={props.disabled}
        >
          <FieldContent>
            <FieldLabel>{name}</FieldLabel>
            <FieldDescription>{description}</FieldDescription>
          </FieldContent>
          <Switch {...props} />
        </Field>
      ))}
    </div>
  )
}

export function InASettingsListSection() {
  return (
    <ExampleSection
      title='In a settings list'
      description='Put the label and description first and the switch at the end of the row. Pressing the label toggles the switch as well as the switch itself; the description is not part of the target. Each change applies straight away, so there is no Save button.'
    >
      <Example
        layout='fill'
        code={`<Field orientation="horizontal" className="justify-between gap-6 py-5">
  <FieldContent>
    <FieldLabel>Email updates</FieldLabel>
    <FieldDescription>Get an email when your application status changes.</FieldDescription>
  </FieldContent>
  <Switch defaultChecked />
</Field>`}
      >
        <SettingsList />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SwitchDocs() {
  return (
    <DocsPage
      title='Switch'
      npm='Switch'
      registry='switch'
      summary={
        <>
          A switch turns a single setting on or off, and the change applies straight away. For a
          choice that is only sent with a form, or one someone must agree to, use a checkbox. The
          thumb is a hollow ring when off and a solid thumb with a tick when on, so the state reads
          by shape as well as colour. Base UI owns the <code>switch</code> role, keyboard toggling
          and form submission.
        </>
      }
    >
      <DocsUsage
        use={[
          'A setting that takes effect as soon as it changes — notifications, reminders.',
          'A list of independent on/off preferences in account settings.',
          'Showing or hiding something on the current page, such as extra detail.',
        ]}
        avoid={[
          'The choice is only sent when a form is submitted — use Checkbox.',
          'Someone must agree to a statement — use Checkbox.',
          'Choosing between two named options — use RadioGroup or ToggleGroup.',
        ]}
      />
      <DefaultSection />
      <SizesSection />
      <StatesSection />
      <WithFieldSection />
      <InASettingsListSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    // Inline autodocs stories share documentElement, so stories with fixed
    // theme globals live in the Tests file, never on this page.
    docs: { page: SwitchDocs },
  },
  args: {
    size: 'default',
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
      description: '`default` is 56×32px; `sm` is 40×24px. Both keep a 44px hit area.',
      table: { category: 'Appearance' },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled on state. Pair with onCheckedChange.',
      table: { category: 'Behavior' },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial on state when uncontrolled.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and greys the switch.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Keeps the state but prevents changing it.',
      table: { category: 'Behavior' },
    },
    name: {
      control: 'text',
      description: 'Name submitted with the form.',
      table: { category: 'Behavior' },
    },
    value: {
      control: 'text',
      description: 'Value submitted with the form when on.',
      table: { category: 'Behavior' },
    },
    onCheckedChange: {
      description: 'Called with the new state (logged in the Actions panel).',
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
      <Switch {...args} />
      <FieldLabel className='font-normal'>Email updates</FieldLabel>
    </Field>
  ),
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    const control = canvas.getByRole('switch', { name: 'Email updates' })
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await expect(control.querySelector('svg')).toBeNull()

    // Toggling is inherited, not hand-rolled — prove it with a real click on
    // the label, then with the keyboard.
    await userEvent.click(canvas.getByText('Email updates'))
    await expect(control).toHaveAttribute('aria-checked', 'true')
    await expect(control.querySelector('svg')).not.toBeNull()
    control.focus()
    await userEvent.keyboard('[Space]')
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await expect(control).toHaveFocus()
  },
}

export const Playground: Story = {}

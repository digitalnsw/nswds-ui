/**
 * Input — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Input/Features        → input.features.stories.tsx
 *   Components/Input/Accessibility   → input.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Input } from './input.js'

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

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Input</h1>
            <p className='text-base text-muted-foreground'>
              Single-line text inputs accept short, free-form data such as a name, email address, or
              search query. Always pair an input with a visible label so the field has an accessible
              name, and use the matching HTML type so browsers can offer the correct keyboard and
              validation behaviour.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
            <Input placeholder='you@example.com' />
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>With label</h2>
            <div className='grid w-full max-w-sm gap-1.5'>
              <label htmlFor='input-docs-email' className='text-sm font-medium'>
                Email address
              </label>
              <Input id='input-docs-email' type='email' placeholder='you@example.com' />
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Single-line text input wrapping the Base UI Input primitive with token-driven NSW styling. Supports every HTML input type, hover and focus indicators, and an aria-invalid error state for inline form validation.',
      },
    },
  },
  args: {
    type: 'text',
    placeholder: 'you@example.com',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: types,
      description:
        'Native HTML input type — controls mobile keyboard, parsing, and browser validation.',
      table: { category: 'Behavior' },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the input is empty.',
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
    disabled: {
      control: 'boolean',
      description:
        'Disables typing and applies disabled styles; the field is skipped in tab order.',
      table: { category: 'Behavior' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents editing while still allowing focus, selection, and copy.',
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
      description: 'Applies the destructive border and background to indicate validation failure.',
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name used when there is no associated visible label element.',
      table: { category: 'Accessibility' },
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind classes appended to the input.',
      table: { disable: true, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInput(canvasElement: HTMLElement, name: string) {
  const input = Array.from(canvasElement.querySelectorAll('input')).find(
    (el) => el.getAttribute('placeholder') === name || el.getAttribute('aria-label') === name,
  )

  if (!input) throw new Error(`Could not find input named "${name}".`)

  return input
}

function expectAttribute(element: Element, name: string, expectedValue: string) {
  const receivedValue = element.getAttribute(name)

  if (receivedValue !== expectedValue) {
    throw new Error(`Expected ${name}="${expectedValue}", received "${receivedValue}".`)
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
  },
  play: async ({ canvasElement }) => {
    const input = getInput(canvasElement, 'you@example.com')
    expectAttribute(input, 'data-slot', 'input')
    expectAttribute(input, 'data-type', 'email')
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      // Compact view: Name + Control only, no description/type/default columns
      expanded: false,
      sort: 'requiredFirst',
    },
  },
  render: (args) => (
    <div className='w-full max-w-xl rounded-sm border border-border bg-background p-6'>
      <Input {...args} />
    </div>
  ),
}

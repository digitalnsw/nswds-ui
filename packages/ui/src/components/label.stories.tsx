/**
 * Label — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Label/Features        → label.features.stories.tsx
 *   Components/Label/Accessibility   → label.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from './label.js'

const meta = {
  title: 'Components/Label',
  component: Label,
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
            <h1 className='text-4xl font-bold tracking-normal'>Label</h1>
            <p className='text-base text-muted-foreground'>
              Label is a small text element that names an interactive form control. It pairs with an
              input via <code>htmlFor</code> so the field has an accessible name, and inherits
              disabled styling from a sibling or ancestor control.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
            <div className='grid w-full max-w-sm gap-1.5'>
              <Label htmlFor='label-docs-email'>Email address</Label>
              <input
                id='label-docs-email'
                type='email'
                className='h-9 rounded-sm border border-input bg-background px-3 text-sm'
              />
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Disabled state</h2>
            <p className='text-sm text-muted-foreground'>
              The Label primitive dims to 50% opacity whenever an ancestor with <code>group</code> +{' '}
              <code>{'data-disabled="true"'}</code> is present — the canonical pattern used by{' '}
              <code>Field</code>. (Label also dims when a peer input is disabled, but that requires
              the input to appear before the label in DOM order; see the Disabled feature story for
              that pattern.)
            </p>
            <div data-disabled='true' className='group grid w-full max-w-sm gap-1.5'>
              <Label htmlFor='label-docs-disabled'>Disabled field label</Label>
              <input
                id='label-docs-disabled'
                type='text'
                disabled
                className='h-9 rounded-sm border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50'
              />
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Required indicator</h2>
            <div className='grid w-full max-w-sm gap-1.5'>
              <Label htmlFor='label-docs-required'>
                Full name
                <span aria-hidden='true' className='text-danger-600'>
                  *
                </span>
              </Label>
              <input
                id='label-docs-required'
                type='text'
                required
                className='h-9 rounded-sm border border-input bg-background px-3 text-sm'
              />
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Label names an interactive form control and connects to it via htmlFor so the field receives an accessible name. It inherits disabled styling from peers and ancestors.',
      },
    },
  },
  args: {
    children: 'Email address',
    htmlFor: 'label-default-input',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text content shown to the user.',
      table: { category: 'Content' },
    },
    htmlFor: {
      control: 'text',
      description:
        'ID of the form control this label names; creates the accessible-name association.',
      table: { category: 'Accessibility' },
    },
    id: {
      control: 'text',
      description: 'Optional id for the label element; useful when referenced by aria-labelledby.',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  render: (args) => (
    <div className='grid w-full max-w-sm gap-1.5'>
      <Label {...args} />
      {args.htmlFor ? (
        <input
          id={args.htmlFor}
          type='text'
          className='h-9 rounded-sm border border-input bg-background px-3 text-sm'
        />
      ) : null}
    </div>
  ),
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLabel(canvasElement: HTMLElement) {
  const label = canvasElement.querySelector<HTMLLabelElement>('[data-slot="label"]')
  if (!label) {
    throw new Error('Could not find an element with [data-slot="label"].')
  }
  return label
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Email address',
    htmlFor: 'label-default-input',
  },
  play: async ({ canvasElement, args }) => {
    const label = getLabel(canvasElement)

    if (label.getAttribute('data-slot') !== 'label') {
      throw new Error(`Expected data-slot="label", received "${label.getAttribute('data-slot')}".`)
    }

    if (args.htmlFor) {
      const received = label.getAttribute('for')
      if (received !== args.htmlFor) {
        throw new Error(`Expected for="${args.htmlFor}", received "${received}".`)
      }
    }
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
      <div className='grid w-full gap-1.5'>
        <Label {...args} />
        {args.htmlFor ? (
          <input
            id={args.htmlFor}
            type='text'
            className='h-9 rounded-sm border border-input bg-background px-3 text-sm'
          />
        ) : null}
      </div>
    </div>
  ),
}

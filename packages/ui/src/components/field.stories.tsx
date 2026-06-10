/**
 * Field — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Field/Features        → field.features.stories.tsx
 *   Components/Field/Accessibility   → field.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldDescription, FieldLabel } from './field.js'
import { Input } from './input.js'

const orientations = ['vertical', 'horizontal', 'responsive'] as const

const meta = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className="text-foreground max-w-3xl space-y-8">
          <section className="space-y-3">
            <h1 className="text-4xl font-bold tracking-normal">Field</h1>
            <p className="text-muted-foreground text-base">
              Field is a composition wrapper that groups a form control with its
              label, helper description, and error message. It standardises
              spacing and orientation so every input in a form shares a
              consistent vertical rhythm and label-to-control relationship.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Default</h2>
            <Field>
              <FieldLabel htmlFor="field-docs-default">Email</FieldLabel>
              <Input
                id="field-docs-default"
                type="email"
                placeholder="you@example.com"
              />
              <FieldDescription>
                We&apos;ll never share your email.
              </FieldDescription>
            </Field>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Orientations</h2>
            <div className="space-y-6">
              {orientations.map((orientation) => (
                <div key={orientation} className="space-y-2">
                  <p className="text-foreground text-sm font-medium capitalize">
                    {orientation}
                  </p>
                  <Field orientation={orientation}>
                    <FieldLabel htmlFor={`field-docs-${orientation}`}>
                      Email
                    </FieldLabel>
                    <Input
                      id={`field-docs-${orientation}`}
                      type="email"
                      placeholder="you@example.com"
                    />
                    <FieldDescription>
                      We&apos;ll never share your email.
                    </FieldDescription>
                  </Field>
                </div>
              ))}
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Composition wrapper that groups a label, control, helper description, and error message into a single accessible form field with consistent spacing and orientation.',
      },
    },
  },
  args: {
    orientation: 'vertical',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: orientations,
      description:
        'Layout direction of label, control, and description within the field.',
      table: { category: 'Appearance' },
    },
    children: {
      description:
        'Field children — typically FieldLabel, an input, FieldDescription, and FieldError.',
      table: { category: 'Content' },
    },
    id: {
      control: 'text',
      description: 'DOM id applied to the field wrapper element.',
      table: { category: 'Behavior' },
    },
    'aria-labelledby': {
      control: 'text',
      description:
        'Id of an external element that labels the field group when no FieldLabel is used.',
      table: { category: 'Accessibility' },
    },
    'aria-describedby': {
      control: 'text',
      description:
        'Id of an external element that supplements the field with additional description text.',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-demo">Email</FieldLabel>
      <Input id="field-demo" type="email" placeholder="you@example.com" />
      <FieldDescription>We&apos;ll never share your email.</FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    orientation: 'vertical',
  },
  play: async ({ canvasElement, args }) => {
    const field = canvasElement.querySelector('[data-slot="field"]')
    if (!field) {
      throw new Error('Could not find [data-slot="field"] in canvas.')
    }

    const received = field.getAttribute('data-orientation')
    if (received !== args.orientation) {
      throw new Error(
        `Expected data-orientation="${args.orientation}", received "${received}".`
      )
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
    <div className="border-border bg-background w-full max-w-xl rounded-sm border p-6">
      <Field {...args}>
        <FieldLabel htmlFor="field-playground">Email</FieldLabel>
        <Input
          id="field-playground"
          type="email"
          placeholder="you@example.com"
        />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>
    </div>
  ),
}

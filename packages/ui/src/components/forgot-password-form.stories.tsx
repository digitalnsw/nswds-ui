/**
 * ForgotPasswordForm — Default + Playground
 *
 * ForgotPasswordForm is a composed pattern (Card + Field + Input + Button)
 * rather than a primitive. It is the password-reset request step that pairs
 * with the "Forgot your password?" link in LoginForm. Like LoginForm, it is
 * published as a worked example — consumers copy and adapt the source rather
 * than treat it as a black-box component.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ForgotPasswordForm } from './forgot-password-form.js'

const meta = {
  title: 'Components/ForgotPasswordForm',
  component: ForgotPasswordForm,
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
            <h1 className="text-4xl font-bold tracking-normal">
              ForgotPasswordForm
            </h1>
            <p className="text-muted-foreground text-base">
              ForgotPasswordForm is a composed pattern that demonstrates how to
              assemble Card, Field, Input, and Button primitives into a
              password-reset request form. It is the destination of the
              &ldquo;Forgot your password?&rdquo; link in LoginForm. Copy the
              source, wire the email field to your own reset handler, and adapt
              the copy to your service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Default</h2>
            <div className="w-full max-w-md">
              <ForgotPasswordForm />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-normal">
              Account-enumeration safety
            </h2>
            <p className="text-muted-foreground text-base">
              When wiring the form, show the same confirmation message whether
              or not the submitted address has an account. Revealing that an
              email is &ldquo;not found&rdquo; lets an attacker enumerate
              registered users. The single-field layout keeps this easy to get
              right.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'ForgotPasswordForm is a composed password-reset request pattern assembling Card, Field, Input, and Button. It is published as a worked example; consumers copy and adapt the source rather than configure it through props.',
      },
    },
  },
  args: {
    className: '',
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Additional Tailwind utility classes merged onto the outer wrapper. Use to constrain width or override layout in context.',
      table: { disable: true, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ForgotPasswordForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    className: 'w-full max-w-md',
  },
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector<HTMLInputElement>(
      'input[type="email"]'
    )
    if (!emailInput) {
      throw new Error(
        'ForgotPasswordForm: expected an <input type="email"> in the canvas.'
      )
    }

    // The email field must be programmatically labelled (WCAG 1.3.1).
    if (!emailInput.labels || emailInput.labels.length < 1) {
      throw new Error(
        'ForgotPasswordForm: the email input has no associated <label>.'
      )
    }

    // Single-field flow: no password input belongs on the reset request step.
    const passwordInput = canvasElement.querySelector<HTMLInputElement>(
      'input[type="password"]'
    )
    if (passwordInput) {
      throw new Error(
        'ForgotPasswordForm: the reset request step must not contain a password input.'
      )
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )
    if (!submit) {
      throw new Error(
        'ForgotPasswordForm: expected a <button type="submit"> in the canvas.'
      )
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
  render: (args) => (
    <div className="border-border bg-background w-full max-w-md rounded-sm border p-6">
      <ForgotPasswordForm {...args} />
    </div>
  ),
}

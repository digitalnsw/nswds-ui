/**
 * SignUpForm — Default + Playground
 *
 * SignUpForm is a composed pattern (Card + Field + Input + Button) rather than
 * a primitive — the account-creation counterpart to LoginForm. Like the other
 * auth patterns it is published as a worked example: consumers copy and adapt
 * the source rather than treat it as a black-box component.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { SignUpForm } from './sign-up-form.js'

const meta = {
  title: 'Components/SignUpForm',
  component: SignUpForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className="max-w-3xl space-y-8 text-foreground">
          <section className="space-y-3">
            <h1 className="text-4xl font-bold tracking-normal">SignUpForm</h1>
            <p className="text-base text-muted-foreground">
              SignUpForm is a composed pattern that demonstrates how to assemble
              Card, Field, Input, and Button primitives into an account-creation
              form. It pairs with LoginForm&apos;s &ldquo;Sign up&rdquo; link.
              Copy the source, wire the fields to your own registration handler,
              and adapt the copy and terms links to your service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Default</h2>
            <div className="w-full max-w-md">
              <SignUpForm />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-normal">
              Password manager &amp; accessibility
            </h2>
            <p className="text-base text-muted-foreground">
              The password field uses{' '}
              <code>autoComplete=&quot;new-password&quot;</code> so password
              managers offer a generated password, and the requirements hint is
              linked to the input via <code>aria-describedby</code> so it is
              announced to screen readers. Keep both when adapting the source.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'SignUpForm is a composed account-creation pattern assembling Card, Field, Input, and Button. It is published as a worked example; consumers copy and adapt the source rather than configure it through props.',
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
} satisfies Meta<typeof SignUpForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    className: 'w-full max-w-md',
  },
  play: async ({ canvasElement }) => {
    // Each input must be present and programmatically labelled (WCAG 1.3.1).
    const requiredInputs: Array<[string, string]> = [
      ['#name', 'name'],
      ['#email', 'email'],
      ['#password', 'password'],
      ['#confirm-password', 'confirm password'],
    ]
    for (const [selector, label] of requiredInputs) {
      const input = canvasElement.querySelector<HTMLInputElement>(selector)
      if (!input) {
        throw new Error(`SignUpForm: expected a ${label} input (${selector}).`)
      }
      if (!input.labels || input.labels.length < 1) {
        throw new Error(`SignUpForm: the ${label} input has no <label>.`)
      }
    }

    // The email/password registration fields are grouped in a FieldSet whose
    // legend names the set for assistive tech.
    const legend = canvasElement.querySelector('legend')
    if (!legend || !legend.textContent?.toLowerCase().includes('register')) {
      throw new Error(
        'SignUpForm: expected a <legend> naming the email/password field set.'
      )
    }

    // Sign-up best practice: the password field opts into the
    // new-password autofill hint so managers offer a generated password.
    const password = canvasElement.querySelector<HTMLInputElement>(
      'input[type="password"]'
    )
    if (password?.getAttribute('autocomplete') !== 'new-password') {
      throw new Error(
        'SignUpForm: the password input must set autoComplete="new-password".'
      )
    }

    // The requirements hint must be associated with the password input.
    const describedBy = password?.getAttribute('aria-describedby')
    if (!describedBy || !canvasElement.querySelector(`#${describedBy}`)) {
      throw new Error(
        'SignUpForm: password input is missing an aria-describedby hint.'
      )
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )
    if (!submit) {
      throw new Error('SignUpForm: expected a <button type="submit">.')
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
    <div className="w-full max-w-md rounded-sm border border-border bg-background p-6">
      <SignUpForm {...args} />
    </div>
  ),
}

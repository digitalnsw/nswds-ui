/**
 * LoginForm — Default + Playground
 *
 * LoginForm is a composed pattern (Card + Field + Input + Button) rather than
 * a primitive. It is published as a worked example showing how to assemble the
 * primitives into a sign-in form; consumers are expected to copy and adapt it
 * rather than treat it as a black-box component.
 *
 * Sub-groups live in separate story files:
 *   Components/LoginForm/Features        → login-form.features.stories.tsx
 *   Components/LoginForm/Accessibility   → login-form.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LoginForm } from './login-form.js'

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
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
            <h1 className="text-4xl font-bold tracking-normal">LoginForm</h1>
            <p className="text-base text-muted-foreground">
              LoginForm is a composed pattern that demonstrates how to assemble
              Card, Field, Input, and Button primitives into a sign-in form. It
              is intended as a starting point for customisation, not a
              black-box component — copy the source, adapt the fields, swap the
              providers, and wire it to your own form handler.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Default</h2>
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold tracking-normal">
              Customising the pattern
            </h2>
            <p className="text-base text-muted-foreground">
              LoginForm exposes only a wrapper <code>className</code> prop on
              purpose — extending the pattern means copying the component
              source, not configuring it through props. Treat this file as the
              reference implementation: add a third-party SSO button, swap the
              footer link, or wire the form to a server action by editing the
              copied source directly.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'LoginForm is a composed sign-in pattern assembling Card, Field, Input, and Button. It is published as a worked example; consumers copy and adapt the source rather than configure it through props.',
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
} satisfies Meta<typeof LoginForm>

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
        'LoginForm: expected at least one <input type="email"> in the canvas.'
      )
    }

    const passwordInput = canvasElement.querySelector<HTMLInputElement>(
      'input[type="password"]'
    )
    if (!passwordInput) {
      throw new Error(
        'LoginForm: expected at least one <input type="password"> in the canvas.'
      )
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )
    if (!submit) {
      throw new Error(
        'LoginForm: expected at least one <button type="submit"> in the canvas.'
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
    <div className="w-full max-w-md rounded-sm border border-border bg-background p-6">
      <LoginForm {...args} />
    </div>
  ),
}

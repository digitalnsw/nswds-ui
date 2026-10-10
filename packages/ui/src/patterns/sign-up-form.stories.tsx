/**
 * SignUpForm — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/SignUpForm                → this file: Docs, Default, Playground and
 *                                        one story per docs section
 *   Patterns/SignUpForm/Accessibility  → sign-up-form.accessibility.stories.tsx
 *
 * SignUpForm is a registry block (Card + Field + Input + Button), the
 * account-creation counterpart to LoginForm. Consumers copy the source and
 * adapt it rather than configure it through props.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldDescription, FieldError, FieldLabel } from '../components/field.js'
import { Input } from '../components/input.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { SignUpForm } from './sign-up-form.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function RegistrationMethodsSection() {
  return (
    <ExampleSection
      title='Registration methods'
      description={
        <>
          Single sign-on with Microsoft Entra ID leads, with solid emphasis, because NSW Government
          staff already have an account there. Email and password registration follows the
          separator, grouped in a fieldset whose legend names the set for assistive technology.
          Terms are stated at the point of action, not hidden behind a pre-ticked checkbox.
        </>
      }
    >
      <Example code={`<SignUpForm className="w-full max-w-md" />`}>
        <SignUpForm className='w-full max-w-md' />
      </Example>
    </ExampleSection>
  )
}

function PasswordRulesSection() {
  return (
    <ExampleSection
      title='Password rules'
      description={
        <>
          State the rules before someone types, in a <code>FieldDescription</code> inside the
          password <code>Field</code>: Base UI links it to the input, so a screen reader reads the
          rules when the field takes focus. <code>autoComplete=&quot;new-password&quot;</code> on
          both password fields lets a password manager offer a strong generated one.
        </>
      }
    >
      <Example
        code={`<Field>
  <FieldLabel>Password</FieldLabel>
  <Input type="password" autoComplete="new-password" required />
  <FieldDescription>
    Use at least 8 characters, including a number and a symbol.
  </FieldDescription>
</Field>`}
      >
        <div className='w-full max-w-md'>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input type='password' autoComplete='new-password' required />
            <FieldDescription>
              Use at least 8 characters, including a number and a symbol.
            </FieldDescription>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

function ReportingAnErrorSection() {
  return (
    <ExampleSection
      title='Reporting an error'
      description={
        <>
          SignUpForm renders no errors of its own. When a field fails validation, set{' '}
          <code>invalid</code> on its <code>Field</code> and add a <code>FieldError</code> that says
          how to fix it. Keep the rules visible underneath, so the reader can check the next attempt
          against them.
        </>
      }
    >
      <Example
        code={`<Field invalid>
  <FieldLabel>Password</FieldLabel>
  <Input type="password" autoComplete="new-password" required />
  <FieldDescription>Use at least 8 characters, including a number and a symbol.</FieldDescription>
  <FieldError>Your password needs a symbol, such as ! or #.</FieldError>
</Field>`}
      >
        <div className='w-full max-w-md'>
          <Field invalid>
            <FieldLabel>Password</FieldLabel>
            <Input
              type='password'
              autoComplete='new-password'
              defaultValue='Waratah2026'
              required
            />
            <FieldDescription>
              Use at least 8 characters, including a number and a symbol.
            </FieldDescription>
            <FieldError>Your password needs a symbol, such as ! or #.</FieldError>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A registration page on a subtle page surface, where the white card reads as the one thing to complete.'
    >
      <Example surface='subtle'>
        <div className='w-full max-w-md'>
          <SignUpForm />
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SignUpFormDocs() {
  return (
    <DocsPage
      eyebrow='Pattern'
      title='SignUpForm'
      registry='sign-up-form'
      summary={
        <>
          An account-creation card assembled from Card, Field, Input and Button: single sign-on
          first, then email and password registration with the password rules stated up front. It
          pairs with LoginForm&apos;s &ldquo;Sign up&rdquo; link. Copy the source, wire it to your
          own registration handler, and point the terms links at your service&apos;s own.
        </>
      }
    >
      <DocsUsage
        use={[
          'The registration page of a service that needs people to create an account.',
          'Offering single sign-on to staff while still letting the public register by email.',
          'A reference for new-password autocomplete and linked password rules in your own form.',
        ]}
        avoid={[
          'Signing in to an existing account — use LoginForm.',
          'Resetting a forgotten password — use ForgotPasswordForm.',
          'A one-off enquiry that needs no account — compose Field, Input and Button directly.',
        ]}
      />
      <RegistrationMethodsSection />
      <PasswordRulesSection />
      <ReportingAnErrorSection />
      <InContextSection />
      <DocsApi description='SignUpForm takes the props of a div. Use className to set its width; anything more is a change to the copied source.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Patterns/SignUpForm',
  component: SignUpForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SignUpFormDocs },
  },
  args: {
    className: 'w-full max-w-md',
  },
  argTypes: {
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof SignUpForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Each input must be present and programmatically labelled (WCAG 1.3.1).
    // The form sets no ids (Field auto-associates and scopes ids per instance),
    // so assert against all inputs rather than fixed id selectors.
    const inputs = Array.from(canvasElement.querySelectorAll<HTMLInputElement>('input'))
    if (inputs.length < 4) {
      throw new Error(
        `SignUpForm: expected name, email, password, and confirm-password inputs, found ${inputs.length}.`,
      )
    }
    for (const input of inputs) {
      if (!input.labels || input.labels.length < 1) {
        throw new Error(
          `SignUpForm: an input (type="${input.type}", autocomplete="${input.autocomplete}") has no <label>.`,
        )
      }
    }

    // The email/password registration fields are grouped in a FieldSet whose
    // legend names the set for assistive tech.
    const legend = canvasElement.querySelector('legend')
    if (!legend || !legend.textContent?.toLowerCase().includes('register')) {
      throw new Error('SignUpForm: expected a <legend> naming the email/password field set.')
    }

    // Sign-up best practice: the password field opts into the
    // new-password autofill hint so managers offer a generated password.
    const password = canvasElement.querySelector<HTMLInputElement>('input[type="password"]')
    if (password?.getAttribute('autocomplete') !== 'new-password') {
      throw new Error('SignUpForm: the password input must set autoComplete="new-password".')
    }

    // The requirements hint must be associated with the password input.
    const describedBy = password?.getAttribute('aria-describedby')
    if (!describedBy || !canvasElement.querySelector(`[id="${describedBy}"]`)) {
      throw new Error('SignUpForm: password input is missing an aria-describedby hint.')
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!submit) {
      throw new Error('SignUpForm: expected a <button type="submit">.')
    }
  },
}

export const Playground: Story = {}

export const RegistrationMethods: Story = {
  name: 'Registration methods',
  render: () => <RegistrationMethodsSection />,
}

export const PasswordRules: Story = {
  name: 'Password rules',
  render: () => <PasswordRulesSection />,
}

export const ReportingAnError: Story = {
  name: 'Reporting an error',
  render: () => <ReportingAnErrorSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

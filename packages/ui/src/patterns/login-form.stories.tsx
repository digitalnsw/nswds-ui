/**
 * LoginForm — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/LoginForm                → this file: Docs, Default, Playground and
 *                                       one story per docs section
 *   Patterns/LoginForm/Accessibility  → login-form.accessibility.stories.tsx
 *
 * LoginForm is a registry block (Card + Field + Input + Button), published as
 * a worked example: consumers copy the source and adapt it rather than
 * configure it through props.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldError, FieldLabel } from '../components/field.js'
import { Input } from '../components/input.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { LoginForm } from './login-form.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function SignInMethodsSection() {
  return (
    <ExampleSection
      title='Sign-in methods'
      description={
        <>
          Three ways in, most recommended first: single sign-on, then email and password, then a
          magic link sent to the same address. A labelled separator divides each method so it reads
          as a distinct alternative, and only single sign-on carries solid emphasis — one primary
          action per view. Remove the methods your service does not offer by editing the copied
          source.
        </>
      }
    >
      <Example code={`<LoginForm className="w-full max-w-md" />`}>
        <LoginForm className='w-full max-w-md' />
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
          LoginForm renders no errors of its own. When sign-in fails, set <code>invalid</code> on
          the password <code>Field</code> and add a <code>FieldError</code>: Base UI marks the input{' '}
          <code>aria-invalid</code> and links the message to it. Say the email or password is wrong
          — never which one — so the form does not reveal which addresses have accounts.
        </>
      }
    >
      <Example
        code={`<Field invalid>
  <FieldLabel>Password</FieldLabel>
  <Input type="password" autoComplete="current-password" required />
  <FieldError>The email or password you entered is incorrect.</FieldError>
</Field>`}
      >
        <div className='w-full max-w-md'>
          <Field invalid>
            <FieldLabel>Password</FieldLabel>
            <Input
              type='password'
              autoComplete='current-password'
              defaultValue='incorrect-password'
              required
            />
            <FieldError>The email or password you entered is incorrect.</FieldError>
          </Field>
        </div>
      </Example>
    </ExampleSection>
  )
}

function WidthSection() {
  return (
    <ExampleSection
      title='Width'
      description={
        <>
          The form fills its container, so set the width from outside with <code>className</code>.{' '}
          <code>max-w-md</code> suits a sign-in page (as above). At phone width, shown here, the
          methods still stack and every label fits. Past <code>max-w-xl</code> the form looks lost —
          put a second column of content beside it instead.
        </>
      }
    >
      <Example code={`<LoginForm className="w-full max-w-xs" />`} layout='fill'>
        <LoginForm className='w-full max-w-xs' />
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A sign-in page on the brand band. The card keeps its own surface, so its fields and actions read the same on a coloured page as on a white one.'
    >
      <Example surface='brand'>
        <div className='w-full max-w-md'>
          <LoginForm />
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function LoginFormDocs() {
  return (
    <DocsPage
      eyebrow='Pattern'
      title='LoginForm'
      registry='login-form'
      summary={
        <>
          A sign-in card assembled from Card, Field, Input and Button: single sign-on first, email
          and password as the fallback, and a passwordless magic link. It is a starting point to
          copy and adapt — swap the providers, change the copy and wire the form to your own handler
          — not a component configured through props.
        </>
      }
    >
      <DocsUsage
        use={[
          'The sign-in page of a service where people return with an existing account.',
          'Starting a sign-in screen that offers single sign-on alongside email and password.',
          'A reference for wiring labels, autocomplete tokens and focus order in your own form.',
        ]}
        avoid={[
          'Creating an account — use SignUpForm.',
          'Requesting a password reset — use ForgotPasswordForm.',
          'Collecting anything other than credentials — compose Field, Input and Button directly.',
        ]}
      />
      <SignInMethodsSection />
      <ReportingAnErrorSection />
      <WidthSection />
      <InContextSection />
      <DocsApi description='LoginForm takes the props of a div. Use className to set its width; anything more is a change to the copied source.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Patterns/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: LoginFormDocs },
  },
  args: {
    className: 'w-full max-w-md',
  },
  argTypes: {
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector<HTMLInputElement>('input[type="email"]')
    if (!emailInput) {
      throw new Error('LoginForm: expected at least one <input type="email"> in the canvas.')
    }

    const passwordInput = canvasElement.querySelector<HTMLInputElement>('input[type="password"]')
    if (!passwordInput) {
      throw new Error('LoginForm: expected at least one <input type="password"> in the canvas.')
    }

    // WCAG 2.1 SC 1.3.5 Identify Input Purpose (AA), and what lets a password
    // manager offer the saved credential. Asserted here because no automated
    // gate can: axe's `autocomplete-valid` rule only validates values that are
    // PRESENT, so a missing attribute passes the a11y suite silently. The
    // sibling SignUpForm carries the mirror assertion for `new-password`.
    if (emailInput.getAttribute('autocomplete') !== 'username') {
      throw new Error(
        `LoginForm: the sign-in identifier must set autoComplete="username", received "${emailInput.getAttribute('autocomplete')}".`,
      )
    }
    if (passwordInput.getAttribute('autocomplete') !== 'current-password') {
      throw new Error(
        `LoginForm: the password input must set autoComplete="current-password", received "${passwordInput.getAttribute('autocomplete')}".`,
      )
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!submit) {
      throw new Error('LoginForm: expected at least one <button type="submit"> in the canvas.')
    }
  },
}

export const Playground: Story = {}

export const SignInMethods: Story = {
  name: 'Sign-in methods',
  render: () => <SignInMethodsSection />,
}

export const ReportingAnError: Story = {
  name: 'Reporting an error',
  render: () => <ReportingAnErrorSection />,
}

export const Width: Story = { name: 'Width', render: () => <WidthSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

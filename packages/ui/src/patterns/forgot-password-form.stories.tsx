/**
 * ForgotPasswordForm — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/ForgotPasswordForm                → this file: Docs, Default,
 *                                                Playground and one story per
 *                                                docs section
 *   Patterns/ForgotPasswordForm/Accessibility  → forgot-password-form.accessibility.stories.tsx
 *
 * ForgotPasswordForm is a registry block (Card + Field + Input + Button), the
 * reset-request step behind LoginForm's "Forgot your password?" link.
 * Consumers copy the source and adapt it rather than configure it through
 * props.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Callout } from '../components/callout.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { ForgotPasswordForm } from './forgot-password-form.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function ResetRequestSection() {
  return (
    <ExampleSection
      title='Reset request'
      description={
        <>
          One field, one action. Collect the email address, send the reset link, and offer the way
          back to sign-in. Keep it to the single field — a reset request needs nothing else, and
          every extra field is one more thing to get wrong when someone is already locked out.
        </>
      }
    >
      <Example code={`<ForgotPasswordForm className="w-full max-w-md" />`}>
        <ForgotPasswordForm className='w-full max-w-md' />
      </Example>
    </ExampleSection>
  )
}

function ConfirmationSection() {
  return (
    <ExampleSection
      title='Confirmation'
      description={
        <>
          After a submit, show the same message whether or not the address has an account. Saying an
          email was &ldquo;not found&rdquo; tells anyone who asks which addresses are registered.
          Replace the form with a <code>Callout</code> like this one in your copied source.
        </>
      }
    >
      <Example
        code={`<Callout status="success" title="Check your email">
  If an account uses that address, we've sent it a link to reset your password.
</Callout>`}
      >
        <div className='w-full max-w-md'>
          <Callout status='success' title='Check your email'>
            If an account uses that address, we&apos;ve sent it a link to reset your password. The
            link expires in 30 minutes.
          </Callout>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The reset step on a subtle page surface, where the white card reads as the one thing to complete.'
    >
      <Example surface='subtle'>
        <div className='w-full max-w-md'>
          <ForgotPasswordForm />
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ForgotPasswordFormDocs() {
  return (
    <DocsPage
      eyebrow='Pattern'
      title='ForgotPasswordForm'
      registry='forgot-password-form'
      summary={
        <>
          The password-reset request card behind LoginForm&apos;s &ldquo;Forgot your
          password?&rdquo; link, assembled from Card, Field, Input and Button. Copy the source, wire
          the email field to your own reset handler, and adapt the copy to your service.
        </>
      }
    >
      <DocsUsage
        use={[
          'The page LoginForm’s “Forgot your password?” link leads to.',
          'Any service that signs people in with an email and password it stores.',
          'A reference for a single-field form that does not reveal which accounts exist.',
        ]}
        avoid={[
          'Signing in — use LoginForm.',
          'Creating an account — use SignUpForm.',
          'Services that only use single sign-on — the identity provider owns password resets.',
        ]}
      />
      <ResetRequestSection />
      <ConfirmationSection />
      <InContextSection />
      <DocsApi description='ForgotPasswordForm takes the props of a div. Use className to set its width; anything more is a change to the copied source.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Patterns/ForgotPasswordForm',
  component: ForgotPasswordForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ForgotPasswordFormDocs },
  },
  args: {
    className: 'w-full max-w-md',
  },
  argTypes: {
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof ForgotPasswordForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector<HTMLInputElement>('input[type="email"]')
    if (!emailInput) {
      throw new Error('ForgotPasswordForm: expected an <input type="email"> in the canvas.')
    }

    // The email field must be programmatically labelled (WCAG 1.3.1).
    if (!emailInput.labels || emailInput.labels.length < 1) {
      throw new Error('ForgotPasswordForm: the email input has no associated <label>.')
    }

    // Single-field flow: no password input belongs on the reset request step.
    const passwordInput = canvasElement.querySelector<HTMLInputElement>('input[type="password"]')
    if (passwordInput) {
      throw new Error(
        'ForgotPasswordForm: the reset request step must not contain a password input.',
      )
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!submit) {
      throw new Error('ForgotPasswordForm: expected a <button type="submit"> in the canvas.')
    }
  },
}

export const Playground: Story = {}

export const ResetRequest: Story = {
  name: 'Reset request',
  render: () => <ResetRequestSection />,
}

export const Confirmation: Story = {
  name: 'Confirmation',
  render: () => <ConfirmationSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

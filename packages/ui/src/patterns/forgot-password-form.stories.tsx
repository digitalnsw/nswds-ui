/**
 * ForgotPasswordForm — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/ForgotPasswordForm                → this file: Docs, Default, Playground
 *   Patterns/ForgotPasswordForm/Features       → forgot-password-form.features.stories.tsx
 *   Patterns/ForgotPasswordForm/Accessibility  → forgot-password-form.accessibility.stories.tsx
 *
 * ForgotPasswordForm is a registry block (Card + Field + Input + Button), the
 * reset-request step behind LoginForm's "Forgot your password?" link.
 * Consumers copy the source and adapt it rather than configure it through
 * props.
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Callout } from '../components/callout.js'
import { Header, HeaderBrand } from '../components/header.js'
import { Masthead } from '../components/masthead.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { ForgotPasswordForm } from './forgot-password-form.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
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

export function AccountEnumerationSafetySection() {
  return (
    <ExampleSection
      title='Account-enumeration safety'
      description={
        <>
          When wiring the form, show the same confirmation message whether or not the submitted
          address has an account. Revealing that an email is &ldquo;not found&rdquo; lets an
          attacker enumerate registered users. The single-field layout keeps this easy to get right.
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

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          The reset step of a service&rsquo;s sign-in flow: the masthead and header above, and the
          form alone on the page — the &ldquo;Back to login&rdquo; link is the only other way on.
        </>
      }
    >
      <Example
        layout='fill'
        className='overflow-hidden p-0'
        code={`<Masthead />
<Header sticky={false}>
  <HeaderBrand sitename="Small Business Grants" />
</Header>
<main>
  <ForgotPasswordForm className="w-full max-w-md" />
</main>`}
      >
        <Masthead />
        <Header sticky={false}>
          <HeaderBrand sitename='Small Business Grants' />
        </Header>
        <div className='bg-background px-6 py-10'>
          <ForgotPasswordForm className='w-full max-w-md' />
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
          ForgotPasswordForm is a composed pattern that demonstrates how to assemble Card, Field,
          Input, and Button primitives into a password-reset request form. It is the destination of
          the &ldquo;Forgot your password?&rdquo; link in LoginForm. Copy the source, wire the email
          field to your own reset handler, and adapt the copy to your service.
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
      <DefaultSection />
      <AccountEnumerationSafetySection />
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
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      page: ForgotPasswordFormDocs,
      description: {
        component:
          'ForgotPasswordForm is a composed password-reset request pattern assembling Card, Field, Input, and Button. It is published as a worked example; consumers copy and adapt the source rather than configure it through props.',
      },
    },
  },
  args: {
    className: 'w-full max-w-md',
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Additional Tailwind utility classes merged onto the outer wrapper. Use to constrain width or override layout in context.',
      table: { category: 'Appearance' },
    },
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

export const Playground: Story = {
  render: (args) => (
    <div className='w-full max-w-md rounded-sm border border-border bg-background p-6'>
      <ForgotPasswordForm {...args} />
    </div>
  ),
}

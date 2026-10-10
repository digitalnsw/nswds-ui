/**
 * SignUpForm — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/SignUpForm                → this file: Docs, Default, Playground
 *   Patterns/SignUpForm/Features       → sign-up-form.features.stories.tsx
 *   Patterns/SignUpForm/Accessibility  → sign-up-form.accessibility.stories.tsx
 *
 * SignUpForm is a registry block (Card + Field + Input + Button), the
 * account-creation counterpart to LoginForm. Consumers copy the source and
 * adapt it rather than configure it through props.
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldDescription, FieldError, FieldLabel } from '../components/field.js'
import { Header, HeaderBrand } from '../components/header.js'
import { Input } from '../components/input.js'
import { Masthead } from '../components/masthead.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { SignUpForm } from './sign-up-form.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
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

export function PasswordManagerSection() {
  return (
    <ExampleSection
      title='Password manager & accessibility'
      description={
        <>
          The password field uses <code>autoComplete=&quot;new-password&quot;</code> so password
          managers offer a generated password, and the requirements hint is linked to the input via{' '}
          <code>aria-describedby</code> so it is announced to screen readers. Keep both when
          adapting the source. A <code>FieldDescription</code> inside the password{' '}
          <code>Field</code> makes that link for you: Base UI wires it up, so a screen reader reads
          the rules when the field takes focus.
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

export function ReportingAnErrorSection() {
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

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          The registration page of a grants portal: the masthead and header above, a page heading
          that says what the account is for, and the form as the one thing to complete. Give the
          page its own <code>h1</code>: the card&rsquo;s title is styled text, not a heading.
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
  <h1>Register for Small Business Grants</h1>
  <SignUpForm className="w-full max-w-md" />
</main>`}
      >
        <Masthead />
        <Header sticky={false}>
          <HeaderBrand sitename='Small Business Grants' />
        </Header>
        <div className='space-y-6 bg-background px-6 py-10'>
          <div className='max-w-md space-y-2'>
            <p className='text-3xl font-bold tracking-tight'>Register for Small Business Grants</p>
            <p className='text-base text-muted-foreground'>
              Create an account to apply for a grant, save your progress and track your application.
            </p>
          </div>
          <SignUpForm className='w-full max-w-md' />
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
          SignUpForm is a composed pattern that demonstrates how to assemble Card, Field, Input, and
          Button primitives into an account-creation form. It pairs with LoginForm&apos;s
          &ldquo;Sign up&rdquo; link. Copy the source, wire the fields to your own registration
          handler, and adapt the copy and terms links to your service.
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
      <DefaultSection />
      <PasswordManagerSection />
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
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      page: SignUpFormDocs,
      description: {
        component:
          'SignUpForm is a composed account-creation pattern assembling Card, Field, Input, and Button. It is published as a worked example; consumers copy and adapt the source rather than configure it through props.',
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

export const Playground: Story = {
  render: (args) => (
    <div className='w-full max-w-md rounded-sm border border-border bg-background p-6'>
      <SignUpForm {...args} />
    </div>
  ),
}

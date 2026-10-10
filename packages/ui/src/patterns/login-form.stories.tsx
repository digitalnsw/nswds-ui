/**
 * LoginForm — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/LoginForm                → this file: Docs, Default, Playground
 *   Patterns/LoginForm/Features       → login-form.features.stories.tsx
 *   Patterns/LoginForm/Accessibility  → login-form.accessibility.stories.tsx
 *
 * LoginForm is a composed pattern (Card + Field + Input + Button) rather than
 * a primitive. It is published as a worked example showing how to assemble the
 * primitives into a sign-in form; consumers are expected to copy and adapt it
 * rather than treat it as a black-box component.
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldError, FieldLabel } from '../components/field.js'
import { Input } from '../components/input.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from '../components/story-helpers.js'
import { LoginForm } from './login-form.js'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description={
        <>
          Three ways in, most recommended first: single sign-on, then email and password, then a
          magic link sent to the same address. A labelled separator divides each method so it reads
          as a distinct alternative, and only single sign-on carries solid emphasis — one primary
          action per view.
        </>
      }
    >
      <Example code={`<LoginForm className="w-full max-w-md" />`}>
        <LoginForm className='w-full max-w-md' />
      </Example>
    </ExampleSection>
  )
}

export function CustomisingThePatternSection() {
  return (
    <ExampleSection
      title='Customising the pattern'
      description={
        <>
          LoginForm exposes only a wrapper <code>className</code> prop on purpose — extending the
          pattern means copying the component source, not configuring it through props. Treat this
          file as the reference implementation: add a third-party SSO button, swap the footer link,
          or wire the form to a server action by editing the copied source directly.
        </>
      }
    >
      <Example
        layout='fill'
        code={`// components/login-form.tsx — your copy, after npx shadcn@latest add @nswds/login-form
<form action={signIn}>
  <FieldGroup>
    {/* remove the methods your service does not offer */}
  </FieldGroup>
</form>`}
      >
        <ol className='list-decimal space-y-3 ps-6 text-base leading-relaxed'>
          <li>
            Add it with <code>npx shadcn@latest add @nswds/login-form</code>. The source lands in
            your own <code>components/</code> folder.
          </li>
          <li>
            Remove the sign-in methods your service does not offer, change the copy, and point the
            &ldquo;Forgot your password?&rdquo; and &ldquo;Sign up&rdquo; links at your own routes.
          </li>
          <li>
            Give the <code>form</code> your own <code>action</code> or submit handler. Keep the{' '}
            <code>autoComplete</code> tokens and the link-after-input order — the Accessibility
            stories pin both.
          </li>
        </ol>
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

export function WidthSection() {
  return (
    <ExampleSection
      title='Width'
      description={
        <>
          The form fills its container, so set the width from outside with <code>className</code>.{' '}
          <code>max-w-md</code> suits a sign-in page (as above). At phone width the methods still
          stack and every label fits; at <code>max-w-xl</code>, the widest that still reads well,
          the inputs grow and the actions stay stacked. Past that the form looks lost — put a second
          column of content beside it instead.
        </>
      }
    >
      <Example code={`<LoginForm className="w-full max-w-xs" />`}>
        <ExampleCell label='max-w-xs — phone width'>
          <LoginForm className='w-80' />
        </ExampleCell>
      </Example>
      <Example code={`<LoginForm className="w-full max-w-xl" />`}>
        <ExampleCell label='max-w-xl — the widest'>
          <LoginForm className='w-xl max-w-full' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='A sign-in page on the brand band. The card keeps its own surface, so its fields and actions read the same on a coloured page as on a white one.'
    >
      {/* The band is drawn inside a plain panel rather than with surface='brand':
          that surface repoints --muted-foreground to white for text on the band,
          and the card inherits it, which would whiten its own muted text. */}
      <Example
        layout='fill'
        className='overflow-hidden p-0'
        code={`<main className="bg-primary p-8">
  <LoginForm className="mx-auto w-full max-w-md" />
</main>`}
      >
        <div className='bg-primary p-8'>
          <LoginForm className='w-full max-w-md' />
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
          LoginForm is a composed pattern that demonstrates how to assemble Card, Field, Input, and
          Button primitives into a sign-in form. It is intended as a starting point for
          customisation, not a black-box component — copy the source, adapt the fields, swap the
          providers, and wire it to your own form handler.
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
      <DefaultSection />
      <CustomisingThePatternSection />
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
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      page: LoginFormDocs,
      description: {
        component:
          'LoginForm is a composed sign-in pattern assembling Card, Field, Input, and Button. It is published as a worked example; consumers copy and adapt the source rather than configure it through props.',
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

export const Playground: Story = {
  render: (args) => (
    <div className='w-full max-w-md rounded-sm border border-border bg-background p-6'>
      <LoginForm {...args} />
    </div>
  ),
}

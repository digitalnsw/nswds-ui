/**
 * LoginForm — Accessibility (WCAG 2.2)
 *
 * LoginForm is a composed sign-in pattern, so the applicable success criteria
 * are those of a form pattern as a whole rather than any one primitive.
 * The criteria covered here:
 *
 *   1.3.1 Info and Relationships          (A)  — LabelAssociation
 *   2.4.3 Focus Order                     (A)  — FocusOrder
 *   3.3.1 Error Identification            (A)  — ErrorIdentification
 *   3.3.2 Labels or Instructions          (A)  — LabelsAndInstructions
 *   4.1.2 Name, Role, Value               (A)  — NameRoleValue
 *
 * 2.5.8 Target Size is not given its own story — LoginForm exposes no size
 * variants, and the inputs (48px tall) and buttons (44px+) trivially clear
 * the 24×24 CSS-pixel minimum.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../components/button.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card.js'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../components/field.js'
import { Input } from '../components/input.js'
import { wcagStoryMeta } from '../components/story-helpers.js'
import { LoginForm } from './login-form.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/LoginForm/Accessibility',
  component: LoginForm,
  parameters: {
    layout: 'padded',
  },
  args: {},
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

// The form no longer hardcodes ids (Field auto-associates and scopes ids per
// instance), so locate the inputs by their stable `type` instead.
function getInputByType(canvasElement: HTMLElement, type: string): HTMLInputElement {
  const input = canvasElement.querySelector<HTMLInputElement>(`input[type="${type}"]`)
  if (!input) throw new Error(`Could not find input[type="${type}"] in canvas.`)
  return input
}

// ─── 1.3.1 — Label Association ────────────────────────────────────────────────

export const LabelAssociation: Story = {
  name: '1.3.1 Label Association',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'Both the email and password inputs must be programmatically associated with a visible <label> so screen readers can announce the purpose of each field as the user moves through the form.',
          how: 'Run the canvas with VoiceOver or NVDA and Tab through each input — each should announce "Email, edit text" and "Password, secure edit text". The play() function asserts both inputs expose at least one entry in their .labels collection.',
          caveat:
            'The inputs carry no hardcoded ids — each Field associates its label with the control via Base UI, generating ids per instance, so two LoginForms on one page do not collide. The play() locates inputs by type rather than id for the same reason.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <LoginForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const email = getInputByType(canvasElement, 'email')
    if (!email.labels || email.labels.length < 1) {
      throw new Error('WCAG 1.3.1: the email input has no associated <label> via htmlFor/labels.')
    }

    const password = getInputByType(canvasElement, 'password')
    if (!password.labels || password.labels.length < 1) {
      throw new Error(
        'WCAG 1.3.1: the password input has no associated <label> via htmlFor/labels.',
      )
    }
  },
}

// ─── 2.4.3 — Focus Order ──────────────────────────────────────────────────────

export const FocusOrder: Story = {
  name: '2.4.3 Focus Order',
  parameters: {
    wcag: ['2.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.3',
          why: 'Tabbing through the form must visit controls in an order that matches the visual reading order: Single sign-on → Email → Password → Forgot link → Login → Magic link → Sign up. A surprising tab order breaks keyboard users.',
          how: 'Place focus inside the canvas, then Tab repeatedly. The play() function collects every focusable control (input, button, a[href], [tabindex]) in DOM order and asserts that sequence matches the expected reading order. With no tabindex overrides in the form, DOM order IS the Tab order, so this static check is equivalent to tabbing through.',
          caveat:
            'play() asserts DOM/focus order rather than dispatching real Tab key events, so it would not catch a positive `tabindex` that reorders traversal without changing DOM order. A live keyboard test in the rendered Storybook canvas is still recommended for sanity.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <LoginForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const email = getInputByType(canvasElement, 'email')
    const password = getInputByType(canvasElement, 'password')
    const forgot = canvasElement.querySelector<HTMLAnchorElement>('a[href="#"]')
    if (!forgot) {
      throw new Error('WCAG 2.4.3: could not find Forgot password link.')
    }
    const submit = canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!submit) {
      throw new Error('WCAG 2.4.3: could not find submit button.')
    }
    const ssoButton = Array.from(canvasElement.querySelectorAll<HTMLButtonElement>('button')).find(
      (btn) => btn.textContent?.toLowerCase().includes('single sign-on'),
    )
    if (!ssoButton) {
      throw new Error('WCAG 2.4.3: could not find "single sign-on" button.')
    }
    const magicLinkButton = Array.from(
      canvasElement.querySelectorAll<HTMLButtonElement>('button'),
    ).find((btn) => btn.textContent?.includes('magic link'))
    if (!magicLinkButton) {
      throw new Error('WCAG 2.4.3: could not find "magic link" button.')
    }
    const signUp = Array.from(canvasElement.querySelectorAll<HTMLAnchorElement>('a')).find(
      (a) => a.textContent?.trim() === 'Sign up',
    )
    if (!signUp) {
      throw new Error('WCAG 2.4.3: could not find Sign up link.')
    }

    // Collect every tabbable control in document order — this is what the
    // browser uses to resolve Tab traversal when no explicit tabIndex is set.
    const focusables = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        'input, button, a[href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'))

    const expectedOrder = [ssoButton, email, password, forgot, submit, magicLinkButton, signUp]
    for (let i = 0; i < expectedOrder.length; i++) {
      const expected = expectedOrder[i]
      const actual = focusables[i]
      if (actual !== expected) {
        throw new Error(
          `WCAG 2.4.3: expected tab position ${i} to be ${expected?.tagName.toLowerCase()} "${expected?.textContent?.trim() || (expected as HTMLInputElement)?.id}", got ${actual?.tagName.toLowerCase()} "${actual?.textContent?.trim() || (actual as HTMLInputElement)?.id}".`,
        )
      }
    }
  },
}

// ─── 3.3.1 — Error Identification ─────────────────────────────────────────────

export const ErrorIdentification: Story = {
  name: '3.3.1 Error Identification',
  parameters: {
    wcag: ['3.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.1',
          why: 'When sign-in fails, the offending field must be programmatically marked invalid and the reason must be announced. aria-invalid on the input plus a FieldError with role="alert" near the field satisfies both the visual and assistive-tech requirements.',
          how: 'Focus the password field with a screen reader running — it should announce "Password, invalid entry, Incorrect password". The play() function asserts aria-invalid="true" on the password input and that the FieldError element exists with non-empty text.',
          caveat:
            'Clear aria-invalid and remove the FieldError once the user corrects the value, otherwise AT keeps announcing the stale error. This story shows the persistent error state for review.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex w-full max-w-md flex-col gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='a11y-err-email'>Email</FieldLabel>
                <Input id='a11y-err-email' type='email' defaultValue='m@example.com' required />
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='a11y-err-password'>Password</FieldLabel>
                  <a
                    href='#'
                    className='ms-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id='a11y-err-password'
                  type='password'
                  defaultValue='wrong'
                  aria-invalid='true'
                  aria-describedby='a11y-err-password-error'
                  required
                />
                <FieldError id='a11y-err-password-error'>Incorrect password</FieldError>
              </Field>
              <Field>
                <Button type='submit'>Login</Button>
                <Button variant='outline' type='button'>
                  Login with Google
                </Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <a href='#'>Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const password = getInputByType(canvasElement, 'password')

    if (password.getAttribute('aria-invalid') !== 'true') {
      throw new Error('WCAG 3.3.1: aria-invalid="true" is missing on the password input.')
    }

    const describedBy = password.getAttribute('aria-describedby')
    if (!describedBy) {
      throw new Error('WCAG 3.3.1: aria-describedby is missing on the password input.')
    }

    const errEl = canvasElement.querySelector(`[id="${describedBy}"]`)
    if (!errEl) {
      throw new Error(
        `WCAG 3.3.1: aria-describedby="${describedBy}" but no element with that id exists.`,
      )
    }

    if (errEl.getAttribute('role') !== 'alert') {
      throw new Error(
        'WCAG 3.3.1: FieldError should expose role="alert" so the message is announced when it appears.',
      )
    }

    const text = errEl.textContent?.trim() ?? ''
    if (text.length === 0) {
      throw new Error('WCAG 3.3.1: FieldError exists but has empty text content.')
    }
  },
}

// ─── 3.3.2 — Labels or Instructions ───────────────────────────────────────────

export const LabelsAndInstructions: Story = {
  name: '3.3.2 Labels or Instructions',
  parameters: {
    wcag: ['3.3.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.2',
          why: 'Each field needs a visible label, and any companion instruction (like the Forgot password? link) must be positioned next to the field it relates to so sighted users see the relationship without reading the underlying markup.',
          how: 'Visually verify the Email and Password labels are above their inputs and that the Forgot link sits inline with the Password label, not in a detached footer. The play() function asserts both labels are non-empty and the Forgot link is rendered inside the same field group as the password input.',
          caveat:
            'Visible labels are non-negotiable here — do not replace them with placeholder text. Placeholder text disappears as soon as the user types and is reported inconsistently by assistive tech.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <LoginForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const email = getInputByType(canvasElement, 'email')
    const emailLabel = email.labels?.[0]?.textContent?.trim() ?? ''
    if (emailLabel.length === 0) {
      throw new Error('WCAG 3.3.2: the email input has no visible label text.')
    }

    const password = getInputByType(canvasElement, 'password')
    const passwordLabel = password.labels?.[0]?.textContent?.trim() ?? ''
    if (passwordLabel.length === 0) {
      throw new Error('WCAG 3.3.2: the password input has no visible label text.')
    }

    // The Forgot password? link must live in the same field group as the
    // password input — not in a detached footer — so the visual association
    // matches the labelled relationship.
    const passwordField = password.closest('[data-slot="field"]')
    if (!passwordField) {
      throw new Error(
        'WCAG 3.3.2: password input is not wrapped in a Field — companion instructions cannot be located relative to it.',
      )
    }
    const forgotLink = passwordField.querySelector<HTMLAnchorElement>('a')
    if (!forgotLink || !forgotLink.textContent?.toLowerCase().includes('forgot')) {
      throw new Error(
        'WCAG 3.3.2: the "Forgot password?" link must be inside the same field as the password input.',
      )
    }
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: '4.1.2 Name, Role, Value',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Every interactive control in the form must expose an accessible name and role to assistive technology. The submit button must announce as "Login, button"; the inputs must announce with their visible label text as their name.',
          how: 'Inspect each control in the browser accessibility tree (Chrome DevTools → Accessibility pane). The play() function asserts each input has a non-empty .labels[0] entry and that the submit button has accessible name "Login".',
          caveat:
            'If you swap the submit button text, update this assertion. The accessible name comes from the visible text content of the button via the Base UI Button primitive.',
        }),
      },
    },
  },
  render: () => (
    <div className='w-full max-w-md'>
      <LoginForm />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const email = getInputByType(canvasElement, 'email')
    const emailName = email.labels?.[0]?.textContent?.trim() ?? ''
    if (emailName.length === 0) {
      throw new Error('WCAG 4.1.2: the email input has no accessible name (label text is empty).')
    }

    const password = getInputByType(canvasElement, 'password')
    const passwordName = password.labels?.[0]?.textContent?.trim() ?? ''
    if (passwordName.length === 0) {
      throw new Error(
        'WCAG 4.1.2: the password input has no accessible name (label text is empty).',
      )
    }

    const submit = canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!submit) {
      throw new Error('WCAG 4.1.2: submit button not found.')
    }
    const submitName = (submit.getAttribute('aria-label') ?? submit.textContent ?? '').trim()
    if (submitName !== 'Login') {
      throw new Error(
        `WCAG 4.1.2: expected submit button accessible name "Login", got "${submitName}".`,
      )
    }
  },
}

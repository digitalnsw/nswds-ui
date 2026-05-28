/**
 * LoginForm — Features
 *
 * LoginForm is a composed pattern, not a primitive with variants. The stories
 * in this file demonstrate how the pattern responds at different container
 * widths, on different surface treatments, and how to extend it with field
 * errors. Stories that customise the pattern use a hand-rolled render that
 * copies the LoginForm composition — this doubles as an authoring guide for
 * consumers extending the pattern in their own codebases.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button.js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card.js'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from './field.js'
import { Input } from './input.js'
import { LoginForm } from './login-form.js'
import { docsTemplate } from './story-helpers.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/LoginForm/Features',
  component: LoginForm,
  parameters: {
    layout: 'padded',
  },
  args: {},
} satisfies Meta<typeof LoginForm>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'LoginForm rendered in its default max-w-md container — the size most consumers will reach for when dropping the pattern into a sign-in route.',
          why: 'Establishes the baseline visual for the pattern so design QA can spot regressions against the canonical Card + Field + Input + Button composition.',
          how: 'Visually compare against the published Figma frame. Confirm the card has a single primary action, an outline Google sign-in, and a footer with the sign-up link.',
          caveat: 'The form is presentational only — the submit button does not POST anywhere. Wire the form to a server action when copying into a real app.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-md">
      <LoginForm />
    </div>
  ),
}

export const Wide: Story = {
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'LoginForm constrained to max-w-xl instead of the default max-w-md — useful for marketing pages where the form sits inside a roomier hero card.',
          why: 'Confirms the inner Field and Button layout still reads naturally when the card has more horizontal space; nothing should stretch or grow whitespace inappropriately.',
          how: 'Verify the inputs expand to fill the wider card and the action buttons remain stacked rather than going side-by-side.',
          caveat: 'Going beyond max-w-xl is not recommended — the form starts to look lonely in a wide card. Use a two-column layout (form + marketing copy) instead.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-xl">
      <LoginForm />
    </div>
  ),
}

export const LightCardOnDark: Story = {
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'LoginForm rendered inside a dark NSW grey-900 container, simulating a sign-in page that uses a branded dark background behind a light card.',
          why: 'Verifies that the Card primitive — and therefore LoginForm — maintains sufficient surface contrast against an arbitrary dark page background.',
          how: 'Visually confirm the card still reads as the primary surface, the input borders remain visible, and the outline Google button does not blend into the page background.',
          caveat: 'Toggling Storybook into dark mode is a different test — that flips the tokens inside the card, not the page around it. This story stresses the page-surface case only.',
        }),
      },
    },
  },
  render: () => (
    <div className="flex min-h-[32rem] items-center justify-center bg-grey-900 p-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  ),
}

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'A LoginForm with a FieldError on the password field, demonstrating how to extend the pattern when the form returns a validation error.',
          why: 'LoginForm itself does not handle errors — this story is the authoring guide for consumers who need to add inline validation. The render copies the LoginForm composition wholesale and adds the error surface so the diff against login-form.tsx is small.',
          how: 'Compare this render against packages/ui/src/components/login-form.tsx. The only changes are: the password Input has aria-invalid, a FieldError follows the Input, and the Forgot link text is unchanged.',
          caveat: 'In production code, derive aria-invalid and the FieldError message from your form state library (e.g. react-hook-form, formik, conform). Hardcoding them here is for illustration only.',
        }),
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="login-error-email">Email</FieldLabel>
                <Input
                  id="login-error-email"
                  type="email"
                  defaultValue="m@example.com"
                  required
                />
              </Field>
              {/*
               * Mirrors the focus-order pattern from login-form.tsx: the
               * "Forgot your password?" link is placed AFTER the input in DOM
               * order (so Tab goes email → password → forgot, not email →
               * forgot → password) and positioned at the top-right via
               * absolute positioning. See WCAG 2.4.3 Focus Order.
               */}
              <Field className="relative">
                <FieldLabel htmlFor="login-error-password">
                  Password
                </FieldLabel>
                <Input
                  id="login-error-password"
                  type="password"
                  defaultValue="wrong"
                  aria-invalid="true"
                  aria-describedby="login-error-password-error"
                  required
                />
                <a
                  href="#"
                  className="absolute top-0 right-0 text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
                <FieldError id="login-error-password-error">
                  Incorrect password
                </FieldError>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  ),
}

export const MobileNarrow: Story = {
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'LoginForm constrained to max-w-xs to simulate the layout on a narrow mobile viewport.',
          why: 'Ensures the card padding, input height, and stacked buttons still hold up at the narrowest realistic width — useful for spotting overflow or cramped spacing before shipping to mobile.',
          how: 'Confirm the Forgot link does not wrap awkwardly onto its own line, the inputs stay full-width, and the Google sign-in button label fits without truncation.',
          caveat: 'The pattern is not responsive on its own — at very narrow widths consider replacing the inline Forgot link with a stacked layout.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-xs">
      <LoginForm />
    </div>
  ),
}

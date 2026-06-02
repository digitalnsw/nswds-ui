'use client'

import type * as React from 'react'

import { Button } from '../components/button.js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/card.js'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../components/field.js'
import { Icons } from '../components/icons.js'
import { Input } from '../components/input.js'
import { LabeledSeparator } from '../components/labeled-separator.js'
import { Link } from '../components/link.js'
import { cn } from '../lib/utils.js'

/**
 * SignUpForm — the account-creation counterpart to LoginForm.
 *
 * A composed pattern (Card + Field + Input + Button), published as a worked
 * example: copy the source and wire the fields to your own registration
 * handler rather than configuring it through props.
 *
 * Best-practice notes baked in:
 *  - Single sign-on (Microsoft Entra ID) leads as the recommended path with
 *    solid emphasis; email + password registration is the fallback, grouped
 *    in a FieldSet whose legend names the set for assistive tech.
 *  - `autoComplete="new-password"` on both the password and confirm-password
 *    fields tells password managers to offer/save a generated password (vs.
 *    the `current-password` hint LoginForm uses).
 *  - A visible password-requirements hint is associated with the input via
 *    `aria-describedby` so screen readers announce the rules (WCAG 3.3.2).
 *  - Terms acceptance is communicated inline at the point of action rather
 *    than via a pre-checked checkbox.
 */
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              {/*
               * Single sign-on first: NSW Government staff authenticate with
               * Microsoft Entra ID, so SSO is the recommended path and carries
               * primary (solid) emphasis. Email + password registration is the
               * fallback below the separator.
               */}
              <Field>
                <FieldDescription>
                  Use your NSW Government Microsoft Entra ID account to sign up
                  with a single click — no separate password required.
                </FieldDescription>
                <Button type="button">
                  <Icons.login />
                  Create account with Microsoft Entra ID
                </Button>
              </Field>

              <LabeledSeparator>or</LabeledSeparator>

              {/*
               * Email + password registration grouped in a FieldSet so the
               * "Register with email and password" legend names the whole set
               * for assistive tech, not just one field.
               */}
              <FieldSet>
                <FieldLegend className="text-base">
                  Register with email and password
                </FieldLegend>
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Citizen"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    aria-describedby="password-requirements"
                    required
                  />
                  <FieldDescription id="password-requirements">
                    Use at least 8 characters, including a number and a symbol.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </Field>
              </FieldSet>
              <Field>
                <Button type="submit">
                  <Icons.person_add />
                  Create account
                </Button>
                <FieldDescription className="text-center">
                  By creating an account you agree to our{' '}
                  <Link href="#">Terms of Service</Link> and{' '}
                  <Link href="#">Privacy Policy</Link>.
                </FieldDescription>
              </Field>
              <Field>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="#">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

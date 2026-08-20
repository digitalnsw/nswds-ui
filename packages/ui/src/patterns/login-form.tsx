'use client'

import type * as React from 'react'

import { Button } from '../components/button.js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card.js'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../components/field.js'
import { Input } from '../components/input.js'
import { LabeledSeparator } from '../components/labeled-separator.js'
import { Link } from '../components/link.js'
import { Separator } from '../components/separator.js'
import { IconKey } from '../icons/key.js'
import { IconLogin } from '../icons/login.js'
import { IconMail } from '../icons/mail.js'
import { cn } from '../lib/utils.js'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Choose how you&apos;d like to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              {/*
               * Best-practice sign-in order, most-recommended first:
               *   1. Single sign-on (SSO) — the preferred path
               *   2. Email + password     — the traditional fallback
               *   3. Magic link           — passwordless, reuses the email
               * Each method is divided by a LabeledSeparator so it reads as a
               * distinct alternative. Only SSO carries primary (solid)
               * emphasis — one primary action per view — with password Login
               * and the magic link stepped down to outline treatments.
               */}
              {/* 1 — Single sign-on: the recommended first option */}
              <Field>
                <Button type='button'>
                  <IconLogin />
                  Continue with single sign-on
                </Button>
              </Field>
              <LabeledSeparator>or sign in with email</LabeledSeparator>
              {/* 2 — Email + password.
               * No htmlFor/id wiring: each control sits in a Field, which
               * associates the label (and any description/error) with the input
               * automatically via Base UI, generating ids per instance — so two
               * LoginForms on one page don't collide.
               *
               * autoComplete is not decoration: it is the technique that
               * satisfies WCAG 2.1 SC 1.3.5 Identify Input Purpose (AA), and
               * it is what lets a password manager offer the saved credential.
               * `username` — not `email` — is the correct token for a sign-in
               * identifier even when the control is type="email": managers pair
               * `username` with `current-password` to recognise a login form.
               * (SignUpForm uses `new-password` for the same reason in reverse.)
               * Note that axe cannot catch this — `autocomplete-valid` only
               * checks values that are present, so a missing attribute passes
               * every automated gate. */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type='email' autoComplete='username' placeholder='m@example.com' required />
              </Field>
              <Field className='relative [&>a]:w-auto'>
                <FieldLabel>Password</FieldLabel>
                <Input type='password' autoComplete='current-password' required />
                {/*
                 * Placed AFTER the input in DOM (rather than next to the
                 * label) so keyboard tab order is email → password → forgot,
                 * not email → forgot → password. Visually positioned at the
                 * top-right via absolute positioning to preserve the
                 * "Forgot your password?" alongside-label layout. See WCAG
                 * 2.4.3 Focus Order test in
                 * login-form.accessibility.stories.tsx.
                 */}
                <Link href='#' className='absolute top-0 right-0 text-sm'>
                  Forgot your password?
                </Link>
              </Field>
              <Field>
                <Button type='submit' variant='outline' color='primary'>
                  <IconKey />
                  Login
                </Button>
              </Field>
              {/* 3 — Magic link: passwordless, sent to the email entered above */}
              <LabeledSeparator>or</LabeledSeparator>
              <Field>
                <Button type='button' variant='outline' color='grey'>
                  <IconMail />
                  Email me a magic link instead
                </Button>
                <FieldDescription>
                  We&apos;ll send a password-free sign-in link to the email above.
                </FieldDescription>
              </Field>
              <Separator />
              <Field>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <Link href='#'>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

// Copied from packages/ui/src/patterns/forgot-password-form.tsx for the docs live preview,
// with imports rewritten to the published @nswds/ui surface — the same
// copy-and-adapt flow registry consumers use. Regenerate by re-copying the
// source if the upstream pattern changes.

import type * as React from 'react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Link,
} from '@nswds/ui'

/**
 * ForgotPasswordForm — the password-reset request step that pairs with the
 * "Forgot your password?" link in LoginForm.
 *
 * A composed pattern (Card + Field + Input + Button), published as a worked
 * example: copy the source and wire the single email field to your own reset
 * handler rather than configuring it through props.
 *
 * Single-field by design. The flow is intentionally minimal — collect the
 * email, send the reset link, and (for account-enumeration safety) show the
 * same confirmation whether or not the address is registered.
 */
export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter the email address for your account and we&apos;ll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              {/* No htmlFor/id wiring: the Field associates the label with the
               * control automatically (Base UI generates the id per instance). */}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type='email' autoComplete='email' placeholder='m@example.com' required />
              </Field>
              <Field>
                <Button type='submit'>Send reset link</Button>
              </Field>
              <Field>
                <FieldDescription className='text-center'>
                  Remembered your password? <Link href='#'>Back to login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

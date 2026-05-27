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
} from '../components/field.js'
import { Input } from '../components/input.js'
import { cn } from '../lib/utils.js'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="w-full px-6 py-10">
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field className="relative">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
                {/*
                 * Placed AFTER the input in DOM (rather than next to the
                 * label) so keyboard tab order is email → password → forgot,
                 * not email → forgot → password. Visually positioned at the
                 * top-right via absolute positioning to preserve the
                 * "Forgot your password?" alongside-label layout. See WCAG
                 * 2.4.3 Focus Order test in
                 * login-form.accessibility.stories.tsx.
                 */}
                <a
                  href="#"
                  className="absolute top-0 right-0 text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
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
  )
}

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Section,
} from '@nswds/ui'
import type * as React from 'react'

/** The centred column the three auth pages share. */
function AuthSection({ children }: { children: React.ReactNode }) {
  return (
    <Section>
      <Container className='flex justify-center'>
        <Card size='default' className='w-full max-w-md'>
          {children}
        </Card>
      </Container>
    </Section>
  )
}

/** The sign-in page's body: a card around `SignInForm`. */
export function SignInPanel({ children }: { children: React.ReactNode }) {
  return (
    <AuthSection>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back. Enter your details to continue.</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </AuthSection>
  )
}

/** The sign-up page's body: a card around `SignUpForm`. */
export function SignUpPanel({ children }: { children: React.ReactNode }) {
  return (
    <AuthSection>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Set up an account with your email and a password.</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </AuthSection>
  )
}

export interface AccountPanelProps {
  /** The signed-in user, from `auth.api.getSession` in the page. */
  user: { name: string; email: string }
  /** The sign-out control, rendered in the card's action slot. */
  action: React.ReactNode
}

/** A minimal signed-in view: who is signed in, and the way out. */
export function AccountPanel({ user, action }: AccountPanelProps) {
  return (
    <AuthSection>
      <CardHeader>
        <CardTitle>You&rsquo;re signed in</CardTitle>
        <CardDescription>This page is only visible while you have a session.</CardDescription>
        <CardAction>{action}</CardAction>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm'>
          <dt className='font-bold text-foreground'>Name</dt>
          <dd className='text-muted-foreground'>{user.name}</dd>
          <dt className='font-bold text-foreground'>Email</dt>
          <dd className='text-muted-foreground'>{user.email}</dd>
        </dl>
      </CardContent>
    </AuthSection>
  )
}

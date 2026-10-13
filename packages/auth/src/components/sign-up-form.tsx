'use client'

import { Button, Callout, Input, Label } from '@nswds/ui'
import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { getAuthClient } from '../client'

export interface SignUpFormProps {
  /**
   * The app's `basePath`, as passed to `createAuth`: which app's endpoints to
   * call. Unset for an app at the root.
   */
  basePath?: string
  /** Where to go once registered. `next/link`-style: under the app's `basePath`. */
  homeHref?: Route
  /** The sign-in page, linked under the form. */
  signInHref?: Route
}

/**
 * Email + password registration. On success Better Auth sets the session
 * cookie and we send the new user to `homeHref`; `router.refresh()` re-runs
 * the server components so the signed-in state is picked up immediately.
 *
 * Registration is gated to an email allowlist server-side (see `createAuth`);
 * a disallowed address fails here with the 403 message surfaced in the Callout.
 * The hrefs are `Route`s so an app with `typedRoutes` checks what it passes;
 * the defaults are cast because they name routes of the app that renders the
 * form, which this package cannot know.
 */
export function SignUpForm({
  basePath,
  homeHref = '/' as Route,
  signInHref = '/sign-in' as Route,
}: SignUpFormProps) {
  const client = getAuthClient(basePath)
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const { error } = await client.signUp.email({ name, email, password })

    if (error) {
      setError(error.message ?? 'Could not create your account. Please try again.')
      setPending(false)
      return
    }

    router.push(homeHref)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4' noValidate>
      {error ? (
        <Callout role='alert' status='danger' title='Sign up failed'>
          {error}
        </Callout>
      ) : null}

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='name'>Full name</Label>
        <Input
          id='name'
          name='name'
          type='text'
          autoComplete='name'
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          name='password'
          type='password'
          autoComplete='new-password'
          required
          minLength={8}
          aria-describedby='password-hint'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p id='password-hint' className='text-sm text-muted-foreground'>
          At least 8 characters.
        </p>
      </div>

      <Button type='submit' color='primary' disabled={pending} className='w-full'>
        {pending ? 'Creating account…' : 'Create account'}
      </Button>

      <p className='text-center text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link href={signInHref} className='font-bold text-[var(--primary)] underline'>
          Sign in
        </Link>
      </p>
    </form>
  )
}

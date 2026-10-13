'use client'

import { Button, Callout, Input, Label } from '@nswds/ui'
import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { getAuthClient } from '../client'

export interface SignInFormProps {
  /**
   * The app's `basePath`, as passed to `createAuth`: which app's endpoints to
   * call. Unset for an app at the root.
   */
  basePath?: string
  /** Where to go once signed in. `next/link`-style: under the app's `basePath`. */
  homeHref?: Route
  /** The sign-up page, linked under the form. */
  signUpHref?: Route
}

/**
 * Email + password sign-in. On success Better Auth sets the session cookie and
 * we send the user to `homeHref`; `router.refresh()` re-runs the server
 * components so the signed-in state is picked up immediately.
 * The hrefs are `Route`s so an app with `typedRoutes` checks what it passes;
 * the defaults are cast because they name routes of the app that renders the
 * form, which this package cannot know.
 */
export function SignInForm({
  basePath,
  homeHref = '/' as Route,
  signUpHref = '/sign-up' as Route,
}: SignInFormProps) {
  const client = getAuthClient(basePath)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const { error } = await client.signIn.email({ email, password })

    if (error) {
      setError(error.message ?? 'Invalid email or password.')
      setPending(false)
      return
    }

    router.push(homeHref)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4' noValidate>
      {error ? (
        <Callout role='alert' status='danger' title='Sign in failed'>
          {error}
        </Callout>
      ) : null}

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
          autoComplete='current-password'
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Button type='submit' color='primary' disabled={pending} className='w-full'>
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className='text-center text-sm text-muted-foreground'>
        Don&rsquo;t have an account?{' '}
        <Link href={signUpHref} className='font-bold text-[var(--primary)] underline'>
          Create one
        </Link>
      </p>
    </form>
  )
}

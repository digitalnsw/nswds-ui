'use client'

import { Button, Callout, Input, Label } from '@nswds/ui'
import type { Route } from 'next'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'

import { getAuthClient, settle } from '../client'
import { replacementAddress, RETURN_PARAM, safeReturnPath } from '../return-path'

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
 * we send the user to the page the gate turned them away from (`from` in the
 * URL, when it is a path of this app) or else to `homeHref`; `router.refresh()`
 * re-runs the server components so the signed-in state is picked up immediately.
 * The hrefs are `Route`s so an app with `typedRoutes` checks what it passes;
 * the defaults are cast because they name routes of the app that renders the
 * form, which this package cannot know.
 */
/**
 * The page to return to after sign-in, from the gate's `from` parameter. Read at
 * submit time rather than through `useSearchParams`, so the statically rendered
 * sign-in page needs no Suspense boundary and ships its form in the HTML.
 */
export function returnPath(): string | null {
  if (typeof window === 'undefined') return null
  return safeReturnPath(new URLSearchParams(window.location.search).get(RETURN_PARAM))
}

/**
 * Send a visitor who has just signed in or up on to `destination`: by a full
 * document load that replaces this page when its address carries the gate's
 * `from` (`replacementAddress`), else by a client-side push, refreshing the
 * server components so the signed-in state is picked up.
 */
export function leaveAuthPage(
  router: ReturnType<typeof useRouter>,
  routePathname: string,
  destination: string,
): void {
  const replacement = replacementAddress(window.location, routePathname, destination)
  if (replacement) {
    window.location.replace(replacement)
    return
  }
  // The return path is checked to be a path of this app (`safeReturnPath`);
  // an app with `typedRoutes` cannot know it statically, hence the cast.
  router.push(destination as Route)
  router.refresh()
}

/** The URL never changes under the form, so there is nothing to subscribe to. */
const subscribeToNothing = () => () => {}
const noReturnPath = () => null

/**
 * The return path for the link to the other form: `null` on the server and in
 * the hydrating render (there is no URL to read), the parameter once mounted,
 * so the link gains `?from=` and a visitor who switches forms still lands
 * where they were going.
 */
export function useReturnPath(): string | null {
  return useSyncExternalStore(subscribeToNothing, returnPath, noReturnPath)
}

/** `href` with the return path carried along as `from`, when there is one. */
export function withReturnPath(
  href: Route,
  from: string | null,
): Route | { pathname: Route; query: Record<string, string> } {
  return from ? { pathname: href, query: { [RETURN_PARAM]: from } } : href
}

export function SignInForm({
  basePath,
  homeHref = '/' as Route,
  signUpHref = '/sign-up' as Route,
}: SignInFormProps) {
  const client = getAuthClient(basePath)
  const router = useRouter()
  const pathname = usePathname()
  const from = useReturnPath()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const { error } = await settle((signal) =>
      client.signIn.email({ email, password, fetchOptions: { signal } }),
    )

    if (error) {
      setError(error.message ?? 'Invalid email or password.')
      setPending(false)
      return
    }

    leaveAuthPage(router, pathname, returnPath() ?? homeHref)
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
        <Link
          href={withReturnPath(signUpHref, from)}
          className='font-bold text-[var(--primary)] underline'
        >
          Create one
        </Link>
      </p>
    </form>
  )
}

'use client'

import { Button } from '@nswds/ui'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { getAuthClient } from '../client'

export interface SignOutButtonProps {
  /**
   * The app's `basePath`, as passed to `createAuth`: which app's endpoints to
   * call. Unset for an app at the root.
   */
  basePath?: string
  /**
   * Where to go once signed out. `next/link`-style: under the app's `basePath`;
   * a `Route` for an app with `typedRoutes`.
   */
  signInHref?: Route
  size?: 'default' | 'sm'
  className?: string
}

/**
 * Ends the session and returns to the sign-in page. `router.refresh()` re-runs
 * the server components so the now-signed-out state is reflected at once.
 *
 * Only navigates on success: a failed sign-out leaves the session live, so
 * bouncing to the sign-in page would just be redirected back into the app and
 * the user would silently still be signed in. On failure we re-enable the
 * control and announce the error in a live region beside it; the chrome mounts
 * no toaster, so the message is rendered inline rather than toasted.
 */
export function SignOutButton({
  basePath,
  signInHref = '/sign-in' as Route,
  size = 'default',
  className,
}: SignOutButtonProps) {
  const client = getAuthClient(basePath)
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setPending(true)
    setError(null)
    const { error } = await client.signOut()

    if (error) {
      setError(error.message ?? 'Could not sign you out. Please try again.')
      setPending(false)
      return
    }

    router.push(signInHref)
    router.refresh()
  }

  return (
    <>
      <Button
        type='button'
        variant='outline'
        color='primary'
        size={size}
        className={className}
        disabled={pending}
        onClick={handleClick}
      >
        {pending ? 'Signing out…' : 'Sign out'}
      </Button>
      <p role='alert' className='text-sm text-[var(--danger-text)]'>
        {error}
      </p>
    </>
  )
}

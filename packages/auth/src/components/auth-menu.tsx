'use client'

import type { Route } from 'next'

import { getAuthClient } from '../client'
import { SignOutButton } from './sign-out-button'

export interface AuthMenuProps {
  /**
   * The app's `basePath`, as passed to `createAuth`: which app's session to
   * read. Unset for an app at the root.
   */
  basePath?: string
  /** Where to go once signed out. `next/link`-style: under the app's `basePath`. */
  signInHref?: Route
}

/**
 * The signed-in control in the header: a sign out button. Renders nothing
 * while the session is loading or when signed out — signed-out visitors are
 * on the sign-in page anyway (the proxy sees to that), so there is no separate
 * "Sign in" affordance to show here.
 *
 * Pre-launch only: the maintainer's way out of the gated preview. One outline
 * button in the brand ink, sized for the header's actions; the account page
 * stays reachable by URL.
 */
export function AuthMenu({ basePath, signInHref }: AuthMenuProps) {
  const { data: session, isPending } = getAuthClient(basePath).useSession()

  if (isPending || !session) {
    return null
  }

  return (
    <SignOutButton
      basePath={basePath}
      signInHref={signInHref}
      size='sm'
      className='whitespace-nowrap'
    />
  )
}

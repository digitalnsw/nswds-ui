import { AccountPanel, SignOutButton } from '@workspace/auth/components'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Your account.',
  robots: { index: false, follow: false },
}

/**
 * A minimal signed-in view. Reading the session forwards the request headers
 * (the session cookie) to Better Auth, which makes this route dynamic. No
 * session means not signed in — send them to the sign-in page.
 */
export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/sign-in')
  }

  return <AccountPanel user={session.user} action={<SignOutButton />} />
}

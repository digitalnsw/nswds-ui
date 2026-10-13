import { createAuthClient } from 'better-auth/react'

import { authBasePath } from './base-path'

/**
 * The browser-side auth client for one app, by the app's `basePath` — the same
 * value the app passes to `createAuth`, so the client calls the endpoints where
 * that app mounted them. No origin is set: the React client defaults to the
 * current origin, which is what we want here — the API is mounted on this same
 * app, and the dev servers' ports vary, so same-origin inference is more robust
 * than pinning a URL. Only the path is given, so a zone under `/infographics`
 * or `/signature` reaches its own endpoints.
 *
 * One client per path, built on first use and cached: the components take the
 * path as a prop (a string a server component can pass; the client itself,
 * being a bag of functions, is not serialisable across that boundary) and all
 * share the one instance, so `useSession` in the header and a sign-out
 * elsewhere observe the same session store.
 *
 * Exposes `signIn`, `signUp`, `signOut`, `useSession`, `getSession`, etc.
 */
const clients = new Map<string, AppAuthClient>()

export function getAuthClient(basePath = ''): AppAuthClient {
  const path = authBasePath(basePath)
  let client = clients.get(path)
  if (!client) {
    client = createAuthClient({ basePath: path })
    clients.set(path, client)
  }
  return client
}

export type AppAuthClient = ReturnType<typeof createAuthClient>

/** What `signOutEverywhere` needs of a client; typed structurally so a test can stub it. */
interface SignOutClient {
  revokeSessions: () => Promise<{ error: { message?: string; status?: number } | null }>
  signOut: () => Promise<{ error: { message?: string; status?: number } | null }>
}

/**
 * Sign out of every session the user holds, this one included, then clear this
 * browser's cookies.
 *
 * One sign-in covers every NSW Design site, and a session design.nsw.gov.au
 * issued before the cookies were renamed (`SESSION_COOKIE_PREFIX`) is not the
 * one a browser presents, so a plain sign-out would leave it valid in the
 * database, where a rollback to the old cookie name would read it again.
 *
 * Revoking is the step that must report failure: Better Auth's sign-out logs a
 * failed session deletion, clears the cookie and still answers success, so it
 * cannot be trusted to end a session; `revokeSessions` throws instead. If it
 * fails, nothing further is tried and the error is returned, so the visitor
 * stays signed in and can retry. If this session is already gone (401) there
 * is nothing to revoke and sign-out runs to clear the cookies, which is also
 * how a retry after a failed sign-out completes.
 */
export async function signOutEverywhere(
  client: SignOutClient,
): Promise<{ error: { message?: string; status?: number } | null }> {
  const revoked = await client.revokeSessions()
  // 401: this session is already gone from the database (revoked on another
  // device or site, by the revoke script, or by an earlier attempt whose
  // sign-out then failed), so there is nothing left to revoke. Sign-out still
  // clears this browser's cookies.
  if (revoked.error && revoked.error.status !== 401) return revoked
  return client.signOut()
}

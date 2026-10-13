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

/** Shown when the request never reached the server (offline, DNS, a dropped connection). */
export const UNREACHABLE = 'Could not reach the server. Check your connection and try again.'

/**
 * Shown when the request was aborted at the deadline. The server may still
 * have acted on it, so a caller whose request is not safe to repeat (sign-up)
 * checks `error.code === 'TIMEOUT'` and says so.
 */
export const TIMED_OUT = 'The server took too long to answer. Please try again.'

/** How long an auth request may take before it is aborted and reported as `TIMED_OUT`. */
export const AUTH_TIMEOUT_MS = 15_000

/**
 * Run a Better Auth client call and always get a result back. The client
 * resolves with `{ error }` for an error the server answers with, but rejects
 * when the request fails before that (offline, a dropped connection), which
 * would skip a caller's error path and leave its control pending forever.
 * A stalled connection may never settle at all, so the call also gets a
 * deadline: after `timeoutMs` its request is aborted through the signal it is
 * given, and `{ data: null, error: { message: TIMED_OUT, code: 'TIMEOUT' } }`
 * is returned without waiting for the call to notice. A rejection becomes
 * `{ data: null, error: { message: UNREACHABLE } }`, so the same error path
 * handles all three. The same helper lives in nswds-design's
 * `src/lib/auth-client.ts`.
 */
export async function settle<T extends { error: unknown }>(
  call: (signal: AbortSignal) => Promise<T>,
  timeoutMs = AUTH_TIMEOUT_MS,
): Promise<T | { data: null; error: { message: string; status?: number; code?: 'TIMEOUT' } }> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const reason = new DOMException(`Auth request took over ${timeoutMs} ms`, 'TimeoutError')
      controller.abort(reason)
      reject(reason)
    }, timeoutMs)
  })
  try {
    return await Promise.race([call(controller.signal), deadline])
  } catch (cause) {
    // Keep the cause visible: a bug inside `call` would otherwise read as a network failure.
    console.error('Auth request rejected', cause)
    // Only the deadline aborts this controller.
    if (controller.signal.aborted)
      return { data: null, error: { message: TIMED_OUT, code: 'TIMEOUT' } }
    return { data: null, error: { message: UNREACHABLE } }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * A timed-out sign-up may still have created the account on the server, and a
 * second attempt would then fail as a duplicate, so point the visitor at
 * signing in first.
 */
export const SIGN_UP_TIMED_OUT =
  'The server took too long to answer, so your account may have been created. Try signing in before signing up again.'

/** The message the sign-up form shows for a failed attempt. */
export function signUpErrorMessage(error: { message?: string; code?: string }): string {
  if (error.code === 'TIMEOUT') return SIGN_UP_TIMED_OUT
  return error.message ?? 'Could not create your account. Please try again.'
}

/** What `signOutEverywhere` needs of a client; typed structurally so a test can stub it. */
type AbortableCall = (options: {
  fetchOptions: { signal: AbortSignal }
}) => Promise<{ error: { message?: string; status?: number } | null }>

interface SignOutClient {
  revokeSessions: AbortableCall
  signOut: AbortableCall
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
 * stays signed in and can retry.
 *
 * If this session is already gone (401), the browser is already signed out and
 * has no session left to act with, so it cannot revoke any other: sign-out
 * runs to clear its cookies, and the visitor lands on the sign-in page, which
 * is all the controls promise. Any other session then ends at its own expiry
 * or its own sign-out. This is also how a retry completes when a sign-out
 * failed after its revoke had already ended every session.
 */
export async function signOutEverywhere(
  client: SignOutClient,
): Promise<{ error: { message?: string; status?: number } | null }> {
  const revoked = await settle((signal) => client.revokeSessions({ fetchOptions: { signal } }))
  // 401: this session is already gone from the database (revoked on another
  // device or site, by the revoke script, or by an earlier attempt whose
  // sign-out then failed). With no session there is no authority to revoke
  // others; sign-out still clears this browser's cookies.
  if (revoked.error && revoked.error.status !== 401) return { error: revoked.error }
  return settle((signal) => client.signOut({ fetchOptions: { signal } }))
}

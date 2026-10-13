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

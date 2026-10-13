import { createAuth } from '@workspace/auth/server'

/**
 * The Better Auth server instance for this app — shared by the route handler
 * (`app/api/auth/[...all]`), the proxy and any server-side session read. One
 * database and one secret serve every app in this repo, so a session signed in
 * here is valid across the domain. This app owns the shared domain's root, so
 * its endpoints are at `/api/auth`.
 */
export const auth = createAuth()

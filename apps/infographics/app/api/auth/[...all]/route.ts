import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/lib/auth'

/**
 * Better Auth's catch-all endpoint. Every client call (`signIn.email`,
 * `signUp.email`, `signOut`, session reads, …) is an HTTP request to a path
 * under this route, and this handler serves all of them.
 */
export const { GET, POST } = toNextJsHandler(auth)

import { APIError } from 'better-auth/api'

import { isEmailAllowed } from './signup-allowlist'

/**
 * Better Auth `databaseHooks` that restrict account creation to an email
 * allowlist. The `before` hook runs before any user row — and therefore any
 * session — is created; throwing an `APIError` aborts creation, so a disallowed
 * address is rejected with a 403 and never obtains a session.
 *
 * Kept as a standalone factory (rather than inlined in `./auth`) so the
 * enforcement can be exercised directly and through a real Better Auth instance
 * in tests, without pulling in the database client that `./auth` imports.
 */
export function createSignUpAllowlistHooks(allowlist: Set<string>) {
  return {
    user: {
      create: {
        before: async (user: { email: string }) => {
          if (!isEmailAllowed(user.email, allowlist)) {
            throw new APIError('FORBIDDEN', {
              message:
                'This email address is not permitted to register. Contact the site owner for access.',
            })
          }
        },
      },
    },
  }
}

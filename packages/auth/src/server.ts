/**
 * The server side of auth: the Better Auth factory and what it is built from.
 * Import this only from server code (route handlers, pages, the proxy): it
 * pulls in the database client.
 */
export { authBasePath, createAuth, type Auth, type CreateAuthOptions } from './auth'
export { createSignUpAllowlistHooks } from './auth-hooks'
export { db, resolveConnectionString } from './db'
export { account, schema, session, user, verification } from './db/schema'
export { isEmailAllowed, parseAllowedEmails } from './signup-allowlist'

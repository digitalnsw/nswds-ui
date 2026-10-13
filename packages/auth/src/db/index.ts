import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import { schema } from './schema'

/**
 * The Drizzle client, wired to Neon's serverless (HTTP) driver.
 *
 * Why the placeholder fallback: `neon()` throws the instant it is handed an
 * empty connection string, and Next evaluates this module's top level during
 * `next build` (the auth route imports the Better Auth config, which imports
 * this). Before a Neon database is connected — no `DATABASE_URL` — that throw
 * would crash the build. A syntactically valid placeholder lets `neon()` and
 * `drizzle()` construct without touching the network (neon-http connects per
 * query, not at construction), so the build passes; any real query attempted
 * without a `DATABASE_URL` then fails loudly at request time, which is the
 * honest failure mode for "database not configured yet".
 *
 * `db` is constructed eagerly rather than behind a lazy getter because Better
 * Auth's `drizzleAdapter(db, …)` needs a real instance at config time. Do not
 * wrap it in a Proxy — auth adapters introspect the client and a Proxy breaks
 * that in ways that hang requests with no error.
 */
const PLACEHOLDER_CONNECTION_STRING =
  'postgresql://placeholder:placeholder@localhost:5432/placeholder'

/**
 * Resolve the connection string handed to `neon()`. A missing, empty, or
 * whitespace-only `DATABASE_URL` is treated as "not configured" and falls back
 * to the placeholder — `neon()` throws on an empty or invalid string, so
 * without this a `DATABASE_URL=""` (or all-whitespace) value would crash module
 * evaluation during `next build`, the exact failure the placeholder exists to
 * avoid. A real query against the placeholder still fails loudly at request time.
 */
export function resolveConnectionString(raw: string | undefined): string {
  const trimmed = raw?.trim()

  return trimmed ? trimmed : PLACEHOLDER_CONNECTION_STRING
}

export const db = drizzle(neon(resolveConnectionString(process.env.DATABASE_URL)), { schema })

import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

/**
 * drizzle-kit (unlike Next) does not auto-load env files, so load the repo
 * root's `.env` — the one file every app in this repo reads its auth env from
 * — before reading `DATABASE_URL`. A `.env.local` beside this file wins over
 * it, for pointing migrations at another database. Both are git-ignored.
 * Without a `DATABASE_URL`, drizzle-kit refuses to run with a clear message —
 * connect a Neon database first (see the root `.env.example`).
 */
config({ path: ['.env.local', '../../.env'] })

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Load the monorepo-root `.env` into `process.env` at config time: the one file
 * every app reads its auth env from locally (DATABASE_URL, BETTER_AUTH_*,
 * SIGNUP_ALLOWED_EMAILS — see the root `.env.example`). Each app's
 * `next.config` calls this with its own directory. A missing file is skipped
 * (CI and Vercel provide the variables directly), and a variable already in
 * the environment keeps its value, as with `node --env-file`.
 */
export function loadRootEnv(appDir: string): void {
  const rootEnv = resolve(appDir, '../../.env')
  if (existsSync(rootEnv)) {
    process.loadEnvFile(rootEnv)
  }
}

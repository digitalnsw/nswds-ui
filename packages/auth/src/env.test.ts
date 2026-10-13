import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { loadRootEnv } from './env'

/* eslint-disable turbo/no-undeclared-env-vars -- the variables are this test's fixtures, not configuration */

// A monorepo in a temp dir: `<root>/.env` two levels above the app, as the
// real layout has it (`apps/<app>`).
let root: string
let appDir: string

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'nswds-auth-env-'))
  appDir = join(root, 'apps', 'web')
  mkdirSync(appDir, { recursive: true })
  vi.stubEnv('NSWDS_ENV_TEST_A', undefined)
  vi.stubEnv('NSWDS_ENV_TEST_B', undefined)
})

afterEach(() => {
  vi.unstubAllEnvs()
  rmSync(root, { recursive: true, force: true })
})

describe('loadRootEnv', () => {
  it('loads the root .env into process.env for an app two levels down', () => {
    writeFileSync(join(root, '.env'), 'NSWDS_ENV_TEST_A=from-file\nNSWDS_ENV_TEST_B="quoted"\n')
    loadRootEnv(appDir)
    expect(process.env.NSWDS_ENV_TEST_A).toBe('from-file')
    expect(process.env.NSWDS_ENV_TEST_B).toBe('quoted')
  })

  it('keeps a value already in the environment (CI and Vercel set them directly)', () => {
    vi.stubEnv('NSWDS_ENV_TEST_A', 'from-env')
    writeFileSync(join(root, '.env'), 'NSWDS_ENV_TEST_A=from-file\n')
    loadRootEnv(appDir)
    expect(process.env.NSWDS_ENV_TEST_A).toBe('from-env')
  })

  it('does nothing when there is no root .env', () => {
    expect(() => loadRootEnv(appDir)).not.toThrow()
    expect(process.env.NSWDS_ENV_TEST_A).toBeUndefined()
  })
})

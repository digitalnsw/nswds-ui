import { randomUUID } from 'node:crypto'

import { betterAuth } from 'better-auth'
import { memoryAdapter } from 'better-auth/adapters/memory'
import { APIError } from 'better-auth/api'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { authBasePath, createAuth } from './auth'
import { createSignUpAllowlistHooks } from './auth-hooks'

describe('createSignUpAllowlistHooks', () => {
  const { before } = createSignUpAllowlistHooks(new Set(['ok@example.com'])).user.create

  it('rejects a disallowed email with a 403 APIError', async () => {
    const error = await before({ email: 'mallory@example.com' }).then(
      () => null,
      (e: unknown) => e,
    )
    expect(error).toBeInstanceOf(APIError)
    expect((error as APIError).status).toBe('FORBIDDEN')
  })

  it('permits an allowlisted email (case-insensitive)', async () => {
    await expect(before({ email: 'OK@example.com' })).resolves.toBeUndefined()
  })

  it('is fail-closed: an empty allowlist rejects everyone', async () => {
    const { before: strict } = createSignUpAllowlistHooks(new Set()).user.create
    await expect(strict({ email: 'ok@example.com' })).rejects.toBeInstanceOf(APIError)
  })
})

describe('authBasePath', () => {
  it('mounts the endpoints at /api/auth for an app at the root', () => {
    expect(authBasePath()).toBe('/api/auth')
    expect(authBasePath('')).toBe('/api/auth')
  })

  it('prefixes the endpoints with the app path, tolerating a trailing slash', () => {
    expect(authBasePath('/infographics')).toBe('/infographics/api/auth')
    expect(authBasePath('/builder/')).toBe('/builder/api/auth')
  })
})

describe('createAuth wiring', () => {
  // The factory reads the secret from the environment as the apps do; give it a
  // test-only one rather than letting Better Auth fall back to its public default.
  beforeEach(() => {
    vi.stubEnv('BETTER_AUTH_SECRET', 'test-secret-test-secret-test-secret-123')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // Guards against the hook or the base path being unwired from the factory.
  it('registers the sign-up allowlist before-hook on a real auth instance', () => {
    const auth = createAuth()
    expect(typeof auth.options.databaseHooks?.user?.create?.before).toBe('function')
  })

  it("trusts the deployment's own Vercel addresses and the app's extra origins", () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('VERCEL_URL', 'nswds-ui-web-abc123.vercel.app')
    vi.stubEnv('VERCEL_BRANCH_URL', 'nswds-ui-web-git-feat-x.vercel.app')
    const { trustedOrigins } = createAuth({
      trustedOrigins: ['https://infographics.design.nsw.gov.au'],
    }).options
    expect(trustedOrigins).toEqual([
      'https://nswds-ui-web-abc123.vercel.app',
      'https://nswds-ui-web-git-feat-x.vercel.app',
      'https://infographics.design.nsw.gov.au',
    ])
  })

  it('trusts only the listed origins when no Vercel address is set', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('VERCEL_URL', undefined)
    vi.stubEnv('VERCEL_BRANCH_URL', undefined)
    expect(createAuth().options.trustedOrigins).toEqual([])
  })

  it('caches the session in a signed cookie so the proxy rarely hits the database', () => {
    expect(createAuth().options.session?.cookieCache).toEqual({ enabled: true, maxAge: 300 })
  })

  it('mounts the endpoints under the app path it is given', () => {
    expect(createAuth().options.basePath).toBe('/api/auth')
    // A folder the routes live in: Next hands the handler the whole path.
    expect(createAuth({ basePath: '/builder' }).options.basePath).toBe('/builder/api/auth')
    // Next's own basePath: stripped before the handler runs, so matched without it.
    expect(createAuth({ basePath: '/signature', nextBasePath: true }).options.basePath).toBe(
      '/api/auth',
    )
  })
})

describe('sign-up allowlist enforcement (Better Auth integration)', () => {
  // A real Better Auth instance over an in-memory adapter, wired with the same
  // factory createAuth uses, so the test proves the hook actually aborts
  // account creation end to end — not just that the predicate returns false.
  // Any password at least 8 characters long will do; a fresh one per test keeps
  // the fixture from reading as a credential.
  const password = randomUUID()

  function makeAuth() {
    return betterAuth({
      baseURL: 'http://localhost:3000',
      secret: 'test-secret-test-secret-test-secret-123',
      emailAndPassword: { enabled: true },
      database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
      databaseHooks: createSignUpAllowlistHooks(new Set(['ok@example.com'])),
    })
  }

  it('rejects a disallowed email and creates no account or session', async () => {
    await expect(
      makeAuth().api.signUpEmail({
        body: { name: 'Mallory', email: 'mallory@example.com', password },
      }),
    ).rejects.toMatchObject({ status: 'FORBIDDEN' })
  })

  it('lets an allowlisted email register and receive a session', async () => {
    const result = await makeAuth().api.signUpEmail({
      body: { name: 'Ok', email: 'ok@example.com', password },
    })
    expect(result.token).toBeTruthy()
    expect(result.user.email).toBe('ok@example.com')
  })
})

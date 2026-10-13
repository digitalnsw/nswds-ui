import { describe, expect, it, vi } from 'vitest'

// Stand in for Better Auth's React client: the cache is what is under test,
// and the real client would only add fetch plumbing.
vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn((options: { basePath: string }) => ({ basePath: options.basePath })),
}))

import { createAuthClient } from 'better-auth/react'

import { getAuthClient, settle, signOutEverywhere, UNREACHABLE } from './client'

const created = vi.mocked(createAuthClient)

describe('getAuthClient', () => {
  it('builds the client for the endpoints under the app path', () => {
    expect(getAuthClient('/builder')).toMatchObject({ basePath: '/builder/api/auth' })
    expect(getAuthClient()).toMatchObject({ basePath: '/api/auth' })
  })

  it('returns one client per endpoint path, however the path is spelled', () => {
    const builder = getAuthClient('/builder')
    const built = created.mock.calls.length
    expect(getAuthClient('/builder')).toBe(builder)
    expect(getAuthClient('/builder/')).toBe(builder)
    // Neither spelling built another client.
    expect(created.mock.calls.length).toBe(built)
    expect(getAuthClient('')).not.toBe(builder)
    expect(getAuthClient('')).toBe(getAuthClient())
  })
})

describe('signOutEverywhere', () => {
  function stub(revokeError: { message?: string } | null = null) {
    return {
      revokeSessions: vi.fn(async () => ({ error: revokeError })),
      signOut: vi.fn(async () => ({ error: null })),
    }
  }

  it('revokes every session before clearing the cookies', async () => {
    const c = stub()
    await expect(signOutEverywhere(c)).resolves.toEqual({ error: null })
    expect(c.revokeSessions.mock.invocationCallOrder[0]).toBeLessThan(
      c.signOut.mock.invocationCallOrder[0]!,
    )
  })

  it('still clears the cookies when this session is already gone (401)', async () => {
    const c = {
      revokeSessions: vi.fn(async () => ({ error: { message: 'Unauthorized', status: 401 } })),
      signOut: vi.fn(async () => ({ error: null })),
    }
    await expect(signOutEverywhere(c)).resolves.toEqual({ error: null })
    expect(c.signOut).toHaveBeenCalledOnce()
  })

  it('stops and reports the error when revoking fails, leaving the visitor signed in', async () => {
    const c = stub({ message: 'network down' })
    await expect(signOutEverywhere(c)).resolves.toEqual({ error: { message: 'network down' } })
    expect(c.signOut).not.toHaveBeenCalled()
  })
})

describe('settle', () => {
  it('passes a resolved result through untouched', async () => {
    const result = { data: { ok: true }, error: null }
    await expect(settle(async () => result)).resolves.toBe(result)
  })

  it('turns a rejected request into an error result, so a control never stays pending', async () => {
    await expect(
      settle(async () => {
        throw new TypeError('fetch failed')
      }),
    ).resolves.toEqual({ data: null, error: { message: UNREACHABLE } })
  })
})

describe('signOutEverywhere on a network failure', () => {
  it('reports the failure instead of rejecting, when revoking cannot reach the server', async () => {
    const c = {
      revokeSessions: vi.fn(async () => {
        throw new TypeError('fetch failed')
      }),
      signOut: vi.fn(async () => ({ error: null })),
    }
    await expect(signOutEverywhere(c)).resolves.toEqual({ error: { message: UNREACHABLE } })
    expect(c.signOut).not.toHaveBeenCalled()
  })

  it('reports the failure instead of rejecting, when sign-out cannot reach the server', async () => {
    const c = {
      revokeSessions: vi.fn(async () => ({ error: null })),
      signOut: vi.fn(async () => {
        throw new TypeError('fetch failed')
      }),
    }
    await expect(signOutEverywhere(c)).resolves.toMatchObject({ error: { message: UNREACHABLE } })
  })
})

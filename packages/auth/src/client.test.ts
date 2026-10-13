import { describe, expect, it, vi } from 'vitest'

// Stand in for Better Auth's React client: the cache is what is under test,
// and the real client would only add fetch plumbing.
vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn((options: { basePath: string }) => ({ basePath: options.basePath })),
}))

import { createAuthClient } from 'better-auth/react'

import { getAuthClient, signOutEverywhere } from './client'

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
      revokeOtherSessions: vi.fn(async () => ({ error: revokeError })),
      signOut: vi.fn(async () => ({ error: null })),
    }
  }

  it('revokes the other sessions before signing out of this one', async () => {
    const c = stub()
    await expect(signOutEverywhere(c)).resolves.toEqual({ error: null })
    expect(c.revokeOtherSessions.mock.invocationCallOrder[0]).toBeLessThan(
      c.signOut.mock.invocationCallOrder[0]!,
    )
  })

  it('stops and reports the error when revoking the other sessions fails, leaving the visitor signed in', async () => {
    const c = stub({ message: 'network down' })
    await expect(signOutEverywhere(c)).resolves.toEqual({ error: { message: 'network down' } })
    expect(c.signOut).not.toHaveBeenCalled()
  })
})

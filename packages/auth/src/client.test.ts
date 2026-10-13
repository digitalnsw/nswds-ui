import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

// Stand in for Better Auth's React client: the cache is what is under test,
// and the real client would only add fetch plumbing.
vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn((options: { basePath: string }) => ({ basePath: options.basePath })),
}))

import { createAuthClient } from 'better-auth/react'

import {
  AUTH_TIMEOUT_MS,
  getAuthClient,
  settle,
  SIGN_UP_TIMED_OUT,
  signOutEverywhere,
  signUpErrorMessage,
  TIMED_OUT,
  UNREACHABLE,
} from './client'

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

  it('passes an abort signal to both requests', async () => {
    const c = stub()
    await signOutEverywhere(c)
    for (const fn of [c.revokeSessions, c.signOut]) {
      expect(fn).toHaveBeenCalledWith({ fetchOptions: { signal: expect.any(AbortSignal) } })
    }
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

// `settle` logs each rejection; keep the test output quiet and let tests assert on the log.
let consoleError: MockInstance<typeof console.error>
beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  consoleError.mockRestore()
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

  it('logs the rejection, so a bug inside the call is not hidden behind the network message', async () => {
    const cause = new TypeError('bad argument')
    await settle(async () => {
      throw cause
    })
    expect(consoleError).toHaveBeenCalledWith('Auth request rejected', cause)
  })

  it('logs nothing when the call resolves', async () => {
    await settle(async () => ({ data: null, error: null }))
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('aborts a request that never settles and reports it as timed out', async () => {
    vi.useFakeTimers()
    try {
      let given: AbortSignal | undefined
      const result = settle((signal) => {
        given = signal
        return new Promise<never>(() => {})
      })
      await vi.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS - 1)
      expect(given?.aborted).toBe(false)
      await vi.advanceTimersByTimeAsync(1)
      await expect(result).resolves.toEqual({
        data: null,
        error: { message: TIMED_OUT, code: 'TIMEOUT' },
      })
      expect(given?.aborted).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('leaves the signal alone when the call answers in time', async () => {
    let given: AbortSignal | undefined
    await settle(async (signal) => {
      given = signal
      return { data: null, error: null }
    }, 50)
    await new Promise((resolve) => setTimeout(resolve, 80))
    expect(given?.aborted).toBe(false)
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

describe('signUpErrorMessage', () => {
  it('warns that a timed-out sign-up may have created the account', () => {
    expect(signUpErrorMessage({ message: TIMED_OUT, code: 'TIMEOUT' })).toBe(SIGN_UP_TIMED_OUT)
  })

  it("shows the server's own message otherwise", () => {
    expect(signUpErrorMessage({ message: UNREACHABLE })).toBe(UNREACHABLE)
    expect(
      signUpErrorMessage({ message: 'User already exists', code: 'USER_ALREADY_EXISTS' }),
    ).toBe('User already exists')
  })

  it('falls back to a generic message', () => {
    expect(signUpErrorMessage({})).toBe('Could not create your account. Please try again.')
  })
})

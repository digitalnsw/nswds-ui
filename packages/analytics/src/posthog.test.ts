import { afterEach, describe, expect, it, vi } from 'vitest'

import { posthogOptions, shouldCapture, startPostHog } from './posthog'

const production = { token: 'phc_test', vercelEnv: 'production' }

afterEach(() => {
  vi.restoreAllMocks()
})

describe('posthogOptions', () => {
  it('sets every privacy setting in code, not from the shared dashboard', () => {
    const options = posthogOptions({ site: 'test' })

    expect(options).toMatchObject({
      api_host: '/nswa',
      capture_pageview: 'history_change',
      disable_session_recording: true,
      capture_exceptions: false,
      capture_performance: { web_vitals: false },
    })
    expect(options.mask_all_text).toBeUndefined()
    expect(options.capture_dead_clicks).toBeUndefined()
  })

  it('masks text and attributes, and drops dead clicks, for sensitive content', () => {
    expect(posthogOptions({ site: 'test', sensitiveContent: true })).toMatchObject({
      mask_all_text: true,
      mask_all_element_attributes: true,
      capture_dead_clicks: false,
    })
  })

  it('registers the site from loaded, before the first pageview', () => {
    const instance = { register: vi.fn() }
    posthogOptions({ site: 'ui-web' }).loaded?.(instance as never)
    expect(instance.register).toHaveBeenCalledWith({ site: 'ui-web' })
  })
})

describe('before_send', () => {
  it('redacts the return path in properties, $set and $set_once, and keeps the token', () => {
    const beforeSend = posthogOptions({ site: 'test' }).before_send as (event: unknown) => unknown
    const page = `https://ui.design.nsw.gov.au/sign-in?from=${encodeURIComponent('/account?email=a@b.c')}`
    const event = {
      event: '$pageview',
      properties: { token: 'phc_test', $current_url: page, $referrer: page },
      $set: { $current_url: page },
      $set_once: { $initial_current_url: page },
    }
    const original = structuredClone(event)

    const result = beforeSend(event) as typeof event

    expect(JSON.stringify(result)).not.toMatch(/a@b\.c|email/)
    expect(result.properties.$current_url).toContain('from=%2Faccount')
    expect(result.properties.token).toBe('phc_test')
    expect(event).toEqual(original)
  })

  it('passes a dropped event through as null', () => {
    const beforeSend = posthogOptions({ site: 'test' }).before_send as (event: unknown) => unknown
    expect(beforeSend(null)).toBeNull()
  })
})

describe('startPostHog', () => {
  it('starts on production with the options for the site', () => {
    const posthog = { init: vi.fn() }

    expect(startPostHog(posthog, { site: 'ui-web' }, production)).toBe('started')
    expect(posthog.init).toHaveBeenCalledOnce()
    expect(posthog.init.mock.calls[0]![0]).toBe('phc_test')
    expect(posthog.init.mock.calls[0]![1]).toMatchObject({ api_host: '/nswa' })
  })

  it.each([['preview'], ['development'], [undefined]])(
    'stays silent on %s, where the token is shared but nothing should report',
    (vercelEnv) => {
      const posthog = { init: vi.fn() }
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(startPostHog(posthog, { site: 'ui-web' }, { token: 'phc_test', vercelEnv })).toBe(
        'skipped',
      )
      expect(posthog.init).not.toHaveBeenCalled()
      expect(error).not.toHaveBeenCalled()
    },
  )

  it('logs once and never throws when production has no token', () => {
    const posthog = { init: vi.fn() }
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(startPostHog(posthog, { site: 'ui-web' }, { token: '', vercelEnv: 'production' })).toBe(
      'missing-token',
    )
    expect(posthog.init).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalledOnce()
  })

  it('captures on production only', () => {
    expect(shouldCapture('production')).toBe(true)
    expect(shouldCapture('preview')).toBe(false)
    expect(shouldCapture(undefined)).toBe(false)
  })
})

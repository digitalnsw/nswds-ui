import { describe, expect, it } from 'vitest'

import { REDACTED_VALUE, redactProperties, redactUrl, RETURN_PARAM } from './redact'

const origin = 'https://ui.design.nsw.gov.au'

describe('redactUrl', () => {
  it("cuts the sign-in gate's return path to its path, dropping the query it carried", () => {
    // What the gate writes for a signed-out visit to /account?email=person@example.com.
    const signIn = `${origin}/sign-in?from=${encodeURIComponent('/account?email=person@example.com')}`

    const result = redactUrl(signIn)

    expect(result).not.toMatch(/person|example\.com|email/)
    expect(result).toBe(`${origin}/sign-in?from=%2Faccount`)
  })

  it('keeps campaign parameters and drops every other parameter, name and value', () => {
    const result = redactUrl(`${origin}/?utm_source=newsletter&token=secret&person@example.com`)

    expect(result).toBe(`${origin}/?utm_source=newsletter`)
    expect(result).not.toMatch(/token|secret|person|example/)
  })

  it('drops the fragment, with or without a query, in every URL form', () => {
    expect(redactUrl(`${origin}/account#email=person@example.com`)).toBe(`${origin}/account`)
    expect(redactUrl(`${origin}/?utm_source=x#secret`)).toBe(`${origin}/?utm_source=x`)
    expect(redactUrl('/account#secret')).toBe('/account')
    expect(redactUrl('//ui.design.nsw.gov.au/a#secret')).toBe('//ui.design.nsw.gov.au/a')
    expect(redactUrl(`${origin}/sign-in?from=${encodeURIComponent('/a#secret')}`)).toBe(
      `${origin}/sign-in?from=%2Fa`,
    )
  })

  it('leaves a URL with no query byte-identical', () => {
    expect(redactUrl(`${origin}/infographics/account`)).toBe(`${origin}/infographics/account`)
    expect(redactUrl('/infographics')).toBe('/infographics')
  })

  it('redacts a path without adding an origin, and keeps a protocol-relative host', () => {
    expect(redactUrl('/sign-in?from=/a?b=c')).toBe('/sign-in?from=%2Fa')
    expect(redactUrl('//ui.design.nsw.gov.au/x?q=1')).toBe('//ui.design.nsw.gov.au/x')
  })

  it('leaves prose alone and fails closed on an unparseable URL', () => {
    expect(redactUrl('Is from=/a?b=c a URL? No')).toBe('Is from=/a?b=c a URL? No')
    expect(redactUrl('https://%?q=secret')).toBe(REDACTED_VALUE)
  })

  it("matches the auth package's return parameter", () => {
    expect(RETURN_PARAM).toBe('from')
  })
})

describe('redactProperties', () => {
  it('redacts nested bags, keeps the token, and survives a cycle', () => {
    const page = `${origin}/sign-in?from=${encodeURIComponent('/account?email=a@b.c')}`
    const bag: Record<string, unknown> = {
      token: 'phc_projectApiKey',
      $current_url: page,
      $set_once: { $initial_current_url: page, $initial_referrer: '$direct' },
    }
    bag.self = bag

    const result = redactProperties(bag) as typeof bag & {
      $set_once: Record<string, string>
      self: typeof bag
    }

    expect(JSON.stringify({ ...result, self: undefined })).not.toMatch(/a@b\.c|email/)
    expect(result.token).toBe('phc_projectApiKey')
    expect(result.$set_once.$initial_referrer).toBe('$direct')
    expect(result.self).toBe(result)
  })
})

import { describe, expect, it } from 'vitest'

import {
  isCleanLocation,
  isCleanReferrer,
  REDACTED_VALUE,
  redactProperties,
  redactUrl,
  RETURN_PARAM,
} from './redact'

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

  it('keeps `from` only as a path on this site', () => {
    const at = (from: string) => redactUrl(`${origin}/sign-in?from=${encodeURIComponent(from)}`)

    expect(at('/infographics/account')).toBe(`${origin}/sign-in?from=%2Finfographics%2Faccount`)
    for (const offsite of [
      'https://example.com/person@example.com',
      '//example.com/person@example.com',
      '/\\example.com/person',
      'person@example.com',
    ]) {
      expect(at(offsite), offsite).toBe(`${origin}/sign-in`)
    }
  })

  it('limits a campaign label by characters as read, however its accents are encoded', () => {
    const composed = '\u00e9'.repeat(100)
    const decomposed = 'e\u0301'.repeat(100)
    const keep = (value: string) =>
      redactUrl(`${origin}/?utm_campaign=${encodeURIComponent(value)}`) !== `${origin}/`

    expect(keep(composed)).toBe(true)
    expect(keep(decomposed)).toBe(true)
    expect(keep(composed + '\u00e9')).toBe(false)
    expect(keep(decomposed + 'e\u0301')).toBe(false)
  })

  it('keeps only the five campaign names, and only label-like values', () => {
    const kept = redactUrl(
      `${origin}/?utm_source=newsletter&utm_medium=email&utm_campaign=spring+sale&utm_term=nsw-gov_2026&utm_content=hero`,
    )
    expect(kept).toBe(
      `${origin}/?utm_source=newsletter&utm_medium=email&utm_campaign=spring+sale&utm_term=nsw-gov_2026&utm_content=hero`,
    )

    // Labels in other languages: Chinese, and an accent sent both composed and decomposed.
    for (const label of ['春', 'café', 'cafe\u0301', 'Tiếng Việt']) {
      const url = `${origin}/?utm_campaign=${encodeURIComponent(label)}`
      expect(redactUrl(url), label).toBe(url.replace(/%20/g, '+'))
    }

    // A campaign-shaped name, an email or URL as a campaign value, and an over-long value.
    expect(redactUrl(`${origin}/?utm_person@example.com`)).toBe(`${origin}/`)
    expect(redactUrl(`${origin}/?utm_id=secret`)).toBe(`${origin}/`)
    expect(redactUrl(`${origin}/?utm_term=person@example.com`)).toBe(`${origin}/`)
    expect(redactUrl(`${origin}/?utm_source=https://example.com/x`)).toBe(`${origin}/`)
    expect(redactUrl(`${origin}/?utm_source=${'a'.repeat(101)}`)).toBe(`${origin}/`)
    expect(redactUrl(`${origin}/?utm_source=${'春'.repeat(101)}`)).toBe(`${origin}/`)
    expect(redactUrl(`${origin}/?utm_term=${encodeURIComponent('名前@example.com')}`)).toBe(
      `${origin}/`,
    )
    // A trailing newline: JavaScript's `$` matches before one only with the `m` flag, which
    // CAMPAIGN_VALUE does not use, so this is dropped like any other non-label value.
    expect(redactUrl(`${origin}/?utm_source=ok%0A`)).toBe(`${origin}/`)
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

  it('drops credentials from an absolute URL, with or without a query', () => {
    expect(redactUrl('https://person:secret@example.com/path?private=1')).toBe(
      'https://example.com/path',
    )
    expect(redactUrl('https://person@example.com/path')).toBe('https://example.com/path')
  })

  it('redacts the target of a contact link, whatever its case or padding', () => {
    expect(redactUrl('mailto:person@example.com')).toBe(`mailto:${REDACTED_VALUE}`)
    expect(redactUrl('tel:+61400123456')).toBe(`tel:${REDACTED_VALUE}`)
    expect(redactUrl('  MAILTO:Person@Example.com')).toBe(`mailto:${REDACTED_VALUE}`)
    expect(redactUrl('sms:0400123456?body=hi')).toBe(`sms:${REDACTED_VALUE}`)
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
      $elements: [{ tag_name: 'a', attr__href: 'mailto:a@b.c' }],
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
    expect(JSON.stringify(result.$elements)).not.toContain('a@b.c')
    expect(result.self).toBe(result)
  })
})

describe('isCleanLocation', () => {
  it('passes an address redactUrl would leave as is, with or without a plain anchor', () => {
    expect(isCleanLocation('', '')).toBe(true)
    expect(isCleanLocation('?utm_source=newsletter', '')).toBe(true)
    expect(isCleanLocation('?from=%2Faccount', '')).toBe(true)
    expect(isCleanLocation('', '#install')).toBe(true)
  })

  it('fails anything redactUrl would remove', () => {
    expect(isCleanLocation(`?from=${encodeURIComponent('/account?email=a@b.c')}`, '')).toBe(false)
    expect(isCleanLocation('?person@example.com', '')).toBe(false)
    expect(isCleanLocation('?utm_term=a@b.c', '')).toBe(false)
    expect(isCleanLocation('', '#email=a@b.c')).toBe(false)
  })
})

describe('isCleanReferrer', () => {
  const site = 'https://ui.design.nsw.gov.au'

  it('passes no referrer and an origin-only one from any site', () => {
    expect(isCleanReferrer('')).toBe(true)
    expect(isCleanReferrer('https://www.google.com/')).toBe(true)
    expect(isCleanReferrer(`${site}/`)).toBe(true)
  })

  it('fails a path, a query, a fragment or credentials from any site, or one it cannot read', () => {
    expect(isCleanReferrer('https://example.com/account/person@example.com')).toBe(false)
    expect(isCleanReferrer(`${site}/sign-in?from=%2Faccount`)).toBe(false)
    expect(isCleanReferrer('https://example.com/?email=a@b.c')).toBe(false)
    expect(isCleanReferrer(`${site}/#email=a@b.c`)).toBe(false)
    expect(isCleanReferrer('https://person:secret@example.com/')).toBe(false)
    expect(isCleanReferrer('not a url')).toBe(false)
  })
})

import { describe, expect, it, vi } from 'vitest'

import {
  isCleanLocation,
  isCleanPath,
  isCleanReferrer,
  REDACTED_VALUE,
  redactElementsChain,
  redactHref,
  redactProperties,
  redactUrl,
} from './redact'

const origin = 'https://ui.design.nsw.gov.au'

describe('redactUrl', () => {
  it("drops the sign-in gate's return path, with the query it carried", () => {
    // What the gate writes for a signed-out visit to /account?email=person@example.com.
    const signIn = `${origin}/sign-in?from=${encodeURIComponent('/account?email=person@example.com')}`

    const result = redactUrl(signIn)

    expect(result).not.toMatch(/person|example\.com|email/)
    expect(result).toBe(`${origin}/sign-in`)
  })

  it('drops a campaign value with more digits than a label has, a phone number among them', () => {
    const at = (value: string) => redactUrl(`${origin}/?utm_term=${encodeURIComponent(value)}`)
    for (const value of ['0400123456', '0400 123 456', '1234-5678']) {
      expect(at(value), value).toBe(`${origin}/`)
    }
    for (const value of ['nsw-gov_2026', 'issue 12', '1234567']) {
      expect(at(value), value).not.toBe(`${origin}/`)
    }
  })

  it('keeps campaign parameters and drops every other parameter, name and value', () => {
    const result = redactUrl(`${origin}/?utm_source=newsletter&token=secret&person@example.com`)

    expect(result).toBe(`${origin}/?utm_source=newsletter`)
    expect(result).not.toMatch(/token|secret|person|example/)
  })

  it('drops `from` whatever it holds, a path included', () => {
    const at = (from: string) => redactUrl(`${origin}/sign-in?from=${encodeURIComponent(from)}`)

    for (const from of [
      '/infographics/account',
      '/account/person@example.com',
      'https://example.com/person@example.com',
      '//example.com/person@example.com',
    ]) {
      expect(at(from), from).toBe(`${origin}/sign-in`)
    }
    expect(redactUrl(`${origin}/sign-in?from=%2Fa&utm_source=newsletter`)).toBe(
      `${origin}/sign-in?utm_source=newsletter`,
    )
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
    expect(redactUrl(`${origin}/sign-in?utm_source=x#secret`)).toBe(
      `${origin}/sign-in?utm_source=x`,
    )
  })

  it('leaves a URL with no query byte-identical', () => {
    expect(redactUrl(`${origin}/infographics/account`)).toBe(`${origin}/infographics/account`)
    expect(redactUrl('/infographics')).toBe('/infographics')
  })

  it('redacts a path without adding an origin, and keeps a protocol-relative host', () => {
    expect(redactUrl('/sign-in?from=/a?b=c')).toBe('/sign-in')
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

  it('redacts absolute URLs spelled the ways a browser still follows', () => {
    const query = '?utm_source=newsletter&email=person@example.com'
    for (const spelling of [
      'https:\\\\example.com/',
      'https:/example.com/',
      'https:example.com/',
      'HTTPS:\\/example.com/',
      'ht\ttps://example.com/',
      'https://exa\nmple.com/',
      '\u0001https://example.com/',
    ]) {
      expect(redactUrl(`${spelling}${query}`)).toBe('https://example.com/?utm_source=newsletter')
    }
    expect(redactUrl('http:example.com/?email=person@example.com')).toBe('http://example.com/')
  })

  it('redacts backslash-led references as the paths and hosts a browser reads them as', () => {
    expect(redactUrl('\\\\example.com/a?email=person@example.com')).toBe('//example.com/a')
    expect(redactUrl('/\\example.com/a?email=person@example.com')).toBe('//example.com/a')
    expect(redactUrl('\\account?email=person@example.com')).toBe('/account')
  })

  it('redacts a contact link behind control characters', () => {
    expect(redactUrl('\u0001mai\tlto:person@example.com')).toBe('mailto:[redacted]')
  })

  it('redacts a query-only or fragment-only reference without adding a path', () => {
    expect(redactUrl('?email=person@example.com')).toBe('')
    expect(redactUrl('#email=person@example.com')).toBe('')
    expect(redactUrl('?utm_source=newsletter&email=person@example.com')).toBe(
      '?utm_source=newsletter',
    )
    expect(redactUrl('?from=/account?email=a@b.c#x')).toBe('')
  })

  it('leaves prose alone and fails closed on an unparseable URL', () => {
    expect(redactUrl('Is from=/a?b=c a URL? No')).toBe('Is from=/a?b=c a URL? No')
    expect(redactUrl('https://%?q=secret')).toBe(REDACTED_VALUE)
  })
})

describe('redactHref', () => {
  it('redacts a document-relative reference, keeping its path as written', () => {
    expect(redactHref('details?email=person@example.com')).toBe('details')
    expect(redactHref('./a?utm_source=x&token=1#y')).toBe('./a?utm_source=x')
    expect(redactHref('../a/b?q=1')).toBe('../a/b')
    expect(redactHref('$direct')).toBe('$direct')
    expect(redactHref('')).toBe('')
  })

  it('reports only the scheme of a non-web address, whose payload it cannot read', () => {
    expect(redactHref('data:text/plain,person@example.com')).toBe(`data:${REDACTED_VALUE}`)
    expect(redactHref("javascript:alert('person@example.com')")).toBe(
      `javascript:${REDACTED_VALUE}`,
    )
    expect(redactHref('blob:https://ui.design.nsw.gov.au/1234')).toBe(`blob:${REDACTED_VALUE}`)
    expect(redactHref('file:///Users/person/notes.txt')).toBe(`file:${REDACTED_VALUE}`)
    expect(redactUrl('custom-app://open?email=a@b.c')).toBe(`custom-app:${REDACTED_VALUE}`)
    expect(redactElementsChain('a:href="data:text/plain,a@b.c"')).toBe('a:href="data:[redacted]"')
    // Prose that merely starts like a scheme is not a known URL, and is left as written.
    expect(redactUrl('Note: see below')).toBe('Note: see below')
  })

  it('redacts every other form as redactUrl does', () => {
    expect(redactHref('/a?email=x')).toBe('/a')
    expect(redactHref('mailto:a@b.c')).toBe(`mailto:${REDACTED_VALUE}`)
    expect(redactHref(`${origin}/a?email=x`)).toBe(`${origin}/a`)
  })
})

describe('paths', () => {
  it('redacts a path segment holding an email address, encoded or not', () => {
    expect(redactUrl(`${origin}/account/person@example.com`)).toBe(
      `${origin}/account/%5Bredacted%5D`,
    )
    expect(redactUrl('/account/person%40example.com/x')).toBe('/account/%5Bredacted%5D/x')
    expect(redactHref('people/person@example.com?x=1')).toBe('people/%5Bredacted%5D')
  })

  it('leaves an ordinary path alone, and says which paths are clean', () => {
    expect(redactUrl(`${origin}/components/button`)).toBe(`${origin}/components/button`)
    expect(isCleanPath('/components/button')).toBe(true)
    expect(isCleanPath('/account/person@example.com')).toBe(false)
    expect(isCleanPath('/a/%E0%A4%A')).toBe(true)
  })

  it('finds an email address however many times it was encoded, or written fullwidth', () => {
    expect(isCleanPath('/account/person%2540example.com')).toBe(false)
    expect(isCleanPath('/account/person%25252540example.com')).toBe(false)
    expect(isCleanPath('/account/%E0%A4%A%40example.com')).toBe(false)
    expect(isCleanPath('/account/person\uFF20example.com')).toBe(false)
    expect(isCleanPath('/account/person%EF%BC%A0example.com')).toBe(false)
    expect(isCleanPath('/account/person%EF%BC%A0example.com%FF')).toBe(false)
    expect(isCleanPath('/account/%FFperson%EF%BC%A0example.com')).toBe(false)
    expect(isCleanPath('/account/%E0%A4%A0%FF%40')).toBe(false)
    expect(redactUrl('/account/person%2540example.com')).toBe('/account/%5Bredacted%5D')
    // Encoded past every layer this unwraps: redacted, since it cannot be read.
    expect(isCleanPath(`/a/%${'25'.repeat(10)}40`)).toBe(false)
    expect(isCleanPath(`/a/%${'25'.repeat(7)}40`)).toBe(false)
    expect(isCleanPath('/a/100%25-done')).toBe(true)
  })
})

describe('redactElementsChain', () => {
  it('redacts each href in the chain and leaves the rest as it is', () => {
    const chain =
      'a.nav:attr__href="/x?email=a@b.c"href="/x?email=a@b.c"nth-child="2"text="Hi";div:nth-child="1"'
    expect(redactElementsChain(chain)).toBe(
      'a.nav:attr__href="/x"href="/x"nth-child="2"text="Hi";div:nth-child="1"',
    )
  })

  it('redacts every other attribute that holds a URL, and leaves the rest as written', () => {
    const chain =
      'img:attr__src="https://cdn.example/a?email=a@b.c"attr__alt="say \\"hi\\""nth-child="1";' +
      'button:attr__formaction="/search?token=1"text="/x?y=1"'
    expect(redactElementsChain(chain)).toBe(
      'img:attr__src="https://cdn.example/a"attr__alt="say \\"hi\\""nth-child="1";' +
        'button:attr__formaction="/search"text="/x"',
    )
  })

  it('reads every URL-bearing attribute as a URL, relative values included', () => {
    const chain =
      'img:attr__src="avatar?email=a@b.c"attr__srcset="a.png?x=1 1x, b.png?y=2 2x";' +
      'button:attr__formaction="search?token=1";form:attr__action="./send?to=a@b.c"'
    expect(redactElementsChain(chain)).toBe(
      'img:attr__src="avatar"attr__srcset="a.png 1x, b.png 2x";' +
        'button:attr__formaction="search";form:attr__action="./send"',
    )
    expect(
      redactProperties({ $elements: [{ attr__src: 'avatar?email=a@b.c', attr__alt: 'a?b' }] }),
    ).toEqual({ $elements: [{ attr__src: 'avatar', attr__alt: 'a?b' }] })
  })

  it('keeps escaped quotes escaped, and leaves an href-like text alone', () => {
    expect(redactElementsChain('a:href="/a?q=\\"x\\""text="href=1"')).toBe(
      'a:href="/a"text="href=1"',
    )
    // Nothing to redact: the value keeps posthog-js's own spelling.
    expect(redactElementsChain('a:href="say \\"hi\\""')).toBe('a:href="say \\"hi\\""')
    expect(redactElementsChain('a:href="a\\b?q=1"nth-child="1"')).toBe(
      'a:href="a%5Cb"nth-child="1"',
    )
  })
})

describe('redactProperties', () => {
  it('keeps a `__proto__` key as a property, never as the prototype', () => {
    const bag = JSON.parse('{"__proto__": {"$current_url": "/a?email=a@b.c"}, "x": 1}') as object
    const result = redactProperties(bag) as Record<string, unknown>

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(Object.hasOwn(result, '__proto__')).toBe(true)
    expect(Object.getOwnPropertyDescriptor(result, '__proto__')?.value).toEqual({
      $current_url: '/a',
    })
    expect(result.x).toBe(1)
  })

  it('reads properties named for URLs as URLs, and redacts keys that are addresses', () => {
    const result = redactProperties({
      $elements: [{ attr__href: 'details?email=a@b.c', href: 'details?email=a@b.c' }],
      $external_click_url: 'details?email=a@b.c',
      $referrer: '$direct',
      $pathname: '/account/a@b.c',
      $heatmap_data: {
        [`${origin}/a?email=a@b.c`]: [1],
        [`${origin}/a?token=2`]: [2],
      },
      note: 'details?email=a@b.c',
    })

    expect(result.$elements).toEqual([{ attr__href: 'details', href: 'details' }])
    expect(result.$external_click_url).toBe('details')
    expect(result.$referrer).toBe('$direct')
    expect(result.$pathname).toBe('/account/%5Bredacted%5D')
    expect(result.$heatmap_data).toEqual({ [`${origin}/a`]: [1, 2] })
    // Prose under any other name stays as written.
    expect(result.note).toBe('details?email=a@b.c')
  })

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
  it('passes an address redactUrl would leave as is', () => {
    expect(isCleanLocation('', '')).toBe(true)
    expect(isCleanLocation('?utm_source=newsletter', '')).toBe(true)
  })

  it('fails anything redactUrl would remove', () => {
    expect(isCleanLocation('?from=%2Faccount', '')).toBe(false)
    expect(isCleanLocation(`?from=${encodeURIComponent('/account?email=a@b.c')}`, '')).toBe(false)
    expect(isCleanLocation('?person@example.com', '')).toBe(false)
    expect(isCleanLocation('?utm_term=a@b.c', '')).toBe(false)
    expect(isCleanLocation('', '#email=a@b.c')).toBe(false)
    expect(isCleanLocation('', '#install')).toBe(false)
    expect(isCleanLocation('?utm_source=newsletter', '#person')).toBe(false)
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

describe('without Intl.Segmenter', () => {
  it('loads, and counts a campaign label in code points instead', async () => {
    vi.resetModules()
    vi.stubGlobal('Intl', { ...Intl, Segmenter: undefined })
    try {
      const { redactUrl: redactWithout } = await import('./redact')
      expect(redactWithout(`${origin}/?utm_source=newsletter`)).toBe(
        `${origin}/?utm_source=newsletter`,
      )
      expect(redactWithout(`${origin}/?utm_source=${'a'.repeat(101)}`)).toBe(`${origin}/`)
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })
})

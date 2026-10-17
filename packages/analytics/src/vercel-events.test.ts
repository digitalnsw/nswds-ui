import { afterEach, describe, expect, it, vi } from 'vitest'

import { redactEvent, redactPageEvent } from './vercel-events'

const page = 'https://ui.design.nsw.gov.au/sign-in?from=%2Faccount%3Femail%3Da%40b.c'

describe('redactEvent', () => {
  it('redacts the URL, and the route where the event has one', () => {
    expect(redactEvent({ type: 'pageview', url: page })).toEqual({
      type: 'pageview',
      url: 'https://ui.design.nsw.gov.au/sign-in',
    })
    expect(redactEvent({ type: 'vital', url: page, route: '/signature/a@b.c' })).toEqual({
      type: 'vital',
      url: 'https://ui.design.nsw.gov.au/sign-in',
      route: '/signature/%5Bredacted%5D',
    })
  })
})

describe('redactPageEvent', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends a redacted page view when the referrer is no more than an origin', () => {
    for (const referrer of ['', 'https://www.google.com/']) {
      vi.stubGlobal('document', { referrer })
      expect(redactPageEvent({ type: 'pageview', url: page })).toEqual({
        type: 'pageview',
        url: 'https://ui.design.nsw.gov.au/sign-in',
      })
    }
  })

  it('drops the page view when the referrer carries more than an origin', () => {
    vi.stubGlobal('document', { referrer: 'https://partner.example/inbox?email=a@b.c' })
    expect(redactPageEvent({ type: 'pageview', url: page })).toBeNull()
  })
})

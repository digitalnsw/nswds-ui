import { describe, expect, it } from 'vitest'

import { isProductionHost, tagManagerId, zonePath } from './paths'

describe('zonePath', () => {
  it("states a zone's page with its basePath, the root as the basePath itself", () => {
    expect(zonePath('/infographics', '/')).toBe('/infographics')
    expect(zonePath('/infographics', '/account')).toBe('/infographics/account')
    expect(zonePath('/signature', '/sign-in')).toBe('/signature/sign-in')
  })
})

describe('tagManagerId', () => {
  it('renders no tag for an unset or blank ID, and trims a padded one', () => {
    expect(tagManagerId(undefined)).toBeUndefined()
    expect(tagManagerId('')).toBeUndefined()
    expect(tagManagerId('  ')).toBeUndefined()
    expect(tagManagerId(' GTM-TEST ')).toBe('GTM-TEST')
  })
})

describe('isProductionHost', () => {
  it('accepts the domain and its subdomains, nothing else', () => {
    expect(isProductionHost('design.nsw.gov.au')).toBe(true)
    expect(isProductionHost('email.design.nsw.gov.au')).toBe(true)
    expect(isProductionHost('nswds-email-design-docs-git-x-digital-nsw.vercel.app')).toBe(false)
    expect(isProductionHost('localhost')).toBe(false)
    expect(isProductionHost('evildesign.nsw.gov.au')).toBe(false)
    expect(isProductionHost('design.nsw.gov.au.example.com')).toBe(false)
    expect(isProductionHost(undefined)).toBe(false)
  })
})

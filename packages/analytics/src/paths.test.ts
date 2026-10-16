import { describe, expect, it } from 'vitest'

import { tagManagerId, zonePath } from './paths'

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

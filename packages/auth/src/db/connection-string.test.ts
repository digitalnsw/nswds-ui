import { describe, expect, it } from 'vitest'

import { resolveConnectionString } from './index'

// The placeholder is an implementation detail; capture it from the missing-value
// case rather than hard-coding it, so the test asserts behaviour, not wording.
const placeholder = resolveConnectionString(undefined)

describe('resolveConnectionString', () => {
  it('uses a build-safe placeholder when DATABASE_URL is missing', () => {
    expect(placeholder).toMatch(/^postgresql:\/\//)
  })

  it('treats an empty or whitespace-only value as missing (neon() would throw on it)', () => {
    expect(resolveConnectionString('')).toBe(placeholder)
    expect(resolveConnectionString('   ')).toBe(placeholder)
  })

  it('uses a configured connection string, trimmed', () => {
    const url = 'postgresql://user:pass@ep.region.aws.neon.tech/db?sslmode=require'
    expect(resolveConnectionString(url)).toBe(url)
    expect(resolveConnectionString(`  ${url}  `)).toBe(url)
  })
})

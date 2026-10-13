import { describe, expect, it } from 'vitest'

import { isEmailAllowed, parseAllowedEmails } from './signup-allowlist'

describe('parseAllowedEmails', () => {
  it('returns an empty set for undefined or blank input', () => {
    expect(parseAllowedEmails(undefined).size).toBe(0)
    expect(parseAllowedEmails('').size).toBe(0)
    expect(parseAllowedEmails('   ').size).toBe(0)
  })

  it('splits on commas and whitespace and normalises to lowercase', () => {
    const list = parseAllowedEmails('Alice@Example.com, bob@example.com\n  CAROL@example.com')
    expect(list).toEqual(new Set(['alice@example.com', 'bob@example.com', 'carol@example.com']))
  })

  it('ignores empty entries from stray separators', () => {
    expect(parseAllowedEmails(',,alice@example.com, ,')).toEqual(new Set(['alice@example.com']))
  })
})

describe('isEmailAllowed', () => {
  const allowlist = parseAllowedEmails('alice@example.com, bob@example.com')

  it('permits an address on the list, case- and whitespace-insensitively', () => {
    expect(isEmailAllowed('alice@example.com', allowlist)).toBe(true)
    expect(isEmailAllowed('  ALICE@Example.com  ', allowlist)).toBe(true)
  })

  it('rejects an address not on the list', () => {
    expect(isEmailAllowed('mallory@example.com', allowlist)).toBe(false)
  })

  it('is fail-closed: an empty allowlist permits nobody', () => {
    const empty = parseAllowedEmails(undefined)
    expect(isEmailAllowed('alice@example.com', empty)).toBe(false)
  })
})

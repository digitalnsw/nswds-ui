/**
 * Query strings and fragments out of every URL the reporters send. The sites put nothing of their
 * own in either, but the sign-in gate (packages/auth/src/proxy.ts) copies the page a signed-out
 * visitor asked for, query and all, into the sign-in page's `from` parameter, so whatever a link
 * carried would otherwise be reported as part of the sign-in page's URL.
 *
 * What survives is an allowlist: the five standard campaign parameters, while their values look like
 * campaign labels (`CAMPAIGN_VALUE`), and `from` cut to its path, which still says where the visitor
 * was going. Every other parameter is dropped, name and value, since
 * a bare name (`?person@example.com`) carries data as well as a value does, and a parameter added
 * later is covered by default. The fragment is dropped too: it is the one part of a URL a link can
 * put data in without it ever reaching a server. Only URL-shaped strings are touched, so an event's
 * opaque `token` property, which posthog-js drops the event without, is left alone.
 */

/** The gate's return parameter, `RETURN_PARAM` in packages/auth/src/return-path.ts. */
export const RETURN_PARAM = 'from'

export const REDACTED_VALUE = '[redacted]'

// Shared by the classifier and the rewriter so the two cannot disagree about what is absolute.
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i

/**
 * Absolute URLs and paths only. `new URL(value, base)` parses ordinary prose as a relative URL, so
 * a bare "has a `?`" test would rewrite free text this promises to leave alone.
 */
function isUrlShaped(value: string): boolean {
  const trimmed = value.trim()
  return ABSOLUTE_URL_PATTERN.test(trimmed) || trimmed.startsWith('/')
}

/** A return path without its own query or fragment. */
function pathOnly(value: string): string {
  return value.split(/[?#]/, 1)[0] ?? ''
}

/**
 * The campaign parameters kept, by exact name. Not a `utm_` prefix: a link can put anything in a
 * name, and `?utm_person@example.com` would pass a prefix test.
 */
export const CAMPAIGN_PARAMS: ReadonlySet<string> = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
])

/**
 * What a campaign value may look like: a label in any language, such as `newsletter`, `spring sale`,
 * `nsw-gov_2026`, `café` or `春`, up to 100 characters. Letters, combining marks (an accent sent
 * decomposed) and digits from any script, plus space and `_.~+-`. No `@`, `/`, `:` or `=`, so an
 * email address, a URL or a nested query is dropped with its parameter, whatever name it was sent
 * under. The `u` flag makes the classes Unicode-aware and counts the limit in characters; there is
 * no `m` flag, so `$` cannot match before a trailing newline.
 */
export const CAMPAIGN_VALUE = /^[\p{L}\p{M}\p{N}_ .~+-]{1,100}$/u

/** The value a parameter is reported with, or `null` to drop it, name and all. */
function allowedValue(key: string, value: string): string | null {
  if (key === RETURN_PARAM) return pathOnly(value)
  if (CAMPAIGN_PARAMS.has(key) && CAMPAIGN_VALUE.test(value)) return value
  return null
}

/** Redact one URL string. Anything not URL-shaped comes back unchanged. */
export function redactUrl(value: string): string {
  if (!isUrlShaped(value)) return value

  const trimmed = value.trim()
  let url: URL
  try {
    url = new URL(trimmed, 'http://redact.invalid')
  } catch {
    // URL-shaped but unparseable: it cannot be inspected, and this is the last stop before the
    // data leaves the browser, so it fails closed.
    return REDACTED_VALUE
  }
  if (!url.search && !url.hash) return value

  const params = new URLSearchParams()
  for (const [key, entry] of url.searchParams) {
    const allowed = allowedValue(key, entry)
    if (allowed !== null) params.append(key, allowed)
  }
  url.search = params.toString()
  url.hash = ''

  if (ABSOLUTE_URL_PATTERN.test(trimmed)) return url.toString()
  // Protocol-relative (`//host/path`): the host is real and stays.
  if (trimmed.startsWith('//')) return `//${url.host}${url.pathname}${url.search}`
  return `${url.pathname}${url.search}`
}

/**
 * Redact every URL-shaped string in a property bag, however deep: PostHog's `$set` and `$set_once`
 * are nested bags holding `$initial_current_url` and `$initial_referrer`. No depth limit, since a
 * cap would pass everything below it through unredacted. Each object maps to its clone before the
 * clone is filled, so a cycle ends and is redacted too.
 */
export function redactProperties<T>(properties: T): T {
  return redactValue(properties, new WeakMap<object, unknown>())
}

function redactValue<T>(value: T, clones: WeakMap<object, unknown>): T {
  if (typeof value === 'string') return redactUrl(value) as T
  if (!value || typeof value !== 'object') return value

  const existing = clones.get(value)
  if (existing !== undefined) return existing as T

  if (Array.isArray(value)) {
    const clone: unknown[] = []
    clones.set(value, clone)
    for (const entry of value) clone.push(redactValue(entry, clones))
    return clone as T
  }

  const clone: Record<string, unknown> = {}
  clones.set(value, clone)
  for (const [key, entry] of Object.entries(value)) clone[key] = redactValue(entry, clones)
  return clone as T
}

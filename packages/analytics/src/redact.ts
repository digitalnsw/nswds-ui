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

/**
 * A return path cut to its path, or `null` when it is not a path on this site. The gate only ever
 * writes a local path, but `from` on the sign-in page's address is whatever a link put there, and
 * `from=https://example.com/person@example.com` must not be reported as a path. A value that does
 * not start with a single `/`, or that resolves off-site (`//host`, `/\\host`), is dropped.
 */
function localPath(value: string): string | null {
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null
  let url: URL
  try {
    url = new URL(value, 'http://redact.invalid')
  } catch {
    return null
  }
  return url.origin === 'http://redact.invalid' ? url.pathname : null
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
 * The characters a campaign value may use: a label in any language, such as `newsletter`,
 * `spring sale`, `nsw-gov_2026`, `café` or `春`. Letters, combining marks (an accent sent
 * decomposed) and digits from any script, plus space and `_.~+-`. No `@`, `/`, `:` or `=`, so an
 * email address, a URL or a nested query is dropped with its parameter, whatever name it was sent
 * under. The `u` flag makes the classes Unicode-aware; there is no `m` flag, so `$` cannot match
 * before a trailing newline.
 */
export const CAMPAIGN_CHARACTERS = /^[\p{L}\p{M}\p{N}_ .~+-]+$/u

/**
 * The longest campaign value kept, in characters as a reader counts them (grapheme clusters), so a
 * label spelled with decomposed accents has the same limit as the same label precomposed.
 */
export const CAMPAIGN_MAX_LENGTH = 100

const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/** Whether a campaign value is a label short enough to keep. */
function isCampaignValue(value: string): boolean {
  if (!CAMPAIGN_CHARACTERS.test(value)) return false
  const length = Array.from(graphemes.segment(value)).length
  return length > 0 && length <= CAMPAIGN_MAX_LENGTH
}

/** The value a parameter is reported with, or `null` to drop it, name and all. */
function allowedValue(key: string, value: string): string | null {
  if (key === RETURN_PARAM) return localPath(value)
  if (CAMPAIGN_PARAMS.has(key) && isCampaignValue(value)) return value
  return null
}

/** A fragment that is only an in-page anchor, such as `#install`. */
const ANCHOR_FRAGMENT = /^#[\p{L}\p{N}_-]{1,100}$/u

/**
 * Whether a page's query string and fragment would pass through `redactUrl` unchanged: every
 * parameter allowed with its value as is, and the fragment empty or a plain anchor. For a reporter
 * that cannot be given a redacted URL, such as Google Tag Manager, which reads the address itself.
 */
export function isCleanLocation(search: string, hash: string): boolean {
  if (hash && !ANCHOR_FRAGMENT.test(hash)) return false
  for (const [key, value] of new URLSearchParams(search)) {
    if (allowedValue(key, value) !== value) return false
  }
  return true
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
  if (!url.search && !url.hash && !url.username && !url.password) return value

  // Credentials in the address (`https://user:secret@host/`) are never reported.
  url.username = ''
  url.password = ''

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

/**
 * Whether a referrer is safe for a reporter that reads it itself, such as Google Tag Manager, whose
 * GA4 tag sends `document.referrer` as `page_referrer`. A referrer from another site is left alone:
 * the browser has already cut it to that site's own policy. One from this site must be clean
 * (`isCleanLocation`); the apps send `Referrer-Policy: strict-origin`, which cuts it to the origin
 * anyway, so this is the backstop for a policy that is ever loosened.
 */
export function isCleanReferrer(referrer: string, origin: string): boolean {
  if (!referrer) return true
  let url: URL
  try {
    url = new URL(referrer)
  } catch {
    return false
  }
  return url.origin !== origin || isCleanLocation(url.search, url.hash)
}

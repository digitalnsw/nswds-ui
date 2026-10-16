/**
 * Query strings and fragments out of every URL the reporters send. The sites put nothing of their
 * own in either, but the sign-in gate (packages/auth/src/proxy.ts) copies the page a signed-out
 * visitor asked for, query and all, into the sign-in page's `from` parameter, so whatever a link
 * carried would otherwise be reported as part of the sign-in page's URL.
 *
 * What survives is an allowlist: the five standard campaign parameters, while their values look like
 * campaign labels (`CAMPAIGN_CHARACTERS`). Every other parameter is dropped, name and value, since
 * a bare name (`?person@example.com`) carries data as well as a value does, and a parameter added
 * later is covered by default. That includes `from`: even cut to its path it is whatever a link put
 * there (`from=/account/person@example.com`), and nothing here can tell a route from personal data. The fragment is dropped too: it is the one part of a URL a link can
 * put data in without it ever reaching a server. Only URL-shaped strings are touched, so an event's
 * opaque `token` property, which posthog-js drops the event without, is left alone.
 */

export const REDACTED_VALUE = '[redacted]'

// Shared by the classifier and the rewriter so the two cannot disagree about what is absolute.
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i

/**
 * The schemes the URL parser reads as absolute however many slashes, of either kind, follow the
 * colon: `https:\\example.com/`, `https:/example.com/` and `https:example.com/` are all
 * `https://example.com/` to a browser following an `href`.
 */
const SPECIAL_SCHEME = /^(?:https?|wss?|ftp|file):/i

/**
 * A value as the URL parser reads it: leading and trailing control characters and spaces stripped,
 * and every tab and newline removed, so `\x01https://…` and `ht\ntps://…` are classified as the
 * URLs they parse to.
 */
function parserInput(value: string): string {
  let start = 0
  let end = value.length
  while (start < end && value.charCodeAt(start) <= 0x20) start++
  while (end > start && value.charCodeAt(end - 1) <= 0x20) end--
  return value.slice(start, end).replace(/[\t\n\r]/g, '')
}

function isAbsolute(input: string): boolean {
  return ABSOLUTE_URL_PATTERN.test(input) || SPECIAL_SCHEME.test(input)
}

/**
 * Link schemes whose target is a person rather than a page: an autocaptured `href` such as
 * `mailto:person@example.com` or `tel:0400…` would otherwise be reported whole. They are not
 * URL-shaped by the test below, so they are matched first and their target is redacted.
 */
const CONTACT_SCHEME = /^(mailto|tel|sms|callto|facetime|skype|whatsapp|geo):/i

/**
 * Absolute URLs and references only: paths (`/…`, or `\…`, which a browser reads as `/…`),
 * queries and fragments. `new URL(value, base)` parses ordinary prose as a relative URL, so a bare
 * "has a `?`" test would rewrite free text this promises to leave alone.
 */
function isUrlShaped(input: string): boolean {
  return isAbsolute(input) || /^[/\\?#]/.test(input)
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
  if (CAMPAIGN_PARAMS.has(key) && isCampaignValue(value)) return value
  return null
}

/**
 * Whether a page's query string and fragment would pass through `redactUrl` unchanged: every
 * parameter allowed with its value as is, and no fragment at all, since `redactUrl` drops every one
 * and an in-page anchor is as much whatever a link put there as any other. For a reporter that
 * cannot be given a redacted URL, such as Google Tag Manager, which reads the address itself.
 */
export function isCleanLocation(search: string, hash: string): boolean {
  if (hash) return false
  for (const [key, value] of new URLSearchParams(search)) {
    if (allowedValue(key, value) !== value) return false
  }
  return true
}

/** Redact one URL string. Anything not URL-shaped comes back unchanged. */
export function redactUrl(value: string): string {
  const input = parserInput(value)
  const contact = CONTACT_SCHEME.exec(input)
  if (contact) return `${contact[1]!.toLowerCase()}:${REDACTED_VALUE}`
  if (!isUrlShaped(input)) return value

  // An absolute URL is parsed without a base: against one with the same scheme, the parser reads
  // `http:example.com` as a relative path rather than the host a browser would go to.
  const absolute = isAbsolute(input)
  let url: URL
  try {
    url = absolute ? new URL(input) : new URL(input, 'http://redact.invalid')
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

  if (absolute) return url.toString()
  // A query-only or fragment-only reference (`?…`, `#…`), such as a captured `href`: only what is
  // left of its query, never the throwaway base's path.
  if (input.startsWith('?') || input.startsWith('#')) return url.search
  // Protocol-relative (`//host/path`, or with either slash a backslash): the host is real and stays.
  if (/^[/\\]{2}/.test(input)) return `//${url.host}${url.pathname}${url.search}`
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
 * GA4 tag sends `document.referrer` as `page_referrer`. Only an origin passes, from any site: a
 * path can carry personal data as well as a query can (`/account/person@example.com`), and nothing
 * here can tell which. Browsers send only the origin across sites by default
 * (`strict-origin-when-cross-origin`), and the apps' own `Referrer-Policy: strict-origin` does the
 * same within a site, so this rarely costs a page view; when a site sends more, the container stays
 * off.
 */
export function isCleanReferrer(referrer: string): boolean {
  if (!referrer) return true
  let url: URL
  try {
    url = new URL(referrer)
  } catch {
    return false
  }
  return !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash
}

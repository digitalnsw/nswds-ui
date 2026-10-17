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
 * there (`from=/account/person@example.com`), and nothing here can tell a route from personal data.
 * The fragment is dropped too: it is the one part of a URL a link can put data in without it ever
 * reaching a server. A path segment holding an email address (`/account/person@example.com`) is
 * redacted wherever a path is reported, the page's own included, since no route here has an `@` in
 * it. Only URL-shaped strings are touched, so an event's opaque `token` property, which posthog-js
 * drops the event without, is left alone; a property named for a URL (`href`, `…_url`,
 * `…referrer`) is always read as one.
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

/** The schemes whose host and path are reported, redacted. Relative references resolve to `http:`. */
const WEB_PROTOCOLS: ReadonlySet<string> = new Set(['http:', 'https:'])

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

/**
 * The grapheme segmenter, made on first use and `null` where the browser has none. Not at module
 * scope: Firefox before 125 has no `Intl.Segmenter`, Next 16 supports Firefox from 111, and a throw
 * while this module loads would stop every page that imports it from hydrating.
 */
let graphemes: Intl.Segmenter | null | undefined

/** A value's length in grapheme clusters, or in code points where they cannot be counted. */
function graphemeCount(value: string): number {
  if (graphemes === undefined) {
    graphemes =
      typeof Intl.Segmenter === 'function'
        ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        : null
  }
  return graphemes ? Array.from(graphemes.segment(value)).length : Array.from(value).length
}

/**
 * The most digits a campaign value may hold, spaces or not between them. A label has a year or a
 * number in it (`nsw-gov_2026`, `issue 12`); a phone number (`0400 123 456`), an account number or
 * a date of birth has more.
 */
export const CAMPAIGN_MAX_DIGITS = 7

/** Whether a campaign value is a label short enough to keep. */
function isCampaignValue(value: string): boolean {
  if (!CAMPAIGN_CHARACTERS.test(value)) return false
  if ((value.match(/\p{N}/gu)?.length ?? 0) > CAMPAIGN_MAX_DIGITS) return false
  const length = graphemeCount(value)
  return length > 0 && length <= CAMPAIGN_MAX_LENGTH
}

/** An at sign, ASCII or fullwidth (`＠`, which some keyboards and pastes produce). */
const AT_SIGN = /[@\uFF20]/

/** The most layers of percent-encoding a segment is unwrapped through. */
const MAX_DECODES = 8

/**
 * Whether a path segment holds an email address, however many times it was percent-encoded
 * (`person%2540example.com` is `person@example.com` decoded twice). Each layer is decoded
 * leniently (`decodeEscapes`), so a malformed escape elsewhere in the segment cannot hide a good one.
 */
function isPersonalSegment(segment: string): boolean {
  let current = segment
  for (let i = 0; i <= MAX_DECODES; i++) {
    if (AT_SIGN.test(current)) return true
    const next = decodeEscapes(current)
    if (next === current) return false
    current = next
  }
  // Still encoded after every layer: nothing here can say what it holds, so it is redacted.
  return true
}

const utf8 = new TextDecoder()

/**
 * One layer of percent-decoding, a run of escapes at a time, as lenient UTF-8: a malformed byte
 * becomes U+FFFD and every valid character around it, a fullwidth `＠` among them, still decodes.
 */
function decodeEscapes(text: string): string {
  return text.replace(/(?:%[0-9a-f]{2})+/gi, (run) => {
    const bytes = new Uint8Array(run.length / 3)
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(run.slice(i * 3 + 1, i * 3 + 3), 16)
    return utf8.decode(bytes)
  })
}

const REDACTED_SEGMENT = encodeURIComponent(REDACTED_VALUE)

/** A path with every segment that holds an email address redacted. */
function redactPathText(path: string): string {
  return path
    .split('/')
    .map((segment) => (isPersonalSegment(segment) ? REDACTED_SEGMENT : segment))
    .join('/')
}

/** Whether a page's path would be reported as it is (`redactPathText` leaves it unchanged). */
export function isCleanPath(pathname: string): boolean {
  return redactPathText(pathname) === pathname
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
  return redact(value, false)
}

/**
 * Redact a value known to be a URL, such as an `href` as written in the page: a document-relative
 * reference (`details?email=…`, `./a`, `../a`) is redacted too, which `redactUrl` leaves alone
 * because prose looks the same.
 */
export function redactHref(value: string): string {
  return redact(value, true)
}

function redact(value: string, knownUrl: boolean): string {
  const input = parserInput(value)
  const contact = CONTACT_SCHEME.exec(input)
  if (contact) return `${contact[1]!.toLowerCase()}:${REDACTED_VALUE}`
  if (!knownUrl && !isUrlShaped(input)) return value

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
  // Only a web address keeps its host and path. Any other scheme (`data:`, `javascript:`, `blob:`,
  // `file:`, an app's own) carries its payload where a web address has its path, and nothing here
  // can read that payload, so only the scheme is reported, as for a contact link.
  if (!WEB_PROTOCOLS.has(url.protocol)) return `${url.protocol}${REDACTED_VALUE}`

  const path = redactPathText(url.pathname)
  if (!url.search && !url.hash && !url.username && !url.password && path === url.pathname) {
    return value
  }

  // Credentials in the address (`https://user:secret@host/`) are never reported.
  url.username = ''
  url.password = ''
  url.pathname = path

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
  if (/^[/\\]/.test(input)) return `${url.pathname}${url.search}`
  // Document-relative (`details?…`, `../a`): its own path as written, which the throwaway base would
  // resolve away. A path holds no `?` or `#`, so it is everything before the first of them.
  return `${redactPathText(input.split(/[?#]/, 1)[0]!)}${url.search}`
}

/**
 * Attributes inside posthog-js's `$elements_chain`, a single string such as
 * `a.nav:attr__href="/x?email=…"href="/x?email=…"nth-child="1"`: each attribute is `name="value"`,
 * after the element's `:` or the previous value's closing quote, with `"` in a value escaped as
 * `\"`. The chain is sent with every autocaptured event, beside `$elements`. A redacted value is
 * written back with `"` and `\` percent-encoded, which leaves nothing in it to escape: posthog-js
 * escapes quotes but not backslashes, so a backslash written back could end the value early.
 */
const CHAIN_ATTRIBUTE = /(?<=^|[:"])([\w-]+)="((?:[^"\\]|\\.)*)"/g

/**
 * Redact every attribute in an elements chain as the same attribute in `$elements` would be
 * (`redactNamed`). A value left as it is keeps its original spelling.
 */
export function redactElementsChain(chain: string): string {
  return chain.replace(CHAIN_ATTRIBUTE, (match, name: string, escaped: string) => {
    const value = escaped.replace(/\\"/g, '"')
    const redacted = redactNamed(value, name)
    if (redacted === value) return match
    return `${name}="${redacted.replace(/["\\]/g, (char) => encodeURIComponent(char))}"`
  })
}

/**
 * Names whose values are URLs whatever they look like: PostHog's own (`$current_url`,
 * `$referrer`, `$initial_referrer`) and the HTML attributes that hold one, bare or as autocapture
 * names them (`href`, `attr__src`, `attr__formaction`). A document-relative value
 * (`avatar?email=…`) is redacted under any of them.
 */
const URL_NAME =
  /(?:^\$?|_)(?:href|url|referrer|src|action|formaction|poster|cite|ping|background)$/i

/** `srcset` and `imagesrcset`: a comma-separated list of URLs, each with an optional descriptor. */
const URL_LIST_NAME = /(?:^|_)(?:image)?srcset$/i

/** Redact each URL in a `srcset`, keeping its descriptor (`2x`, `640w`). */
function redactUrlList(value: string): string {
  return value
    .split(',')
    .map((candidate) => {
      const [url = '', ...descriptor] = candidate.trim().split(/\s+/)
      return [redactHref(url), ...descriptor].join(' ')
    })
    .join(', ')
}

/** Redact a value by what its name says it holds. */
function redactNamed(value: string, name: string | undefined): string {
  if (name === undefined) return redactUrl(value)
  if (URL_LIST_NAME.test(name)) return redactUrlList(value)
  if (URL_NAME.test(name)) return redactHref(value)
  return redactUrl(value)
}

function redactString(value: string, key: string | undefined): string {
  if (key === '$elements_chain') return redactElementsChain(value)
  return redactNamed(value, key)
}

/**
 * Redact every URL-shaped string in a property bag, however deep: PostHog's `$set` and `$set_once`
 * are nested bags holding `$initial_current_url` and `$initial_referrer`. No depth limit, since a
 * cap would pass everything below it through unredacted. Each object maps to its clone before the
 * clone is filled, so a cycle ends and is redacted too. Keys are redacted as well: a heatmap event's
 * `$heatmap_data` is keyed by the page's full address.
 */
export function redactProperties<T>(properties: T): T {
  return redactValue(properties, new WeakMap<object, unknown>(), undefined)
}

function redactValue<T>(value: T, clones: WeakMap<object, unknown>, key: string | undefined): T {
  if (typeof value === 'string') return redactString(value, key) as T
  if (!value || typeof value !== 'object') return value

  const existing = clones.get(value)
  if (existing !== undefined) return existing as T

  if (Array.isArray(value)) {
    const clone: unknown[] = []
    clones.set(value, clone)
    for (const entry of value) clone.push(redactValue(entry, clones, key))
    return clone as T
  }

  const clone: Record<string, unknown> = {}
  clones.set(value, clone)
  for (const [name, entry] of Object.entries(value)) {
    const redactedName = redactUrl(name)
    const redacted = redactValue(entry, clones, name)
    const existing = clone[redactedName]
    // Two addresses that redact to the same one keep both lists (a heatmap's clicks, per page).
    // Defined, not assigned: an own `__proto__` key would otherwise set the clone's prototype.
    Object.defineProperty(clone, redactedName, {
      value:
        Object.hasOwn(clone, redactedName) && Array.isArray(existing) && Array.isArray(redacted)
          ? [...existing, ...redacted]
          : redacted,
      enumerable: true,
      writable: true,
      configurable: true,
    })
  }
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

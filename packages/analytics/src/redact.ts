/**
 * Query strings out of every URL the reporters send. The sites put nothing of their own in a query
 * string, but the sign-in gate (packages/auth/src/proxy.ts) copies the page a signed-out visitor
 * asked for, query and all, into the sign-in page's `from` parameter, so whatever a link carried
 * would otherwise be reported as part of the sign-in page's URL.
 *
 * What survives: `utm_*` campaign parameters, and `from` cut to its path, which still says where
 * the visitor was going. Every other value becomes `[redacted]`, so a parameter added later is
 * covered by default. Values are rewritten rather than removed: posthog-js drops any event whose
 * `token` property a `before_send` hook removed, and only URL-shaped strings are touched, which an
 * opaque token is not.
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
  if (!url.search) return value

  const params = new URLSearchParams()
  for (const [key, entry] of url.searchParams) {
    if (key.startsWith('utm_')) params.append(key, entry)
    else if (key === RETURN_PARAM) params.append(key, pathOnly(entry))
    else params.append(key, REDACTED_VALUE)
  }
  url.search = params.toString()

  if (ABSOLUTE_URL_PATTERN.test(trimmed)) return url.toString()
  // Protocol-relative (`//host/path`): the host is real and stays.
  if (trimmed.startsWith('//')) return `//${url.host}${url.pathname}${url.search}${url.hash}`
  return `${url.pathname}${url.search}${url.hash}`
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

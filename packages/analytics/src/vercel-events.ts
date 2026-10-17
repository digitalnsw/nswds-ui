import { isCleanReferrer, redactUrl } from './redact'

/**
 * Both reporters send the page's full URL, and Speed Insights its route; the sign-in gate puts a
 * requested page's query string in the sign-in page's `from` parameter, so both are redacted first
 * (./redact.ts).
 */
export function redactEvent<T extends { url: string; route?: string }>(event: T): T {
  return {
    ...event,
    url: redactUrl(event.url),
    ...(event.route === undefined ? {} : { route: redactUrl(event.route) }),
  }
}

/**
 * Web Analytics also reports `document.referrer`, which `beforeSend` cannot rewrite. The apps send
 * only an origin (`Referrer-Policy: strict-origin`) and other sites usually do too; when one sends
 * more, the page view is not sent, as Tag Manager does not load (`isCleanReferrer`).
 */
export function redactPageEvent<T extends { url: string }>(event: T): T | null {
  return isCleanReferrer(document.referrer) ? redactEvent(event) : null
}

import { isProductionHost } from './paths'
import { isCleanLocation, isCleanPath, isCleanReferrer } from './redact'

/** The parts of an address the rule reads. */
export interface PageAddress {
  pathname: string
  search: string
  hash: string
}

/** What `tagManagerAllowed` decides from. */
export interface TagManagerContext {
  /** `window.location.hostname`. */
  hostname: string
  /** The address now. */
  current: PageAddress
  /** The address the document was first loaded at, or `null` if it is not known. */
  first: PageAddress | null
  /** `document.referrer`. */
  referrer: string
}

/** Whether an address would be reported as it is: its path, query and fragment all clean. */
function isClean({ pathname, search, hash }: PageAddress): boolean {
  return isCleanPath(pathname) && isCleanLocation(search, hash)
}

/**
 * Whether the shared Google Tag Manager container may load. GA4 reads the address and referrer
 * itself and cannot be handed redacted ones, so it loads only on a production address
 * (`isProductionHost`) where the current address, the document's first address (which the Back
 * button can return to after the container has loaded) and the referrer are all as `redactUrl` and
 * `isCleanReferrer` would report them.
 */
export function tagManagerAllowed({
  hostname,
  current,
  first,
  referrer,
}: TagManagerContext): boolean {
  return (
    isProductionHost(hostname) &&
    isClean(current) &&
    (!first || isClean(first)) &&
    isCleanReferrer(referrer)
  )
}

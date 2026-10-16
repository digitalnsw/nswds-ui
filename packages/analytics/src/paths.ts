/**
 * The path a zone's page is reported at. `usePathname()` in an app with a `basePath` leaves the
 * basePath out, so without this a zone's `/account` would be counted as the host app's `/account`
 * in the host's dashboard. The zone's root is the basePath itself, as Next serves it, not
 * `basePath/`.
 */
export function zonePath(basePath: string, pathname: string): string {
  return pathname === '/' ? basePath : `${basePath}${pathname}`
}

/**
 * The Tag Manager container ID, or `undefined` to render no tag. Unset is the correct state for
 * `next dev` and previews: the ID is a team shared variable in Vercel on Production only.
 */
export function tagManagerId(value: string | undefined): string | undefined {
  return value?.trim() || undefined
}

/** The domain every NSW Design production site is served under. */
export const PRODUCTION_DOMAIN = 'design.nsw.gov.au'

/**
 * Whether the page is on a production address. A production build alone is not enough: a host
 * app's pull-request preview (a `*.vercel.app` address) rewrites a zone's path to the zone's
 * production deployment, so the zone's pages run a production build on a preview address. Checked
 * in the browser, where the address is the one the visitor sees.
 */
export function isProductionHost(hostname: string | undefined): boolean {
  if (!hostname) return false
  return hostname === PRODUCTION_DOMAIN || hostname.endsWith(`.${PRODUCTION_DOMAIN}`)
}

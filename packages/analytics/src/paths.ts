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

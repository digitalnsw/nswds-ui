import { computeRoute } from '@vercel/analytics'

import { zonePath } from './paths'
import { redactUrl } from './redact'

/** The route and path Vercel Web Analytics and Speed Insights report a page at. */
export interface ReportedPage {
  /** The page's route pattern, a dynamic segment as `[name]` (`/[section]`). */
  route: string
  /** The page's own path. */
  path: string
}

/**
 * The route and path a page is reported at: with the zone's `basePath` when there is one, since a
 * zone's reports land in the host app's project, and redacted (./redact.ts), so a path segment
 * holding an email address is not sent in either. `pathname` and `params` are Next's
 * (`usePathname`, `useParams`): the pathname without the basePath, and the dynamic segments' values,
 * which Vercel's own `computeRoute` turns back into `[name]`. Without params, the route is the path.
 */
export function reportedPage(
  basePath: string,
  pathname: string,
  params: Record<string, string | string[] | undefined> | null,
): ReportedPage {
  const atBase = (path: string) => (basePath ? zonePath(basePath, path) : path)
  const values = Object.entries(params ?? {}).filter(
    (entry): entry is [string, string | string[]] => entry[1] !== undefined,
  )
  const route = computeRoute(pathname, values.length ? Object.fromEntries(values) : null)
  return {
    route: redactUrl(atBase(route ?? pathname)),
    path: redactUrl(atBase(pathname)),
  }
}

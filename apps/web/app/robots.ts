import type { MetadataRoute } from 'next'

import { siteURL } from '@/lib/site_name'

/**
 * Crawlers may read every page; until launch the sign-in gate (proxy.ts) answers them with the
 * sign-in page anyway. Excluded:
 *
 * - `/nswa`, the PostHog proxy: `/nswa$` for the bare path and `/nswa/` for everything under it,
 *   matching `isPostHogProxyPath` (analytics-proxy.mjs). A bare `/nswa` prefix would also block an
 *   unrelated future route such as `/nswautomation`.
 * - `/api/` and the infographics zone's `/infographics/api/`: auth endpoints, not pages.
 * - `/registry/`: the legacy registry alias, JSON for the shadcn CLI rather than pages.
 *
 * The sitemap URL is absolute, so a preview deployment's copy still names production.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/nswa$', '/nswa/', '/api/', '/infographics/api/', '/registry/'],
    },
    sitemap: `${siteURL}/sitemap.xml`,
  }
}

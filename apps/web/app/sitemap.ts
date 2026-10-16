import type { MetadataRoute } from 'next'

import { siteURL } from '@/lib/site_name'
import { zones } from '../zones.mjs'

/**
 * The domain's pages: the docs home and the root of each zone whose address this is (zones.mjs,
 * `inSitemap`), at the slashless address the proxy redirects to. Storybook is left out: its own
 * domain is its address. Sign-in, sign-up and account pages are left out; they are not content.
 *
 * No `lastModified`: the only honest value would be the deploy time, and a date that changes on
 * every release without the content changing teaches crawlers to ignore it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteURL}/`, changeFrequency: 'weekly', priority: 1 },
    ...zones
      .filter((zone) => zone.inSitemap)
      .map((zone) => ({
        url: `${siteURL}${zone.path}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
  ]
}

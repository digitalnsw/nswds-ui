import type { MetadataRoute } from 'next'

import { siteURL } from '@/lib/site_name'
import { zones } from '../zones.mjs'

/**
 * The domain's pages: the docs home and each zone's root (zones.mjs), at the slashless address the
 * proxy redirects to. Sign-in, sign-up and account pages are left out; they are not content.
 *
 * No `lastModified`: the only honest value would be the deploy time, and a date that changes on
 * every release without the content changing teaches crawlers to ignore it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteURL}/`, changeFrequency: 'weekly', priority: 1 },
    ...zones.map((zone) => ({
      url: `${siteURL}${zone.path}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}

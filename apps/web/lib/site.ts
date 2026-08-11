import { defineSite } from '@nswds/metadata'

import { siteDescription, siteName, siteURL } from '@/lib/site_name'

/**
 * The single source of this app's identity, for `metadata` and `viewport`.
 *
 * Everything not passed here takes the fleet default: metadataBase, a
 * self-resolving canonical, OpenGraph in en_AU with the NSW image, a
 * large-summary Twitter card, and robots with max-image-preview:large.
 */
export const site = defineSite({
  title: siteName,
  description: siteDescription,
  url: siteURL,
  // NSW Government is both publisher and author of the design system docs, so
  // `creator` and `site` are legitimately the same handle here. It is not a
  // fleet default precisely because that is usually not true.
  twitterCreator: '@DigitalNSW',
})

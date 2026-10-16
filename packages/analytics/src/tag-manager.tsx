import { GoogleTagManager } from '@next/third-parties/google'

import { tagManagerId } from './paths'

/**
 * The Google Tag Manager container the NSW Design sites share (its GA4 tag fires inside it), or
 * nothing when the ID is unset. Place it in `<html>`, before `<body>`. The app passes
 * `process.env.NEXT_PUBLIC_GTM_ID`, read where Next inlines it; setting it in Vercel changes nothing
 * until the next deployment.
 */
export function TagManager({ containerId }: { containerId: string | undefined }) {
  const id = tagManagerId(containerId)
  return id ? <GoogleTagManager gtmId={id} /> : null
}

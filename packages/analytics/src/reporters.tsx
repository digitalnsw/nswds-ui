'use client'

import { Analytics } from '@vercel/analytics/next'
import { Analytics as AnalyticsWithRoute } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SpeedInsights as SpeedInsightsWithRoute } from '@vercel/speed-insights/react'
import { usePathname } from 'next/navigation'

import { zonePath } from './paths'

export interface VercelReportersProps {
  /**
   * The app's Next `basePath`, for a zone served under another app's domain. Its reports load from
   * that domain's root and land in the host app's project, so they are stated with the basePath.
   */
  basePath?: string
}

/**
 * Vercel Web Analytics and Speed Insights. Neither redacts the URL: nothing on these sites writes a
 * visitor's input to its query string.
 */
export function VercelReporters({ basePath }: VercelReportersProps) {
  if (!basePath) {
    return (
      <>
        <Analytics />
        <SpeedInsights />
      </>
    )
  }
  return <ZoneReporters basePath={basePath} />
}

/**
 * For a zone: the route is the path, set on the React components the Next ones wrap. The Next
 * wrappers work the route out from Next's params without the basePath, and their types do not
 * accept one; all they add besides is a microfrontends base path, which a zone does not have. A zone
 * with dynamic segments would need its own route patterns here; neither zone has one.
 */
function ZoneReporters({ basePath }: { basePath: string }) {
  const path = zonePath(basePath, usePathname())
  return (
    <>
      <AnalyticsWithRoute framework='next' route={path} path={path} />
      <SpeedInsightsWithRoute framework='next' route={path} />
    </>
  )
}

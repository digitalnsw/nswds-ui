'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useParams, usePathname } from 'next/navigation'

import { reportedPage } from './report-path'
import { redactEvent, redactPageEvent } from './vercel-events'

export interface VercelReportersProps {
  /**
   * The app's Next `basePath`, for a zone served under another app's domain. Its reports load from
   * that domain's root and land in the host app's project, so they are stated with the basePath.
   */
  basePath?: string
}

/**
 * Vercel Web Analytics and Speed Insights. The React components, given the route and path
 * (`reportedPage`), and their events redacted (./vercel-events.ts), rather than the Next ones, which work both out from Next's hooks and send the
 * path as it is, a segment holding an email address included. Everything else the Next ones add is
 * passed here too: `framework`, and a microfrontend's observability base path and config, which
 * `withMicrofrontends` sets at build time.
 */
export function VercelReporters({ basePath = '' }: VercelReportersProps) {
  const { route, path } = reportedPage(basePath, usePathname(), useParams())
  const observability = {
    framework: 'next',
    basePath: process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH,
    configString: process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG,
  }
  return (
    <>
      <Analytics {...observability} route={route} path={path} beforeSend={redactPageEvent} />
      <SpeedInsights {...observability} route={route} beforeSend={redactEvent} />
    </>
  )
}

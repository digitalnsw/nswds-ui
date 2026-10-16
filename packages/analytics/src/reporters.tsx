'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useParams, usePathname } from 'next/navigation'

import { isCleanReferrer, redactUrl } from './redact'
import { reportedPage } from './report-path'

export interface VercelReportersProps {
  /**
   * The app's Next `basePath`, for a zone served under another app's domain. Its reports load from
   * that domain's root and land in the host app's project, so they are stated with the basePath.
   */
  basePath?: string
}

/**
 * Both reporters send the page's full URL; the sign-in gate puts a requested page's query string in
 * the sign-in page's `from` parameter, so the URL is redacted first (./redact.ts). Module-scope
 * functions, so the props keep one identity and the packages do not re-register them.
 */
function redactEvent<T extends { url: string; route?: string }>(event: T): T {
  return {
    ...event,
    url: redactUrl(event.url),
    ...(event.route === undefined ? {} : { route: redactUrl(event.route) }),
  }
}

/**
 * Web Analytics also reports `document.referrer`, which `beforeSend` cannot rewrite. The apps send
 * only an origin (`Referrer-Policy: strict-origin`) and other sites usually do too; when one sends
 * more, the page view is not sent, as Tag Manager does not load (`isCleanReferrer`).
 */
function redactPageEvent<T extends { url: string }>(event: T): T | null {
  return isCleanReferrer(document.referrer) ? redactEvent(event) : null
}

/**
 * Vercel Web Analytics and Speed Insights. The React components, given the route and path
 * (`reportedPage`), rather than the Next ones, which work both out from Next's hooks and send the
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

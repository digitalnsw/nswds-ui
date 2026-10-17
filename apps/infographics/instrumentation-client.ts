import { startPostHog } from '@workspace/analytics/posthog'
import posthog from 'posthog-js'

// PostHog (@workspace/analytics/posthog): production deployments only, reporting through
// the web app's `/nswa` proxy, which this zone's pages reach on ui.design.nsw.gov.au.
startPostHog(
  posthog,
  { site: 'ui-infographics' },
  {
    token: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    vercelEnv: process.env.NEXT_PUBLIC_NSWDS_VERCEL_ENV,
    hostname: window.location.hostname,
    canonicalHost: 'ui.design.nsw.gov.au',
  },
)

import { startPostHog } from '@workspace/analytics/posthog'
import posthog from 'posthog-js'

// PostHog (@workspace/analytics/posthog): production deployments only, reporting through
// the `/nswa` proxy this app serves for the whole domain (analytics-proxy.mjs).
startPostHog(
  posthog,
  { site: 'ui-web' },
  {
    token: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV,
  },
)

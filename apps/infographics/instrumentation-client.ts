import posthog from 'posthog-js'

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN

if (!projectToken) {
  // Loud in every environment, and deliberately NOT a throw, as on every NSW Design site. A throw
  // escapes the client instrumentation hook and takes the whole client bundle with it: React never
  // hydrates. And not dev-only: NEXT_PUBLIC_ values are inlined at build time, so a token missing
  // from the Vercel project ships a production bundle with no analytics and no other signal. The
  // token is a team shared variable in Vercel (Preview and Production; sensitive variables cannot
  // target Development, so locally it comes from .env).
  console.error(
    '[posthog] NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not set, so no analytics events are being captured. NEXT_PUBLIC_ values are inlined at build time, so check the Vercel project settings AND redeploy. This message stops once the variable is set.',
  )
} else {
  posthog.init(projectToken, {
    // The same-origin reverse proxy (apps/web/analytics-proxy.mjs, which this zone's requests reach through the web app).
    // A root path, so the browser never contacts PostHog directly.
    api_host: '/nswa',
    // Where the toolbar and "view in PostHog" links point. The proxy fronts ingestion only.
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    // MUST be the string, not boolean true: posthog-js only captures client-side route changes for
    // the string. Set explicitly so a future `defaults` bump cannot change pageview behaviour.
    capture_pageview: 'history_change',
    person_profiles: 'identified_only',
    autocapture: true,
    // Session replay is OFF, as on every NSW Design site, and set here so the shared PostHog
    // project's dashboard setting cannot switch it on for this app.
    disable_session_recording: true,
    debug: process.env.NODE_ENV === 'development',
    // The NSW Design sites share one PostHog project, so each stamps a `site` super property:
    // its Vercel project name without the `nswds-` prefix. Registered in `loaded`, which
    // posthog-js runs before it schedules the initial pageview, so the first event carries it.
    loaded: (instance) => {
      instance.register({ site: 'ui-infographics' })
    },
  })
}

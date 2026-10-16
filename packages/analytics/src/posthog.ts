import type { PostHog, PostHogConfig } from 'posthog-js'

import { redactProperties } from './redact'

/**
 * PostHog for the NSW Design sites, which share one PostHog project. Every app calls `startPostHog`
 * from its `instrumentation-client.ts` with the two `NEXT_PUBLIC_` values read there: Next inlines
 * them at build time where they are written, so the app reads them and this module stays testable.
 */

export interface PostHogSiteOptions {
  /** Stamped on every event as `site`: the app's Vercel project name without `nswds-`. */
  site: string
  /**
   * The app shows content that belongs to the person using it (an email being drafted, the details
   * on a signature). Autocapture then records which control was clicked, never its text or its
   * attributes, which carry the same content as `aria-label`, `title` and URLs; and dead-click
   * capture is off, because it records element chains too and watches every DOM mutation, which an
   * editor makes constantly.
   */
  sensitiveContent?: boolean
}

/** The values `startPostHog` needs from the app's build. */
export interface PostHogEnvironment {
  /** `process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: a team shared variable in Vercel. */
  token: string | undefined
  /** `process.env.NEXT_PUBLIC_VERCEL_ENV`: exposed by Vercel on every deployment. */
  vercelEnv: string | undefined
}

/**
 * Only production reports. The token is shared with Preview too, and the proxy serves every
 * deployment, so without this a reviewer clicking through a pull request's preview would be counted
 * as a visitor. Local runs have no `NEXT_PUBLIC_VERCEL_ENV` and are skipped the same way, as the Tag
 * Manager container is.
 */
export function shouldCapture(vercelEnv: string | undefined): boolean {
  return vercelEnv === 'production'
}

/** The `posthog.init` options. Exported so the tests read the same object the apps start with. */
export function posthogOptions({
  site,
  sensitiveContent = false,
}: PostHogSiteOptions): Partial<PostHogConfig> {
  return {
    // The same-origin reverse proxy each domain's host app serves (`analytics-proxy`). A root path,
    // so a zone under a basePath posts to the host too, and the browser never contacts PostHog.
    api_host: '/nswa',
    // Where the toolbar and "view in PostHog" links point. The proxy fronts ingestion only.
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    // MUST be the string, not boolean true: posthog-js only captures client-side route changes for
    // the string. Set explicitly so a future `defaults` bump cannot change pageview behaviour.
    capture_pageview: 'history_change',
    person_profiles: 'identified_only',
    autocapture: true,
    // Each of these is set here rather than left to the shared project's dashboard, where one change
    // would switch it on for every NSW Design site at once.
    //
    // Replay is off on every site.
    disable_session_recording: true,
    // An exception's message and stack can carry whatever the page was handling: an email's text, a
    // pasted URL, an error body. Nothing reads PostHog's error tracking for these sites.
    capture_exceptions: false,
    // Vercel Speed Insights already measures Core Web Vitals on every page; a second collector adds a
    // script, a beacon and a second set of numbers that disagree with the first.
    capture_performance: { web_vitals: false },
    ...(sensitiveContent
      ? { mask_all_text: true, mask_all_element_attributes: true, capture_dead_clicks: false }
      : {}),
    // Query strings out of every captured URL (./redact.ts): `$current_url`, `$referrer` and the
    // `$initial_*` pair. `$set` and `$set_once` sit beside `properties` on the event, not inside it,
    // so each is redacted on its own.
    before_send: (event) => {
      if (!event) return event
      const redacted = { ...event }
      if (redacted.properties) redacted.properties = redactProperties(redacted.properties)
      if (redacted.$set) redacted.$set = redactProperties(redacted.$set)
      if (redacted.$set_once) redacted.$set_once = redactProperties(redacted.$set_once)
      return redacted
    },
    // Registered in `loaded`, which posthog-js runs before it schedules the initial pageview, so the
    // first event carries it.
    loaded: (instance) => {
      instance.register({ site })
    },
  }
}

/** What `startPostHog` did, for the tests. */
export type PostHogStart = 'skipped' | 'missing-token' | 'started'

/**
 * Start PostHog on a production deployment. A missing token there is logged, loudly and once, and
 * never thrown: a throw escapes the client instrumentation hook and takes the whole client bundle
 * with it, so React never hydrates. NEXT_PUBLIC_ values are inlined at build time, so the message
 * says to redeploy.
 */
export function startPostHog(
  posthog: Pick<PostHog, 'init'>,
  options: PostHogSiteOptions,
  { token, vercelEnv }: PostHogEnvironment,
): PostHogStart {
  if (!shouldCapture(vercelEnv)) return 'skipped'

  if (!token) {
    console.error(
      '[posthog] NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not set, so no analytics events are being captured. NEXT_PUBLIC_ values are inlined at build time, so check the Vercel project settings AND redeploy. This message stops once the variable is set.',
    )
    return 'missing-token'
  }

  posthog.init(token, posthogOptions(options))
  return 'started'
}

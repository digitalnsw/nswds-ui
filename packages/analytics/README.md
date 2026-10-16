# @workspace/analytics

Analytics for this repo's Next apps (web and the infographics zone), set up the same way on every NSW Design site.

- `@workspace/analytics/posthog`: `startPostHog(posthog, { site, sensitiveContent }, env)`, called
  from each app's `instrumentation-client.ts`. Production builds on the app's canonical host only
  (where its domain's `/nswa` proxy is); replay, exception capture, PostHog's web vitals and the
  `/flags` request (and with it remote config) are off; `sensitiveContent` also masks element text
  and attributes and turns off dead-click capture. Every captured URL (`src/redact.ts`), including
  the hrefs in `$elements_chain` and the addresses heatmaps are keyed by, loses its fragment, every
  query parameter bar the five standard `utm_` names with label-like values, and any path segment
  holding an email address. The sign-in gate's `from` is dropped too, path and all.
- `@workspace/analytics/reporters`: `<VercelReporters basePath? />`, Vercel Web Analytics and Speed
  Insights. A zone passes its `basePath` so its pages are reported at their real path in the host
  app's project. Both redact the reported URL, route and path the same way (`src/report-path.ts`),
  and a page view whose referrer is more than an origin is not sent.
- `@workspace/analytics/tag-manager`: `<TagManager containerId={process.env.NEXT_PUBLIC_GTM_ID} />`,
  the shared Google Tag Manager container. It renders nothing when the ID is unset or
  `tagManagerAllowed` (`src/tag-manager-rule.ts`) says no: off a `design.nsw.gov.au` address, or
  when the current or first address, or the referrer, needs redacting. GA4 reads those itself.

The `/nswa` proxy PostHog posts to lives in the app that owns each domain, next to its `proxy.ts`.

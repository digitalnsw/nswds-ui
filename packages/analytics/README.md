# @workspace/analytics

Analytics for this repo's Next apps (web and the infographics zone), set up the same way on every NSW Design site.

- `@workspace/analytics/posthog`: `startPostHog(posthog, { site, sensitiveContent }, env)`, called from
  each app's `instrumentation-client.ts`. Production only; replay, exception capture and PostHog's web
  vitals are off; `sensitiveContent` also masks element text and attributes and turns off dead-click
  capture.
- `@workspace/analytics/reporters`: `<VercelReporters basePath? />`, Vercel Web Analytics and Speed
  Insights. A zone passes its `basePath` so its pages are reported at their real path in the host
  app's project.
- `@workspace/analytics/tag-manager`: `<TagManager containerId={process.env.NEXT_PUBLIC_GTM_ID} />`, the
  shared Google Tag Manager container, or nothing when the ID is unset.

The `/nswa` proxy PostHog posts to lives in the app that owns each domain, next to its `proxy.ts`.

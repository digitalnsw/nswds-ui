// The web app's earlier domain, ui.digital.nsw.gov.au, sends people to ui.design.nsw.gov.au (the
// same path and query) except under /registry. Items installed from the registry before it moved
// carry https://ui.digital.nsw.gov.au/registry/... in their registryDependencies, so that path
// keeps answering here directly (the rewrite in next.config.mjs) rather than depending on every
// registry client following a redirect. The domain stays on this project for that reason.

/** The domain everything else moves to. */
export const canonicalOrigin = 'https://ui.design.nsw.gov.au'

/** The earlier domain and its www, as a `has` host pattern (Next anchors it). */
export const earlierHosts = '(?:www\\.)?ui\\.digital\\.nsw\\.gov\\.au'

/** Every path but `/registry` and what is under it (a near-miss like `/registryx` moves). */
export const movedPaths = '/:path((?!registry(?:/|$)).*)'

export function hostRedirects() {
  return [
    {
      source: movedPaths,
      has: [{ type: 'host', value: earlierHosts }],
      destination: `${canonicalOrigin}/:path`,
      permanent: true,
    },
  ]
}

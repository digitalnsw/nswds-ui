// The parts of ui.design.nsw.gov.au another project serves (Next.js multi-zones). This app owns the
// domain; for each zone it rewrites the zone's path, and everything under it, to the zone's own
// custom domain, which serves the same path. A custom domain and not a *.vercel.app name: Vercel
// renames those without notice (it broke the /registry proxy once), and the others sit behind
// Deployment Protection. Each zone's origin can be pointed elsewhere, e.g. at localhost, through
// its environment variable (turbo.json passes them through).
//
// The registry is not a zone: consumers install from its own domain, and `/registry` here is a
// legacy alias with its own rules (next.config.mjs, `origin` in registry.config.json).

/**
 * @typedef {object} Zone
 * @property {`/${string}`} path The path the zone owns here, which its own domain serves too.
 * @property {string} project The Vercel project that serves it.
 * @property {string} origin The zone's own domain, a bare https origin (http on localhost).
 * @property {boolean} trailingSlash Whether the zone serves its root at `path/`: a static
 *   Storybook does (its index.html), a Next app with a basePath serves it at `path` and redirects
 *   `path/` there, so sending the bare path to `path/` would loop.
 */

/** @type {readonly Zone[]} */
export const zones = [
  {
    path: '/infographics',
    project: 'nswds-ui-infographics',
    origin: process.env.INFOGRAPHICS_ORIGIN || 'https://infographics.design.nsw.gov.au',
    trailingSlash: false,
  },
  {
    path: '/storybook',
    project: 'nswds-ui-storybook',
    origin: process.env.STORYBOOK_ORIGIN || 'https://storybook.design.nsw.gov.au',
    trailingSlash: true,
  },
]

const localHosts = new Set(['localhost', '127.0.0.1', '[::1]'])

/** Why an address cannot be a zone's origin, or `undefined` when it can. */
export function refuseOrigin(origin) {
  let url
  try {
    url = new URL(origin)
  } catch {
    return `${origin} is not an address.`
  }
  const local = localHosts.has(url.hostname)
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) {
    return `${origin} must use https (http only on localhost).`
  }
  if (url.username || url.password) return `${origin} must not carry credentials.`
  if (url.pathname !== '/' || url.search || url.hash) {
    return `${origin} must be a bare origin, with no path, query or fragment.`
  }
  return undefined
}

/** The rewrites for each zone: its root and everything under it, to the same path on its origin. */
export function zoneRewrites(list = zones) {
  return list.flatMap((zone) => {
    const refused = refuseOrigin(zone.origin)
    if (refused) throw new Error(`The ${zone.path} zone: ${refused}`)
    if (!/^\/[a-z0-9-]+$/.test(zone.path)) {
      throw new Error(`The zone path ${zone.path} must be one lowercase segment, like /storybook.`)
    }
    const origin = new URL(zone.origin).origin
    return [
      {
        source: zone.path,
        destination: `${origin}${zone.path}${zone.trailingSlash ? '/' : ''}`,
      },
      { source: `${zone.path}/:path+`, destination: `${origin}${zone.path}/:path+` },
    ]
  })
}

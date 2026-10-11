export const siteName = 'NSW Digital Infographics'

export const siteDescription =
  'Infographics built with the NSW Digital UI Design System for NSW Government.'

// This app's own canonical URL (used for metadata / OpenGraph): `/infographics` on the design
// system's domain, which the web app rewrites to this project (apps/web/zones.mjs). The trailing
// slash is load-bearing. Next joins a page's path, which excludes the basePath, onto this one's, so
// `./` on a page below the root resolves to /infographics/<page>.
export const siteURL = 'https://ui.design.nsw.gov.au/infographics/'

// The root page's own address. Joined the same way, the root's path (`/`) would keep the slash and
// name /infographics/, which redirects, so the root page states this instead (app/page.tsx).
export const homeURL = 'https://ui.design.nsw.gov.au/infographics'

// Storybook is served at ui.design.nsw.gov.au/storybook: the web app rewrites that path to this
// project's own domain, which serves the build from the same `storybook/` folder. Every URL in
// Storybook's manager page is relative (`./sb-manager/runtime.js`), which assumes the page's URL
// ends in a slash, but Next on the web app redirects `/storybook/` to `/storybook`, where `./`
// resolves to the domain root. A `<base href="/storybook/">` makes every relative URL resolve
// under the path whatever the page's own URL. It has to be the first element in `<head>`: a URL
// parsed before it resolves against the page's URL, which is why `managerHead` (inserted after the
// favicon, the fonts and the module preloads) cannot carry it.
//
// Run by `npm run build:site`, after `storybook build -o storybook-static/storybook`. It takes no
// arguments: the page and the path are this deployment's, fixed here.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

/** The path the web app serves Storybook at (apps/web/zones.mjs), and its build folder's name. */
export const sitePath = '/storybook/'

const page = fileURLToPath(new URL(`../storybook-static${sitePath}index.html`, import.meta.url))

/** The HTML with `<base href>` as the first element of `<head>`, replacing any base already there. */
export function setBaseHref(html, href) {
  if (!/^\/(?:[a-z0-9-]+\/)+$/.test(href)) {
    throw new Error(
      `The base href ${href} must be an absolute path ending in a slash, like /storybook/.`,
    )
  }
  const withoutBase = html.replace(/<base\b[^>]*>\s*/gi, '')
  const head = /<head(?:\s[^>]*)?>/i.exec(withoutBase)
  if (!head) throw new Error('The page has no <head> to put a base element in.')
  const at = head.index + head[0].length
  return `${withoutBase.slice(0, at)}\n    <base href="${href}" />${withoutBase.slice(at)}`
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  writeFileSync(page, setBaseHref(readFileSync(page, 'utf8'), sitePath))
  console.log(`set-base-href: storybook-static${sitePath}index.html → <base href="${sitePath}">`)
}

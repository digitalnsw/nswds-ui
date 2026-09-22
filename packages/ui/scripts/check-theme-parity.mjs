// Theme-parity guard: the shadcn→NSW token map must agree across both channels.
//
// The same semantic map — `--background: var(--surface-default)`,
// `--primary: var(--action-default)`, … — is maintained BY HAND in two places:
//
//   npm channel:      the `:root { }` block of src/styles/theme.css, compiled
//                     into dist/styles.css AND (once #207 lands) shipped as the
//                     source a single-build consumer compiles via
//                     @nswds/ui/tailwind.css.
//   registry channel: the `registry:theme` item's `cssVars.light` in
//                     registry.json, copied into a consumer's own CSS by
//                     `shadcn add`.
//
// Before #207 the two copies were only semi-internal. Publishing theme.css as
// source makes BOTH consumer-facing: an npm single-build consumer and a registry
// consumer would silently get different tokens if the maps drift. This gate
// fails the build when they do.
//
// It also holds two smaller invariants:
//   - `cssVars.dark` stays empty, matching theme.css carrying no `.dark`
//     override. Both channels rely on the @nswds/tokens role tokens flipping
//     underneath (theme.css comment "No `.dark` override block"). If a real dark
//     override is ever added it must land in BOTH channels — widen this gate then.
//   - the reduced-motion rule (the one bit of raw `css` the registry item
//     carries) matches theme.css's `@media (prefers-reduced-motion: reduce)`.
//
// Scope is deliberately ONLY the `:root` semantic block. theme.css's `@theme` /
// `@theme inline` bridges (`--color-primary: var(--primary)`, the type scale,
// motion) are NOT compared: shadcn regenerates those from `cssVars` on the
// registry side, so they have no registry counterpart to drift against.
//
// Tested by check-theme-parity.test.mjs (AGENTS.md §5: a gate guarding a path
// CI cannot otherwise exercise gets a self-test so it cannot silently stop
// gating).

import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const REDUCED_MOTION_AT_RULE = '@media (prefers-reduced-motion: reduce)'

/** Strip `/* … *\/` block comments so declaration parsing is not fooled by them. */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/**
 * Extract every top-level `:root { … }` declaration block from a CSS string and
 * return the merged custom-property map WITHOUT the leading `--` (so the keys
 * line up with shadcn's cssVars names). Brace-matched, so it is not confused by
 * `@theme`/`@layer` blocks elsewhere in the file. Matches `:root {` only — never
 * `:root:not(…)` or the `@custom-variant dark (&:is(.dark, …))` reference.
 */
export function parseRootVars(css) {
  const clean = stripComments(css)
  const vars = {}
  const rootRe = /:root\s*\{/g
  let match
  while ((match = rootRe.exec(clean)) !== null) {
    // Walk from just after the opening brace to its match, counting depth.
    let depth = 1
    let i = match.index + match[0].length
    const start = i
    for (; i < clean.length && depth > 0; i++) {
      if (clean[i] === '{') depth++
      else if (clean[i] === '}') depth--
    }
    const body = clean.slice(start, i - 1)
    for (const decl of body.matchAll(/--([A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) {
      vars[decl[1]] = decl[2].trim().replace(/\s+/g, ' ')
    }
  }
  return vars
}

/**
 * Extract the reduced-motion declarations from theme.css as a { prop: value }
 * map. Returns {} if the block is absent (a drift the gate then reports).
 */
export function parseReducedMotion(css) {
  const clean = stripComments(css)
  const at = clean.indexOf(REDUCED_MOTION_AT_RULE)
  if (at === -1) return {}
  // The at-rule opens a block, which contains a selector block. Walk to the end
  // of the OUTER block, then read declarations from whatever is inside.
  let depth = 0
  let i = clean.indexOf('{', at)
  const start = i + 1
  for (; i < clean.length; i++) {
    if (clean[i] === '{') depth++
    else if (clean[i] === '}') {
      depth--
      if (depth === 0) break
    }
  }
  const body = clean.slice(start, i)
  const decls = {}
  for (const decl of body.matchAll(/([a-z-]+)\s*:\s*([^;{}]+);/g)) {
    decls[decl[1]] = decl[2].trim().replace(/\s+/g, ' ')
  }
  return decls
}

/** The registry theme item's reduced-motion declarations, flattened to a map. */
function registryReducedMotion(themeItem) {
  const atRule = themeItem?.css?.[REDUCED_MOTION_AT_RULE]
  if (!atRule || typeof atRule !== 'object') return {}
  // The single selector block underneath (`*, ::before, ::after`).
  const selectorBlock = Object.values(atRule)[0]
  if (!selectorBlock || typeof selectorBlock !== 'object') return {}
  const decls = {}
  for (const [prop, value] of Object.entries(selectorBlock)) {
    decls[prop] = String(value).trim().replace(/\s+/g, ' ')
  }
  return decls
}

/**
 * Compare the two token maps and the two smaller invariants. Pure: takes the
 * two source strings, returns { failures: string[] }. The CLI wraps it around
 * the real files.
 */
export function checkThemeParity(themeCss, registryJsonText) {
  const failures = []

  let registry
  try {
    registry = JSON.parse(registryJsonText)
  } catch (error) {
    return { failures: [`registry.json is not valid JSON: ${error.message}`] }
  }

  const themeItem = (registry.items ?? []).find((item) => item.type === 'registry:theme')
  if (!themeItem) {
    return { failures: ['registry.json has no `registry:theme` item to compare against.'] }
  }

  const rootVars = parseRootVars(themeCss)
  if (Object.keys(rootVars).length === 0) {
    return {
      failures: [
        'No `:root { }` custom properties found in theme.css — refusing to report a pass over nothing.',
      ],
    }
  }
  const cssVarsLight = themeItem.cssVars?.light ?? {}

  // Key-set parity.
  for (const name of Object.keys(rootVars)) {
    if (!(name in cssVarsLight)) {
      failures.push(
        `theme.css :root defines --${name} but registry cssVars.light does not. Add "${name}": "${rootVars[name]}" to the theme item, or remove it from :root.`,
      )
    }
  }
  for (const name of Object.keys(cssVarsLight)) {
    if (!(name in rootVars)) {
      failures.push(
        `registry cssVars.light defines "${name}" but theme.css :root does not. Add --${name}: ${cssVarsLight[name]}; to :root, or remove it from the theme item.`,
      )
    }
  }

  // Per-key value parity (only for keys present on both sides).
  for (const name of Object.keys(rootVars)) {
    if (!(name in cssVarsLight)) continue
    const cssValue = rootVars[name]
    const registryValue = String(cssVarsLight[name]).trim().replace(/\s+/g, ' ')
    if (cssValue !== registryValue) {
      failures.push(
        `--${name} differs: theme.css :root = "${cssValue}", registry cssVars.light = "${registryValue}".`,
      )
    }
  }

  // Dark stays empty in both (role tokens flip underneath).
  const cssVarsDark = themeItem.cssVars?.dark ?? {}
  if (Object.keys(cssVarsDark).length > 0) {
    failures.push(
      'registry cssVars.dark is non-empty, but theme.css carries no `.dark` override (role tokens flip underneath). A real dark override must be added to BOTH channels — widen check-theme-parity to compare them.',
    )
  }

  // Reduced-motion rule parity.
  const themeMotion = parseReducedMotion(themeCss)
  const registryMotion = registryReducedMotion(themeItem)
  const motionKeys = new Set([...Object.keys(themeMotion), ...Object.keys(registryMotion)])
  for (const prop of motionKeys) {
    if (themeMotion[prop] !== registryMotion[prop]) {
      failures.push(
        `reduced-motion rule differs for ${prop}: theme.css = ${JSON.stringify(themeMotion[prop] ?? null)}, registry css = ${JSON.stringify(registryMotion[prop] ?? null)}.`,
      )
    }
  }

  return { failures }
}

// ─── Command line ───────────────────────────────────────────────────────────
// Guarded so the test can import the pure functions above without running this.
// pathToFileURL handles paths containing spaces (see the portal-boundary gate's
// spaced-path regression).
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const read = (path) => {
    try {
      return readFileSync(path, 'utf8')
    } catch (error) {
      console.error(`✖ Cannot read ${path} from ${process.cwd()} — run this from packages/ui.`)
      console.error(`  ${error.message}`)
      process.exit(1)
    }
  }
  const { failures } = checkThemeParity(read('src/styles/theme.css'), read('registry.json'))
  if (failures.length > 0) {
    console.error(
      '✖ Theme parity: the npm (:root) and registry (cssVars.light) token maps disagree.\n',
    )
    for (const failure of failures) console.error(`  ${failure}`)
    console.error(
      `\n${failures.length} mismatch(es). The two are hand-maintained copies of one map (see this script's header).`,
    )
    process.exit(1)
  }
  const count = Object.keys(parseRootVars(read('src/styles/theme.css'))).length
  console.log(
    `✔ Theme parity: ${count} tokens agree across theme.css :root and registry cssVars.light.`,
  )
}

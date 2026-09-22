// Theme-parity guard: the shadcn→NSW token map must agree across both channels.
//
// The same semantic map — `--background: var(--surface-default)`,
// `--primary: var(--action-default)`, … — is maintained BY HAND in two places:
//
//   npm channel:      the `:root { }` block of src/styles/theme.css, compiled
//                     into dist/styles.css AND shipped as the source a
//                     single-build consumer compiles via @nswds/ui/tailwind.css.
//   registry channel: the `registry:theme` item's `cssVars.light` in
//                     registry.json, copied into a consumer's own CSS by
//                     `shadcn add`.
//
// Publishing theme.css as source makes BOTH consumer-facing: an npm
// single-build consumer and a registry consumer would silently get different
// tokens if the maps drift. This gate fails the build when they do.
//
// It holds the same invariant for dark and reduced-motion, in lockstep:
//   - dark: the `.dark` / `[data-theme=dark]` declaration blocks in theme.css
//     must match the registry's `cssVars.dark`. Both are empty today (the
//     @nswds/tokens role tokens flip underneath, so theme.css carries no `.dark`
//     override) — but a dark override added to ONE channel now fails instead of
//     silently diverging, rather than the gate merely trusting `cssVars.dark` to
//     stay empty.
//   - reduced-motion: the `@media (prefers-reduced-motion: reduce)` rule must
//     match the registry item's raw `css`, compared SELECTOR-BY-SELECTOR across
//     every selector block and every such media block. Narrowing the published
//     rule to one component, an extra registry selector, or a second media block
//     is a behavioural divergence the gate catches — not just the declaration
//     values under the first selector.
//
// Scope is deliberately the `:root` / `.dark` custom-property blocks and the
// reduced-motion rule. theme.css's `@theme` / `@theme inline` bridges
// (`--color-primary: var(--primary)`, the type scale, motion) are NOT compared:
// shadcn regenerates those from `cssVars` on the registry side, so they have no
// registry counterpart to drift against.
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

/** Normalise a selector so a multi-line CSS selector and a single-string registry
 *  key compare equal: collapse whitespace, then sort the comma-separated members
 *  so a reordered list (`*, ::before, ::after` vs `::before, ::after, *`) is not
 *  reported as a divergence. Assumes no comma nested inside `:is()`/`[attr]`,
 *  which the reduced-motion selectors this handles never use. */
function normalizeSelector(selector) {
  return selector
    .split(',')
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .sort()
    .join(', ')
}

/**
 * Merge the custom-property declarations of every block whose selector matches
 * `selectorRe` (which must match up to and including the block's opening `{`).
 * Brace-matched, so `@theme`/`@layer` blocks elsewhere never leak in. Keys drop
 * the leading `--` so they line up with shadcn's cssVars names.
 */
function extractVarsFromBlocks(css, selectorRe) {
  const clean = stripComments(css)
  const vars = {}
  let match
  while ((match = selectorRe.exec(clean)) !== null) {
    let depth = 1
    let i = match.index + match[0].length
    const start = i
    for (; i < clean.length && depth > 0; i++) {
      if (clean[i] === '{') depth++
      else if (clean[i] === '}') depth--
    }
    const body = clean.slice(start, i - 1)
    // Split on `;` rather than requiring a trailing one, so a semicolon-less
    // final declaration is still read; the name accepts any custom-property
    // ident (underscores, non-ASCII), not only `[A-Za-z0-9-]`.
    for (const decl of body.split(';')) {
      const parsed = /^\s*--([^\s:]+)\s*:\s*([\s\S]+)$/.exec(decl)
      if (parsed) vars[parsed[1]] = parsed[2].trim().replace(/\s+/g, ' ')
    }
  }
  return vars
}

/** `:root { }` custom properties, keyed WITHOUT the leading `--`. */
export function parseRootVars(css) {
  return extractVarsFromBlocks(css, /:root\s*\{/g)
}

/**
 * Dark-scoped custom properties, from any block whose selector prelude contains
 * a `.dark` class or `[data-theme=dark]` attribute — `.dark { }`,
 * `[data-theme='dark'] { }`, or a selector list such as `.dark, .dark * { }`.
 * Keyed without `--`.
 *
 * The token may sit anywhere in the prelude, not only immediately before `{`.
 * The prelude is bounded by `[^{};@]*` (no `;`, `{`, `}` or `@`) so a match
 * cannot run from the `@custom-variant dark (&:is(.dark, …));` reference — which
 * ends in `;` and opens no block — into an unrelated block's braces, and
 * `(?![\w-])` keeps `.dark` from matching `.dark-mode` / `.darker`. Empty on the
 * current tree: the state the gate proves stays in step with `cssVars.dark`.
 */
export function parseDarkVars(css) {
  return extractVarsFromBlocks(css, /(?:\.dark(?![\w-])|\[data-theme=['"]?dark['"]?\])[^{};@]*\{/g)
}

/** Split a `{ … }` body into { normalizedSelector: { prop: value } }. */
function parseSelectorBlocks(body) {
  const rules = {}
  for (const block of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = normalizeSelector(block[1])
    const decls = rules[selector] ?? (rules[selector] = {})
    for (const decl of block[2].matchAll(/([a-z-]+)\s*:\s*([^;{}]+);/g)) {
      decls[decl[1]] = decl[2].trim().replace(/\s+/g, ' ')
    }
  }
  return rules
}

/**
 * Every reduced-motion rule in theme.css as { selector: { prop: value } },
 * merged across however many `@media (prefers-reduced-motion: reduce)` blocks
 * the file carries. Selector-aware: a narrowed selector or a second block
 * changes this map.
 */
export function parseReducedMotion(css) {
  const clean = stripComments(css)
  // Whitespace-tolerant matcher for the SAME media query the registry key names
  // (REDUCED_MOTION_AT_RULE, reused in registryReducedMotion) — DERIVED from that
  // constant so the two can't drift: escape it, then let whitespace flex around
  // each structural token (`(`, `)`, `:`, and after `@media`), so a reformat of
  // theme.css can't leave the block silently unmatched.
  const openRe = new RegExp(
    REDUCED_MOTION_AT_RULE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(
      /\s+|\\?[():]/g,
      (token) => (/^\s+$/.test(token) ? '\\s*' : `\\s*${token}\\s*`),
    ) + '\\s*\\{',
    'g',
  )
  const rules = {}
  let match
  while ((match = openRe.exec(clean)) !== null) {
    let depth = 1
    let i = match.index + match[0].length
    const start = i
    for (; i < clean.length && depth > 0; i++) {
      if (clean[i] === '{') depth++
      else if (clean[i] === '}') depth--
    }
    for (const [selector, decls] of Object.entries(
      parseSelectorBlocks(clean.slice(start, i - 1)),
    )) {
      rules[selector] = { ...(rules[selector] ?? {}), ...decls }
    }
  }
  return rules
}

/**
 * The registry theme item's reduced-motion rule as { selector: { prop: value } },
 * reading EVERY selector block under the media rule (not just the first).
 */
export function registryReducedMotion(themeItem) {
  const atRule = themeItem?.css?.[REDUCED_MOTION_AT_RULE]
  if (!atRule || typeof atRule !== 'object') return {}
  const rules = {}
  for (const [selector, decls] of Object.entries(atRule)) {
    if (!decls || typeof decls !== 'object') continue
    const norm = normalizeSelector(selector)
    rules[norm] = {}
    for (const [prop, value] of Object.entries(decls)) {
      rules[norm][prop] = String(value).trim().replace(/\s+/g, ' ')
    }
  }
  return rules
}

/**
 * Compare two { name: value } custom-property maps. `cssName` / `registryName`
 * name each side in the message (`:root` ⟺ `cssVars.light`, `.dark` ⟺
 * `cssVars.dark`).
 */
function compareVarMaps({ cssName, registryName }, cssVars, registryVars, failures) {
  for (const name of Object.keys(cssVars)) {
    if (!(name in registryVars)) {
      failures.push(
        `theme.css ${cssName} defines --${name} but registry ${registryName} does not. Add "${name}": "${cssVars[name]}" to the theme item, or remove it from ${cssName}.`,
      )
    }
  }
  for (const name of Object.keys(registryVars)) {
    if (!(name in cssVars)) {
      failures.push(
        `registry ${registryName} defines "${name}" but theme.css ${cssName} does not. Add --${name}: ${registryVars[name]}; to ${cssName}, or remove it from the theme item.`,
      )
    }
  }
  for (const name of Object.keys(cssVars)) {
    if (!(name in registryVars)) continue
    const cssValue = cssVars[name]
    const registryValue = String(registryVars[name]).trim().replace(/\s+/g, ' ')
    if (cssValue !== registryValue) {
      failures.push(
        `--${name} differs: theme.css ${cssName} = "${cssValue}", registry ${registryName} = "${registryValue}".`,
      )
    }
  }
}

/** Compare two { selector: { prop: value } } rule maps, per (selector, prop). */
function compareRuleMaps(label, cssRules, registryRules, failures) {
  const selectors = new Set([...Object.keys(cssRules), ...Object.keys(registryRules)])
  for (const selector of selectors) {
    const css = cssRules[selector]
    const registry = registryRules[selector]
    if (!css) {
      failures.push(`${label}: registry defines selector "${selector}" that theme.css does not.`)
      continue
    }
    if (!registry) {
      failures.push(
        `${label}: theme.css defines selector "${selector}" that the registry does not.`,
      )
      continue
    }
    for (const prop of new Set([...Object.keys(css), ...Object.keys(registry)])) {
      if (css[prop] !== registry[prop]) {
        failures.push(
          `${label}: "${selector}" { ${prop} } differs: theme.css = ${JSON.stringify(css[prop] ?? null)}, registry = ${JSON.stringify(registry[prop] ?? null)}.`,
        )
      }
    }
  }
}

/**
 * Compare the token maps and the dark / reduced-motion invariants. Pure: takes
 * the two source strings, returns { failures: string[] }. The CLI wraps it
 * around the real files.
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

  // Light: :root ⟺ cssVars.light.
  compareVarMaps(
    { cssName: ':root', registryName: 'cssVars.light' },
    rootVars,
    themeItem.cssVars?.light ?? {},
    failures,
  )

  // Dark: `.dark` / `[data-theme=dark]` ⟺ cssVars.dark. Both empty today; the
  // point is that a dark override added to one channel fails here.
  compareVarMaps(
    { cssName: '.dark/[data-theme=dark]', registryName: 'cssVars.dark' },
    parseDarkVars(themeCss),
    themeItem.cssVars?.dark ?? {},
    failures,
  )

  // Reduced-motion: selector-aware, across every media block / selector.
  compareRuleMaps(
    'reduced-motion',
    parseReducedMotion(themeCss),
    registryReducedMotion(themeItem),
    failures,
  )

  // `tokenCount` lets the CLI report the success count without re-reading and
  // re-parsing theme.css (rootVars is already computed above).
  return { failures, tokenCount: Object.keys(rootVars).length }
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
  const { failures, tokenCount } = checkThemeParity(
    read('src/styles/theme.css'),
    read('registry.json'),
  )
  if (failures.length > 0) {
    console.error(
      '✖ Theme parity: the npm (theme.css) and registry (cssVars/css) token maps disagree.\n',
    )
    for (const failure of failures) console.error(`  ${failure}`)
    console.error(
      `\n${failures.length} mismatch(es). The two are hand-maintained copies of one map (see this script's header).`,
    )
    process.exit(1)
  }
  console.log(
    `✔ Theme parity: ${tokenCount} tokens agree across theme.css :root and registry cssVars.light (dark + reduced-motion in step).`,
  )
}

// Font-stack guard: proves the NSW typefaces actually win in a compiled stylesheet.
//
// Two ways this has silently failed, both shipping text in system fonts with
// every other gate green:
//
//   1. theme.css redeclared `--font-sans: var(--font-sans)` (and mono) in its
//      `@theme inline` block from #14 until the fix. A custom property that
//      references itself is guaranteed-invalid, so both stacks computed empty.
//   2. In the two-build setup (styles.css + the app's own `@import 'tailwindcss'`)
//      the app's build re-emits Tailwind's default stacks into the same
//      `@layer theme`, after ours, so they win unless the app maps the families
//      back (README "Fonts").
//
// A grep for "the last `--font-sans:` in the file" catches both but guesses at
// the cascade: it ignores layers, `!important`, and declarations scoped under
// `@media`/`@supports` or other selectors, and it accepts `var(--x)` without
// checking `--x` exists. This models the parts of the cascade that decide a
// root custom property — unlayered beats layered, later layers beat earlier
// ones, later beats earlier within a layer — resolves `var()` chains (with
// fallbacks and cycle detection), and REFUSES to guess when a property it needs
// is declared somewhere it does not model, instead of passing.
//
// It also exports `findCycles`, which `verify-dist.mjs` runs over every root
// custom property in dist/styles.css so the cycle class cannot return under a
// different name (`--radius: var(--radius)`, …).
//
// Usage: node check-font-stack.mjs --css <file> [--label <name>]
// Tested by check-font-stack.test.mjs (AGENTS.md §5).

import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/** The values each property must resolve to: the NSW stacks from @nswds/tokens. */
export const FONT_EXPECTATIONS = [
  { prop: '--default-font-family', want: /^["']?Public Sans["']?\s*,/, family: 'Public Sans' },
  { prop: '--font-sans', want: /^["']?Public Sans["']?\s*,/, family: 'Public Sans' },
  {
    prop: '--default-mono-font-family',
    want: /^["']?JetBrains Mono["']?\s*,/,
    family: 'JetBrains Mono',
  },
  { prop: '--font-mono', want: /^["']?JetBrains Mono["']?\s*,/, family: 'JetBrains Mono' },
]

const ROOT_SELECTORS = new Set([':root', ':host'])

/** Index just past the quote that closes the string opening at `start`. */
function skipString(css, start) {
  const quote = css[start]
  let i = start + 1
  while (i < css.length && css[i] !== quote) i += css[i] === '\\' ? 2 : 1
  return i + 1
}

/**
 * Parse every custom-property declaration with the context it sits in.
 * Returns `{ decls, layerRank }`: each decl is `{ prop, value, important,
 * layer, rules, order }`, where `layer` is the dotted `@layer` path (null when
 * unlayered) and `rules` is every non-layer prelude around it, outermost
 * first. `layerRank` maps a layer name to its first-appearance order, which is
 * the cascade order of layers (later wins).
 */
export function parseCss(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const decls = []
  const layerRank = new Map()
  const stack = []
  let anonymous = 0
  let start = 0
  let parens = 0

  const registerLayer = (name) => {
    if (!layerRank.has(name)) layerRank.set(name, layerRank.size)
  }
  const layerPath = () =>
    stack
      .filter((entry) => entry.layer !== undefined)
      .map((entry) => entry.layer)
      .join('.') || null

  const statement = (text) => {
    const segment = text.trim()
    if (!segment) return
    if (segment.startsWith('@')) {
      const names = /^@layer\s+([^{]+)$/.exec(segment)
      if (names) {
        const prefix = layerPath()
        for (const name of names[1]
          .split(',')
          .map((n) => n.trim())
          .filter(Boolean)) {
          registerLayer(prefix ? `${prefix}.${name}` : name)
        }
      }
      return
    }
    if (!segment.startsWith('--')) return
    const colon = segment.indexOf(':')
    if (colon === -1) return
    let value = segment.slice(colon + 1).trim()
    const important = /!\s*important$/i.test(value)
    if (important) value = value.replace(/!\s*important$/i, '').trim()
    decls.push({
      prop: segment.slice(0, colon).trim(),
      value,
      important,
      layer: layerPath(),
      rules: stack.filter((entry) => entry.layer === undefined).map((entry) => entry.prelude),
      order: decls.length,
    })
  }

  for (let i = 0; i < css.length; i++) {
    const ch = css[i]
    if (ch === '\\') {
      // An escaped character is never structure: Tailwind selectors are full
      // of them (`.\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]`), and reading
      // `\'` as a string opener or `\(` as a paren silently swallows the rest
      // of the file.
      i++
    } else if (ch === '"' || ch === "'") {
      i = skipString(css, i) - 1
    } else if (ch === '(') {
      parens++
    } else if (ch === ')') {
      parens = Math.max(0, parens - 1)
    } else if (parens > 0) {
      // `;`, `{` and `}` inside url(data:…;base64,…) or var() are not structure.
    } else if (ch === '{') {
      const prelude = css.slice(start, i).trim().replace(/\s+/g, ' ')
      const layer = /^@layer\b\s*(.*)$/.exec(prelude)
      if (layer) {
        const prefix = layerPath()
        const own = layer[1].trim() || `<anonymous-${anonymous++}>`
        const name = prefix ? `${prefix}.${own}` : own
        registerLayer(name)
        stack.push({ prelude, layer: own })
      } else {
        stack.push({ prelude })
      }
      start = i + 1
    } else if (ch === ';') {
      statement(css.slice(start, i))
      start = i + 1
    } else if (ch === '}') {
      statement(css.slice(start, i))
      stack.pop()
      start = i + 1
    }
  }
  statement(css.slice(start))
  return { decls, layerRank }
}

/** A declaration the root element gets unconditionally: `:root`/`:host` only, no at-rule but @layer. */
function isRootDecl(decl) {
  if (decl.rules.length !== 1) return false
  const members = decl.rules[0].split(',').map((s) => s.trim())
  return members.length > 0 && members.every((s) => ROOT_SELECTORS.has(s))
}

/** Every declaration of `prop` that this model cannot place in the root cascade. */
export function unmodelledDecls(parsed, prop) {
  return parsed.decls.filter((d) => d.prop === prop && (!isRootDecl(d) || d.important))
}

/** The root declaration of `prop` that wins the cascade, or undefined. */
export function winningDecl(parsed, prop) {
  let best
  const rank = (d) => (d.layer === null ? Infinity : parsed.layerRank.get(d.layer))
  for (const decl of parsed.decls) {
    if (decl.prop !== prop || !isRootDecl(decl) || decl.important) continue
    if (
      !best ||
      rank(decl) > rank(best) ||
      (rank(decl) === rank(best) && decl.order > best.order)
    ) {
      best = decl
    }
  }
  return best
}

/** Split `var(--x, fallback)` arguments at the first top-level comma. */
function splitVarArgs(inner) {
  let depth = 0
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (ch === '"' || ch === "'") i = skipString(inner, i) - 1
    else if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (ch === ',' && depth === 0) return [inner.slice(0, i).trim(), inner.slice(i + 1).trim()]
  }
  return [inner.trim(), undefined]
}

/**
 * Resolve the computed value of root custom property `prop`.
 * Returns `{ ok: true, value, chain }` or `{ ok: false, reason, chain }` where
 * reason is 'undeclared' | 'cycle' | 'unmodelled' | 'invalid'.
 */
export function resolveRoot(parsed, prop, seen = [], { rootOnly = false } = {}) {
  const chain = [...seen, prop]
  if (seen.includes(prop)) return { ok: false, reason: 'cycle', chain }
  // rootOnly (cycle detection): judge the root declarations alone. A property
  // also declared under `.dark` or `@media` still has a root value, and a
  // cycle there is invalid at the root whatever the other contexts say.
  if (!rootOnly && unmodelledDecls(parsed, prop).length > 0) {
    return { ok: false, reason: 'unmodelled', chain }
  }
  const decl = winningDecl(parsed, prop)
  if (!decl) return { ok: false, reason: 'undeclared', chain }
  return substitute(parsed, decl.value, chain, { rootOnly })
}

/**
 * Index of the next real `var(` call at or after `from`, or -1. A plain
 * indexOf would also match text inside a quoted string (`"var(--x)"` is
 * content, not a reference) and the tail of another identifier (`myvar(`),
 * both of which would invent references — and false cycles.
 */
function nextVarCall(value, from) {
  for (let i = from; i < value.length; i++) {
    const ch = value[i]
    if (ch === '\\') i++
    else if (ch === '"' || ch === "'") i = skipString(value, i) - 1
    else if (value.startsWith('var(', i) && !/[\w-]/.test(value[i - 1] ?? '')) return i
  }
  return -1
}

function substitute(parsed, value, chain, opts) {
  let out = ''
  let i = 0
  while (i < value.length) {
    const at = nextVarCall(value, i)
    if (at === -1) break
    out += value.slice(i, at)
    let depth = 1
    let j = at + 4
    for (; j < value.length && depth > 0; j++) {
      if (value[j] === '"' || value[j] === "'") j = skipString(value, j) - 1
      else if (value[j] === '(') depth++
      else if (value[j] === ')') depth--
    }
    const [name, fallback] = splitVarArgs(value.slice(at + 4, j - 1))
    const resolved = resolveRoot(parsed, name, chain, opts)
    if (resolved.ok) {
      out += resolved.value
    } else if (resolved.reason === 'undeclared' && fallback !== undefined) {
      const fb = substitute(parsed, fallback, chain, opts)
      if (!fb.ok) return fb
      out += fb.value
    } else {
      return { ok: false, reason: resolved.reason, chain: resolved.chain }
    }
    i = j
  }
  out += value.slice(i)
  const trimmed = out.trim()
  return trimmed ? { ok: true, value: trimmed, chain } : { ok: false, reason: 'invalid', chain }
}

/** Names referenced by the top-level var() calls in `value` (not those inside fallbacks). */
function primaryRefs(value) {
  const names = []
  for (let at = nextVarCall(value, 0); at !== -1;) {
    let depth = 1
    let j = at + 4
    for (; j < value.length && depth > 0; j++) {
      if (value[j] === '"' || value[j] === "'") j = skipString(value, j) - 1
      else if (value[j] === '(') depth++
      else if (value[j] === ')') depth--
    }
    names.push(splitVarArgs(value.slice(at + 4, j - 1))[0])
    at = nextVarCall(value, j)
  }
  return names
}

/**
 * Custom properties whose value depends on themselves, so they are
 * guaranteed-invalid: root properties through any chain of root declarations
 * (whatever other contexts also declare them), plus any declaration in any
 * other context that references itself directly (`.dark{--x:var(--x)}`).
 */
export function findCycles(parsed) {
  const cycles = []
  const props = new Set(parsed.decls.filter(isRootDecl).map((d) => d.prop))
  for (const prop of props) {
    const result = resolveRoot(parsed, prop, [], { rootOnly: true })
    if (!result.ok && result.reason === 'cycle' && result.chain[result.chain.length - 1] === prop) {
      cycles.push(result.chain.join(' → '))
    }
  }
  for (const decl of parsed.decls) {
    if (isRootDecl(decl) || !primaryRefs(decl.value).includes(decl.prop)) continue
    const where = [...(decl.layer ? [`@layer ${decl.layer}`] : []), ...decl.rules].join(' ')
    cycles.push(`${decl.prop} → ${decl.prop} (in ${where})`)
  }
  return cycles
}

/** Check every FONT_EXPECTATIONS property; returns a list of human-readable problems. */
export function checkFontStack(css, label = 'stylesheet') {
  const parsed = parseCss(css)
  const problems = []
  for (const { prop, want, family } of FONT_EXPECTATIONS) {
    const result = resolveRoot(parsed, prop)
    if (result.ok) {
      if (!want.test(result.value)) {
        problems.push(
          `${label}: ${prop} resolves to '${result.value.replace(/\s+/g, ' ')}' (via ${result.chain.join(' → ')}), ` +
            `not the ${family} stack — text renders in system fonts.`,
        )
      }
      continue
    }
    const where = result.chain.join(' → ')
    const reasons = {
      undeclared: `${where}: not declared on :root, so it is guaranteed-invalid`,
      cycle: `${where}: references itself, so it is guaranteed-invalid (the theme.css cycle)`,
      unmodelled:
        `${where}: declared under a selector, at-rule or !important this check does not model, ` +
        `so it cannot tell which value wins — extend check-font-stack.mjs rather than guessing`,
      invalid: `${where}: resolves to an empty value`,
    }
    problems.push(
      `${label}: ${prop} does not resolve to the ${family} stack — ${reasons[result.reason]}.`,
    )
  }
  return problems
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const usage = 'Usage: node check-font-stack.mjs --css <file.css> [--label <name>]'
  const values = {}
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i++) {
    const name = args[i]
    if (name !== '--css' && name !== '--label') {
      console.error(`Unknown argument: ${name}\n${usage}`)
      process.exit(2)
    }
    const value = args[++i]
    // Nothing, an empty string, or the next flag all mean this flag got no value.
    if (value === undefined || value === '' || value.startsWith('--')) {
      console.error(`${name} needs a value.\n${usage}`)
      process.exit(2)
    }
    values[name] = value
  }
  if (!values['--css']) {
    console.error(usage)
    process.exit(2)
  }
  // Only ever read a compiled stylesheet: an existing regular .css file.
  const file = resolve(values['--css'])
  if (extname(file) !== '.css' || !existsSync(file) || !statSync(file).isFile()) {
    console.error(`--css must name an existing .css file, got ${values['--css']}`)
    process.exit(2)
  }
  const label = values['--label'] ?? values['--css']
  const problems = checkFontStack(readFileSync(file, 'utf8'), label)
  if (problems.length > 0) {
    for (const problem of problems) console.error(`::error::${problem}`)
    process.exit(1)
  }
  console.log(`✔ Font stacks: Public Sans and JetBrains Mono win in ${label}.`)
}

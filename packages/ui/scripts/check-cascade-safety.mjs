// Cascade-safety guard for the PUBLISHED stylesheet.
//
// THE HAZARD
//
// dist/styles.css emits this package's utilities into the plain `utilities`
// cascade layer. A consumer who follows the README — import the stylesheet, then
// run their own Tailwind build over their own markup — ends up with TWO
// independently-sorted sets of utilities in that one layer:
//
//   @import '@nswds/ui/styles.css';   /* our utilities, sorted by our build  */
//   @import 'tailwindcss';            /* their utilities, sorted by theirs   */
//
// Within a single Tailwind build the sorter guarantees `.lg\:justify-start` is
// emitted after `.justify-center`, so the responsive rule wins from `lg` up.
// Across two builds there is no such guarantee, and a media query adds no
// specificity. So when a consuming app happens to use `justify-center` in its
// OWN markup, its copy of `.justify-center` lands after our `.lg\:justify-start`
// and wins — on a Footer element the app never referenced. That is exactly what
// broke Footer's legal-link and social rows for a consumer on v4.3.0: centred at
// every width instead of splitting left/right from `lg`.
//
// Layer ordering cannot fix it. Whichever half goes on top, the other loses
// wholesale: put ours above theirs and our plain `.inline-flex` (Button's base)
// outranks their `hidden sm:inline-flex`, so a button meant to be hidden on
// mobile shows everywhere. The two halves need to INTERLEAVE by Tailwind's sort
// order, and no cascade mechanism can do that across two builds.
//
// THE INVARIANT THIS ENFORCES
//
// Make our own class strings ordering-independent, so it never matters where a
// consumer's duplicate of one of our rules lands:
//
//   when a component's class string pairs a rule with a CONDITIONAL rule (media
//   or container query) for the same property and the same target, the two
//   conditions must be mutually exclusive.
//
// In practice that means reaching for complementary variants instead of a bare
// utility plus a responsive override of it:
//
//   'justify-center lg:justify-start'          ← breaks: from `lg` up both rules
//                                                apply and only source order
//                                                separates them
//   'max-lg:justify-center lg:justify-start'   ← safe: `(width < 1200px)` and
//                                                `(width >= 1200px)` never
//                                                overlap, and the element no
//                                                longer carries the bare class a
//                                                consumer's build is likely to
//                                                emit
//
//   'transition-colors motion-reduce:transition-none'  ← breaks
//   'motion-safe:transition-colors'                    ← safe
//
// The rewrites are visually identical, cost consumers nothing, and — unlike a
// call-site override or a documented import order — cannot be got wrong by the
// consumer. See packages/ui/README.md ("Using it with your own Tailwind build")
// for the consumer-facing half of this.
//
// Selector-differentiated pairs (`hover:` vs `active:`, `before:` vs the element
// itself, two `data-*` states) are NOT flagged: they target different states or
// different boxes, so the cascade separates them by specificity or they never
// apply together. Only conditional at-rules — where the winner is decided purely
// by emission order — are order-dependent in the way that survives a rebuild.
//
// HOW IT CHECKS
//
// The built stylesheet is the ground truth for what each class actually
// declares, so this reads properties, values and at-rule context straight out of
// it rather than modelling Tailwind. Then it tokenises the class strings in src/
// and flags any pair that lands on one element and violates the invariant.
//
// Point it at a CONSUMER's final stylesheet to test the real two-build
// configuration — scripts/test-consumer-fixture.sh does exactly that:
//
//   node scripts/check-cascade-safety.mjs --css <consumer-bundle>.css --src src

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

// ── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
let cssPath = 'dist/styles.css'
const sourceDirs = []

for (let i = 0; i < args.length; i++) {
  const flag = args[i]
  if (flag === '--css' || flag === '--src') {
    const value = args[++i]
    // Nothing, an empty string, or the next flag all mean this flag got no
    // path. Swallowing the next flag would blame whatever followed it — and an
    // empty one reaches existsSync('') and reports a build problem instead.
    if (value === undefined || value === '' || value.startsWith('--')) {
      console.error(`${flag} needs a path.`)
      process.exit(2)
    }
    if (flag === '--css') {
      cssPath = value
    } else {
      sourceDirs.push(value)
    }
  } else {
    console.error(`Unknown argument: ${flag}`)
    process.exit(2)
  }
}

if (sourceDirs.length === 0) {
  sourceDirs.push('src')
}

if (!existsSync(cssPath)) {
  console.error(
    `Cascade safety: ${cssPath} not found. Build the package first (npm run build:css -w @nswds/ui).`,
  )
  process.exit(1)
}

// ── CSS → class → rules ──────────────────────────────────────────────────────

/**
 * Split a selector list on its top-level commas only. The `dark:` variant
 * compiles to `:is(.dark, .dark *, [data-theme='dark'], [data-theme='dark'] *)`,
 * so a naive `split(',')` shreds one selector into fragments — and truncates
 * away the trailing `:hover` that distinguishes `dark:hover:text-white` from
 * `dark:text-white`.
 */
function splitSelectors(prelude) {
  const selectors = []
  let depth = 0
  let current = ''

  for (const char of prelude) {
    if (char === '(' || char === '[') {
      depth++
    } else if (char === ')' || char === ']') {
      depth--
    } else if (char === ',' && depth === 0) {
      selectors.push(current)
      current = ''
      continue
    }
    current += char
  }
  selectors.push(current)

  return selectors
}

/**
 * Everything in a utility's selector after its own class token: the pseudo-
 * classes, attribute conditions, combinators and pseudo-elements the variant
 * added. `.lg\:justify-start` → `''`; `.hover\:bg-x:hover` → `':hover'`;
 * `.before\:bg-x::before` → `'::before'`.
 *
 * Two rules are only comparable when their signatures match, which is what
 * keeps state and pseudo-element variants out of the results: they either style
 * a different box, or the cascade already separates them by specificity.
 */
function targetSignature(selector) {
  // Escaped characters (`.lg\:justify-start`) are literal, not combinators, so
  // blank them out before looking for the end of the leading class token.
  const masked = selector.replace(/\\./g, 'XX')
  const match = masked.match(/^\.[^\s.:[>+~]+/)
  return match ? selector.slice(match[0].length) : null
}

/**
 * Turn one at-rule prelude into constraints on named axes. Two contexts are
 * provably disjoint when they constrain a shared axis incompatibly — a
 * `(width < 1200px)` rule and a `(width >= 1200px)` rule can never both apply,
 * so their order is irrelevant.
 *
 * Anything not understood contributes no constraint, which leaves contexts
 * looking OVERLAPPING — the conservative direction: a false report is visible
 * and fixable, a missed one ships.
 */
function constraintsOf(prelude) {
  const constraints = []
  const container = prelude.match(/^@container\s+([\w-]+)/)
  const axis = container ? `container:${container[1]}:width` : 'media:width'
  // Minification rewrites range syntax to the legacy form, so both spellings
  // turn up: `(width < 1200px)` unminified, `not all and (min-width:1200px)`
  // after Lightning CSS. A negated condition flips which side of the bound the
  // rule applies to.
  const negated = /\bnot\b/.test(prelude.replace(/\([^)]*\)/g, ''))

  for (const [, operator, value] of prelude.matchAll(/\(\s*width\s*(>=|<=|>|<)\s*([^)]+?)\s*\)/g)) {
    const lower = operator.startsWith('>') !== negated
    constraints.push({ axis, op: lower ? '>' : '<', value })
  }
  for (const [, feature, value] of prelude.matchAll(/\(\s*([a-z-]+)\s*:\s*([^)]+?)\s*\)/g)) {
    if (feature === 'min-width' || feature === 'max-width') {
      const lower = (feature === 'min-width') !== negated
      constraints.push({ axis, op: lower ? '>' : '<', value })
    } else if (feature !== 'width') {
      constraints.push({ axis: `feature:${feature}`, op: negated ? '!=' : '=', value })
    }
  }
  return constraints
}

/**
 * Where Tailwind's sorter puts a rule on the width axis: unconditional rules
 * first, then ascending breakpoints. Used only to work out which of a pair is
 * the one our build emits FIRST — the loser, and so the rule a stray duplicate
 * in the consumer's half would resurrect.
 */
function widthOrder(constraints) {
  let order = 0
  for (const { axis, op, value } of constraints) {
    if (!axis.endsWith('width') || !op.startsWith('>')) {
      continue
    }
    const number = Number.parseFloat(value)
    order = Math.max(order, value.includes('rem') ? number * 16 : number)
  }
  return order
}

/**
 * A class a consumer's Tailwind build could realistically emit.
 *
 * The hazard needs the consumer's own markup to contain the losing class, so
 * their build re-emits it after ours. That is a live risk for the shared
 * vocabulary — `justify-center`, `py-6`, `flex-col` — and effectively nil for a
 * class carrying an arbitrary value or a bare custom property
 * (`px-[calc(--spacing(6)-1px)]`, `[--footer-padding-x:--spacing(4)]`), which is
 * private to this package by construction.
 *
 * The distinction is worth drawing rather than rewriting everything: the
 * mutually-exclusive form costs a consumer some override headroom, because
 * `tailwind-merge` cancels a bare utility passed through `className` against our
 * bare utility but not against a variant-scoped one. Spending that on Button's
 * arbitrary-value size scale would buy nothing.
 */
function isSharedVocabulary(token) {
  return !/[[(]/.test(token)
}

/** Lengths in a media condition, normalised to px so they can be compared. */
function toPixels(value) {
  const number = Number.parseFloat(value)
  return value.includes('rem') ? number * 16 : number
}

/** Can two rule contexts ever apply to the same element at the same moment? */
function contextsOverlap(a, b) {
  const combined = [...a, ...b]

  for (const one of combined) {
    for (const other of combined) {
      if (one.axis !== other.axis) {
        continue
      }
      // Different discrete values of one media feature — e.g.
      // prefers-reduced-motion `reduce` vs `no-preference`.
      if (one.op === '=' && other.op === '=' && one.value !== other.value) {
        return false
      }
      // A feature and its negation.
      if (one.op === '=' && other.op === '!=' && one.value === other.value) {
        return false
      }
    }
  }

  // Intersect the width ranges per axis: `max-sm:` is `(width < 768px)` and
  // `lg:` is `(width >= 1200px)`, so no viewport satisfies both. Stacked
  // variants contribute both bounds — `sm:max-lg:` is `>= 768px` and `< 1200px`.
  const bounds = new Map()
  for (const { axis, op, value } of combined) {
    if (!op.startsWith('>') && !op.startsWith('<')) {
      continue
    }
    if (!bounds.has(axis)) {
      bounds.set(axis, { lower: -Infinity, upper: Infinity })
    }
    const range = bounds.get(axis)
    if (op.startsWith('>')) {
      range.lower = Math.max(range.lower, toPixels(value))
    } else {
      range.upper = Math.min(range.upper, toPixels(value))
    }
  }
  for (const { lower, upper } of bounds.values()) {
    if (lower >= upper) {
      return false
    }
  }

  return true
}

/**
 * Tailwind composes some utilities through custom properties rather than by
 * overriding each other: `duration-300` sets `--tw-duration: 300ms`, and
 * `transition-shadow` sets `transition-duration: var(--tw-duration, …)`. The
 * literal declarations differ, but the var indirection means the pair resolves
 * the same way in either order — composition, not conflict.
 */
function composesThrough(reader, writer, property) {
  const value = reader.declarations.get(property) ?? ''
  for (const [declared] of writer.declarations) {
    if (declared.startsWith('--') && value.includes(`var(${declared}`)) {
      return true
    }
  }
  return false
}

/** class token → [{ declarations, signature, constraints }] */
function parseStylesheet(css) {
  const byClass = new Map()
  const stack = []
  let head = ''
  let i = 0

  while (i < css.length) {
    const char = css[i]

    if (char === '{') {
      const prelude = head.trim()
      head = ''
      i++

      if (prelude.startsWith('@')) {
        stack.push(prelude)
        continue
      }

      // A style rule: capture its body, then skip past it.
      let depth = 1
      let end = i
      while (end < css.length && depth > 0) {
        if (css[end] === '{') depth++
        else if (css[end] === '}') depth--
        if (depth === 0) break
        end++
      }

      const declarations = new Map()
      for (const [, property, value] of css
        .slice(i, end)
        .matchAll(/(?:^|[;{}])\s*(--[\w-]+|[a-z-]+)\s*:\s*([^;{}]+)/g)) {
        declarations.set(property, value.trim())
      }

      const constraints = stack.flatMap(constraintsOf)
      for (const selector of splitSelectors(prelude)) {
        // Child-targeting variants arrive wrapped — `:is(.\*\:w-full > *)`.
        // `:is()` takes its argument's specificity, so unwrapping is faithful
        // for the single-argument form Tailwind emits here.
        const trimmed = selector.trim().replace(/^:is\(([^,]*)\)$/, '$1')
        // Utilities only — a selector whose first simple selector is a class.
        // The two alternatives are disjoint on their first character (one
        // requires a backslash, the other excludes it), so the repetition
        // cannot backtrack ambiguously.
        const match = trimmed.match(/^\.((?:\\.|[^\s\\.:[>+~,])+)/)
        if (!match) {
          continue
        }
        const token = match[1].replace(/\\(.)/g, '$1')
        if (!byClass.has(token)) {
          byClass.set(token, [])
        }
        byClass.get(token).push({
          declarations,
          signature: targetSignature(trimmed),
          constraints,
        })
      }

      i = end + 1
      continue
    }

    if (char === '}') {
      stack.pop()
      head = ''
      i++
      continue
    }

    head += char
    i++
  }

  return byClass
}

// ── Source → class strings that land on one element ──────────────────────────

/**
 * Relative where that reads better, absolute otherwise. The consumer fixture
 * runs this from a temp directory against `--src <repo>/packages/ui/src`, where
 * a relative path is a wall of `../`.
 */
function reportablePath(file) {
  const path = relative(process.cwd(), file)
  return path.startsWith('..') ? file : path
}

function sourceFiles(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      sourceFiles(path, found)
    } else if (/\.tsx?$/.test(entry) && !/\.stories\.tsx?$/.test(entry)) {
      found.push(path)
    }
  }
  return found
}

/**
 * Class strings that can end up on the SAME element.
 *
 * A single literal obviously qualifies. So does a run of literals separated by
 * nothing but whitespace, commas and comments — an array of class strings, or a
 * `cn(…)` / `cva(…)` argument list, both of which concatenate onto one element.
 * Anything else between them (an identifier, an object key, a call) ends the
 * run, which is what keeps sibling `cva` variants apart.
 *
 * This walks the source once rather than blanking comments first and matching
 * literals second. Two passes cannot agree on what a string is: a URL in a
 * literal (`'https://www.w3.org/…'`, all over story-helpers.tsx) starts with
 * `//` as far as a comment regex is concerned, so stripping first eats the rest
 * of the literal INCLUDING its closing quote — and every literal after it in the
 * file then pairs up against the wrong quote. Class strings silently merge or
 * vanish, and a guard that fails silently is worse than no guard.
 *
 * Regex literals are the remaining ambiguity, since `/` is also division — and
 * in JSX it is also the closing tag. Only a `/` in a position where a value must
 * begin (after `=`, `(`, `,`, `:`, `{`, …) opens a regex; `</div>` follows `<`
 * and `<br />` follows a name, so neither qualifies. Treating those as regexes
 * would swallow the rest of the line, class strings included.
 */
function classStringGroups(source) {
  const groups = []
  let current = null
  let line = 1
  let previous = ''
  let i = 0
  // Whether only separators (whitespace, commas, comments) have been seen since
  // the previous literal closed — i.e. whether this literal continues that run.
  let adjacent = false

  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]

    if (char === '\n') {
      line++
      i++
      continue
    }

    if (char === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i++
      continue
    }

    if (char === '/' && next === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line++
        i++
      }
      i += 2
      continue
    }

    // A `/` opening a regex literal. Deliberately narrow: only where a value
    // must begin. `<` is excluded so JSX closing tags stay ordinary text.
    if (char === '/' && (previous === '' || /[=(,:!&|?{;[]/.test(previous))) {
      i++
      let inClass = false
      while (i < source.length) {
        if (source[i] === '\\') {
          i += 2
          continue
        }
        if (source[i] === '[') inClass = true
        else if (source[i] === ']') inClass = false
        else if (source[i] === '/' && !inClass) break
        else if (source[i] === '\n') break
        i++
      }
      i++
      previous = '/'
      adjacent = false
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      const quote = char
      const startLine = line
      let text = ''
      i++

      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') {
          if (source[i + 1] === '\n') line++
          text += ' '
          i += 2
          continue
        }
        // Interpolation splits a template into separate class lists.
        if (quote === '`' && source[i] === '$' && source[i + 1] === '{') {
          let depth = 1
          i += 2
          while (i < source.length && depth > 0) {
            if (source[i] === '{') depth++
            else if (source[i] === '}') depth--
            else if (source[i] === '\n') line++
            i++
          }
          text += ' '
          continue
        }
        if (source[i] === '\n') line++
        text += source[i]
        i++
      }
      i++

      if (current && adjacent) {
        current.text += ` ${text}`
      } else {
        current = { text, line: startLine }
        groups.push(current)
      }

      previous = quote
      adjacent = true
      continue
    }

    if (!/\s/.test(char)) {
      previous = char
      if (char !== ',') {
        adjacent = false
      }
    }
    i++
  }

  return groups
}

// ── Check ────────────────────────────────────────────────────────────────────

const utilities = parseStylesheet(readFileSync(cssPath, 'utf8'))
const problems = []
const seen = new Set()
let stringsChecked = 0

for (const dir of sourceDirs) {
  if (!existsSync(dir)) {
    console.error(`Cascade safety: source directory ${dir} not found.`)
    process.exit(1)
  }

  for (const file of sourceFiles(dir)) {
    for (const group of classStringGroups(readFileSync(file, 'utf8'))) {
      const tokens = [...new Set(group.text.split(/\s+/))].filter((token) => utilities.has(token))
      if (tokens.length < 2) {
        continue
      }
      stringsChecked++

      for (let a = 0; a < tokens.length; a++) {
        for (let b = a + 1; b < tokens.length; b++) {
          for (const ruleA of utilities.get(tokens[a])) {
            for (const ruleB of utilities.get(tokens[b])) {
              // Different boxes or different states — the cascade, not emission
              // order, decides between them.
              if (ruleA.signature === null || ruleA.signature !== ruleB.signature) {
                continue
              }
              // At least one side must be conditional: two unconditional rules
              // are ordered by Tailwind's utility sort, which a consumer's build
              // reproduces identically. It is the media/container override that
              // a stray duplicate can outrank.
              if (ruleA.constraints.length === 0 && ruleB.constraints.length === 0) {
                continue
              }
              if (!contextsOverlap(ruleA.constraints, ruleB.constraints)) {
                continue
              }
              // Only the rule our build emits first can be resurrected by a
              // duplicate in the consumer's half, so it alone has to be a class
              // the consumer might plausibly write.
              const loser =
                widthOrder(ruleA.constraints) <= widthOrder(ruleB.constraints)
                  ? tokens[a]
                  : tokens[b]
              if (!isSharedVocabulary(loser)) {
                continue
              }
              for (const [property, value] of ruleA.declarations) {
                // Identical declarations cannot produce a visible difference,
                // whichever order they land in.
                if (ruleB.declarations.get(property) === undefined) {
                  continue
                }
                if (ruleB.declarations.get(property) === value) {
                  continue
                }
                if (
                  composesThrough(ruleA, ruleB, property) ||
                  composesThrough(ruleB, ruleA, property)
                ) {
                  continue
                }
                const key = `${file}:${group.line}:${property}:${tokens[a]}:${tokens[b]}`
                if (seen.has(key)) {
                  continue
                }
                seen.add(key)
                problems.push({
                  file: reportablePath(file),
                  line: group.line,
                  property,
                  a: tokens[a],
                  b: tokens[b],
                })
              }
            }
          }
        }
      }
    }
  }
}

if (problems.length > 0) {
  console.error('Cascade-unsafe class strings:\n')
  for (const { file, line, property, a, b } of problems) {
    console.error(`  - ${file}:${line}  '${a}' and '${b}' both set ${property}`)
  }
  console.error(
    `\n${problems.length} pair(s) resolve by emission order alone. Inside one Tailwind build the\n` +
      'sorter settles them; in a consumer that imports this stylesheet AND runs their own\n' +
      'Tailwind build, their copy of the losing rule can land last and win on OUR element.\n\n' +
      'Give each rule a condition the other cannot match:\n\n' +
      "    'justify-center lg:justify-start'  →  'max-lg:justify-center lg:justify-start'\n" +
      "    'transition-colors motion-reduce:transition-none'  →  'motion-safe:transition-colors'\n\n" +
      'See the header of scripts/check-cascade-safety.mjs for why layer ordering cannot fix this.',
  )
  process.exit(1)
}

console.log(
  `✔ Cascade safety: ${stringsChecked} class strings under ${sourceDirs.join(', ')} are order-independent against ${cssPath}.`,
)

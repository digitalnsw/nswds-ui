// Radius guard for src/components/ and src/patterns/.
//
// DESIGN.md ("Shapes") gives the system three radii and no others:
//
//   rounded-sm   (4px)  controls — buttons, inputs, rows
//   rounded-md   (8px)  containers and popups — cards, popovers, menus, drawers
//   rounded-full        pills and circles
//   rounded-none        full-bleed chrome (masthead, main-nav)
//
// `lg` (16px), `xl` (12px) and `xs` (2px) stay in the token scale — they come
// from @nswds/tokens and a consuming app may want them — but no component in
// this package may use them. The masterbrand is a flat print identity ("flat
// and crisp, no rounded-corner cards"); DESIGN.md translates that to screen as
// small radii, and calls oversized ones off-brand.
//
// This exists because the drift it catches was invisible in review. Six popup
// surfaces that are the same thing — bg-popover, shadow-md, ring-1 — had
// drifted to three different radii (tooltip 8px, popover/hover-card/site-search/
// navigation-menu 16px, drawer 12px), and card.tsx rounded its own header and
// footer to 16px inside an 8px root that clips with overflow-hidden, so those
// corners never rendered while still asserting the wrong rule.
//
// The likely source is scaffolding: AGENTS.md §4 lists the cleanup required
// after `shadcn add` (convert @/ imports, swap Radix for Base UI, replace raw
// palette colours) and radius is not on that list, so a scaffolded radius
// passes through unexamined while colours and imports get caught.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['src/components', 'src/patterns']

// Off-scale steps, in any directional form (rounded-lg, rounded-t-lg, …).
const BANNED = /\brounded-(?:[tblrse]|[xy]|(?:tl|tr|bl|br|ss|se|es|ee))?-?(lg|xl|xs|2xl|3xl|4xl)\b/g

// Arbitrary values are allowed only where the system already explains them.
const SANCTIONED_ARBITRARY = new Set([
  // Button/Badge optical inner border: the visible radius minus the border
  // width, so the inner and outer curves stay concentric (DESIGN.md, Shapes).
  'rounded-[calc(var(--radius-sm)-1px)]',
  // Inherit the parent's radius — carries whatever the container decided.
  'rounded-[inherit]',
  // Tooltip arrow: a rotated 10px square whose tip is softened. Not a
  // container, so the container scale does not apply.
  'rounded-[2px]',
])

const ARBITRARY = /\brounded-\[[^\]]+\]/g

const failures = []

for (const root of ROOTS) {
  let entries
  try {
    entries = readdirSync(root)
  } catch (error) {
    // Do NOT swallow this. Run from the wrong directory and every root
    // disappears, the loop body never executes, and the check reports a clean
    // pass while having examined nothing — the exact failure mode these guards
    // exist to prevent.
    console.error(`✖ Cannot read ${root} from ${process.cwd()} — run this from packages/ui.`)
    console.error(`  ${error.message}`)
    process.exit(1)
  }
  if (entries.length === 0) {
    console.error(`✖ ${root} is empty — refusing to report a pass over nothing.`)
    process.exit(1)
  }
  for (const name of entries) {
    if (!name.endsWith('.tsx') || name.endsWith('.stories.tsx')) continue
    const path = join(root, name)
    const source = readFileSync(path, 'utf8')

    source.split('\n').forEach((line, index) => {
      for (const match of line.matchAll(BANNED)) {
        failures.push(
          `${path}:${index + 1}  ${match[0]} — off the component scale. Containers and popups use rounded-md; controls use rounded-sm.`,
        )
      }
      for (const match of line.matchAll(ARBITRARY)) {
        if (SANCTIONED_ARBITRARY.has(match[0])) continue
        failures.push(
          `${path}:${index + 1}  ${match[0]} — arbitrary radius. Use a named step, or add it to SANCTIONED_ARBITRARY here with the reason.`,
        )
      }
    })
  }
}

if (failures.length > 0) {
  console.error('✖ Radius scale violations:\n')
  for (const failure of failures) console.error(`  ${failure}`)
  console.error(`\n${failures.length} violation(s). See DESIGN.md → Shapes.`)
  process.exit(1)
}

console.log('✔ Radius scale: every component uses sm / md / full / none.')

#!/usr/bin/env node
/**
 * Every Portal in `src/` must wrap its contents in `ButtonGroupBoundary`.
 *
 * WHY THIS IS A GATE AND NOT A STORY. `ButtonGroup` styles its segments
 * through two halves: React context decides variant/colour/size, and CSS on
 * the group draws the boundary. React context follows the COMPONENT tree, so
 * it crosses a portal; the CSS keys on DOM ancestry, so it does not. A Button
 * inside a popup opened from a segment therefore gets the React half and not
 * the CSS half — squared, shadowless, coerced to `ghost`, and on a solid band
 * re-inked to the band's label colour, i.e. white text on the popup's own
 * light surface. `ButtonGroupBoundary` resets the context at the portal and is
 * the only thing preventing that.
 *
 * Four of the nine portals are pinned by stories (`InPortal`, `InOverlays`).
 * The other five cannot be: `SiteSearch` renders no Button inside its portal
 * and exposes no slot to inject one, and `Select` / `Combobox` popups take
 * their own item components rather than arbitrary children. Deleting the
 * wrapper from any of those five is invisible to every other gate —
 * `check:drift` looks at registration, `check:registry-resolves` at import
 * closure, the registry freshness check at file content, and lint and
 * typecheck at a file that stays perfectly self-consistent once the import
 * goes with it. This script closes that hole for all nine at once, and for
 * any portal added later.
 *
 * WHAT THIS CANNOT SEE. It checks the portal, so it only covers content that
 * is declared INSIDE the portal — which is every one of these components bar
 * NavigationMenu. There, the portal lives in the root and `NavigationMenuContent`
 * is declared by the consumer inside `NavigationMenuItem`; Base UI then hosts
 * that content in the portalled viewport, so its DOM leaves the group while
 * its React element never passes the portal at all. That one resets inside
 * `NavigationMenuContent` instead, and the `In Overlays` play is what pins it
 * — this script passes with that reset removed. Any future primitive with the
 * same split needs the same treatment and the same kind of test.
 *
 * THE INVARIANT: the first element child of every Portal element is
 * `<ButtonGroupBoundary>`. First child rather than "appears somewhere inside"
 * because the boundary has to enclose the whole popup subtree — a boundary
 * around one branch of it would leave the rest carrying the group's context.
 * A self-closing Portal is a failure by construction: it wraps nothing, which
 * is exactly the shape every one of these files had before the boundary
 * landed.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = join(packageRoot, 'src')

const BOUNDARY = 'ButtonGroupBoundary'

/**
 * Opening tag of a PRIMITIVE portal: `<Portal>` or `<Namespace.Portal>`. A
 * local wrapper (`<DrawerPortal>`, `<SheetPortal>`) is deliberately excluded
 * — it renders a primitive portal in its own definition, which this pattern
 * matches there, so checking its use sites too would demand a second boundary
 * inside the first.
 */
const PORTAL_TAG = /<((?:[A-Z][\w]*\.)?Portal)(\s[^>]*?)?(\/?)>/gs
/** Whitespace and JSX comments, which may sit between the tag and its first child. */
const SKIPPABLE = /^(?:\s|\{\s*\/\*[\s\S]*?\*\/\s*\})*/

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    if (!entry.name.endsWith('.tsx')) return []
    // Stories compose the components; they never render a portal themselves.
    if (entry.name.includes('.stories.')) return []
    return [path]
  })
}

const failures = []
const checked = []

for (const file of sourceFiles(sourceRoot)) {
  const source = readFileSync(file, 'utf8')
  const name = relative(packageRoot, file)
  // `createPortal` bypasses the component-level Portal entirely, so it would
  // need its own reset and this check could not see it. Nothing uses it today;
  // fail loudly if that changes rather than passing something unverified.
  if (source.includes('createPortal')) {
    failures.push(
      `${name}: uses createPortal directly, which this check cannot verify — wrap its children in ${BOUNDARY} and add the file here deliberately.`,
    )
    continue
  }

  const tags = [...source.matchAll(PORTAL_TAG)]
  if (tags.length === 0) continue
  checked.push({ name, count: tags.length })

  if (!source.includes(BOUNDARY)) {
    failures.push(`${name}: renders a Portal but never mentions ${BOUNDARY}.`)
    continue
  }

  for (const tag of tags) {
    const [match, tagName, , selfClosing] = tag
    const line = source.slice(0, tag.index).split('\n').length
    if (selfClosing === '/') {
      failures.push(
        `${name}:${line}: <${tagName} /> is self-closing, so it wraps nothing in ${BOUNDARY}. Give it children and make ${BOUNDARY} the outermost one.`,
      )
      continue
    }
    const after = source.slice(tag.index + match.length)
    const firstChild = after.slice(after.match(SKIPPABLE)[0].length)
    if (!firstChild.startsWith(`<${BOUNDARY}`)) {
      const found = firstChild.slice(0, 40).split('\n')[0]
      failures.push(
        `${name}:${line}: the first child of <${tagName}> is \`${found}…\`, not <${BOUNDARY}>. The boundary must enclose the whole popup subtree.`,
      )
    }
  }
}

if (failures.length > 0) {
  console.error(`✖ Portal boundary check failed (${failures.length}):\n`)
  for (const failure of failures) console.error(`  ${failure}`)
  console.error(
    `\nEvery Portal must wrap its contents in ${BOUNDARY} (src/lib/button-group-context.tsx).`,
  )
  console.error(
    'Without it, a Button inside the popup renders as a segment of the ButtonGroup it was opened from.',
  )
  process.exit(1)
}

if (checked.length === 0) {
  console.error(
    '✖ Portal boundary check found no Portal at all — the detection is broken, not the code.',
  )
  process.exit(1)
}

console.log(
  `✔ Portal boundary: ${checked.length} components reset the button group at ${checked.reduce((total, entry) => total + entry.count, 0)} portals.`,
)

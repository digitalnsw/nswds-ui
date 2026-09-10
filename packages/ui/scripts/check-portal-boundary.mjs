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
 * THE INVARIANT: every primitive Portal has exactly ONE child, and it is a
 * `<ButtonGroupBoundary>` element with children of its own. Whitespace and
 * JSX comments do not count as children. "Only child" rather than
 * "first child", because the boundary has to enclose the whole popup subtree:
 *
 *   <X.Portal><ButtonGroupBoundary /><Popup /></X.Portal>
 *   <X.Portal><ButtonGroupBoundary><Backdrop /></ButtonGroupBoundary><Popup /></X.Portal>
 *
 * both put the boundary FIRST and both leave the popup carrying the group's
 * context. So does a self-closing portal, which wraps nothing at all — the
 * shape every one of these files had before the boundary landed.
 *
 * WHY IT PARSES INSTEAD OF MATCHING TEXT. The first version matched the
 * portal's opening tag with a regex and checked that what followed STARTED
 * WITH `<ButtonGroupBoundary`. Every shape above passed it, as did a
 * component whose name merely begins with that one (`ButtonGroupBoundaryX`),
 * while a `<Dialog.Portal>` written in a doc comment failed it. Deciding
 * where an element ends means matching tags through nesting, strings and
 * comments, which is a parser's job — so this reads the TypeScript compiler's
 * own syntax tree for the file, the same one typecheck builds, and the answer
 * is about the JSX that actually compiles.
 *
 * `checkPortals` is the whole rule, exported for the fixture tests in
 * check-portal-boundary.test.mjs (run by `npm run test:scripts`). Those exist
 * because a gate that stops gating exits 0, which reads exactly like success.
 */

import { readdirSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

export const BOUNDARY = 'ButtonGroupBoundary'

/**
 * A PRIMITIVE portal: `<Portal>` or `<Namespace.Portal>`. A local wrapper
 * (`<DrawerPortal>`, `<SheetPortal>`) is deliberately excluded — it renders a
 * primitive portal in its own definition, which this matches there, so
 * checking its use sites too would demand a second boundary inside the first.
 */
function isPrimitivePortal(tagName) {
  if (ts.isIdentifier(tagName)) return tagName.text === 'Portal'
  return (
    ts.isPropertyAccessExpression(tagName) &&
    tagName.name.text === 'Portal' &&
    ts.isIdentifier(tagName.expression) &&
    /^[A-Z]/.test(tagName.expression.text)
  )
}

/** Exactly `ButtonGroupBoundary` — not a name that merely starts with it. */
function isBoundaryTag(tagName) {
  return ts.isIdentifier(tagName) && tagName.text === BOUNDARY
}

/** Children that render something: not layout whitespace, not a JSX comment. */
function meaningfulChildren(element) {
  return element.children.filter((child) => {
    if (ts.isJsxText(child)) return !child.containsOnlyTriviaWhiteSpaces
    if (ts.isJsxExpression(child)) return child.expression !== undefined
    return true
  })
}

/**
 * Checks every primitive Portal in one TSX source file. Returns how many
 * portals it found — the caller needs that to tell "no portals here" from
 * "detection is broken" — and one failure per portal that breaks the rule.
 */
export function checkPortals(source, fileName = 'component.tsx') {
  const failures = []
  const at = (index) => source.slice(0, index).split('\n').length

  // `createPortal` bypasses the component-level Portal entirely, so it would
  // need its own reset and this check could not see it. Nothing uses it today;
  // fail loudly if that changes rather than passing something unverified.
  const direct = source.indexOf('createPortal')
  if (direct !== -1) {
    failures.push({
      line: at(direct),
      message: `uses createPortal directly, which this check cannot verify — wrap its children in ${BOUNDARY} and add the file here deliberately.`,
    })
    return { portals: 0, failures }
  }

  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const lineOf = (node) => file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1
  const snippet = (node) => node.getText(file).replace(/\s+/g, ' ').slice(0, 48)
  let portals = 0

  const visit = (node) => {
    if (ts.isJsxSelfClosingElement(node) && isPrimitivePortal(node.tagName)) {
      portals += 1
      const tag = node.tagName.getText(file)
      failures.push({
        line: lineOf(node),
        message: `<${tag} /> is self-closing, so it wraps nothing in ${BOUNDARY}. Give it children and make ${BOUNDARY} its only one.`,
      })
    } else if (ts.isJsxElement(node) && isPrimitivePortal(node.openingElement.tagName)) {
      portals += 1
      const tag = node.openingElement.tagName.getText(file)
      const [first, ...rest] = meaningfulChildren(node)
      let message
      if (!first) {
        message = `<${tag}> has no children, so it wraps nothing in ${BOUNDARY}.`
      } else if (ts.isJsxSelfClosingElement(first) && isBoundaryTag(first.tagName)) {
        message = `<${BOUNDARY} /> inside <${tag}> is self-closing, so it encloses nothing — whatever the portal renders sits outside it and keeps the group's context. Put the popup inside it.`
      } else if (!(ts.isJsxElement(first) && isBoundaryTag(first.openingElement.tagName))) {
        message = `the only child of <${tag}> must be <${BOUNDARY}>, enclosing the whole popup subtree; found \`${snippet(first)}\`.`
      } else if (rest.length > 0) {
        message = `<${BOUNDARY}> closes before the end of <${tag}>: ${rest.length} more ${rest.length === 1 ? 'child sits' : 'children sit'} outside it (\`${snippet(rest[0])}\`) and keep the group's context.`
      }
      if (message) failures.push({ line: lineOf(node), message })
    }
    ts.forEachChild(node, visit)
  }
  visit(file)

  return { portals, failures }
}

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

function main() {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const failures = []
  const checked = []

  for (const file of sourceFiles(join(packageRoot, 'src'))) {
    const source = readFileSync(file, 'utf8')
    // Parse only files that could hold a portal: ten of the ~4000 in src/,
    // most of the rest being generated icons.
    if (!source.includes('Portal')) continue
    const name = relative(packageRoot, file)
    const result = checkPortals(source, name)
    if (result.portals > 0) checked.push({ name, count: result.portals })
    for (const { line, message } of result.failures) failures.push(`${name}:${line}: ${message}`)
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
}

// Run only when invoked directly, so the tests can import `checkPortals`.
// Compared as REAL paths: a `file://` + path template never matches from a
// path containing a space (`import.meta.url` is percent-encoded), and even an
// encoded URL misses through a symlink, because Node resolves symlinks for
// `import.meta.url` but leaves `process.argv[1]` as typed — macOS's temp
// directory under `/var` is one. Either way `main` would never run, and a gate
// that never runs exits 0 with no output, which is indistinguishable from a
// pass.
function invokedDirectly() {
  if (!process.argv[1]) return false
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
}

if (invokedDirectly()) main()

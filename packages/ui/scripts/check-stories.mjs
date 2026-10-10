#!/usr/bin/env node
/**
 * Holds every story file in `src/` to docs/reference-storybook-standard.md.
 *
 * WHY THIS IS A GATE. The catalogue drifted one file at a time: each story set
 * was written against whichever neighbour its author happened to open, so by
 * v9 there were three title styles, three accessibility naming schemes, CSS
 * checks spelled four ways, regression stories mixed in with examples, and
 * forty components whose only documentation was an unlabelled "Variants"
 * dump. Every one of those still linted, typechecked and passed its tests —
 * nothing else in CI reads a story file for its SHAPE. A written standard
 * with nothing holding it decays the same way, so this holds it.
 *
 * THE SHAPE is Button's (button.stories.tsx, button.features.stories.tsx,
 * button.accessibility.stories.tsx) — the story set the rest were brought up to:
 *
 *   main           <file>.stories.tsx — title `Components/<Name>` (or
 *                  `Patterns/…`, `Hooks/…`, matching its directory); tagged
 *                  `autodocs` with a custom `docs.page` built from the docs kit
 *                  (DocsPage, DocsUsage, DocsApi — Button, the REFERENCE the
 *                  kit reproduces, is exempt); exports `Default` and `Playground`.
 *   features       <file>.features.stories.tsx — title `<main title>/Features`.
 *                  Every component and pattern has one.
 *   accessibility  <file>.accessibility.stories.tsx — title
 *                  `<main title>/Accessibility`, every
 *                  story named `<WCAG title> — <criterion>[ / <criterion>]`.
 *                  Every component and pattern has one.
 *   tests          <file>.tests.stories.tsx — optional; title
 *                  `<main title>/Tests`, tagged `!dev` and `!autodocs`.
 *
 * and, for every kind: no `layout: 'centered'` (examples start top-left, as
 * on a page), and no text under the 16px floor (`text-xs`, `text-sm`).
 *
 * Hooks have no component to document, so `Hooks/…` main files keep only the
 * title and floor rules and need no Features or Accessibility file. Any other
 * suffix (`.look-…`) is a kind the standard does not have, unless it is a
 * GUIDE below; EXTRAS lists the main-kind files that file under another
 * component.
 *
 * WHY IT PARSES. Titles, tags and story names live in object literals that
 * Prettier is free to reflow, and a regex reading `title: '…'` also reads one
 * written in a comment or a nested ExampleSection prop. This reads the
 * TypeScript syntax tree of the meta object and of each exported story, so
 * the answer is about what Storybook actually indexes. (The one textual
 * check is the docs kit: it looks for the `<DocsPage`, `<DocsUsage` and
 * `<DocsApi` tags in the file, wherever the page function is defined.)
 *
 * `checkStoryFile` is the whole per-file rule, exported for the fixture tests
 * in check-stories.test.mjs (run by `npm run test:scripts`), because a gate
 * that stops gating exits 0, which reads exactly like success.
 */

import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

/** Story directories under src/ and the title root each one files under. */
export const ROOTS = { components: 'Components', patterns: 'Patterns', hooks: 'Hooks' }

/**
 * Main story files that document something other than one same-named source
 * file. Add an entry only with a reason.
 */
export const GROUPS = new Map([
  // The eight footer blocks are one family chosen between side by side; one
  // page with a chooser serves that better than eight near-identical pages.
  ['patterns/footer-blocks', 'the footer-*.tsx blocks'],
  // The generated icon set (src/icons/), which has no component file here.
  ['components/icons', 'src/icons/'],
  // The brand marks Footer's social row takes, documented apart from the
  // ~3900 generated icons they are not part of.
  ['components/icon-brands', 'the brand icons in src/icons/'],
])

/**
 * Source files with no story set of their own. Add an entry only with a reason.
 */
export const DOCUMENTED_ELSEWHERE = new Map([
  // Internal Base UI wrapper (see INTERNAL in check-component-drift.mjs);
  // MainNav is the supported way to use it, and MainNav's stories cover it.
  ['components/navigation-menu', 'components/main-nav'],
  ['components/story-helpers', 'not a component: the docs kit itself'],
])

/**
 * The story set the docs kit reproduces. Its page is written out by hand, so
 * it is the one main file exempt from building its page from the kit.
 */
export const REFERENCE = new Set(['components/button'])

/**
 * Main-kind story files that file under another component's folder, with the
 * title they must carry. Add an entry only with a reason.
 */
export const EXTRAS = new Map([
  // ButtonLink is exported from button.tsx, and its stories sit inside
  // Button's folder as they always have.
  ['components/button-link', 'Components/Button/ButtonLink'],
])

/**
 * Story files outside the four kinds: per-look guide pages that each read
 * as their own docs page. Matched on the file name; add only with a reason.
 */
export const GUIDES = [
  // Breadcrumb's four looks are chosen by page context, and each needs a page
  // of when-to-use, pairing, phone and do/don't guidance of its own.
  /^breadcrumb\.look-[a-z]+\.stories\.tsx$/,
]

const FLOOR = /\btext-(xs|sm)\b/g
const CRITERION = /^\S.* — \d+\.\d+\.\d+( \/ \d+\.\d+\.\d+)*( \(dark\))?$/

/** What kind of story file a name is, or null for a kind the standard lacks. */
export function kindOf(fileName) {
  if (fileName.endsWith('.tests.stories.tsx')) return 'tests'
  if (fileName.endsWith('.accessibility.stories.tsx')) return 'accessibility'
  if (fileName.endsWith('.features.stories.tsx')) return 'features'
  if (GUIDES.some((guide) => guide.test(fileName))) return 'guide'
  if (/^[a-z0-9-]+\.stories\.tsx$/.test(fileName)) return 'main'
  return null
}

/** The object literal a story file default-exports as its meta, if any. */
function metaObject(sourceFile) {
  let exported
  const locals = new Map()
  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          locals.set(declaration.name.text, declaration.initializer)
        }
      }
    }
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      exported = statement.expression
    }
  }
  let node = exported && ts.isIdentifier(exported) ? locals.get(exported.text) : exported
  // `{ … } satisfies Meta<…>` and `{ … } as Meta<…>`
  while (node && (ts.isSatisfiesExpression(node) || ts.isAsExpression(node))) {
    node = node.expression
  }
  return node && ts.isObjectLiteralExpression(node) ? node : undefined
}

function property(object, name) {
  if (!object || !ts.isObjectLiteralExpression(object)) return undefined
  for (const member of object.properties) {
    if (ts.isPropertyAssignment(member) && member.name.getText() === name) {
      return member.initializer
    }
    if (ts.isShorthandPropertyAssignment(member) && member.name.text === name) {
      return member.name
    }
  }
  return undefined
}

function stringValue(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : undefined
}

function stringArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return []
  return node.elements.map(stringValue).filter((value) => value !== undefined)
}

/** Every `export const X = { … }` story, in source order. */
function exportedStories(sourceFile) {
  const stories = []
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    if (!statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue
      let init = declaration.initializer
      while (init && (ts.isSatisfiesExpression(init) || ts.isAsExpression(init))) {
        init = init.expression
      }
      stories.push({
        id: declaration.name.text,
        object: init && ts.isObjectLiteralExpression(init) ? init : undefined,
        line: sourceFile.getLineAndCharacterOfPosition(declaration.getStart()).line + 1,
      })
    }
  }
  return stories
}

/**
 * Checks one story file. `relPath` is relative to src/ (`components/x.stories.tsx`);
 * `hasMain(base)` tells it whether the main file a features, tests or
 * accessibility file belongs to exists. Returns one failure per broken rule.
 */
export function checkStoryFile(source, relPath, { hasMain = () => true } = {}) {
  const failures = []
  const fail = (line, message) => failures.push({ line, message })
  const fileName = basename(relPath)
  const directory = dirname(relPath)
  const root = ROOTS[directory]
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const lineOf = (node) => sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1

  if (!root) {
    fail(1, `story files live in src/${Object.keys(ROOTS).join(', src/')} — not src/${directory}`)
    return failures
  }

  const kind = kindOf(fileName)
  if (!kind) {
    fail(
      1,
      `"${fileName}" is not a story kind the standard has — use <file>.stories.tsx, .features.stories.tsx, .accessibility.stories.tsx or .tests.stories.tsx`,
    )
    return failures
  }

  // ── Every kind ────────────────────────────────────────────────────────────
  source.split('\n').forEach((text, index) => {
    for (const match of text.matchAll(FLOOR)) {
      fail(index + 1, `"${match[0]}" renders text under the 16px floor — use text-base or larger`)
    }
  })
  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText() === 'layout' &&
      stringValue(node.initializer) === 'centered'
    ) {
      fail(
        lineOf(node),
        "layout: 'centered' — examples start top-left; use 'padded' or 'fullscreen'",
      )
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  const meta = metaObject(sourceFile)
  if (!meta) {
    fail(1, 'no default-exported meta object literal')
    return failures
  }
  const title = stringValue(property(meta, 'title'))
  const tags = stringArray(property(meta, 'tags'))
  const metaLine = lineOf(meta)
  if (!title) {
    fail(metaLine, 'meta has no string `title`')
    return failures
  }

  const base = fileName.split('.')[0]
  const stories = exportedStories(sourceFile)

  if (kind === 'tests' || kind === 'accessibility' || kind === 'features') {
    const folder = { tests: 'Tests', accessibility: 'Accessibility', features: 'Features' }[kind]
    const segments = title.split('/')
    if (segments.length !== 3 || segments[0] !== root || segments[2] !== folder) {
      fail(metaLine, `title "${title}" should be "${root}/<Name>/${folder}"`)
    }
    if (!hasMain(base)) {
      fail(1, `${folder.toLowerCase()} file with no ${base}.stories.tsx beside it`)
    }
    // Tests stay out of the sidebar; Features and Accessibility are for readers.
    const required = kind === 'tests' ? ['!dev', '!autodocs'] : []
    for (const tag of required) {
      if (!tags.includes(tag)) fail(metaLine, `meta tags must include '${tag}'`)
    }
    if (kind === 'accessibility') {
      for (const story of stories) {
        const name = stringValue(property(story.object, 'name'))
        if (!name || !CRITERION.test(name)) {
          fail(
            story.line,
            `accessibility story ${story.id} must be named "<WCAG title> — <criterion>" (e.g. "Focus Visible — 2.4.7"), got ${name ? `"${name}"` : 'no name'}`,
          )
        }
      }
    }
    return failures
  }

  // ── Main files and guides ─────────────────────────────────────────────────
  const key = `${directory}/${base}`
  const segments = title.split('/')
  if (kind === 'main' && EXTRAS.has(key)) {
    if (title !== EXTRAS.get(key)) fail(metaLine, `title "${title}" should be "${EXTRAS.get(key)}"`)
    return failures
  }
  if (kind === 'main') {
    if (segments.length !== 2 || segments[0] !== root) {
      fail(metaLine, `title "${title}" should be "${root}/<Name>"`)
    } else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(segments[1])) {
      fail(metaLine, `title name "${segments[1]}" should be the export name, e.g. "AlertDialog"`)
    }
  }

  if (kind === 'guide' || root === 'Hooks') return failures

  const ids = new Set(stories.map((story) => story.id))
  for (const required of ['Default', 'Playground']) {
    if (!ids.has(required)) fail(stories[0]?.line ?? 1, `main file must export a ${required} story`)
  }
  if (!tags.includes('autodocs')) fail(metaLine, "meta tags must include 'autodocs'")
  const docs = property(property(meta, 'parameters'), 'docs')
  if (!property(docs, 'page')) {
    fail(metaLine, 'meta needs parameters.docs.page — a DocsPage, not the generated autodocs page')
  }
  for (const block of REFERENCE.has(key) ? [] : ['DocsPage', 'DocsUsage', 'DocsApi']) {
    if (!new RegExp(`<${block}\\b`).test(source)) {
      fail(metaLine, `the docs page must render <${block}> from story-helpers`)
    }
  }
  return failures
}

/**
 * Every documented component and pattern carries Button's two folders: a
 * Features file and an Accessibility file beside its main story file. Hooks
 * and EXTRAS do not. `names` is the directory listing.
 */
export function missingSiblings(directory, names) {
  if (directory === 'hooks') return []
  const failures = []
  for (const name of names) {
    if (kindOf(name) !== 'main') continue
    const base = name.replace(/\.stories\.tsx$/, '')
    if (EXTRAS.has(`${directory}/${base}`)) continue
    for (const sibling of ['features', 'accessibility']) {
      if (!names.includes(`${base}.${sibling}.stories.tsx`)) {
        failures.push(`src/${directory}/${name}:1: has no ${base}.${sibling}.stories.tsx`)
      }
    }
  }
  return failures
}

function main() {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const srcDir = join(packageRoot, 'src')
  const failures = []
  let checked = 0

  for (const directory of Object.keys(ROOTS)) {
    const path = join(srcDir, directory)
    if (!existsSync(path)) continue
    const names = readdirSync(path)
    const hasMain = (base) => names.includes(`${base}.stories.tsx`)

    // Every source file has a main story file (or a recorded reason not to),
    // and every main story file documents a source file (or is a GROUP).
    for (const name of names) {
      const source = name.match(/^([a-z0-9-]+)\.tsx?$/)
      if (!source) continue
      const key = `${directory}/${source[1]}`
      const grouped = [...GROUPS.keys()].some(
        (group) =>
          group.startsWith(`${directory}/`) && key.startsWith(group.replace(/-blocks$/, '-')),
      )
      if (!hasMain(source[1]) && !DOCUMENTED_ELSEWHERE.has(key) && !grouped) {
        failures.push(`src/${directory}/${name}:1: has no ${source[1]}.stories.tsx`)
      }
    }
    for (const failure of missingSiblings(directory, names)) failures.push(failure)
    for (const name of names) {
      const relName = `${directory}/${name}`
      if (name.includes('.stories.')) {
        if (kindOf(name) === 'main') {
          const base = name.replace(/\.stories\.tsx$/, '')
          const hasSource = names.includes(`${base}.tsx`) || names.includes(`${base}.ts`)
          const known = GROUPS.has(`${directory}/${base}`) || EXTRAS.has(`${directory}/${base}`)
          if (!hasSource && !known) {
            failures.push(
              `src/${relName}:1: documents no ${base}.tsx — add it to GROUPS with a reason, or rename it`,
            )
          }
        }
        const source = readFileSync(join(path, name), 'utf8')
        for (const { line, message } of checkStoryFile(source, relName, { hasMain })) {
          failures.push(`src/${relName}:${line}: ${message}`)
        }
        checked++
      }
    }
  }

  if (failures.length > 0) {
    console.error(`✖ Story standard check failed (${failures.length}):\n`)
    for (const failure of failures) console.error(`  ${failure}`)
    console.error(
      '\nThe standard is docs/reference-storybook-standard.md; Button is its reference.',
    )
    process.exit(1)
  }

  if (checked === 0) {
    console.error(
      '✖ Story standard check found no story files — the detection is broken, not the code.',
    )
    process.exit(1)
  }

  console.log(
    `✔ Story standard: ${checked} story files follow docs/reference-storybook-standard.md.`,
  )
}

// Run only when invoked directly, so the tests can import `checkStoryFile`.
// Compared as REAL paths for the reasons given in check-portal-boundary.mjs.
function invokedDirectly() {
  if (!process.argv[1]) return false
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
}

if (invokedDirectly()) main()

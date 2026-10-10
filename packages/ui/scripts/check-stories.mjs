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
 * THE RULES, per story file, by kind:
 *
 *   main           <file>.stories.tsx — title `Components/<Name>` (or
 *                  `Patterns/…`, `Hooks/…`, matching its directory); tagged
 *                  `autodocs` with a custom `docs.page` built from DocsPage,
 *                  DocsUsage and DocsApi; exports `Default` then `Playground`
 *                  first; every other export names itself in sentence case.
 *   tests          <file>.tests.stories.tsx — title `<main title>/Tests`,
 *                  tagged `!dev` and `!autodocs`, beside a main file.
 *   accessibility  <file>.accessibility.stories.tsx — title
 *                  `<main title>/Accessibility`, tagged `!autodocs`, every
 *                  story named `<WCAG title> — <criterion>[ / <criterion>]`.
 *
 * and, for every kind: no `layout: 'centered'` (examples start top-left, as
 * on a page), and no text under the 16px floor (`text-xs`, `text-sm`).
 *
 * Hooks have no component to document, so `Hooks/…` main files keep only the
 * title, naming and floor rules. Any other suffix (`.features`, `.look-…`) is
 * a fourth kind the standard does not have, unless it is a GUIDE below.
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
 * Story files outside the three kinds: per-look guide pages that each read
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
 * Sentence case: the first word is capitalised and no later word is, unless
 * it is a proper noun — a component or other name in `properNouns`, an
 * acronym (`CSS`, `RTL`), or a word with an inner capital or digit
 * (`ButtonLink`, `iconOnly`, `2.5.8`).
 */
export function isSentenceCase(name, properNouns = new Set()) {
  const words = name.split(/[\s—–/(),:]+/).filter(Boolean)
  if (words.length === 0) return false
  if (!/^[A-Z0-9]/.test(words[0])) return false
  return words.slice(1).every((raw) => {
    const word = raw.replace(/^['"“‘]|['"”’.!?]$/g, '')
    if (!/^[A-Z][a-z]/.test(word)) return true
    if (/[A-Z]/.test(word.slice(1)) || /\d/.test(word)) return true
    return properNouns.has(word) || properNouns.has(word.replace(/['’]s$/, ''))
  })
}

/**
 * Checks one story file. `relPath` is relative to src/ (`components/x.stories.tsx`);
 * `hasMain(base)` tells it whether the main file a tests or accessibility
 * file belongs to exists; `properNouns` are the words a name may capitalise. Returns one failure per broken rule.
 */
export function checkStoryFile(
  source,
  relPath,
  { properNouns = new Set(), hasMain = () => true } = {},
) {
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
      `"${fileName}" is not a story kind the standard has — use <file>.stories.tsx, <file>.tests.stories.tsx or <file>.accessibility.stories.tsx`,
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

  if (kind === 'tests' || kind === 'accessibility') {
    const folder = kind === 'tests' ? 'Tests' : 'Accessibility'
    const segments = title.split('/')
    if (segments.length !== 3 || segments[0] !== root || segments[2] !== folder) {
      fail(metaLine, `title "${title}" should be "${root}/<Name>/${folder}"`)
    }
    if (!hasMain(base)) {
      fail(1, `${folder.toLowerCase()} file with no ${base}.stories.tsx beside it`)
    }
    const required = kind === 'tests' ? ['!dev', '!autodocs'] : ['!autodocs']
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
  const segments = title.split('/')
  if (kind === 'main') {
    if (segments.length !== 2 || segments[0] !== root) {
      fail(metaLine, `title "${title}" should be "${root}/<Name>"`)
    } else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(segments[1])) {
      fail(metaLine, `title name "${segments[1]}" should be the export name, e.g. "AlertDialog"`)
    }
  }

  for (const story of stories) {
    if (story.id === 'Default' || story.id === 'Playground') continue
    const name = stringValue(property(story.object, 'name'))
    if (!name) {
      fail(
        story.line,
        `story ${story.id} needs a sentence-case \`name\` matching its section title`,
      )
    } else if (!isSentenceCase(name, properNouns)) {
      fail(story.line, `story name "${name}" is not sentence case`)
    }
  }

  if (kind === 'guide' || root === 'Hooks') return failures

  if (stories[0]?.id !== 'Default' || stories[1]?.id !== 'Playground') {
    fail(
      stories[0]?.line ?? 1,
      `the first two stories must be Default then Playground, got ${
        stories
          .slice(0, 2)
          .map((story) => story.id)
          .join(', ') || 'none'
      }`,
    )
  }
  if (!tags.includes('autodocs')) fail(metaLine, "meta tags must include 'autodocs'")
  const docs = property(property(meta, 'parameters'), 'docs')
  if (!property(docs, 'page')) {
    fail(metaLine, 'meta needs parameters.docs.page — a DocsPage, not the generated autodocs page')
  }
  for (const block of ['DocsPage', 'DocsUsage', 'DocsApi']) {
    if (!new RegExp(`<${block}\\b`).test(source)) {
      fail(metaLine, `the docs page must render <${block}> from story-helpers`)
    }
  }
  return failures
}

/** Names a story may capitalise mid-sentence: every exported PascalCase identifier, and a few more. */
function collectProperNouns(srcDir) {
  const nouns = new Set([
    'NSW',
    'Government',
    'Australia',
    'Australian',
    'English',
    'Arabic',
    'Chinese',
    'Escape',
    'Enter',
    'Space',
    'Tab',
    'Home',
    'End',
    'Shift',
    'Storybook',
    'Tailwind',
    'React',
    'Base',
    'UI',
    'WCAG',
    'Country',
    'Sydney',
  ])
  for (const directory of ['components', 'patterns', 'hooks', 'lib']) {
    const path = join(srcDir, directory)
    if (!existsSync(path)) continue
    for (const name of readdirSync(path)) {
      if (!/\.tsx?$/.test(name) || name.includes('.stories.')) continue
      const source = readFileSync(join(path, name), 'utf8')
      for (const match of source.matchAll(/\b(?:function|const|class)\s+([A-Z][A-Za-z0-9]*)/g)) {
        nouns.add(match[1])
      }
    }
  }
  return nouns
}

function main() {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const srcDir = join(packageRoot, 'src')
  const properNouns = collectProperNouns(srcDir)
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
    for (const name of names) {
      const relName = `${directory}/${name}`
      if (name.includes('.stories.')) {
        if (kindOf(name) === 'main') {
          const base = name.replace(/\.stories\.tsx$/, '')
          const hasSource = names.includes(`${base}.tsx`) || names.includes(`${base}.ts`)
          if (!hasSource && !GROUPS.has(`${directory}/${base}`)) {
            failures.push(
              `src/${relName}:1: documents no ${base}.tsx — add it to GROUPS with a reason, or rename it`,
            )
          }
        }
        const source = readFileSync(join(path, name), 'utf8')
        for (const { line, message } of checkStoryFile(source, relName, { properNouns, hasMain })) {
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

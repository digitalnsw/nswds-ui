// Registry JSON post-processor.
//
// packages/ui/src/ deliberately uses RELATIVE imports ('../lib/utils.js') —
// see eslint.config.js for why. But registry items must ship '@/...' aliases:
// the shadcn CLI rewrites '@/' imports to the consumer's configured aliases on
// install and leaves relative paths untouched, so a relative import only works
// if the consumer's folder layout happens to mirror ours (and the '.js'
// extension breaks Vite consumers entirely).
//
// This script rewrites every relative import inside registry item `content`
// to its '@/...' alias (resolved against the item file's `path`), then fails
// the build if any relative import, '.js'-suffixed local import, or
// '@nswds/ui/' self-import survives.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, posix } from 'node:path'

const [outputDir = '../../apps/registry/public/r'] = process.argv.slice(2)

// Stamp every item (and a version.json endpoint) with the @nswds/ui version
// the registry was built from, so consumers can correlate the two
// distribution channels. Deterministic — read from package.json, no
// timestamps — so the CI freshness check still byte-compares.
const { version: packageVersion } = JSON.parse(
  readFileSync('package.json', 'utf8')
)

const SOURCE_EXTENSIONS = /\.(tsx|ts|jsx|js)$/

// Matches static imports/exports (`from '...'`), side-effect imports
// (`import '...'`), and dynamic imports (`import('...')`).
const IMPORT_SPECIFIER_RE =
  /(\bfrom\s+|\bimport\s+|\bimport\s*\(\s*)(['"])([^'"]+)\2/g

function rewriteSpecifier(specifier, sourcePath) {
  if (!specifier.startsWith('.')) {
    return specifier
  }

  // Resolve the relative specifier against the item file's location
  // (e.g. 'src/components/button.tsx' + '../lib/utils.js' → 'src/lib/utils.js').
  const resolved = posix.normalize(
    posix.join(posix.dirname(sourcePath), specifier)
  )

  if (!resolved.startsWith('src/')) {
    throw new Error(
      `Cannot rewrite import '${specifier}' in ${sourcePath} — resolves outside src/ (${resolved})`
    )
  }

  return `@/${resolved.slice('src/'.length).replace(SOURCE_EXTENSIONS, '')}`
}

function rewriteContent(content, sourcePath) {
  return content.replace(
    IMPORT_SPECIFIER_RE,
    (match, keyword, quote, specifier) =>
      `${keyword}${quote}${rewriteSpecifier(specifier, sourcePath)}${quote}`
  )
}

function assertClean(content, sourcePath, file) {
  const problems = []

  for (const [, , , specifier] of content.matchAll(IMPORT_SPECIFIER_RE)) {
    if (specifier.startsWith('.')) {
      problems.push(`relative import '${specifier}'`)
    }
    if (specifier.startsWith('@/') && SOURCE_EXTENSIONS.test(specifier)) {
      problems.push(`extension-suffixed import '${specifier}'`)
    }
    if (specifier.startsWith('@nswds/ui/')) {
      problems.push(`package self-import '${specifier}'`)
    }
  }

  if (content.includes('@nswds/ui/')) {
    problems.push("'@nswds/ui/' string leaked into content")
  }

  if (problems.length > 0) {
    throw new Error(
      `Registry output ${file} (${sourcePath}) is not portable:\n  - ${problems.join('\n  - ')}`
    )
  }
}

const jsonFiles = readdirSync(outputDir).filter((file) =>
  file.endsWith('.json')
)

for (const file of jsonFiles) {
  const filePath = join(outputDir, file)
  const item = JSON.parse(readFileSync(filePath, 'utf8'))

  let changed = false

  if (item.meta?.nswdsVersion !== packageVersion) {
    item.meta = { ...item.meta, nswdsVersion: packageVersion }
    changed = true
  }

  if (!Array.isArray(item.files)) {
    if (changed) {
      writeFileSync(filePath, `${JSON.stringify(item, null, 2)}\n`)
    }
    continue
  }

  for (const entry of item.files) {
    if (typeof entry.content !== 'string' || typeof entry.path !== 'string') {
      continue
    }

    const rewritten = rewriteContent(entry.content, entry.path)
    assertClean(rewritten, entry.path, file)

    if (rewritten !== entry.content) {
      entry.content = rewritten
      changed = true
    }
  }

  if (changed) {
    writeFileSync(filePath, `${JSON.stringify(item, null, 2)}\n`)
  }
}

writeFileSync(
  join(outputDir, 'version.json'),
  `${JSON.stringify({ name: '@nswds/ui', version: packageVersion }, null, 2)}\n`
)

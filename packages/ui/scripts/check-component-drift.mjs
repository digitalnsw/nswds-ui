// Drift guard for the two source surfaces:
//
//   src/components/  — every component must ship on BOTH channels: exported
//                      from src/index.ts (npm) and registered in registry.json
//                      (shadcn), unless explicitly allowlisted as internal.
//   src/patterns/    — registry-only worked examples (e.g. the form patterns).
//                      Each must be registered in registry.json as a block and
//                      must NOT be exported from src/index.ts (they ship only
//                      through the shadcn registry, never in the npm tarball).
//
// This is the check that would have caught card/field/input/label/separator
// existing with full story suites while being absent from both channels — and
// now also catches a pattern leaking into the npm barrel or going unregistered.

import { existsSync, readFileSync, readdirSync } from 'node:fs'

// Intentionally internal files in src/components/. Add an entry ONLY with a
// reason. (The form patterns are no longer here — they live in src/patterns/
// and ship as registry blocks.)
const INTERNAL = new Set([])

function sourceNames(dir) {
  if (!existsSync(dir)) {
    return []
  }
  return readdirSync(dir)
    .filter(
      (name) =>
        name.endsWith('.tsx') &&
        !name.endsWith('.stories.tsx') &&
        name !== 'story-helpers.tsx'
    )
    .map((name) => name.replace(/\.tsx$/, ''))
}

const components = sourceNames('src/components')
const patterns = sourceNames('src/patterns')

const indexSource = readFileSync('src/index.ts', 'utf8')
const registry = JSON.parse(readFileSync('registry.json', 'utf8'))

// Map each registered file path to the set of item `type`s it appears under (a
// file can be shared by several items, e.g. src/lib/utils.ts). This lets the
// guard verify not just that a file is registered, but that it is registered
// under the INTENDED item type — components as `registry:ui`, patterns as
// `registry:block`.
const itemTypesByFile = new Map()
for (const item of registry.items) {
  for (const file of item.files ?? []) {
    const types = itemTypesByFile.get(file.path) ?? new Set()
    types.add(item.type)
    itemTypesByFile.set(file.path, types)
  }
}
const registryFiles = new Set(itemTypesByFile.keys())
const registeredAs = (path, type) =>
  itemTypesByFile.get(path)?.has(type) ?? false

const problems = []

// Components: shipped on both channels unless allowlisted internal.
for (const component of components) {
  if (INTERNAL.has(component)) {
    continue
  }

  if (!indexSource.includes(`./components/${component}.js`)) {
    problems.push(
      `src/components/${component}.tsx is not exported from src/index.ts`
    )
  }

  if (!registeredAs(`src/components/${component}.tsx`, 'registry:ui')) {
    problems.push(
      `src/components/${component}.tsx is not registered in registry.json as a registry:ui item`
    )
  }
}

// Patterns: registry-only — registered as a block, never in the npm barrel.
for (const pattern of patterns) {
  if (!registeredAs(`src/patterns/${pattern}.tsx`, 'registry:block')) {
    problems.push(
      `src/patterns/${pattern}.tsx is not registered in registry.json as a registry:block item`
    )
  }

  if (indexSource.includes(`./patterns/${pattern}.js`)) {
    problems.push(
      `src/patterns/${pattern}.tsx is a registry-only pattern but exported from src/index.ts — patterns must not ship in the npm tarball`
    )
  }
}

// Inverse direction: allowlisted internals must not leak into a channel.
for (const component of INTERNAL) {
  if (indexSource.includes(`./components/${component}.js`)) {
    problems.push(
      `${component} is allowlisted as internal but exported from src/index.ts — remove it from INTERNAL in scripts/check-component-drift.mjs`
    )
  }
  if (registryFiles.has(`src/components/${component}.tsx`)) {
    problems.push(
      `${component} is allowlisted as internal but registered in registry.json — remove it from INTERNAL in scripts/check-component-drift.mjs`
    )
  }
}

// Registry component/pattern file paths must point at files that exist.
for (const path of registryFiles) {
  if (path.startsWith('src/components/')) {
    const name = path.slice('src/components/'.length).replace(/\.tsx$/, '')
    if (!components.includes(name)) {
      problems.push(`registry.json references missing file ${path}`)
    }
  } else if (path.startsWith('src/patterns/')) {
    const name = path.slice('src/patterns/'.length).replace(/\.tsx$/, '')
    if (!patterns.includes(name)) {
      problems.push(`registry.json references missing file ${path}`)
    }
  }
}

if (problems.length > 0) {
  console.error('Component drift detected:\n')
  for (const problem of problems) {
    console.error(`  - ${problem}`)
  }
  console.error(
    '\nShip components on both channels (src/index.ts + registry.json); register patterns as registry-only blocks; or allowlist with a reason.'
  )
  process.exit(1)
}

console.log(
  `✔ ${components.length - INTERNAL.size} components on both channels, ${patterns.length} registry-only patterns, ${INTERNAL.size} internal.`
)

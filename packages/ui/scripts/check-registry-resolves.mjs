// Resolution guard for the shadcn channel.
//
// `check:drift` proves every component is REGISTERED on both channels, and
// `registry:validate` proves registry.json matches shadcn's schema. Neither
// proves the thing a consumer actually depends on: that `shadcn add <item>`
// writes a tree which then COMPILES. An item can be perfectly registered and
// schema-valid while shipping source that imports a file no item delivers.
//
// That is not hypothetical — it is how sheet, sonner and footer-contact each
// shipped broken. sheet/sonner imported the icons barrel (`@/icons/index`),
// which the icons item cannot ship (it is a generated re-export of all ~3900
// icon modules); footer-contact imported `@/icons/call` and
// `@/icons/location-on`, neither of which was in the icons item's file list.
// All three passed drift, validate and the freshness rebuild.
//
// So this checks the BUILT output rather than registry.json: it is what
// consumers actually fetch, it carries each file's `content` inline, and it has
// already been through the `@/` alias rewrite. For every item we resolve the
// transitive registryDependencies closure, collect what that closure delivers,
// and require every module specifier in the item's own files to be satisfied by
// it.
//
// Run AFTER `registry:build` — it reads that build's output.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { basename, resolve } from 'node:path'

const [outputDir = '../../apps/registry/public/r'] = process.argv.slice(2)

// The public URL every cross-item registryDependency should carry. Same source
// of truth the build stamps from, so a half-finished URL migration (some items
// on the old host) fails here rather than reaching consumers.
const { location: registryLocation } = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../../registry.config.json'), 'utf8'),
)
const expectedPrefix = registryLocation.replace(/\/+$/, '')

// Always available to a consumer without the registry declaring them: React is
// a peer dependency of any React component, and Node builtins need no install.
const AMBIENT_PACKAGES = new Set(['react', 'react-dom'])
const NODE_BUILTINS = new Set(builtinModules)

// Every module-specifier form that can appear in a .tsx/.ts file. Deliberately
// regex-based rather than a real parse: the inputs are our own components, and
// a false positive here is a loud, trivially-fixed failure, whereas a missed
// specifier is exactly the silent breakage this script exists to catch.
const SPECIFIER_PATTERNS = [
  /\bfrom\s*['"]([^'"]+)['"]/g, // import … from / export … from
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // dynamic import()
  /\bimport\s+['"]([^'"]+)['"]/g, // side-effect import
  /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // require()
]

function specifiersIn(source) {
  const found = new Set()
  for (const pattern of SPECIFIER_PATTERNS) {
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(source)) !== null) {
      found.add(match[1])
    }
  }
  return found
}

// `components/button.tsx` and `@/components/button` must compare equal, and a
// stray `.js` specifier (TS's ESM convention) must match its .tsx source.
const stripExtension = (value) => value.replace(/\.(tsx|ts|jsx|js|css)$/, '')

// A registryDependency is a URL ending in `<item>.json`.
const stripJson = (value) => value.replace(/\.json$/, '')

// The npm package a specifier installs from: `@base-ui/react/dialog` is the
// `@base-ui/react` package, `react/jsx-runtime` is `react`.
function packageOf(specifier) {
  const segments = specifier.split('/')
  return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]
}

if (!existsSync(outputDir)) {
  console.error(
    `Registry output not found at ${outputDir}.\nRun \`npm run registry:build\` first — this check reads the built JSON.`,
  )
  process.exit(1)
}

// Index the built output by item name. registry.json (the index file) and
// version.json (the stamped version endpoint) are not items.
const itemsByName = new Map()
for (const fileName of readdirSync(outputDir)) {
  if (!fileName.endsWith('.json') || fileName === 'registry.json' || fileName === 'version.json') {
    continue
  }
  const item = JSON.parse(readFileSync(resolve(outputDir, fileName), 'utf8'))
  if (item.name) {
    itemsByName.set(item.name, item)
  }
}

if (itemsByName.size === 0) {
  console.error(`No registry items found in ${outputDir}. Did \`registry:build\` run?`)
  process.exit(1)
}

const problems = []

// Orphan sweep: `shadcn build` writes one JSON per registry.json item but never
// deletes anything, and the CI freshness check compares `git status`, which
// sees modified and new files — not a leftover that nothing regenerates. So
// removing an item leaves its JSON committed AND deployed forever, still
// serving the source of a component that no longer exists. (description-list
// survived three releases this way.)
const declaredNames = new Set(
  JSON.parse(readFileSync(resolve(import.meta.dirname, '../registry.json'), 'utf8')).items.map(
    (item) => item.name,
  ),
)
for (const name of itemsByName.keys()) {
  if (!declaredNames.has(name)) {
    problems.push(
      `${name}: ${outputDir}/${name}.json is orphaned — no item named "${name}" exists in registry.json, so nothing regenerates this file. Delete it.`,
    )
  }
}

// A registryDependency is a URL; the item it names is its basename.
// (We currently treat any non-URL/odd value as an invalid dependency and report it via the existence checks below.)
const dependencyName = (url) => stripJson(basename(url))

// Transitive closure over registryDependencies, cycle-safe.
function closureOf(name, seen = new Set()) {
  if (seen.has(name)) {
    return seen
  }
  seen.add(name)
  for (const url of itemsByName.get(name)?.registryDependencies ?? []) {
    closureOf(dependencyName(url), seen)
  }
  return seen
}

for (const [name, item] of itemsByName) {
  // Cross-item links must point at the configured public URL and at an item
  // that exists. A dangling link is a broken install; a wrong host silently
  // routes consumers somewhere else.
  for (const url of item.registryDependencies ?? []) {
    if (url.includes('{{')) {
      problems.push(`${name}: registryDependency still carries an unexpanded token — ${url}`)
      continue
    }
    if (!url.startsWith(`${expectedPrefix}/`)) {
      problems.push(
        `${name}: registryDependency does not point at the configured registry location (${expectedPrefix}) — ${url}`,
      )
    }
    if (!itemsByName.has(dependencyName(url))) {
      problems.push(`${name}: registryDependency resolves to no such item — ${url}`)
    }
  }

  if (!item.files?.length) {
    continue
  }

  // What this item's install actually puts on disk, and what npm packages that
  // install brings with it.
  const deliveredPaths = new Set()
  const availablePackages = new Set()
  for (const dependency of closureOf(name)) {
    const resolved = itemsByName.get(dependency)
    if (!resolved) {
      continue
    }
    for (const file of resolved.files ?? []) {
      deliveredPaths.add(stripExtension(file.target ?? file.path))
    }
    for (const dep of resolved.dependencies ?? []) {
      availablePackages.add(packageOf(dep))
    }
  }

  const ownPackages = new Set((item.dependencies ?? []).map(packageOf))

  for (const file of item.files) {
    for (const specifier of specifiersIn(file.content ?? '')) {
      if (specifier.startsWith('@/')) {
        if (!deliveredPaths.has(stripExtension(specifier.slice(2)))) {
          problems.push(
            `${name}: ${file.target ?? file.path} imports "${specifier}", which nothing in its registryDependencies delivers`,
          )
        }
        continue
      }

      if (specifier.startsWith('.')) {
        // The alias rewrite converts every relative import to `@/…`; one
        // surviving here means it escaped the rewrite and will dangle once the
        // file is copied into a consumer's own directory layout.
        problems.push(
          `${name}: ${file.target ?? file.path} ships a relative import "${specifier}" — it should have been rewritten to a "@/" alias`,
        )
        continue
      }

      if (specifier.startsWith('node:') || NODE_BUILTINS.has(specifier)) {
        continue
      }

      const pkg = packageOf(specifier)
      if (AMBIENT_PACKAGES.has(pkg)) {
        continue
      }
      if (!availablePackages.has(pkg)) {
        problems.push(
          `${name}: ${file.target ?? file.path} imports "${specifier}" but no item in its dependency closure installs "${pkg}"`,
        )
      } else if (!ownPackages.has(pkg)) {
        // Satisfied, but only by luck: it arrives because some OTHER item in
        // the closure happens to declare it. Drop that item as a dependency and
        // this item silently stops installing a package it directly imports.
        problems.push(
          `${name}: ${file.target ?? file.path} imports "${specifier}" but "${pkg}" is missing from this item's own "dependencies" (it currently arrives only via a transitive registryDependency)`,
        )
      }
    }
  }
}

if (problems.length > 0) {
  console.error('Registry items would not resolve for a consumer:\n')
  for (const problem of problems) {
    console.error(`  - ${problem}`)
  }
  console.error(
    '\nEvery "@/" import must be delivered by the item or one of its registryDependencies,' +
      '\nand every npm import must be declared in that item\'s own "dependencies".' +
      '\nFix registry.json (add the file / dependency), then re-run `npm run registry:build`.',
  )
  process.exit(1)
}

const fileCount = [...itemsByName.values()].reduce(
  (total, item) => total + (item.files?.length ?? 0),
  0,
)
console.log(
  `✔ ${itemsByName.size} registry items resolve: ${fileCount} shipped files, all imports satisfied by their dependency closure.`,
)

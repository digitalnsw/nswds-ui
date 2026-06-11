// Drift guard: every component under src/components/ must be shipped on BOTH
// distribution channels — exported from src/index.ts (npm) and registered in
// registry.json (shadcn) — unless it is explicitly allowlisted as internal.
//
// This is the check that would have caught card/field/input/label/separator
// existing with full story suites while being absent from both channels.

import { readFileSync, readdirSync } from 'node:fs'

// Intentionally internal files. Add an entry ONLY with a reason.
const INTERNAL = new Set([
  // Demo patterns for Storybook; not yet shipped as registry blocks.
  // Promote via a `registry:block` item + barrel export when productionised.
  'login-form',
  'sign-up-form',
  'forgot-password-form',
])

const components = readdirSync('src/components')
  .filter(
    (name) =>
      name.endsWith('.tsx') &&
      !name.endsWith('.stories.tsx') &&
      name !== 'story-helpers.tsx'
  )
  .map((name) => name.replace(/\.tsx$/, ''))

const indexSource = readFileSync('src/index.ts', 'utf8')
const registry = JSON.parse(readFileSync('registry.json', 'utf8'))
const registryFiles = new Set(
  registry.items.flatMap((item) => (item.files ?? []).map((file) => file.path))
)

const problems = []

for (const component of components) {
  if (INTERNAL.has(component)) {
    continue
  }

  if (!indexSource.includes(`./components/${component}.js`)) {
    problems.push(
      `src/components/${component}.tsx is not exported from src/index.ts`
    )
  }

  if (!registryFiles.has(`src/components/${component}.tsx`)) {
    problems.push(
      `src/components/${component}.tsx is not registered in registry.json`
    )
  }
}

// Inverse direction: allowlisted internals must not leak into a channel,
// and registry entries must point at files that exist.
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

for (const path of registryFiles) {
  if (path.startsWith('src/components/')) {
    const name = path.slice('src/components/'.length).replace(/\.tsx$/, '')
    if (!components.includes(name)) {
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
    '\nShip the component on both channels (src/index.ts + registry.json) or allowlist it with a reason.'
  )
  process.exit(1)
}

console.log(
  `✔ ${components.length - INTERNAL.size} components shipped on both channels, ${INTERNAL.size} allowlisted internal.`
)

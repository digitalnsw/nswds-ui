// Post-build guard for the published `dist/` tree.
//
// The icon declarations are not emitted by tsup's dts pipeline — rollup-dts over
// ~3900 formulaic modules is pointless and slow, so tsup.config.ts writes them
// programmatically in an onSuccess hook instead. That hand-rolled step sits
// outside tsup's own accounting, so nothing in the build fails when it produces
// nothing: `npm run build` exits 0 with a dist/ that is missing every icon type.
//
// That is exactly what happened when the core config's `clean` raced the hook
// (see the comment above `rmSync` in tsup.config.ts): the only thing that caught
// it was publint, in CI, intermittently — long after the build had claimed
// success. This turns that into an immediate, deterministic, local failure.
//
// Deliberately cheap: a readdir and some set arithmetic, no `npm pack`. It is
// not a replacement for `check:package` (publint/attw still validate the real
// tarball against package.json `exports`) — it is the fast guard that runs on
// every build, including Vercel's.

import { existsSync, readdirSync } from 'node:fs'

const problems = []

function requireFile(path, why) {
  if (!existsSync(path)) {
    problems.push(`${path} is missing — ${why}`)
  }
}

// Core barrel: proves the dts pipeline ran at all.
requireFile('dist/index.js', 'the core build did not emit its barrel')
requireFile('dist/index.d.ts', 'the core dts task did not emit its barrel types')

// Icons: every emitted module must have a matching declaration. A count check
// alone would miss a partial write, so compare the actual name sets.
const iconDir = 'dist/icons'

if (!existsSync(iconDir)) {
  problems.push(`${iconDir}/ is missing — the icons config did not run`)
} else {
  const files = readdirSync(iconDir)
  const js = new Set(files.filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3)))
  const dts = new Set(files.filter((f) => f.endsWith('.d.ts')).map((f) => f.slice(0, -5)))

  const missing = [...js].filter((name) => !dts.has(name)).sort()
  const orphaned = [...dts].filter((name) => !js.has(name)).sort()

  if (missing.length > 0) {
    problems.push(
      `${missing.length} of ${js.size} icon modules have no .d.ts (e.g. ${missing
        .slice(0, 5)
        .join(', ')}) — writeIconDeclarations did not run, or its output was ` +
        `deleted afterwards. Check that neither tsup config sets \`clean\`.`,
    )
  }

  if (orphaned.length > 0) {
    problems.push(
      `${orphaned.length} icon declarations have no matching .js (e.g. ${orphaned
        .slice(0, 5)
        .join(', ')}) — stale output from an earlier build.`,
    )
  }
}

if (problems.length > 0) {
  console.error('dist/ verification failed:\n')
  for (const problem of problems) {
    console.error(`  - ${problem}`)
  }
  console.error('')
  process.exit(1)
}

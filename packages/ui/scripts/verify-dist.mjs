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

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

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

// Hand-drawn brand marks live under dist/icons/brands/ and are built by the
// CORE tsup config (not the icons one), so the name-set check above cannot see
// them — it reads dist/icons/ non-recursively.
requireFile('dist/icons/brands/index.js', 'the brands icon entry did not build')
requireFile(
  'dist/icons/brands/index.d.ts',
  'the brands icon entry built without types — it must go through the CORE tsup config, ' +
    'because writeIconDeclarations cannot emit declarations for a subdirectory (it hardcodes ' +
    "a './types.js' import that does not resolve from there)",
)

// ── 'use client' directives ──────────────────────────────────────────────────
//
// The other silent failure mode named in tsup.config.ts, and the one that had
// no guard: tsup's esbuild pass STRIPS the directive, and restoreUseClientDirectives
// puts it back in an onSuccess hook. That hook sits outside tsup's accounting
// exactly like writeIconDeclarations does, so if it stops running — a rename,
// an entry moved between the two configs, another clean race — the build still
// exits 0. As the config file puts it: a stripped 'use client' "still builds,
// still imports and still renders — right up until a server component passes
// one of these exports as a prop", which is the entire reason those modules
// carry the directive. That failure surfaces in a CONSUMER's app, at runtime,
// as an opaque React Server Components error.
//
// Source is the authority: every module that declares the directive must have
// it in its build output.
const DIRECTIVE = /^\s*(['"])use client\1/

function collectSources(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      // patterns/ ships through the registry only — it is excluded from the
      // tsup build, so it has no dist counterpart to check.
      if (name !== 'patterns') collectSources(path, found)
      continue
    }
    if (!['.ts', '.tsx'].includes(extname(name))) continue
    if (name.endsWith('.stories.tsx') || name.endsWith('.d.ts')) continue
    if (name === 'story-helpers.tsx') continue
    found.push(path)
  }
  return found
}

if (existsSync('src')) {
  const stripped = []
  for (const source of collectSources('src')) {
    if (!DIRECTIVE.test(readFileSync(source, 'utf8'))) continue
    const output = join('dist', `${relative('src', source).slice(0, -extname(source).length)}.js`)
    if (!existsSync(output)) {
      problems.push(`${output} is missing — ${source} declares 'use client' but did not build`)
      continue
    }
    if (!DIRECTIVE.test(readFileSync(output, 'utf8'))) stripped.push(output)
  }

  if (stripped.length > 0) {
    problems.push(
      `${stripped.length} module(s) lost their 'use client' directive in the build ` +
        `(e.g. ${stripped.slice(0, 5).join(', ')}) — restoreUseClientDirectives did not run for ` +
        `them. Check that both tsup configs still call it for their own entries, and that no ` +
        `entry moved between the core and icons configs without its onSuccess following.`,
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

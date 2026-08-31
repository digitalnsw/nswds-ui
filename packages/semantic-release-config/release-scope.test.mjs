/**
 * Tests for the path-scoped release gate.
 *
 * These matter more than most: release.yml commits with `[skip ci]`, so the
 * release pipeline is never exercised by PR CI, and a mistake here is only
 * visible after it has already published (or failed to publish) to npm.
 *
 * Every case builds a throwaway git repository in a temp directory rather than
 * reaching into this repo's real history — the checkout in pr-checks.yml is
 * shallow, so tests pinned to real commit SHAs would fail there.
 */

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, before, describe, test } from 'node:test'

import { __scopeCacheForTests, analyzeCommits, generateNotes } from './release-scope.mjs'

const PLUGIN_CONFIG = {
  paths: ['packages/ui/'],
  preset: 'conventionalcommits',
  releaseRules: [
    { breaking: true, release: 'major' },
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'chore', release: false },
    { type: 'build', release: false },
  ],
}

let cwd

const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()

/** Commit `files` ({ path: contents }) with `message`; returns the new SHA. */
function commit(message, files) {
  for (const [file, contents] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(cwd, file)), { recursive: true })
    writeFileSync(path.join(cwd, file), contents)
  }
  git('add', '-A')
  git('commit', '-m', message)
  return { hash: git('rev-parse', 'HEAD'), message }
}

/** A context shaped like the one semantic-release hands a plugin. */
const contextFor = (commits) => ({
  cwd,
  commits,
  logger: { log: () => {} },
  options: { repositoryUrl: 'https://github.com/digitalnsw/nswds-ui.git' },
  lastRelease: { version: '1.0.0', gitTag: '@nswds/ui-v1.0.0' },
  nextRelease: { version: '1.0.1', gitTag: '@nswds/ui-v1.0.1', type: 'patch' },
})

before(() => {
  cwd = mkdtempSync(path.join(tmpdir(), 'release-scope-'))
  git('init', '-b', 'main')
  git('config', 'user.email', 'test@example.com')
  git('config', 'user.name', 'Test')
  git('config', 'commit.gpgsign', 'false')
  commit('chore: root', { 'README.md': 'seed\n' })
})

after(() => rmSync(cwd, { recursive: true, force: true }))

describe('analyzeCommits', () => {
  test('releases when a releasable commit touches the published package', async () => {
    const c = commit('fix(ui): correct the button focus ring', {
      'packages/ui/src/components/button.tsx': 'export const Button = 1\n',
    })
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([c])), 'patch')
  })

  test('does NOT release a fix confined to an unpublished workspace (#119)', async () => {
    // The 5.0.1 shape exactly: apps/web is private:true and ships nowhere, and
    // the lockfile is deliberately out of scope because it moves in every
    // dependency PR.
    const c = commit('fix(deps): update dependency next to v16.3.1', {
      'apps/web/package.json': '{"name":"web"}\n',
      'package-lock.json': '{"lockfileVersion":3}\n',
    })
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([c])), null)
  })

  test('takes the highest release type among in-scope commits only', async () => {
    const outOfScope = commit('feat(web): add a sandbox page', {
      'apps/web/app/page.tsx': 'export default () => null\n',
    })
    const inScope = commit('fix(ui): tighten the Link href type', {
      'packages/ui/src/components/link.tsx': 'export const Link = 1\n',
    })
    // feat would be `minor`, but it changed nothing in the published package.
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([outOfScope, inScope])), 'patch')
  })

  test('does not release when the only in-scope commits are non-releasable types', async () => {
    // The 4.1.0→4.1.1 shape: a `build(prettier)` reformat touched 87 files
    // under packages/ui, and an unrelated `fix:` elsewhere swept it into a
    // release. The repo maps `build` to release:false, so the correct answer
    // is to wait for a genuinely releasable commit.
    const reformat = commit('build(prettier): adopt the shared config', {
      'packages/ui/src/components/badge.tsx': 'export const Badge = 1\n',
    })
    const elsewhere = commit('fix(ci): raise the lint gate', {
      '.github/workflows/ci.yml': 'on: push\n',
    })
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([reformat, elsewhere])), null)
  })

  test('releases a non-squashed merge of an in-scope fix, given real messages', async () => {
    // Mirrors what semantic-release actually hands the plugin for a
    // non-squashed merge: BOTH the merge commit (with its real, unparseable
    // "Merge pull request…" subject) and the branch's inner commit (with the
    // conventional message). The release type comes from the inner commit;
    // the merge commit contributes nothing either way.
    git('checkout', '-b', 'feature')
    const inner = commit('fix(ui): honour prefers-reduced-motion', {
      'packages/ui/src/components/spinner.tsx': 'export const Spinner = 1\n',
    })
    git('checkout', 'main')
    git('merge', '--no-ff', '-m', 'Merge pull request #1 from digitalnsw/fix/motion', 'feature')
    const merge = {
      hash: git('rev-parse', 'HEAD'),
      message: 'Merge pull request #1 from digitalnsw/fix/motion',
    }
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([merge, inner])), 'patch')
  })

  test('drops a merge whose message is releasable but whose net change is out of scope', async () => {
    // THE test that pins `-m --first-parent` in changedFiles(). Without `-m`,
    // git diff-tree reports NO files for a merge commit, and an empty file
    // list takes the deliberate fail-open path — the merge would be KEPT and
    // its releasable subject would wrongly cut a release. (Not "look out of
    // scope": empty fails open, i.e. IN scope.) With the flags, the net
    // first-parent diff is apps/web only, so the merge is dropped and there
    // is nothing to release. Deleting the flags fails exactly this test.
    git('checkout', '-b', 'web-only')
    const inner = commit('feat(web): sandbox tweak', {
      'apps/web/app/sandbox.tsx': 'export default 1\n',
    })
    git('checkout', 'main')
    git('merge', '--no-ff', '-m', 'fix: bring in web sandbox tweaks', 'web-only')
    const merge = { hash: git('rev-parse', 'HEAD'), message: 'fix: bring in web sandbox tweaks' }
    // The inner commit rides along as semantic-release would supply it; its
    // diff is apps/web only, so scope drops it too.
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([merge, inner])), null)
  })

  test('fails OPEN on an empty commit, keeping --allow-empty as a force-release hatch', async () => {
    git('commit', '--allow-empty', '-m', 'fix: force a release')
    const empty = { hash: git('rev-parse', 'HEAD'), message: 'fix: force a release' }
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([empty])), 'patch')
  })

  test('fails OPEN when git cannot inspect the commit', async () => {
    const unknown = { hash: '0'.repeat(40), message: 'fix(ui): unreachable object' }
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([unknown])), 'patch')
  })

  test('a breaking change in scope still yields major', async () => {
    const c = commit(
      'fix(deps)!: update @nswds/tokens to v5\n\nBREAKING CHANGE: token values moved.',
      {
        'packages/ui/package.json': '{"name":"@nswds/ui"}\n',
      },
    )
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor([c])), 'major')
  })
})

describe('generateNotes', () => {
  test('omits out-of-scope commits, so the changelog only claims what shipped', async () => {
    const outOfScope = commit('fix(deps): update dependency next to v16.3.2', {
      'apps/web/package.json': '{"name":"web","version":"2"}\n',
    })
    const inScope = commit('fix(ui): meet WCAG AA contrast for placeholders', {
      'packages/ui/src/components/input.tsx': 'export const Input = 1\n',
    })
    const notes = await generateNotes(PLUGIN_CONFIG, contextFor([outOfScope, inScope]))
    assert.match(notes, /WCAG AA contrast for placeholders/)
    assert.doesNotMatch(notes, /next to v16\.3\.2/)
  })
})

describe('scope memoisation', () => {
  // analyzeCommits and generateNotes are called with the SAME commits array in
  // one release run and both need the same filtered list, so the walk is
  // memoised. Two things have to hold, and neither is visible from the
  // behavioural tests above.
  test('the two entry points agree on one commit list', async () => {
    // The property the cache must preserve. analyzeCommits decides WHETHER to
    // release and generateNotes decides what the changelog CLAIMS shipped, so
    // the two disagreeing is the failure that matters — a release whose notes
    // describe a different set of commits than the one that triggered it.
    const inScope = commit('fix: memo', { 'packages/ui/src/memo.ts': 'export {}\n' })
    const commits = [inScope]

    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor(commits)), 'patch')
    assert.match(await generateNotes(PLUGIN_CONFIG, contextFor(commits)), /memo/)
  })

  test('the second entry point reuses the walk rather than repeating it', async () => {
    // Asserted directly against the cache, because the saving is invisible from
    // the outside: the walk fails open, so a miss returns the same answer as a
    // hit. Without this, deleting the cache entirely leaves every other test in
    // this file green — which is exactly what a reviewer pointed out.
    const inScope = commit('fix: reuse', { 'packages/ui/src/reuse.ts': 'export {}\n' })
    const commits = [inScope]

    assert.equal(__scopeCacheForTests.get(commits), undefined, 'expected a cold cache')

    await analyzeCommits(PLUGIN_CONFIG, contextFor(commits))
    const afterAnalyze = __scopeCacheForTests.get(commits)
    assert.ok(afterAnalyze, 'analyzeCommits should have populated the cache')
    const entry = afterAnalyze.get(JSON.stringify(PLUGIN_CONFIG.paths))
    assert.ok(entry, 'expected an entry keyed by the paths scope')

    await generateNotes(PLUGIN_CONFIG, contextFor(commits))
    assert.equal(
      __scopeCacheForTests.get(commits).get(JSON.stringify(PLUGIN_CONFIG.paths)),
      entry,
      'generateNotes should have reused the SAME result object, not walked again',
    )
  })

  test('does not serve a cached answer to a different `paths` scope', async () => {
    const outside = commit('fix: elsewhere', { 'apps/web/src/page.tsx': 'export {}\n' })
    const commits = [outside]

    // packages/ui/ — out of scope, so no release.
    assert.equal(await analyzeCommits(PLUGIN_CONFIG, contextFor(commits)), null)

    // apps/web/ — the SAME commits array, a different scope. If the cache were
    // keyed on the array alone, this would wrongly return null.
    const webScoped = { ...PLUGIN_CONFIG, paths: ['apps/web/'] }
    assert.equal(await analyzeCommits(webScoped, contextFor(commits)), 'patch')
  })
})

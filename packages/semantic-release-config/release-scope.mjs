/**
 * Path-scoped release gate.
 *
 * semantic-release runs from the repo root and analyses every commit on
 * `main`, but this monorepo publishes exactly one package — `@nswds/ui`, the
 * `pkgRoot` in index.cjs. Nothing in the default plugin chain asks whether
 * that package actually changed, so a `fix(deps)` bump confined to an
 * unpublished workspace cuts a patch release whose tarball is functionally
 * identical to the one before it, and whose changelog describes a change that
 * is not in it. `apps/web` is `private: true` and ships nowhere, yet
 * `fix(deps): update dependency next to v16.3.1` published @nswds/ui 5.0.1.
 * See issue #119.
 *
 * This wraps @semantic-release/commit-analyzer and
 * @semantic-release/release-notes-generator with the commit list filtered to
 * commits that touched `paths`. Filtering BOTH matters: the analyzer decides
 * whether to release at all, the notes generator decides what the changelog
 * claims shipped.
 *
 * Why this layer, and not the two alternatives the issue floated:
 *
 *   - An `@semantic-release/exec` step that aborts is wrong. exec signals
 *     "stop" by exiting non-zero, which fails the job, which trips the
 *     `alert-on-failure` job in release.yml and files a release-failure issue.
 *     "Nothing to release" is a normal, green outcome, and `analyzeCommits`
 *     returning `null` is how semantic-release spells it.
 *   - `semantic-release-monorepo` expects to run once per package from inside
 *     that package's directory. Adopting it would move the cwd out from under
 *     `@semantic-release/git`'s asset globs and the exec `prepareCmd`, which
 *     are root-relative here.
 *
 * TWO PROPERTIES THAT ARE DELIBERATE, because both look like bugs:
 *
 *   - Scope is evaluated over the WHOLE RANGE since the last tag, one commit
 *     at a time — never over just the commit that happened to trigger the run.
 *     Non-releasing types accumulate: the 4.1.0→4.1.1 range held eight
 *     `chore(ci)`/`build(prettier)` commits that reformatted 87 files under
 *     packages/ui, and the `fix:` commit that triggered the release correctly
 *     shipped all of it. Judging that release by its triggering commit alone
 *     (which touched nothing under packages/ui) would have withheld the lot.
 *
 *   - A commit whose file list comes back empty counts as IN scope, as does
 *     one git cannot inspect. Both fail OPEN, which is the safe direction:
 *     withholding a real release strands consumers on a stale version, while
 *     cutting a redundant one costs a version number. It also keeps
 *     `git commit --allow-empty -m 'fix: …'` working as a force-a-release
 *     escape hatch.
 *
 * `package-lock.json` is NOT in scope, on purpose: it changes in every
 * dependency PR, so counting it would suppress nothing at all. The blind spot
 * that leaves — a lockfile-only bump of a build-time devDependency whose
 * values are inlined into `dist`, which in practice means `@nswds/tokens` —
 * already exists today, because Renovate labels lockfile-maintenance commits
 * `chore` and index.cjs maps `chore` to `release: false`. This does not widen
 * it. If it ever bites, add `'package-lock.json'` to `paths` and accept that
 * every dependency PR releases again.
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { analyzeCommits as analyzeInScopeCommits } from '@semantic-release/commit-analyzer'
import { generateNotes as generateInScopeNotes } from '@semantic-release/release-notes-generator'

const execFileAsync = promisify(execFile)

/** Fallback when a caller supplies no `paths` — mirrors index.cjs's pkgRoot. */
export const DEFAULT_PATHS = ['packages/ui/']

/**
 * Files a single commit changed.
 *
 * `-m --first-parent` is load-bearing: without `-m`, `diff-tree` prints
 * NOTHING for a merge commit, so every non-squashed merge would look like it
 * changed no files. `--first-parent` then picks the diff against main — the
 * net change the merged branch introduced — rather than one section per
 * parent.
 */
async function changedFiles(hash, cwd) {
  const { stdout } = await execFileAsync(
    'git',
    ['diff-tree', '--no-commit-id', '--name-only', '-r', '-m', '--first-parent', hash],
    { cwd, maxBuffer: 64 * 1024 * 1024 },
  )
  return stdout.split('\n').filter(Boolean)
}

function touchesScope(files, paths) {
  return files.some((file) => paths.some((prefix) => file.startsWith(prefix)))
}

/** Strip our own option before handing the config to the wrapped plugin. */
function delegateConfig({ paths, ...rest }) {
  void paths
  return rest
}

async function commitsInScope(pluginConfig, context) {
  const paths = pluginConfig.paths ?? DEFAULT_PATHS
  const { cwd, commits, logger } = context
  const kept = []

  for (const commit of commits) {
    let files
    try {
      files = await changedFiles(commit.hash, cwd)
    } catch (error) {
      // Fail open — see the header. A commit we cannot inspect must never be
      // the reason a real release is withheld.
      logger.log(
        `release-scope: could not list files for ${commit.hash} (${error.message.split('\n')[0]}) — treating it as in scope.`,
      )
      kept.push(commit)
      continue
    }
    if (files.length === 0 || touchesScope(files, paths)) kept.push(commit)
  }

  return { kept, paths }
}

export async function analyzeCommits(pluginConfig, context) {
  const { kept, paths } = await commitsInScope(pluginConfig, context)
  const dropped = context.commits.length - kept.length

  if (dropped > 0) {
    context.logger.log(
      `release-scope: ignoring ${dropped} of ${context.commits.length} commit(s) — they changed nothing under ${paths.join(', ')}.`,
    )
  }

  if (kept.length === 0) {
    context.logger.log(
      `release-scope: no commit since the last release touched ${paths.join(', ')} — the published package is unchanged, so there is nothing to release.`,
    )
    return null
  }

  return analyzeInScopeCommits(delegateConfig(pluginConfig), { ...context, commits: kept })
}

export async function generateNotes(pluginConfig, context) {
  const { kept } = await commitsInScope(pluginConfig, context)
  return generateInScopeNotes(delegateConfig(pluginConfig), { ...context, commits: kept })
}

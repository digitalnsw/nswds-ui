#!/usr/bin/env node
/**
 * Fails when a workflow `run:` block interpolates `${{ … }}`.
 *
 * GitHub Actions substitutes `${{ … }}` into a `run:` script as TEXT, before
 * bash ever parses it. The interpolated value is therefore not an argument, it
 * is source code — and any expression whose value can come from repo contents
 * (a tag, a branch, a filename, a PR title, or a step output derived from one)
 * is attacker-controlled source code.
 *
 * The tag case is not hypothetical here. `release.yml` reads the newest release
 * tag with `git tag --list '@nswds/ui-v*'` and, before this gate existed, put it
 * straight into a run block. Git refnames forbid spaces, newlines and `:`, but
 * permit `"`, `;`, `#`, backticks and `$(…)` — verified with
 * `git check-ref-format`. A tag named `@nswds/ui-v9.9.9";id;#` is creatable,
 * matches that glob, and sorts first under `--sort=-v:refname`, so
 * `expected="${{ steps.after_release.outputs.tag }}"` became
 * `expected="@nswds/ui-v9.9.9";id;#"` and ran `id` — inside the one job holding
 * `id-token: write` (npm trusted publishing) and a deploy key that bypasses the
 * `main` ruleset. The same class was fixed in nswds-devops' `reusable-ci.yml`
 * the same week, which is why this is a gate and not a note in AGENTS.md.
 *
 * The fix is always the same shape: bind the expression under the step's `env:`
 * and read it as `"$VAR"` inside the script, where it is data.
 *
 * WHY A LINE SCANNER AND NOT A YAML PARSE: `yaml` is not in this repo's
 * lockfile, and adding a runtime dependency to a security gate to read a
 * sublanguage this simple is a poor trade. A `run:` block is either an inline
 * scalar or a block scalar, and either way its body is the lines indented
 * deeper than its key — that rule is short enough to implement correctly and is
 * pinned by scripts/check-workflow-interpolation.test.mjs, which covers the
 * block and inline forms, multi-line continuations of each, nested
 * deeper-indented keys, `#`-commented hits, sibling keys at the same indent,
 * and the ALLOWED list. Both false negatives found so far lived in the gap
 * between "looks like one line" and "is one scalar", so test that gap first.
 * If this ever needs real YAML semantics, add the dependency rather than
 * growing the regexes.
 *
 * WHAT THIS DOES NOT COVER, deliberately:
 *
 *   - `if:`, `with:`, `env:` and every other non-`run:` key are expression
 *     context, not shell. `${{ }}` there is evaluated by Actions and never
 *     reaches a parser that could execute it. Only `run:` is scanned.
 *   - An `env:` binding whose VALUE is hostile is still just a string to bash,
 *     PROVIDED the script quotes it. This gate does not check quoting: write
 *     "$VAR", never bare $VAR.
 *   - Composite actions (`action.yml`) are not scanned — this repo has none.
 *     Add them to the file list if that changes.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

/**
 * Expressions that cannot carry repo-controlled text.
 *
 * `…head.repo.fork` is a boolean the platform computes, never author text.
 *
 * Secrets are deliberately NOT exempt. A secret's value is interpolated as text
 * exactly like anything else; only the threat model differs, since setting one
 * needs admin rights. "An admin could shell-inject their own release job" is a
 * weaker argument than simply binding it under `env:`, which costs one line,
 * and GitHub's own hardening guidance says the same. Keep this list as short as
 * the evidence allows, and give every entry a reason.
 */
export const ALLOWED = [/^github\.event\.pull_request\.head\.repo\.fork$/]

const EXPRESSION = /\$\{\{([^}]*)\}\}/g
/**
 * The `- ` of a sequence item is part of the key's indent: in `      - run: |`
 * the `run` key sits at column 8, so its block body is whatever is indented
 * past 8 and a sibling `env:` at 8 ends it. Capturing the dash in the indent
 * group makes both forms — `- run:` and a bare `run:` under `- name:` — take
 * the same path. Omitting it made this gate miss every `- run:` step while
 * still passing release.yml, which happens to use the bare form.
 */
const INDENT = String.raw`(\s*(?:-\s+)?)`
/** `run:` with a block scalar (`|`, `>`, and their chomping/indent modifiers). */
const RUN_BLOCK = new RegExp(`^${INDENT}run:\\s*[|>][-+0-9]*\\s*$`)
/** `run:` with the script inline on the same line. */
const RUN_INLINE = new RegExp(`^${INDENT}run:\\s+(\\S.*)$`)

/**
 * Every line of shell inside a `run:` in one workflow, as {line, text}.
 *
 * A scalar's body is exactly the run of lines indented deeper than its key,
 * with blank lines belonging to whichever block surrounds them. That is the
 * whole rule; anything shallower than the key ends it.
 *
 * The rule applies to the INLINE form too, not just `run: |`. A YAML plain or
 * quoted scalar may continue onto following indented lines, so
 *
 *     - run: echo
 *         ${{ github.ref }}
 *
 * is one script, and treating the inline form as single-line left its
 * continuation unscanned — the gate then reported "no interpolation" about a
 * step it had not actually read.
 */
export function shellLines(fileText) {
  const out = []
  const lines = fileText.split('\n')
  let blockIndent = null

  for (const [index, text] of lines.entries()) {
    const lineNumber = index + 1

    if (blockIndent !== null) {
      const indent = text.match(/^\s*/)[0].length
      if (text.trim() === '' || indent > blockIndent) {
        out.push({ line: lineNumber, text })
        continue
      }
      blockIndent = null
    }

    const block = text.match(RUN_BLOCK)
    if (block) {
      blockIndent = block[1].length
      continue
    }

    const inline = text.match(RUN_INLINE)
    if (inline) {
      out.push({ line: lineNumber, text: inline[2] })
      blockIndent = inline[1].length
    }
  }

  return out
}

/**
 * Every disallowed interpolation in one workflow's shell.
 *
 * A `#`-commented line is NOT exempt, though an earlier version of this file
 * exempted it on the grounds that release.yml quotes the banned pattern to
 * explain itself. It does not: every such comment there is a YAML comment
 * OUTSIDE the run scalar, so the exemption protected nothing and cost the
 * gate its point. Substitution happens before bash sees the script, so a
 * shell `#` does not comment out the value — it only comments out the FIRST
 * line of it. `# ${{ github.event.pull_request.title }}` with a title of
 * "x\nid" becomes two lines, and the second one runs.
 */
export function findViolations(fileText) {
  const found = []
  for (const { line, text } of shellLines(fileText)) {
    for (const match of text.matchAll(EXPRESSION)) {
      const expression = match[1].trim()
      if (ALLOWED.some((pattern) => pattern.test(expression))) continue
      found.push({ line, expression })
    }
  }
  return found
}

function main() {
  const workflowDir = join(repoRoot, '.github', 'workflows')
  const workflows = readdirSync(workflowDir)
    .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
    .sort()

  const failures = []
  for (const name of workflows) {
    const path = join(workflowDir, name)
    for (const { line, expression } of findViolations(readFileSync(path, 'utf8'))) {
      failures.push({ location: `${relative(repoRoot, path)}:${line}`, expression })
    }
  }

  if (failures.length > 0) {
    console.error(
      `\n${failures.length} workflow interpolation(s) inside a run: block.\n\n` +
        `\${{ … }} is substituted into the script as TEXT before bash parses it, so the\n` +
        `value is code, not data. Bind it under the step's env: and read it as "$VAR".\n`,
    )
    for (const { location, expression } of failures) {
      console.error(`  ${location}\n    \${{ ${expression} }}`)
    }
    console.error(
      `\nIf an expression genuinely cannot carry repo-controlled text, add it to ALLOWED\n` +
        `in scripts/check-workflow-interpolation.mjs with a comment saying why.\n`,
    )
    process.exit(1)
  }

  console.log(
    `check:workflows — no \${{ … }} interpolation in any run: block (${workflows.length} workflows scanned).`,
  )
}

if (import.meta.url === `file://${process.argv[1]}`) main()

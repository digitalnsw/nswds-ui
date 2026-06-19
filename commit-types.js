// Single source of truth for this project's Conventional Commit types.
//
// Consumed directly by commitlint.config.js (the husky commit-msg hook + the
// commitlint CI check), and used to generate the `convention.commitTypes` list
// in git-conventional-commits.yaml via `npm run gen:commit-config`.
//
// Change the allowed types HERE ONLY. Never hand-edit the list in the YAML —
// it is generated, and the commit-types-sync workflow fails if the two drift.
module.exports = [
  'feat',
  'fix',
  'refactor',
  'perf',
  'style',
  'test',
  'build',
  'ops',
  'docs',
  'chore',
  'merge',
  'revert',
]

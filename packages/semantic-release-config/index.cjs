const pkgRoot = "packages/ui"

module.exports = {
  branches: ["main"],
  tagFormat: "@nswds/ui-v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { breaking: true, release: "major" },
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "revert", release: "patch" },
          { type: "docs", release: false },
          { type: "style", release: false },
          { type: "test", release: false },
          { type: "build", release: false },
          { type: "ops", release: false },
          { type: "chore", release: false },
          { type: "merge", release: false },
          { type: "refactor", release: false },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: `${pkgRoot}/CHANGELOG.md`,
      },
    ],
    [
      "@semantic-release/npm",
      {
        pkgRoot,
      },
    ],
    [
      // The npm plugin bumps packages/ui/package.json; regenerate the root
      // lockfile so the workspace version stays in sync (npm ci fails otherwise).
      "@semantic-release/exec",
      {
        prepareCmd: "npm install --package-lock-only",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: [
          `${pkgRoot}/CHANGELOG.md`,
          `${pkgRoot}/package.json`,
          "package-lock.json",
        ],
        message:
          "chore(release): @nswds/ui ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
}

const pkgRoot = 'packages/ui'

// Self-reference by package specifier rather than a relative path: plugin
// names are resolved from the repo root (semantic-release's cwd), not from
// this file. The package declares no `exports` map, so the subpath resolves
// through the workspace symlink in the root node_modules.
const releaseScope = '@workspace/semantic-release-config/release-scope.mjs'

// Requires the COLON the Conventional Commits footer specifies. This config
// passes no noteKeywords, so it runs on the preset's defaults — `BREAKING
// CHANGE` and `BREAKING-CHANGE` — with the bundled parser's default note regex,
// `^[\\s|*]*(KEYWORDS)[:\\s]+(.*)`. That `[:\\s]+` accepts a SPACE, so a body line
// such as "breaking change in the upstream API was avoided" or "breaking-change
// handling is unchanged" declared a breaking change and shipped a MAJOR. It
// already did that elsewhere in the fleet (engagement v2.0.0, nswds-email
// v3.0.0), and @nswds/ui publishes to npm, where a false major reaches
// consumers on their next upgrade.
//
// Only the pattern is supplied, so the preset's keyword list survives — which
// matters here: the fleet's hand-written list drops the spec's `BREAKING-CHANGE`
// synonym and this repo was the one place still honouring it. Verified: with
// this in place `BREAKING CHANGE:`, `BREAKING-CHANGE:` and `feat!:` still major,
// and all the prose shapes above resolve as the plain fix they are.
// See digitalnsw/nswds-devops#129.
const parserOpts = {
  notesPattern: (keywords) => new RegExp(`^[\\s|*]*(${keywords}):\\s+(.*)`, 'i'),
}

module.exports = {
  branches: ['main'],
  tagFormat: '@nswds/ui-v${version}',
  plugins: [
    [
      // Wraps BOTH @semantic-release/commit-analyzer and
      // @semantic-release/release-notes-generator, filtering each to the
      // commits that actually touched `pkgRoot`, so a dependency bump confined
      // to an unpublished workspace stops cutting an empty release (#119).
      //
      // Listed ONCE, deliberately: semantic-release runs every plugin that
      // defines a given step, so a second entry would emit the release notes
      // twice. One config object feeds both wrapped plugins — the analyzer
      // ignores keys it does not know, and vice versa.
      releaseScope,
      {
        paths: [`${pkgRoot}/`],
        preset: 'conventionalcommits',
        parserOpts,
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'revert', release: 'patch' },
          { type: 'docs', release: false },
          { type: 'style', release: false },
          { type: 'test', release: false },
          { type: 'build', release: false },
          { type: 'ops', release: false },
          { type: 'chore', release: false },
          { type: 'merge', release: false },
          { type: 'refactor', release: false },
        ],
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: `${pkgRoot}/CHANGELOG.md`,
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot,
      },
    ],
    [
      // The npm plugin bumps packages/ui/package.json; regenerate (1) the root
      // lockfile so the workspace version stays in sync (npm ci fails
      // otherwise) and (2) the registry JSON, whose items are stamped with
      // meta.nswdsVersion from package.json — without rebuilding here, every
      // PR branched after a release fails the registry freshness check on the
      // version line.
      '@semantic-release/exec',
      {
        prepareCmd: 'npm install --package-lock-only && npm run registry:build',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: [
          `${pkgRoot}/CHANGELOG.md`,
          `${pkgRoot}/package.json`,
          'package-lock.json',
          'apps/registry/public/r/**',
        ],
        message:
          'chore(release): @nswds/ui ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
}

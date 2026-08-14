# Release notes and changelog

Releases are cut by semantic-release on merge to `main`. The version comes from the
Conventional Commits subject lines in the release range, and the notes body is rendered by
`@semantic-release/release-notes-generator` using the `conventionalcommits` preset. Both run
wrapped by the path-scoped release gate
(`packages/semantic-release-config/release-scope.mjs`), which filters the commit list to
commits touching `packages/ui/` — so the version decision and the notes describe only
changes that actually shipped in the package (see [AGENTS.md](../AGENTS.md), "Which commits
can cut a release"). Everything is configured in [`release.config.cjs`](../release.config.cjs), which
extends `@workspace/semantic-release-config`.

The rendered body is published in two places, with identical content:

- the GitHub release for the `@nswds/ui-vX.Y.Z` tag
- [`packages/ui/CHANGELOG.md`](../packages/ui/CHANGELOG.md)

## Keeping notes working

The root `package.json` carries a direct devDependency pin:

```json
"conventional-changelog-conventionalcommits": "^9.3.1"
```

**Do not remove it, and do not let it move to a v10.** The preset's v10 render templates are
incompatible with `@semantic-release/release-notes-generator@14`: commit analysis still
computes the correct version, but `generateNotes` emits an empty body. It fails silently — no
job turns red, the release simply ships blank. That is what blanked 4.1.4 through 4.3.0 here
(since backfilled by hand, which is the only remedy once a release is published).

The pin has to be at the repo **root**, not in a workspace package. semantic-release runs from
the root, so the preset loader resolves the hoisted copy; a nested one never applies. v10 also
arrives transitively — `@commitlint/config-conventional` depends on it and keeps its own nested
copy, which is expected and does not affect note rendering.

To confirm the resolution is correct:

```bash
npm ls conventional-changelog-conventionalcommits
```

Expect v9 at the root, with v10 nested under `@commitlint/config-conventional`. If the root
copy is v10, notes are already broken and the next release will ship blank.

This is a fleet-wide policy, not a local workaround: all 16 `digitalnsw` semantic-release repos
carry the same pin, the shared Renovate preset in `digitalnsw/nswds-devops` blocks major
updates to the package, and a weekly canary there re-checks every repo's resolved version and
opens a tracking issue if one slips. The pin comes out when a `release-notes-generator`
compatible with the v10 preset ships, and all 16 move together.

## Releases with an intentionally empty body

Not every empty body is a fault. The preset renders only `feat`, `fix`, `perf` and `revert`.
Every other type in this repo's convention — `docs`, `style`, `refactor`, `test`, `build`,
`ops`, `chore`, `merge` (see [AGENTS.md](../AGENTS.md) §6) — renders nothing, so a release
built solely from them correctly shows a header and no body. A blank body is only a problem
when the range contains a `feat`, `fix`, `perf` or `revert`.

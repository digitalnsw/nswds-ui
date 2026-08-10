# Release notes and changelog

Releases are cut by semantic-release on merge to `main`. The version comes from the
Conventional Commits subject lines in the release range, and the notes body is rendered by
`@semantic-release/release-notes-generator` using the `conventionalcommits` preset. Both are
configured in [`release.config.cjs`](../release.config.cjs), which extends
`@workspace/semantic-release-config`.

The rendered body is published in two places, with identical content:

- the GitHub release for the `@nswds/ui-vX.Y.Z` tag
- [`packages/ui/CHANGELOG.md`](../packages/ui/CHANGELOG.md)

## Versions 4.1.4 to 4.3.0 have no release notes

The GitHub releases and changelog entries for **4.1.4, 4.1.5, 4.1.6, 4.2.0 and 4.3.0** contain
only their version header. The bodies are empty.

This is a rendering fault, not a statement about those releases — every one of them shipped
real changes, and 4.2.0 and 4.3.0 in particular added whole component sets. A published
release body cannot be regenerated, so these stay blank permanently. Releases from **4.4.0**
onward render normally.

To find out what changed across any part of that range, read the commits and the package
contents directly.

The releasable commits between two versions — take the subject line of each commit and keep
only the types the notes would have rendered:

```bash
gh api repos/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.3...@nswds/ui-v4.3.0 \
  --jq '.commits[].commit.message | split("\n")[0]' \
  | grep -E '^(feat|fix|perf|revert)'
```

Splitting on the subject matters: commit bodies carry `Co-authored-by` trailers and blank
lines, so filtering the raw message line by line returns noise rather than the change list.

What actually shipped in the package, which is the stronger evidence for an upgrade
assessment:

```bash
npm pack @nswds/ui@4.1.3 && npm pack @nswds/ui@4.3.0
```

Diff the two tarballs' file lists to see added or removed components, and compare
`dist/styles.css` rule sets to confirm whether style changes are additive.

## Keeping notes working

The root `package.json` carries a direct devDependency pin:

```json
"conventional-changelog-conventionalcommits": "^9.3.1"
```

**Do not remove it, and do not let it move to a v10.** The preset's v10 line is incompatible
with `@semantic-release/release-notes-generator@14`: commit analysis still computes the correct
version, but the notes body renders empty. That combination is what produced the 4.1.4–4.3.0
gap, and it fails silently — no job turns red, the release simply ships blank.

The pin has to be at the repo **root**, not in a workspace package. semantic-release runs from
the root, so the preset loader resolves the hoisted copy; a nested one never applies.
`@commitlint/config-conventional` depends on v10 and will keep its own nested copy, which is
expected and does not affect note rendering.

To confirm the resolution is correct:

```bash
npm ls conventional-changelog-conventionalcommits
```

Expect v9 at the root, with v10 nested under `@commitlint/config-conventional`.

Renovate is configured fleet-wide to block major updates to this package, so the pin should not
drift on its own. A weekly canary in `digitalnsw/nswds-devops` checks every repo's resolved
version and opens a tracking issue if one slips.

## Releases with an intentionally empty body

Not every empty body is a fault. The `conventionalcommits` preset hides `chore`, `docs`,
`style`, `refactor`, `test`, `build` and `ci` from the notes. A release built only from hidden
types renders a header and nothing else, which is correct. A blank body is only a problem when
the range contains a `feat`, `fix`, `perf` or `revert` commit.

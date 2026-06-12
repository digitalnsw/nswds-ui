# Copilot Cloud Agent Onboarding

## Repository overview

- Monorepo managed with **npm workspaces** + **Turborepo**.
- Main package: `packages/ui` (`@nswds/ui`) — published component library.
- Supporting apps:
  - `apps/storybook` for component development and browser-based tests.
  - `apps/registry` for generated shadcn registry artifacts in `apps/registry/public/r/`.
  - `apps/web` as a Next.js consumer app.

## Environment and setup

- Required toolchain (from root `package.json`): **Node >=20**, **npm >=11.5.1**.
- Install dependencies from repo root:
  - `npm ci`

## High-signal commands

- Workspace-wide:
  - `npm run lint`
  - `npm run typecheck`
- Package-specific:
  - `npm run build -w @nswds/ui`
  - `npm run check:drift -w @nswds/ui`
  - `npm run check:icons -w @nswds/ui`
  - `npm run check:package -w @nswds/ui`
  - `npm run registry:build -w @nswds/ui`
- Storybook tests (browser mode):
  - `npm run test -w @workspace/storybook`

## CI expectations to preserve

The PR workflow (`.github/workflows/pr-checks.yml`) enforces:

- lint + typecheck + Prettier check
- component drift check (`check:drift`)
- icon module parity check (`check:icons`)
- `@nswds/ui` build + package checks (`publint` + `attw`)
- consumer fixture check via `./scripts/test-consumer-fixture.sh`
- registry freshness (rebuilt output must already be committed)
- Storybook interaction + axe accessibility tests

When changing components or registry-linked files, expect to run both:

- `npm run registry:build -w @nswds/ui`
- then commit changes in `apps/registry/public/r/`

## Important repo conventions

- Formatting comes from shared Prettier config (`@workspace/prettier-config`):
  - `semi: false`
  - `singleQuote: true`
- Do **not** manually format/edit generated outputs unless required by generation flow:
  - `packages/ui/src/icons/` (generated)
  - `apps/registry/public/r/` (generated/committed)
- `packages/ui/src` enforces **relative internal imports** (no `@/*` or `@nswds/ui/*` self-imports in source).

## Branch and commit conventions

- Branch names are validated by regex in `scripts/branch-name-config.sh`.
  - Pattern supports: `{type}[/issue/{id}|/ticket/{id}]/{short-description}`
  - Allowed types include: `feature|bugfix|hotfix|release|docs|build|test|refactor|style|chore`
- Commit messages are linted by commitlint (`commitlint.config.mjs`) with conventional types:
  - `feat, fix, refactor, perf, style, test, build, ops, docs, chore, merge, revert`

## Errors encountered during onboarding (and workarounds)

1. README references `AGENTS.md`, but that file is not present at repository root.
   - Workaround: derive contributor/validation workflow from `README.md`, workspace `package.json` scripts, and `.github/workflows/pr-checks.yml`.
2. Initial Storybook test run failed because Playwright Chromium binary was missing:
   - Error included: `Executable doesn't exist ... chromium_headless_shell...`
   - Workaround:
     - `npm exec -w @workspace/storybook -- playwright install chromium --with-deps`
     - Re-run: `npm run test -w @workspace/storybook` (passed)

## Suggested agent workflow for changes

1. Start at repo root and run `npm ci`.
2. Make targeted changes in the relevant workspace.
3. Run at least `npm run lint`, `npm run typecheck`, and affected package checks.
4. If component/registry-related, run `npm run registry:build -w @nswds/ui` and commit generated registry output.
5. Run Storybook tests for UI-affecting changes (`npm run test -w @workspace/storybook`), installing Playwright first when needed.
6. Before finalizing, confirm no uncommitted generated drift (`git status -- apps/registry/public/r`).

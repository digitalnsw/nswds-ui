# NSWDS UI

[![npm version](https://img.shields.io/npm/v/%40nswds%2Fui)](https://www.npmjs.com/package/@nswds/ui)
[![PR Checks](https://github.com/digitalnsw/nswds-ui/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/digitalnsw/nswds-ui/actions/workflows/pr-checks.yml)
[![Release](https://github.com/digitalnsw/nswds-ui/actions/workflows/release.yml/badge.svg)](https://github.com/digitalnsw/nswds-ui/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A reusable design system for NSW Government digital products — the published `@nswds/ui` package
plus a shadcn component registry. This is the system's source monorepo, not an application.

## Using the components in your project

**npm package (compiled, versioned):**

```bash
npm install @nswds/ui @nswds/tokens
```

```tsx
import '@nswds/ui/styles.css'

import { Button, ButtonLink } from '@nswds/ui'
import { IconSearch } from '@nswds/ui/icons'

export function Toolbar() {
  return (
    <>
      <Button leadingVisual={IconSearch}>Search</Button>
      <ButtonLink href='/docs' variant='outline'>
        Documentation
      </ButtonLink>
    </>
  )
}
```

Icons are per-module and tree-shakable — your bundle contains only the icons you import.

**Registry (copy source into your repo):** see
[docs/installing-from-the-registry.md](docs/installing-from-the-registry.md) — configure the
`@nswds` namespace once, then `npx shadcn@latest add @nswds/button`. The token foundation
installs automatically via the `theme` registry item.
Registry: https://nswds-ui-registry.vercel.app

**Upgrading from 1.x:** see [docs/migrating-to-v2.md](docs/migrating-to-v2.md).

**Working out what changed between versions:** see
[docs/release-notes.md](docs/release-notes.md). Note that 4.1.4 through 4.3.0 have empty
release notes; that page explains how to reconstruct the changes for those versions.

## Developing the system

See [AGENTS.md](AGENTS.md) for architecture, conventions, how to add a component, and the
release pipeline. Storybook (`npm run dev -w @workspace/storybook`) is the component
workbench; every component ships with interaction and axe WCAG 2.1 AA tests that run in CI.

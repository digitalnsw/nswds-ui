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
Registry: https://ui.digital.nsw.gov.au/registry

**Upgrading from 1.x:** see [docs/migrating-to-v2.md](docs/migrating-to-v2.md).

## Documentation

Full documentation is in **[docs/](docs/README.md)**. The short version:

| I want to…                                      | Read                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| Get something working                           | [Build your first NSW page](docs/tutorial-build-your-first-page.md)  |
| Look up a component or its props                | [Component reference](docs/reference-components.md)                  |
| Look up a token, or fix dark mode               | [Design token reference](docs/reference-tokens.md)                   |
| Use my agency's colours                         | [Theme and re-brand](docs/howto-theme-and-rebrand.md)                |
| Copy the source instead of installing a package | [Installing from the registry](docs/installing-from-the-registry.md) |
| Understand why it's built this way              | [Architecture](docs/explanation-architecture.md)                     |

## Developing the system

See [AGENTS.md](AGENTS.md) for architecture, conventions, how to add a component, and the
release pipeline. Storybook (`npm run dev -w @workspace/storybook`) is the component
workbench; every component ships with interaction and axe WCAG 2.1 AA tests that run in CI.

For contributors specifically:

- [Add a component](docs/tutorial-add-a-component.md) — a walkthrough onto both channels
- [CI gates reference](docs/reference-ci-gates.md) — every merge check and what its failure means

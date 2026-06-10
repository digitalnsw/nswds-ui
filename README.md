# NSWDS UI

A reusable design system for NSW Government digital products — the published `@nswds/ui` package
plus a shadcn component registry. This is the system's source monorepo, not an application.

## Using the components in your project

- **Registry (copy source into your repo):** see
  [docs/installing-from-the-registry.md](docs/installing-from-the-registry.md) — configure the
  `@nswds` namespace once, then `npx shadcn@latest add @nswds/button`.
  Registry: https://ui.digital.nsw.gov.au/registry
- **npm package (compiled, versioned):** `npm install @nswds/ui @nswds/tokens`, then
  `import { Button } from "@nswds/ui"`.

Either way, the components depend on the `@nswds/tokens` design tokens — the install guide covers
wiring those up.

## Developing the system

See [AGENTS.md](AGENTS.md) for architecture, conventions, how to add a component, and the
release pipeline.

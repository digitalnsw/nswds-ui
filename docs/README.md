# NSWDS UI documentation

Documentation for [`@nswds/ui`](https://www.npmjs.com/package/@nswds/ui) — the NSW Government
design system — organised by what you're trying to do.

## Using the design system

**New here? Start with the tutorial.**

|                                                                 |                                                                                            |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Build your first NSW page](tutorial-build-your-first-page.md)  | **Tutorial** — install to a working, accessible NSW page in ten minutes                    |
| [Installing from the registry](installing-from-the-registry.md) | **How-to** — the copy-the-source channel, with the one-time `@nswds` namespace setup       |
| [Theme and re-brand](howto-theme-and-rebrand.md)                | **How-to** — colour variants, agency palettes, scoped overrides, call-site tweaks          |
| [Component reference](reference-components.md)                  | **Reference** — all 62 components, 12 blocks, the hook, and props for the NSW-original set |
| [Design token reference](reference-tokens.md)                   | **Reference** — the four token layers, every token, dark mode                              |
| [Migrating from 1.x to 2.0](migrating-to-v2.md)                 | **How-to** — the API-surface release                                                       |

## Understanding the system

|                                                                 |                                                                                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Why the system is built this way](explanation-architecture.md) | **Explanation** — two channels, headless-first, token layering, the cascade problem, and the trade-offs each one carries |

## Contributing to the system

|                                                 |                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Add a component](tutorial-add-a-component.md)  | **Tutorial** — a new component through every gate onto both channels                 |
| [CI gates reference](reference-ci-gates.md)     | **Reference** — every check, what it runs, what a failure means                      |
| [Release notes and changelog](release-notes.md) | **Reference** — how release notes are generated                                      |
| [AGENTS.md](../AGENTS.md)                       | The canonical contributor instructions — architecture, conventions, release pipeline |

## Elsewhere

- [Storybook](https://storybook.digital.nsw.gov.au) — every component with live controls
- [Registry](https://ui.digital.nsw.gov.au/registry) — the shadcn endpoint
- [`packages/ui/README.md`](../packages/ui/README.md) — the npm landing page
- [DESIGN.md](../DESIGN.md) · [PRODUCT.md](../PRODUCT.md) — design language and product framing
- [`archive/`](archive/) — superseded plans kept for their rationale, not as current guidance

---

These docs follow [Diátaxis](https://diataxis.fr/): **tutorials** teach, **how-to guides** solve a
specific problem, **reference** describes precisely, **explanation** gives background. If a page
feels like it's doing two of those jobs at once, that's worth raising as an issue.

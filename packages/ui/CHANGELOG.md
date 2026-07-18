## [4.1.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.0.0...@nswds/ui-v4.1.0) (2026-07-18)

### Features

* **ui:** add Masthead and SkipLink components ([#56](https://github.com/digitalnsw/nswds-ui/issues/56)) ([087100e](https://github.com/digitalnsw/nswds-ui/commit/087100ed9946c74b76683de33c1f542e6913bba1)), closes [#nav](https://github.com/digitalnsw/nswds-ui/issues/nav) [#content](https://github.com/digitalnsw/nswds-ui/issues/content)

## [4.0.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.5.5...@nswds/ui-v4.0.0) (2026-06-29)

### ⚠ BREAKING CHANGES

* **ui:** the DescriptionList component has been removed from the
public API. Consumers importing { DescriptionList } from '@nswds/ui' must
migrate off it.

* fix(ui): correct Drawer composition in consumer fixture

DrawerContent already renders its own DrawerPortal + DrawerOverlay, so
wrapping it in another portal double-portals. Compose DrawerContent
directly and exercise the standalone DrawerPortal/DrawerOverlay exports
in a separate, valid composition so the type contract still covers them.

### Features

* **ui:** add ten functional components with minimal NSW styling ([#47](https://github.com/digitalnsw/nswds-ui/issues/47)) ([d3d7b23](https://github.com/digitalnsw/nswds-ui/commit/d3d7b23ea07479d65550ecaf978206692f55863c))

## [3.5.5](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.5.4...@nswds/ui-v3.5.5) (2026-06-26)

### Bug Fixes

* **ui:** make @nswds/tokens a build-time devDependency and fix the README ([#46](https://github.com/digitalnsw/nswds-ui/issues/46)) ([e072bd0](https://github.com/digitalnsw/nswds-ui/commit/e072bd0415d90c40c3026499829b8adcf8225779))

## [3.5.4](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.5.3...@nswds/ui-v3.5.4) (2026-06-26)

### Bug Fixes

* **ui:** harden form-pattern accessibility (divider, duplicate ids, stories) ([#41](https://github.com/digitalnsw/nswds-ui/issues/41)) ([5fa9396](https://github.com/digitalnsw/nswds-ui/commit/5fa93965b6b46c98b2694dc938c1af33d8555fb1))

## [3.5.3](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.5.2...@nswds/ui-v3.5.3) (2026-06-26)

### Bug Fixes

* **ui:** honor prefers-reduced-motion on button/badge/input/link transitions ([#40](https://github.com/digitalnsw/nswds-ui/issues/40)) ([3cf59ce](https://github.com/digitalnsw/nswds-ui/commit/3cf59cebea62b4d4d53907da98f1aaaf01de7c3e))

## [3.5.2](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.5.1...@nswds/ui-v3.5.2) (2026-06-26)

### Bug Fixes

* **ui:** tighten Link href type, spinner role, and dedupe button warning ([#39](https://github.com/digitalnsw/nswds-ui/issues/39)) ([b125d42](https://github.com/digitalnsw/nswds-ui/commit/b125d42f92bce4966bc898d555a134f129d22b5a))

## [3.5.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.5.0...@nswds/ui-v3.5.1) (2026-06-26)

### Bug Fixes

* **ui:** meet WCAG AA contrast for input placeholders ([#38](https://github.com/digitalnsw/nswds-ui/issues/38)) ([8d7cb35](https://github.com/digitalnsw/nswds-ui/commit/8d7cb356b1ca1993c9adc8b7b1923c7286836d89)), closes [#888f92](https://github.com/digitalnsw/nswds-ui/issues/888f92)

## [3.5.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.4.0...@nswds/ui-v3.5.0) (2026-06-21)

### Features

* **ui:** ship form patterns as registry-only blocks ([#36](https://github.com/digitalnsw/nswds-ui/issues/36)) ([32b9944](https://github.com/digitalnsw/nswds-ui/commit/32b994468588f41fa9ab459fdae399a278182e72))

## [3.4.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.3.0...@nswds/ui-v3.4.0) (2026-06-20)

### Features

* **workflow:** validate PR titles with commitlint and harden commit-type sync ([#35](https://github.com/digitalnsw/nswds-ui/issues/35)) ([b1f4c41](https://github.com/digitalnsw/nswds-ui/commit/b1f4c41880db50a6493a8930f062b28f2aeac968)), closes [#34](https://github.com/digitalnsw/nswds-ui/issues/34)

## [3.3.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.2.0...@nswds/ui-v3.3.0) (2026-06-19)

### Features

* **workflow:** enhance release audit and integrate Snyk ([#33](https://github.com/digitalnsw/nswds-ui/issues/33)) ([648f58c](https://github.com/digitalnsw/nswds-ui/commit/648f58cef6ae59b060d004ff1115ab5f8326cdbc))

## [3.2.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.1.0...@nswds/ui-v3.2.0) (2026-06-16)

### Features

* **registry:** centralize configuration for registry location ([#32](https://github.com/digitalnsw/nswds-ui/issues/32)) ([a28327a](https://github.com/digitalnsw/nswds-ui/commit/a28327a454a6993e8b3ffa6a22c476189f35f183))

## [3.1.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v3.0.0...@nswds/ui-v3.1.0) (2026-06-15)

### Features

* **ui:** build Field on the Base UI Field primitive ([#30](https://github.com/digitalnsw/nswds-ui/issues/30)) ([1a1ac42](https://github.com/digitalnsw/nswds-ui/commit/1a1ac428a394aadc45bdc6a3ba7fe4bec82adb73))

## [3.0.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v2.2.0...@nswds/ui-v3.0.0) (2026-06-15)

### ⚠ BREAKING CHANGES

* **ui:** @nswds/ui now requires React 19. peerDependencies no
longer allow ^18.3 — consumers on React 18 must upgrade.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>

* build: regenerate registry output for ref-as-prop components

The registry items embed component source, so the ref-as-prop refactor
changed the committed JSON. Regenerated via `registry:build` to satisfy the
PR freshness check.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>

### Code Refactoring

* **ui:** forward refs as a prop and require React 19 ([#28](https://github.com/digitalnsw/nswds-ui/issues/28)) ([75273c3](https://github.com/digitalnsw/nswds-ui/commit/75273c32a6071bdf61a811afb8b7ca91fccce4fc))

## [2.2.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v2.1.1...@nswds/ui-v2.2.0) (2026-06-13)

### Features

* **ui:** improve button styling and update documentation ([#22](https://github.com/digitalnsw/nswds-ui/issues/22)) ([51791e9](https://github.com/digitalnsw/nswds-ui/commit/51791e9cf0ea33afd0ac4a950a1a5df13d562061))

## [2.1.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v2.1.0...@nswds/ui-v2.1.1) (2026-06-12)

### Bug Fixes

* **release:** disable npm provenance — unsupported for private repos ([#18](https://github.com/digitalnsw/nswds-ui/issues/18)) ([37e06e0](https://github.com/digitalnsw/nswds-ui/commit/37e06e0974b8cbc059eeaaf05d47dc7c0e06ce42)), closes [#3](https://github.com/digitalnsw/nswds-ui/issues/3)

## [2.1.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v2.0.0...@nswds/ui-v2.1.0) (2026-06-11)

### Features

* **ui:** quality maturity pass — consumer fixture, link-component tests, Input tokens, icon tooling ([#17](https://github.com/digitalnsw/nswds-ui/issues/17)) ([d4c90cd](https://github.com/digitalnsw/nswds-ui/commit/d4c90cdb0b11c8d9cf95ffda530a015d88cc334d))

## [2.0.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.8.0...@nswds/ui-v2.0.0) (2026-06-11)

### ⚠ BREAKING CHANGES

* **ui:** DescriptionList, DescriptionTerm, and DescriptionDetails
now resolve Tailwind class conflicts in favour of the consumer-supplied
className. Layouts that accidentally relied on overrides losing may
render differently.

* feat(ui): give Spinner an accessible name and predictable prop routing

- Spinner renders a sr-only label (default "Loading") inside the
  role="status" element, so it announces by default; pass label="" to
  suppress when surrounding content conveys the busy state.
- className now lands on the outer status span like every other spread
  prop; the new svgClassName targets the inner svg.
- Button sets aria-busy while loading and suppresses the spinner's
  redundant label.
* **ui:** Spinner's className prop now applies to the outer
role="status" span instead of the inner svg — use svgClassName for
svg-level overrides. Spinner announces "Loading" by default; pass
label="" to restore the previous silent behaviour.

* refactor(ui)!: move palette/theme tooling out of the public API

color-palette, colors, theme-palette, and the palette type definitions
were Storybook-docs tooling exported from the @nswds/ui barrel — they
put app-internal APIs under semver and dragged culori in as a runtime
dependency for every consumer. They now live in the private
@workspace/theme-tools package (consumed as TypeScript source by the
Storybook app); lib/utils.ts shrinks to cn(), and the unused truncate/
humaniseVariant helpers are dropped.
* **ui:** @nswds/ui no longer exports the colour-palette/theme
tooling (generateColorThemes, buildThemeVars, colorThemes, shades, …)
or the truncate/kebabCase/camelCase/humaniseVariant string helpers.
The package's public utils surface is cn() only. culori is no longer
installed transitively.

* refactor(ui)!: clean up the exports map

- Drop the './globals.css' alias — it pointed at the COMPILED stylesheet
  while a source file of the same name exists, which misled consumers.
  './styles.css' is the single CSS entry point.
- Drop './lib/*' — the only remaining lib module is utils, and cn() is
  exported from the package root.
- Add './package.json' for tooling.
- Sync tsconfig paths (ui, web, storybook docs/comments) and apps/web's
  shadcn utils alias with the new surface. Storybook keeps the
  '@nswds/ui/globals.css' specifier as a workspace-internal Vite alias to
  the SOURCE dev stylesheet.
* **ui:** '@nswds/ui/globals.css' and '@nswds/ui/lib/*' subpath
imports are removed. Import the compiled stylesheet from
'@nswds/ui/styles.css' and cn() from the package root ('@nswds/ui').

* refactor(ui)!: split Button/ButtonLink and BadgeButton/BadgeLink

The href-discriminated prop unions produced unreadable TS errors, typed
refs as bare HTMLElement, and Omit'ted Base UI's render prop — its
official composition escape hatch. Each component now has one rendering
path: Button/BadgeButton wrap the Base UI button primitive (render
exposed, HTMLButtonElement refs); ButtonLink/BadgeLink render through
Link, picking up LinkProvider framework links and carrying the
aria-disabled click-guard semantics. All prop types are exported.
* **ui:** Button and BadgeButton no longer accept href. Use
ButtonLink / BadgeLink for button- and badge-styled navigation. Button
refs are now typed HTMLButtonElement (previously HTMLElement).

* refactor(ui)!: split the icons monolith into per-icon modules

src/components/icons.tsx was the full Material Symbols set (≈3,900
icons, 2.8 MB) exported as ONE object — a shape no bundler can
tree-shake, so any consumer touching Icons.x bundled all of it, and the
registry's icons.json weighed 3 MB.

- scripts/generate-icons.mjs emits one module per icon under src/icons/
  with PascalCase named exports (committed like registry output;
  excluded from eslint/prettier).
- tsup builds icons without sourcemaps or rollup-dts; their formulaic
  declarations are written programmatically. npm package: 4.6 MB
  unpacked (was 8.3 MB), fully tree-shakable.
- New exports: '@nswds/ui/icons' (all, tree-shakable) and
  '@nswds/ui/icons/<name>' (single module). Icons are no longer
  re-exported from the package root.
- Registry 'icons' item is now a curated 19-icon subset used by the
  shipped components/patterns (16 KB, was 3 MB).
- All internal usages migrated to named imports; the Storybook gallery
  iterates the icons namespace.
* **ui:** the Icons object and IconName type are gone. Import
icons by name: Icons.arrow_forward → import { IconArrowForward } from
'@nswds/ui/icons'. The registry icons item now installs a curated
subset under icons/ instead of a single components/icons.tsx.

* docs(ui): add 1.x to 2.0 migration guide

### Code Refactoring

* **ui:** v2.0 — tree-shakable icons, split link components, lean public API ([#15](https://github.com/digitalnsw/nswds-ui/issues/15)) ([a139508](https://github.com/digitalnsw/nswds-ui/commit/a139508b4868b5a332428834559a673b4331ec94))

## [1.8.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.7.0...@nswds/ui-v1.8.0) (2026-06-11)

### Features

- **ui:** ship missing components, portable registry items, and package quality gates ([#14](https://github.com/digitalnsw/nswds-ui/issues/14)) ([6cf1d55](https://github.com/digitalnsw/nswds-ui/commit/6cf1d55aa546f828b49877172d5949d2d29bfb68)), closes [#3](https://github.com/digitalnsw/nswds-ui/issues/3)

## [1.7.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.6.1...@nswds/ui-v1.7.0) (2026-06-04)

### Features

- **web, docs, components:** enhance UX with Spinner integration, SEO improvements, and updated guides; fix button variant and font loading issues ([#9](https://github.com/digitalnsw/nswds-ui/issues/9)) ([8e16250](https://github.com/digitalnsw/nswds-ui/commit/8e162502a8adcde7cf9b0f2d225813be8f775fed))

## [1.6.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.6.0...@nswds/ui-v1.6.1) (2026-06-02)

### Bug Fixes

- **components:** address PR review on card, link and login-form story ([#8](https://github.com/digitalnsw/nswds-ui/issues/8)) ([8dc973a](https://github.com/digitalnsw/nswds-ui/commit/8dc973a90e7e76659d64a609d8c1421d6c97c95f))

## [1.6.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.5.0...@nswds/ui-v1.6.0) (2026-06-02)

### Features

- **components:** Update button and link components for improved styling and functionality ([#7](https://github.com/digitalnsw/nswds-ui/issues/7)) ([e7ebd12](https://github.com/digitalnsw/nswds-ui/commit/e7ebd12539688704defab6999f39b932a5a2e695))

## [1.5.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.4.0...@nswds/ui-v1.5.0) (2026-05-28)

### Features

- link variants, ExternalLink, form typography & a11y stories ([#6](https://github.com/digitalnsw/nswds-ui/issues/6)) ([61b03f3](https://github.com/digitalnsw/nswds-ui/commit/61b03f34e8f02b19f7640337cb41b4627d106edd))

## [1.4.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.3.0...@nswds/ui-v1.4.0) (2026-05-27)

### Features

- **button:** add semantic colors and refactor color variable names ([#5](https://github.com/digitalnsw/nswds-ui/issues/5)) ([b8565f2](https://github.com/digitalnsw/nswds-ui/commit/b8565f221b09695766142cf6b970f7e0acee655b))

## [1.3.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.2.0...@nswds/ui-v1.3.0) (2026-05-24)

### Features

- **storybook:** enhance UI components, theme customization, and accessibility; refactor code and configs; fix eslint and tsconfig issues ([#4](https://github.com/digitalnsw/nswds-ui/issues/4)) ([0f774ce](https://github.com/digitalnsw/nswds-ui/commit/0f774ce36169a1b3d623acded9740a8ed9064b9b))

## [1.2.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.1.0...@nswds/ui-v1.2.0) (2026-05-24)

### Features

- **storybook:** Enhance theme customization, improve accessibility, and streamline UI components ([#3](https://github.com/digitalnsw/nswds-ui/issues/3)) ([e62549c](https://github.com/digitalnsw/nswds-ui/commit/e62549c30fc5364ca83d9f24b8042ecbd806ca21))

## [1.1.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v1.0.0...@nswds/ui-v1.1.0) (2026-05-23)

### Features

- **vercel.json:** Add configuration for registry, storybook, web apps and fix UI dependency with style updates ([#2](https://github.com/digitalnsw/nswds-ui/issues/2)) ([ddd7943](https://github.com/digitalnsw/nswds-ui/commit/ddd79431ac74c506a1550c47863ee35e2b7f5713))

## 1.0.0 (2026-05-23)

### Features

- initial commit ([6d2610c](https://github.com/digitalnsw/nswds-ui/commit/6d2610cee01a35c353c8920a2e43358c3ec044ef))
- **workflows:** implement GitHub Actions for automated PR title and description generation ([#1](https://github.com/digitalnsw/nswds-ui/issues/1)) ([05ac99f](https://github.com/digitalnsw/nswds-ui/commit/05ac99f1bf947da9d67a73099e557f9b86a273b1))

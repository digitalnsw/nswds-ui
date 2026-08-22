## [5.1.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.1.0...@nswds/ui-v5.1.1) (2026-08-22)

### Bug Fixes

* **ui:** let every masthead and skip-link colour flip in dark mode ([#145](https://github.com/digitalnsw/nswds-ui/issues/145)) ([83e7071](https://github.com/digitalnsw/nswds-ui/commit/83e7071ef953c07979fa80d70dc9c628830438a6))

## [5.1.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.7...@nswds/ui-v5.1.0) (2026-08-21)

### Features

* **ui:** close ten navigation defects across the nav family ([#143](https://github.com/digitalnsw/nswds-ui/issues/143)) ([382d5fb](https://github.com/digitalnsw/nswds-ui/commit/382d5fb6b30351143eda0c4706b49774fc07b105)), closes [#named-rules-3](https://github.com/digitalnsw/nswds-ui/issues/named-rules-3) [#named-rules-4](https://github.com/digitalnsw/nswds-ui/issues/named-rules-4)

## [5.0.7](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.6...@nswds/ui-v5.0.7) (2026-08-20)

### Bug Fixes

* **ui:** add sign-in autocomplete and stop Toaster clobbering its props ([#137](https://github.com/digitalnsw/nswds-ui/issues/137)) ([09d524c](https://github.com/digitalnsw/nswds-ui/commit/09d524ca82da24451314594ad8ce3d80359d8f12))

## [5.0.6](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.5...@nswds/ui-v5.0.6) (2026-08-20)

### Bug Fixes

* **ui:** drop the invalid currentFill attribute from Spinner ([#136](https://github.com/digitalnsw/nswds-ui/issues/136)) ([7215a0e](https://github.com/digitalnsw/nswds-ui/commit/7215a0e05d6a4edcafc3ff90d48e49cd9cba2a16))

## [5.0.5](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.4...@nswds/ui-v5.0.5) (2026-08-20)

### Bug Fixes

* **ui:** bound generatePushMenuBreadcrumb by maxLength ([#135](https://github.com/digitalnsw/nswds-ui/issues/135)) ([150389c](https://github.com/digitalnsw/nswds-ui/commit/150389cb0f2c13f2f5969a82ed835e4f995c63f5))

## [5.0.4](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.3...@nswds/ui-v5.0.4) (2026-08-17)

### Bug Fixes

* **registry:** repair item resolution and update app favicons ([#130](https://github.com/digitalnsw/nswds-ui/issues/130)) ([d24ee04](https://github.com/digitalnsw/nswds-ui/commit/d24ee048d0e5e91acdeef7bfd97057b42eba5141))

## [5.0.3](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.2...@nswds/ui-v5.0.3) (2026-08-17)

### Bug Fixes

* **registry:** repair unresolvable items and serve from the public domain ([#128](https://github.com/digitalnsw/nswds-ui/issues/128)) ([3bf74aa](https://github.com/digitalnsw/nswds-ui/commit/3bf74aa28d4dd4f24244cf96e5a4cd33d3eccc36))

## [5.0.2](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.1...@nswds/ui-v5.0.2) (2026-08-14)

### Bug Fixes

* **button:** flip non-solid ink for dark mode ([#124](https://github.com/digitalnsw/nswds-ui/issues/124)) ([ba487d4](https://github.com/digitalnsw/nswds-ui/commit/ba487d44ad8e9592f8559955b75b604bdbfe1cd9))

## [5.0.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v5.0.0...@nswds/ui-v5.0.1) (2026-08-14)

### Bug Fixes

* **deps:** update dependency next to v16.3.1 ([#118](https://github.com/digitalnsw/nswds-ui/issues/118)) ([d568cae](https://github.com/digitalnsw/nswds-ui/commit/d568caedb5e9d578e5f0500a3dd75e0f4bcaf834))

## [5.0.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.7.2...@nswds/ui-v5.0.0) (2026-08-13)

### ⚠ BREAKING CHANGES

* **deps:** @nswds/tokens v5 raises the specificity of the semantic dark
block from (0,1,0) to (0,2,0), emitting it as
`:is([data-theme='dark'], .dark):is([data-theme='dark'], .dark)`. An override of
a dark role token written as a bare `[data-theme='dark'] { ... }` or
`.dark { ... }` no longer wins - match it with the same doubled `:is()`, or any
selector of specificity (0,2,0) or higher. Token values are unchanged; the only
change to the published stylesheet is this selector.

### Bug Fixes

* **deps:** update dependency @nswds/tokens to v5 ([#114](https://github.com/digitalnsw/nswds-ui/issues/114)) ([8c6f319](https://github.com/digitalnsw/nswds-ui/commit/8c6f31909f7043f99ccebd577549e9582b04c3c9))

## [4.7.2](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.7.1...@nswds/ui-v4.7.2) (2026-08-12)

### Bug Fixes

* **ui:** tell the user which flag is missing its path in check:cascade ([#110](https://github.com/digitalnsw/nswds-ui/issues/110)) ([bd9ca22](https://github.com/digitalnsw/nswds-ui/commit/bd9ca229115f6f900ee40805a4b192a77c4e224b))

## [4.7.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.7.0...@nswds/ui-v4.7.1) (2026-08-12)

### Bug Fixes

* **ui:** make component class strings survive a consumer's own Tailwind build ([#106](https://github.com/digitalnsw/nswds-ui/issues/106)) ([7391b36](https://github.com/digitalnsw/nswds-ui/commit/7391b36e55157f00b5bd8f265fa59e2ac8f087fa))

## [4.7.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.6.0...@nswds/ui-v4.7.0) (2026-08-12)

### Features

* **ui:** add HeaderBrand badgeProps and flatten the Badge type scale ([#104](https://github.com/digitalnsw/nswds-ui/issues/104)) ([5949aa2](https://github.com/digitalnsw/nswds-ui/commit/5949aa249a33c61a04631d229944b44fe961a77b))

## [4.6.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.5.0...@nswds/ui-v4.6.0) (2026-08-12)

### Features

* **ui:** accept an element in every icon slot so RSCs can pass icons ([#103](https://github.com/digitalnsw/nswds-ui/issues/103)) ([ab3514b](https://github.com/digitalnsw/nswds-ui/commit/ab3514bb209ac2d678893c7a8cfc8f714357e7d5))

## [4.5.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.4.2...@nswds/ui-v4.5.0) (2026-08-12)

### Features

* **ui:** give Button an iconOnly prop and derive every step's height from one token ([#107](https://github.com/digitalnsw/nswds-ui/issues/107)) ([ba4a171](https://github.com/digitalnsw/nswds-ui/commit/ba4a171f2c5cdc73a968fc1e80fa6b653809f69e))

## [4.4.2](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.4.1...@nswds/ui-v4.4.2) (2026-08-12)

### Bug Fixes

* **ui:** enlarge the header brand logo and ink the sitename brand blue ([#108](https://github.com/digitalnsw/nswds-ui/issues/108)) ([24b5d6f](https://github.com/digitalnsw/nswds-ui/commit/24b5d6f9c3b8bc5148aaa02d90bb08ead51e79ad)), closes [#105](https://github.com/digitalnsw/nswds-ui/issues/105)

## [4.4.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.4.0...@nswds/ui-v4.4.1) (2026-08-12)

### Bug Fixes

* **ui:** match the dark variant to the element carrying the marker ([#102](https://github.com/digitalnsw/nswds-ui/issues/102)) ([164745f](https://github.com/digitalnsw/nswds-ui/commit/164745fa72dfa88827f4c1ebb81176729fa22cb9))

## [4.4.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.3.0...@nswds/ui-v4.4.0) (2026-08-10)

### Features

* **ui:** add navigation suite — eight components and a mobile-nav block ([#91](https://github.com/digitalnsw/nswds-ui/issues/91)) ([1376ced](https://github.com/digitalnsw/nswds-ui/commit/1376ced824170a3dd0050c177fad65c60da14dc7))

## [4.3.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.2.0...@nswds/ui-v4.3.0) (2026-08-07)

### Features

* **ui:** add Header component ([#90](https://github.com/digitalnsw/nswds-ui/issues/90)) ([711a0a3](https://github.com/digitalnsw/nswds-ui/commit/711a0a3d4bc061aec78fa9362759c829ee33d89f))

## [4.2.0](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.6...@nswds/ui-v4.2.0) (2026-08-06)

### Features

* **ui:** add Footer component and eight footer blocks ([#88](https://github.com/digitalnsw/nswds-ui/issues/88)) ([700f63d](https://github.com/digitalnsw/nswds-ui/commit/700f63d1fb5cf3aa6d239f169c3bd422d9c792a6))

## [4.1.6](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.5...@nswds/ui-v4.1.6) (2026-08-04)

### Bug Fixes

* **deps:** update semantic-release monorepo (major) ([#77](https://github.com/digitalnsw/nswds-ui/issues/77)) ([7e949b9](https://github.com/digitalnsw/nswds-ui/commit/7e949b91107be35b489a731427fe1757008e89b6))

## [4.1.5](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.4...@nswds/ui-v4.1.5) (2026-08-04)

### Bug Fixes

* **deps:** update dependency @nswds/tokens to v4 ([#76](https://github.com/digitalnsw/nswds-ui/issues/76)) ([581a528](https://github.com/digitalnsw/nswds-ui/commit/581a528153c9ac621f28339abf174430ec72474c))

## [4.1.4](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.3...@nswds/ui-v4.1.4) (2026-08-04)

### Bug Fixes

* **deps:** update dependency prettier-plugin-tailwindcss to ^0.8.0 ([#71](https://github.com/digitalnsw/nswds-ui/issues/71)) ([03375f7](https://github.com/digitalnsw/nswds-ui/commit/03375f78e008909e01fc0448acf2bdf47c4839d8))

## [4.1.3](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.2...@nswds/ui-v4.1.3) (2026-08-04)

### Bug Fixes

* **deps:** update all non-major dependencies ([#70](https://github.com/digitalnsw/nswds-ui/issues/70)) ([1962134](https://github.com/digitalnsw/nswds-ui/commit/19621340e02dd57c59648719a7108c3d8d891ada))

## [4.1.2](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.1...@nswds/ui-v4.1.2) (2026-08-03)

### Bug Fixes

* **deps:** bump nanoid to 3.3.16 for CVE-2026-67214 ([a2877cc](https://github.com/digitalnsw/nswds-ui/commit/a2877cc79fffc763635704b6726befec7ebf6f2a))
* **security:** path-scope the nanoid ignores and correct the 5.1.16 rationale ([fc30925](https://github.com/digitalnsw/nswds-ui/commit/fc30925a1cd3c87d8f5cf89e06cc4d5885f56006))
* **security:** repair the corrupted apps/web Snyk policy and repo-qualify paths ([0cb7a71](https://github.com/digitalnsw/nswds-ui/commit/0cb7a71db5f815f44ac7d14e29f1e64ae8b6580b))

## [4.1.1](https://github.com/digitalnsw/nswds-ui/compare/@nswds/ui-v4.1.0...@nswds/ui-v4.1.1) (2026-07-29)

### Bug Fixes

* **lint:** fail the apps on warnings so the required lint gate can fail ([fb7bc1a](https://github.com/digitalnsw/nswds-ui/commit/fb7bc1a7daa685b6153d78e318196267426dfb12))

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

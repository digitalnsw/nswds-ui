# @nswds/ui 2.0 plan

> **Archived.** This is a historical design document, not current guidance — the package is
> long past 2.0. It is kept for the reasoning behind the v2 API split (per-icon exports, the
> `@workspace/theme-tools` extraction), which is still the reasoning the code follows.

> **Status: implemented.** All six items below landed on the `release/v2` branch (one commit
> per item, each with a `BREAKING CHANGE` footer). Consumer-facing changes are documented in
> [migrating-to-v2.md](migrating-to-v2.md); this file remains as the design rationale.

Breaking changes batched into a single major so consumers migrate once. Everything here is
**breaking for npm consumers**; registry consumers are unaffected unless noted (they own their
copies). Land each item as its own PR on a `release/v2` branch; release with a
`BREAKING CHANGE` footer per Conventional Commits.

## 1. Icons: split the 2.8 MB monolith into per-icon exports

**Problem.** `src/components/icons.tsx` is the full Material Symbols set (≈38k lines) exported
as ONE object. A single object cannot be tree-shaken — touching `Icons.login` bundles every
icon (~3 MB of `dist/components/icons.js`). The registry's `icons.json` is 3 MB and pastes a
2.8 MB file into consumer repos.

**Change.**

- Generate one module per icon under `src/icons/` with named PascalCase exports
  (`export function IconLogin(props) {…}`), plus `src/icons/index.ts` re-exporting all.
  tsup's `bundle: false` already emits per-file output and `sideEffects` is configured, so
  bundlers drop unused icons automatically.
- Add `"./icons"` and `"./icons/*"` to `exports`.
- Registry: replace the full-set `icons` item with a curated item containing only the icons the
  shipped components/patterns use (login, key, mail, open-in-new, …). Document "bring your own
  icon library" for the rest.
- Migration shim (optional, one minor before 2.0): keep `Icons` as a deprecated re-export of
  the curated subset only, with a console warning in dev.

**Migration:** `Icons.login` → `import { IconLogin } from '@nswds/ui/icons'`.

## 2. Remove docs-site tooling from the public API

**Problem.** `index.ts` exports `lib/color-palette.ts` (5.6k lines), `lib/colors.ts`,
`lib/theme-palette.ts`; `types/types.ts` ships Storybook-app prop interfaces
(`ViewToggleProps`, `ThemeSelectorProps`, …). This drags `culori` in as a runtime dependency
for every consumer and puts app-internal APIs under semver.

**Change.**

- Move `color-palette.ts`, `colors.ts`, `theme-palette.ts`, and the palette types to a private
  workspace package (`packages/theme-tools`, name `@workspace/theme-tools`).
- Repoint `apps/storybook/.storybook/preview.tsx` (imports `@nswds/ui/lib/theme-palette`) at
  the workspace package.
- Remove `culori` from `dependencies`.
- Trim `lib/utils.ts` to `cn()` (move `truncate`/`kebabCase`/`camelCase`/`humaniseVariant`
  into theme-tools or wherever they're actually used).

**Migration:** no public migration expected — verify with npm download stats / consumer survey
that nobody imports `theme-palette` before assuming.

## 3. Button polymorphism cleanup

**Problem.** `ButtonProps` is an undiscriminated union (`ButtonPrimitive.Props | LinkProps`)
branched on `'href' in props` — TS errors are unreadable, `ref` is typed `HTMLElement`, and
Base UI's `render` prop (the official composition escape hatch) is `Omit`ted. Same pattern in
`BadgeButton`.

**Change.** Split into `Button` (Base UI button, `ref: HTMLButtonElement`, `render` exposed)
and `ButtonLink` (wraps `Link`, anchor props). Keep `href` accepted on `Button` for one
deprecation minor with a dev warning, remove in 2.0. Mirror with `BadgeButton`/`BadgeLink`.
Export all prop types.

## 4. `DescriptionList` class-merge order

**Problem.** `cn(className, base)` — base classes win over consumer overrides with
tailwind-merge; every other component does `cn(base, className)`. Fixing changes rendered
output for consumers who (accidentally) relied on overrides losing, so it rides the major.

**Change.** Swap to `cn(base, className)` in `DescriptionList`, `DescriptionTerm`,
`DescriptionDetails`. Add a lint guard or review checklist item for argument order.

## 5. Spinner accessibility + prop routing

**Problem.** Default `role="status"` with no accessible name announces nothing; `className`
lands on the inner `<svg>` while every other prop spreads onto the outer `<span>`.

**Change.** Add `label?: string` defaulting to `"Loading"` rendered `sr-only` inside the
status element (pass `label=""` to suppress, e.g. when a parent Button provides context —
update Button's loading branch accordingly, and add `aria-busy` to Button while loading).
Route `className` to the outer span; add `svgClassName` if inner styling is still needed.

## 6. `exports` cleanup

- Remove `"./lib/*"` and `"./hooks/*"` subpaths (no stable public content once §2 lands —
  re-adding later is non-breaking; removing later is breaking).
- Keep exactly one CSS export name (`"./styles.css"`); drop the misleading `"./globals.css"`
  alias (it points at the _compiled_ stylesheet, not the source file of the same name).
- Add `"./package.json": "./package.json"`.

## Sequencing

1. Ship deprecation shims + warnings in a final 1.x minor (`Icons` subset warning, `Button
href` warning, doc callouts).
2. Branch `release/v2`, land §1–§6 as separate PRs, each with migration notes in the
   description.
3. Update `docs/` + Storybook welcome page with a 1.x → 2.0 migration table.
4. Release via the normal pipeline (`BREAKING CHANGE` footer → major). Verify with
   `npm run check:package` (publint + attw) and the pack smoke test before tagging.

## Out of scope for 2.0 (tracked separately)

- Form patterns (`login-form`, `sign-up-form`, `forgot-password-form`) as `registry:block`
  items — additive, can ship in any minor.
- Visual regression (Chromatic) — tooling, not API.
- Input token discipline (`--input-*` semantic layer) — can be done non-breakingly if the
  rendered colours stay identical per theme.

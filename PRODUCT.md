# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: any NSW Government digital team — and their delivery partners/vendors — building React products. The system is offered service-wide, not scoped to one agency. Situation: teams shipping citizen-facing or internal NSW Government services who need brand-correct, accessible UI without building and auditing it themselves.

Secondary: designers and engineers evaluating components via the Storybook catalogue and the docs site before adopting.

## Product Purpose

A reusable design system for NSW Government digital products: the published `@nswds/ui` npm package plus a shadcn-compatible component registry. It exists so consuming teams get consistent, accessible, NSW-branded interfaces from a single maintained source. Success is external adoption — projects outside this monorepo consuming the package or registry (at least eight consuming repos already receive its releases). The monorepo's apps (`apps/web`, `apps/storybook`, `apps/registry`) are development and preview surfaces, not end products.

## Positioning

An **independent rebuild** — not (yet) officially sanctioned as the NSW Design System's successor. It is a modern, headless-first React rebuild proving the approach against the legacy CSS-based `nsw-design-system`, aligned to the NSW masterbrand through `@nswds/tokens`. Its mechanism a neighbouring system could not truthfully copy: dual distribution (compiled npm package **and** copy-the-source shadcn registry) from one codebase, built on Base UI headless primitives with fully token-driven theming, released automatically with verified npm/registry lockstep.

## Operating Context

- Consumers use one of two channels: `npm install @nswds/ui` (compiled ESM, precompiled stylesheet, no Tailwind required) or `npx shadcn add <registry-url>/r/<item>.json` (copies editable source, installs `@nswds/tokens`).
- Documented registry location is `https://ui.digital.nsw.gov.au/registry` (proxied by the docs site); the registry's own origin is `https://nswds-ui-registry.vercel.app`.
- Releases are fully automated: Conventional Commits → semantic-release → npm via OIDC Trusted Publishing → registry deploy, with post-release verification. Manual publishing is prohibited.
- Consuming repos receive updates via Renovate, so every release fans out CI runs across the fleet — release hygiene (no empty releases) is a product concern, not just housekeeping.

## Capabilities and Constraints

- ~40 components, composed patterns (footers, auth forms, mobile nav), and ~3,900 generated Material Symbols-style icons; requires React 19, ESM-only.
- All interactive behaviour wraps `@base-ui/react` primitives — accessibility is inherited, never hand-rolled.
- Every visual property traces to a CSS custom-property token (four layers: NSW palette → masterbrand theme → shadcn semantic tokens → Tailwind bridges). Components reference semantic tokens only.
- Class strings must be cascade-safe (consumers run their own Tailwind build alongside the precompiled stylesheet); enforced by `check:cascade`.
- Terminology: **primitive** (wraps one Base UI element), **component** (self-contained composition), **pattern** (composed UI pattern, registry-only `registry:block`).
- Undecided product facts: official endorsement path/timeline; `ui.digital.nsw.gov.au` DNS is not yet live.

## Brand Commitments

- NSW Government masterbrand identity, expressed exclusively through `@nswds/tokens` (NSW blue `--nsw-blue-800`, waratah red `--nsw-red-600`, full named palette in oklch). Additional agency brand themes ship as token theme overrides, switched by a root class.
- The NSW Government logo ships as a component; brand-specific colouring uses NSW primitive token utilities (e.g. `fill-nsw-blue-800`).
- All published code lives under the `@nswds` npm scope. Name: "NSWDS UI".

## Evidence on Hand

- Published package `@nswds/ui` (v5.0.7 at time of writing) on npm; public CHANGELOG in `packages/ui/CHANGELOG.md`.
- Storybook catalogue with per-component default, features, and accessibility stories; Chromatic visual regression.
- At least eight external repos consuming releases (via Renovate fan-out).
- No testimonials, case studies, or usage metrics on hand — future surfaces must not fabricate them.

## Product Principles

1. **Consumability is the first test.** Every component, token, and API decision is judged by whether an external project can adopt it cleanly — on either distribution channel.
2. **Accessibility is inherited, not improvised.** Interactive behaviour comes from Base UI primitives; the system never hand-rolls ARIA, focus, or keyboard handling.
3. **Everything traces to a token.** No raw colours, no palette utilities in components — semantic tokens only, so themes and dark mode hold everywhere.
4. **Two channels, one truth.** npm and the registry ship from the same source and must never drift — guards and CI checks exist to keep that promise.
5. **Releases are boring and trustworthy.** Automated, verified, and never empty; consumers should never wonder whether a version is real.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor for every component (confirmed). Each component carries dedicated accessibility stories; behaviour-level conformance is delegated to Base UI primitives, with the system responsible for visible states (focus rings, contrast via tokens, target sizes) meeting AA.

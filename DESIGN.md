---
name: NSWDS UI
description: The NSW Government masterbrand translated into a headless, token-driven product UI system.
colors:
  nsw-blue-800: 'oklch(0.289999 0.117296 259.841938)'
  nsw-red-600: 'oklch(0.561955 0.217505 20.33356)'
  primary-200: 'oklch(0.926674 0.041663 227.890787)'
  surface-default: 'oklch(1 0 0)'
  background-subtle: 'oklch(0.970151 0 0)'
  text-default: 'oklch(0.175228 0.006346 236.981786)'
  text-muted: 'oklch(0.426427 0.011202 232.617199)'
  text-inverse: 'oklch(1 0 0)'
  border-default: 'oklch(0.901624 0.003538 219.535738)'
  border-strong: 'oklch(0.645222 0.009348 225.150438)'
  danger-solid: 'oklch(0.501996 0.192725 18.079135)'
typography:
  display:
    fontFamily: 'Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif'
    fontWeight: 800
  headline:
    fontFamily: 'Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif'
    fontWeight: 600
  body:
    fontFamily: 'Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: 'Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif'
    fontWeight: 500
  mono:
    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace'
rounded:
  none: '0px'
  sm: '4px'
  md: '8px'
  lg: '16px'
  pill: '9999px'
components:
  button-primary:
    backgroundColor: '{colors.nsw-blue-800}'
    textColor: '{colors.text-inverse}'
    rounded: '{rounded.sm}'
    height: '52px'
    padding: '11px 21px'
  button-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.nsw-blue-800}'
    rounded: '{rounded.sm}'
    height: '52px'
  input:
    backgroundColor: '{colors.surface-default}'
    textColor: '{colors.text-default}'
    rounded: '{rounded.sm}'
    height: '48px'
    padding: '8px 16px'
  card:
    backgroundColor: '{colors.surface-default}'
    textColor: '{colors.text-default}'
    rounded: '{rounded.md}'
    padding: '32px'
---

# Design System: NSWDS UI

## Overview

**Creative North Star: "The Civic Grid"**

The NSW Government masterbrand is a print identity built on hairlines, flat colour bands, and a 12×12 grid — structure _is_ the brand. NSWDS UI translates that identity into product interfaces: depth is drawn with hairlines rather than cast with shadows, colour arrives as flat token-traced fills rather than gradients, and every measurement lands on a 4px grid. The translation is deliberate, not apologetic — small radii (4–8px) and whisper-subtle elevation are the screen dialect of a flat print brand, chosen because screens need affordance cues that paper does not.

The component character is **refined and restrained**: optical borders that keep every variant's outer geometry identical, hover states derived mathematically from a single ink variable, focus rings that always land on the page rather than the control. The craft hides itself; what the citizen sees is a plain, trustworthy interface where controls look exactly like what they do. Dark mode is first-class, driven entirely by mode-aware role tokens — no component carries a hand-maintained dark palette.

This system must never read as **startup gloss** (gradient washes, glassmorphism, oversized radii, decorative shadows), as **bureaucratic austerity** (trustworthy must not mean joyless or dense), or as a **pixel-copy of the legacy CSS nsw-design-system** — it is a fresh translation of the masterbrand, not a port of the old site kit.

**Key Characteristics:**

- Flat-first surfaces, structured by hairlines and tone shifts, on a 4px spatial grid
- Every colour traces to a token; components speak only in semantic roles
- Public Sans throughout — the NSW Government brand typeface
- Generous, unhurried geometry: 44px+ touch floors, 48–52px controls
- Automatic, role-token-driven dark mode
- Accessibility inherited from Base UI primitives and enforced at WCAG 2.2 AA

## Colors

A corporate-restraint palette — NSW navy on white and cool grey, with the waratah red held in reserve as an accent — expressed canonically in OKLCH and named only by its token names.

### Primary

- **`nsw-blue-800`** (oklch(0.289999 0.117296 259.841938), the brand's #002664): the core NSW navy. It is the primary action colour (`--action-default`), the link colour, and the solid button fill in light mode. In dark mode the action role flips to the brightened `nsw-blue-500` ramp step and interactive _ink_ (non-solid button text, borders, links) flips to `primary-200` — components never restate this; the role tokens carry it.

### Secondary

- **`nsw-red-600`** (oklch(0.561955 0.217505 20.33356), the brand's #d7153a): the waratah red, exposed as the masterbrand `--accent-*` ramp. Secondary emphasis and supporting highlights only — it is deliberately scarce in product UI, and it is _not_ the error colour (that is `danger-solid`, a distinct ramp).

### Neutral

- **`surface-default`** (oklch(1 0 0)): the page canvas and control surface — pure white in light mode, flipping to near-black `nsw-grey-900` in dark.
- **`background-subtle`** (oklch(0.970151 0 0)): grouped or alternating sections, sunken wells, muted fills.
- **`text-default`** (oklch(0.175228 0.006346 236.981786)): body and heading ink — a cool near-black, not pure black.
- **`text-muted`** (oklch(0.426427 0.011202 232.617199)): supporting copy, captions, placeholders — the darkest step that still clears 4.5:1 on white.
- **`border-default`** (oklch(0.901624 0.003538 219.535738)): input borders, card hairlines, dividers.
- **`border-strong`** (oklch(0.645222 0.009348 225.150438)): focus rings and selected states.
- **`danger-solid`** (oklch(0.501996 0.192725 18.079135)): errors and destructive actions, with sibling `-surface`/`-border`/`-text` roles; `success` and `warning` ramps follow the same shape.

### Named Rules

**The Token Trace Rule.** Components reference semantic tokens only (`bg-primary`, `text-muted`, `border-default`) — never a Tailwind palette colour, never a hex literal. Every colour on screen must trace back through the four token layers to `@nswds/tokens`.

**The Role-Flip Rule.** Dark mode is the role tokens' job. Semantic roles flip automatically under `.dark`/`[data-theme=dark]`; palette steps are theme-invariant. A component needing a dark-specific value uses a bare `dark:` utility at single-class specificity (the established ink-on-dark is the `-200` ramp step), never a hand-maintained dark block.

**The Reserved Red Rule.** `nsw-red-600` is brand accent, not status. Errors use the `danger` ramp; the waratah red appears rarely, and its rarity is what keeps it meaningful.

## Typography

**Display Font:** Public Sans (with system and Arial fallbacks)
**Body Font:** Public Sans (same stack)
**Mono Font:** JetBrains Mono (code, tabular and technical content)

**Character:** The NSW Government brand typeface carried straight into product UI — open, legible, unornamented. One family does everything; hierarchy comes from weight and size, never from a second voice.

### Hierarchy

- **Display** (extrabold 800): hero and page-level headings (the prose scale's h1).
- **Headline** (semibold 600): section headings and strong emphasis.
- **Title** (medium 500, 1.5rem/24px): card titles and component-level headings.
- **Body** (regular 400, 1rem/16px, 1.625 line-height): all running copy. The token scale steps are named by their pixel size (`--font-size-12` … `--font-size-64`).
- **Label** (medium 500): form labels, navigation, subtle emphasis. Bold 700 is reserved for key figures and button labels; Light 300 is display-only, never at body sizes.

### Named Rules

**The One Label Rule.** Button labels are 16px/28px bold at every size step and every breakpoint — the steps change padding, never type. An icon beside a label is always 24px, matched to the text rather than the box.

## Layout

Everything lands on the Tailwind 4px spacing grid — padding, control heights, icon ladders (20/24/28/32px) are all multiples of 4. Controls are generous by default and densify slightly at the `sm:` (640px) breakpoint: buttons render 52/60/68px tall on small viewports and 44/52/60px from `sm:` up, so touch comes first and density is the desktop refinement. Touch targets are floored at 44×44px via an invisible expansion layer on coarse pointers. Cards use 32px internal padding (24px in the `sm` size); content rhythm inside them runs on 16px gaps. Responsive class pairs must be cascade-safe: always `max-lg:x lg:y`, never a bare utility fighting its own responsive override.

## Elevation & Depth

Flat-first, hairline-built. Depth in this system is _drawn_, not cast: containers separate from the page with a 1px ring of foreground at 10% opacity and with surface-role tone shifts (`surface-default` → `background-subtle` → `surface-raised`), not with shadow ramps. The only shadow in the system is a whisper — Tailwind's `shadow-sm` under solid and tinted button fills — and dark mode removes even that, replacing it with a faint `white/5` border. Popovers and dialogs are "raised" by role token, which in dark mode reads lighter rather than floating higher.

### Named Rules

**The Hairline Rule.** If a boundary is needed, draw it: `ring-1 ring-foreground/10` or `border-default`. Never reach for a drop shadow to do a hairline's job.

## Shapes

Crisp, small-radius geometry — the screen dialect of the masterbrand's square print panels. Controls (buttons, inputs) use gently eased corners (4px, `rounded-sm`); containers (cards, popovers) step up to 8px (`rounded-md`, the system's base `--radius`); 16px (`lg`) and pill exist in the scale for the few components that need them. Nothing is sharper than 0 or softer than a pill, and oversized "friendly" radii are off-brand. Buttons draw _optical_ borders: the border width is a variable (1px, or 2px for outline/surface variants) subtracted from the padding, so every variant occupies an identical outer box.

## Components

### Buttons

- **Character:** Sturdy geometry, restrained surface. Six variants (`solid`, `soft`, `surface`, `outline`, `ghost`, `link`) × nine colour tokens, all driven by two variables: `--btn-fill` (the solid block) and `--btn-bg` (the ink — text, borders, tints, overlays, focus ring).
- **Shape:** Gently eased corners (4px); 1px optical border (2px on `outline`/`surface`) subtracted from padding so all variants match geometry.
- **Primary (solid):** `nsw-blue-800` fill, white 16px bold label, 52px tall at `default` size on desktop (60px on touch viewports).
- **Hover / Focus:** Hover and active states are 10%/20% `color-mix` overlays of the ink — derived, never restated (solid flips to white/black overlays). Focus is a 2px ring in the ink colour, offset 2px so it lands on the page; buttons ring on _click_ too (`focus:`), while links and inputs ring only for keyboard (`focus-visible:`) — this asymmetry is deliberate feedback design.
- **Link variant:** sheds all button chrome and adopts the Link component's underline-and-halo treatment.

### Cards / Containers

- **Corner Style:** 8px (`rounded-md`), with first/last images bleeding to the corner radius.
- **Background:** `surface-default` (white; dark flips by role).
- **Shadow Strategy:** none — a 1px `foreground/10` hairline ring per The Hairline Rule.
- **Internal Padding:** 32px (`default`), 24px (`sm`); 16px vertical rhythm between regions.
- **Title:** 24px medium in the heading face.

### Inputs / Fields

- **Style:** 48px tall, white surface, 1px `border-default` stroke, 4px radius, 8px×16px padding.
- **Hover:** surface shifts to the sunken grey.
- **Focus:** 2px `border-strong` outline, offset 2px.
- **Error:** border thickens to 2px in `danger-border`, hover surface tints `danger-surface`, focus ring flips to `danger-solid`. Placeholder text uses `text-muted` (contrast-safe), never `text-subtle`.

### Links (signature component)

GOV.UK-lineage halo links: medium-weight text in the link ink (`primary-800` light / `primary-200` dark), always underlined at 4px offset. On hover the underline thickens to 2px and a 10% ink halo paints behind the text, extended 2px above and 4px below the line box by box-shadow — with `box-decoration-break: clone` so every wrapped line gets its own halo. Active deepens the halo to 18%. This halo is the system's most distinctive interactive signature; Button's `link` variant reproduces it exactly.

### Navigation

Masthead + header + main-nav compose the government page frame; navigation typography is the 500-weight label voice. Icon-only chrome actions use the flat 40×40 icon square.

**Three surfaces, one job each.** `MainNav` is the horizontal bar with mega panels (desktop). `SideNav` is the left rail for within-section wayfinding. `PushMenu` — usually via the `MobileNav` block, inside a left `Sheet` — is the drill-down drawer for small viewports. They are alternatives, not layers: a page picks the bar or the drawer at a given width, never both at once.

- **Character:** structure over decoration. The bar marks position with a 4px inset underline, the rail with a coloured segment of its own left hairline, the drawer with a left border plus a 10% ink tint. No shadows, no pills, no chips.
- **The handoff is the consumer's call, and it is explicit.** `MainNav` does not hide itself below a breakpoint — pass `className="hidden lg:block"` and render `MobileNav` beside it. The bar degrades safely if you forget (its item row is a horizontal scroll container), but scrolled-off nav items are close to undiscoverable, so treat that as a safety net rather than a mobile pattern.
- **Current location:** the exact match carries `aria-current="page"`; the ancestor that contains it carries the visual "you are here" mark. A mega-panel trigger is a button and cannot take `aria-current`, so it uses `data-current` for the underline while the announcement stays on the matching link inside the panel.
- **Hover / Focus:** halos and rings derive from one ink variable per surface, exactly as for buttons and links. Rings are 2px in the ink colour, offset 2px onto the page — **except inside a scroll container**, where they invert to `-outline-offset-2` because a scroll container clips anything drawn outside a child's border box.
- **Depth is capped by shape.** Mega panels are one level of flat links. The rail nests to any depth but collapses. The drawer drills without limit but is the only surface with a breadcrumb, and that breadcrumb is `aria-hidden` decoration — the heading and the live region carry the real announcement.

### Footers

The end-of-page `contentinfo` landmark: acknowledgement of Country, supporting links, ownership, social channels. One `Footer` component with thirteen surface colours, plus eight composed blocks that differ in what sits _above_ the standard rows — a site map, contact details, a subscription form, a call to action.

- **Character:** quiet and dense. The footer is the one region allowed to be information-rich, because people arrive there looking for something specific (privacy, contact, accessibility) rather than browsing. Type steps down to 14px; everything else stays on the system's rules.
- **One ink, everything derived.** `--footer-ink` is the surface's contrasting colour, and links, borders, halos, focus rings and button tokens all `color-mix` from it. A coloured footer never restates a colour — which is why `text-muted-foreground` and the `danger` ramp are both wrong inside one: they are theme-driven, not surface-driven, and wash out on a coloured surface.
- **Choosing a colour:** all thirteen clear WCAG 2.2 AA in light mode and AAA in dark. `primary-600` and `accent-600` are AA-only (4.57:1 and 5.18:1); prefer the `-800` steps for a service held to AAA.
- **The blocks are templates, not components.** They ship sample links and a sample department on purpose — a registry block is copied and edited, so it renders complete on arrival rather than crashing on missing props. Replace the samples; do not ship `#privacy`.
- **Acknowledgement of Country is default-on.** Seven of the eight blocks carry it. `FooterCompact` is the exception, and only because a one-line bar cannot present it respectfully — a service using that block owes the acknowledgement somewhere else on the page.

### Named Rules

**The Derived State Rule.** A component's hover, active, halo, and focus colours are `color-mix` derivatives of one ink variable — never independently chosen colours. Change the ink and every state follows.

**The Inherited Interaction Rule.** All interactive behaviour wraps a `@base-ui/react` primitive. No hand-rolled ARIA, focus traps, or keyboard handlers, ever.

**The 44px Floor Rule.** Every navigation row is at least 44px on a coarse pointer. `PushMenu` holds it with `min-h-11` at every width; `SideNav` holds it with `[@media(pointer:coarse)]:min-h-11` so a desktop rail can stay dense; `Button`-based chrome inherits its `TouchTarget` expansion layer. A nav row whose height is only the sum of its line box and padding has not been checked.

**The Wrap-Don't-Clip Rule.** Navigation labels wrap. Real government labels ("Births, deaths and marriages") run past 25 characters, which is roughly the budget in a drawer on a small phone, and a clipped label is unrecoverable on a touch device with no hover. Truncation is allowed only where the row genuinely cannot grow — a fixed-height header sharing space with controls — and there it must carry a `title` so the full string survives somewhere.

**The Empty-Is-Not-Broken Rule.** Empty navigation data renders a message, not a blank surface. Empty is a runtime state (unpublished content, permission filtering, a failed fetch), distinct from malformed data, which stays a dev-only console warning that compiles out in production. Every nav component takes an `emptyMessage` and defaults it; `null` opts out.

**The Escape-Pops-One Rule.** In a drill-down, Escape below the root level goes up one level; only Escape at the root dismisses the enclosing dialog. Inheriting plain dialog semantics costs a reader their position and the drawer in a single keypress, and the Back button is the only other route up.

**The Fixed-Mark Rule.** The NSW Government logo does not inherit. Its wordmark and waratah are painted from fixed palette values, so no ink chain reaches them, and the colourway must be chosen against the surface — never left to the caller. Getting it wrong is not subtle: `--primary-800` and `--nsw-blue-800` are the same value, so the full-colour mark on a `primary-800` footer sits at 1:1 contrast against its own background.

Follow the masterbrand's order of preference, which `footerLogoType` encodes. **Full colour** is preferred and is used on every light surface. **Full colour reversed** is the sanctioned alternative where the primary mark is illegible — the `-800` steps, where the white wordmark measures 13.6–15.1:1 and the waratah 2.6–2.9:1, so both halves read. **Mono is restricted use only and requires NSW Government Brand Team approval**, so it is a last resort, not a dark-surface default; only the `-600` steps reach it, where the waratah measures 1.00–1.59:1 against the surface (on `accent-600` it is the same value, `--accent-600` being `--nsw-red-600`). A design system cannot grant that approval, so reaching mono emits a dev-only warning naming it rather than applying it silently. If a service does not want the warning, the `-800` step of the same family takes the sanctioned reversed mark.

**The Same-Floor Rule.** Every link in a region gets the same touch floor, whether it is text or an icon. A footer's icon links route through `ButtonLink` and inherit its 44px expansion layer; its text links are 28px unless given the same layer, and a region where one kind of link is comfortably tappable and the other is not is worse than one where both are small — the reader cannot tell them apart by looking. Expand the hit area with `TouchTarget`, never by growing the box: growing it pushes a mobile site map ~300px taller and breaks alignment wherever a link sits beside an icon.

**The Report-The-Outcome Rule.** A form in a footer reports what happened. Pending disables the control, success confirms and clears the field, failure says so and _keeps_ what was typed. The live region announcing it must already be in the tree while empty — one mounted with its message is not reliably announced — and it stays polite: a failed newsletter signup is not worth interrupting the reader for.

## Do's and Don'ts

### Do:

- **Do** reference semantic tokens for every visual property — `bg-primary`, `text-muted-foreground`, `outline-(--input-ring)` — and let role tokens carry dark mode.
- **Do** keep geometry on the 4px grid: 4px control radii, 8px container radii, 44px+ touch floors, 48–52px controls.
- **Do** derive states: 10% hover / 20% active `color-mix` overlays of the ink, 2px offset focus rings in the ink colour.
- **Do** write cascade-safe responsive pairs (`max-lg:justify-center lg:justify-start`) and `motion-safe:` transitions on the token durations (150ms standard easing).
- **Do** hold WCAG 2.2 AA: 4.5:1 for text (the `text-muted`-not-`text-subtle` placeholder choice is the precedent), 3:1 for UI component contrast.

### Don't:

- **Don't** use gradients, glassmorphism, decorative shadow ramps, or oversized radii — the flat masterbrand and its hairline depth are the identity.
- **Don't** confuse restraint with austerity: generous padding, warm plain copy, and the halo signature keep the system humane.
- **Don't** imitate the legacy `nsw-design-system`'s rendered look; translate the masterbrand through this system's tokens instead.
- **Don't** use `nsw-red-600` for errors (that's the `danger` ramp) or spend it freely — the waratah red stays scarce.
- **Don't** hand-roll accessibility or restate dark-mode colours per component; Base UI primitives and role tokens own those.

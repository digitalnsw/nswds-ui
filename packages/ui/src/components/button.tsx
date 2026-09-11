'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import React from 'react'

import { ButtonGroupContext, type ButtonGroupContextValue } from '../lib/button-group-context.js'
import { cn } from '../lib/utils.js'

import { Link } from '../components/link.js'
import { Spinner } from '../components/spinner.js'

/**
 * One entry of `styles.tintInk`: the ink a colour token steps to when its
 * label sits on a tint of itself. Shared by `buttonVariants` and
 * `buttonColorVariants`, which both declare the `onTint` and `color` keys.
 */
type TintInkCompound = {
  onTint: true
  color: 'tertiary' | 'accent' | 'success' | 'warning'
  className: string
}

const styles = {
  base: [
    // Base
    // Transitioned properties are named, NOT `transition-all`. `all` includes
    // `outline-width` and `outline-offset`, and animating those out of the
    // initial `outline-style: none` state means the width never commits — the
    // focus ring below never painted, on every button in the system, leaving
    // keyboard users the browser default (WCAG 2.4.7). Isolated by bisection:
    // the focus utilities alone settle at 2px/-2px, adding `transition-all`
    // gives 1.5px/0px, and naming properties is fine. Nothing is lost by
    // naming them — no state in this file animates a transform or a size.
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-sm border text-base/7 font-bold motion-safe:transition-[color,background-color,border-color,box-shadow,opacity]',
    // Height floor, published per size step as `--btn-h` (see `styles.size`).
    // A floor rather than a fixed height so a wrapped label can still grow.
    'min-h-(--btn-h)',
    // Border width, so the size steps can subtract it from their padding and
    // keep the outer box identical across variants. `outline` and `surface`
    // draw a 2px border and raise this to match; everything else stays 1px.
    // Without it the steps subtracted a hard-coded 1px and those two variants
    // came out 2px taller than `solid` at every step and breakpoint.
    '[--btn-border-w:1px]',
    // Focus — deliberately `focus:` (paints on pointer clicks too), unlike
    // Link/Input which use `focus-visible:`. Buttons give click feedback with
    // the ring; links only ring for keyboard/AT focus. Do not "unify" this.
    // The ring is offset 2px, so it lands on the *page* rather than on the
    // button. `--btn-bg` is the ink (see the note above `styles.colors`), which
    // flips for dark mode, so the ring follows the theme for every variant —
    // including `solid`, whose ring used to be its own fill colour and so went
    // near-invisible on a dark surface.
    'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-(--btn-bg)',
    // Disabled
    'data-disabled:opacity-50 data-disabled:pointer-events-none',
    // State overlays, derived from the ink rather than restated per colour.
    // Deriving them means they follow `--btn-bg` wherever it comes from: the
    // colour token, its dark-mode counterpart, or a surface that re-points the
    // ink at its own (`[--btn-bg:var(--footer-ink)]` in footer.tsx and
    // footer-cta.tsx). `solid` overrides both with its white/black pair at
    // `data-[variant=solid]:` — an attribute selector, so it outranks these
    // regardless of source order. `oklab` matches the interpolation space
    // Tailwind's own `/10` alpha modifier emits, so the painted colour is
    // unchanged from when each colour restated these itself.
    '[--btn-hover-overlay:color-mix(in_oklab,var(--btn-bg)_10%,transparent)]',
    '[--btn-active-overlay:color-mix(in_oklab,var(--btn-bg)_20%,transparent)]',
    // Glyph size beside a label: one value for every step and breakpoint.
    // Every step sets `text-base/7`, so the label is 16px whatever the step —
    // only the padding changes. An icon next to it has to match the *text*,
    // not the box, so scaling it per step pairs a growing glyph with type that
    // never moves: at `lg` a 28px icon sat beside a 16px word, two and a half
    // times its cap height. 24px is 1.5x the label at every step, and the same
    // number `size='icon'` uses. `iconOnly` overrides this per step in
    // `compoundVariants` — with no label to match, it scales with its box.
    '[--btn-icon-size:--spacing(6)]',
    // Icon. No vertical margin: the glyph is `self-center` in a baseline-aligned
    // row, so margin buys it nothing optically and only inflates the flex line.
    // It was inert at `sm`/`default` (glyph + margin stayed inside the 1.75rem
    // line box) but pushed `lg` 2px past its own height below `sm:`, so a `lg`
    // button measured 70px with an icon and 68px without.
    '*:data-[slot=icon]:-mx-0.25 *:data-[slot=icon]:size-(--btn-icon-size) *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]',
  ],
  solid: [
    // Text color
    'text-(--btn-text)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--btn-border)',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--btn-fill)',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--btn-fill)',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // State overlays
    'hover:after:bg-(--btn-hover-overlay) active:after:bg-(--btn-active-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  soft: [
    // Text color
    'text-(--btn-bg)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--btn-bg)/10',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--btn-bg)/20',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--btn-bg)/10',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:bg-white/5',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // State overlays
    'hover:after:bg-(--btn-hover-overlay) active:after:bg-(--btn-active-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  surface: [
    // Text color
    'text-(--btn-bg)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-(--btn-bg)/50 border-2 bg-(--btn-bg)/5 [--btn-border-w:2px]',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--btn-bg)/30',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--btn-bg)/5',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-(--btn-bg)/50',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // Border color on hover
    'active:border-(--btn-bg) hover:border-(--btn-bg)',
    // State overlays
    'hover:after:bg-(--btn-hover-overlay) active:after:bg-(--btn-active-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    // Text color
    'border-(--btn-bg) text-(--btn-bg) border-2 [--btn-border-w:2px]',
    // Optical border, implemented as the button background to avoid corner artifacts
    'bg-transparent',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-transparent',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-(--btn-bg)',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // State overlays
    'hover:after:bg-(--btn-hover-overlay) active:after:bg-(--btn-active-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  ghost: [
    // Text color
    'text-(--btn-bg)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--btn-transparent)',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--btn-transparent)',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // State overlays
    'hover:after:bg-(--btn-hover-overlay) active:after:bg-(--btn-active-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  link: [
    // Text color — inherits from color token, no background or border
    'text-(--btn-bg) border-transparent bg-transparent',
    // Halo tokens derive from the colour token via color-mix, mirroring Link
    '[--link-halo:color-mix(in_oklch,var(--btn-bg)_10%,transparent)]',
    '[--link-halo-active:color-mix(in_oklch,var(--btn-bg)_18%,transparent)]',
    // Resting underline, thickened on interaction — matching Link
    'underline underline-offset-4 hover:decoration-2 active:decoration-2',
    // Hover / active halos match the GOV.UK-style halo on Link (see link.tsx
    // styledBase): the fill is painted on the `after` layer — consistent with
    // the other variants' hover overlays — and the box-shadow extends it 2px
    // above and 4px below the line box
    'after:absolute after:inset-0 after:-z-10',
    'hover:after:bg-(--link-halo) active:after:bg-(--link-halo-active)',
    'hover:shadow-[0_-2px_0_var(--link-halo),0_4px_0_var(--link-halo)]',
    'active:shadow-[0_-2px_0_var(--link-halo-active),0_4px_0_var(--link-halo-active)]',
  ],
  // Two variables, deliberately separate.
  //
  // `--btn-fill` is the block of colour `solid` paints behind `--btn-text`.
  // `--btn-bg` is the *ink*: the glyph and label on every non-solid variant
  // (`text-(--btn-bg)`), the border on `outline`/`surface`, the tint on
  // `soft`/`surface`, the `link` halos, the state overlays derived in
  // `styles.base`, and the focus ring. They start life the same colour, and
  // part company in two places: dark mode, and — for the four tokens in
  // `styles.tintInk` — on the token's own tint.
  //
  // They used to be one variable, which made the ink un-flippable. The values
  // here are masterbrand palette steps, and palette steps are theme-invariant —
  // `styles.css` re-declares only the *semantic* tokens under
  // `[data-theme=dark], .dark`. Design-system surfaces do flip, though
  // (`Header color='white'` is `bg-white dark:bg-grey-900`), so a non-solid
  // button kept its light-mode ink on a dark surface: `primary-800` on
  // `grey-900` measures 1.32:1, far under the 3:1 WCAG 1.4.11 asks of a UI
  // component, with the overlays and focus ring unpainted for the same reason.
  // Splitting the fill off means `--btn-bg` can flip on its own without
  // repainting `solid`, so the dark counterparts below need no variant scoping
  // and stay at single-class specificity — which is what keeps them overridable
  // by a surface that imposes its own ink (`[--btn-bg:var(--footer-ink)]` in
  // footer.tsx and footer-cta.tsx). Raising their specificity would silently
  // win against those, so keep any future dark value a bare `dark:` utility.
  //
  // `-200` is the package's established ink-on-dark (`--link-color`,
  // `--main-nav-panel-ink`) and clears 10:1 against every dark surface token.
  // `white` and `secondary` are already light inks, so they have no counterpart.
  //
  // Dark values use the raw NSW tokens for the tree-shaking reason spelled out
  // above `danger` below.
  colors: {
    grey: [
      // Base
      '[--btn-fill:var(--color-grey-600)] [--btn-bg:var(--color-grey-600)] [--btn-border:var(--color-grey-600)]/90 [--btn-text:white]',
      // Dark mode: ink
      'dark:[--btn-bg:var(--grey-200)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    white: [
      // No dark counterpart: white is already the maximum-contrast ink on any
      // dark surface. Surface-conditional in the same way as `secondary` — on a
      // light surface a non-solid `white` button is white on white. See the
      // note on the `color` prop.
      // Base
      '[--btn-fill:var(--color-white)] [--btn-bg:var(--color-white)] [--btn-border:var(--color-white)]/90 [--btn-text:var(--color-grey-800)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-black)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    primary: [
      // Base
      '[--btn-fill:var(--color-primary-800)] [--btn-bg:var(--color-primary-800)] [--btn-border:var(--color-primary-800)]/90 [--btn-text:white]',
      // Dark mode: ink
      'dark:[--btn-bg:var(--primary-200)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    secondary: [
      // No dark counterpart: `primary-200` already *is* the ink the other
      // colours flip to. Like `white`, this token is surface-conditional — it
      // is meant for dark surfaces, where it lands at 15.40:1. As a non-solid
      // ink on a light one it measures ~1.2:1, so that pairing is misuse
      // rather than a defect to fix here. See the note on the `color` prop.
      // Base
      '[--btn-fill:var(--color-primary-200)] [--btn-bg:var(--color-primary-200)] [--btn-border:var(--color-primary-200)]/90 [--btn-text:var(--color-primary-800)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/15',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-primary-800)]/10',
    ],
    tertiary: [
      // Base
      '[--btn-fill:var(--color-primary-600)] [--btn-bg:var(--color-primary-600)] [--btn-border:var(--color-primary-600)]/90 [--btn-text:white]',
      // Dark mode: ink
      'dark:[--btn-bg:var(--primary-200)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    accent: [
      // Base
      '[--btn-fill:var(--color-accent-600)] [--btn-bg:var(--color-accent-600)] [--btn-border:var(--color-accent-600)]/90 [--btn-text:white]',
      // Dark mode: ink
      'dark:[--btn-bg:var(--accent-200)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    // Semantic colours use the raw NSW token names (--danger-600, --success-600,
    // --warning-600) rather than Tailwind's `--color-*` bridge aliases. The
    // bridge aliases are tree-shaken by Tailwind v4 unless a matching utility
    // class is detected in scanned source, and arbitrary-property usages like
    // `[--btn-bg:var(--color-success-600)]` do NOT count as a usage signal.
    // The raw tokens are defined on :root by @nswds/tokens (a plain CSS import,
    // not a Tailwind theme), so they always resolve.
    danger: [
      // Base
      '[--btn-fill:var(--danger-600)] [--btn-bg:var(--danger-600)] [--btn-border:var(--danger-600)]/90 [--btn-text:white]',
      // Dark mode: ink
      'dark:[--btn-bg:var(--danger-200)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    success: [
      // Base
      '[--btn-fill:var(--success-600)] [--btn-bg:var(--success-600)] [--btn-border:var(--success-600)]/90 [--btn-text:white]',
      // Dark mode: ink
      'dark:[--btn-bg:var(--success-200)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    warning: [
      // Base
      '[--btn-fill:var(--warning-600)] [--btn-bg:var(--warning-600)] [--btn-border:var(--warning-600)]/90 [--btn-text:white]',
      // Dark mode: ink
      'dark:[--btn-bg:var(--warning-200)]',
      // State: Hover
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
  },
  // Ink on the tint.
  //
  // `soft` and `surface` paint the label in the ink over a tint of the same
  // ink, and for four tokens that pair cannot carry a label. Their inks are
  // `-600` steps that sit at 4.53–5.18:1 on pure white to begin with, so any
  // tint of themselves takes them under the 4.5:1 WCAG 1.4.3 asks of a 16px
  // bold label: on a 10% band, primary-600 measures 4.00:1, accent-600
  // 4.39:1, success-600 3.96:1 and warning-600 3.96:1, and a lone Button
  // lands lower still (3.49–3.76:1) because its `before` fill layer paints
  // the tint a second time inside the border. No lower tint rescues them —
  // at 3% three of the four still fail — so the tint stays and the ink steps
  // down to `-700`, which measures 7.0:1 or better on the band and 5.9:1 or
  // better on the doubled tint. Not `-800`: for tertiary that is primary's
  // own ink, and a soft tertiary would become a soft primary. Neither step
  // is the ramps' text step (that is `-800`), so the case rests on the
  // measurements, not on a ramp role. The other five tokens keep their ink;
  // their closest pair is danger-600 at 4.71:1.
  //
  // It is `--btn-bg` that steps, not the text colour alone: the tint, the
  // hover and active overlays and the focus ring all derive from it (the
  // Derived State Rule in DESIGN.md). Two things stay outside the step and
  // are known: the press overlay takes a lone soft tertiary to 4.40:1 and a
  // lone soft accent to 4.18:1 for the duration of the press (2.8:1 before),
  // and `outline`, `ghost` and `link` keep the `-600` ink, which clears
  // 4.5:1 on pure white only — on an off-white such as `background-subtle`
  // those three measure 4.15–4.19:1 for the same four tokens.
  //
  // Keyed on `onTint`, not on the variant: a segment of a soft or surface
  // ButtonGroup band sits on the band's tint with `ghost` as its own
  // variant, and it steps its own colour's ink there — a danger segment on a
  // tertiary band stays danger. `buttonVariants` derives `onTint` from the
  // variant for a lone Button; `resolveGroupDefaults` sets it for a segment.
  //
  // These are bare declarations at (0,1,0), so the colour's `dark:` ink at
  // (0,2,0) wins over them exactly as it wins over the light ink above —
  // dark mode is untouched, and its `-200` inks clear 5.8:1 on their tints.
  // The colour's own light ink is not fought in the cascade at all:
  // `buttonVariants` and `buttonColorVariants` merge their class strings
  // before returning them, so one `--btn-bg` declaration reaches the DOM,
  // and a surface that imposes its ink through `className` (footer.tsx) is
  // merged later still.
  //
  // Raw tokens rather than the `--color-*` bridges, for the tree-shaking
  // reason above `danger`: no utility in the package uses the primary,
  // accent, success or warning `-700` steps, so none of those four bridges
  // survives the build (grey-700 does, through step-indicator.tsx). A
  // runtime re-theme that writes only the bridges — Storybook's theme
  // picker — therefore leaves these inks at masterbrand, as it leaves the
  // `dark:` inks; a rebrand that redefines the raw tokens is unaffected.
  // The figures above are for the masterbrand colourway theme.css imports:
  // a colourway swap (AGENTS.md §3) must re-measure this table.
  tintInk: [
    { onTint: true, color: 'tertiary', className: '[--btn-bg:var(--primary-700)]' },
    { onTint: true, color: 'accent', className: '[--btn-bg:var(--accent-700)]' },
    { onTint: true, color: 'success', className: '[--btn-bg:var(--success-700)]' },
    { onTint: true, color: 'warning', className: '[--btn-bg:var(--warning-700)]' },
  ] satisfies TintInkCompound[],
  // Each step publishes its own height as `--btn-h`, built from the same two
  // numbers that produce its box: one line box (`text-base/7` — Tailwind's
  // `/7` is `--spacing(7)`, so this is the same token, not a matching literal)
  // plus twice the vertical padding. `styles.base` pins it with `min-h`, and
  // `styles.iconOnly` reads it as both dimensions of the square — so an
  // icon-only button is exactly as tall as the text button beside it by
  // construction, and stays that way if a step is ever retuned.
  //
  // The border cancels out of that sum: padding is `--spacing(n) -
  // --btn-border-w` and the border adds `--btn-border-w` back, so every
  // variant lands on `--btn-h` whether it draws a 1px or 2px edge, and the
  // outer geometry stays put while the label shifts 1px to make room.
  //
  // The steps set padding and height only. Glyph size lives on the base (one
  // value beside a label) and in `compoundVariants` (per step when icon-only).
  size: {
    default:
      'px-[calc(--spacing(6)-var(--btn-border-w))] py-[calc(--spacing(4)-var(--btn-border-w))] sm:px-[calc(--spacing(5.5)-var(--btn-border-w))] sm:py-[calc(--spacing(3)-var(--btn-border-w))] [--btn-h:calc(--spacing(7)+--spacing(4)*2)] sm:[--btn-h:calc(--spacing(7)+--spacing(3)*2)]',
    sm: 'px-[calc(--spacing(5)-var(--btn-border-w))] py-[calc(--spacing(3)-var(--btn-border-w))] sm:px-[calc(--spacing(4.5)-var(--btn-border-w))] sm:py-[calc(--spacing(2)-var(--btn-border-w))] [--btn-h:calc(--spacing(7)+--spacing(3)*2)] sm:[--btn-h:calc(--spacing(7)+--spacing(2)*2)]',
    lg: 'px-[calc(--spacing(7)-var(--btn-border-w))] py-[calc(--spacing(5)-var(--btn-border-w))] sm:px-[calc(--spacing(6.5)-var(--btn-border-w))] sm:py-[calc(--spacing(4)-var(--btn-border-w))] [--btn-h:calc(--spacing(7)+--spacing(5)*2)] sm:[--btn-h:calc(--spacing(7)+--spacing(4)*2)]',
    // A compact chrome square that deliberately sits below the text steps —
    // header actions, dialog close buttons, footer social links. For an icon
    // button that must line up with text buttons beside it, use `iconOnly`
    // with `sm`/`default`/`lg` instead. Its glyph is the base 24px.
    icon: 'w-10 h-10 flex-none [--btn-h:--spacing(10)]',
  },
  // Square the button at the current step and drop the horizontal padding, so
  // the scale step and "is this icon-only" are independent axes. The glyph
  // needs no adjustment — the step already sizes it off the ladder.
  iconOnly: 'size-(--btn-h) flex-none p-0 sm:p-0',
  // A segment: this button sits inside a ButtonGroup, which owns the boundary
  // (frame, band, dividers, the 4px corners) and clips to its own radius. The
  // button gives up the parts of its chrome the group now draws. Every rule is
  // keyed on `data-segment` — an attribute selector, (0,2,0) against the
  // variant's (0,1,0) and (0,3,0) against its `dark:` rules — so it wins on
  // specificity, never on emission order (see the two-build note in AGENTS.md
  // §4). InputGroupAction takes the same approach for the same reason.
  segment: [
    // Corners belong to the group. The fill and overlay layers are squared too
    // — left at `calc(var(--radius-sm)-1px)` they notch the shared edges.
    'data-[segment]:rounded-none data-[segment]:before:rounded-none data-[segment]:after:rounded-none data-[segment]:dark:after:rounded-none',
    // The dark-mode overlay grows 1px to cover the button's own border; inside
    // a group that 1px is the divider, and the hover tint must not paint over it.
    'data-[segment]:dark:after:inset-0',
    // No shadow: a `shadow-sm` whisper belongs under a button on the page, not
    // under one segment of a control.
    'data-[segment]:before:shadow-none',
    // A framed group (`outline`, `surface`) draws its frame as an inset ring
    // on the group, which paints beneath its children. A solid segment's own
    // background (the optical border, `bg-(--btn-border)`) would cover that
    // ring on the top and bottom edges, so on those bands backgrounds stop at
    // the padding box and the 1px transparent border lets the frame through.
    // The `before` fill layer is positioned inside the padding box already.
    // Only on framed bands: on `ghost` or `soft` nothing paints beneath that
    // pixel, and clipping there would leave a solid segment 1px short of the
    // group's edge on both sides.
    'data-[segment]:data-[band=outline]:bg-clip-padding data-[segment]:data-[band=surface]:bg-clip-padding',
    // The group clips its corners (`overflow-hidden`), which would clip a ring
    // sitting 2px outside the button, so the ring moves 2px inside instead —
    // the same inversion the nav rails use inside a scroll container.
    'data-[segment]:focus:-outline-offset-2',
    // Inside the segment, a ring in the ink on a solid fill is fill on fill:
    // in light mode `--btn-bg` and `--btn-fill` are the same token. So a solid
    // segment rings in its label colour, the pair InputGroupAction's solid
    // variant uses. (0,4,0) against the base ring's (0,2,0). A segment that
    // is not solid keeps the ink ring; on a solid band the rule below re-points
    // its ink to the label colour, so that ring is white there too.
    'data-[segment]:data-[variant=solid]:focus:outline-(--btn-text)',
    // On a solid band a segment that is not itself solid is painted on the
    // band, so its ink becomes the band's label colour: white label, white/10
    // hover, white ring, and a soft segment's tint becomes white/10 too. The
    // press overlay takes solid's own black/15 so a band and a lone solid
    // Button give the same feedback.
    //
    // The colour comes from `--group-label`, which the GROUP publishes from
    // its own `--btn-text` — resolved at the group, then inherited — so a
    // segment that names its own `color` cannot hijack it through its own
    // `--btn-text` (that would put a `secondary` segment's grey ink on a
    // primary band). And the rule is keyed on `data-band`, which the segment
    // is told by the group through context, never on DOM ancestry: a segment
    // rendered through a trigger's `render` prop, or wrapped in a span for a
    // tooltip, is re-inked like any other. (0,4,0) against the colour token's
    // (0,1,0) and its dark-mode ink at (0,2,0).
    'data-[segment]:not-data-[variant=solid]:data-[band=solid]:[--btn-bg:var(--group-label)]',
    'data-[segment]:not-data-[variant=solid]:data-[band=solid]:[--btn-active-overlay:var(--color-black)]/15',
    // ...and it loses its own tint there. `soft` is the only non-solid variant
    // that can reach this rule with a fill of its own (`surface` is not a
    // segment emphasis, `ghost` paints nothing), and it paints TWO 10% layers
    // — its element background and its `before` fill. Re-inked to the label
    // colour those become white on white, and white/10 twice over lifts the
    // band under the label just enough to break it: on the four bands whose
    // white label already sits near the floor the pair measures 3.37:1
    // (success), 3.39:1 (warning), 3.41:1 (tertiary) and 4.15:1 (accent),
    // against 4.53:1 to 5.18:1 for the same bands with the tint gone. So a
    // soft segment on a solid band reads as the ghost segments beside it do,
    // and its emphasis is carried by `data-variant` for the seam rules rather
    // than by a fill. Three attribute selectors, (0,3,0), so it beats both
    // soft's own bare `bg-(--btn-bg)/10` and its `dark:` pair on specificity
    // rather than on emission order (AGENTS.md §4).
    'data-[segment]:not-data-[variant=solid]:data-[band=solid]:bg-transparent',
    'data-[segment]:not-data-[variant=solid]:data-[band=solid]:before:bg-transparent',
  ],
}

const buttonCva = cva(styles.base, {
  variants: {
    variant: {
      solid: styles.solid,
      soft: styles.soft,
      surface: styles.surface,
      outline: styles.outline,
      ghost: styles.ghost,
      link: styles.link,
    },
    color: {
      white: styles.colors.white,
      grey: styles.colors.grey,
      primary: styles.colors.primary,
      secondary: styles.colors.secondary,
      tertiary: styles.colors.tertiary,
      accent: styles.colors.accent,
      danger: styles.colors.danger,
      success: styles.colors.success,
      warning: styles.colors.warning,
    },
    size: {
      default: styles.size.default,
      sm: styles.size.sm,
      lg: styles.size.lg,
      icon: styles.size.icon,
    },
    // Declared after `size` so its `p-0` reaches `cn()` downstream of the
    // step's `px-*`/`py-*` and wins the tailwind-merge conflict.
    iconOnly: {
      true: styles.iconOnly,
      false: '',
    },
    // Whether the label sits on a tint of its own ink: a lone `soft` or
    // `surface` Button, or any non-solid segment of a soft or surface
    // ButtonGroup band. `buttonVariants` derives it from the variant when a
    // caller leaves it unset; `resolveGroupDefaults` sets it for a segment.
    onTint: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // ── Ink on the tint ──────────────────────────────────────────────────
    //
    // See `styles.tintInk`. The colour's own `--btn-bg` is still in this
    // string; `buttonVariants` merges the two before returning.
    ...styles.tintInk,
    // ── Icon-only glyph sizes ────────────────────────────────────────────
    //
    // With no label beside it the glyph has nothing to match, so here — and
    // only here — it scales with its box, off the icon ladder: 20 / 24 / 28 /
    // 32 / 36 / 40px, i.e. `--spacing(5)` through `--spacing(10)`. Every level
    // is a multiple of 4, so glyphs share the grid with the padding and
    // heights around them and land on whole device pixels at 1x. A discrete
    // ladder rather than a proportion of the box, because a glyph is only
    // crisp at the sizes it was drawn for — "40% of the box" would ask for
    // sizes no glyph exists at.
    //
    // One value per step, not per breakpoint: the square never gets smaller
    // on a wider viewport, so neither should what sits inside it.
    { size: 'sm', iconOnly: true, className: '[--btn-icon-size:--spacing(5)]' },
    { size: 'default', iconOnly: true, className: '[--btn-icon-size:--spacing(6)]' },
    { size: 'lg', iconOnly: true, className: '[--btn-icon-size:--spacing(7)]' },
    // The link variant reads as an inline Link despite the <button> tag:
    // strip the button chrome (padding from `size`, border, radius, bold
    // weight) and adopt Link's typography and 1em icon sizing so the hover
    // halo hugs the text instead of filling a button-shaped box.
    {
      variant: 'link',
      className: [
        'rounded-none border-0 p-0 sm:p-0',
        // Release the step's height floor too — an inline link hugs its line
        // box, it does not stand a button's worth of space tall.
        'min-h-0',
        // Hug the label even in stretching grid/flex contexts so the hover
        // halo wraps the text like an inline Link, not the allocated box.
        // `block` still wins — its w-full is applied after this in cn().
        'w-fit',
        'text-[length:inherit] font-medium',
        '*:data-[slot=icon]:size-[1em]',
      ],
    },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'default',
    onTint: false,
  },
})

/** The props `buttonVariants` takes: the cva's own. */
type ButtonVariantProps = NonNullable<Parameters<typeof buttonCva>[0]>

/**
 * The variants that paint the label on a tint of its own ink. A lone Button
 * in one of these is on the tint; so is every non-solid segment of a
 * ButtonGroup band in one of these, whatever the segment's own variant.
 */
const TINT_VARIANTS: ReadonlySet<string | null | undefined> = new Set(['soft', 'surface'])

/**
 * Button's class string. A thin wrapper over the cva so that two things hold
 * for every caller, not only for `Button` itself: `onTint` defaults to
 * whether the variant is one that paints its label on a tint, so a caller
 * styling its own element with `buttonVariants({ variant: 'soft', … })` gets
 * the stepped ink without knowing about it; and the string is merged before
 * it is returned. The cva's output carries both the colour's own `--btn-bg`
 * and, on the tint, the stepped one from `styles.tintInk`. `cn` keeps the
 * later, so one declaration reaches the DOM and the pair is settled at the
 * class-string level, never by stylesheet order — the two-build hazard in
 * AGENTS.md §4 needs two rules in the cascade, and this leaves it one.
 */
function buttonVariants({ onTint, ...props }: ButtonVariantProps = {}) {
  return cn(buttonCva({ ...props, onTint: onTint ?? TINT_VARIANTS.has(props.variant) }))
}

const buttonColorCva = cva('', {
  variants: {
    color: styles.colors,
    // The band: a soft or surface group paints its tint from its own
    // `--btn-bg`, so it is on the tint the way its segments are.
    onTint: {
      true: '',
      false: '',
    },
  },
  compoundVariants: styles.tintInk,
  defaultVariants: { color: 'primary', onTint: false },
})

/**
 * Button's colour tokens on their own — the `--btn-fill` / `--btn-bg` /
 * `--btn-border` / `--btn-text` pair for each token, with the dark-mode ink
 * flip and, on the tint, the stepped ink those tints need (`styles.tintInk`).
 * ButtonGroup applies this to itself so the frame, band and dividers it draws
 * take the same ink its segments do, and a group's `color` means exactly what
 * a Button's does. Takes the group's `variant` and derives `onTint` from it
 * as `buttonVariants` does, and merges the string for the same reason.
 */
function buttonColorVariants({
  variant,
  onTint,
  ...props
}: NonNullable<Parameters<typeof buttonColorCva>[0]> & {
  variant?: ButtonVariantProps['variant']
} = {}) {
  return cn(buttonColorCva({ ...props, onTint: onTint ?? TINT_VARIANTS.has(variant) }))
}

/**
 * The child variants that carry their own fill into a group. `surface` is
 * not among them: its 2px ink/50 border would stay on the segment's free
 * edges inside the group's own 1px frame, and inside a band it would draw a
 * box on the fill. `soft` and `solid` have transparent borders, so they sit
 * flush.
 */
const EMPHASISED_SEGMENT_VARIANTS = new Set<ButtonOwnProps['variant']>(['solid', 'soft'])

/**
 * An icon slot. Takes either form:
 *
 * - the component itself — `leadingVisual={IconDownload}`
 * - a rendered element — `leadingVisual={<IconDownload />}`
 *
 * **From a React Server Component, use the element form.** `Button` and
 * `ButtonLink` are `'use client'` modules, while the icon modules carry no
 * directive — deliberately, so an icon stays server-renderable and ships no
 * JavaScript. That means in a server component `IconDownload` is an ordinary
 * function value, and functions cannot cross the RSC boundary into a client
 * component ("Functions cannot be passed directly to Client Components"). A
 * React element can, because it serialises. Client components can use either.
 */
type IconSlot = React.ElementType | React.ReactElement

/**
 * Renders an icon slot in whichever form it arrived, stamping `data-slot='icon'`
 * so the `*:data-[slot=icon]:…` rules above size and colour it. An element that
 * sets its own `data-slot` to an actual value keeps it — a consumer who named one
 * deliberately meant it. `undefined` and `null` count as unset and get the stamp,
 * because forwarding an optional prop that happens to be absent is idiomatic React
 * and must not silently strip the icon's sizing and colour.
 *
 * Passing only the key we intend to set is deliberate: `cloneElement` already seeds
 * its props from `slot.props`, so spreading them back into the config would be a
 * no-op — except that React 19 copies every config key across with no undefined-skip
 * (`defaultProps` having been removed), which is exactly how a forwarded
 * `data-slot={undefined}` would erase the stamp.
 */
function renderIconSlot(slot: IconSlot | undefined | null): React.ReactNode {
  if (!slot) return null
  if (React.isValidElement<{ 'data-slot'?: string }>(slot)) {
    return React.cloneElement(slot, { 'data-slot': slot.props['data-slot'] ?? 'icon' })
  }
  // `isValidElement` is a type guard, but its false branch does not subtract
  // ReactElement from the union — TS keeps both members — so name the remaining
  // case explicitly. Anything that is not a valid element is a component type.
  const Icon = slot as React.ElementType
  return <Icon data-slot='icon' />
}

/** Visual/content props shared by `Button` and `ButtonLink`. */
type ButtonOwnProps = Omit<
  VariantProps<typeof buttonVariants>,
  'size' | 'iconOnly' | 'color' | 'onTint'
> & {
  /**
   * Colour token. Most are safe on any surface: the non-solid variants take
   * their ink from the token and it flips for dark mode, so `primary` reads
   * correctly on a light page and on a dark one.
   *
   * `white` and `secondary` are the exceptions — both are
   * **surface-conditional, for dark surfaces only**. Their inks (`white` and
   * `primary-200`) are already light, which is what makes them right on a
   * dark surface and unusable on a light one: a non-solid button in either
   * colour measures around 1.2:1 on white, against the 3:1 WCAG 1.4.11 asks
   * of a UI component. Reach for them the way `Hero` does — over a
   * `primary-800` panel — and use `primary` on a light or theme-flipping
   * surface. `solid` is unaffected either way, since it pairs `--btn-fill`
   * with `--btn-text` rather than painting the ink.
   *
   * On a tint — `soft`, `surface`, or any non-solid segment of a soft or
   * surface ButtonGroup — `tertiary`, `accent`, `success` and `warning` step
   * to their `-700` ink so the label clears 4.5:1; see `styles.tintInk`.
   */
  color?:
    | 'white'
    | 'grey'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'accent'
    | 'danger'
    | 'success'
    | 'warning'
    | null
  /**
   * Scale step. `sm` / `default` / `lg` render 52 / 60 / 68px tall below
   * `sm:` and 44 / 52 / 60px at or above it. The step changes padding only —
   * the label is 16px and an icon beside it 24px at every step.
   *
   * `icon` is not a fourth step on that ramp — it is a flat 40×40 chrome
   * square (header actions, dialog close buttons, footer social links) that
   * lines up with none of them. For an icon-only button that must sit level
   * with text buttons beside it, pair `iconOnly` with `sm`/`default`/`lg`.
   * Inside a ButtonGroup `icon` renders exactly that way, as `iconOnly` at
   * the group's own step: the group clips to its own box, so the square's
   * 44px touch expansion would be cut off.
   */
  size?: 'sm' | 'default' | 'lg' | 'icon' | null
  /**
   * Render as a square containing only the icon, at the height of the current
   * `size` step — so `iconOnly` beside a `size='default'` button matches it
   * exactly. Supply an `aria-label`, since there is no visible text.
   *
   * With no label to match, the glyph scales with the square instead of
   * holding the 24px used beside text: 20px at `sm`, 24px at `default`, 28px
   * at `lg`, the same at every breakpoint. For a denser icon button that does
   * not line up with the text steps, use `size='icon'` (24px in a 40×40 box).
   */
  iconOnly?: boolean | null
  className?: string
  /** Button label. Optional for icon-only buttons (supply an `aria-label`). */
  children?: React.ReactNode
  /** Stretch button to fill its container width. */
  block?: boolean
  /** Show a spinner and disable interaction. */
  loading?: boolean
  /** Horizontal alignment of button content. */
  alignContent?: 'center' | 'start'
  disabled?: boolean
  /** Icon rendered before the label. Component or element — see `IconSlot`. */
  leadingVisual?: IconSlot
  /** Icon rendered after the label. Component or element — see `IconSlot`. */
  trailingVisual?: IconSlot
  /** Icon rendered as a trailing action (far end). Component or element. */
  trailingAction?: IconSlot
  /** Allow the button label to wrap onto multiple lines. Defaults to true. */
  labelWrap?: boolean
  /** Optional numeric badge rendered after the label. */
  count?: number
  /**
   * Visually-hidden suffix announced after `count`, giving the bare number
   * context for screen readers (e.g. "unread messages" → "Inbox 3 unread
   * messages").
   */
  countLabel?: string
}

type ButtonProps = ButtonOwnProps & Omit<ButtonPrimitive.Props, 'className' | 'disabled'>

type ButtonLinkProps = ButtonOwnProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className' | 'variant'> & {
    ref?: React.Ref<HTMLAnchorElement>
  }

function buttonClasses({
  variant,
  color,
  size,
  iconOnly,
  block,
  alignContent,
  className,
  effectiveDisabled,
  segment,
  onTint,
}: ButtonOwnProps & { effectiveDisabled?: boolean; segment?: SegmentKind; onTint?: boolean }) {
  return clsx(
    cn(
      buttonVariants({ variant, color, size, iconOnly, onTint }),
      segment && styles.segment,
      block && 'w-full',
      alignContent === 'start' && 'justify-start',
      className,
    ),
    effectiveDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
  )
}

/**
 * How a Button relates to the ButtonGroup around it, emitted as
 * `data-segment` for the segment styles to key on: `default` when it took
 * its variant from the group, `override` when it named its own emphasis.
 * Absent outside a group.
 */
type SegmentKind = 'default' | 'override'

/** The context, with `color` and `size` narrowed to Button's own unions. */
type GroupDefaults = ButtonGroupContextValue<
  NonNullable<ButtonOwnProps['color']>,
  NonNullable<ButtonOwnProps['size']>
>

/**
 * Resolves the variant, colour and size a Button renders with, from its own
 * props first and the enclosing ButtonGroup second.
 *
 * Outside a group the variant is resolved here rather than left to cva's
 * `defaultVariants` so that `data-variant` is always present in the DOM. cva
 * resolves its own default internally and emits the right classes either
 * way, but the attribute was simply absent — so the `data-[variant=solid]:`
 * state-overlay rules in `styles.colors` never matched a default `<Button>`.
 * It fell through to the derived overlay in `styles.base` and painted
 * `--btn-bg` at 10% over its own fill, which is the same colour: no visible
 * hover at all.
 *
 * Inside a group the group's `color` and `size` become the defaults, and a
 * segment renders as `ghost` whatever the group's variant, because the group
 * paints the frame or band and the segment only paints its label and its
 * hover overlay on top — so a child written as `variant='outline'` inside an
 * outline group (the shadcn idiom, and the previous stories) draws no second
 * border, and `link` gets button chrome like any other segment. A child that
 * asks for emphasis keeps it: `solid` and `soft` paint their own fill, which
 * is how a Save stays solid inside an outline group.
 */
function resolveGroupDefaults(
  group: GroupDefaults | null,
  {
    variant,
    color,
    size,
    iconOnly,
  }: Pick<ButtonOwnProps, 'variant' | 'color' | 'size' | 'iconOnly'>,
) {
  if (!group) {
    return {
      variant: variant ?? 'solid',
      color,
      size,
      iconOnly,
      segment: undefined,
      band: undefined,
      onTint: undefined,
    }
  }
  const emphasised = EMPHASISED_SEGMENT_VARIANTS.has(variant)
  const resolvedSize = size ?? group.size
  // `icon` is the 40px chrome square, which the group cannot hold: it clips to
  // its own box, so the 44px touch expansion the square relies on would be cut
  // off. Inside a group it becomes an icon-only segment at the GROUP's step
  // instead, which is the only step that lines up with the segments beside it.
  //
  // Not a literal `sm`: `styles.iconOnly` sets `size-(--btn-h)`, a definite
  // cross size, so `items-stretch` on the group cannot stretch it back. A
  // square pinned to `sm` inside a `default` group is 8px short (16px at
  // `lg`), sitting flush to the top of the row with a void beneath it and a
  // divider that stops before the group's bottom edge. Applies whether the
  // segment named `icon` itself or inherited it from an untyped group, which
  // is also why the group's own step is read back through the same guard.
  const iconStep = resolvedSize === 'icon'
  const groupStep = group.size === 'icon' ? undefined : group.size
  const resolved = emphasised ? variant : 'ghost'
  return {
    variant: resolved,
    color: color ?? group.color,
    size: iconStep ? (groupStep ?? 'default') : resolvedSize,
    // `??`, not `||`: an explicit `iconOnly={false}` is the author saying
    // "not a square", and the `icon` coercion must not overrule it. Only an
    // unstated `iconOnly` falls through to the coercion.
    iconOnly: iconOnly ?? iconStep,
    segment: emphasised ? ('override' as const) : ('default' as const),
    band: group.band,
    // On a soft or surface band every segment that is not solid sits on the
    // band's tint whatever its own variant, so its ink steps as a lone soft
    // Button's does (`styles.tintInk`) — its own colour's ink, not the
    // band's: the group's colour is a default, never an override, so a
    // danger segment on a tertiary band stays danger. The band is the group's
    // own variant, which is what `band` carries.
    onTint: resolved !== 'solid' && TINT_VARIANTS.has(group.band),
  }
}

/**
 * `resolveGroupDefaults` against the enclosing ButtonGroup, if any. The
 * context types `band`, `color` and `size` as strings so its module can ship
 * with every popup (see button-group-context.tsx); only ButtonGroup provides
 * it, from props typed with Button's own unions, so the narrowing here is
 * sound.
 */
function useSegmentDefaults(
  props: Pick<ButtonOwnProps, 'variant' | 'color' | 'size' | 'iconOnly'>,
) {
  const group = React.useContext(ButtonGroupContext) as GroupDefaults | null
  const resolved = resolveGroupDefaults(group, props)
  warnIfIconStepInGroup(group, props.size ?? group?.size)
  return resolved
}

/** Shared inner layout: spinner, visuals, label, count, touch target. */
function ButtonContent({
  loading,
  leadingVisual,
  trailingVisual,
  trailingAction,
  labelWrap,
  count,
  countLabel,
  children,
}: Pick<
  ButtonOwnProps,
  | 'loading'
  | 'leadingVisual'
  | 'trailingVisual'
  | 'trailingAction'
  | 'labelWrap'
  | 'count'
  | 'countLabel'
  | 'children'
>) {
  return (
    <TouchTarget>
      {loading && (
        <Spinner
          data-slot='icon'
          role={undefined}
          aria-hidden
          color='current'
          // The button's own label + aria-busy convey the busy state; the
          // spinner's default "Loading" announcement would be redundant.
          label=''
          // `block` overrides Spinner's default `inline` so the svg isn't
          // pushed below centre by the button's line-height; `size-full` fills
          // the icon-sized, self-centred wrapper span.
          svgClassName='block size-full'
        />
      )}
      {renderIconSlot(leadingVisual)}
      {labelWrap === false ? <span className='whitespace-nowrap'>{children}</span> : children}
      {count !== undefined && (
        <span className='rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums opacity-75'>
          {count}
          {countLabel ? <span className='sr-only'> {countLabel}</span> : null}
        </span>
      )}
      {renderIconSlot(trailingVisual)}
      {renderIconSlot(trailingAction)}
    </TouchTarget>
  )
}

/**
 * Whether a child tree carries visible text: a non-empty string or a number,
 * at the top level, in an array, or inside a Fragment however deep. Other
 * elements are not looked into — `Children.toArray` flattens arrays but hands
 * a Fragment back whole, so the Fragment case is walked by hand.
 */
function hasTextChild(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (typeof child === 'string') return child.trim() !== ''
    if (typeof child === 'number') return true
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    ) {
      return hasTextChild(child.props.children)
    }
    return false
  })
}

/**
 * Dev-only guard shared by `Button` and `ButtonLink`: an icon-only button
 * (`size="icon"` or `iconOnly`) renders no visible text, so it must carry an
 * explicit accessible name. Warns in development when one is missing; a no-op
 * in production. A falsy `aria-label` (including `""`) counts as missing.
 *
 * A text child counts as a label. `size="icon"` is also the square a
 * `PaginationLink` page number sits in, and a bare "2" is a visible, readable
 * name — axe accepts it and so does this guard. Only a string or a number
 * qualifies, at the top level or directly inside a fragment or array; an
 * element child is most likely the icon itself, which is the case the guard
 * exists for.
 */
function warnIfIconButtonUnlabelled(
  size: ButtonOwnProps['size'],
  iconOnly: ButtonOwnProps['iconOnly'],
  props: { 'aria-label'?: unknown; 'aria-labelledby'?: unknown },
  children: React.ReactNode,
) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  if (
    (size === 'icon' || iconOnly) &&
    !props['aria-label'] &&
    !props['aria-labelledby'] &&
    !hasTextChild(children)
  ) {
    console.warn(
      '[nswds/ui] Icon-only buttons (size="icon" or iconOnly) have no visible label — pass aria-label or aria-labelledby so the control has an accessible name.',
    )
  }
}

/**
 * Dev-only nudge for a segment that asked for the `icon` step: inside a group
 * it renders as `iconOnly` at the group's own step (see
 * `resolveGroupDefaults`), so the author should say that instead of relying
 * on the coercion.
 */
function warnIfIconStepInGroup(group: GroupDefaults | null, size: ButtonOwnProps['size']) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  if (group && size === 'icon') {
    console.warn(
      '[nswds/ui] size="icon" inside a ButtonGroup renders as iconOnly at the group\'s own step, so the square lines up with the segments beside it: the group clips its box, so the 40px square would lose its 44px touch target. Pair iconOnly with the group\'s size instead.',
    )
  }
}

/**
 * Action button on the Base UI button primitive. For button-styled
 * navigation, use `ButtonLink` — the `href` polymorphism that previously
 * lived on this component was removed in v2.
 *
 * Base UI's `render` prop is available for composition (e.g. rendering a
 * framework-specific element while keeping Button behaviour).
 */
function Button({
  className,
  variant: variantProp,
  color: colorProp,
  size: sizeProp,
  iconOnly: iconOnlyProp,
  children,
  block,
  loading,
  alignContent = 'center',
  disabled,
  leadingVisual,
  trailingVisual,
  trailingAction,
  labelWrap,
  count,
  countLabel,
  ref,
  ...props
}: ButtonProps) {
  const effectiveDisabled = disabled || loading
  // Always emitted as `data-variant`, and group-aware — see resolveGroupDefaults.
  const { variant, color, size, iconOnly, segment, band, onTint } = useSegmentDefaults({
    variant: variantProp,
    color: colorProp,
    size: sizeProp,
    iconOnly: iconOnlyProp,
  })

  warnIfIconButtonUnlabelled(size, iconOnly, props, children)

  return (
    <ButtonPrimitive
      data-slot='button'
      data-variant={variant}
      data-segment={segment}
      data-band={band}
      // Read by ButtonGroup, which has to undo the square on its CROSS axis —
      // `styles.iconOnly` sets both dimensions, and a definite cross size is
      // exactly what stops `items-stretch` reaching the segment.
      data-icon-only={iconOnly || undefined}
      aria-busy={loading || undefined}
      {...props}
      disabled={effectiveDisabled}
      className={buttonClasses({
        variant,
        color,
        size,
        iconOnly,
        block,
        alignContent,
        className,
        effectiveDisabled,
        segment,
        onTint,
      })}
      ref={ref}
    >
      <ButtonContent
        loading={loading}
        leadingVisual={leadingVisual}
        trailingVisual={trailingVisual}
        trailingAction={trailingAction}
        labelWrap={labelWrap}
        count={count}
        countLabel={countLabel}
      >
        {children}
      </ButtonContent>
    </ButtonPrimitive>
  )
}

/**
 * Button-styled anchor. Renders through `Link`, so it picks up the
 * framework link component from `LinkProvider` (e.g. next/link) and accepts
 * all anchor props. Disabled/loading states are conveyed with
 * `aria-disabled` and a click guard, since anchors have no `disabled`
 * attribute.
 */
function ButtonLink({
  className,
  variant: variantProp,
  color: colorProp,
  size: sizeProp,
  iconOnly: iconOnlyProp,
  children,
  block,
  loading,
  alignContent = 'center',
  disabled,
  leadingVisual,
  trailingVisual,
  trailingAction,
  labelWrap,
  count,
  countLabel,
  ref,
  ...props
}: ButtonLinkProps) {
  const effectiveDisabled = disabled || loading
  // Always emitted as `data-variant`, and group-aware — see resolveGroupDefaults.
  const { variant, color, size, iconOnly, segment, band, onTint } = useSegmentDefaults({
    variant: variantProp,
    color: colorProp,
    size: sizeProp,
    iconOnly: iconOnlyProp,
  })

  warnIfIconButtonUnlabelled(size, iconOnly, props, children)

  return (
    <Link
      // Opt out of Link's built-in styling — ButtonLink supplies its own
      // complete visual treatment (background, border, focus ring, icon
      // sizing) and any Link styling layered on top would conflict.
      variant='unstyled'
      data-slot='button'
      data-variant={variant}
      data-segment={segment}
      data-band={band}
      // Read by ButtonGroup, which has to undo the square on its CROSS axis —
      // `styles.iconOnly` sets both dimensions, and a definite cross size is
      // exactly what stops `items-stretch` reaching the segment.
      data-icon-only={iconOnly || undefined}
      aria-busy={loading || undefined}
      {...props}
      {...(effectiveDisabled
        ? {
            'aria-disabled': true,
            'data-disabled': '',
            tabIndex: -1,
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault(),
          }
        : {})}
      className={buttonClasses({
        variant,
        color,
        size,
        iconOnly,
        block,
        alignContent,
        className,
        effectiveDisabled,
        segment,
        onTint,
      })}
      ref={ref}
    >
      <ButtonContent
        loading={loading}
        leadingVisual={leadingVisual}
        trailingVisual={trailingVisual}
        trailingAction={trailingAction}
        labelWrap={labelWrap}
        count={count}
        countLabel={countLabel}
      >
        {children}
      </ButtonContent>
    </Link>
  )
}

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className='absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-transparent [@media(pointer:fine)]:hidden'
        aria-hidden='true'
      />
      {children}
    </>
  )
}

export { Button, buttonColorVariants, ButtonLink, buttonVariants, TouchTarget }
export type { ButtonLinkProps, ButtonProps, IconSlot }

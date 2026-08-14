'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import React from 'react'

import { cn } from '../lib/utils.js'

import { Link } from '../components/link.js'
import { Spinner } from '../components/spinner.js'

const styles = {
  base: [
    // Base
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-sm border text-base/7 font-bold motion-safe:transition-all',
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
  // only part company in dark mode.
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
}

const buttonVariants = cva(styles.base, {
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
  },
  compoundVariants: [
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
  },
})

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
type ButtonOwnProps = Omit<VariantProps<typeof buttonVariants>, 'size' | 'iconOnly' | 'color'> & {
  /**
   * Colour token. Most are safe on any surface: the non-solid variants take
   * their ink from the token and it flips for dark mode, so `primary` reads
   * correctly on a light page and on a dark one.
   *
   * `white` and `secondary` are the exceptions — both are **surface-
   * conditional, for dark surfaces only**. Their inks (`white` and
   * `primary-200`) are already light, which is what makes them right on a
   * dark surface and unusable on a light one: a non-solid button in either
   * colour measures around 1.2:1 on white, against the 3:1 WCAG 1.4.11 asks
   * of a UI component. Reach for them the way `Hero` does — over a
   * `primary-800` panel — and use `primary` on a light or theme-flipping
   * surface. `solid` is unaffected either way, since it pairs `--btn-fill`
   * with `--btn-text` rather than painting the ink.
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
}: ButtonOwnProps & { effectiveDisabled?: boolean }) {
  return clsx(
    cn(
      buttonVariants({ variant, color, size, iconOnly }),
      block && 'w-full',
      alignContent === 'start' && 'justify-start',
      className,
    ),
    effectiveDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
  )
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
 * Dev-only guard shared by `Button` and `ButtonLink`: an icon-only button
 * (`size="icon"` or `iconOnly`) renders no visible text, so it must carry an
 * explicit accessible name. Warns in development when one is missing; a no-op
 * in production. A falsy `aria-label` (including `""`) counts as missing.
 */
function warnIfIconButtonUnlabelled(
  size: ButtonOwnProps['size'],
  iconOnly: ButtonOwnProps['iconOnly'],
  props: { 'aria-label'?: unknown; 'aria-labelledby'?: unknown },
) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  if ((size === 'icon' || iconOnly) && !props['aria-label'] && !props['aria-labelledby']) {
    console.warn(
      '[nswds/ui] Icon-only buttons (size="icon" or iconOnly) have no visible label — pass aria-label or aria-labelledby so the control has an accessible name.',
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
  // Defaulted here rather than left to cva's `defaultVariants` so that
  // `data-variant` below is always present in the DOM. cva resolves its own
  // default internally and emits the right classes either way, but the
  // attribute was simply absent — so the `data-[variant=solid]:` state-overlay
  // rules in `styles.colors` never matched a default `<Button>`. It fell
  // through to the derived overlay in `styles.base` and painted `--btn-bg` at
  // 10% over its own fill, which is the same colour: no visible hover at all.
  variant = 'solid',
  color,
  size,
  iconOnly,
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

  warnIfIconButtonUnlabelled(size, iconOnly, props)

  return (
    <ButtonPrimitive
      data-variant={variant}
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
  // Always emitted as `data-variant` — see the note in `Button`.
  variant = 'solid',
  color,
  size,
  iconOnly,
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

  warnIfIconButtonUnlabelled(size, iconOnly, props)

  return (
    <Link
      // Opt out of Link's built-in styling — ButtonLink supplies its own
      // complete visual treatment (background, border, focus ring, icon
      // sizing) and any Link styling layered on top would conflict.
      variant='unstyled'
      data-variant={variant}
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

export { Button, ButtonLink, buttonVariants, TouchTarget }
export type { ButtonLinkProps, ButtonProps, IconSlot }

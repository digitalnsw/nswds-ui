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
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-sm border text-base/7 font-bold transition-all motion-reduce:transition-none',
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
    'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-(--btn-bg)',
    // Disabled
    'data-disabled:opacity-50 data-disabled:pointer-events-none',
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
    'dark:bg-(--btn-bg)',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--btn-bg)',
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
  colors: {
    grey: [
      // Base
      '[--btn-bg:var(--color-grey-600)] [--btn-border:var(--color-grey-600)]/90 [--btn-text:white]',
      // State: Hover
      '[--btn-hover-overlay:var(--color-grey-600)]/10 [--btn-active-overlay:var(--color-grey-600)]/20',
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    white: [
      // Base
      '[--btn-bg:var(--color-white)] [--btn-border:var(--color-white)]/90 [--btn-text:var(--color-grey-800)]',
      // State: Hover
      '[--btn-hover-overlay:var(--color-white)]/10 [--btn-active-overlay:var(--color-white)]/20',
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-black)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    primary: [
      // Base
      '[--btn-bg:var(--color-primary-800)] [--btn-border:var(--color-primary-800)]/90 [--btn-text:white]',
      // State: Hover
      '[--btn-hover-overlay:var(--color-primary-800)]/10 [--btn-active-overlay:var(--color-primary-800)]/20',
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    secondary: [
      // Base
      '[--btn-bg:var(--color-primary-200)] [--btn-border:var(--color-primary-200)]/90 [--btn-text:var(--color-primary-800)]',
      // State: Hover
      '[--btn-hover-overlay:var(--color-primary-200)]/10 [--btn-active-overlay:var(--color-primary-200)]/20',
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/15',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-primary-800)]/10',
    ],
    tertiary: [
      // Base
      '[--btn-bg:var(--color-primary-600)] [--btn-border:var(--color-primary-600)]/90 [--btn-text:white]',
      // State: Hover
      '[--btn-hover-overlay:var(--color-primary-600)]/10 [--btn-active-overlay:var(--color-primary-600)]/20',
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    accent: [
      // Base
      '[--btn-bg:var(--color-accent-600)] [--btn-border:var(--color-accent-600)]/90 [--btn-text:white]',
      // State: Hover
      '[--btn-hover-overlay:var(--color-accent-600)]/10 [--btn-active-overlay:var(--color-accent-600)]/20',
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
      '[--btn-bg:var(--danger-600)] [--btn-border:var(--danger-600)]/90 [--btn-text:white]',
      // State: Hover
      '[--btn-hover-overlay:var(--danger-600)]/10 [--btn-active-overlay:var(--danger-600)]/20',
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    success: [
      // Base
      '[--btn-bg:var(--success-600)] [--btn-border:var(--success-600)]/90 [--btn-text:white]',
      // State: Hover
      '[--btn-hover-overlay:var(--success-600)]/10 [--btn-active-overlay:var(--success-600)]/20',
      'data-[variant=solid]:[--btn-hover-overlay:var(--color-white)]/10',
      // State: Active
      'data-[variant=solid]:[--btn-active-overlay:var(--color-black)]/15',
    ],
    warning: [
      // Base
      '[--btn-bg:var(--warning-600)] [--btn-border:var(--warning-600)]/90 [--btn-text:white]',
      // State: Hover
      '[--btn-hover-overlay:var(--warning-600)]/10 [--btn-active-overlay:var(--warning-600)]/20',
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
  size: {
    default:
      'px-[calc(--spacing(6)-var(--btn-border-w))] py-[calc(--spacing(4)-var(--btn-border-w))] sm:px-[calc(--spacing(5.5)-var(--btn-border-w))] sm:py-[calc(--spacing(3)-var(--btn-border-w))] [--btn-h:calc(--spacing(7)+--spacing(4)*2)] sm:[--btn-h:calc(--spacing(7)+--spacing(3)*2)] [--btn-icon-size:--spacing(6)] sm:[--btn-icon-size:--spacing(5)]',
    sm: 'px-[calc(--spacing(5)-var(--btn-border-w))] py-[calc(--spacing(3)-var(--btn-border-w))] sm:px-[calc(--spacing(4.5)-var(--btn-border-w))] sm:py-[calc(--spacing(2)-var(--btn-border-w))] [--btn-h:calc(--spacing(7)+--spacing(3)*2)] sm:[--btn-h:calc(--spacing(7)+--spacing(2)*2)] [--btn-icon-size:--spacing(5)] sm:[--btn-icon-size:--spacing(4)]',
    lg: 'px-[calc(--spacing(7)-var(--btn-border-w))] py-[calc(--spacing(5)-var(--btn-border-w))] sm:px-[calc(--spacing(6.5)-var(--btn-border-w))] sm:py-[calc(--spacing(4)-var(--btn-border-w))] [--btn-h:calc(--spacing(7)+--spacing(5)*2)] sm:[--btn-h:calc(--spacing(7)+--spacing(4)*2)] [--btn-icon-size:--spacing(7)] sm:[--btn-icon-size:--spacing(6)]',
    // A compact chrome square that deliberately sits below the text steps —
    // header actions, dialog close buttons, footer social links. It is square
    // at every breakpoint, so the glyph holds one size too; it used to shrink
    // to `--spacing(5)` above `sm:`, filling half a box that never got smaller.
    // For an icon button that must line up with text buttons beside it, use
    // `iconOnly` with `sm`/`default`/`lg` instead.
    icon: 'w-10 h-10 flex-none [--btn-h:--spacing(10)] [--btn-icon-size:--spacing(6)]',
  },
  // Square the button at the current step and drop the horizontal padding, so
  // the scale step and "is this icon-only" are independent axes. The glyph
  // inside it is sized per step in `compoundVariants` below.
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
    // The icon-size ladder is 20 / 24 / 28 / 32 / 36 / 40px — `--spacing(5)`
    // through `--spacing(10)`. Every level is a multiple of 4, so glyphs sit
    // on the same grid as the padding and heights around them, and each one
    // lands on a whole device pixel at 1x. It is a discrete ladder rather
    // than a proportion of the button box on purpose: an icon is drawn on a
    // pixel grid and stays crisp only at the sizes it was designed for, so
    // "40% of the box" would produce sizes no glyph was drawn for.
    //
    // These override the step's own `--btn-icon-size` rather than inheriting
    // it. Beside a label an icon is an accent sized to the text; when it is
    // the only content it *is* the label, so it steps up and holds one size
    // across breakpoints — same reasoning as `size='icon'`, and for the same
    // reason: the box it sits in never gets smaller either.
    //
    // Each entry restates the `sm:` value as well as the base one. The step
    // ships both, and tailwind-merge scopes a modifier to its own group, so
    // overriding only the base would leave the step's `sm:` shrink in force
    // above the breakpoint.
    {
      size: 'sm',
      iconOnly: true,
      className: '[--btn-icon-size:--spacing(5)] sm:[--btn-icon-size:--spacing(5)]',
    },
    {
      size: 'default',
      iconOnly: true,
      className: '[--btn-icon-size:--spacing(6)] sm:[--btn-icon-size:--spacing(6)]',
    },
    {
      size: 'lg',
      iconOnly: true,
      className: '[--btn-icon-size:--spacing(7)] sm:[--btn-icon-size:--spacing(7)]',
    },
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

/** Visual/content props shared by `Button` and `ButtonLink`. */
type ButtonOwnProps = Omit<VariantProps<typeof buttonVariants>, 'size' | 'iconOnly'> & {
  /**
   * Scale step. `sm` / `default` / `lg` set the padding and icon size, and
   * render 52 / 60 / 68px tall below `sm:` and 44 / 52 / 60px at or above it.
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
   * The glyph steps up from the size the step uses beside a label, and holds
   * it across breakpoints: 20px at `sm`, 24px at `default`, 28px at `lg`.
   * For a denser icon button that does not align with the text steps, use
   * `size='icon'` (24px in a 40×40 box).
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
  /** Icon component rendered before the label. */
  leadingVisual?: React.ElementType
  /** Icon component rendered after the label. */
  trailingVisual?: React.ElementType
  /** Icon component rendered as a trailing action (far end). */
  trailingAction?: React.ElementType
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
  leadingVisual: LeadingVisual,
  trailingVisual: TrailingVisual,
  trailingAction: TrailingAction,
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
      {LeadingVisual && <LeadingVisual data-slot='icon' />}
      {labelWrap === false ? <span className='whitespace-nowrap'>{children}</span> : children}
      {count !== undefined && (
        <span className='rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums opacity-75'>
          {count}
          {countLabel ? <span className='sr-only'> {countLabel}</span> : null}
        </span>
      )}
      {TrailingVisual && <TrailingVisual data-slot='icon' />}
      {TrailingAction && <TrailingAction data-slot='icon' />}
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
  variant,
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
  variant,
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
export type { ButtonLinkProps, ButtonProps }

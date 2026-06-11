'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

import { cn } from '../lib/utils.js'

import { Link } from '../components/link.js'
import { Spinner } from '../components/spinner.js'

const styles = {
  base: [
    // Base
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-sm border text-base/7 font-bold transition-all',
    // Focus
    'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-(--btn-bg)',
    // Disabled
    'data-disabled:opacity-50 data-disabled:pointer-events-none',
    // Icon
    '*:data-[slot=icon]:-mx-0.25 *:data-[slot=icon]:my-0.25 sm:*:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-(--btn-icon-size) *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]',
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
    'border-(--btn-bg)/50 border-2 bg-(--btn-bg)/5',
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
    'border-(--btn-bg) text-(--btn-bg) border-2',
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
    // Underline on interaction
    'underline-offset-4 hover:underline active:underline',
    // No pseudo-layers needed
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
  size: {
    default:
      'px-[calc(--spacing(6)-1px)] py-[calc(--spacing(4)-1px)] sm:px-[calc(--spacing(5.5)-1px)] sm:py-[calc(--spacing(3)-1px)] [--btn-icon-size:--spacing(6)] sm:[--btn-icon-size:--spacing(5)]',
    sm: 'px-[calc(--spacing(5)-1px)] py-[calc(--spacing(3)-1px)] sm:px-[calc(--spacing(4.5)-1px)] sm:py-[calc(--spacing(2)-1px)] [--btn-icon-size:--spacing(5)] sm:[--btn-icon-size:--spacing(4)]',
    lg: 'px-[calc(--spacing(7)-1px)] py-[calc(--spacing(5)-1px)] sm:px-[calc(--spacing(6.5)-1px)] sm:py-[calc(--spacing(4)-1px)] [--btn-icon-size:--spacing(7)] sm:[--btn-icon-size:--spacing(6)]',
    icon: 'w-10 h-10 flex-none [--btn-icon-size:--spacing(6)] sm:[--btn-icon-size:--spacing(5)]',
  },
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
  },
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'default',
  },
})

type ButtonProps = VariantProps<typeof buttonVariants> & {
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
} & (
    | Omit<ButtonPrimitive.Props, 'className' | 'disabled' | 'render'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className' | 'variant'>
  )

const Button = forwardRef(function Button(
  {
    className,
    variant,
    color,
    size,
    children,
    block,
    loading,
    alignContent = 'center',
    disabled,
    leadingVisual: LeadingVisual,
    trailingVisual: TrailingVisual,
    trailingAction: TrailingAction,
    labelWrap,
    count,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const effectiveDisabled = disabled || loading

  const classes = cn(
    buttonVariants({ variant, color, size }),
    block && 'w-full',
    alignContent === 'start' && 'justify-start',
    className
  )

  const content = (
    <TouchTarget>
      {loading && (
        <Spinner
          data-slot="icon"
          role={undefined}
          aria-hidden
          color="current"
          // The button's own label + aria-busy convey the busy state; the
          // spinner's default "Loading" announcement would be redundant.
          label=""
          // `block` overrides Spinner's default `inline` so the svg isn't
          // pushed below centre by the button's line-height; `size-full` fills
          // the icon-sized, self-centred wrapper span.
          svgClassName="block size-full"
        />
      )}
      {LeadingVisual && <LeadingVisual data-slot="icon" />}
      {labelWrap === false ? (
        <span className="whitespace-nowrap">{children}</span>
      ) : (
        children
      )}
      {count !== undefined && (
        <span className="rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums opacity-75">
          {count}
        </span>
      )}
      {TrailingVisual && <TrailingVisual data-slot="icon" />}
      {TrailingAction && <TrailingAction data-slot="icon" />}
    </TouchTarget>
  )

  return 'href' in props ? (
    <Link
      // Opt out of Link's built-in styling — Button supplies its own
      // complete visual treatment (background, border, focus ring, icon
      // sizing) and any Link styling layered on top would conflict.
      variant="unstyled"
      data-variant={variant}
      aria-busy={loading || undefined}
      {...(props as Omit<
        React.ComponentPropsWithoutRef<typeof Link>,
        'className' | 'variant'
      >)}
      {...(effectiveDisabled
        ? {
            'aria-disabled': true,
            'data-disabled': '',
            tabIndex: -1,
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) =>
              e.preventDefault(),
          }
        : {})}
      className={clsx(
        classes,
        effectiveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      {content}
    </Link>
  ) : (
    <ButtonPrimitive
      data-variant={variant}
      aria-busy={loading || undefined}
      {...(props as Omit<
        ButtonPrimitive.Props,
        'className' | 'disabled' | 'render'
      >)}
      disabled={effectiveDisabled}
      className={clsx(
        classes,
        effectiveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      ref={ref}
    >
      {content}
    </ButtonPrimitive>
  )
})

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-transparent [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  )
}

export { Button, buttonVariants, TouchTarget }

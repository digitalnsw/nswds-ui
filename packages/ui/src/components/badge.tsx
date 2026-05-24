'use client'

import * as Headless from '@headlessui/react'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

import { cn } from '../lib/utils.js'
import { TouchTarget } from './button.js'
import { Link } from './link.js'

const focusOutline = {
  'primary/grey': [
    // Base
    '[--focus-outline:var(--color-primary-800)]',
    // Base dark mode
    'dark:[--focus-outline:var(--color-grey-600)]',
    // Soft, Surface and outline
    'data-[variant=soft]:[--focus-outline:var(--color-primary-800)]/20',
    // Soft, Surface and outline dark mode
    'dark:data-[variant=soft]:[--focus-outline:var(--color-grey-200)]/30',
  ],
  light: [
    // Base
    '[--focus-outline:var(--color-grey-300)]',
    // Base dark mode
    'dark:[--focus-outline:var(--color-grey-100)]',
    // Soft
    'dark:data-[variant=soft]:[--focus-outline:var(--color-grey-200)]/30',
    // Surface
    'data-[variant=surface]:[--focus-outline:var(--color-grey-600)]',
    // Soft, Surface and outline dark mode
    'dark:data-[variant=surface]:[--focus-outline:var(--color-white)]/70',
  ],
  'primary/white': [
    // Base
    '[--focus-outline:var(--color-primary-800)]',
    // Base dark mode
    'dark:[--focus-outline:var(--color-white)]',
    // Soft
    'data-[variant=soft]:[--focus-outline:var(--color-primary-800)]/20',
    // Surface
    'dark:data-[variant=soft]:[--focus-outline:var(--color-grey-200)]/30',
  ],
  grey: [
    // Base
    '[--focus-outline:var(--color-grey-600)]',
    // Base dark mode
    'dark:[--focus-outline:var(--color-grey-500)]',
    // Soft
    'data-[variant=soft]:[--focus-outline:var(--color-grey-600)]/20',
    // Soft dark mode
    'dark:data-[variant=soft]:[--focus-outline:var(--color-grey-200)]/20',
    // Outline dark mode
    'dark:data-[variant=outline]:[--focus-outline:var(--color-grey-100)]/30',
    // Surface dark mode
    'dark:data-[variant=surface]:[--focus-outline:var(--color-grey-200)]/20',
  ],
  white: [
    // Base
    '[--focus-outline:var(--color-white)]',
    // Base dark mode
    'data-[variant=soft]:[--focus-outline:var(--color-white)]/20',
    // Soft
    '',
    // Surface
    '',
  ],
  primary: [
    // Base
    '[--focus-outline:var(--color-primary-800)]',
    // Base dark mode
    'data-[variant=soft]:[--focus-outline:var(--color-primary-800)]/20',
    // Soft
    'dark:data-[variant=soft]:[--focus-outline:var(--color-primary-800)]/60',
    // Surface
    '',
  ],
  secondary: [
    // Base
    '[--focus-outline:var(--color-primary-200)]',
    // Base dark mode
    'data-[variant=soft]:[--focus-outline:var(--color-primary-200)]/20',
    // Soft
    'dark:data-[variant=soft]:[--focus-outline:var(--color-primary-200)]/60',
    // Surface
    '',
  ],
  tertiary: [
    // Base
    '[--focus-outline:var(--color-primary-600)]',
    // Base dark mode
    'data-[variant=soft]:[--focus-outline:var(--color-primary-600)]/20',
    // Soft
    'dark:data-[variant=soft]:[--focus-outline:var(--color-primary-600)]/60',
    // Surface
    '',
  ],
  accent: [
    // Base
    '[--focus-outline:var(--color-accent-600)]',
    // Base dark mode
    'data-[variant=soft]:[--focus-outline:var(--color-accent-600)]/20',
    // Soft
    'dark:data-[variant=soft]:[--focus-outline:var(--color-accent-600)]/60',
  ],
  error: [
    // Base
    '',
    // Base dark mode
    '',
    // Soft
    '',
    // Surface
    '',
  ],
  success: [
    // Base
    '',
    // Base dark mode
    '',
    // Soft
    '',
    // Surface
    '',
  ],
  warning: [
    // Base
    '',
    // Base dark mode
    '',
    // Soft
    '',
    // Surface
    '',
  ],
  info: [
    // Base
    '',
    // Base dark mode
    '',
    // Soft
    '',
    // Surface
    '',
  ],
}

const styles = {
  base: [
    // Base
    'relative isolate inline-flex items-center rounded-sm font-normal border forced-colors:outline transition-all h-fit shrink-0',
    // Icon
    '*:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center sm:*:data-[slot=icon]:size-3',
  ],
  solid: [
    // Text color
    'text-(--badge-text)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--badge-border)',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--badge-bg)',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--badge-bg)',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // White overlay on hover
    'group-data-active:after:bg-(--badge-hover-overlay) group-data-hover:after:bg-(--badge-hover-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  soft: [
    // Text color
    'text-(--badge-bg)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--badge-bg)/5',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--badge-bg)/20',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--badge-bg)/5',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:bg-white/5',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // White overlay on hover
    'group-data-active:after:bg-(--badge-hover-overlay) group-data-hover:after:bg-(--badge-hover-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  surface: [
    // Text color
    'text-(--badge-bg)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-(--badge-bg)/50 bg-(--badge-bg)/5',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--badge-bg)/30',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-(--badge-bg)/5',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-(--badge-bg)/50',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // Border color on hover
    'group-data-active:border-(--badge-bg) group-data-hover:border-(--badge-bg)',
    // White overlay on hover
    'group-data-active:after:bg-(--badge-hover-overlay) group-data-hover:after:bg-(--badge-hover-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    // Text color
    'border-(--badge-bg) text-(--badge-bg)',
    // Optical border, implemented as the button background to avoid corner artifacts
    'bg-transparent',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-sm)-1px)] before:bg-transparent',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-(--badge-bg)',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-sm)-1px)]',
    // White overlay on hover
    'group-data-active:after:bg-(--badge-hover-overlay) group-data-hover:after:bg-(--badge-hover-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-sm',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  colors: {
    'primary/grey': [
      // Base
      '[--badge-bg:var(--color-primary-800)] [--badge-border:var(--color-primary-800)]/90 [--badge-text:var(--color-white)]',
      // States
      '[--badge-hover-overlay:var(--color-primary-800)]/10 data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
      // Dark mode
      'dark:[--badge-bg:var(--color-grey-600)] dark:[--badge-border:var(--color-grey-600)]/90 dark:[--badge-text:var(--color-white)] dark:text-white',
      // Dark mode states
      'dark:[--badge-hover-overlay:var(--color-grey-200)]/20',
    ],
    light: [
      // Base
      '[--badge-bg:var(--color-grey-200)] [--badge-border:var(--color-grey-200)]/90 [--badge-text:var(--color-grey-800)]',
      'text-grey-800',
      // Soft
      'data-[variant=soft]:[--badge-bg:var(--color-grey-500)]',
      // Surface
      'data-[variant=surface]:[--badge-bg:var(--color-grey-500)]',
      // States
      '[--badge-hover-overlay:var(--color-grey-200)]/10 data-[variant=outline]:[--badge-hover-overlay:var(--color-grey-200)]/20 data-[variant=solid]:[--badge-hover-overlay:var(--color-grey-400)]/50',
      // Dark mode
      'dark:text-grey-200 dark:data-[variant=solid]:text-grey-800',
      // Dark mode states
      '',
    ],
    'primary/white': [
      // Base
      '[--badge-bg:var(--color-primary-800)] [--badge-border:var(--color-primary-800)]/90 [--badge-text:var(--color-white)]',
      // States
      '[--badge-hover-overlay:var(--color-primary-800)]/10 data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
      // Dark mode
      'dark:[--badge-bg:var(--color-white)] dark:[--badge-border:var(--color-white)]/90 dark:[--badge-text:var(--color-grey-800)]',
      // Dark mode states
      '',
    ],
    grey: [
      // Base
      '[--badge-bg:var(--color-grey-600)] [--badge-border:var(--color-grey-600)]/90 [--badge-text:var(--color-white)]',
      // States
      '[--badge-hover-overlay:var(--color-primary-800)]/10 data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
      // Dark mode
      'dark:text-white',
      // Dark mode states
      '',
    ],
    white: [
      // Base
      '[--badge-bg:var(--color-white)] [--badge-border:var(--color-white)]/90 text-white data-[variant=solid]:text-grey-800',
      // States
      '[--badge-hover-overlay:var(--color-primary-800)]/10 data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
      // Dark mode
      'dark:text-grey-200 dark:data-[variant=solid]:text-grey-800',
      // Dark mode states
      '',
    ],
    primary: [
      // Base
      '[--badge-bg:var(--color-primary-800)] [--badge-border:var(--color-primary-800)]/90 [--badge-text:var(--color-white)]',
      // States
      '[--badge-hover-overlay:var(--color-primary-800)]/10 data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
      // Dark mode
      'dark:text-white dark:bg-[--badge-hover-overlay:var(--color-primary-800)]/40 dark:data-[variant=solid]:bg-[--badge-hover-overlay:var(--color-primary-800)]',
      // Dark mode states
      'dark:[--badge-hover-overlay:var(--color-primary-800)]/50 dark:data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/5',
      // Dark border
      'dark:data-[variant=surface]:border-[--badge-hover-overlay:var(--color-primary-700)]/60',
      'dark:data-[variant=outline]:border-[--badge-hover-overlay:var(--color-primary-700)]',
      // Dark border states
      'dark:data-[variant=surface]:data-active:border-[--badge-hover-overlay:var(--color-primary-700)]',
      'dark:data-[variant=surface]:data-hover:border-[--badge-hover-overlay:var(--color-primary-700)]',
    ],
    secondary: [
      // Base
      '[--badge-bg:var(--color-primary-200)] [--badge-border:var(--color-primary-200)]/90 [--badge-text:var(--color-primary-800)]',
      // States
      '[--badge-hover-overlay:var(--color-primary-200)]/30 data-[variant=solid]:[--badge-hover-overlay:var(--color-primary-250)]',
      // Dark mode
      'dark:[--badge-bg:var(--color-primary-400)] dark:[--badge-border:var(--color-primary-400)]/90 dark:[--badge-text:white]',
      // Dark mode states
      'dark:[--badge-hover-overlay:var(--color-primary-400)]/30 dark:data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
    ],
    tertiary: [
      // Base
      '[--badge-bg:var(--color-primary-600)] [--badge-border:var(--color-primary-600)]/90 [--badge-text:var(--color-white)]',
      // States
      '[--badge-hover-overlay:var(--color-primary-600)]/10 data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
      // Dark mode
      'dark:[--badge-bg:var(--color-primary-500)] dark:[--badge-border:var(--color-primary-500)]/90 dark:[--badge-text:white]',
      // Dark mode states
      'dark:[--badge-hover-overlay:var(--color-primary-500)]/30 dark:data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
    ],
    accent: [
      // Base
      '[--badge-bg:var(--color-accent-600)] [--badge-border:var(--color-accent-600)]/90 [--badge-text:var(--color-white)]',
      // States
      '[--badge-hover-overlay:var(--color-accent-600)]/10 data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
      // Dark mode
      'dark:[--badge-bg:var(--color-accent-500)] dark:[--badge-border:var(--color-accent-500)]/90 dark:[--badge-text:white]',
      // Dark mode states
      'dark:[--badge-hover-overlay:var(--color-accent-500)]/30 dark:data-[variant=solid]:[--badge-hover-overlay:var(--color-white)]/10',
    ],
    danger: [
      // Base
      '',
      // States
      '',
      // Dark mode
      '',
      // Dark mode states
      '',
    ],
    success: [
      // Base
      '',
      // States
      '',
      // Dark mode
      '',
      // Dark mode states
      '',
    ],
    warning: [
      // Base
      '',
      // States
      '',
      // Dark mode
      '',
      // Dark mode states
      '',
    ],
    info: [
      // Base
      '',
      // States
      '',
      // Dark mode
      '',
      // Dark mode states
      '',
    ],
  },
  size: {
    default:
      'py-[calc(--spacing(1))] px-[calc(--spacing(2))] gap-[calc(--spacing(1)*1.5)] text-sm/5 sm:text-xs/5',
    sm: 'py-[calc(--spacing(1)*0.5)] px-[calc(--spacing(1)*1.5)] gap-[calc(--spacing(1)*1.5)] text-sm/5 sm:text-xs/5',
    lg: 'py-[calc(--spacing(1))] px-[calc(--spacing(2)*1.25)] gap-[calc(--spacing(2))] text-base/5 sm:text-sm/5',
  },
}

const badgeVariants = cva(styles.base, {
  variants: {
    variant: {
      solid: styles.solid,
      soft: styles.soft,
      surface: styles.surface,
      outline: styles.outline,
    },
    color: {
      'primary/grey': styles.colors['primary/grey'],
      light: styles.colors.light,
      'primary/white': styles.colors['primary/white'],
      white: styles.colors.white,
      grey: styles.colors.grey,
      primary: styles.colors.primary,
      secondary: styles.colors.secondary,
      tertiary: styles.colors.tertiary,
      accent: styles.colors.accent,
      danger: styles.colors.danger,
      success: styles.colors.success,
      warning: styles.colors.warning,
      info: styles.colors.info,
    },
    size: {
      default: styles.size.default,
      sm: styles.size.sm,
      lg: styles.size.lg,
    },
  },
  defaultVariants: {
    variant: 'soft',
    color: 'primary',
    size: 'default',
  },
})

function Badge({
  variant,
  color,
  size,
  className,
  ...props
}: VariantProps<typeof badgeVariants> &
  React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      data-variant={variant}
      className={cn(badgeVariants({ variant, color, size }), className)}
    />
  )
}

const BadgeButton = forwardRef(function BadgeButton(
  {
    variant,
    color,
    size,
    className,
    children,
    ...props
  }: VariantProps<typeof badgeVariants> & {
    className?: string
    children: React.ReactNode
  } & (
      | Omit<Headless.ButtonProps, 'as' | 'className'>
      | Omit<
          React.ComponentPropsWithoutRef<typeof Link>,
          'className' | 'variant'
        >
    ),
  ref: React.ForwardedRef<HTMLElement>
) {
  const badgeColor = color ?? undefined
  const classes = clsx(
    className,
    focusOutline[badgeColor as keyof typeof focusOutline],
    [
      // Base
      'group relative inline-flex rounded-sm',
      // Focus
      'focus:outline-1 focus:outline-offset-1 focus:outline-(--focus-outline)',
      // Disabled
      'disabled:pointer-events-none disabled:opacity-50',
    ]
  )

  return 'href' in props ? (
    <Link
      data-variant={variant}
      {...(props as Omit<
        React.ComponentPropsWithoutRef<typeof Link>,
        'className' | 'variant'
      >)}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>
        <Badge variant={variant} color={badgeColor} size={size}>
          {children}
        </Badge>
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button
      data-variant={variant}
      {...(props as Omit<Headless.ButtonProps, 'as' | 'className'>)}
      className={clsx(classes, 'cursor-pointer')}
      ref={ref}
    >
      <TouchTarget>
        <Badge variant={variant} color={badgeColor} size={size}>
          {children}
        </Badge>
      </TouchTarget>
    </Headless.Button>
  )
})

export { Badge, BadgeButton, badgeVariants }

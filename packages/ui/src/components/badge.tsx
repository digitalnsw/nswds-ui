'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { labelColorVariants, type LabelColor } from '../lib/label-colors.js'
import { cn } from '../lib/utils.js'

const badgeCva = cva(
  'inline-flex max-w-full items-center justify-center gap-1.5 rounded-full border align-middle font-normal forced-colors:border-[CanvasText] [&_[data-slot=icon]]:inline-block [&_[data-slot=icon]]:size-4 [&_[data-slot=icon]]:shrink-0 [&_[data-slot=icon]]:align-middle',
  {
    variants: {
      variant: {
        solid: 'border-transparent bg-(--btn-fill) text-(--btn-text)',
        soft: 'border-transparent bg-(--btn-bg)/10 text-(--btn-bg) dark:bg-(--btn-bg)/20',
        surface: 'border-(--btn-bg)/50 bg-(--btn-bg)/5 text-(--btn-bg) dark:bg-(--btn-bg)/20',
        outline: 'border-(--btn-bg) bg-transparent text-(--btn-bg)',
      },
      size: {
        sm: 'px-2 py-0.5 text-sm/5',
        default: 'px-3 py-1 text-base/6',
        lg: 'px-4 py-1.5 text-base/6',
      },
    },
    defaultVariants: { variant: 'soft', size: 'default' },
  },
)

type BadgeVariantProps = NonNullable<Parameters<typeof badgeCva>[0]> & {
  color?: LabelColor | 'light' | null
}

function badgeVariants({
  color = 'primary',
  variant = 'soft',
  class: classValue,
  className,
  ...props
}: BadgeVariantProps = {}) {
  return cn(
    badgeCva({ ...props, variant }),
    labelColorVariants(color, variant),
    classValue,
    className,
  )
}

type BadgeProps = VariantProps<typeof badgeVariants> &
  React.ComponentPropsWithoutRef<'span'> & {
    ref?: React.Ref<HTMLSpanElement>
    /** Decorative status dot; always accompany it with a visible status label. */
    dot?: boolean
  }

/** Static status or count. Categories and interactive labels belong to Tag. */
function Badge({
  variant = 'soft',
  color,
  size,
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot='badge'
      {...props}
      data-variant={variant}
      className={badgeVariants({ variant, color, size, className })}
    >
      {dot && (
        <span
          aria-hidden
          data-slot='badge-dot'
          className='size-2 shrink-0 rounded-full not-forced-colors:bg-current forced-colors:bg-[CanvasText]'
        />
      )}
      <span className='min-w-0 [overflow-wrap:anywhere]'>{children}</span>
    </span>
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../lib/utils.js'

/**
 * An empty state — what a list, table or search shows when it has nothing to
 * show, with a way forward. Add `border` for a dashed outline; the dashed
 * style is already set.
 */
function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty'
      className={cn(
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-md border-dashed p-8 text-center text-balance',
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty-header'
      className={cn('flex max-w-md flex-col items-center gap-2', className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "size-12 rounded-md bg-foreground/10 text-foreground [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot='empty-icon'
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/**
 * Rendered as a `div`, because the right heading level depends on where the
 * empty state sits. Where it stands in for a section's content, pass a heading
 * as the child (`<EmptyTitle><h2>No results</h2></EmptyTitle>`) so it appears
 * in the page outline.
 */
function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty-title'
      className={cn('font-heading text-2xl font-medium text-foreground', className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty-description'
      className={cn(
        // Bare anchors only: a class-carrying link (the package's Link) keeps its
        // own ink, underline and halo rather than being restyled here.
        'text-base/relaxed text-muted-foreground [&_a:not([class])]:underline [&_a:not([class])]:underline-offset-4 [&_a:not([class]):hover]:text-primary',
        className,
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty-content'
      className={cn(
        'flex w-full max-w-md min-w-0 flex-col items-center gap-4 text-base/relaxed text-balance',
        className,
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  emptyMediaVariants,
  EmptyTitle,
}

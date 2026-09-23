import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../lib/utils.js'

/**
 * The three approved looks (design-shotgun, overlays-20260923), matching the
 * `variant` of Dialog, AlertDialog and DropdownMenu so a loading state can
 * wear the same family as the surface around it:
 *
 * - `default` (Hairline): a filled block, 8px corners.
 * - `band`: a square-cornered band.
 * - `rule`: an outlined block in the strong border colour, no fill.
 *
 * The fills are the ink at 10–12%, not `bg-muted`: in dark mode `--muted` and
 * `--background` resolve to the same token, so a muted block vanishes on the
 * page, while an ink tint reads on the page, a card and a popover alike.
 */
const skeletonVariants = cva('motion-safe:animate-pulse', {
  variants: {
    variant: {
      default: 'rounded-md bg-foreground/10',
      band: 'rounded-none bg-foreground/12',
      rule: 'rounded-sm border border-(--border-strong) bg-transparent',
    },
  },
  defaultVariants: { variant: 'default' },
})

/**
 * A placeholder block shown where content is still loading. Size it with
 * utilities (`h-4 w-48`, `size-12 rounded-full`) to echo the shape of what
 * will replace it.
 *
 * It is purely visual, so announce the wait yourself: put `aria-busy="true"`
 * on the region being loaded, and give screen-reader users a text status
 * (a visually hidden "Loading…") rather than relying on these shapes. The
 * pulse only runs under `prefers-reduced-motion: no-preference`.
 */
function Skeleton({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof skeletonVariants>) {
  // Coalesce before cva: it treats `null` as "no variant" and skips the
  // default, which would leave the block with no fill at all.
  const look = variant ?? 'default'
  return (
    <div
      data-slot='skeleton'
      data-variant={look}
      className={cn(skeletonVariants({ variant: look, className }))}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }

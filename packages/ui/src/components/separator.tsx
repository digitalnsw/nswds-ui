'use client'

import type * as React from 'react'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'

import { cn } from '../lib/utils.js'

type SeparatorProps = SeparatorPrimitive.Props & {
  /**
   * When true, the separator is purely presentational and is hidden from
   * assistive tech by setting `role="none"`. Defaults to `false`, in which
   * case Base UI's default `role="separator"` is left intact so AT users
   * hear it as a region boundary.
   */
  decorative?: boolean
}

function Separator({
  className,
  orientation = 'horizontal',
  decorative = false,
  role,
  ref,
  ...props
}: SeparatorProps) {
  // Base UI's Separator emits `data-orientation="horizontal|vertical"` for
  // CSS targeting AND `aria-orientation` for assistive tech. The previous
  // `data-horizontal:` / `data-vertical:` selectors targeted non-existent
  // boolean attributes and never matched, leaving the separator with no
  // explicit axis sizing.
  const sharedClassName = cn(
    'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
    className
  )

  // A consumer passing `role="none"` / `"presentation"` is asking for a
  // presentational separator just as `decorative` does — treat them the same.
  // Otherwise Base UI would still emit `aria-orientation` (which it sets from
  // the orientation prop regardless of role), recreating the axe
  // `aria-allowed-attr` violation that `decorative` exists to avoid.
  const isPresentational =
    decorative || role === 'none' || role === 'presentation'

  if (isPresentational) {
    // Render a plain <div> for presentational separators. Bypass the
    // primitive so the rendered element carries no ARIA semantics at all
    // (no `aria-orientation`).
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="separator"
        data-orientation={orientation}
        role="none"
        className={sharedClassName}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      />
    )
  }

  return (
    <SeparatorPrimitive
      ref={ref}
      data-slot="separator"
      orientation={orientation}
      role={role ?? 'separator'}
      className={sharedClassName}
      {...props}
    />
  )
}

export { Separator }
export type { SeparatorProps }

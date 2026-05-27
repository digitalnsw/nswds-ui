"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "../lib/utils.js"

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
  orientation = "horizontal",
  decorative = false,
  role,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      role={decorative ? "none" : role}
      className={cn(
        // Base UI's Separator emits `data-orientation="horizontal|vertical"`
        // only (see @base-ui/react SeparatorDataAttributes). The previous
        // `data-horizontal:` / `data-vertical:` selectors targeted
        // non-existent boolean attributes and never matched, leaving the
        // separator with no explicit axis sizing.
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
export type { SeparatorProps }

"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "../lib/utils.js"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
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

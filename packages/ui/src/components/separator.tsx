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
  // Base UI's Separator emits `data-orientation="horizontal|vertical"` for
  // CSS targeting AND `aria-orientation` for assistive tech. The previous
  // `data-horizontal:` / `data-vertical:` selectors targeted non-existent
  // boolean attributes and never matched, leaving the separator with no
  // explicit axis sizing.
  const sharedClassName = cn(
    "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
    className
  )

  if (decorative) {
    // Render a plain <div> for decorative separators. Base UI emits
    // `aria-orientation` based on the orientation prop regardless of role —
    // and aria-orientation is NOT a permitted attribute on `role="none"`
    // (axe rule: aria-allowed-attr). Bypass the primitive so the rendered
    // element is purely presentational, with no ARIA semantics at all.
    return (
      <div
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
      data-slot="separator"
      orientation={orientation}
      role={role ?? "separator"}
      className={sharedClassName}
      {...props}
    />
  )
}

export { Separator }
export type { SeparatorProps }

import { cn } from '@nswds/ui'
import type * as React from 'react'

type DemoPanelProps = {
  children: React.ReactNode
  /**
   * Full-bleed demos (page chrome like Header, Footer, MainNav) drop the
   * centring padding so the component can span the panel edge to edge.
   */
  bleed?: boolean
  className?: string
}

/** The framed live-preview surface used on component and pattern pages. */
function DemoPanel({ children, bleed = false, className }: DemoPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-background ring-1 ring-foreground/10',
        // Dotted engineering-paper texture, from the foreground ink so it
        // holds in both themes.
        'bg-[radial-gradient(color-mix(in_oklch,var(--foreground)_12%,transparent)_1px,transparent_1px)] bg-[size:16px_16px]',
        bleed ? 'p-0' : 'flex min-h-64 items-center justify-center px-6 py-12 sm:px-10',
        className,
      )}
    >
      {children}
    </div>
  )
}

export { DemoPanel }

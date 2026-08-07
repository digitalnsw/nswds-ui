import type * as React from 'react'

import { cn } from '../lib/utils.js'

type SkeletonProps = React.ComponentProps<'div'>

/**
 * Loading placeholder block.
 *
 * A pulsing `bg-muted` rectangle; size and shape it with utility classes
 * (`h-4 w-40`, `size-10 rounded-pill`, …). Purely presentational and
 * server-renderable — no hooks, no browser APIs, no 'use client'.
 *
 * Accessibility contract: a skeleton is decorative. It renders no text and no
 * ARIA role, so screen readers skip it. Announce the *loading state itself* on
 * the region being populated (e.g. `aria-busy="true"` on the container, or a
 * polite live region), not on individual skeleton blocks — per WCAG 2.2 SC
 * 4.1.3 (Status Messages) the status belongs to the content area, and a
 * per-block announcement would be noise. The pulse deliberately runs even
 * under `prefers-reduced-motion`: it animates opacity only — no movement —
 * so it is outside what SC 2.3.3 (Animation from Interaction) asks to be
 * reducible, and it is the one cue that the region is still loading. Add
 * `motion-reduce:animate-none` per instance to opt out.
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot='skeleton'
      className={cn('animate-pulse rounded-sm bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }

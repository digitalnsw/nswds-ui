import type * as React from 'react'

import { Separator } from '../components/separator.js'
import { cn } from '../lib/utils.js'

/**
 * A horizontal divider broken by a centred label — e.g. the "or" rule that
 * separates one sign-in method from another in a login form.
 *
 * Always renders a label (defaulting to "or"); it is not a plain horizontal
 * rule. For an unbroken divider, use the `Separator` component instead.
 *
 * The two flanking rules are rendered `decorative` (role="none") because the
 * visible label already conveys the boundary to assistive tech; exposing two
 * `role="separator"` elements either side of it would be redundant noise.
 */
function LabeledSeparator({
  className,
  children = 'or',
  ...props
}: React.ComponentProps<'div'> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="labeled-separator"
      className={cn('flex items-center gap-3', className)}
      {...props}
    >
      <Separator decorative className="flex-1" />
      <span
        data-slot="labeled-separator-content"
        className="shrink-0 text-sm text-muted-foreground"
      >
        {children}
      </span>
      <Separator decorative className="flex-1" />
    </div>
  )
}

export { LabeledSeparator }

export type LabeledSeparatorProps = React.ComponentProps<
  typeof LabeledSeparator
>

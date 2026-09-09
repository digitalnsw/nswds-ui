'use client'

import * as React from 'react'

type ButtonGroupOrientation = 'horizontal' | 'vertical'

/**
 * What a ButtonGroup hands its segments: its `color` and `size` as their
 * defaults, and its orientation for the separator.
 *
 * `color` and `size` are typed as plain strings here, deliberately. This
 * module ships as a supporting file of every popup in the package (each one
 * resets the context at its portal — see `ButtonGroupBoundary`), and even a
 * type-only import of Button from here would make Button a registry
 * dependency of Tooltip, Select and the rest. button.tsx narrows the two
 * fields to its own unions at the one place it reads them.
 */
type ButtonGroupContextValue<Color = string, Size = string> = {
  color?: Color | null
  size?: Size | null
  orientation: ButtonGroupOrientation
}

/**
 * Provided by ButtonGroup and read by Button and ButtonLink, which render as
 * segments while it is set. `null` outside a group, and again inside a
 * `ButtonGroupBoundary`.
 */
const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null)

/**
 * Stops a ButtonGroup's context at a portal.
 *
 * React context follows the component tree, not the DOM. A Popover, Sheet,
 * Tooltip or Drawer opened from a segment renders its contents through a
 * portal, so without this its own Buttons would render as segments too:
 * squared, shadowless, ghost, and under a solid group inked in the band's
 * label colour on whatever surface the popup has. The CSS half of the segment
 * treatment keys on DOM ancestry and would not follow, so the two halves
 * would disagree. Every popup in this package wraps its portal contents in
 * this boundary; an overlay from another library, opened from inside a
 * group, should do the same.
 */
function ButtonGroupBoundary({ children }: { children: React.ReactNode }) {
  return <ButtonGroupContext.Provider value={null}>{children}</ButtonGroupContext.Provider>
}

export { ButtonGroupBoundary, ButtonGroupContext }
export type { ButtonGroupContextValue, ButtonGroupOrientation }

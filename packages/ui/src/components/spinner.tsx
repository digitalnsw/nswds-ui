'use client'

import * as React from 'react'
import { cn } from '../lib/utils.js'

const theme = {
  size: {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  },
  color: {
    primary: 'fill-primary-800 text-grey-400',
    accent: 'fill-accent-600 text-grey-400',
    white: 'fill-white text-white/30',
    // Inherit the surrounding text colour (e.g. inside a Button, where the
    // text colour varies per variant/colour). The arc uses currentColor at
    // full strength; the track is the same colour dimmed via opacity on the
    // first <path>, so the two-tone effect works from a single hue.
    current: 'fill-current text-current [&>path:first-child]:opacity-25',
  },
}

type SpinnerProps = {
  /** Applied to the outer status element, like every other spread prop. */
  className?: string
  /** Applied to the inner svg (sizing/colour live there). */
  svgClassName?: string
  size?: keyof typeof theme.size
  color?: keyof typeof theme.color
  /**
   * Accessible name announced for the `role="status"` element. Defaults to
   * "Loading"; pass an empty string to suppress when surrounding content
   * already conveys the busy state (e.g. inside a Button with a label).
   */
  label?: string
} & React.HTMLAttributes<HTMLSpanElement> & {
    ref?: React.Ref<HTMLSpanElement>
  }

function Spinner({
  className,
  svgClassName,
  size = 'md',
  color = 'primary',
  label = 'Loading',
  ref,
  ...props
}: SpinnerProps) {
  // An empty label suppresses the live region entirely: a `role="status"`
  // element with no text content is an empty, redundant live region (e.g. when
  // the Spinner sits inside a Button whose own `aria-busy` conveys the state).
  // A consumer-supplied `role` in `...props` still wins, as before.
  const labelled = label !== ''
  return (
    <span ref={ref} role={labelled ? 'status' : undefined} className={className} {...props}>
      <svg
        fill='none'
        viewBox='0 0 100 101'
        aria-hidden='true'
        className={cn(
          'inline motion-safe:animate-spin',
          theme.color[color],
          theme.size[size],
          svgClassName,
        )}
      >
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
      {labelled ? <span className='sr-only'>{label}</span> : null}
    </span>
  )
}

export { Spinner }
export type { SpinnerProps }

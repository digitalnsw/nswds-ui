import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils.js'

// Colour pairs are curated for WCAG 2.2 AAA (1.4.6 Contrast Enhanced): every
// text/background combination below resolves to at least 7:1, in BOTH themes.
// This is why the Masthead does not accept the full Button colour palette —
// accent/danger/warning backgrounds with white text sit under 7:1 and would
// silently break the AAA guarantee. Add new colours only with a verified pair.
//
// Light mode: 14.4 (dark), 17.4 (light), 19.0 (white), 15.1 (grey).
// Dark mode:  20.0 (dark), 17.2 (light), 19.0 (white), 20.2 (grey).
//
// Every variant deepens in dark mode, on the same ramp steps `Header` uses —
// -100→-850, white→-900, -800→-950 — because the two are designed to be themed
// together and sit flush against each other. Only `dark` used to flip: a
// `white` masthead stayed pure white above a `grey-900` header, an 18.9:1 band
// across the top of a dark page, and `light` did the same at 15.8:1. The
// asymmetry was the tell that this was an omission rather than a policy — a
// deliberately theme-invariant set would not have flipped one of its four.
const mastheadColors = {
  // Legacy .nsw-masthead (brand dark).
  dark: 'bg-primary-800 text-white dark:bg-primary-950',
  // Legacy .nsw-masthead--light (off-white). grey-100 is the same value as
  // the legacy --nsw-off-white (#f2f2f2).
  light: 'bg-grey-100 text-grey-900 dark:bg-grey-850 dark:text-white',
  white: 'bg-white text-grey-900 dark:bg-grey-900 dark:text-white',
  grey: 'bg-grey-800 text-white dark:bg-grey-950',
}

type MastheadColor = keyof typeof mastheadColors

// Shared by cva's defaultVariants and the data-color attribute, so the two
// can't drift apart — the same arrangement as Header, Footer and MainNav.
const DEFAULT_MASTHEAD_COLOR: MastheadColor = 'dark'

const mastheadVariants = cva('w-full text-xs', {
  variants: {
    color: mastheadColors,
  },
  defaultVariants: {
    color: DEFAULT_MASTHEAD_COLOR,
  },
})

const mastheadContainerVariants = cva(
  [
    'mx-auto flex w-full items-center justify-between gap-x-4 py-2',
    // Lateral padding funnels through --masthead-padding-x so an app can
    // retune it once (via the `style` prop or a utility class) without a new
    // variant. Defaults reproduce the nswds-app rhythm: 16px → 24px → 48px.
    'px-(--masthead-padding-x)',
    '[--masthead-padding-x:--spacing(4)] sm:[--masthead-padding-x:--spacing(6)] lg:[--masthead-padding-x:--spacing(12)]',
  ],
  {
    variants: {
      container: {
        // Full-bleed (nswds-app style). --masthead-max-width is still read so
        // a shell app can constrain the inner wrapper without switching
        // variants (the archive/practice `#nsw-masthead > div` override).
        fluid: 'max-w-[var(--masthead-max-width,none)]',
        // Centred content column, legacy nsw-container parity (1200px).
        contained: 'max-w-[var(--masthead-max-width,75rem)]',
      },
    },
    defaultVariants: {
      container: 'fluid',
    },
  },
)

type MastheadProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof mastheadVariants> &
  VariantProps<typeof mastheadContainerVariants> & {
    /** Classes applied to the inner width-constraining wrapper. */
    containerClassName?: string
    ref?: React.Ref<HTMLDivElement>
  }

/**
 * The "A NSW Government website" strip shown above the site header on every
 * NSW Government page. Successor to the legacy `.nsw-masthead`.
 *
 * - `color` selects a WCAG 2.2 AAA text/background pair (`dark` matches the
 *   legacy default, `light` matches the legacy `--light` theme).
 * - `container` selects the inner wrapper layout: `fluid` (full-bleed,
 *   nswds-app parity) or `contained` (centred 1200px column, legacy
 *   `nsw-container` parity). Fine-tune either with the `--masthead-max-width`
 *   and `--masthead-padding-x` custom properties.
 * - Children replace the default message; pass a `SkipLinks` sibling before
 *   the Masthead for bypass-blocks support.
 *
 * The default `id="nsw-masthead"` is kept for compatibility with existing
 * shells that target it (override via the `id` prop).
 */
function Masthead({
  className,
  color,
  container,
  containerClassName,
  children,
  ref,
  ...props
}: MastheadProps) {
  return (
    <div
      id='nsw-masthead'
      data-slot='masthead'
      // Named surface, exposed for styling hooks and test diagnostics — the
      // convention Header, Footer and MainNav already follow.
      data-color={color ?? DEFAULT_MASTHEAD_COLOR}
      {...props}
      className={cn(mastheadVariants({ color }), className)}
      ref={ref}
    >
      <div
        data-slot='masthead-container'
        className={cn(mastheadContainerVariants({ container }), containerClassName)}
      >
        {children ?? 'A NSW Government website'}
      </div>
    </div>
  )
}

export { Masthead, mastheadContainerVariants, mastheadVariants }
export type { MastheadColor, MastheadProps }

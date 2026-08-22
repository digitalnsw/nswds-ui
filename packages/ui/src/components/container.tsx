import type * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils.js'

/**
 * The page-width column, carrying the same lateral rhythm the chrome
 * components apply to their own inner wrappers.
 *
 * `Masthead`, `Header`, `MainNav` and `Footer` each declare a private
 * `*ContainerVariants` with an identical `16px → 24px → 48px` padding ramp
 * funnelled through a `--<name>-padding-x` custom property. Nothing exposed
 * that rhythm to page CONTENT, so every consuming app retyped it — and any
 * app that retyped it slightly differently got content that failed to line up
 * with the header above it at one breakpoint but not the others, which is the
 * hardest kind of misalignment to notice in review.
 *
 * The variant names (`fluid` / `contained`) and the `--container-max-width`
 * escape hatch deliberately mirror the chrome's vocabulary, so a shell that
 * themes its `Header` writes the same word here.
 */
const containerVariants = cva(
  [
    'mx-auto w-full',
    // Lateral padding funnels through --container-padding-x so an app can
    // retune it once (via the `style` prop or a utility class) without a new
    // variant. Same mechanism, and the same 16px → 24px → 48px rhythm, as
    // Masthead, Header, MainNav and Footer.
    'px-(--container-padding-x)',
    '[--container-padding-x:--spacing(4)] sm:[--container-padding-x:--spacing(6)] lg:[--container-padding-x:--spacing(12)]',
  ],
  {
    variants: {
      size: {
        // Full-bleed. Matches the chrome components' own default, so page
        // content and the header line up without either side being
        // reconfigured — the case that has to be right by default.
        // --container-max-width is still read so a shell app can constrain the
        // column without switching variants.
        fluid: 'max-w-[var(--container-max-width,none)]',
        // Centred content column, legacy nsw-container parity (1200px). The
        // counterpart to the chrome's `container="contained"`.
        contained: 'max-w-[var(--container-max-width,75rem)]',
        // A wider editorial column for landing and specimen pages that want
        // more than 1200px without going full-bleed.
        wide: 'max-w-[var(--container-max-width,90rem)]',
        // Reading measure — roughly 65–75 characters at the body size, for
        // long-form prose that should not span a full-width page.
        narrow: 'max-w-[var(--container-max-width,45rem)]',
      },
    },
    defaultVariants: {
      size: 'fluid',
    },
  },
)

type ContainerProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof containerVariants> & {
    ref?: React.Ref<HTMLDivElement>
  }

/**
 * Width-constraining page column with the NSW lateral rhythm.
 *
 * Purely presentational — it renders a `<div>` and adds no semantics, so it
 * can sit inside any landmark without affecting the document outline. Pair it
 * with `Section` for vertical rhythm.
 */
function Container({ className, size, ref, ...props }: ContainerProps) {
  return (
    <div
      ref={ref}
      data-slot='container'
      className={cn(containerVariants({ size, className }))}
      {...props}
    />
  )
}

export { Container, containerVariants }
export type { ContainerProps }

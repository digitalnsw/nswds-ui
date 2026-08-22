import type * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils.js'

/**
 * Vertical rhythm for a top-level page section.
 *
 * Every step is written as a set of MUTUALLY EXCLUSIVE breakpoint ranges
 * (`max-sm:` / `sm:max-lg:` / `lg:`) rather than a bare utility plus responsive
 * overrides. `py-16 sm:py-20 lg:py-28` renders identically here but is
 * order-dependent across two Tailwind builds: an npm consumer's own build
 * re-emits any utility they also use, a media query carries no extra
 * specificity, and their plain `.py-16` would then outrank our `.lg:py-28` on
 * an element they never referenced. `check:cascade` fails the build on the
 * unsafe form — see its script header, and AGENTS.md §4 Step 1.
 */
const sectionVariants = cva('', {
  variants: {
    spacing: {
      default: 'max-sm:py-16 sm:max-lg:py-20 lg:py-28',
      tight: 'max-sm:py-10 sm:max-lg:py-12 lg:py-16',
      loose: 'max-sm:py-20 sm:max-lg:py-28 lg:py-36',
      // For a section that supplies its own padding, or one butted against a
      // neighbour that already carries the gap.
      none: '',
    },
    /**
     * Hairline rule along the bottom edge, for stacking sections on one
     * surface without alternating background colours.
     */
    divider: {
      true: 'border-b border-border',
      false: '',
    },
  },
  defaultVariants: {
    spacing: 'default',
    divider: false,
  },
})

type SectionProps = React.ComponentPropsWithoutRef<'section'> &
  VariantProps<typeof sectionVariants> & {
    /**
     * `id` of the heading that names this section. Required for the section to
     * be exposed as a `region` landmark — see the note on the component.
     */
    labelledBy?: string
    ref?: React.Ref<HTMLElement>
  }

/**
 * A top-level page section with the house vertical rhythm.
 *
 * **Naming is what makes it a landmark.** A bare `<section>` is a generic
 * container in the accessibility tree; it is only exposed as a `region` — and
 * so only reachable by landmark navigation — once it has an accessible name.
 * Pass `labelledBy` pointing at the `id` of the section's own heading, or
 * `aria-label` where there is no visible heading to point at. This component
 * deliberately does NOT invent a fallback name: an auto-generated label would
 * put an unhelpful entry in the landmark list (WCAG 2.2, 1.3.1) and hide the
 * omission from review.
 *
 * Pair with `Container` for the lateral rhythm:
 *
 * ```tsx
 * <Section id='specimen' labelledBy='specimen-heading' divider>
 *   <Container>
 *     <h2 id='specimen-heading'>Nine weights, one file</h2>
 *   </Container>
 * </Section>
 * ```
 */
function Section({ className, spacing, divider, labelledBy, ref, ...props }: SectionProps) {
  return (
    <section
      ref={ref}
      data-slot='section'
      aria-labelledby={labelledBy}
      className={cn(sectionVariants({ spacing, divider, className }))}
      {...props}
    />
  )
}

export { Section, sectionVariants }
export type { SectionProps }

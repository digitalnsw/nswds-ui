import type * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils.js'

/**
 * Term/detail pairs — metadata strips, summary rows, key–value facts.
 *
 * **This name shipped once before and was removed.** `DescriptionList` was
 * dropped from the public API as a BREAKING CHANGE in v3 (commit 09d6db3),
 * incidentally, inside a commit whose subject was adding ten unrelated
 * components; its registry item then outlived it by three releases until
 * `check:registry-resolves` caught the orphan. Consumers were told to migrate
 * off it, so this is a deliberate re-introduction rather than a revert, and it
 * is not source-compatible with the old one:
 *
 * - The old markup was a single hardcoded grid
 *   (`sm:grid-cols-[min(50%,--spacing(80))_auto]`) with no way to opt out.
 *   Layout is now a variant.
 * - The old classes were cascade-unsafe in exactly the way `check:cascade`
 *   now fails a build for — `text-base/6 sm:text-sm/6` and
 *   `border-t … sm:border-t` are bare utilities paired with responsive
 *   overrides of the same property, so an npm consumer's own Tailwind build
 *   could outrank them. Every responsive step here is a mutually exclusive
 *   range instead.
 * - The old type ramp dropped to 14px from `sm` up. Body copy holds at 16px.
 */
const descriptionListVariants = cva('', {
  variants: {
    layout: {
      /**
       * Terms above details, stacked in one column at every width. The safe
       * default: it never truncates a long term and needs no width assumptions.
       */
      stacked: 'flex flex-col gap-4',
      /**
       * Two columns from `sm` up — term in the first, detail in the second —
       * collapsing to `stacked` below it. The classic definition-list
       * treatment for short terms.
       */
      columns:
        'grid gap-x-8 gap-y-4 max-sm:grid-cols-1 sm:grid-cols-[minmax(0,--spacing(60))_minmax(0,1fr)]',
      /**
       * Facts side by side, wrapping as they run out of room — the strip
       * under a page banner. Terms sit above their details within each cell.
       */
      inline: 'grid gap-x-8 gap-y-6 max-sm:grid-cols-2 sm:grid-cols-4',
    },
  },
  defaultVariants: {
    layout: 'stacked',
  },
})

type DescriptionListProps = React.ComponentPropsWithoutRef<'dl'> &
  VariantProps<typeof descriptionListVariants> & {
    ref?: React.Ref<HTMLDListElement>
  }

/**
 * A `<dl>` of term/detail pairs.
 *
 * **`columns` and `inline` place their own children, so each pair must be
 * wrapped in a single element.** A `<dl>` may contain `<div>` wrappers around
 * `<dt>`/`<dd>` groups — that is valid HTML and preserves the list semantics —
 * and it is what keeps a term with its detail when the grid wraps. Without the
 * wrapper the grid places every `<dt>` and `<dd>` independently and pairs come
 * apart at the wrap point:
 *
 * ```tsx
 * <DescriptionList layout='inline'>
 *   <div>
 *     <DescriptionTerm>Version</DescriptionTerm>
 *     <DescriptionDetails>2.001</DescriptionDetails>
 *   </div>
 * </DescriptionList>
 * ```
 *
 * `stacked` has no such requirement — wrap or don't, it reads the same.
 */
function DescriptionList({ className, layout, ref, ...props }: DescriptionListProps) {
  return (
    <dl
      ref={ref}
      data-slot='description-list'
      data-layout={layout ?? 'stacked'}
      className={cn(descriptionListVariants({ layout, className }))}
      {...props}
    />
  )
}

type DescriptionTermProps = React.ComponentPropsWithoutRef<'dt'> & {
  ref?: React.Ref<HTMLElement>
}

/** The term half of a pair — the label. */
function DescriptionTerm({ className, ref, ...props }: DescriptionTermProps) {
  return (
    <dt
      ref={ref}
      data-slot='description-term'
      className={cn('text-base/relaxed text-muted-foreground', className)}
      {...props}
    />
  )
}

type DescriptionDetailsProps = React.ComponentPropsWithoutRef<'dd'> & {
  ref?: React.Ref<HTMLElement>
}

/**
 * The detail half of a pair — the value.
 *
 * `ms-0` is deliberate: browsers give `<dd>` a 40px `margin-inline-start` by
 * default, which the grid layouts would otherwise indent every value by. It is
 * an unconditional reset, so it does not fight the responsive ramp.
 */
function DescriptionDetails({ className, ref, ...props }: DescriptionDetailsProps) {
  return (
    <dd
      ref={ref}
      data-slot='description-details'
      className={cn('ms-0 text-base/relaxed text-foreground', className)}
      {...props}
    />
  )
}

export { DescriptionDetails, DescriptionList, descriptionListVariants, DescriptionTerm }
export type { DescriptionDetailsProps, DescriptionListProps, DescriptionTermProps }

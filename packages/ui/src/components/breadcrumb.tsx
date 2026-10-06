import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { IconChevronRight } from '../icons/chevron-right.js'
import { IconMoreHoriz } from '../icons/more-horiz.js'
import { cn } from '../lib/utils.js'

/**
 * The four approved looks (design-shotgun, breadcrumb-20261006), set on
 * `Breadcrumb` and read by every part through `group-data-*`:
 *
 * - `default` (Ink trail): no chrome; underlined ink links and chevrons.
 * - `rail`: the masterbrand line system — 1px hairlines above and below in the
 *   text colour, Light-weight slash separators.
 * - `band`: a solid Blue 01 band with white links. `primary-800` is a palette
 *   step on purpose and stays put in dark, like Header's `dark` band; the
 *   labels are white in both modes for the same reason Button's solid labels
 *   are (`--text-inverse` flips).
 * - `soft`: a 10% ink tint with a 30% ink hairline under it.
 *
 * Every part speaks through three variables the variant sets: `--bc-ink` (the
 * links, the focus bar, the ellipsis trigger), `--bc-current` and
 * `--bc-separator`. The ink is primary-800 light / primary-200 dark, the same
 * pair as Link's `primary` variant.
 */
const breadcrumbVariants = cva(
  'group/breadcrumb text-base/6 [--bc-current:var(--foreground)] [--bc-separator:var(--muted-foreground)]',
  {
    variants: {
      variant: {
        default: '[--bc-ink:var(--color-primary-800)] dark:[--bc-ink:var(--color-primary-200)]',
        rail: 'border-y border-foreground py-0.5 [--bc-ink:var(--color-primary-800)] dark:[--bc-ink:var(--color-primary-200)]',
        band: 'bg-primary-800 px-4 py-1 [--bc-current:var(--color-white)] [--bc-ink:var(--color-white)] [--bc-separator:color-mix(in_oklab,var(--color-white)_72%,transparent)]',
        soft: 'border-b border-(--bc-ink)/30 bg-(--bc-ink)/10 px-4 py-1 [--bc-ink:var(--color-primary-800)] dark:[--bc-ink:var(--color-primary-200)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

/**
 * `collapse` opts in to the narrow trail: when the breadcrumb is narrower than
 * 36rem only the parent page shows, as a back link — "‹ Licences and permits".
 * The page heading already names the current page, so the trail's one job on
 * a phone is the way up. It is opt-in because it hides steps, which would
 * change every existing trail on a phone.
 *
 * It measures the breadcrumb, not the viewport: with `collapse` the nav is a
 * named size container, so a trail in a narrow column collapses on a wide
 * screen too. That containment means the nav must get its width from its
 * parent (block or stretched flex item); in a shrink-to-fit context it would
 * size to zero, which is why it is only applied when `collapse` is on.
 */
function Breadcrumb({
  className,
  variant = 'default',
  collapse = false,
  ...props
}: React.ComponentProps<'nav'> &
  VariantProps<typeof breadcrumbVariants> & {
    collapse?: boolean
  }) {
  return (
    <nav
      aria-label='breadcrumb'
      data-slot='breadcrumb'
      data-variant={variant}
      data-collapse={collapse || undefined}
      className={cn(
        breadcrumbVariants({ variant }),
        'data-collapse:@container/breadcrumb',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The collapse rules key on the trail's shape rather than on markers the
 * consumer must add: the parent is the item two before the end, with a
 * separator between it and the current page. They apply only when that parent
 * holds a link, so a trail of one item, or one whose parent slot is the
 * ellipsis, stays whole instead of collapsing to nothing or to a menu button.
 * (One `:has()` per condition: `:has()` cannot nest.) The back chevron is a
 * masked `::before` in the ink, so no extra element is added to every link;
 * it is the chevron-left icon's own path.
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        'flex flex-wrap items-center gap-x-2 wrap-break-word text-(--bc-separator) group-data-[variant=rail]/breadcrumb:gap-x-3',
        'group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:not(:nth-last-child(3))]:hidden',
        'group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)]:before:-me-1 group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)]:before:size-5 group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)]:before:shrink-0 group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)]:before:bg-(--bc-ink) group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)]:before:[mask:url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%20-960%20960%20960%27%3E%3Cpath%20d=%27m432-480%20156%20156q11%2011%2011%2028t-11%2028q-11%2011-28%2011t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8%202.5-15t8.5-13l184-184q11-11%2028-11t28%2011q11%2011%2011%2028t-11%2028L432-480Z%27/%3E%3C/svg%3E)_center/contain_no-repeat] group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)]:rtl:before:rotate-180',
        className,
      )}
      {...props}
    />
  )
}

/**
 * One step in the trail. Rows are 44px tall so every link and the ellipsis
 * trigger clear the WCAG 2.2 target size with room to spare.
 *
 * A `<button>` whose direct child is a `BreadcrumbEllipsis` is styled as the
 * ellipsis trigger — this is how the trail stays composable with
 * `DropdownMenuTrigger` (or any other trigger) without Breadcrumb importing a
 * menu. The trigger takes the links' ink, a tint on hover and while open, and
 * the same focus bar as the links: a 4px ink bar along the bottom edge on a 14%
 * ink tint. The transparent outline keeps a ring in forced-colors mode, where
 * box-shadow and backgrounds are dropped.
 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='breadcrumb-item'
      className={cn(
        'inline-flex min-h-11 min-w-0 items-center gap-2',
        '[&>button:has(>[data-slot=breadcrumb-ellipsis])]:inline-flex [&>button:has(>[data-slot=breadcrumb-ellipsis])]:h-8 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:min-w-8 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:cursor-pointer [&>button:has(>[data-slot=breadcrumb-ellipsis])]:items-center [&>button:has(>[data-slot=breadcrumb-ellipsis])]:justify-center [&>button:has(>[data-slot=breadcrumb-ellipsis])]:border-0 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:bg-transparent [&>button:has(>[data-slot=breadcrumb-ellipsis])]:px-1 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:text-(--bc-ink)',
        '[&>button:has(>[data-slot=breadcrumb-ellipsis])]:hover:bg-(--bc-ink)/14 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:aria-expanded:bg-(--bc-ink)/14',
        '[&>button:has(>[data-slot=breadcrumb-ellipsis])]:focus-visible:bg-(--bc-ink)/14 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:focus-visible:shadow-[inset_0_-4px_0_var(--bc-ink)] [&>button:has(>[data-slot=breadcrumb-ellipsis])]:focus-visible:ring-4 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:focus-visible:ring-(--bc-ink)/14 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:focus-visible:outline-2 [&>button:has(>[data-slot=breadcrumb-ellipsis])]:focus-visible:outline-transparent [&>button:has(>[data-slot=breadcrumb-ellipsis])]:focus-visible:outline-solid',
        className,
      )}
      {...props}
    />
  )
}

/**
 * A link in the trail: underlined in the ink at rest, so it reads as a link
 * without hovering, thickening to 2px on hover. Keyboard focus is the bar —
 * a 4px underline on a 14% ink tint, padded out by a 4px ring of the same tint
 * so it never shifts layout. `box-decoration-break: clone` gives each line of a
 * wrapped link its own tint.
 */
function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<'a'>) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          '[box-decoration-break:clone] text-(--bc-ink) underline decoration-1 underline-offset-4 [-webkit-box-decoration-break:clone] hover:decoration-2',
          'focus-visible:bg-(--bc-ink)/14 focus-visible:decoration-(--bc-ink) focus-visible:decoration-4 focus-visible:ring-4 focus-visible:ring-(--bc-ink)/14 focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-solid',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'breadcrumb-link',
    },
  })
}

/**
 * The current page's entry in the trail — plain text, not a link.
 *
 * Carries `aria-current='page'` and nothing else. The upstream shadcn version
 * adds `role='link' aria-disabled='true'` to a `<span>` that has no `href` and
 * no `tabIndex`, which makes AT announce "link, dimmed, current page" for
 * something that is neither a link nor operable, and puts a hand-rolled ARIA
 * role on an element that needs none. axe-core does not flag it, so it
 * survives an a11y gate set to `error`; it is removed deliberately here.
 *
 * SemiBold on the rail and the bands, where the trail ends on a heavier word.
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='breadcrumb-page'
      aria-current='page'
      className={cn(
        'font-normal text-(--bc-current) group-data-[variant=band]/breadcrumb:font-semibold group-data-[variant=rail]/breadcrumb:font-semibold group-data-[variant=soft]/breadcrumb:font-semibold',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Decorative and hidden from assistive tech. The default glyph is a chevron,
 * or a Light-weight slash on the rail; both are rendered and the variant shows
 * one, so the separator needs no context to know where it sits.
 */
function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='breadcrumb-separator'
      role='presentation'
      aria-hidden='true'
      className={cn('inline-flex items-center [&>svg]:size-5', className)}
      {...props}
    >
      {children ?? (
        <>
          <IconChevronRight className='group-data-[variant=rail]/breadcrumb:hidden rtl:rotate-180' />
          <span className='hidden text-xl/6 font-light group-data-[variant=rail]/breadcrumb:inline'>
            /
          </span>
        </>
      )}
    </li>
  )
}

/**
 * The collapsed-steps glyph. Decorative on its own: to make it open the hidden
 * steps, put it as the only child of a trigger and give the trigger the
 * accessible name, e.g.
 * `<DropdownMenuTrigger aria-label='Show 2 more pages'><BreadcrumbEllipsis /></DropdownMenuTrigger>`.
 * BreadcrumbItem styles that trigger. Give the menu `sideOffset={14}`: the trigger
 * is 32px in a 44px row, so the default 4px opens it over the band or rail edge.
 */
function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='breadcrumb-ellipsis'
      role='presentation'
      aria-hidden='true'
      className={cn('flex size-6 items-center justify-center [&>svg]:size-6', className)}
      {...props}
    >
      <IconMoreHoriz />
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  breadcrumbVariants,
}

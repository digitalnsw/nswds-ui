import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { IconChevronLeft } from '../icons/chevron-left.js'
import { IconChevronRight } from '../icons/chevron-right.js'
import { IconMoreHoriz } from '../icons/more-horiz.js'
import { overlayInk } from '../lib/overlay.js'
import { cn } from '../lib/utils.js'
import { TouchTarget } from './button.js'

/**
 * The three variables every non-band look shares: the interactive ink (read
 * from `overlayInk`, so a retune of the ink is one edit — AGENTS.md §3), the
 * current page in the text colour and muted separators. Each variant sets all
 * three itself rather than overriding a base value, so the class string never
 * holds two declarations of one property — the exported `breadcrumbVariants`
 * stays correct without tailwind-merge, where the stylesheet's emission order
 * would otherwise pick the winner.
 */
const onSurface =
  '[--bc-current:var(--foreground)] [--bc-ink:var(--overlay-ink)] [--bc-separator:var(--muted-foreground)]'

/**
 * The four looks, set on `Breadcrumb` and read by every part through
 * `group-data-*` (DESIGN.md, Breadcrumb):
 *
 * - `default`: no chrome; underlined ink links and chevrons. Use it unless the
 *   page has a reason not to.
 * - `rail`: the masterbrand line system — hairlines above and below in the
 *   text colour, slash separators. For a page whose top is already quiet.
 * - `band`: the solid brand band — Blue 01 with white links, deepening to
 *   `primary-950` in dark exactly as Header's `dark` colour does, so a band
 *   under that header stays flush in both modes (AGENTS.md §3 brand band).
 *   Labels are white in both modes for the reason Button's solid labels are:
 *   `--text-inverse` flips.
 * - `soft`: a 10% ink tint with a 30% ink hairline under it.
 *
 * Every part speaks through `--bc-ink` (links, halos, focus rings, the ellipsis
 * trigger, the back chevron), `--bc-current` and `--bc-separator`.
 */
const breadcrumbVariants = cva(['group/breadcrumb text-base/6', overlayInk], {
  variants: {
    variant: {
      default: onSurface,
      rail: ['border-y border-foreground py-2', onSurface],
      band: 'bg-primary-800 px-4 py-2 [--bc-current:var(--color-white)] [--bc-ink:var(--color-white)] [--bc-separator:color-mix(in_oklab,var(--color-white)_72%,transparent)] dark:bg-primary-950',
      soft: ['border-b border-(--bc-ink)/30 bg-(--bc-ink)/10 px-4 py-2', onSurface],
    },
  },
  defaultVariants: { variant: 'default' },
})

/**
 * The `sideOffset` to give a DropdownMenuContent opened from the ellipsis. The
 * trigger is 32px in a 24px line and the band, tint and rail add 8px of their
 * own edge, so the menu's default 4px would open it over that edge; 14px
 * clears all four looks.
 */
const BREADCRUMB_MENU_OFFSET = 14

/**
 * The trail's landmark. `aria-label` defaults to "Breadcrumb" and can be
 * overridden (a page with two trails needs two names).
 *
 * `collapse` is on by default for `default`, `band` and `soft`: when the
 * breadcrumb is narrower than 36rem only the parent page shows, as a back link
 * — "‹ Licences and permits", announced "Back to Licences and permits". The
 * page heading already names the current page, so on a phone the trail's one
 * job is the way up, and a wrapped trail costs two or three lines of chrome
 * above that heading. `rail` never collapses: it is chosen for a quiet page
 * where the whole line is the point. Pass `collapse={false}` to keep the full
 * trail everywhere.
 *
 * It measures the breadcrumb, not the viewport: when collapsing, the nav is a
 * named size container, so a trail in a narrow column collapses on a wide
 * screen too. Size containment gives the nav no intrinsic width, so it also
 * takes `w-full` — without it a shrink-to-fit parent (a `flex items-center`
 * header) would size it to zero. Both are plain classes, so a consumer `w-*`
 * still wins.
 */
function Breadcrumb({
  className,
  variant,
  collapse = true,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...props
}: React.ComponentProps<'nav'> &
  VariantProps<typeof breadcrumbVariants> & {
    collapse?: boolean
  }) {
  // VariantProps admits null, which cva reads as "no variant" and would leave
  // every --bc-* variable unset.
  const look = variant ?? 'default'
  const collapses = collapse && look !== 'rail'
  return (
    <nav
      aria-label={ariaLabel}
      data-slot='breadcrumb'
      data-variant={look}
      data-collapse={collapses || undefined}
      className={cn(
        breadcrumbVariants({ variant: look }),
        collapses && '@container/breadcrumb w-full',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Default separators are drawn by the item after them (BreadcrumbItem's lead),
 * so a wrapped line starts with its separator and its target together instead
 * of stranding a chevron at the end of the line above. The separator `<li>`
 * stays in the tree — it is what the collapse rules count — but renders
 * nothing. A separator with custom children is drawn where it stands.
 *
 * The collapse rules key on the trail's shape rather than on markers the
 * consumer must add: the parent is the item two before the end, with a
 * separator between it and the current page. They apply only when that parent
 * holds a link, so a trail of one item, or one whose parent slot is the
 * ellipsis, stays whole instead of collapsing to nothing or to a menu button.
 * (One `:has()` per condition: `:has()` cannot nest.) The parent's lead
 * separator gives way to the back chevron its BreadcrumbLink carries, which
 * sits inside the link's target.
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-2 wrap-break-word text-(--bc-separator) group-data-[variant=rail]/breadcrumb:gap-x-3',
        '[&>[data-slot=breadcrumb-separator]:not([data-custom])]:hidden',
        'group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:not(:nth-last-child(3))]:hidden',
        'group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)>[data-slot=breadcrumb-lead]]:hidden',
        'group-data-collapse/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>a[href]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)>a>[data-slot=breadcrumb-back]]:inline',
        className,
      )}
      {...props}
    />
  )
}

/**
 * One step in the trail. It leads with the separator glyph — a chevron, or a
 * slash on the rail — shown only when a default BreadcrumbSeparator precedes
 * it, so the first item never carries one.
 *
 * A `<button>` whose direct child is a `BreadcrumbEllipsis` is styled as the
 * ellipsis trigger, which keeps the trail composable with `DropdownMenuTrigger`
 * (or any other trigger) without Breadcrumb importing a menu. It is a 32px
 * control on the 4px radius, tinted from the ink at 10% on hover and 20% while
 * pressed or open, with the system's 2px offset focus ring. The selector sits
 * inside `:where()` so it carries no specificity: a `className` on the trigger
 * itself still wins.
 */
function BreadcrumbItem({ className, children, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='breadcrumb-item'
      className={cn(
        'inline-flex min-w-0 items-center gap-2 group-data-[variant=rail]/breadcrumb:gap-3',
        '[[data-slot=breadcrumb-separator]:not([data-custom])+&>[data-slot=breadcrumb-lead]]:inline-flex',
        '[:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:relative [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:inline-flex [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:h-8 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:min-w-8 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:cursor-pointer [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:items-center [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:justify-center [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:rounded-sm [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:border-0 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:bg-transparent [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:px-1 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:text-(--bc-ink) [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:motion-safe:transition-colors',
        '[:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:hover:bg-(--bc-ink)/10 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:active:bg-(--bc-ink)/20 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:aria-expanded:bg-(--bc-ink)/20',
        '[:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-2 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-offset-2 [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-(--bc-ink) [:where(&>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-solid',
        className,
      )}
      {...props}
    >
      <span
        data-slot='breadcrumb-lead'
        aria-hidden='true'
        className='hidden shrink-0 [&>svg]:size-5'
      >
        <IconChevronRight className='group-data-[variant=rail]/breadcrumb:hidden rtl:rotate-180' />
        <span className='hidden text-xl/6 group-data-[variant=rail]/breadcrumb:inline'>/</span>
      </span>
      {children}
    </li>
  )
}

/**
 * A link in the trail, in the system's link signature (DESIGN.md, Links):
 * medium weight, underlined in the ink at 4px offset, a 10% ink halo with a
 * 2px underline on hover and an 18% halo while pressed, and the 2px offset
 * focus ring in the ink. The halo reproduces Link's recipe rather than reusing
 * `linkVariants`, because Link's `primary` colour is fixed while a trail's ink
 * changes with its look (white on the band). There is deliberately no visited
 * colour: a trail is wayfinding, and a visited step is not information.
 *
 * Two things ride inside the link's target. A coarse-pointer TouchTarget
 * expands the hit area to 44px without growing the box (the Same-Floor Rule).
 * And a hidden back chevron with "Back to" for screen readers, which
 * BreadcrumbList reveals on the parent step of a collapsed trail. Both are only
 * added when the text comes through `children`; a link whose text lives inside
 * its `render` element keeps that text and goes without them.
 */
function BreadcrumbLink({ className, render, children, ...props }: useRender.ComponentProps<'a'>) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          'relative box-decoration-clone font-medium text-(--bc-ink) underline decoration-1 underline-offset-4 motion-safe:transition-colors',
          '[--bc-halo-active:color-mix(in_oklab,var(--bc-ink)_18%,transparent)] [--bc-halo:color-mix(in_oklab,var(--bc-ink)_10%,transparent)]',
          'hover:bg-(--bc-halo) hover:decoration-2 hover:shadow-[0_-2px_0_var(--bc-halo),0_4px_0_var(--bc-halo)]',
          'active:bg-(--bc-halo-active) active:decoration-2 active:shadow-[0_-2px_0_var(--bc-halo-active),0_4px_0_var(--bc-halo-active)]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--bc-ink) focus-visible:outline-solid',
          className,
        ),
        ...(children !== undefined && {
          children: (
            <TouchTarget>
              <span data-slot='breadcrumb-back' className='hidden'>
                <IconChevronLeft
                  aria-hidden='true'
                  className='-ms-1.5 inline-block size-5 align-[-0.3em] rtl:rotate-180'
                />
                <span className='sr-only'>Back to</span>
              </span>
              {/* The word space lives outside the back span: name computation
                  trims an element's own trailing space, which would announce
                  "Back toLicences". Here it is a bare text node, which CSS
                  drops at the start of a line, so it only renders after the
                  chevron. */}{' '}
              {children}
            </TouchTarget>
          ),
        }),
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
 * Regular weight under the links' medium on every look: the step you are on is
 * the one you cannot follow, so it is never the heaviest word in the trail.
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='breadcrumb-page'
      aria-current='page'
      className={cn('font-normal text-(--bc-current)', className)}
      {...props}
    />
  )
}

/**
 * Marks the step boundary. Decorative and hidden from assistive tech. Left
 * empty, it draws nothing itself: the item after it leads with the look's
 * glyph (BreadcrumbItem), so the glyph wraps with its target. Given children,
 * it draws them where it stands, as before.
 */
function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='breadcrumb-separator'
      data-custom={children === undefined ? undefined : ''}
      role='presentation'
      aria-hidden='true'
      className={cn('inline-flex items-center [&>svg]:size-5', className)}
      {...props}
    >
      {children}
    </li>
  )
}

/**
 * The collapsed-steps glyph, with "More pages" for screen readers so a trigger
 * built around it is never unnamed. Put it as the only child of a trigger and
 * name the trigger by what it reveals, e.g.
 * `<DropdownMenuTrigger aria-label='Show 2 more pages'><BreadcrumbEllipsis /></DropdownMenuTrigger>`.
 * BreadcrumbItem styles that trigger, and the glyph carries a coarse-pointer
 * TouchTarget so the 32px control still takes a 44px tap. Open the menu with
 * `sideOffset={BREADCRUMB_MENU_OFFSET}`.
 */
function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='breadcrumb-ellipsis'
      className={cn('relative flex size-6 items-center justify-center [&_svg]:size-6', className)}
      {...props}
    >
      <TouchTarget>
        <IconMoreHoriz aria-hidden='true' />
      </TouchTarget>
      <span className='sr-only'>More pages</span>
    </span>
  )
}

export {
  Breadcrumb,
  BREADCRUMB_MENU_OFFSET,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  breadcrumbVariants,
}

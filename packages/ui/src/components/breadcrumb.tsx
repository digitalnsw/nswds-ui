'use client'

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
 * The band and the tint are page chrome, so their content lines up with
 * Header's: the same 16 → 24 → 48px inset (`--header-padding-x`'s ladder,
 * written as disjoint ranges for cascade safety) and the same optional
 * `--header-max-width` column. BreadcrumbList applies both; `default` and
 * `rail` sit in page content and leave them unset. Retune with `--bc-inset`.
 */
const chromeInset =
  'max-sm:[--bc-inset:--spacing(4)] sm:max-lg:[--bc-inset:--spacing(6)] lg:[--bc-inset:--spacing(12)] [--bc-max-width:var(--header-max-width,none)]'

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
 *   under that header stays flush in both modes (AGENTS.md §3 brand band). A
 *   dark-only hairline in the ink at 15% keeps its edge on a dark page, where
 *   950 alone is ~1.06:1 against the canvas; under Header it is the band's
 *   bottom edge, so it never seams. Labels are white in both modes for the
 *   reason Button's solid labels are: `--text-inverse` flips.
 * - `soft`: a 10% ink tint with a 30% ink hairline under it.
 *
 * Every hairline is optical: the padding beside it is 1px shorter, so each
 * look lands on the 4px grid (40px tall, 48px with the ellipsis).
 */
const breadcrumbVariants = cva(['group/breadcrumb text-base/6', overlayInk], {
  variants: {
    variant: {
      default: onSurface,
      rail: ['border-y border-foreground py-[calc(--spacing(2)-1px)]', onSurface],
      band: [
        'bg-primary-800 py-2 dark:border-b dark:border-(--bc-ink)/15 dark:bg-primary-950 dark:pb-[calc(--spacing(2)-1px)]',
        '[--bc-current:var(--color-white)] [--bc-ink:var(--color-white)] [--bc-separator:color-mix(in_oklch,var(--color-white)_72%,transparent)]',
        chromeInset,
      ],
      soft: [
        'border-b border-(--bc-ink)/30 bg-(--bc-ink)/10 pt-2 pb-[calc(--spacing(2)-1px)]',
        onSurface,
        chromeInset,
      ],
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
 * Whether the full trail would wrap at the nav's current width. Measured on a
 * hidden clone placed beside the nav — same parent, so the same inherited
 * tokens and font — with the collapse state stripped, so a collapsed trail can
 * still ask how long it would be. The clone's list is laid out as one
 * unwrapped, unshrunk row, and the trail would wrap when that row overflows:
 * `scrollWidth` past `clientWidth`. Both are layout widths, so neither item
 * heights (an icon, a looser line height) nor transforms (a zooming dialog)
 * can sway the answer.
 */
function trailWraps(nav: HTMLElement): boolean {
  const probe = nav.cloneNode(true) as HTMLElement
  probe.removeAttribute('data-collapse')
  probe.removeAttribute('data-collapsed')
  probe.removeAttribute('data-measured')
  for (const el of [probe, ...probe.querySelectorAll('[id]')]) el.removeAttribute('id')
  probe.setAttribute('aria-hidden', 'true')
  probe.inert = true
  Object.assign(probe.style, {
    position: 'absolute',
    insetBlockStart: '0',
    insetInlineStart: '0',
    width: `${nav.offsetWidth}px`,
    visibility: 'hidden',
    pointerEvents: 'none',
  })
  const list = probe.querySelector<HTMLElement>('[data-slot=breadcrumb-list]')
  if (!list) return false
  list.style.flexWrap = 'nowrap'
  list.style.whiteSpace = 'nowrap'
  for (const item of list.children) (item as HTMLElement).style.flexShrink = '0'
  nav.after(probe)
  const wraps = list.scrollWidth > list.clientWidth + 1
  probe.remove()
  return wraps
}

/**
 * The trail's landmark. `aria-label` defaults to "Breadcrumb" and can be
 * overridden (a page with two trails needs two names).
 *
 * `collapse` is on by default for `default`, `band` and `soft`: when the full
 * trail would wrap, only the parent page shows, as a back link — "‹ Licences
 * and permits", announced "Back to Licences and permits". A trail that fits on
 * one line stays whole at any width, keeping Home and the current page. The
 * page heading names the current page, so a collapsed trail's one job is the
 * way up. `rail` never collapses: it is chosen for a quiet page where the
 * whole line is the point. Pass `collapse={false}` to keep the full trail.
 *
 * Wrapping is measured, so it needs JavaScript. Until the first measurement —
 * server-rendered HTML, or no script — CSS holds a collapsible trail to one
 * row so the page cannot jump when the measurement lands: below 36rem it is
 * already collapsed, and wider it is a single row that scrolls sideways if it
 * is too long. Either way the measured state is one row too, a full trail
 * that fits or the collapsed back link. The nav is a named size container for
 * that rule and takes `w-full`, which also keeps its width independent of its
 * own collapse state; without it a shrink-to-fit parent (a `flex
 * items-center` header) would size it to zero. Both are plain classes, so a
 * consumer `w-*` still wins.
 */
function Breadcrumb({
  className,
  variant,
  collapse = true,
  'aria-label': ariaLabel = 'Breadcrumb',
  ref,
  ...props
}: React.ComponentProps<'nav'> &
  VariantProps<typeof breadcrumbVariants> & {
    collapse?: boolean
  }) {
  // VariantProps admits null, which cva reads as "no variant" and would leave
  // every --bc-* variable unset.
  const look = variant ?? 'default'
  const collapses = collapse && look !== 'rail'
  const navRef = React.useRef<HTMLElement>(null)
  // null until measured: the CSS width fallback applies until then.
  const [wraps, setWraps] = React.useState<boolean | null>(null)

  React.useLayoutEffect(() => {
    const nav = navRef.current
    if (!collapses || !nav) {
      setWraps(null)
      return
    }
    let frame = 0
    let measuredWidth = -1
    let dirty = true
    const measure = () => {
      const width = nav.offsetWidth
      // Hidden (a display:none ancestor): nothing to learn until it shows,
      // which the ResizeObserver reports. Same width and same content: the
      // answer cannot have changed, so a height-only resize — including the
      // one collapsing causes — costs nothing.
      if (width === 0 || (!dirty && width === measuredWidth)) return
      measuredWidth = width
      dirty = false
      // No link that can become a back link: the trail can never collapse.
      setWraps(nav.querySelector('[data-slot=breadcrumb-back]') ? trailWraps(nav) : false)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    measure()
    // The observer's first callback reports the width just measured, so it
    // is skipped above. The probe is a sibling and the state lands as
    // attributes, so neither observer sees its own measurement.
    const resize = new ResizeObserver(schedule)
    resize.observe(nav)
    const content = new MutationObserver(() => {
      dirty = true
      schedule()
    })
    content.observe(nav, { childList: true, characterData: true, subtree: true })
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      content.disconnect()
    }
  }, [collapses])

  return (
    <nav
      ref={(node) => {
        navRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      aria-label={ariaLabel}
      data-slot='breadcrumb'
      data-variant={look}
      data-collapse={collapses || undefined}
      data-measured={collapses && wraps !== null ? '' : undefined}
      data-collapsed={collapses && wraps ? '' : undefined}
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
 * nothing. A separator with custom children is drawn where it stands. Rows
 * sit 8px apart, 20px on a coarse pointer so the 44px touch targets of
 * neighbouring rows never overlap.
 *
 * The collapse rules key on the trail's shape rather than on markers the
 * consumer must add: the parent is the item two before the end, with a
 * separator between it and the current page. They apply only when that parent
 * holds a link, so a trail of one item, or one whose parent slot is the
 * ellipsis, stays whole instead of collapsing to nothing or to a menu button —
 * and only when that link carries the back affordance (it does not when its
 * text lives inside a `render` element), so a collapse never leaves a bare,
 * unexplained link. (One `:has()` per condition: `:has()` cannot nest.) Each
 * rule is written twice: once for the measured state (`data-collapsed`), once
 * for the CSS stand-in before measurement, which also holds a wider eligible
 * trail to one scrollable row. A list holding the ellipsis keeps the trigger's
 * 32px row even when the trigger is collapsed away, so its height never
 * changes either. The parent's lead separator gives way to
 * the back chevron its BreadcrumbLink carries, which sits inside the link's
 * target.
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        'mx-auto flex max-w-(--bc-max-width) flex-wrap items-center gap-x-2 px-(--bc-inset) wrap-break-word text-(--bc-separator) not-pointer-coarse:gap-y-2 group-data-[variant=rail]/breadcrumb:gap-x-3 has-[>li>[data-slot=breadcrumb-content]>button]:min-h-8 pointer-coarse:gap-y-5',
        '[&>[data-slot=breadcrumb-separator]:not([data-custom])]:hidden',
        'group-[[data-collapse]:not([data-measured])]/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))]:[scrollbar-width:none] group-[[data-collapse]:not([data-measured])]/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))]:flex-nowrap group-[[data-collapse]:not([data-measured])]/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))]:overflow-x-auto group-[[data-collapse]:not([data-measured])]/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li]:shrink-0',
        'group-data-collapsed/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:not(:nth-last-child(3))]:hidden',
        'group-data-collapsed/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)>[data-slot=breadcrumb-lead]]:hidden',
        'group-data-collapsed/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)>[data-slot=breadcrumb-content]>a>[data-slot=breadcrumb-back]]:inline-block',
        'group-[[data-collapse]:not([data-measured])]/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:not(:nth-last-child(3))]:hidden',
        'group-[[data-collapse]:not([data-measured])]/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)>[data-slot=breadcrumb-lead]]:hidden',
        'group-[[data-collapse]:not([data-measured])]/breadcrumb:@max-xl/breadcrumb:[&:has(>[data-slot=breadcrumb-item]:nth-last-child(3)>[data-slot=breadcrumb-content]>a[href]>[data-slot=breadcrumb-back]):has(>[data-slot=breadcrumb-separator]:nth-last-child(2))>li:nth-last-child(3)>[data-slot=breadcrumb-content]>a>[data-slot=breadcrumb-back]]:inline-block',
        className,
      )}
      {...props}
    />
  )
}

/**
 * One step in the trail: the separator glyph it leads with, then its content.
 * The glyph — a chevron, or a slash on the rail — shows only when a default
 * BreadcrumbSeparator precedes the item, so the first item never carries one.
 * It aligns to the first line of a label that wraps, and to the centre of the
 * ellipsis trigger.
 *
 * The content sits in its own span so the link inside stays inline: a flex
 * item is blockified, and a block `<a>` would draw one rectangular halo and
 * focus ring round a wrapped label instead of one per line.
 *
 * A `<button>` whose direct child is a `BreadcrumbEllipsis` is styled as the
 * ellipsis trigger, which keeps the trail composable with `DropdownMenuTrigger`
 * (or any other trigger) without Breadcrumb importing a menu. It is a 32px
 * control on the 4px radius — pulled 4px into its gaps so it sits as close to
 * its neighbours as a text step does — tinted from the ink at 10% on hover and 20% while
 * pressed or open, with the system's 2px offset focus ring and, in forced
 * colours (where tints are dropped), a 1px border. The selector sits inside
 * `:where()` so it carries no specificity: a `className` on the trigger itself
 * still wins.
 */
function BreadcrumbItem({ className, children, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot='breadcrumb-item'
      className={cn(
        'inline-flex min-w-0 items-start gap-2 group-data-[variant=rail]/breadcrumb:gap-3 has-[>[data-slot=breadcrumb-content]>button]:items-center',
        '[[data-slot=breadcrumb-separator]:not([data-custom])+&>[data-slot=breadcrumb-lead]]:inline-flex',
        '[:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:relative [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:-mx-1 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:inline-flex [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:h-8 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:min-w-8 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:cursor-pointer [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:items-center [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:justify-center [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:rounded-sm [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:bg-transparent [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:px-0 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:text-(--bc-ink) [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:motion-safe:transition-[color,background-color]',
        '[:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:not-forced-colors:border-0 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:forced-colors:border',
        '[:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:hover:bg-(--bc-ink)/10 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:active:bg-(--bc-ink)/20 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:aria-expanded:bg-(--bc-ink)/20',
        '[:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-2 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-offset-2 [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-(--bc-ink) [:where(&>[data-slot=breadcrumb-content]>button:has(>[data-slot=breadcrumb-ellipsis]))]:focus-visible:outline-solid',
        className,
      )}
      {...props}
    >
      <span
        data-slot='breadcrumb-lead'
        aria-hidden='true'
        className='hidden h-6 shrink-0 items-center [&>svg]:size-5'
      >
        <IconChevronRight className='group-data-[variant=rail]/breadcrumb:hidden rtl:rotate-180' />
        <span className='hidden text-xl/6 group-data-[variant=rail]/breadcrumb:inline'>/</span>
      </span>
      <span data-slot='breadcrumb-content' className='min-w-0 has-[>button]:flex'>
        {children}
      </span>
    </li>
  )
}

/**
 * A link in the trail, in the system's link signature (DESIGN.md, Links):
 * medium weight, underlined in the ink at 4px offset, a 10% ink halo with a
 * 2px underline on hover and an 18% halo while pressed, and the 2px offset
 * focus ring in the ink, which appears in the ink at once: the transition
 * leaves `outline-color` out, so the ring never fades in from the base layer's
 * grey. The halo is Link's recipe, mixed in the same oklch
 * space; it is reproduced rather than reusing `linkVariants` because Link's
 * `primary` colour is fixed while a trail's ink changes with its look (white
 * on the band). There is deliberately no visited colour: a trail is
 * wayfinding, and a visited step is not information.
 *
 * Two things ride inside the link's target. A coarse-pointer TouchTarget
 * expands the hit area to 44px without growing the box (the Same-Floor Rule).
 * And a hidden back chevron with "Back to" for screen readers, which
 * BreadcrumbList reveals on the parent step of a collapsed trail. It shows as
 * an inline-block, so the gap after the chevron is a margin the underline
 * skips, and name computation sets it apart from the label ("Back to
 * Licences", not "Back toLicences"). Both are only added when the text comes
 * through `children`; a link whose text lives inside its `render` element
 * keeps that text and goes without them.
 */
function BreadcrumbLink({ className, render, children, ...props }: useRender.ComponentProps<'a'>) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          'relative box-decoration-clone font-medium text-(--bc-ink) underline decoration-1 underline-offset-4 motion-safe:transition-[color,background-color,text-decoration-color,box-shadow]',
          '[--bc-halo-active:color-mix(in_oklch,var(--bc-ink)_18%,transparent)] [--bc-halo:color-mix(in_oklch,var(--bc-ink)_10%,transparent)]',
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
                  className='-ms-1.5 me-1 inline-block size-5 align-[-0.3em] rtl:rotate-180'
                />
                <span className='sr-only'>Back to</span>
              </span>
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

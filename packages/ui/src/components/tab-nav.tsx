'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../lib/utils.js'

import { Link, type LinkProps } from '../components/link.js'

/**
 * Carries the bar's `currentHref` down to the links without threading it
 * through every call site.
 *
 * `null` means a link is rendering outside a `TabNav` — a real mistake, since
 * nothing would ever be marked current. `warnIfOrphaned` names it in
 * development.
 */
const TabNavContext = React.createContext<{ currentHref: string | undefined } | null>(null)

/**
 * The bar itself: a horizontal scroll container with the rule the tabs sit on.
 *
 * The rule is on the LIST, not on the `<nav>`. The nav is the scroll container,
 * so a rule there spans only the visible width and stops dead at the right edge
 * while the tabs keep going — the bar looks broken exactly when it overflows,
 * which is the case that matters. `min-w-max` on the list makes it as wide as
 * its tabs, so the rule runs the full scrollable width instead.
 *
 * The scrollbar is suppressed on the nav, the element that actually scrolls: a
 * visible bar would sit on top of the tabs. The clipped final tab is what
 * signals there is more to the right. Scrolling itself is untouched, so pointer
 * drag, shift-wheel and keyboard all still reach the overflow — the same
 * treatment `OnThisPage` gives its horizontal bar.
 */
const tabNavListVariants = cva('flex min-w-max items-center', {
  variants: {
    /**
     * The rule the tabs sit on. Off for a bar inside a `Card` or panel that
     * already draws its own edge, where a second rule reads as a double border.
     */
    border: {
      true: 'border-b border-border',
      false: '',
    },
  },
  defaultVariants: {
    border: true,
  },
})

/**
 * One tab.
 *
 * `-mb-px` pulls the 2px marker down over the list's 1px rule so the two merge
 * into a single edge, rather than the marker floating a hairline above it.
 *
 * Idle and current ink live in separate branches rather than in the base
 * string. Both are single-class selectors, so with both on the element at once
 * the winner comes down to Tailwind's internal sort order — the same reason
 * `OnThisPage` splits them.
 *
 * The current tab changes colour AND draws the marker rule, so the state is
 * never signalled by colour alone (WCAG 2.2, 1.4.1). The rule is always drawn,
 * `transparent` when idle, so becoming current never changes the tab's size and
 * the bar cannot reflow under the pointer.
 *
 * Floored at 44px on coarse pointers, the promise DESIGN.md makes and
 * `Button`/`PushMenu` hold. `p-4` over a 24px line box already clears it on
 * most type scales; the floor makes that independent of the consumer's scale.
 */
const tabNavLinkVariants = cva(
  [
    'flex shrink-0 items-center border-b-2 p-4 font-bold whitespace-nowrap',
    '-mb-px',
    '[@media(pointer:coarse)]:min-h-11',
    'motion-safe:transition-colors',
    'hover:bg-primary/10 hover:text-primary',
    'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
  ],
  {
    variants: {
      current: {
        true: 'border-primary text-primary',
        false: 'border-transparent text-foreground',
      },
    },
    defaultVariants: {
      current: false,
    },
  },
)

type TabNavProps = React.ComponentPropsWithoutRef<'nav'> &
  VariantProps<typeof tabNavListVariants> & {
    /**
     * The current page's href. The `TabNavLink` whose `href` matches it exactly
     * gets `aria-current='page'` and the marker rule.
     *
     * Matching is EXACT, deliberately. Prefix matching (`pathname.startsWith`)
     * is the obvious shortcut and it is wrong in two directions: `/colour`
     * matches `/colour-blind-safe`, and every parent in a nested set matches at
     * once, so several tabs claim the page. Matching rules beyond equality are
     * the caller's to define — set `current` on the link directly and the bar
     * will not second-guess it.
     *
     * Frameworkless replacement for `usePathname()` — pass your router's
     * pathname in, as with `SideNav`.
     */
    currentHref?: string
    ref?: React.Ref<HTMLElement>
  }

/**
 * Flat horizontal navigation between the pages of one section — the bar that
 * sits under the site header and lists a section's peer pages.
 *
 * **Where it sits among the other navigation components**, none of which it
 * overlaps:
 *
 * | Component    | Moves you                                        |
 * | ------------ | ------------------------------------------------ |
 * | `MainNav`    | between sites/sections, mega menu                |
 * | `SideNav`    | between pages, as a tree                         |
 * | `TabNav`     | between the pages of one section, as a flat bar  |
 * | `StepNav`    | through a multi-page journey                     |
 * | `OnThisPage` | within the page you are on                       |
 *
 * The closest neighbours are `SideNav` and `OnThisPage`. `SideNav` does the
 * same job — peer-page navigation — but as a vertical tree with arbitrary
 * nesting; this is the flat horizontal form, for a section whose pages have no
 * hierarchy worth drawing. `OnThisPage` looks nearly identical and is not
 * related: its entries are anchors into the current page, which is why it marks
 * `aria-current='location'` where this marks `'page'`.
 *
 * **These are not ARIA tabs, and must never become them.** The name describes
 * the visual idiom, which is what a designer reaching for this will search for.
 * The semantics are a `<nav>` landmark over a list of links: each one navigates
 * to a different URL, so a reader gets a page load, not a panel swap. Adding
 * `role='tablist'`/`role='tab'` would promise `aria-controls` panels that do
 * not exist and hand the arrow keys a selection model the browser cannot honour
 * across a navigation. `OnThisPage` documents the mirror-image decision about
 * `aria-current`; this is the same care applied to `role`.
 *
 * **No Base UI primitive is involved, and none is missing.** The house rule is
 * never to hand-roll ARIA, focus or keyboard behaviour — but these are plain
 * anchors, which have all three natively, and a link list needs no roving
 * tabindex. Nothing is hand-rolled here because there is nothing to hand-roll.
 *
 * Accessibility contract:
 *
 * - The landmark is named (`aria-label`, default "Subsection navigation") so it
 *   is distinguishable from the page's other navigation landmarks (WCAG 2.2,
 *   1.3.1). Name it after the section it navigates — "Colour", "Get started" —
 *   whenever you know it; the default only guarantees the landmark is not
 *   anonymous.
 * - The current page is marked `aria-current='page'`.
 * - `role='list'` is explicit on the `<ul>`: `list-style: none` strips list
 *   semantics in Safari/VoiceOver, the same reason `SideNav`, `StepIndicator`
 *   and `OnThisPage` set it.
 * - The current state carries colour AND a marker rule, never colour alone
 *   (1.4.1), and the rule occupies its space when idle so nothing reflows.
 * - Focus is always visible via the house outline pattern (2.4.13).
 *
 * Departures from the nswds-app `TabNavigation` source, all deliberate:
 *
 * - **The current tab comes from `currentHref`, not from internal state.** The
 *   source tracked the last-clicked tab in a `useState`, which is a click
 *   highlighter, not page navigation: on a fresh page load nothing is marked,
 *   and after a real navigation the state is gone. Marking the current page is
 *   the entire job of this component, so it reads the router's pathname the way
 *   `SideNav` does.
 * - **Tabs are identified by `href`, not by a `tabId`.** The source defaulted
 *   every link's id to the literal string `'unique-id'`, so any two links
 *   without an explicit id shared one identity. Keying off the destination
 *   removes the id from the API entirely.
 * - **No hover-pill animation, and no `motion` dependency.** The source
 *   animated a floating background between tabs via `motion/react`. The hover
 *   state here is a colour derivation per DESIGN.md's Derived State Rule; a
 *   design system taking on an animation runtime to decorate one hover is a
 *   cost every consumer pays.
 * - Radix `NavigationMenu` → plain semantics. The source used it purely as
 *   markup scaffolding, and its `onSelect` is what made the active tab
 *   click-driven in the first place.
 * - Links render through `Link`, so frameworks inject their own anchor via
 *   `LinkProvider` (`next/link` et al) — as in `SideNav`.
 *
 * @example
 * ```tsx
 * <TabNav currentHref={pathname} aria-label='Colour'>
 *   <TabNavLink href='/colour/brand'>Brand palette</TabNavLink>
 *   <TabNavLink href='/colour/semantic'>Semantic palette</TabNavLink>
 * </TabNav>
 * ```
 */
function TabNav({
  className,
  children,
  currentHref,
  border,
  'aria-label': ariaLabel = 'Subsection navigation',
  ref,
  ...props
}: TabNavProps) {
  // Memoised so every tab does not re-render whenever the consuming page does
  // for an unrelated reason; `currentHref` is the only thing that should move.
  const context = React.useMemo(() => ({ currentHref }), [currentHref])

  return (
    <nav
      {...props}
      ref={ref}
      data-slot='tab-nav'
      aria-label={ariaLabel}
      className={cn(
        'text-base',
        '[scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <ul role='list' data-slot='tab-nav-list' className={cn(tabNavListVariants({ border }))}>
        <TabNavContext.Provider value={context}>{children}</TabNavContext.Provider>
      </ul>
    </nav>
  )
}

/**
 * `as` is omitted deliberately, not by oversight.
 *
 * `Link` strips `href` from any non-anchor intrinsic element, so `as='button'`
 * typechecked and rendered `<button href=null aria-current='page'>` — a control
 * that cannot navigate, announcing itself as the current *page*. That is a
 * name/role/value mismatch (WCAG 2.2, 4.1.2), not merely a dead link, and it
 * contradicts the nav-over-links contract this component documents.
 *
 * Nothing is lost. A bar whose tabs render as different element types is
 * incoherent by construction, and framework links still arrive the documented
 * way — wrap the bar in `<LinkProvider component={NextLink}>`. `SideNav` sets
 * the same precedent: it renders `Link` internally and never forwards `as`.
 */
type TabNavLinkProps = Omit<LinkProps, 'variant' | 'as'> & {
  /**
   * Force the current state, overriding the bar's `currentHref` comparison.
   *
   * The escape hatch for any matching rule other than equality — prefix
   * matching for a nested route, ignoring a query string, treating an index
   * page as current for its children. Compute it from your router and set it
   * here; `TabNav` does not guess.
   *
   * Also the only way to mark the current tab when `href` is a url object,
   * which cannot be compared to a pathname string.
   */
  current?: boolean
}

/**
 * Dev-only guard, mirroring the misshapen-item check in `SideNav`: a link
 * outside a `TabNav` gets no context and renders an `<li>` with no list around
 * it. No-op in production.
 *
 * The message is careful about what is actually lost. An orphan can still be
 * marked by passing `current` directly — `current ?? …` short-circuits before
 * the context is read — so claiming no tab will be marked would be false
 * exactly when a caller has reached for that escape hatch. What an orphan
 * cannot do is derive the current tab from `currentHref`.
 */
function warnIfOrphaned(hasContext: boolean) {
  if (process.env.NODE_ENV === 'production' || hasContext) {
    return
  }
  console.warn(
    '[nswds/ui] TabNavLink rendered outside a TabNav — it cannot read currentHref, so the current tab is never derived automatically (only an explicit `current` still applies), and its <li> sits outside any list. Wrap the links in <TabNav>.',
  )
}

/**
 * One tab: a link to a peer page, marked `aria-current='page'` when it is the
 * one being read.
 *
 * Renders its own `<li>`, so `TabNav`'s children are tabs rather than list
 * items — the compound shape `Header`/`HeaderBrand` and `Footer`/`FooterNav`
 * already use.
 */
function TabNavLink({ className, children, current, href, ...props }: TabNavLinkProps) {
  const context = React.useContext(TabNavContext)

  warnIfOrphaned(context !== null)

  // Exact match only, and only for string hrefs — see `TabNav`'s `currentHref`
  // for why prefix matching is not offered, and `current` for url objects.
  const isCurrent =
    current ??
    (context?.currentHref !== undefined && typeof href === 'string' && href === context.currentHref)

  return (
    <li data-slot='tab-nav-item' className='flex'>
      {/* variant='unstyled' — the bar supplies the complete tab treatment, and
          Link's underline/colour variants would fight it. Rendering through
          Link still picks up the framework link component from LinkProvider. */}
      {/* `{...props}` spreads FIRST so the computed state below always wins. A
          consumer passing their own `aria-current` would otherwise silently
          beat the `current` prop, leaving two sources of truth for one state. */}
      <Link
        {...props}
        variant='unstyled'
        data-slot='tab-nav-link'
        data-active={isCurrent ? '' : undefined}
        href={href}
        aria-current={isCurrent ? 'page' : undefined}
        className={cn(tabNavLinkVariants({ current: isCurrent }), className)}
      >
        {children}
      </Link>
    </li>
  )
}

export { TabNav, TabNavLink, tabNavLinkVariants, tabNavListVariants }
export type { TabNavLinkProps, TabNavProps }

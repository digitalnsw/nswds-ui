'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils.js'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/collapsible.js'
import { Link } from '../components/link.js'
import { IconChevronRight } from '../icons/chevron-right.js'

/**
 * One entry in a `SideNav` tree.
 *
 * - `href` and no `links` — a leaf link.
 * - `links` — a branch. At the top level it renders as a section heading over an
 *   always-visible list; at any deeper level it renders as a collapsible
 *   trigger. A branch's own `href` is IGNORED (the row is a disclosure button,
 *   not a link) — a dev-only warning flags it, mirroring the nswds-app
 *   `SidebarNavigation` behaviour where branch rows only toggled.
 * - Neither — a dead entry; rendered as inert text and flagged with a dev-only
 *   warning rather than a decoy `<a>` with no destination.
 */
type SideNavItem = {
  /** Visible text for the link, section heading, or branch trigger. */
  title: string
  href?: string
  links?: SideNavItem[]
}

/**
 * Row treatment shared by leaf links and branch triggers — the nswds-app
 * left-rail language: each row carries its own left border sitting exactly on
 * the list's rail (the `-ml-px` on the `<li>`), so hover and the current-page
 * state recolour the rail segment beside the row.
 *
 * Departures from the source, both deliberate:
 * - The idle border is `border-transparent` rather than the bare `border-l`
 *   default: idle rows show the rail through their transparent border, so the
 *   idle rail colour is defined once (on the list) instead of twice.
 * - The current row adds `dark:text-white`. The source left dark active text
 *   to fall through to the idle `dark:text-grey-400`, which on the
 *   `dark:bg-white/20` highlight is both low-contrast and cascade-order
 *   dependent; bold white ink clears WCAG 2.2 AA (1.4.3) on that overlay.
 *
 * The hover font-weight change (`hover:font-semibold`) is source parity; it
 * reflows the row's own text only, never the rail.
 *
 * Focus uses the house visible-focus pattern (outline-current, offset 2), so
 * the indicator always contrasts with whatever text colour the row currently
 * has (WCAG 2.2, 2.4.13 Focus Appearance).
 */
const sideNavRowVariants = cva(
  [
    'w-full cursor-pointer rounded-r-sm border-l border-transparent py-1 pr-2 pl-4 text-left text-base/8 sm:text-sm/6',
    'transition-colors motion-reduce:transition-none',
    'hover:border-grey-950 hover:bg-primary-800/10 hover:font-semibold hover:text-grey-950',
    'dark:text-grey-400 dark:hover:border-grey-400 dark:hover:text-white',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
  ],
  {
    variants: {
      current: {
        true: 'border-primary-800 bg-primary-800/10 font-bold text-primary-800 dark:border-white dark:bg-white/20 dark:text-white',
        false: '',
      },
    },
    defaultVariants: {
      current: false,
    },
  },
)

/**
 * Port of nswds-app's `isLinkOrDescendantActive`: true when the item itself,
 * or any item anywhere beneath it, is the current page. Drives `defaultOpen`
 * on branch collapsibles so the rail opens onto the reader's location.
 */
function isItemOrDescendantCurrent(item: SideNavItem, currentHref: string | undefined): boolean {
  if (currentHref === undefined) {
    return false
  }
  if (item.href === currentHref) {
    return true
  }
  return item.links?.some((child) => isItemOrDescendantCurrent(child, currentHref)) ?? false
}

/**
 * Dev-only guard, mirroring the icon-only Button check in button.tsx: an item
 * with neither destination nor children renders as inert text (a decoy link
 * would violate WCAG 2.2, 4.1.2 Name, Role, Value expectations), and a branch's
 * `href` is silently unreachable because the row renders as a disclosure
 * button. Both are almost certainly data mistakes. No-op in production.
 */
function warnIfItemMisshapen(item: SideNavItem) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  const hasChildren = (item.links?.length ?? 0) > 0
  if (!hasChildren && item.href === undefined) {
    console.warn(
      `[nswds/ui] SideNav item "${item.title}" has neither href nor links — it renders as inert text. Give it a destination or children.`,
    )
  }
  if (hasChildren && item.href !== undefined) {
    console.warn(
      `[nswds/ui] SideNav item "${item.title}" has both href and links — branch rows render as collapsible triggers, so its href is unreachable. Add a separate leaf item for the destination.`,
    )
  }
}

type SideNavListProps = {
  items: SideNavItem[]
  currentHref?: string
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>
  /** Deeper than the section rail — tighter gap, indented, per the source. */
  nested?: boolean
}

/**
 * A rail of rows: the bordered `<ul>` every level of the tree renders into.
 * `role='list'` is kept from the source — Safari/VoiceOver strips list
 * semantics from lists whose `list-style` is removed, and the explicit role
 * restores them (this is the one sanctioned hand-written role in the file).
 */
function SideNavList({ items, currentHref, onNavigate, nested = false }: SideNavListProps) {
  return (
    <ul
      role='list'
      data-slot='side-nav-list'
      className={cn(
        'flex flex-col border-l border-grey-400 dark:border-grey-200/15',
        nested ? 'mt-2 ml-5 gap-1' : 'mt-2 gap-2 lg:mt-4',
      )}
    >
      {items.map((item) => (
        <SideNavRow
          key={item.href ?? item.title}
          item={item}
          currentHref={currentHref}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  )
}

type SideNavRowProps = {
  item: SideNavItem
  currentHref?: string
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>
}

/**
 * One row of the rail — a leaf link, a collapsible branch, or (data mistake)
 * inert text. Recurses through `SideNavList` for branch children.
 */
function SideNavRow({ item, currentHref, onNavigate }: SideNavRowProps) {
  const hasChildren = (item.links?.length ?? 0) > 0
  const isCurrent = currentHref !== undefined && item.href === currentHref

  warnIfItemMisshapen(item)

  if (hasChildren) {
    return (
      <li data-slot='side-nav-item' className='-ml-px flex w-full flex-col items-start gap-1'>
        {/* defaultOpen (not controlled `open`) so the branch holding the
            current page starts expanded but the reader can still fold it —
            the source's auto-expansion behaviour exactly. */}
        <Collapsible className='w-full' defaultOpen={isItemOrDescendantCurrent(item, currentHref)}>
          {/* Base UI's Trigger owns the disclosure semantics (aria-expanded,
              aria-controls, keyboard activation) — nothing hand-rolled here.
              `group` scopes the chevron's rotation to THIS trigger: nested
              triggers are never ancestors of each other's icons, and the
              Collapsible root carries data-open (not data-panel-open), so an
              open outer branch cannot rotate descendant chevrons. */}
          <CollapsibleTrigger
            data-slot='side-nav-trigger'
            className={cn(sideNavRowVariants(), 'group flex items-center justify-between gap-1')}
          >
            <span>{item.title}</span>
            <IconChevronRight
              aria-hidden='true'
              className='ml-2 size-5 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-90 motion-reduce:transition-none'
            />
          </CollapsibleTrigger>
          <CollapsibleContent data-slot='side-nav-panel'>
            <SideNavList
              items={item.links ?? []}
              currentHref={currentHref}
              onNavigate={onNavigate}
              nested
            />
          </CollapsibleContent>
        </Collapsible>
      </li>
    )
  }

  if (item.href === undefined) {
    // No destination, no children: inert text, not a decoy anchor. The
    // dev-only warning above names the item.
    return (
      <li data-slot='side-nav-item' className='-ml-px flex w-full flex-col items-start gap-1'>
        <span
          data-slot='side-nav-text'
          className={cn(sideNavRowVariants(), 'inline-block cursor-default')}
        >
          {item.title}
        </span>
      </li>
    )
  }

  return (
    <li data-slot='side-nav-item' className='-ml-px flex w-full flex-col items-start gap-1'>
      {/* variant='unstyled' — the rail supplies the complete row treatment;
          Link's underline/colour variants would fight it. Rendering through
          Link still picks up the framework link component from LinkProvider
          (next/link et al). */}
      <Link
        variant='unstyled'
        data-slot='side-nav-link'
        href={item.href}
        onClick={onNavigate}
        aria-current={isCurrent ? 'page' : undefined}
        className={cn(sideNavRowVariants({ current: isCurrent }), 'inline-block')}
      >
        {item.title}
      </Link>
    </li>
  )
}

type SideNavProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> & {
  /**
   * The navigation tree. A top-level item with `links` renders as a section
   * heading over an always-visible rail; one without renders as a plain rail
   * link — mirroring nswds-app `Navigation`'s section shape. Deeper items with
   * `links` render as collapsible branches (nswds-app `SidebarNavigation`).
   */
  sections: SideNavItem[]
  /**
   * The current page's href. The matching leaf gets `aria-current='page'` and
   * the active rail treatment, and every branch on the path to it starts
   * expanded — at MOUNT only. Branches are `defaultOpen`, not controlled: a
   * later `currentHref` change (SPA navigation) re-highlights the leaf but
   * never re-expands a branch the reader has folded, so the highlight can
   * land inside a collapsed branch. Branch expansion is seeded from
   * `currentHref` on mount; pass a `key` (e.g. `key={currentHref}`) to
   * remount and re-open the path on navigation — the same contract as
   * PushMenu's level stack. Frameworkless replacement for the source's
   * `usePathname()` — pass your router's pathname in.
   */
  currentHref?: string
  /**
   * Fired from every leaf link (never from branch triggers). The mobile-drawer
   * close hook, as in the source's `onLinkClick`.
   */
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>
  /**
   * Heading level for section titles. Defaults to `2` — correct when the nav
   * sits at the top level of the document outline. Step it down when the page
   * nests the nav under another heading (WCAG 1.3.1). `1` is excluded: a
   * section-nav heading is never the page's own title. Same contract as
   * `FooterNavColumn`.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  ref?: React.Ref<HTMLElement>
}

/**
 * Left-rail section navigation — the consolidation of nswds-app's flat
 * `Navigation` and recursive `SidebarNavigation` into one tree-shaped
 * component. Renders a `<nav>` landmark of headed sections whose links may
 * nest to any depth; nested branches collapse.
 *
 * Accessibility contract:
 * - The landmark is named (`aria-label`, default "Section navigation") so it is
 *   distinguishable from the page's other navigation landmarks (WCAG 1.3.1).
 * - Disclosure semantics — `aria-expanded`, `aria-controls`, Enter/Space
 *   activation — come entirely from Base UI's Collapsible; nothing hand-rolled.
 * - The current page is marked with `aria-current='page'`, and every branch on
 *   the path to it starts expanded ON MOUNT, so the highlighted location is
 *   visible on arrival (ported `isLinkOrDescendantActive`). Expansion is
 *   `defaultOpen`, so it does not re-run when `currentHref` changes — see the
 *   `currentHref` prop for the `key={currentHref}` remount workaround.
 * - Focus is always visible via the house `outline-current` pattern (2.4.13).
 *
 * Departures from the nswds-app source (see also `sideNavRowVariants` and
 * `SideNavItem`):
 * - `usePathname()` → the `currentHref` prop; links render through `Link`, so
 *   frameworks inject their own anchor via `LinkProvider`.
 * - The Radix-based Collapsible → the Base UI primitive (this repo's
 *   `collapsible.tsx`), whose open state is `data-panel-open` on the trigger
 *   rather than Radix's `data-state='open'`.
 * - The source rendered a stray empty `<ul>` after link-less sections and sent
 *   `href='#'` placeholders through the tree; both are dropped.
 */
function SideNav({
  className,
  sections,
  currentHref,
  onNavigate,
  headingLevel = 2,
  'aria-label': ariaLabel = 'Section navigation',
  ref,
  ...props
}: SideNavProps) {
  const Heading = `h${headingLevel}` as const

  return (
    <nav
      data-slot='side-nav'
      {...props}
      aria-label={ariaLabel}
      // Base ink declared once here (the source inherited the page body's
      // colour in light mode; a design-system component states it).
      className={cn('text-base text-grey-800 lg:text-sm dark:text-grey-400', className)}
      ref={ref}
    >
      <ul role='list' data-slot='side-nav-sections' className='flex flex-col gap-9'>
        {sections.map((section) => (
          <li key={section.href ?? section.title} data-slot='side-nav-section'>
            {section.links ? (
              <>
                {/* font-display resolves through @nswds/tokens' Tailwind
                    preset (--font-display, Public Sans stack) — the same
                    utility the source used. */}
                <Heading
                  data-slot='side-nav-heading'
                  className='font-display font-medium text-grey-800 dark:text-white'
                >
                  {section.title}
                </Heading>
                <SideNavList
                  items={section.links}
                  currentHref={currentHref}
                  onNavigate={onNavigate}
                />
              </>
            ) : (
              // A link-less section is a single rail link (Navigation.tsx
              // parity) — reuse the rail so the border/offset stay identical.
              <SideNavList items={[section]} currentHref={currentHref} onNavigate={onNavigate} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { SideNav, sideNavRowVariants }
export type { SideNavItem, SideNavProps }
export type SideNavRowVariantProps = VariantProps<typeof sideNavRowVariants>

'use client'

import React from 'react'

import { cn } from '../lib/utils.js'

import { Button } from '../components/button.js'
import { Link } from '../components/link.js'
import { IconChevronRight } from '../icons/chevron-right.js'
import { IconClose } from '../icons/close.js'
import { IconWest } from '../icons/west.js'

/**
 * Default slide duration for level transitions, in milliseconds — the default
 * of the `durationMs` prop.
 *
 * COUPLING: `durationMs` drives BOTH the `--push-menu-duration` custom
 * property (set inline on the root, read by the CSS transition) and the state
 * machine's `setTimeout`s (which settle the animation state, pop levels, and
 * schedule focus restoration). Do not override the custom property directly —
 * that changes only the visual duration while the state machine still settles
 * on `durationMs`, desyncing the two; pass `durationMs` instead. Under
 * `prefers-reduced-motion` the slide is skipped (`motion-reduce:
 * transition-none`) but the state machine still waits the full duration; the
 * menu is simply "settled early" for those users, never broken.
 */
const PUSH_MENU_DURATION_MS = 300

/** A node in the menu tree. Items with `links` drill in; items with `href` navigate. */
type PushMenuItem = {
  /** Unique across the whole tree — level ids and focus restoration track items by id. */
  id: string
  /** Visible label. */
  title: string
  /** Navigation target for leaf items. Ignored for drilling when `links` is non-empty. */
  href?: string
  /** Child items. A non-empty array makes this item a drill-in button, not a link. */
  links?: PushMenuItem[]
}

/** One entry in the level stack — the root level plus one per drill-in. */
type PushMenuLevel = {
  id: string
  title: string
  /** 1 for the root level, incrementing per drill-in. */
  depth: number
  items: PushMenuItem[]
  /** The item whose activation opened this level. Absent on the root level. */
  parentItem?: PushMenuItem
}

type PushMenuAnimationState = 'idle' | 'sliding-forward' | 'sliding-backward'

function buildLevelId(path: string[]): string {
  return `level-${path.length > 0 ? path.join('--') : 'root'}`
}

/**
 * Collapses a trail of level titles into a single "A › B › C" string, keeping
 * the ends and eliding the middle once it outgrows `maxLength`. Exported so an
 * app can render the same trail outside the menu (e.g. in a sheet header).
 * Prefixed with "PushMenu" to avoid colliding with a future breadcrumb
 * component in the package barrel.
 */
function generatePushMenuBreadcrumb(levels: { title: string }[], maxLength = 50): string {
  const first = levels[0]
  if (levels.length <= 1) {
    return first?.title ?? 'Menu'
  }

  const full = levels.map((level) => level.title).join(' › ')
  if (full.length <= maxLength) {
    return full
  }

  const last = levels.at(-1)
  const secondLast = levels.at(-2)
  if (levels.length > 3 && first && last && secondLast) {
    return `${first.title} › … › ${secondLast.title} › ${last.title}`
  }

  return `${full.slice(0, maxLength - 1)}…`
}

/**
 * Dev-only guard, mirroring `warnIfIconButtonUnlabelled` in button.tsx. It
 * replaces the nswds-app source's rendered "Navigation Error" fallback panel:
 * malformed navigation data is a programming error, not a runtime state a user
 * should ever see, so the design system surfaces it to the developer console
 * and renders what it can instead of shipping error chrome. No-op in
 * production.
 */
function warnIfNavigationMalformed(navigation: PushMenuItem[]) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  if (!Array.isArray(navigation) || navigation.length === 0) {
    console.warn('[nswds/ui] PushMenu received no navigation items — the menu renders empty.')
    return
  }
  const seen = new Set<string>()
  const visit = (items: PushMenuItem[]) => {
    for (const item of items) {
      if (!item?.id || !item.title) {
        console.warn('[nswds/ui] PushMenu navigation item is missing an `id` or `title`:', item)
        continue
      }
      if (seen.has(item.id)) {
        console.warn(
          `[nswds/ui] PushMenu navigation contains duplicate id "${item.id}" — level ids and focus restoration track items by id, so ids must be unique across the whole tree.`,
        )
      }
      seen.add(item.id)
      if (!item.href && !item.links?.length) {
        console.warn(
          `[nswds/ui] PushMenu item "${item.id}" has neither an href nor children — it renders as a button that only fires onItemClick.`,
        )
      }
      if (item.links?.length) {
        visit(item.links)
      }
    }
  }
  visit(navigation)
}

// One treatment for every row — drill-in buttons and leaf links alike — so the
// two read as a single list. Tokenized from the nswds-app source's
// border-l + primary-800 active pattern, with dark-mode equivalents the app
// lacked (its grey-800-on-white text disappeared in dark mode).
const itemBaseClassName = [
  // min-h-11 guarantees the 44px minimum target size (WCAG 2.2, 2.5.8 Target
  // Size) even for single-line rows with compact padding overrides.
  'relative flex min-h-11 w-full cursor-pointer items-center justify-between gap-x-6 border-l p-4 text-left text-base',
  'transition-colors motion-reduce:transition-none',
  'hover:border-primary-800 hover:bg-primary-800/10 dark:hover:border-primary-200 dark:hover:bg-primary-200/10',
  // Inset outline (negative offset): the levels scroll inside an
  // overflow-hidden root, so an outward offset would be clipped on the first
  // and last rows (WCAG 2.2, 2.4.13 Focus Appearance).
  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-800 dark:focus-visible:outline-primary-200',
].join(' ')

const itemActiveClassName =
  'border-primary-800 bg-primary-800/10 font-semibold text-primary-800 dark:border-primary-200 dark:bg-primary-200/10 dark:text-primary-200'

const itemInactiveClassName = 'border-transparent text-popover-foreground'

type PushMenuProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children' | 'title'> & {
  /** The menu tree. Item ids must be unique across the whole tree. */
  navigation: PushMenuItem[]
  /**
   * The app's current pathname. Leaf links whose `href` matches get
   * `aria-current="page"` and the active treatment. Replaces the nswds-app
   * source's `usePathname()` — the design system is framework-free, so the
   * router value is passed in rather than read from next/navigation.
   */
  currentHref?: string
  /** Root level title, shown in the header row. Also the default `aria-label`. */
  title?: string
  /** Fired when a leaf item (link or child-less button) is activated. */
  onItemClick?: (item: PushMenuItem) => void
  /** Fired after a forward/back slide settles on a level. */
  onNavigate?: (level: PushMenuLevel, history: PushMenuLevel[]) => void
  /**
   * Renders a close button in the header row when provided. Unlike the
   * nswds-app source — which only offered close on sub-levels, leaving the
   * root level uncloseable — the button renders on every level.
   */
  onClose?: () => void
  /** Show the "A › B › C" trail under the header on sub-levels. Defaults to `true`. */
  showBreadcrumbs?: boolean
  /**
   * Slide duration in milliseconds, defaulting to `PUSH_MENU_DURATION_MS`
   * (300). Drives both the `--push-menu-duration` custom property and the
   * state machine's timeouts — tune the slide here, never by overriding the
   * custom property (see the coupling note on the constant).
   */
  durationMs?: number
  /** Label for the Back button on sub-levels. Defaults to `'Back'`. */
  backLabel?: string
  /** Accessible label for the close button. Defaults to `'Close menu'`. */
  closeLabel?: string
  /**
   * Heading level for the per-level title, following `FooterNavColumn`'s
   * precedent (the nswds-app source used a `Heading` component this package
   * does not ship). Defaults to `2`; `1` is excluded because a menu panel
   * title is never the page's own title.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  ref?: React.Ref<HTMLElement>
}

/**
 * Multi-level slide-in-place drill-down menu ("push menu") for mobile
 * navigation, ported from nswds-app's `MultiLevelPushMenu`. Items with
 * children render as buttons that slide a new level in from the right; leaf
 * items render as links through `Link`, so apps can inject their framework
 * link component via `LinkProvider`. Fill height from its container — compose
 * it inside `SheetContent side="left"` for the classic mobile drawer.
 *
 * Accessibility contract (all improvements over the nswds-app source, which
 * got several of these wrong):
 *
 * - The root is a `nav` landmark named by `title` (override with `aria-label`).
 * - Non-current levels carry the `inert` attribute, so a hidden level's links
 *   are neither tabbable nor exposed to assistive tech. The app left every
 *   mounted level in the tab order, letting keyboard users tab into invisible
 *   history levels (WCAG 2.2, 2.4.3 Focus Order).
 * - Focus moves with the level change (2.4.3): drilling forward focuses the
 *   new level's Back button; going back focuses the item that opened the
 *   level just left, tracked by item id and restored after the slide settles.
 *   Without this, `inert` on the old level would silently drop focus to
 *   `<body>`. The Back button is the only route back (the breadcrumb is
 *   decorative), so it always renders on sub-levels — hiding it would make
 *   drill-down one-way.
 * - A single visually-hidden `aria-live="polite"` region at the root announces
 *   the current level's title, suffixed with the level number below the root.
 *   A live attribute on the per-level headings would not work: each level's
 *   heading is freshly mounted, and newly-mounted live regions are not
 *   reliably announced.
 * - Level lists are `<ul role="list">` — `list-style: none` strips list
 *   semantics in some screen reader/browser pairings (notably VoiceOver), and
 *   the explicit role restores them.
 * - Every row is at least 44px tall (2.5.8 Target Size); Back/close buttons
 *   inherit `Button`'s 44px touch target.
 * - During the slide, rows get `pointer-events-none` and the state machine
 *   ignores re-entrant navigation, but nothing is ever `disabled` — disabling
 *   the focused Back button mid-animation would eject keyboard focus.
 * - Slides are CSS transforms with `motion-reduce:transition-none`, replacing
 *   the app's inline transition strings (which ignored reduced motion).
 *
 * Departures from the nswds-app source, beyond the above:
 *
 * - The footer/stats block (Level N, item counts, progress dots, lucide
 *   icons) is cut, along with its `showStats`/`showFooter` props: it was demo
 *   chrome for the sandbox, not part of a navigation component's job. The
 *   breadcrumb trail it hosted moves under the header row.
 * - The rendered "Navigation Error" fallback for malformed data is replaced
 *   by a dev-only console warning (`warnIfNavigationMalformed`), mirroring
 *   button.tsx's `warnIfIconButtonUnlabelled`.
 * - The breadcrumb trail is `aria-hidden`: it repeats what the heading and
 *   live region already announce, and "›" separators read poorly in AT.
 *
 * The level stack is seeded from `navigation`/`title` on mount; pass a `key`
 * to remount (and reset to the root level) if either changes at runtime.
 */
function PushMenu({
  navigation,
  currentHref,
  title = 'Menu',
  onItemClick,
  onNavigate,
  onClose,
  showBreadcrumbs = true,
  durationMs = PUSH_MENU_DURATION_MS,
  backLabel = 'Back',
  closeLabel = 'Close menu',
  headingLevel = 2,
  className,
  style,
  'aria-label': ariaLabel,
  ref,
  ...props
}: PushMenuProps) {
  const [navigationHistory, setNavigationHistory] = React.useState<PushMenuLevel[]>(() => [
    { items: navigation, title, depth: 1, id: buildLevelId([]) },
  ])
  const [animationState, setAnimationState] = React.useState<PushMenuAnimationState>('idle')
  const [isAnimationStarted, setIsAnimationStarted] = React.useState(false)

  const containerRef = React.useRef<HTMLElement | null>(null)
  const timeoutRef = React.useRef<number | null>(null)
  // Focus target applied by the effect below, after React commits the level
  // change — the target element must exist and must no longer be inert.
  const pendingFocusRef = React.useRef<{ levelId: string; itemId?: string } | null>(null)

  warnIfNavigationMalformed(navigation)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Layout effect, not a passive one: the same commit that queues a focus
  // move can also flip the previously-focused element inert (drilling turns
  // the old level inert; going back turns the departing level inert), and the
  // browser blurs an element the moment it becomes inert. Applying the new
  // focus before paint means AT never observes the intermediate
  // focus-on-body state, and a containing dialog's focus guards (Base UI
  // Sheet) see focus already inside the popup when their async handlers run.
  React.useLayoutEffect(() => {
    const pending = pendingFocusRef.current
    if (!pending) {
      return
    }
    pendingFocusRef.current = null
    const level = containerRef.current?.querySelector<HTMLElement>(
      `[data-level-id="${CSS.escape(pending.levelId)}"]`,
    )
    if (!level) {
      return
    }
    const target = pending.itemId
      ? level.querySelector<HTMLElement>(`[data-item-id="${CSS.escape(pending.itemId)}"]`)
      : (level.querySelector<HTMLElement>('[data-slot="push-menu-back-button"]') ??
        level.querySelector<HTMLElement>(
          '[data-slot="push-menu-item"], [data-slot="push-menu-link"]',
        ))
    // preventScroll: a level mid-slide sits at translateX(100%) inside an
    // overflow-hidden root; letting focus scroll it into view would desync the
    // container's scroll position from the transform.
    target?.focus({ preventScroll: true })
    // animationState is a dependency because back-navigation queues its focus
    // move on the slide START (an animationState commit), not on the level
    // pop — see navigateBack.
  }, [navigationHistory, animationState])

  const breadcrumb = React.useMemo(
    // During a back slide the trail already excludes the departing level —
    // the breadcrumb tracks the level the user is arriving at (see
    // activeIndex below), same as the live region.
    () =>
      generatePushMenuBreadcrumb(
        animationState === 'sliding-backward' ? navigationHistory.slice(0, -1) : navigationHistory,
      ),
    [navigationHistory, animationState],
  )

  function navigateToSubmenu(item: PushMenuItem) {
    if (!item.links?.length || animationState !== 'idle') {
      return
    }
    const levelPath = [
      ...navigationHistory.flatMap((level) => (level.parentItem ? [level.parentItem.id] : [])),
      item.id,
    ]
    const currentDepth = navigationHistory.at(-1)?.depth ?? 1
    const newLevel: PushMenuLevel = {
      items: item.links,
      title: item.title,
      parentItem: item,
      depth: currentDepth + 1,
      id: buildLevelId(levelPath),
    }
    const newHistory = [...navigationHistory, newLevel]

    // Focus moves as soon as the new level commits (see the effect above):
    // waiting for the slide to finish would leave focus on the old level,
    // which turns inert in the same commit and would eject focus to <body>.
    pendingFocusRef.current = { levelId: newLevel.id }
    setNavigationHistory(newHistory)
    setAnimationState('sliding-forward')
    setIsAnimationStarted(false)

    // Two-step start: the new level mounts at translateX(100%) with no
    // transition, then flips to 0 with the transition on. The layout read in
    // between is LOAD-BEARING: without it, nothing forces the browser to
    // compute styles for the mounted-at-100% frame, and when both states land
    // in one style recalc there is no transition — the panel snaps into
    // place instead of sliding (an intermittent, timing-dependent jump).
    // Reading layout inside the rAF forces that recalc deterministically.
    requestAnimationFrame(() => {
      containerRef.current?.getBoundingClientRect()
      setIsAnimationStarted(true)
    })

    timeoutRef.current = window.setTimeout(() => {
      setAnimationState('idle')
      setIsAnimationStarted(false)
      onNavigate?.(newLevel, newHistory)
    }, durationMs)
  }

  function navigateBack() {
    if (navigationHistory.length <= 1 || animationState !== 'idle') {
      return
    }
    const popped = navigationHistory.at(-1)
    const revealed = navigationHistory.at(-2)
    if (!revealed) {
      return
    }

    // Focus moves at slide START, symmetric with drilling forward: the
    // 'sliding-backward' commit un-inerts the revealed level (see the
    // activeIndex logic below) and the effect above focuses the item that
    // opened the departing level. Restoring focus at the POP instead — while
    // focus still sat on the departing level's Back button — meant the
    // focused node was removed from a live dialog, and Base UI's focus
    // containment would re-grab focus to the dialog popup a frame after our
    // restoration, silently overriding it (observed inside Sheet).
    pendingFocusRef.current = { levelId: revealed.id, itemId: popped?.parentItem?.id }
    setAnimationState('sliding-backward')

    timeoutRef.current = window.setTimeout(() => {
      const newHistory = navigationHistory.slice(0, -1)
      setNavigationHistory(newHistory)
      setAnimationState('idle')
      onNavigate?.(revealed, newHistory)
    }, durationMs)
  }

  const currentLevel = navigationHistory.at(-1)
  if (!currentLevel) {
    return null
  }

  const isAnimating = animationState !== 'idle'
  // The level the user is arriving AT — the stack top, except during a back
  // slide, where the user's intent has already committed to the level being
  // revealed underneath. data-current, inert, the live region and the
  // breadcrumb all follow this index so focus can land on the revealed level
  // at slide start and AT hears the destination, not the departing level.
  const activeIndex =
    animationState === 'sliding-backward'
      ? navigationHistory.length - 2
      : navigationHistory.length - 1
  const activeLevel = navigationHistory[activeIndex] ?? currentLevel
  const HeadingTag = `h${headingLevel}` as const

  return (
    <nav
      data-slot='push-menu'
      aria-label={ariaLabel ?? title}
      // Present while a slide is running (matches header's present-or-absent
      // data-scrolled convention). Consumers can style the transition off it;
      // tests use it to wait for the state machine to go idle — clicks during
      // a slide are dropped by design, and pointer-events-none does not stop
      // a programmatic .click().
      data-animating={isAnimating || undefined}
      {...props}
      className={cn(
        'relative isolate h-full overflow-hidden bg-popover text-popover-foreground',
        className,
      )}
      // The slide duration custom property is set from durationMs so the CSS
      // transition and the setTimeout state machine can never disagree — see
      // the coupling note on PUSH_MENU_DURATION_MS.
      style={{ ...style, '--push-menu-duration': `${durationMs}ms` } as React.CSSProperties}
      ref={(node) => {
        containerRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.RefObject<HTMLElement | null>).current = node
        }
      }}
    >
      {/* Persistent live region: announces level changes to AT without
          stealing focus from the managed focus moves. The level number is
          appended below the root because live regions only re-announce when
          their content actually changes — navigating between identically-
          titled levels would otherwise announce nothing. Consecutive levels
          always differ in depth, so consecutive announcements always differ. */}
      <div data-slot='push-menu-live-region' aria-live='polite' className='sr-only'>
        {activeLevel.depth > 1
          ? `${activeLevel.title}, level ${activeLevel.depth}`
          : activeLevel.title}
      </div>

      {navigationHistory.map((level, index) => {
        // The stack top is the level that MOVES (slides in forward, slides
        // out backward); the active level is the one the user is arriving at
        // — they differ only during a back slide.
        const isTopLevel = index === navigationHistory.length - 1
        const isActiveLevel = index === activeIndex
        // Always shown below the root: the Back button is the ONLY route back
        // (the breadcrumb is aria-hidden and there is no keyboard binding or
        // imperative API), so making it optional would strand users.
        const shouldShowBackButton = level.depth > 1

        let translateX = 0
        if (animationState === 'sliding-forward') {
          translateX = isTopLevel ? (isAnimationStarted ? 0 : 100) : 0
        } else if (animationState === 'sliding-backward') {
          translateX = isTopLevel ? 100 : 0
        }

        // Only the moving (top) level transitions; forward slides wait for
        // the second frame so the mount position is applied untransitioned.
        const isSliding =
          isTopLevel &&
          (animationState === 'sliding-backward' ||
            (animationState === 'sliding-forward' && isAnimationStarted))

        return (
          <div
            key={level.id}
            data-slot='push-menu-level'
            data-level-id={level.id}
            data-current={isActiveLevel || undefined}
            // Non-active levels must be invisible to keyboard and AT, not
            // just to the eye. Keying this on the ACTIVE level (not the stack
            // top) un-inerts the revealed level at back-slide start, so focus
            // can move there immediately — and the focused Back button is
            // never removed from a live dialog while still focused.
            inert={!isActiveLevel}
            className={cn(
              'absolute inset-0 flex h-full w-full flex-col bg-popover will-change-transform',
              isSliding
                ? 'transition-transform duration-(--push-menu-duration) ease-out motion-reduce:transition-none'
                : 'transition-none',
            )}
            style={{ transform: `translateX(${translateX}%)`, zIndex: index + 1 }}
          >
            <div
              data-slot='push-menu-header'
              className='flex min-h-11 items-center gap-1 border-b border-border px-2 py-2'
            >
              {shouldShowBackButton && (
                <Button
                  data-slot='push-menu-back-button'
                  variant='ghost'
                  color='primary'
                  size='sm'
                  leadingVisual={IconWest}
                  onClick={navigateBack}
                  className={cn(isAnimating && 'pointer-events-none')}
                >
                  {backLabel}
                </Button>
              )}
              <HeadingTag
                data-slot='push-menu-title'
                className='min-w-0 flex-1 truncate px-2 text-base font-semibold'
              >
                {level.title}
              </HeadingTag>
              {onClose && (
                <Button
                  data-slot='push-menu-close-button'
                  variant='ghost'
                  color='grey'
                  size='icon'
                  aria-label={closeLabel}
                  leadingVisual={IconClose}
                  onClick={onClose}
                />
              )}
            </div>

            {showBreadcrumbs && isActiveLevel && level.depth > 1 && (
              // aria-hidden: the trail repeats what the heading and live
              // region already announce, and "›" separators read poorly in AT.
              <p
                data-slot='push-menu-breadcrumb'
                aria-hidden='true'
                className='truncate border-b border-border px-4 py-2 text-xs text-muted-foreground'
              >
                {breadcrumb}
              </p>
            )}

            <div data-slot='push-menu-items' className='flex-1 overflow-y-auto'>
              {/* role='list' restores list semantics stripped by list-none. */}
              <ul role='list' className='m-0 list-none divide-y divide-border p-0'>
                {level.items.map((item) => {
                  const hasChildren = Boolean(item.links?.length)
                  const isActive = item.href != null && item.href === currentHref

                  return (
                    <li key={item.id}>
                      {hasChildren ? (
                        <button
                          type='button'
                          data-slot='push-menu-item'
                          data-item-id={item.id}
                          onClick={() => navigateToSubmenu(item)}
                          className={cn(
                            itemBaseClassName,
                            isActive ? itemActiveClassName : itemInactiveClassName,
                            isAnimating && 'pointer-events-none',
                          )}
                        >
                          <span className='min-w-0 flex-1 truncate'>{item.title}</span>
                          <IconChevronRight aria-hidden='true' className='size-5 shrink-0' />
                        </button>
                      ) : item.href ? (
                        <Link
                          variant='unstyled'
                          data-slot='push-menu-link'
                          data-item-id={item.id}
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => onItemClick?.(item)}
                          className={cn(
                            itemBaseClassName,
                            isActive ? itemActiveClassName : itemInactiveClassName,
                            isAnimating && 'pointer-events-none',
                          )}
                        >
                          <span className='min-w-0 flex-1 truncate'>{item.title}</span>
                        </Link>
                      ) : (
                        <button
                          type='button'
                          data-slot='push-menu-item'
                          data-item-id={item.id}
                          onClick={() => onItemClick?.(item)}
                          className={cn(
                            itemBaseClassName,
                            itemInactiveClassName,
                            isAnimating && 'pointer-events-none',
                          )}
                        >
                          <span className='min-w-0 flex-1 truncate'>{item.title}</span>
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )
      })}
    </nav>
  )
}

export { generatePushMenuBreadcrumb, PUSH_MENU_DURATION_MS, PushMenu }
export type { PushMenuItem, PushMenuLevel, PushMenuProps }

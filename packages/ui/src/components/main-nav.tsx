'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { IconEast } from '../icons/east.js'
import { cn } from '../lib/utils.js'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../components/navigation-menu.js'

/**
 * Surface colours the main navigation can be themed with — exactly the
 * Footer's thirteen-name vocabulary, so a service that themes its footer
 * `primary-800` writes the same word here. Each name is the LIGHT-mode
 * surface; dark mode deepens it onto the same family's dark steps (see the
 * `color` variants below), so `color` expresses tonal weight rather than a
 * literal colour.
 *
 * The bar's text/background pairs are identical to the Footer's, so its
 * contrast conclusions carry over verbatim: every light pair clears WCAG 2.2
 * AA (1.4.3, 4.5:1) for the bar's text and 11 of the 13 also clear AAA
 * (1.4.6, 7:1). The two AA-only pairs are `primary-600` (4.57:1) and
 * `accent-600` (5.18:1), both with white ink; prefer the `-800` steps when a
 * service is held to AAA. In dark mode all thirteen clear AAA (worst 13.6:1).
 *
 * The mega panels always render on the house popup surface (`bg-popover`),
 * matching the nswds-app source where every dropdown was white regardless of
 * bar colour — only the panel's accent ink follows the colour family.
 */
const mainNavColors = [
  'primary-800',
  'primary-600',
  'primary-400',
  'primary-200',
  'grey-800',
  'grey-600',
  'grey-400',
  'grey-200',
  'accent-800',
  'accent-600',
  'accent-400',
  'accent-200',
  'white',
] as const

type MainNavColor = (typeof mainNavColors)[number]

// Shared by cva's defaultVariants, the data-color attribute and the panel
// variant lookup, so the three can't drift apart.
const DEFAULT_MAIN_NAV_COLOR: MainNavColor = 'white'

const mainNavVariants = cva(
  [
    'w-full',
    // Every derived colour on the bar resolves from a single --main-nav-ink
    // token, so a colour variant only has to declare the surface utilities and
    // that one value — this replaces the nswds-app source's hand-written
    // 13-variant × 8-slot style table. The border derivation is written
    // literally here (once) rather than per-variant: Tailwind scans source
    // text for class names, so a template-built arbitrary property would
    // never be emitted. Hover/active halos are not derived here — the
    // triggers ride navigation-menu.tsx's --nav-menu-halo chain, re-pointed
    // at this ink (see mainNavItemInk), so there is exactly one halo recipe.
    '[--main-nav-border:color-mix(in_oklch,var(--main-nav-ink)_15%,transparent)]',
  ],
  {
    variants: {
      // Ink values use the RAW masterbrand tokens (--primary-800, --grey-800,
      // --accent-800) rather than Tailwind's --color-* bridge aliases. Tailwind
      // v4 tree-shakes an unreferenced @theme key, and referencing one from
      // inside an arbitrary property is not a usage signal — the raw tokens are
      // plain :root declarations from @nswds/tokens and always resolve.
      // (--color-white is safe: `text-white` / `bg-white` below are real
      // utilities, so that key is always emitted.)
      //
      // Dark mode deepens every surface onto the same family's dark steps —
      // -800→-950, -600→-900, -400→-850, -200→-800, white→grey-900 — the
      // Footer's exact mapping, so the luminance ORDER within a family is
      // preserved and a stacked Footer + MainNav sharing one colour word stay
      // in step in both themes. Ink goes white on all thirteen; every dark
      // pair is WCAG 2.2 AAA (worst 13.6:1).
      color: {
        'primary-800':
          'bg-primary-800 text-white [--main-nav-ink:var(--color-white)] dark:bg-primary-950',
        'primary-600':
          'bg-primary-600 text-white [--main-nav-ink:var(--color-white)] dark:bg-primary-900',
        'primary-400':
          'bg-primary-400 text-primary-800 [--main-nav-ink:var(--primary-800)] dark:bg-primary-850 dark:text-white dark:[--main-nav-ink:var(--color-white)]',
        'primary-200':
          'bg-primary-200 text-primary-800 [--main-nav-ink:var(--primary-800)] dark:bg-primary-800 dark:text-white dark:[--main-nav-ink:var(--color-white)]',
        'grey-800': 'bg-grey-800 text-white [--main-nav-ink:var(--color-white)] dark:bg-grey-950',
        'grey-600': 'bg-grey-600 text-white [--main-nav-ink:var(--color-white)] dark:bg-grey-900',
        'grey-400':
          'bg-grey-400 text-grey-800 [--main-nav-ink:var(--grey-800)] dark:bg-grey-850 dark:text-white dark:[--main-nav-ink:var(--color-white)]',
        'grey-200':
          'bg-grey-200 text-grey-800 [--main-nav-ink:var(--grey-800)] dark:bg-grey-800 dark:text-white dark:[--main-nav-ink:var(--color-white)]',
        'accent-800':
          'bg-accent-800 text-white [--main-nav-ink:var(--color-white)] dark:bg-accent-950',
        'accent-600':
          'bg-accent-600 text-white [--main-nav-ink:var(--color-white)] dark:bg-accent-900',
        'accent-400':
          'bg-accent-400 text-accent-800 [--main-nav-ink:var(--accent-800)] dark:bg-accent-850 dark:text-white dark:[--main-nav-ink:var(--color-white)]',
        'accent-200':
          'bg-accent-200 text-accent-800 [--main-nav-ink:var(--accent-800)] dark:bg-accent-800 dark:text-white dark:[--main-nav-ink:var(--color-white)]',
        white:
          'bg-white text-grey-800 [--main-nav-ink:var(--grey-800)] dark:bg-grey-900 dark:text-white dark:[--main-nav-ink:var(--color-white)]',
      },
      // Rules along the bar's edges, drawn from the ink-derived border token so
      // they follow every colour variant and both themes. Replaces the app
      // source's deprecated showTopBorder/showBottomBorder booleans, which are
      // deliberately not ported.
      border: {
        none: '',
        top: 'border-t border-(--main-nav-border)',
        bottom: 'border-b border-(--main-nav-border)',
        both: 'border-y border-(--main-nav-border)',
      },
    },
    defaultVariants: {
      color: DEFAULT_MAIN_NAV_COLOR,
      border: 'none',
    },
  },
)

const mainNavContainerVariants = cva(
  [
    'mx-auto flex w-full items-center',
    // Lateral padding funnels through --main-nav-padding-x so an app can
    // retune it once (via the `style` prop or a utility class) without a new
    // variant. Same mechanism, and the same 16px → 24px → 48px rhythm, as
    // Masthead, Header and Footer.
    'px-(--main-nav-padding-x)',
    '[--main-nav-padding-x:--spacing(4)] sm:[--main-nav-padding-x:--spacing(6)] lg:[--main-nav-padding-x:--spacing(12)]',
  ],
  {
    variants: {
      container: {
        // Full-bleed (nswds-app fullBleed parity). --main-nav-max-width is
        // still read so a shell app can constrain the inner wrapper without
        // switching variants.
        fluid: 'max-w-[var(--main-nav-max-width,none)]',
        // Centred content column, legacy nsw-container parity (1200px).
        contained: 'max-w-[var(--main-nav-max-width,75rem)]',
      },
    },
    defaultVariants: {
      container: 'fluid',
    },
  },
)

/**
 * Mega-panel accent ink, keyed by the same thirteen colour names as the bar.
 * The panel itself is always the house popup surface (`bg-popover`, white in
 * light mode) — parity with the app source, whose dropdown was white for
 * every variant — so the family only tints the featured lead link, hover ink
 * and cell borders. Declared on the Content element (not inherited from the
 * bar) because Base UI portals the panel to `document.body`: a custom
 * property set on the `<nav>` can never reach it.
 *
 * Light inks are the family's -800 step on white — grey-800 on white is
 * 15.1:1 and white on primary-800 is 14.4:1 (both AAA; contrast is symmetric,
 * ratios from header.tsx); accent-800 on white clears AAA per the Footer's
 * verified pairs. Dark inks step to the family's -200 — the same dark-mode
 * interactive ink link.tsx and navigation-menu.tsx already use on this
 * popover surface. The featured lead is text-xl bold, so even the softest
 * pair is far above the large-text AA floor (1.4.3, 3:1).
 */
const mainNavPanelVariants = cva(
  [
    'p-0 whitespace-normal',
    // The sibling Content (and the shared popup, via popupClassName below)
    // cap themselves at --available-width, which Base UI measures from the
    // active trigger — for a mid-bar trigger that is less than the nav's
    // width, which would shrink right-hand panels. The panel's width is
    // container-measured and can never exceed the viewport, so the cap is
    // safely lifted.
    'max-w-none',
    '[--main-nav-panel-border:color-mix(in_oklch,var(--main-nav-panel-ink)_15%,transparent)]',
  ],
  {
    variants: {
      color: {
        'primary-800':
          '[--main-nav-panel-ink:var(--primary-800)] dark:[--main-nav-panel-ink:var(--primary-200)]',
        'primary-600':
          '[--main-nav-panel-ink:var(--primary-800)] dark:[--main-nav-panel-ink:var(--primary-200)]',
        'primary-400':
          '[--main-nav-panel-ink:var(--primary-800)] dark:[--main-nav-panel-ink:var(--primary-200)]',
        'primary-200':
          '[--main-nav-panel-ink:var(--primary-800)] dark:[--main-nav-panel-ink:var(--primary-200)]',
        'grey-800':
          '[--main-nav-panel-ink:var(--grey-800)] dark:[--main-nav-panel-ink:var(--grey-200)]',
        'grey-600':
          '[--main-nav-panel-ink:var(--grey-800)] dark:[--main-nav-panel-ink:var(--grey-200)]',
        'grey-400':
          '[--main-nav-panel-ink:var(--grey-800)] dark:[--main-nav-panel-ink:var(--grey-200)]',
        'grey-200':
          '[--main-nav-panel-ink:var(--grey-800)] dark:[--main-nav-panel-ink:var(--grey-200)]',
        'accent-800':
          '[--main-nav-panel-ink:var(--accent-800)] dark:[--main-nav-panel-ink:var(--accent-200)]',
        'accent-600':
          '[--main-nav-panel-ink:var(--accent-800)] dark:[--main-nav-panel-ink:var(--accent-200)]',
        'accent-400':
          '[--main-nav-panel-ink:var(--accent-800)] dark:[--main-nav-panel-ink:var(--accent-200)]',
        'accent-200':
          '[--main-nav-panel-ink:var(--accent-800)] dark:[--main-nav-panel-ink:var(--accent-200)]',
        white: '[--main-nav-panel-ink:var(--grey-800)] dark:[--main-nav-panel-ink:var(--grey-200)]',
      },
    },
    defaultVariants: {
      color: DEFAULT_MAIN_NAV_COLOR,
    },
  },
)

// Re-points the sibling navigation-menu's ink at the bar's surface ink. The
// trigger/link halos and focus outlines in navigation-menu.tsx all derive
// from --nav-menu-ink via color-mix ON THE SAME ELEMENT, so overriding the
// one token retargets the whole chain: hover/active halos and the
// focus-visible outline become surface-relative, guaranteeing the indicator
// contrasts on all thirteen surfaces (WCAG 2.2, 2.4.13 Focus Appearance).
// Both light and dark are overridden because the sibling pins its own
// dark-mode ink (primary-200); --main-nav-ink is already theme-aware.
const mainNavItemInk =
  '[--nav-menu-ink:var(--main-nav-ink)] dark:[--nav-menu-ink:var(--main-nav-ink)]'

// Same re-point for links INSIDE the portalled panel, where the bar's ink
// cannot reach — these derive from the panel accent ink instead.
const mainNavPanelInk =
  '[--nav-menu-ink:var(--main-nav-panel-ink)] dark:[--nav-menu-ink:var(--main-nav-panel-ink)]'

// Restyles the sibling trigger to the app source's bar metrics: 56px min
// height, square corners, bold base text, wider gutters from lg up. The open
// panel is marked with the app's 4px inset underline (data-popup-open comes
// from Base UI); data-current draws the same underline persistently when
// `currentHref` falls inside this section, so the underline means "you are
// here" at rest and "this panel is open" during use.
const mainNavTriggerClassName = [
  mainNavItemInk,
  'mb-0 h-auto min-h-14 w-auto justify-start rounded-none max-lg:px-4 py-2 text-base leading-6 font-bold text-(--main-nav-ink)',
  'lg:px-8',
  '[&_svg]:size-6',
  'data-popup-open:shadow-[inset_0_-4px_0_0_currentColor]',
  'data-current:shadow-[inset_0_-4px_0_0_currentColor]',
].join(' ')

// A panel-less item, restyled from the sibling link to sit visually beside
// the triggers (cn's conflict merge lets these win over the link's stacked
// defaults). `active` → data-active draws the current-page underline; Base UI
// pairs it with aria-current='page' on the same element (WCAG 2.4.8).
const mainNavTopLinkClassName = [
  mainNavItemInk,
  'inline-flex min-h-14 flex-row items-center justify-start gap-1 rounded-none max-lg:px-4 py-2 text-base leading-6 font-bold whitespace-nowrap text-(--main-nav-ink)',
  'lg:px-8',
  'data-active:shadow-[inset_0_-4px_0_0_currentColor]',
].join(' ')

// The featured lead link at the top of a mega panel: the section title,
// oversized, with an east arrow that nudges forward on hover (the app
// source's exact affordance, on the house easing curve; the nudge is a
// transition, so motion-reduce users get an instant state change — WCAG
// 2.3.3). `group` scopes the icon's group-hover to this anchor — the panel is
// portalled, so no other `group` ancestor can capture it.
const mainNavFeaturedLinkClassName = [
  mainNavPanelInk,
  'group relative flex-row items-center rounded-none px-8 py-8 text-xl font-bold whitespace-normal text-(--main-nav-panel-ink)',
].join(' ')

// The lead when the section has no `href`: the same visual weight as the
// featured link, but a plain heading row — no anchor (a dead link announced
// as a link fails the reader who activates it), no hover halo, and no east
// arrow (an arrow on a non-link promises navigation that never happens). No
// mainNavPanelInk re-point either: that chain only feeds interactive halos.
const mainNavFeaturedHeadingClassName =
  'flex flex-row items-center px-8 py-8 text-xl font-bold whitespace-normal text-(--main-nav-panel-ink)'

// One bordered grid cell per section link. The anchor itself is the cell —
// the app source wrapped a div around a stretched-link span, but making the
// whole cell the anchor gives the same hit area with one element and no
// aria-hidden overlay. Cells draw a top hairline from the panel ink; the last
// grid row closes with a bottom hairline via the app's :nth-last-child(-n+3)
// selector (tuned to the widest, 3-column layout — at narrower widths the
// final one or two cells simply carry the closing rule, matching the app).
const mainNavSectionLinkClassName = [
  mainNavPanelInk,
  'relative mx-2 justify-center rounded-none border-t border-(--main-nav-panel-border) p-4 text-base font-semibold whitespace-normal text-popover-foreground',
  'hover:text-(--main-nav-panel-ink)',
  '[&:nth-last-child(-n+3)]:border-b',
].join(' ')

/** One link inside a mega panel. */
type MainNavLinkItem = {
  /** Visible link text, e.g. "Find support near you". */
  title: string
  href: string
}

/**
 * One top-level navigation item. With `links` it renders as a trigger opening
 * a mega panel (with `href` becoming the panel's featured lead link; without
 * an `href` the lead is a plain heading row — dev builds warn); without
 * `links` it renders as a plain link styled like the triggers. Recursion is
 * deliberately one level deep — mega panels list flat links, per the app
 * source's NavigationSection shape.
 */
type MainNavItem = {
  title: string
  href?: string
  links?: MainNavLinkItem[]
}

/**
 * Dev-only guard, mirroring the icon-only Button check in button.tsx: an item
 * with neither `href` nor `links` renders a dead `"#"` link — almost always a
 * data mistake, and a trap for keyboard and screen-reader users who activate
 * it and go nowhere. A section (`links`, no `href`) is legal but demoted —
 * its panel lead renders as a plain heading instead of the featured link —
 * so it gets its own nudge. No-op in production.
 */
function warnIfItemUnlinked(item: MainNavItem) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  if (!item.href && !item.links?.length) {
    console.warn(
      `[nswds/ui] MainNav item "${item.title}" has no href and no links — it will render as a dead "#" link.`,
    )
  }
  if (!item.href && item.links?.length) {
    console.warn(
      `[nswds/ui] MainNav section "${item.title}" has links but no href — its panel lead renders as a plain heading; pass href to make it a link.`,
    )
  }
}

type MainNavMenuItemProps = {
  item: MainNavItem
  color: MainNavColor
  currentHref?: string
  /** Measured container width, forwarded as the panel's inline width. */
  panelWidth: number | null
}

/**
 * One bar entry: a plain link for items without `links`, a trigger + mega
 * panel for items with them. Internal — the data-driven `MainNav` API is the
 * public surface; compose the navigation-menu primitives directly for layouts
 * this doesn't cover.
 */
function MainNavMenuItem({ item, color, currentHref, panelWidth }: MainNavMenuItemProps) {
  warnIfItemUnlinked(item)

  const links = item.links
  const isExactCurrent = item.href !== undefined && item.href === currentHref
  const isSectionCurrent =
    isExactCurrent ||
    (currentHref !== undefined && (links?.some((link) => link.href === currentHref) ?? false))

  if (!links?.length) {
    return (
      <NavigationMenuItem className='shrink-0'>
        <NavigationMenuLink
          data-slot='main-nav-top-link'
          href={item.href ?? '#'}
          active={isExactCurrent}
          className={mainNavTopLinkClassName}
        >
          {item.title}
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem className='shrink-0'>
      {/* The trigger is a button (it discloses, it doesn't navigate), so it
          can't carry aria-current — data-current draws the visual "you are
          here" underline while the aria-current announcement lives on the
          exact matching link inside the panel. */}
      <NavigationMenuTrigger
        data-current={isSectionCurrent || undefined}
        className={mainNavTriggerClassName}
      >
        {item.title}
      </NavigationMenuTrigger>
      {/* Inline width (not a CSS var): the panel is portalled to
          document.body, so a custom property set on the nav can't reach it.
          Before the first measurement resolves the panel falls back to the
          sibling's natural w-max sizing. */}
      <NavigationMenuContent
        data-slot='main-nav-panel'
        className={mainNavPanelVariants({ color })}
        style={panelWidth === null ? undefined : { width: panelWidth }}
      >
        <div className='grid w-full'>
          {/* No section href → no featured LINK: an `href="#"` fallback here
              would be a dead link announced as a link. The heading row keeps
              the lead's visual weight without the anchor, halo or arrow — see
              mainNavFeaturedHeadingClassName. */}
          {item.href === undefined ? (
            <div data-slot='main-nav-featured-heading' className={mainNavFeaturedHeadingClassName}>
              {item.title}
            </div>
          ) : (
            <NavigationMenuLink
              data-slot='main-nav-featured-link'
              href={item.href}
              active={isExactCurrent}
              className={mainNavFeaturedLinkClassName}
            >
              {item.title}
              <IconEast
                aria-hidden='true'
                className='ml-4 size-6 shrink-0 text-current duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-safe:transition-transform'
              />
            </NavigationMenuLink>
          )}
          <div
            data-slot='main-nav-panel-links'
            className='grid overflow-hidden px-4 pb-12 max-sm:grid-cols-1 sm:max-lg:grid-cols-2 lg:grid-cols-3'
          >
            {links.map((link, index) => (
              <NavigationMenuLink
                key={`${link.title}-${link.href}-${index}`}
                data-slot='main-nav-section-link'
                href={link.href}
                active={link.href === currentHref}
                className={mainNavSectionLinkClassName}
              >
                {link.title}
              </NavigationMenuLink>
            ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

type MainNavProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> &
  VariantProps<typeof mainNavVariants> &
  VariantProps<typeof mainNavContainerVariants> & {
    /** Top-level items; items with `links` open mega panels. */
    navigation: MainNavItem[]
    /**
     * The current page's href. The exact matching link gets
     * `aria-current="page"`, and the top-level item it belongs to (a plain
     * link, or the trigger whose panel contains it) gets the current-item
     * underline. The app source read this from next/navigation's
     * `usePathname` — a framework API this package must not import; compare
     * in the consumer and pass the result down.
     */
    currentHref?: string
    /**
     * Stick to the top of the viewport as the page scrolls. Defaults to
     * `false`. When the nav renders below a sticky `Header`, set
     * `--main-nav-top` to the header's height so the two stack instead of
     * overlapping — this custom property replaces the app source's
     * `useSelectorHeight` DOM-measuring hook (the app measured `#nsw-header`
     * on every resize; a consumer that needs a live value can still measure
     * its own header and write the property, see the Sticky story).
     */
    sticky?: boolean
    /** Drop shadow under the bar. Defaults to `true`. */
    shadow?: boolean
    /** Classes applied to the inner width-constraining wrapper. */
    containerClassName?: string
    ref?: React.Ref<HTMLElement>
  }

/**
 * Full-width NSW site navigation bar with mega-menu panels — the data-driven
 * consolidation of the nswds-app `NavigationMenuMainNavigation` /
 * `MainNavigation` components, rebuilt on this package's `NavigationMenu`
 * (Base UI underneath).
 *
 * - `navigation` drives everything: items with `links` render a trigger whose
 *   mega panel shows a featured lead link (the section `href`; with no `href`
 *   the lead demotes to a plain heading row — dev builds warn) above a
 *   responsive 1/2/3-column grid of bordered section links; items without
 *   `links` render plain links styled like the triggers. All anchors render
 *   through `Link`, so a framework link injected via `LinkProvider`
 *   (e.g. next/link) is used automatically.
 * - `color` themes the bar with the Footer's thirteen-name vocabulary and its
 *   exact dark-mode deepening; every derived colour (halos, borders, focus
 *   outlines) resolves from a single `--main-nav-ink` per variant. Contrast
 *   conclusions are the Footer's, verbatim (see `mainNavColors`).
 * - Panels span the nav container's full width: a ResizeObserver on the inner
 *   container feeds each panel's inline width, and an `alignOffset` function
 *   shifts Base UI's trigger-anchored positioner back to the container's left
 *   edge (measured at position time from the open trigger, so it is exact for
 *   every trigger — this replaces the app source's panelMetrics state).
 *   Assumes LTR; see the class comments.
 * - `container`, `border`, `shadow`, `sticky` mirror the house chrome
 *   components; the app's deprecated `showTopBorder`/`showBottomBorder` and
 *   `responsive` props are not ported (use `border` and
 *   `className="hidden lg:block"`).
 *
 * Accessibility: the outer `<nav>` is the landmark (default label "Main
 * navigation"; Base UI's own root is demoted to a `<div>` via `render` so the
 * page doesn't gain a nested nav landmark). Everything interactive is
 * inherited from Base UI via the sibling: triggers are real buttons with
 * `aria-expanded`/`aria-controls`, ArrowDown/Enter opens, arrow keys rove,
 * Escape and focus-out close, and the current page announces
 * `aria-current="page"` (WCAG 2.4.8). Focus indicators are 2px ink-derived
 * outlines that contrast on all thirteen surfaces and on the panel surface
 * (2.4.7, 2.4.13). The 220ms `closeDelay` reproduces the app's hover-out
 * grace timer through Base UI instead of a hand-rolled setTimeout.
 *
 * The default `id="nsw-main-navigation"` is kept for compatibility with
 * existing shells that target it (override via the `id` prop).
 */
function MainNav({
  className,
  containerClassName,
  color,
  container,
  border,
  navigation,
  currentHref,
  sticky = false,
  shadow = true,
  'aria-label': ariaLabel = 'Main navigation',
  ref,
  ...props
}: MainNavProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [panelWidth, setPanelWidth] = React.useState<number | null>(null)

  React.useEffect(() => {
    const element = containerRef.current
    if (!element) {
      return
    }
    const measure = () => {
      setPanelWidth(element.getBoundingClientRect().width)
    }
    // Read once on mount: panels can open before the first resize.
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Shifts the popup from Base UI's anchor (the open trigger) to the
  // container's left edge. Called by the positioner at position time, when
  // the open trigger is findable via data-popup-open — so the offset is exact
  // per trigger with no per-trigger state. Assumes LTR (`align='start'` maps
  // to the left edge); RTL would need the mirrored calculation.
  //
  // The ref caches the last successful offset for the windows when NO trigger
  // carries data-popup-open — chiefly the ~300ms close fade, when a recompute
  // (scroll/resize mid-fade) returning 0 would snap the still-visible
  // full-width panel back to the trigger's edge. Repeating the last real
  // offset holds the fading panel where it was.
  const lastAlignOffsetRef = React.useRef(0)
  const alignOffset = React.useCallback(() => {
    const element = containerRef.current
    if (!element) {
      return lastAlignOffsetRef.current
    }
    const trigger = element.querySelector('[data-popup-open]')
    if (!trigger) {
      return lastAlignOffsetRef.current
    }
    lastAlignOffsetRef.current =
      element.getBoundingClientRect().left - trigger.getBoundingClientRect().left
    return lastAlignOffsetRef.current
  }, [])

  return (
    <nav
      id='nsw-main-navigation'
      data-slot='main-nav'
      data-color={color ?? DEFAULT_MAIN_NAV_COLOR}
      aria-label={ariaLabel}
      {...props}
      className={cn(
        mainNavVariants({ color, border }),
        // z-40 matches Header (both sit below the z-50 SkipLinks). An app
        // stacking this under a sticky Header sets --main-nav-top to the
        // header's height.
        sticky && 'sticky top-[var(--main-nav-top,0px)] z-40',
        // House scrolled-header shadow; in dark mode borders carry separation.
        shadow && 'shadow-md shadow-black/5 dark:shadow-none',
        className,
      )}
      ref={ref}
    >
      <div
        ref={containerRef}
        data-slot='main-nav-container'
        className={cn(mainNavContainerVariants({ container }), containerClassName)}
      >
        {/* render={<div/>}: Base UI's root is itself a <nav>; demoting it
            keeps this component to ONE navigation landmark. sideOffset 0
            seats the panel flush under the bar; collision handling is off
            because alignOffset/width already pin the panel inside the
            viewport. closeDelay 220 = the app's PANEL_CLOSE_DELAY_MS. */}
        <NavigationMenu
          render={<div />}
          className='w-full max-w-none justify-start'
          side='bottom'
          sideOffset={0}
          align='start'
          alignOffset={alignOffset}
          collisionPadding={0}
          collisionAvoidance={{ side: 'none', align: 'none' }}
          closeDelay={220}
          // Square corners (the full-width panel meets the bar edge-to-edge)
          // and no --available-width cap — see mainNavPanelVariants.
          popupClassName='max-w-none rounded-none'
          // The popup itself must follow the measured width too: Base UI
          // sizes it from --popup-width, measured once when a section
          // activates, so a panel opened before the first measurement lands
          // (or resized while open) would keep a stale popup width and clip
          // the full-width panel to a sliver. An inline width stays reactive.
          popupStyle={panelWidth === null ? undefined : { width: panelWidth }}
        >
          <NavigationMenuList className='w-full justify-start gap-0 border-b-0'>
            {navigation.map((item) => (
              <MainNavMenuItem
                key={`${item.title}-${item.href ?? 'section'}`}
                item={item}
                color={color ?? DEFAULT_MAIN_NAV_COLOR}
                currentHref={currentHref}
                panelWidth={panelWidth}
              />
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}

export { MainNav, mainNavColors, mainNavContainerVariants, mainNavPanelVariants, mainNavVariants }
export type { MainNavColor, MainNavItem, MainNavLinkItem, MainNavProps }

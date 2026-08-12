'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils.js'

import { Badge } from '../components/badge.js'
import { Link } from '../components/link.js'
import { Logo } from '../components/logo.js'

/**
 * Surface colours the header can be themed with, sharing the Masthead's and
 * SkipLink's four-name vocabulary (`dark`, `light`, `white`, `grey`) — the three
 * components stack at the top of the page and a service picks one word for the
 * whole chrome.
 *
 * Every pair is WCAG 2.2 AAA (1.4.6, 7:1), computed from the masterbrand oklch
 * tokens. Light mode: grey-800 on white 15.1:1, grey-800 on grey-100 13.8:1,
 * white on primary-800 14.4:1, white on grey-800 15.1:1. Dark mode deepens each
 * surface onto the same family's dark step and clears AAA more comfortably
 * still (17.2:1–20.2:1).
 *
 * Unlike the Masthead — a brand strip whose light/white/grey surfaces are frozen
 * across themes — the header is the page's own surface, so all four follow the
 * theme. Pair `Header color="dark"` with `Masthead color="dark"` when a service
 * wants the two to match in both modes.
 */
const headerColors = {
  // Ink values use the RAW masterbrand tokens (--grey-800) rather than
  // Tailwind's --color-* bridge aliases: Tailwind v4 tree-shakes an
  // unreferenced @theme key, and referencing one from inside an arbitrary
  // property is not a usage signal. Same reasoning as footer.tsx.
  // (--color-white is safe: `text-white` below is a real utility.)
  dark: 'bg-primary-800 text-white [--header-ink:var(--color-white)] dark:bg-primary-950',
  light:
    'bg-grey-100 text-grey-800 [--header-ink:var(--grey-800)] dark:bg-grey-850 dark:text-white dark:[--header-ink:var(--color-white)]',
  white:
    'bg-white text-grey-800 [--header-ink:var(--grey-800)] dark:bg-grey-900 dark:text-white dark:[--header-ink:var(--color-white)]',
  grey: 'bg-grey-800 text-white [--header-ink:var(--color-white)] dark:bg-grey-950',
}

type HeaderColor = keyof typeof headerColors

// Shared by cva's defaultVariants, the data-color attribute and the logo
// context, so the four can't drift apart.
const DEFAULT_HEADER_COLOR: HeaderColor = 'white'

const headerVariants = cva(
  [
    'w-full',
    // The hairline rule derives from the surface's own ink, so it follows every
    // colour variant and both themes from one value. Mirrors the color-mix
    // derivation in footer.tsx (--footer-border) and link.tsx (--link-halo).
    '[--header-border:color-mix(in_oklch,var(--header-ink)_15%,transparent)]',
    'transition-shadow duration-300 motion-reduce:transition-none',
  ],
  {
    variants: {
      color: headerColors,
    },
    defaultVariants: {
      color: DEFAULT_HEADER_COLOR,
    },
  },
)

const headerContainerVariants = cva(
  [
    'mx-auto flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3 sm:py-4 lg:py-5',
    // Lateral padding funnels through --header-padding-x so an app can retune it
    // once (via the `style` prop or a utility class) without a new variant. Same
    // mechanism, and the same 16px → 24px → 48px rhythm, as Masthead and Footer.
    'px-(--header-padding-x)',
    '[--header-padding-x:--spacing(4)] sm:[--header-padding-x:--spacing(6)] lg:[--header-padding-x:--spacing(12)]',
  ],
  {
    variants: {
      container: {
        // Full-bleed (nswds-app parity). --header-max-width is still read so a
        // shell app can constrain the inner wrapper without switching variants.
        fluid: 'max-w-[var(--header-max-width,none)]',
        // Centred content column, legacy nsw-container parity (1200px).
        contained: 'max-w-[var(--header-max-width,75rem)]',
      },
    },
    defaultVariants: {
      container: 'fluid',
    },
  },
)

/**
 * Lets `HeaderBrand` adapt its artwork to the surface it is drawn on — the
 * default `Logo` paints its wordmark `nsw-blue-800` and the version `Badge`
 * paints itself `primary-800`, both of which disappear on the `dark`
 * (primary-800) surface. A `logo` node supplied by the consumer overrides the
 * lockup entirely; at that point the choice is theirs.
 */
const HeaderColorContext = React.createContext<HeaderColor>(DEFAULT_HEADER_COLOR)

/** Surfaces dark enough to need light-on-dark artwork. */
const DARK_SURFACE_COLORS = new Set<HeaderColor>(['dark', 'grey'])

type HeaderBrandProps = React.ComponentPropsWithoutRef<'div'> & {
  /** Home-page target for the brand link. Defaults to `/`. */
  href?: React.ComponentPropsWithoutRef<typeof Link>['href']
  /** Service or site name shown beside the logo. */
  sitename?: React.ReactNode
  /**
   * Heading level for `sitename`. Omit (the default) to render a `<span>`,
   * which is usually right: the page's own `<h1>` belongs to its main content,
   * and a site name repeated in the header on every page is not the heading
   * that describes this page. Supply a level only when a service deliberately
   * places the site name in the document outline.
   *
   * `1` is excluded for the reason above; `6` is the deepest heading HTML
   * defines.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /**
   * Version string shown in a Badge beside the brand. Sits outside the link,
   * so it never becomes part of the home link's accessible name.
   */
  version?: React.ReactNode
  /**
   * Visually-hidden prefix announced before `version`, giving the bare number
   * context for screen readers ("2.1.0" → "Version 2.1.0"). Pass an empty
   * string to suppress.
   */
  versionLabel?: string
  /**
   * `true` (default) renders the NSW Government waratah, `false` omits it, and
   * a node replaces it — pass an agency lockup here.
   */
  logo?: boolean | React.ReactNode
  /**
   * Accessible name for the brand link. Left unset by default: the link's name
   * is then its visible content — "NSW Government" (from `Logo`'s
   * visually-hidden text) plus `sitename` — which keeps the visible label
   * inside the accessible name (WCAG 2.2, 2.5.3 Label in Name). Overriding it
   * with something like "Home page" would break that, so set it only when the
   * brand renders no text at all.
   */
  label?: string
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Dev-only guard, mirroring the icon-only Button check in button.tsx: the
 * default `Logo` carries a visually-hidden "NSW Government", so a brand with
 * neither it nor a `sitename` renders a link with no text at all, and reaches
 * assistive tech unnamed (WCAG 2.2, 4.1.2 Name, Role, Value). A consumer's own
 * logo node is assumed to carry its own text. No-op in production.
 */
function warnIfBrandUnlabelled({
  logo,
  sitename,
  label,
}: Pick<HeaderBrandProps, 'logo' | 'sitename' | 'label'>) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  if (!logo && !sitename && !label) {
    console.warn(
      '[nswds/ui] HeaderBrand has no logo and no sitename, so its home link has no accessible name — pass `label`.',
    )
  }
}

/**
 * Logo, site name and optional version badge, linked to the home page. Sits at
 * the start of the `Header` row.
 *
 * The link renders through `Link`, so it picks up the framework link component
 * from `LinkProvider` (next/link et al) rather than hardcoding one.
 */
function HeaderBrand({
  className,
  href = '/',
  sitename,
  headingLevel,
  version,
  versionLabel = 'Version',
  logo = true,
  label,
  children,
  ref,
  ...props
}: HeaderBrandProps) {
  const color = React.useContext(HeaderColorContext)
  const onDarkSurface = DARK_SURFACE_COLORS.has(color)
  const Sitename = headingLevel ? (`h${headingLevel}` as const) : 'span'

  warnIfBrandUnlabelled({ logo, sitename, label })

  const logoNode =
    logo === true ? (
      <Logo
        logoType={onDarkSurface ? 'reversed' : 'default'}
        // 64px from lg, 56px below it — 56px is the floor, so the lockup stays
        // legible on a phone. Written as mutually exclusive breakpoint ranges
        // rather than `h-14 lg:h-16`: a bare `h-14` a consumer also uses is
        // re-emitted after ours by their own Tailwind build, and a media query
        // adds no specificity, so it would outrank the lg step and freeze the
        // logo at 56px.
        className='w-auto max-lg:h-14 lg:h-16'
      />
    ) : (
      // `false` / `null` fall through as the falsy nodes they are; anything
      // else is the consumer's own lockup.
      logo
    )

  return (
    <div
      data-slot='header-brand'
      {...props}
      className={cn('flex grow basis-0 items-center gap-3 sm:gap-4', className)}
      ref={ref}
    >
      {/* variant='unstyled' — a brand lockup takes no underline or link
          colour. outline-current resolves to the surface's ink on every
          variant, so the focus indicator contrasts with the header
          (WCAG 2.2, 2.4.13 Focus Appearance). The negative margin keeps the
          indicator from nudging the row. */}
      <Link
        variant='unstyled'
        href={href}
        aria-label={label}
        className='-m-1 flex items-center gap-3 rounded-sm p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current sm:gap-4'
      >
        {logoNode}
        {sitename ? (
          // Brand-blue ink on the light surfaces (14.4:1 on white, 13.2:1 on
          // grey-100 — both WCAG 2.2 AAA). The `dark` surface *is* primary-800
          // and `grey` is nearly as deep, so those keep the header's own white
          // ink; dark mode does the same, matching the `dark:text-white` the
          // light/white variants already set on the surface.
          <Sitename
            className={cn(
              'text-lg font-bold text-balance sm:text-xl',
              !onDarkSurface && 'text-primary-800 dark:text-white',
            )}
          >
            {sitename}
          </Sitename>
        ) : null}
      </Link>
      {version ? (
        // Badge's `primary` ink is primary-800 — the `dark` header's own
        // surface — so dark surfaces take the white badge instead.
        <Badge
          data-slot='header-version'
          variant='soft'
          color={onDarkSurface ? 'white' : 'primary'}
        >
          {versionLabel ? <span className='sr-only'>{versionLabel} </span> : null}
          {version}
        </Badge>
      ) : null}
      {children}
    </div>
  )
}

type HeaderActionsProps = React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Trailing cluster of header controls — search, theme switcher, sign-in, and
 * the like. Deliberately unopinionated about what goes in it: site search and
 * theme switching are app concerns (they need routing and a theme provider),
 * so the design system supplies the slot and its spacing rather than the
 * widgets.
 *
 * Not a `nav` landmark: a row of controls is not a set of navigation links, and
 * an extra landmark on every page buries the ones that matter. Wrap genuine
 * navigation in your own `<nav>` inside `Header`.
 */
function HeaderActions({ className, ref, ...props }: HeaderActionsProps) {
  return (
    <div
      data-slot='header-actions'
      {...props}
      className={cn('flex basis-0 items-center justify-end gap-2 sm:gap-4 md:grow', className)}
      ref={ref}
    />
  )
}

type HeaderProps = React.ComponentPropsWithoutRef<'header'> &
  VariantProps<typeof headerVariants> &
  VariantProps<typeof headerContainerVariants> & {
    /** Stick to the top of the viewport as the page scrolls. Defaults to `true`. */
    sticky?: boolean
    /** Hairline rule along the bottom edge. Defaults to `true`. */
    border?: boolean
    /** Raise the header with a shadow once the page is scrolled. Defaults to `true`. */
    shadow?: boolean
    /** Classes applied to the inner width-constraining wrapper. */
    containerClassName?: string
    ref?: React.Ref<HTMLElement>
  }

/**
 * Top-of-page `banner` landmark: brand, site name and header controls. Render
 * it once in a shared layout, below `SkipLinks` and `Masthead`.
 *
 * - `color` themes the surface; all four pairs are WCAG 2.2 AAA and follow the
 *   theme in dark mode (see `headerColors`). The bottom rule derives from the
 *   surface's ink, so it follows automatically.
 * - `container` selects the inner wrapper layout: `fluid` (full-bleed,
 *   nswds-app parity) or `contained` (centred 1200px column, legacy
 *   `nsw-container` parity). Fine-tune either with the `--header-max-width`
 *   and `--header-padding-x` custom properties.
 * - Scroll position is tracked and exposed as `data-scrolled`, which is what
 *   the `shadow` treatment keys off. Style your own scrolled state with it.
 *
 * Compose the row from `HeaderBrand` and `HeaderActions`:
 *
 * ```tsx
 * <Header>
 *   <HeaderBrand sitename="Design System" version="2.1.0" />
 *   <HeaderActions>
 *     <ThemeSwitcher />
 *   </HeaderActions>
 * </Header>
 * ```
 *
 * The `banner` landmark comes from the native `<header>` element, which only
 * carries it outside `article`, `aside`, `main`, `nav` and `section` — wrapping
 * `div`s are fine. Keep it out of `<main>`.
 *
 * The default `id="nsw-header"` is kept for compatibility with existing shells
 * that target it (override via the `id` prop).
 */
function Header({
  className,
  color,
  container,
  containerClassName,
  sticky = true,
  border = true,
  shadow = true,
  children,
  ref,
  ...props
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    // Read once on mount too: a page restored mid-scroll (back/forward, or a
    // deep link to a fragment) never fires a scroll event.
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      id='nsw-header'
      data-slot='header'
      data-color={color ?? DEFAULT_HEADER_COLOR}
      // Present-or-absent rather than "true"/"false", so it reads like Base
      // UI's data-disabled and Tailwind's bare `data-scrolled:` variant works.
      data-scrolled={isScrolled || undefined}
      {...props}
      className={cn(
        headerVariants({ color }),
        // z-40 sits below the z-50 SkipLinks: a sticky header at the same
        // level comes later in the DOM and would paint over a focused skip
        // link, hiding the page's bypass mechanism (WCAG 2.2, 2.4.1).
        sticky && 'sticky top-0 z-40',
        // Always drawn, so the scrolled state changes no box heights.
        border && 'border-b border-(--header-border)',
        // Shadows read as elevation on light surfaces only; in dark mode the
        // rule above carries the separation.
        shadow &&
          'data-scrolled:shadow-md data-scrolled:shadow-black/5 dark:data-scrolled:shadow-none',
        className,
      )}
      ref={ref}
    >
      <HeaderColorContext.Provider value={color ?? DEFAULT_HEADER_COLOR}>
        <div
          data-slot='header-container'
          className={cn(headerContainerVariants({ container }), containerClassName)}
        >
          {children}
        </div>
      </HeaderColorContext.Provider>
    </header>
  )
}

export { Header, HeaderActions, HeaderBrand, headerColors, headerContainerVariants, headerVariants }
export type { HeaderActionsProps, HeaderBrandProps, HeaderColor, HeaderProps }

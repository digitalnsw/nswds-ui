'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils.js'

// Same curated WCAG 2.2 AAA (7:1) pairs as the Masthead — the two components
// are designed to be themed together, mirroring how the legacy
// `masthead-theme` option drove both `.nsw-masthead--light` and
// `.nsw-skip--light`. Kept as a local map (not imported from masthead.tsx) so
// each file stays standalone for registry distribution.
const skipLinkColors = {
  dark: 'bg-primary-800 text-white dark:bg-primary-950',
  light: 'bg-grey-100 text-grey-900',
  white: 'bg-white text-grey-900',
  grey: 'bg-grey-800 text-white',
}

const skipLinkVariants = cva(
  [
    // Parked above the viewport until focused (legacy translateY(-101%)
    // pattern) — still in the tab order, so it is the first thing keyboard
    // and screen-reader users reach.
    'absolute inset-x-0 top-0 w-full -translate-y-[101%]',
    'motion-safe:transition-transform',
    'focus:translate-y-0',
    // min-h-11 keeps the revealed bar at ≥44px — 2.5.5 Target Size (AAA).
    'group flex min-h-11 items-center px-4 py-2 text-xs font-medium no-underline',
    // The visible focus indicator is the ring around the label span
    // (2.4.13 Focus Appearance): outline-current guarantees it contrasts with
    // the bar on every colour variant. outline-hidden (not outline-none) on
    // the anchor keeps a forced-colors fallback outline.
    'focus:outline-hidden',
  ],
  {
    variants: {
      color: skipLinkColors,
    },
    defaultVariants: {
      color: 'dark',
    },
  },
)

/**
 * Move focus to the skip target. Fragment navigation alone only moves the
 * sequential-focus starting point; explicitly focusing the target makes
 * screen readers announce it. Non-focusable targets get a temporary
 * `tabindex="-1"` (removed on blur), matching the legacy skip-to behaviour.
 */
function focusSkipTarget(event: React.MouseEvent<HTMLAnchorElement>) {
  const hash = event.currentTarget.hash
  if (!hash || hash === '#') {
    return
  }

  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    // Malformed escape sequence — fall back to the raw fragment.
  }

  const target = document.getElementById(id)
  if (!target) {
    return
  }

  if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1')
    target.addEventListener(
      'blur',
      () => {
        target.removeAttribute('tabindex')
      },
      { once: true },
    )
  }

  target.focus()
}

type SkipLinkProps = React.ComponentPropsWithoutRef<'a'> &
  VariantProps<typeof skipLinkVariants> & {
    /** Same-page fragment target, e.g. `"#content"`. */
    href: string
    ref?: React.Ref<HTMLAnchorElement>
  }

/**
 * A single focus-revealed bypass link (2.4.1 Bypass Blocks). Hidden above the
 * viewport until it receives keyboard focus, then slides in as a full-width
 * bar. Designed to sit inside `SkipLinks`, which provides the positioned
 * `<nav>` landmark; standalone use needs a positioned ancestor.
 *
 * Renders a plain `<a>` (not the themeable `Link`) because skip links are
 * same-page fragment jumps — routing framework link components are
 * unnecessary and can interfere with fragment navigation.
 */
function SkipLink({ className, color, href, onClick, children, ref, ...props }: SkipLinkProps) {
  return (
    <a
      data-slot='skip-link'
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          focusSkipTarget(event)
        }
      }}
      className={cn(skipLinkVariants({ color }), className)}
      ref={ref}
    >
      <span className='group-focus:outline group-focus:outline-2 group-focus:outline-offset-2 group-focus:outline-current'>
        {children}
      </span>
    </a>
  )
}

type SkipLinksProps = React.ComponentPropsWithoutRef<'nav'> &
  VariantProps<typeof skipLinkVariants> & {
    ref?: React.Ref<HTMLElement>
  }

/**
 * Fixed landmark that holds the page's skip links, rendered as the first
 * element in the body (before the `Masthead`). Successor to the legacy
 * `.nsw-skip` nav.
 *
 * When the `children` prop is omitted it renders the legacy default pair —
 * "Skip to navigation" (`#nav`) and "Skip to content" (`#content`) — themed
 * by `color`. Any provided children (including an explicitly empty list from
 * a `.map()` or a false conditional) render exactly as given, per normal
 * React semantics — the defaults are never injected alongside or instead of
 * explicit content, since their `#nav`/`#content` targets may not exist on a
 * page that opted into custom links. Compose your own `SkipLink` children
 * for different targets or extra links:
 *
 * ```tsx
 * <SkipLinks>
 *   <SkipLink href="#main-navigation">Skip to navigation</SkipLink>
 *   <SkipLink href="#main-content">Skip to content</SkipLink>
 *   <SkipLink href="#search">Skip to search</SkipLink>
 * </SkipLinks>
 * ```
 */
function SkipLinks({
  className,
  color,
  // Destructuring default: applies only when the prop is `undefined`
  // (omitted), never for explicit null/false/[] children. `color` is
  // initialised earlier in the pattern, so it is in scope here.
  children = (
    <>
      <SkipLink color={color} href='#nav'>
        Skip to navigation
      </SkipLink>
      <SkipLink color={color} href='#content'>
        Skip to content
      </SkipLink>
    </>
  ),
  ref,
  ...props
}: SkipLinksProps) {
  return (
    <nav
      aria-label='Skip links'
      data-slot='skip-links'
      {...props}
      className={cn('fixed inset-x-0 top-0 z-50 w-full', className)}
      ref={ref}
    >
      {children}
    </nav>
  )
}

export { SkipLink, SkipLinks, skipLinkVariants }
export type { SkipLinkProps, SkipLinksProps }

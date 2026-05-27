'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React, { createContext, forwardRef, useContext } from 'react'

import { cn } from '../lib/utils.js'

const linkVariants = cva(
  [
    // Base
    'font-medium underline decoration-current underline-offset-4 transition-colors',
    // Text colour derives from --link-color; --link-halo and --link-halo-active
    // derive from --link-color via color-mix so each variant only sets the one
    // token and the hover/active halos follow automatically.
    'text-(--link-color)',
    '[--link-halo:color-mix(in_oklch,var(--link-color)_10%,transparent)]',
    '[--link-halo-active:color-mix(in_oklch,var(--link-color)_18%,transparent)]',
    // Hover / active halos use box-shadow + background-color rather than
    // padding, so inline links sit flush against surrounding text. The
    // shadows extend the halo 2px above and 4px below the line box, matching
    // the GOV.UK Design System focus pattern.
    'hover:bg-(--link-halo) hover:decoration-2',
    'hover:shadow-[0_-2px_0_var(--link-halo),0_4px_0_var(--link-halo)]',
    // Wrapped lines each get their own halo
    '[box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--link-color)',
    // Default sizing for icon children — without this, an unsized SVG inside
    // a Link collapses to 0×0 in flex layouts. `vertical-align: -0.15em`
    // aligns the icon's box to the text's x-height for inline-flow usage;
    // flex contexts ignore vertical-align and should set `items-baseline` (or
    // similar) on the Link itself. Consumers can override per-icon by passing
    // a `size-*` or `align-*` class on the icon itself.
    '*:data-[slot=icon]:inline-block *:data-[slot=icon]:size-[1em] *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:align-[-0.15em]',
  ],
  {
    variants: {
      variant: {
        primary: [
          // Link
          '[--link-color:var(--color-primary-800)] dark:[--link-color:var(--color-primary-200)]',
          // Visited — shift the link colour, hover/focus follow automatically
          'visited:[--link-color:var(--color-primary-600)] dark:visited:[--link-color:var(--color-primary-300)]',
          // Active — deeper halo via --link-halo-active
          'active:bg-(--link-halo-active) active:decoration-2',
          'active:shadow-[0_-2px_0_var(--link-halo-active),0_4px_0_var(--link-halo-active)]',
        ],
        secondary: [
          '[--link-color:var(--color-primary-200)] dark:[--link-color:var(--color-primary-800)]',
        ],
        white: [
          '[--link-color:var(--color-white)] dark:[--link-color:var(--color-grey-800)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

type LinkComponent = React.ElementType

type LinkProps = Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> &
  VariantProps<typeof linkVariants> & {
    as?: LinkComponent
    href: React.ComponentPropsWithoutRef<'a'>['href'] | object
  }

const LinkComponentContext = createContext<LinkComponent | null>(null)

function LinkProvider({
  children,
  component,
}: {
  children: React.ReactNode
  component: LinkComponent
}) {
  return (
    <LinkComponentContext.Provider value={component}>
      {children}
    </LinkComponentContext.Provider>
  )
}

/**
 * Polymorphic anchor wrapper. Renders an `<a>` by default, or any element
 * provided via the `as` prop, or via a `<LinkProvider component={…}>` context
 * (use the context to inject a framework Link like Next.js `next/link`).
 *
 * Hover / active / focus styling on consumers should use the native CSS
 * pseudo-class utilities (`hover:`, `active:`, `focus-visible:`, and their
 * `group-…` variants) — Tailwind v4 maps them to real CSS, no JS state
 * tracking required.
 */
const Link = forwardRef(function Link(
  { as, variant, className, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const ContextLink = useContext(LinkComponentContext)
  const component = as ?? ContextLink ?? 'a'

  return React.createElement(component, {
    ...props,
    className: cn(linkVariants({ variant }), className),
    ref,
  })
})

/**
 * Open-in-new-tab glyph used by `ExternalLink`. Defined inline (rather than
 * imported from `Icons`) so that consumers of `Link` / `ExternalLink` don't
 * tree-pull the full icon set. Sized and aligned through the `[data-slot=icon]`
 * rules in `linkVariants`.
 */
function OpenInNewIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-slot="icon"
      fill="currentColor"
      viewBox="0 -960 960 960"
      aria-hidden="true"
      {...props}
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z" />
    </svg>
  )
}

type ExternalLinkProps = LinkProps & {
  /**
   * Screen-reader suffix announced after the link text. Defaults to
   * `"(opens in a new tab)"`. Pass an empty string to suppress.
   */
  newTabLabel?: string
  /**
   * Custom trailing icon. Pass `null` to hide the icon entirely. If omitted,
   * the default open-in-new glyph is rendered.
   */
  icon?: React.ReactNode | null
}

/**
 * Anchor preconfigured for cross-origin / new-tab navigation. Sets
 * `target="_blank"` and `rel="noopener noreferrer"` by default, renders a
 * trailing open-in-new icon, and appends a visually-hidden suffix so screen
 * readers announce that the link opens a new tab.
 *
 * All `Link` props are forwarded — `variant`, `as`, `className`, etc. —
 * and any of `target`, `rel`, `icon`, or `newTabLabel` can be overridden.
 */
const ExternalLink = forwardRef(function ExternalLink(
  {
    children,
    icon,
    newTabLabel = '(opens in a new tab)',
    target = '_blank',
    rel = 'noopener noreferrer',
    ...props
  }: ExternalLinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const trailingIcon =
    icon === null ? null : (icon ?? <OpenInNewIcon className="ml-0.5" />)

  return (
    <Link {...props} target={target} rel={rel} ref={ref}>
      {children}
      {trailingIcon}
      {newTabLabel ? (
        <span className="sr-only"> {newTabLabel}</span>
      ) : null}
    </Link>
  )
})

export { ExternalLink, Link, LinkProvider, linkVariants }
export type { ExternalLinkProps, LinkComponent, LinkProps }

'use client'

import React, { createContext, forwardRef, useContext } from 'react'

type LinkComponent = React.ElementType

type LinkProps = Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> & {
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
  { as, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const ContextLink = useContext(LinkComponentContext)
  const component = as ?? ContextLink ?? 'a'

  return React.createElement(component, { ...props, ref })
})

export { Link, LinkProvider }
export type { LinkComponent, LinkProps }

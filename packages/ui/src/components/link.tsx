'use client'

import * as Headless from '@headlessui/react'
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

const Link = forwardRef(function Link(
  { as, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const ContextLink = useContext(LinkComponentContext)
  const Component = as ?? ContextLink ?? 'a'

  return (
    <Headless.DataInteractive>
      <Component {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})

export { Link, LinkProvider }
export type { LinkComponent, LinkProps }

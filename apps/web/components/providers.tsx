'use client'

import { LinkProvider } from '@nswds/ui'
import NextLink from 'next/link'
import * as React from 'react'

/**
 * Injects next/link into every design-system Link (and everything that renders
 * through it — ButtonLink, BadgeLink, MainNav, SideNav, Footer links), so all
 * in-app navigation is client-side routed.
 */
function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  return <LinkProvider component={NextLink}>{children}</LinkProvider>
}

export { DesignSystemProvider }

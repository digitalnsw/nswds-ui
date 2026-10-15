'use client'

import { LinkProvider } from '@nswds/ui'
import NextLink from 'next/link'
import type * as React from 'react'

/** Routes every @nswds/ui link through next/link for client-side navigation. */
function AppLinkProvider({ children }: { children: React.ReactNode }) {
  return <LinkProvider component={NextLink}>{children}</LinkProvider>
}

export { AppLinkProvider }

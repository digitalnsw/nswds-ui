'use client'

import { Footer } from '@nswds/ui'
import { useSyncExternalStore } from 'react'

const legalLinks = [
  { name: 'Accessibility', href: 'https://www.nsw.gov.au/accessibility' },
  { name: 'Privacy', href: 'https://www.nsw.gov.au/privacy' },
  { name: 'Copyright', href: 'https://www.nsw.gov.au/copyright' },
]

const subscribe = () => () => {}

/**
 * The footer, with a copyright year that stays current on prerendered pages.
 * `Footer` reads the year at render, which for a static page is the build, so
 * the server passes the year it rendered with: hydration uses that (no
 * mismatch with the prerendered HTML) and React then re-renders with the
 * browser's year if it differs.
 */
function SiteFooter({ renderedYear }: { renderedYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => renderedYear,
  )

  return (
    <Footer
      department='Digital NSW, Department of Customer Service'
      legalLinks={legalLinks}
      year={year}
    />
  )
}

export { SiteFooter }

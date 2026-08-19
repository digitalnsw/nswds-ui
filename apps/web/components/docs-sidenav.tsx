'use client'

import { ScrollArea, SideNav } from '@nswds/ui'
import { usePathname } from 'next/navigation'

import { sideNavSections } from '@/lib/site-nav'

/**
 * Left rail for the docs pages. Keyed by pathname so the branch holding the
 * current page re-expands on navigation (SideNav seeds expansion at mount).
 */
function DocsSideNav() {
  const pathname = usePathname()

  return (
    <ScrollArea className='h-full'>
      <SideNav
        key={pathname}
        sections={sideNavSections}
        currentHref={pathname}
        className='py-8 pr-4'
      />
    </ScrollArea>
  )
}

export { DocsSideNav }

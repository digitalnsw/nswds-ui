'use client'

import { SiteSearch } from '@nswds/ui'
import { useRouter } from 'next/navigation'

import { searchGroups } from '@/lib/site-nav'

/** Cmd/Ctrl-K palette over the docs site map; navigation via the app router. */
function DocsSearch() {
  const router = useRouter()

  return (
    <SiteSearch
      groups={searchGroups}
      shortcut
      placeholder='Search components, patterns, tokens…'
      onSelect={(item) => router.push(item.href)}
    />
  )
}

export { DocsSearch }

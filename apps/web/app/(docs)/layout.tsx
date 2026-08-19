import type * as React from 'react'

import { DocsSideNav } from '@/components/docs-sidenav'

/** Docs shell: left rail beside the page content, rail hidden below lg. */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-12'>
      <aside className='sticky top-24 hidden h-[calc(100dvh-6rem)] w-64 shrink-0 border-r border-border lg:block'>
        <DocsSideNav />
      </aside>
      <div className='min-w-0 flex-1 pb-24 lg:pl-12'>{children}</div>
    </div>
  )
}

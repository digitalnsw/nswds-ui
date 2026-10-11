import type { Metadata } from 'next'

import { site } from '@/lib/site'
import { homeURL } from '@/lib/site_name'

// The og block is restated whole because Next replaces a parent's rather than merging it.
export const metadata: Metadata = {
  alternates: { canonical: homeURL },
  openGraph: { ...site.metadata.openGraph, url: homeURL },
}

export default function Page() {
  return null
}

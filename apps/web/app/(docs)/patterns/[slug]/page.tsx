import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ItemDoc } from '@/components/item-doc'
import { PatternDemo } from '@/components/pattern-demos'
import { getPattern, patternItems } from '@/lib/registry'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return patternItems.map((item) => ({ slug: item.name }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const item = getPattern(slug)
  if (!item) {
    return {}
  }
  return { title: item.title, description: item.description }
}

export default async function PatternPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const item = getPattern(slug)
  if (!item) {
    notFound()
  }

  return <ItemDoc item={item} eyebrow='Patterns' demo={<PatternDemo slug={item.name} />} />
}

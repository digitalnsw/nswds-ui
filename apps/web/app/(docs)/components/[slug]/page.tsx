import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ComponentDemo } from '@/components/demos'
import { ItemDoc } from '@/components/item-doc'
import { componentCategories, componentItems, getComponent } from '@/lib/registry'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return componentItems.map((item) => ({ slug: item.name }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const item = getComponent(slug)
  if (!item) {
    return {}
  }
  return { title: item.title, description: item.description }
}

export default async function ComponentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const item = getComponent(slug)
  if (!item) {
    notFound()
  }

  const category = componentCategories.find(({ slugs }) => slugs.includes(item.name))

  return (
    <ItemDoc
      item={item}
      eyebrow={category ? `Components · ${category.title}` : 'Components'}
      demo={<ComponentDemo slug={item.name} />}
    />
  )
}

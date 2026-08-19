import { Badge, Card, CardDescription, CardHeader, CardTitle, Link } from '@nswds/ui'
import type { Metadata } from 'next'

import { categorisedComponents, componentItems } from '@/lib/registry'

export const metadata: Metadata = {
  title: 'Components',
  description:
    'Every component in the NSW Digital UI design system, with live previews, install commands and dependency information.',
}

export default function ComponentsIndexPage() {
  return (
    <div className='py-10'>
      <p className='text-sm font-bold tracking-wide text-accent-600 uppercase dark:text-accent-200'>
        Catalogue
      </p>
      <h1 className='mt-2 text-4xl font-bold sm:text-5xl'>Components</h1>
      <p className='mt-4 max-w-2xl text-base/7 text-muted-foreground'>
        {componentItems.length} installable components and foundations. Each one is available from
        the <code className='font-mono text-sm'>@nswds/ui</code> npm package and as copyable source
        from the shadcn registry.
      </p>

      {categorisedComponents().map((category) => (
        <section key={category.title} className='mt-12'>
          <h2 className='flex items-center gap-3 text-2xl font-bold'>
            {category.title}
            <Badge variant='soft' color='primary' size='sm'>
              {category.items.length}
            </Badge>
          </h2>
          <div className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {category.items.map((item) => (
              <Card
                key={item.name}
                size='sm'
                className='relative isolate transition-shadow hover:shadow-md'
              >
                <CardHeader>
                  <CardTitle className='text-lg'>
                    {/* Stretched link — the whole card is the target. */}
                    <Link
                      variant='unstyled'
                      href={`/components/${item.name}`}
                      className='font-heading after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current'
                    >
                      {item.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className='line-clamp-3 text-sm'>
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

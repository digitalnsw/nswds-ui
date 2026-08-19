import { Card, CardDescription, CardHeader, CardTitle, Link } from '@nswds/ui'
import type { Metadata } from 'next'

import { patternItems } from '@/lib/registry'

export const metadata: Metadata = {
  title: 'Patterns',
  description:
    'Copy-and-adapt worked examples composed from NSW Digital UI components — forms, footers and mobile navigation.',
}

export default function PatternsIndexPage() {
  return (
    <div className='py-10'>
      <p className='text-sm font-bold tracking-wide text-accent-600 uppercase dark:text-accent-200'>
        Catalogue
      </p>
      <h1 className='mt-2 text-4xl font-bold sm:text-5xl'>Patterns</h1>
      <p className='mt-4 max-w-2xl text-base/7 text-muted-foreground'>
        {patternItems.length} worked examples composed entirely from published components. The
        shadcn CLI copies each one into your repo as a starting point — they are deliberately not
        part of the npm package.
      </p>

      <div className='mt-10 grid gap-4 sm:grid-cols-2'>
        {patternItems.map((item) => (
          <Card
            key={item.name}
            size='sm'
            className='relative isolate transition-shadow hover:shadow-md'
          >
            <CardHeader>
              <CardTitle className='text-lg'>
                <Link
                  variant='unstyled'
                  href={`/patterns/${item.name}`}
                  className='font-heading after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current'
                >
                  {item.title}
                </Link>
              </CardTitle>
              <CardDescription className='line-clamp-3 text-sm'>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nswds/ui'
import { IconArrowForward } from '@nswds/ui/icons/arrow-forward'
import { IconEast } from '@nswds/ui/icons/east'
import type { Metadata } from 'next'

import { CodeBlock } from '@/components/code-block'
import {
  categorisedComponents,
  componentItems,
  installCommand,
  patternItems,
  registryLocation,
  uiVersion,
} from '@/lib/registry'

export const metadata: Metadata = {
  description:
    'NSW Digital UI — accessible, token-driven React components for NSW Government digital services. Install from npm or copy source from the shadcn registry.',
}

const stats = [
  { value: String(componentItems.length), label: 'components & foundations' },
  { value: String(patternItems.length), label: 'copy-and-adapt patterns' },
  { value: '3,900+', label: 'Material Symbols icons' },
  { value: 'WCAG 2.2', label: 'AA colour pairs, AAA chrome' },
]

const principles = [
  {
    title: 'Headless-first',
    description:
      'Every interactive component wraps a Base UI primitive. Focus management, keyboard navigation and ARIA come from the primitive — never hand-rolled.',
  },
  {
    title: 'Token-driven',
    description:
      'Components reference semantic design tokens only, layered over the @nswds/tokens masterbrand palette. Retheme a service by swapping one class.',
  },
  {
    title: 'Dark mode built in',
    description:
      'Every surface names its light-mode tone and deepens onto the same family in dark mode, holding WCAG 2.2 contrast in both themes.',
  },
]

export default function Page() {
  const buttonInstall = installCommand(componentItems.find((item) => item.name === 'button')!)
  const categories = categorisedComponents()

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className='relative overflow-hidden bg-primary-800 text-white dark:bg-primary-950'>
        {/* Oversized waratah-adjacent geometry: two soft discs off-canvas. */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full bg-white/5'
        />
        <div
          aria-hidden='true'
          className='pointer-events-none absolute right-40 -bottom-56 size-96 rounded-full bg-accent-600/20 max-lg:hidden'
        />
        <div className='relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-12'>
          <Badge variant='outline' color='white' className='mb-6'>
            @nswds/ui v{uiVersion}
          </Badge>
          <h1 className='max-w-3xl text-5xl font-bold text-balance sm:text-6xl'>
            Build NSW Government services, faster.
          </h1>
          <p className='mt-6 max-w-2xl text-lg/8 text-primary-100 sm:text-xl/8'>
            NSW Digital UI is the design system for NSW Government digital products — accessible,
            token-driven React components you can install from npm or copy straight into your
            codebase from the shadcn registry.
          </p>
          <div className='mt-10 flex flex-wrap items-center gap-4'>
            <ButtonLink
              href='/components'
              variant='solid'
              color='white'
              trailingVisual={<IconEast aria-hidden='true' />}
            >
              Browse components
            </ButtonLink>
            <ButtonLink href='/patterns' variant='outline' color='white'>
              Explore patterns
            </ButtonLink>
          </div>
        </div>
        {/* Brand keyline in the waratah accent. */}
        <div aria-hidden='true' className='h-1.5 w-full bg-accent-600' />
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section aria-label='At a glance' className='border-b border-border bg-muted'>
        <dl className='mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-12'>
          {stats.map((stat) => (
            <div key={stat.label} className='flex flex-col-reverse gap-1'>
              <dt className='text-sm text-muted-foreground'>{stat.label}</dt>
              <dd className='text-3xl font-bold text-primary-800 dark:text-primary-200'>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Two channels ─────────────────────────────────────────────────── */}
      <section className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-12'>
        <h2 className='text-3xl font-bold sm:text-4xl'>Two ways to consume it</h2>
        <p className='mt-3 max-w-2xl text-base/7 text-muted-foreground'>
          Take the compiled package when you want managed upgrades, or copy the source into your
          repo when you want full control. Both channels ship the same components.
        </p>
        <div className='mt-10 grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>npm package</CardTitle>
              <CardDescription>
                Compiled ESM with types and a prebuilt stylesheet. Upgrade with your package
                manager.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <CodeBlock code='npm install @nswds/ui' />
              <CodeBlock
                label='app.tsx'
                code={`import { Button } from '@nswds/ui'\nimport '@nswds/ui/styles.css'`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>shadcn registry</CardTitle>
              <CardDescription>
                Copies the component source — and everything it depends on — into your own codebase.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <CodeBlock code={buttonInstall} />
              <p className='text-sm text-muted-foreground'>
                Every component page shows its own install command. The registry lives at{' '}
                <code className='rounded-sm bg-muted px-1 py-0.5 font-mono text-xs'>
                  {registryLocation}
                </code>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────────────────── */}
      <section className='border-y border-border bg-muted'>
        <div className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-12'>
          <h2 className='text-3xl font-bold sm:text-4xl'>Opinionated where it counts</h2>
          <div className='mt-10 grid gap-8 md:grid-cols-3'>
            {principles.map((principle) => (
              <div key={principle.title} className='flex flex-col gap-3'>
                <span aria-hidden='true' className='h-1 w-10 bg-accent-600' />
                <h3 className='text-xl font-bold'>{principle.title}</h3>
                <p className='text-base/7 text-muted-foreground'>{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalogue teaser ─────────────────────────────────────────────── */}
      <section className='mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-12'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-bold sm:text-4xl'>The catalogue</h2>
            <p className='mt-3 max-w-2xl text-base/7 text-muted-foreground'>
              From the masthead down to the footer — every layer of an NSW Government page,
              documented with live previews.
            </p>
          </div>
          <ButtonLink
            href='/components'
            variant='link'
            trailingVisual={<IconArrowForward aria-hidden='true' />}
          >
            All components
          </ButtonLink>
        </div>
        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map((category) => (
            <Card key={category.title} size='sm'>
              <CardHeader>
                <CardTitle className='text-xl'>{category.title}</CardTitle>
                <CardDescription>
                  {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='flex flex-wrap gap-2'>
                  {category.items.slice(0, 6).map((item) => (
                    <li key={item.name}>
                      <Badge variant='soft' color='primary' size='sm'>
                        {item.title}
                      </Badge>
                    </li>
                  ))}
                  {category.items.length > 6 ? (
                    <li>
                      <Badge variant='outline' color='grey' size='sm'>
                        +{category.items.length - 6} more
                      </Badge>
                    </li>
                  ) : null}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}

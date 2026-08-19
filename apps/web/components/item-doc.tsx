import { Badge, BadgeLink, Separator } from '@nswds/ui'
import type * as React from 'react'

import { CodeBlock } from '@/components/code-block'
import { DemoPanel } from '@/components/demo-panel'
import { bleedDemos } from '@/lib/demo-meta'
import { importSnippet } from '@/lib/import-snippets'
import { installCommand, registryDependencyNames, type RegistryItem } from '@/lib/registry'

const typeLabels: Record<string, string> = {
  'registry:ui': 'Component',
  'registry:theme': 'Theme',
  'registry:block': 'Pattern',
}

type ItemDocProps = {
  item: RegistryItem
  eyebrow: string
  demo: React.ReactNode
  /** Base path the item's registry dependencies link to. */
  dependencyBasePath?: string
}

/** Shared documentation template for components and patterns. */
function ItemDoc({ item, eyebrow, demo, dependencyBasePath = '/components' }: ItemDocProps) {
  const snippet = item.type === 'registry:block' ? null : importSnippet(item.name)
  const registryDeps = registryDependencyNames(item)

  return (
    <article className='py-10'>
      <p className='text-sm font-bold tracking-wide text-accent-600 uppercase dark:text-accent-200'>
        {eyebrow}
      </p>
      <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2'>
        <h1 className='text-4xl font-bold sm:text-5xl'>{item.title}</h1>
        <Badge variant='outline' color='grey'>
          {typeLabels[item.type] ?? item.type}
        </Badge>
      </div>
      <p className='mt-4 max-w-2xl text-lg/8 text-muted-foreground'>{item.description}</p>

      {demo !== null && demo !== undefined ? (
        <section aria-label='Live preview' className='mt-10'>
          <DemoPanel bleed={bleedDemos.has(item.name)}>{demo}</DemoPanel>
        </section>
      ) : null}

      <section className='mt-12'>
        <h2 className='text-2xl font-bold'>Installation</h2>
        <div className='mt-6 flex flex-col gap-6'>
          <div>
            <h3 className='text-base font-bold'>
              {item.type === 'registry:block'
                ? 'Copy the source with the shadcn CLI'
                : 'From the registry'}
            </h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              Copies the source
              {registryDeps.length > 0 ? ' and everything it depends on' : ''} into your codebase.
            </p>
            <CodeBlock className='mt-3' code={installCommand(item)} />
          </div>
          {snippet ? (
            <div>
              <h3 className='text-base font-bold'>From the npm package</h3>
              <CodeBlock
                className='mt-3'
                label={item.name === 'theme' ? 'app.css' : 'app.tsx'}
                code={snippet}
              />
            </div>
          ) : null}
          {item.type === 'registry:block' ? (
            <p className='text-sm text-muted-foreground'>
              Patterns are worked examples, not published components — the CLI copies the source
              into your repo for you to adapt. They are deliberately not exported from the npm
              package.
            </p>
          ) : null}
        </div>
      </section>

      {item.dependencies?.length || registryDeps.length ? (
        <section className='mt-12'>
          <h2 className='text-2xl font-bold'>Dependencies</h2>
          {registryDeps.length > 0 ? (
            <div className='mt-4'>
              <h3 className='text-sm font-bold text-muted-foreground'>Registry items</h3>
              <ul className='mt-2 flex flex-wrap gap-2'>
                {registryDeps.map((name) => (
                  <li key={name}>
                    <BadgeLink
                      href={`${dependencyBasePath}/${name}`}
                      variant='soft'
                      color='primary'
                    >
                      {name}
                    </BadgeLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {item.dependencies?.length ? (
            <div className='mt-4'>
              <h3 className='text-sm font-bold text-muted-foreground'>npm packages</h3>
              <ul className='mt-2 flex flex-wrap gap-2'>
                {item.dependencies.map((dep) => (
                  <li key={dep}>
                    <Badge variant='outline' color='grey'>
                      {dep}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {item.files?.length ? (
        <section className='mt-12'>
          <h2 className='text-2xl font-bold'>Files delivered</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            What <code className='font-mono'>shadcn add</code> writes into your project.
          </p>
          <div className='mt-4 overflow-x-auto rounded-md ring-1 ring-border'>
            <table className='w-full min-w-96 text-left text-sm'>
              <thead>
                <tr className='border-b border-border bg-muted text-muted-foreground'>
                  <th scope='col' className='px-4 py-2.5 font-semibold'>
                    Target
                  </th>
                  <th scope='col' className='px-4 py-2.5 font-semibold'>
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.files.map((file) => (
                  <tr key={file.path} className='border-b border-border last:border-b-0'>
                    <td className='px-4 py-2.5 font-mono text-xs'>{file.target ?? file.path}</td>
                    <td className='px-4 py-2.5 text-muted-foreground'>
                      {file.type.replace('registry:', '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {item.docs ? (
        <section className='mt-12'>
          <h2 className='text-2xl font-bold'>Notes</h2>
          <Separator className='my-4' />
          <pre className='font-sans text-sm/6 whitespace-pre-wrap text-muted-foreground'>
            {item.docs}
          </pre>
        </section>
      ) : null}
    </article>
  )
}

export { ItemDoc }

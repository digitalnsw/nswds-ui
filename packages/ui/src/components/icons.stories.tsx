/**
 * Icons — Gallery
 *
 * A searchable gallery of every icon exported from `./icons.js`. Unlike other
 * components, the icon set has no variants or behaviour to document — the
 * gallery itself is the documentation, so this file ships a single story with
 * client-side filtering instead of the usual Default / Features / Accessibility
 * sub-folders.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { useMemo, useState } from 'react'

import * as AllIcons from '../icons/index.js'
import { Input } from './input.js'

// The icons index re-exports one named component per icon (plus the IconProps
// type, which is erased at runtime), so the runtime namespace is exactly the
// icon set.
const iconEntries = Object.entries(AllIcons) as Array<
  [string, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element]
>

const meta = {
  title: 'Components/Icons',
  parameters: {
    layout: 'fullscreen',
    docs: { disable: true },
    // Skip the axe a11y scan for the icon gallery. It renders the full
    // ~3,500-icon set in a single grid for developer browsing, and running
    // axe across that DOM tree blows the 15s Vitest timeout on CI runners.
    // a11y for individual icons is the responsibility of the components
    // that *use* them — not this dev-only catalogue.
    a11y: { test: 'off' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function normalise(value: string) {
  // IconArrowForward -> "arrow forward"
  return value
    .replace(/^Icon/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
}

function IconGallery() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return iconEntries
    return iconEntries.filter(([name]) => normalise(name).includes(term))
  }, [query])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-normal">Icons</h1>
          <p className="text-base text-muted-foreground">
            The full NSWDS icon set. Import an icon by name, e.g.{' '}
            <code className="rounded-sm bg-muted px-1.5 py-0.5 text-sm text-foreground">
              {"import { IconSearch } from '@nswds/ui/icons'"}
            </code>{' '}
            — every entry inherits <code>currentColor</code>, so colour and size
            come from the surrounding utility classes.
          </p>
        </header>

        <div className="sticky top-0 z-10 -mx-6 border-b border-border bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="icon-search"
              className="text-sm font-medium text-foreground"
            >
              Search icons
            </label>
            <Input
              id="icon-search"
              type="search"
              placeholder="Search by name (e.g. arrow, search, menu)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {filtered.length.toLocaleString()} of{' '}
              {iconEntries.length.toLocaleString()} icons
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border p-12 text-center">
            <p className="text-base text-muted-foreground">
              No icons match <span className="font-medium">{query}</span>.
            </p>
          </div>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
          >
            {filtered.map(([name, Icon]) => (
              <li key={name}>
                <figure className="group flex h-full flex-col items-center gap-2 rounded-sm border border-border bg-card p-4 transition-colors hover:bg-muted/50">
                  <Icon aria-hidden="true" className="size-8 text-foreground" />
                  <figcaption className="w-full truncate text-center font-mono text-xs text-muted-foreground">
                    {name}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export const Gallery: Story = {
  render: () => <IconGallery />,
}

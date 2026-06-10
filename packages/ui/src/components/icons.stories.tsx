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
import { useMemo, useState } from 'react'

import { Icons, type IconName } from './icons.js'
import { Input } from './input.js'

const iconEntries = Object.entries(Icons) as Array<
  [IconName, (typeof Icons)[IconName]]
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
  return value.toLowerCase().replace(/^_+/, '').replace(/_/g, ' ')
}

function IconGallery() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return iconEntries
    return iconEntries.filter(([name]) => normalise(name).includes(term))
  }, [query])

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-normal">Icons</h1>
          <p className="text-muted-foreground text-base">
            The full NSWDS icon set. Reference an icon as{' '}
            <code className="bg-muted text-foreground rounded-sm px-1.5 py-0.5 text-sm">
              {'<Icons.<name> />'}
            </code>{' '}
            — every entry inherits <code>currentColor</code>, so colour and size
            come from the surrounding utility classes.
          </p>
        </header>

        <div className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-10 -mx-6 border-b px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="icon-search"
              className="text-foreground text-sm font-medium"
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
            <p aria-live="polite" className="text-muted-foreground text-sm">
              {filtered.length.toLocaleString()} of{' '}
              {iconEntries.length.toLocaleString()} icons
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border-border rounded-sm border border-dashed p-12 text-center">
            <p className="text-muted-foreground text-base">
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
                <figure className="group border-border bg-card hover:bg-muted/50 flex h-full flex-col items-center gap-2 rounded-sm border p-4 transition-colors">
                  <Icon aria-hidden="true" className="text-foreground size-8" />
                  <figcaption className="text-muted-foreground w-full truncate text-center font-mono text-xs">
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

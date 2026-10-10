/**
 * Icons — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Icons  → this file: Docs, Default, Playground and one story
 *                       per docs section, the searchable gallery last
 *
 * Documents the generated Material Symbols set in src/icons/ (a GROUP in
 * check-stories.mjs: there is no icons.tsx component file). The brand marks
 * are documented apart, in icon-brands.stories.tsx.
 *
 * The npm import line is written out in the docs page itself rather than via
 * DocsPage's `npm` prop: that prop always prints `from '@nswds/ui'`, and the
 * icons ship from the `@nswds/ui/icons` subpath, not the root barrel.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { useMemo, useState } from 'react'

import * as AllIcons from '../icons/index.js'
import { Button } from './button.js'
import { Input } from './input.js'
import { Label } from './label.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const { IconCheckCircle, IconDownload, IconError, IconSearch, IconWarning } = AllIcons

// The icons index re-exports one named component per icon (plus the IconProps
// type, which is erased at runtime), so the runtime namespace is exactly the
// icon set.
const iconEntries = Object.entries(AllIcons) as Array<
  [string, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element]
>

const sizes = [
  ['size-5', '20px'],
  ['size-6', '24px'],
  ['size-7', '28px'],
  ['size-8', '32px'],
] as const

function normalise(value: string) {
  // IconArrowForward -> "arrow forward"
  return value
    .replace(/^Icon/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          Icons have no size of their own — set one with a <code>size-*</code> class. Keep to the
          20, 24, 28 and 32px ladder; 24px matches 16px body text and button labels.
        </>
      }
    >
      <Example code={`<IconSearch className="size-6" aria-hidden="true" />`}>
        {sizes.map(([className, pixels]) => (
          <ExampleCell key={className} label={`${className} · ${pixels}`}>
            <IconSearch aria-hidden='true' className={className} />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Every icon paints with <code>currentColor</code>, so it takes the text colour around it.
          Colour it with a semantic text token, never a palette colour, and pair a status colour
          with words that say the same thing.
        </>
      }
    >
      <Example code={`<IconError className="size-6 text-(--danger-text)" aria-hidden="true" />`}>
        <ExampleCell label='text-foreground'>
          <IconSearch aria-hidden='true' className='size-8 text-foreground' />
        </ExampleCell>
        <ExampleCell label='text-primary'>
          <IconDownload aria-hidden='true' className='size-8 text-primary' />
        </ExampleCell>
        <ExampleCell label='text-muted-foreground'>
          <IconSearch aria-hidden='true' className='size-8 text-muted-foreground' />
        </ExampleCell>
        <ExampleCell label='--success-text'>
          <IconCheckCircle aria-hidden='true' className='size-8 text-(--success-text)' />
        </ExampleCell>
        <ExampleCell label='--warning-text'>
          <IconWarning aria-hidden='true' className='size-8 text-(--warning-text)' />
        </ExampleCell>
        <ExampleCell label='--danger-text'>
          <IconError aria-hidden='true' className='size-8 text-(--danger-text)' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function AccessibleNamesSection() {
  return (
    <ExampleSection
      title='Accessible names'
      description={
        <>
          An icon beside words repeats them, so hide it with <code>aria-hidden</code>. An icon that
          stands alone must be named — on the control that holds it, such as a Button’s{' '}
          <code>aria-label</code>, or with <code>role=&quot;img&quot;</code> and{' '}
          <code>aria-label</code> on the icon itself.
        </>
      }
    >
      <Example
        code={`<Button leadingVisual={IconDownload}>Download form</Button>
<Button iconOnly aria-label="Search" leadingVisual={IconSearch} />`}
      >
        <ExampleCell label='beside a label — decorative'>
          <Button leadingVisual={IconDownload}>Download form</Button>
        </ExampleCell>
        <ExampleCell label='alone — named by the button'>
          <Button iconOnly variant='outline' aria-label='Search' leadingVisual={IconSearch} />
        </ExampleCell>
        <ExampleCell label='alone — named by role="img"'>
          <IconCheckCircle
            role='img'
            aria-label='Approved'
            className='size-8 text-(--success-text)'
          />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ImportingSection() {
  return (
    <ExampleSection
      title='Importing'
      description={
        <>
          Import each icon by name from <code>@nswds/ui/icons</code>; only the icons you import
          reach your bundle. On a server page that must pass an icon as a component — a lookup
          table, a prop typed as <code>ElementType</code> — import from{' '}
          <code>@nswds/ui/icons/client</code> instead. Registry installs copy the curated subset the
          components use.
        </>
      }
    >
      <Example
        layout='stack'
        code={`import { IconSearch } from '@nswds/ui/icons'
import { IconDownload } from '@nswds/ui/icons/client'`}
      >
        <ExampleCell label='@nswds/ui/icons'>
          <IconSearch aria-hidden='true' className='size-8' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function IconGallery() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return iconEntries
    return iconEntries.filter(([name]) => normalise(name).includes(term))
  }, [query])

  return (
    <div className='space-y-6'>
      <div className='max-w-md space-y-2'>
        <Label htmlFor='icon-search'>Search icons</Label>
        <Input
          id='icon-search'
          type='search'
          placeholder='For example: arrow, search, menu'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p aria-live='polite' className='text-base text-muted-foreground'>
          {filtered.length.toLocaleString()} of {iconEntries.length.toLocaleString()} icons
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className='rounded-sm border border-dashed border-border p-12 text-center text-muted-foreground'>
          No icons match <span className='font-medium'>{query}</span>.
        </p>
      ) : (
        <ul role='list' className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
          {filtered.map(([name, Icon]) => (
            <li key={name}>
              <figure className='flex h-full flex-col items-center gap-2 rounded-sm p-4 ring-1 ring-foreground/10'>
                <Icon aria-hidden='true' className='size-8 text-foreground' />
                <figcaption
                  title={name}
                  className='w-full truncate text-center font-mono text-base text-muted-foreground'
                >
                  {name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function GallerySection() {
  return (
    <ExampleSection
      title='Gallery'
      description='Every icon in the set, searchable by name. Names are the Material Symbols name in PascalCase after an Icon prefix — arrow_forward is IconArrowForward.'
    >
      <Example layout='fill' code={`import { IconArrowForward } from '@nswds/ui/icons'`}>
        <IconGallery />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function IconsDocs() {
  return (
    <DocsPage
      title='Icons'
      npm='IconSearch'
      from='@nswds/ui/icons'
      registry='icons'
      summary={
        <>
          The Material Symbols set — over 3,900 icons, one component each, imported by name from{' '}
          <code>@nswds/ui/icons</code>. Every icon takes its colour from the text around it and its
          size from a <code>size-*</code> class.
        </>
      }
    >
      <DocsUsage
        use={[
          'Reinforcing a button or link label, such as a download or search action.',
          'A recognisable action in a tight space — an icon-only Button with an aria-label.',
          'Signalling a status alongside words that say the same thing.',
        ]}
        avoid={[
          'Facebook, LinkedIn and other brand marks — use the brand icons in IconBrands.',
          'The NSW Government mark — use Logo.',
          'Status on its own — use Badge or Callout, which carry words as well as colour.',
        ]}
      />
      <SizesSection />
      <ColoursSection />
      <AccessibleNamesSection />
      <ImportingSection />
      <GallerySection />
      <DocsApi description='Icons take every SVG attribute. These are the ones you will set.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Icons',
  component: IconSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: IconsDocs },
  },
  args: {
    className: 'size-8 text-foreground',
    'aria-hidden': true,
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Size and colour, e.g. `size-6 text-primary`. Icons have no size of their own.',
      table: { category: 'Appearance' },
    },
    'aria-hidden': {
      control: 'boolean',
      description: 'Hide a decorative icon from assistive technology.',
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: 'Name for an icon that stands alone. Pair with `role="img"`.',
      table: { category: 'Accessibility' },
    },
    role: {
      control: 'text',
      description: 'Set `img` when the icon carries meaning on its own.',
      table: { category: 'Accessibility' },
    },
  },
} satisfies Meta<typeof IconSearch>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    if (!svg) throw new Error('Could not find the rendered icon.')
    if (svg.getAttribute('fill') !== 'currentColor') {
      throw new Error(`Expected fill="currentColor", received "${svg.getAttribute('fill')}".`)
    }
    if (svg.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Expected the decorative icon to carry aria-hidden="true".')
    }
    // size-8 resolves to 32px — proves the size class, not the SVG default, sets it.
    const width = getComputedStyle(svg).width
    if (width !== '32px') {
      throw new Error(`Expected size-8 to resolve to 32px, received "${width}".`)
    }
  },
}

export const Playground: Story = {}

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const AccessibleNames: Story = {
  name: 'Accessible names',
  render: () => <AccessibleNamesSection />,
}

export const Importing: Story = { name: 'Importing', render: () => <ImportingSection /> }

export const Gallery: Story = {
  name: 'Gallery',
  parameters: {
    // Skip the axe a11y scan for the gallery. It renders the full ~3,900-icon
    // set, and running axe across that DOM tree blows the 15s Vitest timeout
    // on CI runners. a11y for individual icons is the responsibility of the
    // components that *use* them — the other stories here cover the pattern.
    a11y: { test: 'off' },
    // Exclude from Chromatic for the same reason: the full grid exceeds
    // Chromatic's 25,000,000px capture limit (and a searchable catalogue isn't
    // a visual-regression target — icons are snapshotted via the components
    // that use them).
    chromatic: { disableSnapshot: true },
  },
  render: () => <GallerySection />,
}

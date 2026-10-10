/**
 * Container — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Container                → this file: Docs, Default, Playground
 *   Components/Container/Features       → container.features.stories.tsx
 *   Components/Container/Accessibility  → container.accessibility.stories.tsx
 *   Components/Container/Tests          → container.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import { Container } from './container.js'
import { Section } from './section.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

const sizeDocs = [
  ['fluid', 'Full width — the default, matching the page chrome.'],
  ['contained', 'Centred, up to 75rem (1200px).'],
  ['wide', 'Centred, up to 90rem (1440px), for landing pages.'],
  ['narrow', 'Centred, up to 45rem (720px) — a comfortable reading measure.'],
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          <code>size</code> caps the column’s width; the 16px → 24px → 48px side padding is the same
          at every size, so content lines up with Header, MainNav and Footer above and below it.
          Override the cap once with the <code>--container-max-width</code> custom property.
        </>
      }
    >
      <Example
        layout='stack'
        className='items-stretch'
        code={`<Container size="narrow">…</Container>`}
      >
        {sizeDocs.map(([size]) => (
          <Container key={size} size={size} className='bg-foreground/5'>
            <div className='bg-background py-3 ring-1 ring-foreground/10'>
              <code className='px-3'>size=&quot;{size}&quot;</code>
            </div>
          </Container>
        ))}
      </Example>
      <dl className='grid gap-x-10 gap-y-3 sm:grid-cols-2'>
        {sizeDocs.map(([size, description]) => (
          <div key={size} className='flex gap-4'>
            <dt className='w-24 shrink-0 font-semibold'>{size}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function CustomWidthSection() {
  return (
    <ExampleSection
      title='Custom maximum width'
      description={
        <>
          Every size reads <code>--container-max-width</code> before its own cap, so a shell can set
          a column width once — through <code>style</code>, a utility class or a stylesheet — and
          every Container under it follows without changing <code>size</code>. The padding ramp
          funnels through <code>--container-padding-x</code> the same way.
        </>
      }
    >
      <Example
        layout='stack'
        className='items-stretch'
        code={`<Container size="contained" style={{ '--container-max-width': '40rem' }}>…</Container>`}
      >
        <Container size='contained' className='bg-foreground/5'>
          <div className='bg-background py-3 ring-1 ring-foreground/10'>
            <code className='px-3'>contained — up to 75rem</code>
          </div>
        </Container>
        <Container
          size='contained'
          className='bg-foreground/5'
          style={{ '--container-max-width': '40rem' } as React.CSSProperties}
        >
          <div className='bg-background py-3 ring-1 ring-foreground/10'>
            <code className='px-3'>contained, --container-max-width: 40rem</code>
          </div>
        </Container>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Container sets the width and side padding; Section sets the space above and below. Together they make one band of a page.'
    >
      <Example
        layout='fill'
        code={`<Section spacing="tight" aria-label="About the rebate">
  <Container size="narrow">…</Container>
</Section>`}
      >
        <Section spacing='tight' aria-label='About the rebate'>
          <Container size='narrow'>
            <p className='text-2xl font-bold'>Seniors Energy Rebate</p>
            <p className='mt-3 text-muted-foreground'>
              Eligible seniors can get help with the cost of their electricity bill. Check your
              eligibility and apply through Service NSW using your MyServiceNSW Account.
            </p>
          </Container>
        </Section>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function ContainerDocs() {
  return (
    <DocsPage
      title='Container'
      npm='Container'
      registry='container'
      summary={
        <>
          The page-width column. It carries the same side padding as the page chrome, so content
          lines up with the header at every breakpoint, and an optional maximum{' '}
          <strong>size</strong> for centred layouts.
        </>
      }
    >
      <DocsUsage
        use={[
          'Wrapping each band of page content so it aligns with Header and Footer.',
          'Holding long-form text at a readable width — as a narrow Container.',
          'Centring a form or a results list on a wide screen.',
        ]}
        avoid={[
          'Adding space above and below a band — use Section.',
          'Grouping related content in a bordered box — use Card.',
          'Laying out the page header or footer — Header and Footer carry their own container.',
        ]}
      />
      <SizesSection />
      <CustomWidthSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Container',
  component: Container,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: ContainerDocs },
  },
  args: {
    size: 'fluid',
    children: (
      <div className='bg-foreground/5 p-4 text-foreground'>
        Page content. The gap either side is the container’s padding.
      </div>
    ),
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['fluid', 'contained', 'wide', 'narrow'],
      description: 'Maximum width of the column. `fluid` matches the page chrome’s default.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description: 'The content of the column.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector<HTMLElement>('[data-slot="container"]')
    if (!container) {
      throw new Error('Could not find an element with [data-slot="container"].')
    }

    // The padding is what page content depends on to align with the chrome, so
    // assert the resolved value rather than the class.
    const paddingLeft = getComputedStyle(container).paddingLeft
    if (paddingLeft === '' || paddingLeft === '0px') {
      throw new Error(`Expected the container to carry lateral padding, received "${paddingLeft}".`)
    }

    if (
      getComputedStyle(container).marginInlineStart !== getComputedStyle(container).marginInlineEnd
    ) {
      throw new Error('Expected the container to be centred (equal inline margins).')
    }
  },
}

export const Playground: Story = {}

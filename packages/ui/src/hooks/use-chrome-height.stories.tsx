/**
 * useChromeHeight — the story set, per docs/reference-storybook-standard.md.
 *
 *   Hooks/useChromeHeight        → this file: Docs, Default and one story per
 *                                  docs section
 *   Hooks/useChromeHeight/Tests  → use-chrome-height.tests.stories.tsx
 *
 * The hook has no rendered surface of its own: what it does is only visible in
 * what it lets OTHER components do — anchor targets clearing a sticky header,
 * and `OnThisPage` putting its scroll-spy line in the right place. Those
 * compositions are the documentation.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import { Container } from '../components/container.js'
import { Header, HeaderActions, HeaderBrand } from '../components/header.js'
import { OnThisPage } from '../components/on-this-page.js'
import { Section } from '../components/section.js'
import { DocsPage, DocsUsage, Example, ExampleSection } from '../components/story-helpers.js'
import { useChromeHeight } from './use-chrome-height.js'

const ITEMS = [
  { id: 'chrome-specimen', title: 'Specimen' },
  { id: 'chrome-download', title: 'Download' },
  { id: 'chrome-install', title: 'Install' },
]

const PROPERTY = '--story-chrome-height'

/**
 * The composition the hook exists for: a `Header` and an `OnThisPage` sharing
 * one sticky wrapper, whose measured height becomes both the scroll-spy line
 * and (in a real app) the document's `scroll-padding-top`.
 *
 * The docs page renders it twice, so `idPrefix` keeps each instance's section
 * ids unique — OnThisPage links to them, and duplicates would send the second
 * instance's links to the first instance's sections.
 */
function StickyChromeDemo({
  showReadout = true,
  idPrefix = '',
}: {
  showReadout?: boolean
  idPrefix?: string
}) {
  const items = ITEMS.map(({ id, title }) => ({ id: idPrefix ? `${idPrefix}-${id}` : id, title }))
  // Destructured at the call site, which is also how the hook documents
  // itself. Holding the result as one object and reading `chrome.ref` /
  // `chrome.height` during render trips React Compiler's "cannot access refs
  // during render" rule — it treats an object carrying a `ref` as ref-like.
  const { ref, height } = useChromeHeight<HTMLDivElement>({ property: PROPERTY })

  return (
    <div>
      <div ref={ref} data-testid='chrome' className='sticky top-0 z-40 bg-background'>
        <Header sticky={false}>
          <HeaderBrand sitename='Public Sans' />
          <HeaderActions>
            {showReadout ? (
              <output
                data-testid='readout'
                className='text-base text-muted-foreground tabular-nums'
              >
                {Math.round(height)}px
              </output>
            ) : null}
          </HeaderActions>
        </Header>
        <OnThisPage items={items} offset={height} />
      </div>

      {items.map(({ id, title }) => (
        <Section key={id} id={id} labelledBy={`${id}-heading`} divider spacing='tight'>
          <Container>
            <h2 id={`${id}-heading`} className='text-2xl font-bold text-foreground'>
              {title}
            </h2>
            <p className='mt-2 text-muted-foreground'>
              Scroll: the entry above becomes current as this heading passes under the chrome, not
              when it passes the top of the window.
            </p>
            <div className='h-[60vh]' />
          </Container>
        </Section>
      ))}
    </div>
  )
}

/**
 * A page-sized scroll box, so the sticky chrome has something to stick within
 * on the docs page. Its scroll padding reads the published property, exactly
 * as a consumer's `html { scroll-padding-top }` would.
 */
function ScrollFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='h-[32rem] overflow-y-auto'
      style={{ scrollPaddingTop: `var(${PROPERTY}, 0px)` }}
    >
      {children}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function MeasuringTheChromeSection() {
  return (
    <ExampleSection
      title='Measuring the chrome'
      description={
        <>
          Attach <code>ref</code> to the sticky wrapper around everything that stays on screen. The
          hook returns the live <code>height</code> and publishes it on <code>&lt;html&gt;</code> as
          the custom property you name. The readout in the header is that number: scroll, or narrow
          the window until the header wraps, and it follows. It is <code>0</code> until after mount.
        </>
      }
    >
      <Example
        layout='fill'
        code={`const { ref, height } = useChromeHeight({ property: '--site-chrome-height' })

<div ref={ref} className="sticky top-0 z-40">
  <Header sticky={false} />
  <OnThisPage items={items} offset={height} />
</div>`}
      >
        <ScrollFrame>
          <StickyChromeDemo />
        </ScrollFrame>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          The property&rsquo;s main reader is CSS. Set <code>scroll-padding-top</code> from it so
          anchor targets land below the chrome rather than behind it, with a <code>0px</code>{' '}
          fallback for the first paint. Choose a section in &ldquo;On this page&rdquo; to jump to
          it.
        </>
      }
    >
      <Example
        layout='fill'
        code={`html {
  scroll-padding-top: calc(var(--site-chrome-height, 0px) + 1.5rem);
}`}
      >
        <ScrollFrame>
          <StickyChromeDemo showReadout={false} idPrefix='context' />
        </ScrollFrame>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function UseChromeHeightDocs() {
  return (
    <DocsPage
      eyebrow='Hook'
      title='useChromeHeight'
      npm={['useChromeHeight']}
      registry='use-chrome-height'
      summary={
        <>
          Measures a sticky chrome element and publishes its height as a CSS custom property on{' '}
          <code>&lt;html&gt;</code>, keeping it current as the element resizes. Use it wherever
          something needs to know how much of the screen the header covers — scroll padding for
          anchor links, the scroll-spy line in OnThisPage, or <code>--main-nav-top</code> under a
          sticky Header.
        </>
      }
    >
      <DocsUsage
        use={[
          'A sticky Header whose height changes — it wraps to two lines at some widths.',
          'Anchor links on a page with sticky chrome, so their targets clear it.',
          'Passing the chrome height to OnThisPage as its offset.',
        ]}
        avoid={[
          'Chrome that is not sticky — it scrolls away, so there is nothing to clear.',
          'A sticky element of fixed, known height — set the custom property in CSS once.',
          'Highlighting the section in view — that is OnThisPage’s job; this only feeds it.',
        ]}
      />
      <MeasuringTheChromeSection />
      <InContextSection />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Hooks/useChromeHeight',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { page: UseChromeHeightDocs },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <StickyChromeDemo />,
  play: async ({ canvasElement }) => {
    const chrome = canvasElement.querySelector<HTMLElement>('[data-testid="chrome"]')
    if (!chrome) {
      throw new Error('Could not find the chrome element.')
    }

    // Let the ResizeObserver deliver its first measurement.
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const published = canvasElement.ownerDocument.documentElement.style.getPropertyValue(PROPERTY)
    if (!published) {
      throw new Error(`Expected ${PROPERTY} to be published on <html>.`)
    }

    // The published value must match the element's real layout height, or every
    // anchor target lands at the wrong offset.
    const measured = Number.parseFloat(published)
    const actual = chrome.getBoundingClientRect().height
    if (!Number.isFinite(measured) || Math.abs(measured - actual) > 1) {
      throw new Error(`Expected ${PROPERTY} ≈ ${actual}px, received "${published}".`)
    }
    if (measured <= 0) {
      throw new Error(`Expected a positive height, received "${published}".`)
    }

    // The returned number has to agree with the property — they are the same
    // measurement, and consumers use both (CSS for scroll-padding, JS for the
    // OnThisPage offset).
    const readout = canvasElement.querySelector<HTMLElement>('[data-testid="readout"]')
    if (!readout) {
      throw new Error('Could not find the height readout.')
    }
    if (Math.abs(Number.parseFloat(readout.textContent ?? '') - measured) > 1) {
      throw new Error(`Readout "${readout.textContent}" disagrees with ${PROPERTY} "${published}".`)
    }
  },
}

export const MeasuringTheChrome: Story = {
  name: 'Measuring the chrome',
  render: () => <MeasuringTheChromeSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

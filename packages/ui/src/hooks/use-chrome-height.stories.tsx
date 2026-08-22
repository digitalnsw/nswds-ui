/**
 * useChromeHeight — Default, Variants, CssCheck
 *
 * The only hook with a story. It earns one because it has no rendered surface
 * of its own: what it does is only visible in what it lets OTHER components do
 * — anchor targets clearing a sticky header, and `OnThisPage` putting its
 * scroll-spy line in the right place. Those compositions are the documentation.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from '../components/container.js'
import { Header, HeaderActions, HeaderBrand } from '../components/header.js'
import { OnThisPage } from '../components/on-this-page.js'
import { Section } from '../components/section.js'
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
 */
function StickyChromeDemo({ showReadout = true }: { showReadout?: boolean }) {
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
        <OnThisPage items={ITEMS} offset={height} />
      </div>

      {ITEMS.map(({ id, title }) => (
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

const meta = {
  title: 'Hooks/useChromeHeight',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'useChromeHeight measures a sticky chrome element and publishes its height as a CSS custom property on <html>, keeping it current as the element resizes. MainNav already documents that a consumer stacking it under a sticky Header must set --main-nav-top to the header height, and any page with anchor links needs the same number for scroll-padding-top — so every consumer was writing the same ResizeObserver. The height is 0 until after mount (it is measured in an effect, so the server and first client render agree), which is why the CSS fallback matters: var(--site-chrome-height, 0px).',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
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

export const Variants: Story = {
  name: 'Without the readout',
  render: () => <StickyChromeDemo showReadout={false} />,
}

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => <StickyChromeDemo />,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const chrome = canvasElement.querySelector<HTMLElement>('[data-testid="chrome"]')
    if (!chrome) {
      throw new Error('Could not find the chrome element.')
    }

    // Proves globals.css loaded: `sticky` resolves to real position stickiness,
    // without which the hook would be measuring an element that scrolls away
    // and the whole offset would be pointless.
    const position = getComputedStyle(chrome).position
    if (position !== 'sticky') {
      throw new Error(`Expected the chrome wrapper to be position: sticky, received "${position}".`)
    }

    // The published property must be usable in a calc() — the scroll-padding
    // case is the hook's primary consumer.
    const probe = canvasElement.ownerDocument.createElement('div')
    probe.style.height = `calc(var(${PROPERTY}, 0px) + 10px)`
    canvasElement.append(probe)
    const probeHeight = Number.parseFloat(getComputedStyle(probe).height)
    probe.remove()

    if (!Number.isFinite(probeHeight) || probeHeight <= 10) {
      throw new Error(`Expected ${PROPERTY} to resolve inside calc(), got height ${probeHeight}px.`)
    }
  },
}

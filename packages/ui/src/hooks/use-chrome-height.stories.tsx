/**
 * useChromeHeight — Default, Variants, CssCheck
 *
 * The only hook with a story. It earns one because it has no rendered surface
 * of its own: what it does is only visible in what it lets OTHER components do
 * — anchor targets clearing a sticky header, and `OnThisPage` putting its
 * scroll-spy line in the right place. Those compositions are the documentation.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect } from 'storybook/test'

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

const SHARED_PROPERTY = '--story-shared-chrome-height'

/** A publisher of fixed height, mountable and unmountable on demand. */
function SharedPublisher({ height, testId }: { height: number; testId: string }) {
  const { ref } = useChromeHeight<HTMLDivElement>({ property: SHARED_PROPERTY })
  return <div ref={ref} data-testid={testId} style={{ height }} />
}

function SharedPropertyHarness() {
  const [first, setFirst] = React.useState(true)
  const [second, setSecond] = React.useState(true)
  return (
    <div className='flex flex-col gap-2 p-4'>
      {first ? <SharedPublisher height={40} testId='publisher-a' /> : null}
      {second ? <SharedPublisher height={70} testId='publisher-b' /> : null}
      <button type='button' data-testid='drop-a' onClick={() => setFirst(false)}>
        Unmount A
      </button>
      <button type='button' data-testid='drop-b' onClick={() => setSecond(false)}>
        Unmount B
      </button>
    </div>
  )
}

/**
 * Two instances publishing to ONE property name — the case the ownership
 * registry exists for, and the case nothing else here exercises.
 *
 * The failure it guards against is silent: an unmount that clears a property a
 * surviving instance still owns leaves `var(--x, 0px)` falling back to its
 * default, so anchor targets quietly start landing behind the chrome. Without
 * this story the registry could be deleted outright and the whole suite would
 * stay green.
 *
 * Both orders are covered, because they exercise different branches: B
 * published last, so unmounting B is the OWNER leaving (the survivor must be
 * asked to republish), while unmounting A first is a non-owner leaving (the
 * property must simply be left alone).
 */
export const SharedProperty: Story = {
  name: 'Two instances, one property',
  render: () => <SharedPropertyHarness />,
  play: async ({ canvasElement }) => {
    const root = document.documentElement
    const read = () => root.style.getPropertyValue(SHARED_PROPERTY).trim()
    const click = (id: string) =>
      canvasElement.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click()
    const settle = () => new Promise((resolve) => setTimeout(resolve, 60))

    await settle()
    // B mounted second, so it published last and owns the value.
    await expect(read()).toBe('70px')

    // Non-owner leaves: the owner's value must survive untouched.
    click('drop-a')
    await settle()
    await expect(read()).toBe('70px')

    // Owner leaves with nobody left: only now is the property cleared.
    click('drop-b')
    await settle()
    await expect(read()).toBe('')
  },
}

/**
 * The mirror image, and the one that actually failed before the registry
 * landed: the OWNER unmounts while another instance is still mounted. The
 * survivor's element has not resized, so no ResizeObserver callback is coming
 * — the value has to be restored by asking it to republish.
 */
export const SharedPropertyOwnerLeavesFirst: Story = {
  name: 'Two instances, owner unmounts first',
  render: () => <SharedPropertyHarness />,
  play: async ({ canvasElement }) => {
    const root = document.documentElement
    const read = () => root.style.getPropertyValue(SHARED_PROPERTY).trim()
    const click = (id: string) =>
      canvasElement.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)!.click()
    const settle = () => new Promise((resolve) => setTimeout(resolve, 60))

    await settle()
    await expect(read()).toBe('70px')

    // B owns the value. Unmounting it must NOT blank the property — A is still
    // mounted and still needs it, so A republishes its own 40px.
    click('drop-b')
    await settle()
    await expect(read()).toBe('40px')

    // And the last one out does clear it.
    click('drop-a')
    await settle()
    await expect(read()).toBe('')
  },
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

/**
 * useChromeHeight — Tests
 *
 * Two instances sharing one property name, in both unmount orders (the case
 * the ownership registry exists for), and the CSS check proving globals.css
 * loaded and the published property resolves inside calc().
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { expect } from 'storybook/test'

import { Container } from '../components/container.js'
import { Header, HeaderActions, HeaderBrand } from '../components/header.js'
import { OnThisPage } from '../components/on-this-page.js'
import { Section } from '../components/section.js'
import { useChromeHeight } from './use-chrome-height.js'

const meta = {
  title: 'Hooks/useChromeHeight/Tests',
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

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

const PROPERTY = '--story-chrome-height'

const ITEMS = [
  { id: 'chrome-specimen', title: 'Specimen' },
  { id: 'chrome-download', title: 'Download' },
  { id: 'chrome-install', title: 'Install' },
]

/** The main file's demo: Header and OnThisPage sharing one measured sticky wrapper. */
function StickyChromeDemo() {
  const { ref, height } = useChromeHeight<HTMLDivElement>({ property: PROPERTY })

  return (
    <div>
      <div ref={ref} data-testid='chrome' className='sticky top-0 z-40 bg-background'>
        <Header sticky={false}>
          <HeaderBrand sitename='Public Sans' />
          <HeaderActions>
            <output data-testid='readout' className='text-base text-muted-foreground tabular-nums'>
              {Math.round(height)}px
            </output>
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

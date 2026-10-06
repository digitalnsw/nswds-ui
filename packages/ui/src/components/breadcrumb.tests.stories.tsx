/**
 * Breadcrumb — Tests
 *
 * Regression stories that exist for CI rather than for readers: fallbacks,
 * the ellipsis trigger's escape hatches, and the collapse measurement's edge
 * cases. Hidden from the sidebar and docs (`!dev`, `!autodocs`), as Badge's and
 * Tag's tests are; the Storybook test run still plays every one.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { IconHome } from '../icons/home.js'
import {
  Breadcrumb,
  BREADCRUMB_MENU_OFFSET,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  breadcrumbVariants,
} from './breadcrumb.js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from './dropdown-menu.js'
import { breadcrumbShownItems, BreadcrumbSteps } from './story-helpers.js'

const meta = {
  title: 'Components/Breadcrumb/Tests',
  component: Breadcrumb,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

const LONG = ['Home', 'Services', 'Licences and permits']
const LONG_CURRENT = 'Apply for a recreational fishing licence'

/** An ellipsis step: the trigger and its one-item menu. */
function EllipsisStep({
  label = 'Show 1 more page',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label={label || undefined} className={className}>
          <BreadcrumbEllipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={BREADCRUMB_MENU_OFFSET}>
          <DropdownMenuLinkItem href='#services'>Services</DropdownMenuLinkItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
}

/**
 * `variant={null}` (which VariantProps admits) falls back to `default` rather
 * than leaving every --bc-* variable unset, and the exported
 * `breadcrumbVariants` renders the band correctly on its own — without the
 * tailwind-merge pass inside Breadcrumb.
 */
export const VariantFallbacks: Story = {
  name: 'Variant fallbacks',
  render: () => (
    <div className='grid gap-8'>
      <Breadcrumb data-testid='reference'>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home']} current='Apply online' />
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb variant={null} data-testid='null'>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home']} current='Apply online' />
        </BreadcrumbList>
      </Breadcrumb>
      <nav
        aria-label='Breadcrumb from the helper'
        data-variant='band'
        data-testid='helper'
        className={breadcrumbVariants({ variant: 'band' })}
      >
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home']} current='Apply online' />
        </BreadcrumbList>
      </nav>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = (id: string) => canvasElement.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    const colour = (id: string, selector: string) =>
      getComputedStyle(nav(id).querySelector(selector)!).color

    await expect(nav('null')).toHaveAttribute('data-variant', 'default')
    await expect(colour('null', 'a[href]')).toBe(colour('reference', 'a[href]'))

    await expect(colour('helper', '[data-slot="breadcrumb-page"]')).toBe(
      colour('helper', 'a[href]'),
    )
    await expect(colour('helper', '[data-slot="breadcrumb-page"]')).not.toBe(
      colour('reference', '[data-slot="breadcrumb-page"]'),
    )
  },
}

/**
 * The trigger's look is applied from BreadcrumbItem inside `:where()`, so a
 * `className` on the trigger itself still wins — here a taller target. A
 * trigger whose consumer forgot `aria-label` is still named, by the
 * ellipsis's own "More pages".
 */
export const EllipsisTrigger: Story = {
  name: 'Ellipsis trigger className and name',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSteps labels={['Home']} />
        <BreadcrumbSeparator />
        <EllipsisStep label='' className='h-10' />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Apply online</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'More pages' })
    await expect(trigger.getBoundingClientRect().height).toBe(40)
  },
}

/**
 * Collapse leaves a trail alone when it cannot shorten it sensibly — the
 * ellipsis in the parent slot — and a collapsed trail that held the ellipsis
 * keeps the trigger's 32px row, so collapsing never changes its height.
 */
export const CollapseWithEllipsis: Story = {
  name: 'Collapse with an ellipsis',
  render: () => (
    <div className='grid gap-6' style={{ width: 375 }}>
      <Breadcrumb variant='soft' data-testid='ellipsis-parent'>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home']} />
          <BreadcrumbSeparator />
          <EllipsisStep />
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Fees and exemptions for concession holders in NSW</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb data-testid='collapsed-ellipsis'>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home']} />
          <BreadcrumbSeparator />
          <EllipsisStep />
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='#licences'>Licences and permits</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{LONG_CURRENT}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = (id: string) => canvasElement.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    await waitFor(() => expect(nav('collapsed-ellipsis')).toHaveAttribute('data-measured'))
    await expect(breadcrumbShownItems(nav('ellipsis-parent'))).toEqual([
      'Home',
      'More pages',
      'Fees and exemptions for concession holders in NSW',
    ])
    await expect(breadcrumbShownItems(nav('collapsed-ellipsis'))).toEqual([
      'Back to Licences and permits',
    ])
    await expect(
      nav('collapsed-ellipsis')
        .querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')!
        .getBoundingClientRect().height,
    ).toBe(32)
  },
}

/**
 * Before the first measurement (server-rendered HTML, or no script) CSS stands
 * in, and its state is always one row, as the measured state is — so the page
 * cannot jump when the measurement lands. Each frame pairs an unmeasured nav,
 * built from the exported parts to pin that state, with a measured Breadcrumb
 * holding the same trail: below 36rem the stand-in is already collapsed; at
 * 600px, where the trail would wrap, it is one scrollable row; and the two
 * are the same height either way.
 */
export const CollapseFallback: Story = {
  name: 'Collapse before measurement',
  render: () => (
    <div className='grid gap-8'>
      {[375, 600].map((width) => (
        <div key={width} className='grid gap-4' style={{ width }} data-testid={`frame-${width}`}>
          <nav
            aria-label={`Breadcrumb before measurement at ${width}px`}
            data-slot='breadcrumb'
            data-variant='default'
            data-collapse=''
            data-testid='unmeasured'
            className={`${breadcrumbVariants({ variant: 'default' })} @container/breadcrumb w-full`}
          >
            <BreadcrumbList>
              <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
            </BreadcrumbList>
          </nav>
          <Breadcrumb aria-label={`Measured breadcrumb at ${width}px`} data-testid='measured'>
            <BreadcrumbList>
              <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = (width: number) =>
      canvasElement.querySelector<HTMLElement>(`[data-testid="frame-${width}"]`)!
    const part = (width: number, id: string) =>
      frame(width).querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    for (const width of [375, 600]) {
      await waitFor(() => expect(part(width, 'measured')).toHaveAttribute('data-measured'))
      await expect(part(width, 'measured')).toHaveAttribute('data-collapsed')
      await expect(part(width, 'unmeasured').getBoundingClientRect().height).toBe(
        part(width, 'measured').getBoundingClientRect().height,
      )
    }
    await expect(breadcrumbShownItems(part(375, 'unmeasured'))).toEqual([
      'Back to Licences and permits',
    ])
    const wideList = part(600, 'unmeasured').querySelector<HTMLElement>(
      '[data-slot="breadcrumb-list"]',
    )!
    await expect(getComputedStyle(wideList).flexWrap).toBe('nowrap')
    await expect(wideList.scrollWidth).toBeGreaterThan(wideList.clientWidth)
  },
}

/**
 * The measurement asks only whether the trail fits on one row, so nothing
 * that changes an item's height or the nav's on-screen scale can trip it: a
 * 24px icon beside "Home", a looser line height, a zooming transform. A parent
 * link whose text lives in its `render` element has no back affordance, so a
 * trail that would wrap stays whole rather than collapsing to a bare link.
 */
export const CollapseEdgeCases: Story = {
  name: 'Collapse edge cases',
  render: () => (
    <div className='grid gap-8'>
      <div className='grid gap-6' style={{ width: '48rem' }}>
        <Breadcrumb data-testid='icon'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='#home'>
                <IconHome aria-hidden='true' className='me-1 inline size-6 align-[-0.4em]' />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbSteps labels={['Services']} current='Apply online' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb data-testid='leading'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={['Home', 'Services']} />
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='leading-7'>Apply online</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div style={{ transform: 'scale(0.8)', transformOrigin: 'left top' }}>
          <Breadcrumb data-testid='scaled'>
            <BreadcrumbList>
              <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div style={{ width: 375 }}>
        <Breadcrumb data-testid='render-prop'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={['Home', 'Services']} />
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<a href='#licences'>Licences and permits</a>} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{LONG_CURRENT}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = (id: string) => canvasElement.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    for (const id of ['icon', 'leading', 'scaled']) {
      await waitFor(() => expect(nav(id)).toHaveAttribute('data-measured'))
      await expect(nav(id)).not.toHaveAttribute('data-collapsed')
    }
    await expect(breadcrumbShownItems(nav('scaled'))).toEqual([...LONG, LONG_CURRENT])
    await waitFor(() => expect(nav('render-prop')).toHaveAttribute('data-measured'))
    await expect(breadcrumbShownItems(nav('render-prop'))).toEqual([...LONG, LONG_CURRENT])
  },
}

/**
 * A breadcrumb mounted inside a hidden parent has no width to measure, so it
 * waits — no transient collapse at width 0 — and measures once it shows.
 */
export const CollapseWhileHidden: Story = {
  name: 'Collapse waits while hidden',
  render: () => (
    <div data-testid='holder' style={{ display: 'none', width: '48rem' }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const holder = canvasElement.querySelector<HTMLElement>('[data-testid="holder"]')!
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await expect(nav).not.toHaveAttribute('data-measured')
    holder.style.display = 'block'
    await waitFor(() => expect(nav).toHaveAttribute('data-measured'))
    await expect(nav).not.toHaveAttribute('data-collapsed')
  },
}

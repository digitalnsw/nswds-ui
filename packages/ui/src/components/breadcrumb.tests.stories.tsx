/**
 * Breadcrumb — Tests
 *
 * Regression stories that exist for CI rather than for readers: fallbacks,
 * the ellipsis trigger's escape hatches, and the collapse measurement's edge
 * cases, then the CSS check. The look matrices, ellipsis menu, wrapping and
 * collapse contracts live in breadcrumb.features.stories.tsx. Hidden from the
 * sidebar and docs (`!dev`, `!autodocs`); the Storybook test run still plays
 * every one. The examples a reader needs are on the Breadcrumb docs page.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
import {
  breadcrumbMoreTrigger,
  breadcrumbShownItems,
  BreadcrumbSteps,
  closeOverlay,
} from './story-helpers.js'

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
 * A team's own ellipsis stays in a collapsed trail, and collapse leaves a
 * trail alone when the ellipsis is in the parent slot. With nothing else
 * hidden the trail adds no "…" of its own, and the 24px trigger keeps the
 * row one line tall.
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
    await expect(nav('collapsed-ellipsis')).toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('collapsed-ellipsis'))).toEqual([
      'Home',
      'More pages',
      'Licences and permits',
    ])
    await expect(breadcrumbMoreTrigger(nav('collapsed-ellipsis'))).toBeNull()
    await expect(
      nav('collapsed-ellipsis')
        .querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')!
        .getBoundingClientRect().height,
    ).toBe(24)
  },
}

/**
 * The "…" a collapsed trail adds is a working menu of exactly the steps it
 * hides, sitting inside the parent step so the tab order is the order seen:
 * Home, …, parent.
 */
export const CollapseMenu: Story = {
  name: 'Collapse menu',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps
            labels={['Home', 'Services', 'Fishing', 'Licences and permits']}
            current={LONG_CURRENT}
          />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await waitFor(() => expect(breadcrumbMoreTrigger(nav)).not.toBeNull())
    const trigger = breadcrumbMoreTrigger(nav)!
    await expect(trigger).toHaveAccessibleName('Show 2 more pages')

    await userEvent.tab()
    await waitFor(() => expect(within(nav).getByRole('link', { name: 'Home' })).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.tab()
    await waitFor(() =>
      expect(within(nav).getByRole('link', { name: 'Licences and permits' })).toHaveFocus(),
    )

    await userEvent.click(trigger)
    const menu = await within(document.body).findByRole('menu')
    await expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => [item.textContent, item.getAttribute('href')]),
    ).toEqual([
      ['Services', '#1'],
      ['Fishing', '#2'],
    ])
    await closeOverlay('dropdown-menu-content')
  },
}

/**
 * The "…" menu copies the hidden steps' destinations, so a hidden link whose
 * `href` changes after collapse (a router rewriting a path, say) must update
 * its menu row too, although nothing about the trail's width has changed.
 */
export const CollapseMenuHrefChange: Story = {
  name: 'Collapse menu follows href changes',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps
            labels={['Home', 'Services', 'Fishing', 'Licences and permits']}
            current={LONG_CURRENT}
          />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await waitFor(() => expect(breadcrumbMoreTrigger(nav)).not.toBeNull())
    // Open the menu first and let it settle: opening adds nodes inside the
    // trail, which re-measure by themselves and would hide a missing href
    // watch.
    await userEvent.click(breadcrumbMoreTrigger(nav)!)
    const menu = await within(document.body).findByRole('menu')
    const row = () => within(menu).getByRole('menuitem', { name: 'Services' })
    await expect(row()).toHaveAttribute('href', '#1')
    await new Promise((resolve) => setTimeout(resolve, 300))

    nav.querySelector<HTMLAnchorElement>('a[href="#1"]')!.setAttribute('href', '#services-moved')
    // The observer callback schedules the re-measure for the next frame.
    const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))
    await frame()
    await frame()
    await expect(row()).toHaveAttribute('href', '#services-moved')
    await closeOverlay('dropdown-menu-content')
  },
}

/**
 * A trail of Home, one parent and the current page collapses to Home and the
 * parent when it would wrap: there is no middle step, so no "…". The current
 * page is dropped as it is on every collapsed trail; the page heading names
 * it.
 */
export const CollapseThreeSteps: Story = {
  name: 'Collapse a three-step trail',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home', 'Services']} current={LONG_CURRENT} />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
    await expect(breadcrumbShownItems(nav)).toEqual(['Home', 'Services'])
    await expect(breadcrumbMoreTrigger(nav)).toBeNull()
  },
}

/**
 * A class or style change on a step can widen the trail without changing the
 * nav's own width, which a ResizeObserver never reports, so the trail
 * re-measures on those attributes too: widening a link collapses a trail
 * that fitted, and narrowing it again restores the full trail.
 */
export const CollapseFollowsClassAndStyle: Story = {
  name: 'Collapse follows class and style changes',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home', 'Services']} current='Apply online' />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    const link = within(nav).getByRole('link', { name: 'Services' })
    await waitFor(() => expect(nav).toHaveAttribute('data-measured'))
    await expect(nav).not.toHaveAttribute('data-collapsed')

    // Classes the shipped components already use, so this story adds no
    // utilities to the published stylesheet (package.css scans stories too).
    link.classList.add('inline-block', 'min-w-48')
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
    link.classList.remove('inline-block', 'min-w-48')
    await waitFor(() => expect(nav).not.toHaveAttribute('data-collapsed'))

    link.style.paddingInline = '15rem'
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
    link.style.paddingInline = ''
    await waitFor(() => expect(nav).not.toHaveAttribute('data-collapsed'))
  },
}

/**
 * A hidden step whose link has an empty `href` (a link to this page) is still
 * a step to the collapse rules, so the "…" menu offers it too rather than
 * hiding it with no way back.
 */
export const CollapseMenuEmptyHref: Story = {
  name: 'Collapse menu keeps an empty href',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='#0'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href=''>Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='#2'>Licences and permits</BreadcrumbLink>
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
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await waitFor(() => expect(breadcrumbMoreTrigger(nav)).not.toBeNull())
    await expect(breadcrumbMoreTrigger(nav)).toHaveAccessibleName('Show 1 more page')
    await userEvent.click(breadcrumbMoreTrigger(nav)!)
    const menu = await within(document.body).findByRole('menu')
    await expect(within(menu).getByRole('menuitem', { name: 'Services' })).toHaveAttribute(
      'href',
      '',
    )
    await closeOverlay('dropdown-menu-content')
  },
}

/**
 * A web font that finishes loading widens the trail without changing the
 * nav's width or its DOM, so neither observer sees it; the trail re-measures
 * when the document's fonts report a load. Simulated here with a stylesheet
 * that widens the text (no mutation inside the trail), then the
 * `loadingdone` event a real font load fires.
 */
export const CollapseFollowsFontLoad: Story = {
  name: 'Collapse follows font loading',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb data-testid='font-trail'>
        <BreadcrumbList>
          <BreadcrumbSteps labels={['Home', 'Services']} current='Apply online' />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))
    // Let the page's own fonts settle first: the trail re-measures when they
    // are ready, which would otherwise race the check below.
    await document.fonts.ready
    await frame()
    await frame()
    await waitFor(() => expect(nav).toHaveAttribute('data-measured'))
    await expect(nav).not.toHaveAttribute('data-collapsed')

    const wider = document.createElement('style')
    wider.textContent = '[data-testid="font-trail"] { letter-spacing: 0.5em; }'
    document.head.append(wider)
    try {
      // The trail now wraps, but nothing has told it to re-measure yet.
      await frame()
      await frame()
      await expect(nav).not.toHaveAttribute('data-collapsed')

      document.fonts.dispatchEvent(new Event('loadingdone'))
      await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
    } finally {
      wider.remove()
    }
  },
}

/**
 * A long parent title shares the row with Home and wraps within it, rather
 * than dropping below and leaving Home alone on a line.
 */
export const CollapseLongParent: Story = {
  name: 'Collapse with a long parent',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps
            labels={[
              'Home',
              'Services',
              'Recreational fishing licences, fees and exemptions for concession holders',
            ]}
            current={LONG_CURRENT}
          />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
    const home = within(nav).getByRole('link', { name: 'Home' })
    const parent = within(nav).getByRole('link', { name: /concession holders/ })
    // Same first line, and Home itself does not wrap.
    await expect(
      Math.abs(home.getClientRects()[0]!.top - parent.getClientRects()[0]!.top),
    ).toBeLessThan(2)
    await expect(home.getClientRects()).toHaveLength(1)
    await expect(parent.getClientRects().length).toBeGreaterThan(1)
  },
}

/**
 * Before the first measurement (server-rendered HTML, or no script) an
 * eligible trail is shown collapsed at every width, so it never clips, and
 * the measurement only ever expands it or adds the "…" — never changing its
 * height. Each frame pairs an unmeasured nav, built from the exported parts
 * to pin that state, with a measured Breadcrumb holding the same trail: at
 * 375px and 600px the trail would wrap and stays collapsed; at 900px it fits
 * and expands; the two are the same height at every width.
 */
export const CollapseFallback: Story = {
  name: 'Collapse before measurement',
  render: () => (
    <div className='grid gap-8'>
      {[375, 600, 900].map((width) => (
        <div key={width} className='grid gap-4' style={{ width }} data-testid={`frame-${width}`}>
          <nav
            aria-label={`Breadcrumb before measurement at ${width}px`}
            data-slot='breadcrumb'
            data-variant='default'
            data-collapse=''
            data-testid='unmeasured'
            className={`${breadcrumbVariants({ variant: 'default' })} w-full`}
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
    for (const width of [375, 600, 900]) {
      await waitFor(() => expect(part(width, 'measured')).toHaveAttribute('data-measured'))
      // Collapsed and one row, never clipped.
      await expect(breadcrumbShownItems(part(width, 'unmeasured'))).toEqual([
        'Home',
        'Licences and permits',
      ])
      await expect(part(width, 'unmeasured').getBoundingClientRect().height).toBe(
        part(width, 'measured').getBoundingClientRect().height,
      )
    }
    await expect(part(600, 'measured')).toHaveAttribute('data-collapsed')
    await expect(part(900, 'measured')).not.toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(part(900, 'measured'))).toEqual([...LONG, LONG_CURRENT])
  },
}

/**
 * The measurement asks only whether the trail fits on one row, so nothing
 * that changes an item's height or the nav's on-screen scale can trip it: a
 * 24px icon beside "Home", a looser line height, a zooming transform. A parent
 * link whose text lives in its `render` element collapses like any other.
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
    await expect(breadcrumbShownItems(nav('render-prop'))).toEqual(['Home', 'Licences and permits'])
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

// ─── CSS check ────────────────────────────────────────────────────────────────

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSteps labels={['Home', 'Services']} current='Apply online' />
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the list's separator colour resolves through
    // --bc-separator to a real colour rather than staying unset.
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')
    if (!list) {
      throw new Error('Could not find [data-slot="breadcrumb-list"].')
    }
    const color = getComputedStyle(list).color
    if (color === '' || color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
      throw new Error(`Expected the --muted-foreground token to resolve, received "${color}".`)
    }
    // The 16px text floor: the trail used to render at 12px.
    await expect(getComputedStyle(list).fontSize).toBe('16px')
  },
}

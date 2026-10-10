/**
 * Breadcrumb — Tests
 *
 * Regression stories that exist for CI rather than for readers: fallbacks,
 * the ellipsis trigger's escape hatches, and the collapse measurement's edge
 * cases; then the look matrices, ellipsis menu, wrapping and collapse
 * contracts (formerly the Features folder) and the CSS check. Hidden from the
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
  BREADCRUMB_LOOKS,
  breadcrumbMoreTrigger,
  breadcrumbShownItems,
  BreadcrumbSteps,
  BreadcrumbTrail,
  closeOverlay,
  docsTemplate,
  renderedText,
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

// ─── Look matrices, ellipsis, wrapping and collapse ──────────────────────────
// Every look at once rather than typical usage: each story says what to look
// for and how to test it. Guidance for choosing a look lives on the Looks pages.

export const Looks: Story = {
  name: 'Looks',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'All four looks with the same trail: default, rail, band, soft.',
          why: 'Catches drift between looks after a token retune: weights, colours, glyphs and heights.',
          how: 'Links are medium weight and underlined; the current page is regular; separators are chevrons except the rail’s slashes; every look sits on the 4px grid.',
          caveat:
            'Band and soft take Header’s inset, so their content starts further in than default and rail.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      {BREADCRUMB_LOOKS.map((look) => (
        <BreadcrumbTrail key={look} variant={look} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const navs = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="breadcrumb"]')]
    await expect(navs.map((nav) => nav.dataset.variant)).toEqual([...BREADCRUMB_LOOKS])
    // Every look lands on the 4px grid: the hairlines are optical.
    for (const nav of navs) {
      await expect(nav.getBoundingClientRect().height % 4).toBe(0)
    }
    const [first, rail, band, soft] = navs as [HTMLElement, HTMLElement, HTMLElement, HTMLElement]

    // Links read as links at rest, in the link signature's medium weight; the
    // current page is regular on every look, never the heaviest word.
    for (const nav of navs) {
      for (const link of nav.querySelectorAll<HTMLElement>('a[href]')) {
        await expect(getComputedStyle(link).textDecorationLine).toBe('underline')
        await expect(getComputedStyle(link).fontWeight).toBe('500')
      }
      const page = nav.querySelector<HTMLElement>('[data-slot="breadcrumb-page"]')!
      await expect(getComputedStyle(page).fontWeight).toBe('400')
    }

    // Separators are drawn by the item after them: the first item leads with
    // nothing, the rest with a chevron — or a slash on the rail.
    const leads = (nav: HTMLElement) =>
      [...nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-lead"]')].map((lead) =>
        getComputedStyle(lead).display === 'none'
          ? 'none'
          : [...lead.children].find((el) => getComputedStyle(el).display !== 'none')?.tagName ===
              'svg'
            ? 'chevron'
            : renderedText(lead),
      )
    await expect(leads(first)).toEqual(['none', 'chevron', 'chevron', 'chevron'])
    await expect(leads(rail)).toEqual(['none', '/', '/', '/'])
    for (const separator of first.querySelectorAll<HTMLElement>(
      '[data-slot="breadcrumb-separator"]',
    )) {
      await expect(getComputedStyle(separator).display).toBe('none')
    }

    // Colour contract. Compared element to element, never against a literal:
    // computed colours come back in whatever space the token was written in.
    const colour = (nav: HTMLElement, selector: string) =>
      getComputedStyle(nav.querySelector(selector)!).color
    const page = '[data-slot="breadcrumb-page"]'
    const link = 'a[href]'
    const lead = '[data-slot="breadcrumb-item"]:nth-child(3) > [data-slot="breadcrumb-lead"]'
    // The band's current page is white like its links, not the page's text colour.
    await expect(colour(band, page)).toBe(colour(band, link))
    await expect(colour(band, page)).not.toBe(colour(first, page))
    await expect(colour(band, lead)).not.toBe(colour(first, lead))
    // The rail and the tint share the default ink.
    await expect(colour(rail, link)).toBe(colour(first, link))
    await expect(colour(soft, link)).toBe(colour(first, link))
  },
}

/** Every look on a real dark page (story-level theme, not a nested `.dark`). */
export const LooksDark: Story = {
  ...Looks,
  name: 'Looks (dark)',
  globals: { theme: 'dark' },
}

export const EllipsisMenu: Story = {
  name: 'Ellipsis menu',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The ellipsis opens a menu of the hidden steps.',
          why: 'Breadcrumb styles any button whose only child is the ellipsis, so the menu is ordinary DropdownMenu composition.',
          how: 'The trigger is a 24px control on the 4px radius, one line tall; hover tints it 10% and open 20%; the menu opens just clear of the trail and its rows are underlined like the trail’s links.',
          caveat: 'Underlining the rows is the consumer’s className, as shown in the code.',
        }),
      },
    },
  },
  render: () => <BreadcrumbTrail />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    await expect(trigger.getBoundingClientRect().height).toBe(24)
    await expect(getComputedStyle(trigger).borderRadius).toBe('4px')
    await expect(
      trigger.querySelector('[data-slot="breadcrumb-ellipsis"] > span[aria-hidden="true"]'),
    ).toBeInTheDocument()
    const resting = getComputedStyle(trigger).backgroundColor

    await userEvent.click(trigger)
    const menu = await within(document.body).findByRole('menu')
    const items = within(menu).getAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Services',
      'Licences and permits',
    ])
    for (const item of items) {
      await expect(getComputedStyle(item).textDecorationLine).toBe('underline')
    }
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(getComputedStyle(trigger).backgroundColor).not.toBe(resting)

    await closeOverlay('dropdown-menu-content')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const Wrapping: Story = {
  name: 'Wrapping',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'A full trail with a long label, wrapping at phone width with collapse off.',
          why: 'Each separator belongs to the step after it, so a new line starts with its separator beside its target; a wrapped link keeps a halo and focus ring per line.',
          how: 'No line ends on a stray separator; hover the long link and the tint follows each line.',
          caveat: 'Rows sit 20px apart on touch screens, which this desktop canvas cannot show.',
        }),
      },
    },
  },
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb collapse={false}>
        <BreadcrumbList>
          <BreadcrumbSteps
            labels={[
              'Home',
              'Recreational fishing licences, fees and exemptions for concession holders',
              'Fees and exemptions',
            ]}
            current='Apply for a recreational fishing fee exemption'
          />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"]')]
    const lines = new Set(items.map((item) => Math.round(item.getBoundingClientRect().top)))
    await expect(lines.size).toBeGreaterThan(1)
    for (const item of items.slice(1)) {
      const lead = item.querySelector<HTMLElement>('[data-slot="breadcrumb-lead"]')!
      const target = item.querySelector<HTMLElement>('a, [data-slot="breadcrumb-page"]')!
      // The glyph shares a line with the first line of its target.
      await expect(
        Math.abs(lead.getBoundingClientRect().top - target.getClientRects()[0]!.top),
      ).toBeLessThan(8)
    }
    // The long label wraps as an inline link: one box per line.
    const long = within(canvasElement).getByRole('link', { name: /concession holders/ })
    await expect(getComputedStyle(long).display).toBe('inline')
    await expect(long.getClientRects().length).toBeGreaterThan(1)
    for (const link of canvasElement.querySelectorAll<HTMLElement>('a[href]')) {
      await expect(link.querySelector(':scope > span[aria-hidden="true"]')).toBeInTheDocument()
    }
  },
}

export const Collapse: Story = {
  name: 'Collapse',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Trails at 375px and 48rem: long and short, every look, and the cases collapse leaves alone.',
          why: 'A trail shortens to Home and the parent only when it would wrap, and only when it can do so sensibly.',
          how: 'At 375px the long default and rail trails show "Home › … › Licences and permits", the … opening a menu of Services; the short band trail and the band trail whose parent is Home stay whole; the one-item trail and collapse={false} stay whole; at 48rem nothing collapses.',
          caveat:
            'Measurement runs after mount; the CSS stand-in before it is covered by the Tests stories.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      <div className='grid gap-6' style={{ width: 375 }}>
        <Breadcrumb data-testid='full'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='band' data-testid='short'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={['Home']} current='Contact us' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='band' data-testid='two'>
          <BreadcrumbList>
            <BreadcrumbSteps
              labels={['Home']}
              current='Apply for a recreational fishing fee exemption as a concession holder'
            />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='rail' data-testid='rail'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='soft' data-testid='one'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={[]} current='Home' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb collapse={false} data-testid='off'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div style={{ width: '48rem' }}>
        <Breadcrumb data-testid='wide'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* A shrink-to-fit parent: without w-full, size containment would give
          the nav no width and overflow a collapsed white-on-band trail. */}
      <div className='flex items-center' style={{ width: '48rem' }}>
        <Breadcrumb variant='band' data-testid='flex'>
          <BreadcrumbList>
            <BreadcrumbSteps labels={['Home', 'Services']} current='Apply online' />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = (id: string) => canvasElement.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    const longTrail = [...LONG, LONG_CURRENT]
    // Wait for the first measurement; the CSS stand-in applies until then.
    await waitFor(() => expect(nav('full')).toHaveAttribute('data-measured'))

    // Would wrap: it shortens to the first step, a "…" of the hidden steps,
    // and the parent — still a breadcrumb of real links.
    await expect(nav('full')).toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('full'))).toEqual(['Home', 'Licences and permits'])
    await expect(
      within(nav('full')).getByRole('link', { name: 'Licences and permits' }),
    ).toBeVisible()
    await expect(breadcrumbMoreTrigger(nav('full'))).toHaveAccessibleName('Show 1 more page')
    // The rail collapses like every other look.
    await expect(nav('rail')).toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('rail'))).toEqual(['Home', 'Licences and permits'])
    await expect(breadcrumbMoreTrigger(nav('rail'))).not.toBeNull()
    // When the parent is the first step there is nothing to hide but the
    // current page, so the trail stays whole and wraps.
    await expect(breadcrumbShownItems(nav('two'))).toEqual([
      'Home',
      'Apply for a recreational fishing fee exemption as a concession holder',
    ])

    // Fits on one line: stays whole even at 375px, with no menu.
    await expect(nav('short')).not.toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('short'))).toEqual(['Home', 'Contact us'])
    await expect(breadcrumbMoreTrigger(nav('short'))).toBeNull()

    // Never collapsed: nothing to keep, or collapse turned off.
    await expect(breadcrumbShownItems(nav('one'))).toEqual(['Home'])
    await expect(breadcrumbShownItems(nav('off'))).toEqual(longTrail)

    // Wide enough: the whole trail.
    await expect(nav('wide')).not.toHaveAttribute('data-collapsed')
    await expect(breadcrumbShownItems(nav('wide'))).toEqual(longTrail)
    // In a shrink-to-fit parent the nav still fills the row, so it does not collapse.
    await expect(nav('flex').getBoundingClientRect().width).toBeGreaterThan(700)
    await expect(breadcrumbShownItems(nav('flex'))).toEqual(['Home', 'Services', 'Apply online'])

    // The measuring clone never stays in the document.
    await expect(canvasElement.querySelectorAll('[data-slot="breadcrumb"][inert]')).toHaveLength(0)
  },
}

export const CollapseFollowsWidth: Story = {
  name: 'Collapse follows width',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'One trail in a frame that grows from 375px to 48rem and back.',
          why: 'Collapse is measured against the breadcrumb’s own width and re-measured when it changes.',
          how: 'Resize the frame (or watch the play): collapsed at 375px, whole at 48rem, collapsed again.',
          caveat: 'Measures only when the width changes, so a height-only resize costs nothing.',
        }),
      },
    },
  },
  render: () => (
    <div data-testid='frame' style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSteps labels={LONG} current={LONG_CURRENT} />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector<HTMLElement>('[data-testid="frame"]')!
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
    frame.style.width = '48rem'
    await waitFor(() => expect(nav).not.toHaveAttribute('data-collapsed'))
    frame.style.width = '375px'
    await waitFor(() => expect(nav).toHaveAttribute('data-collapsed'))
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

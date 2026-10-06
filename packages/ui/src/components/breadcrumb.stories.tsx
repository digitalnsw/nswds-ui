/**
 * Breadcrumb — Default, Variants, Band under Header, Variant fallbacks, With
 * dropdown, Ellipsis trigger className and name, Focus ring, Wrapping,
 * Collapse, CssCheck
 *
 * A navigation trail of links ending in the current page. Composed from plain
 * semantic elements (`nav > ol > li`). Four looks (`default`, `rail`, `band`,
 * `soft`) are set on `Breadcrumb` and read by every part.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
import { Header, HeaderBrand } from './header.js'
import { closeOverlay } from './story-helpers.js'

const VARIANTS = ['default', 'rail', 'band', 'soft'] as const

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: { variant: 'default' },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    collapse: { control: 'boolean' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A breadcrumb navigation trail, labelled "Breadcrumb". The final crumb uses BreadcrumbPage to mark the current page with `aria-current="page"`. `variant` sets the look: `default` (underlined links, no chrome), `rail` (hairlines above and below), `band` (solid Blue 01, matching Header `dark`) or `soft` (an ink tint). Below 36rem the trail collapses to a back link to the parent page unless `collapse={false}` (rail never collapses). To open collapsed steps, put a BreadcrumbEllipsis inside a DropdownMenuTrigger and open the menu with `sideOffset={BREADCRUMB_MENU_OFFSET}`.',
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='#services'>Services</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Apply online</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

type Variant = (typeof VARIANTS)[number]

/**
 * The long trail every variant renders below, with two steps collapsed into
 * the ellipsis menu. The menu's rows are underlined like the trail's links,
 * so the same destinations read the same in both places.
 */
function Trail({ variant }: { variant: Variant }) {
  return (
    <Breadcrumb variant={variant}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label='Show 2 more pages'>
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={BREADCRUMB_MENU_OFFSET}>
              <DropdownMenuLinkItem href='#services' className='underline underline-offset-4'>
                Services
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem href='#licences' className='underline underline-offset-4'>
                Licences and permits
              </DropdownMenuLinkItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='#fishing'>Recreational fishing</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Apply for a fee exemption</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/** A link step for each label, then the current page; default separators between. */
function Steps({ labels, current }: { labels: string[]; current?: string }) {
  return (
    <>
      {labels.map((label, i) => (
        <Fragment key={label}>
          {i > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            <BreadcrumbLink href={`#${i}`}>{label}</BreadcrumbLink>
          </BreadcrumbItem>
        </Fragment>
      ))}
      {current && (
        <>
          {labels.length > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            <BreadcrumbPage>{current}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </>
  )
}

/** The rendered text of an element, whitespace collapsed (hidden parts excluded). */
const text = (el: HTMLElement) => el.innerText.replace(/\s+/g, ' ').trim()

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The landmark and its accessible name come from the component, not the
    // consumer — assert both are present.
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')
    await expect(nav).toBeInTheDocument()
    await expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    await expect(nav).toHaveAttribute('data-variant', 'default')

    // The trail must expose real anchors and mark the current page.
    const links = canvasElement.querySelectorAll('[data-slot="breadcrumb"] a[href]')
    await expect(links.length).toBeGreaterThanOrEqual(2)

    const current = canvasElement.querySelector('[data-slot="breadcrumb-page"]')
    await expect(current).toHaveAttribute('aria-current', 'page')
    // The current page is plain text, not a disabled link. axe cannot see the
    // difference, so assert it here — upstream shadcn ships
    // `role='link' aria-disabled='true'` on this span and a re-scaffold would
    // quietly bring it back.
    await expect(current).not.toHaveAttribute('role')
    await expect(current).not.toHaveAttribute('aria-disabled')
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='grid gap-8'>
      {VARIANTS.map((variant) => (
        <Trail key={variant} variant={variant} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const navs = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="breadcrumb"]')]
    await expect(navs.map((nav) => nav.dataset.variant)).toEqual([...VARIANTS])
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
            : text(lead),
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

/** Every variant on a real dark page (story-level theme, not a nested `.dark`). */
export const VariantsDark: Story = {
  ...Variants,
  name: 'Variants (dark)',
  globals: { theme: 'dark' },
}

/**
 * The band sits flush under `Header color="dark"`: both are Blue 01 in light
 * and both deepen to `primary-950` in dark, so neither mode draws a seam
 * across the top of the page (DESIGN.md, Page chrome; Whole-Set Flip).
 */
export const BandUnderHeader: Story = {
  name: 'Band under Header',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <Header color='dark' sticky={false} shadow={false} border={false}>
        <HeaderBrand sitename='Department of Primary Industries' />
      </Header>
      <Breadcrumb variant='band'>
        <BreadcrumbList>
          <Steps labels={['Home', 'Fishing']} current='Apply for a recreational fishing licence' />
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('header')!
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    await expect(getComputedStyle(nav).backgroundColor).toBe(
      getComputedStyle(header).backgroundColor,
    )
  },
}

export const BandUnderHeaderDark: Story = {
  ...BandUnderHeader,
  name: 'Band under Header (dark)',
  globals: { theme: 'dark' },
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
          <Steps labels={['Home']} current='Apply online' />
        </BreadcrumbList>
      </Breadcrumb>
      <Breadcrumb variant={null} data-testid='null'>
        <BreadcrumbList>
          <Steps labels={['Home']} current='Apply online' />
        </BreadcrumbList>
      </Breadcrumb>
      <nav
        aria-label='Breadcrumb from the helper'
        data-variant='band'
        data-testid='helper'
        className={breadcrumbVariants({ variant: 'band' })}
      >
        <BreadcrumbList>
          <Steps labels={['Home']} current='Apply online' />
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
 * The ellipsis opens the collapsed steps. BreadcrumbItem styles any button
 * whose direct child is the ellipsis, so the menu is plain DropdownMenu
 * composition and Breadcrumb imports no menu. The open state is a deeper tint
 * than hover, and the glyph carries a coarse-pointer TouchTarget.
 */
export const WithDropdown: Story = {
  name: 'With dropdown',
  render: (args) => <Trail variant={args.variant ?? 'default'} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    await expect(trigger.getBoundingClientRect().height).toBe(32)
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
        <BreadcrumbItem>
          <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className='h-10'>
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={BREADCRUMB_MENU_OFFSET}>
              <DropdownMenuLinkItem href='#services'>Services</DropdownMenuLinkItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
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
 * Keyboard focus is the system's ring: 2px in the ink, offset 2px onto the
 * page, on the links and the ellipsis trigger alike (DESIGN.md, Buttons and
 * Navigation) — the same cue a keyboard user meets on Link and SideNav.
 */
export const FocusRing: Story = {
  name: 'Focus ring',
  render: (args) => <Trail variant={args.variant ?? 'default'} />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    const home = within(canvasElement).getByRole('link', { name: 'Home' })
    await waitFor(() => expect(home).toHaveFocus())
    const link = getComputedStyle(home)
    await expect(link.outlineStyle).toBe('solid')
    await expect(link.outlineWidth).toBe('2px')
    await expect(link.outlineOffset).toBe('2px')
    // motion-safe:transition-colors animates outline-color too, so the ring
    // reaches the ink a beat after focus lands. Read only; never mutate here.
    await waitFor(() => expect(getComputedStyle(home).outlineColor).toBe(link.color))

    await userEvent.tab()
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    await waitFor(() => expect(trigger).toHaveFocus())
    const button = getComputedStyle(trigger)
    await expect(button.outlineStyle).toBe('solid')
    await expect(button.outlineWidth).toBe('2px')
    await expect(button.outlineOffset).toBe('2px')
  },
}

/**
 * A full trail wrapping at phone width. Each separator is drawn by the item
 * after it, so it always starts its line beside its target instead of
 * stranding at the end of the line above. A label that wraps stays an inline
 * link, so its halo and focus ring follow each line rather than boxing both.
 */
export const Wrapping: Story = {
  name: 'Wrapping',
  render: () => (
    <div style={{ width: 375 }}>
      <Breadcrumb collapse={false}>
        <BreadcrumbList>
          <Steps
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

/** The text of each item still displayed, its lead glyph excluded. */
const shownItems = (nav: HTMLElement) =>
  [...nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"]')]
    .filter((li) => getComputedStyle(li).display !== 'none')
    .map((li) =>
      [...li.children]
        .filter((child) => (child as HTMLElement).dataset.slot !== 'breadcrumb-lead')
        .map((child) => text(child as HTMLElement))
        .join(' '),
    )

/** The display of the back chevron inside the parent step's link. */
const backChevron = (nav: HTMLElement) => {
  const items = nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"]')
  const back = items[items.length - 2]?.querySelector('a > [data-slot="breadcrumb-back"]')
  return back ? getComputedStyle(back).display : 'none'
}

/**
 * Collapse is on by default and applies only when the full trail would wrap:
 * then only the parent shows, as a back link announced "Back to …". A trail
 * that fits stays whole at any width, keeping Home and the current page.
 * Trails it cannot collapse sensibly stay whole too — one item, or an
 * ellipsis in the parent slot — as do the rail and `collapse={false}`.
 */
export const Collapse: Story = {
  name: 'Collapse when it would wrap',
  render: () => (
    <div className='grid gap-8'>
      <div className='grid gap-6' style={{ width: 375 }}>
        <Breadcrumb data-testid='full'>
          <BreadcrumbList>
            <Steps
              labels={['Home', 'Services', 'Licences and permits']}
              current='Apply for a recreational fishing licence'
            />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='band' data-testid='short'>
          <BreadcrumbList>
            <Steps labels={['Home']} current='Contact us' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='band' data-testid='two'>
          <BreadcrumbList>
            <Steps
              labels={['Home']}
              current='Apply for a recreational fishing fee exemption as a concession holder'
            />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='rail' data-testid='rail'>
          <BreadcrumbList>
            <Steps
              labels={['Home', 'Services', 'Licences and permits']}
              current='Apply for a recreational fishing licence'
            />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='soft' data-testid='one'>
          <BreadcrumbList>
            <Steps labels={[]} current='Home' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb variant='soft' data-testid='ellipsis'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger aria-label='Show 1 more page'>
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={BREADCRUMB_MENU_OFFSET}>
                  <DropdownMenuLinkItem href='#services'>Services</DropdownMenuLinkItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Fees and exemptions for concession holders in NSW</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb collapse={false} data-testid='off'>
          <BreadcrumbList>
            <Steps
              labels={['Home', 'Services', 'Licences and permits']}
              current='Apply for a recreational fishing licence'
            />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div style={{ width: '48rem' }}>
        <Breadcrumb data-testid='wide'>
          <BreadcrumbList>
            <Steps
              labels={['Home', 'Services', 'Licences and permits']}
              current='Apply for a recreational fishing licence'
            />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* A shrink-to-fit parent: without w-full, size containment would give
          the nav no width and overflow a collapsed white-on-band trail. */}
      <div className='flex items-center' style={{ width: '48rem' }}>
        <Breadcrumb variant='band' data-testid='flex'>
          <BreadcrumbList>
            <Steps labels={['Home', 'Services']} current='Apply online' />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = (id: string) => canvasElement.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    const longTrail = [
      'Home',
      'Services',
      'Licences and permits',
      'Apply for a recreational fishing licence',
    ]
    // Wait for the first measurement; the CSS fallback applies until then.
    await waitFor(() => expect(nav('full')).toHaveAttribute('data-measured'))

    // Would wrap: only the parent, as a back link whose chevron is inside the
    // link's target and which screen readers hear as "Back to …".
    await expect(nav('full')).toHaveAttribute('data-collapsed')
    await expect(shownItems(nav('full'))).toEqual(['Back to Licences and permits'])
    await expect(backChevron(nav('full'))).toBe('inline-block')
    await expect(
      within(nav('full')).getByRole('link', { name: 'Back to Licences and permits' }),
    ).toBeVisible()
    await expect(shownItems(nav('two'))).toEqual(['Back to Home'])

    // Fits on one line: stays whole even at 375px.
    await expect(nav('short')).not.toHaveAttribute('data-collapsed')
    await expect(shownItems(nav('short'))).toEqual(['Home', 'Contact us'])
    await expect(backChevron(nav('short'))).toBe('none')

    // Never collapsed: the rail, nothing to go back to, a menu in the parent
    // slot, or collapse turned off.
    await expect(nav('rail')).not.toHaveAttribute('data-collapse')
    await expect(shownItems(nav('rail'))).toEqual(longTrail)
    await expect(shownItems(nav('one'))).toEqual(['Home'])
    await expect(shownItems(nav('ellipsis'))).toEqual([
      'Home',
      'More pages',
      'Fees and exemptions for concession holders in NSW',
    ])
    await expect(shownItems(nav('off'))).toEqual(longTrail)
    await expect(backChevron(nav('off'))).toBe('none')

    // Wide enough: the whole trail, no chevron.
    await expect(nav('wide')).not.toHaveAttribute('data-collapsed')
    await expect(shownItems(nav('wide'))).toEqual(longTrail)
    // In a shrink-to-fit parent the nav still fills the row, so it does not collapse.
    await expect(nav('flex').getBoundingClientRect().width).toBeGreaterThan(700)
    await expect(shownItems(nav('flex'))).toEqual(['Home', 'Services', 'Apply online'])

    // The measuring clone never stays in the document.
    await expect(canvasElement.querySelectorAll('[data-slot="breadcrumb"][inert]')).toHaveLength(0)
  },
}

/**
 * Collapse follows the trail's width: the frame below grows from 375px to
 * 48rem and the collapsed trail opens out, then shrinks and collapses again.
 */
export const CollapseFollowsWidth: Story = {
  name: 'Collapse follows width',
  render: () => (
    <div data-testid='frame' style={{ width: 375 }}>
      <Breadcrumb>
        <BreadcrumbList>
          <Steps
            labels={['Home', 'Services', 'Licences and permits']}
            current='Apply for a recreational fishing licence'
          />
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

/**
 * Before the first measurement (server-rendered HTML, or no script) CSS stands
 * in: a nav marked for collapse but not yet measured collapses when narrower
 * than 36rem. Built from the exported parts to pin that unmeasured state.
 */
export const CollapseFallback: Story = {
  name: 'Collapse before measurement',
  render: () => (
    <div style={{ width: 375 }}>
      <nav
        aria-label='Breadcrumb before measurement'
        data-slot='breadcrumb'
        data-variant='default'
        data-collapse=''
        className={`${breadcrumbVariants({ variant: 'default' })} @container/breadcrumb w-full`}
      >
        <BreadcrumbList>
          <Steps labels={['Home', 'Services']} current='Contact us' />
        </BreadcrumbList>
      </nav>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('nav')!
    await expect(shownItems(nav)).toEqual(['Back to Services'])
  },
}

/**
 * On a dark page with no Header above it, the band keeps an edge: a hairline
 * in the ink at 15%, since `primary-950` alone sits ~1.06:1 on the canvas.
 */
export const BandOnDarkPage: Story = {
  name: 'Band on a dark page',
  globals: { theme: 'dark' },
  render: () => (
    <Breadcrumb variant='band'>
      <BreadcrumbList>
        <Steps labels={['Home', 'Fishing']} current='Apply for a recreational fishing licence' />
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')!
    const style = getComputedStyle(nav)
    await expect(style.borderBottomWidth).toBe('1px')
    await expect(style.borderBottomColor).not.toBe('rgba(0, 0, 0, 0)')
    await expect(nav.getBoundingClientRect().height % 4).toBe(0)
  },
}

/**
 * The trail in its place: a band under `Header color="dark"`, above the page
 * heading. The band's content lines up with the Header's brand at every
 * breakpoint, and the trail stays secondary to the H1.
 */
export const InContext: Story = {
  name: 'In context',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <Header color='dark' sticky={false} shadow={false} border={false}>
        <HeaderBrand sitename='Department of Primary Industries' />
      </Header>
      <Breadcrumb variant='band'>
        <BreadcrumbList>
          <Steps labels={['Home', 'Fishing']} current='Apply for a recreational fishing licence' />
        </BreadcrumbList>
      </Breadcrumb>
      <main className='px-4 py-8 sm:px-6 lg:px-12'>
        <h1 className='text-4xl/tight font-bold text-foreground'>
          Apply for a recreational fishing licence
        </h1>
        <p className='mt-4 max-w-prose text-foreground'>
          You need a licence to fish in NSW waters, including from the shore.
        </p>
      </main>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const contentStart = (el: HTMLElement) =>
      el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)
    const headerRow = canvasElement.querySelector<HTMLElement>('header > div')!
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')!
    await expect(Math.abs(contentStart(list) - contentStart(headerRow))).toBeLessThan(1)
    const h1 = canvasElement.querySelector<HTMLElement>('h1')!
    const link = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"] a')!
    await expect(parseFloat(getComputedStyle(h1).fontSize)).toBeGreaterThan(
      parseFloat(getComputedStyle(link).fontSize),
    )
  },
}

export const CssCheck: Story = {
  name: 'CssCheck',
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

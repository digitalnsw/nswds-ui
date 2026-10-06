/**
 * Breadcrumb — Default, Variants, With dropdown, Focus bar, CssCheck
 *
 * A navigation trail of links ending in the current page. Composed from plain
 * semantic elements (`nav > ol > li`); the separator and ellipsis carry their
 * own decorative icons. Four looks (`default`, `rail`, `band`, `soft`) are set
 * on `Breadcrumb` and read by every part.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from './dropdown-menu.js'
import { closeOverlay } from './story-helpers.js'

const VARIANTS = ['default', 'rail', 'band', 'soft'] as const

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: { variant: 'default' },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A breadcrumb navigation trail. The wrapper is a `nav[aria-label="breadcrumb"]`; the final crumb uses BreadcrumbPage to mark the current page with `aria-current="page"`. `variant` sets the look: `default` (underlined links, no chrome), `rail` (hairlines above and below), `band` (solid Blue 01) or `soft` (an ink tint). To open collapsed steps, put a BreadcrumbEllipsis inside a DropdownMenuTrigger with an accessible name.',
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

/** The long trail every variant renders below, with one step collapsed. */
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
            {/* 14px clears the 44px row and the band/rail edge, so the menu
                opens below the trail rather than over it. */}
            <DropdownMenuContent sideOffset={14}>
              <DropdownMenuLinkItem href='#services'>Services</DropdownMenuLinkItem>
              <DropdownMenuLinkItem href='#licences'>Licences and permits</DropdownMenuLinkItem>
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The landmark and its accessible name come from the component, not the
    // consumer — assert both are present.
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')
    await expect(nav).toBeInTheDocument()
    await expect(nav).toHaveAttribute('aria-label', 'breadcrumb')
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
    const navs = canvasElement.querySelectorAll<HTMLElement>('[data-slot="breadcrumb"]')
    await expect([...navs].map((nav) => nav.dataset.variant)).toEqual([...VARIANTS])

    // Links read as links at rest — underlined, not revealed on hover.
    for (const link of canvasElement.querySelectorAll<HTMLElement>('a[href]')) {
      await expect(getComputedStyle(link).textDecorationLine).toBe('underline')
    }

    // The rail swaps the chevron for a slash; the others keep the chevron.
    const [first, rail] = navs
    const visibleGlyph = (nav: HTMLElement) =>
      [...nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-separator"] > *')].find(
        (el) => getComputedStyle(el).display !== 'none',
      )
    await expect(visibleGlyph(first!)?.tagName.toLowerCase()).toBe('svg')
    await expect(visibleGlyph(rail!)?.textContent).toBe('/')

    // The rail ends on a heavier word; the default trail does not.
    const weight = (nav: HTMLElement) =>
      getComputedStyle(nav.querySelector('[data-slot="breadcrumb-page"]')!).fontWeight
    await expect(weight(first!)).toBe('400')
    await expect(weight(rail!)).toBe('600')
  },
}

/** Every variant on a real dark page (story-level theme, not a nested `.dark`). */
export const VariantsDark: Story = {
  ...Variants,
  name: 'Variants (dark)',
  globals: { theme: 'dark' },
  play: undefined,
}

/**
 * The ellipsis opens the collapsed steps. BreadcrumbItem styles any button
 * whose direct child is the ellipsis, so the menu is plain DropdownMenu
 * composition and Breadcrumb imports no menu.
 */
export const WithDropdown: Story = {
  name: 'With dropdown',
  render: (args) => <Trail variant={args.variant ?? 'default'} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    // A 32px target inside a 44px row.
    await expect(trigger.getBoundingClientRect().height).toBe(32)
    await expect(trigger.closest('li')!.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)

    await userEvent.click(trigger)
    const menu = await within(document.body).findByRole('menu')
    await expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['Services', 'Licences and permits'])
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await closeOverlay('dropdown-menu-content')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

/**
 * Keyboard focus is the bar: a 4px underline on an ink tint, with a
 * transparent outline that only paints in forced-colors mode. Hover is the
 * 2px underline alone, so the two never read alike.
 */
export const FocusBar: Story = {
  name: 'Focus bar',
  render: (args) => <Trail variant={args.variant ?? 'default'} />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    const home = within(canvasElement).getByRole('link', { name: 'Home' })
    await waitFor(() => expect(home).toHaveFocus())
    const link = getComputedStyle(home)
    await expect(link.textDecorationThickness).toBe('4px')
    await expect(link.outlineStyle).toBe('solid')
    await expect(link.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    await userEvent.tab()
    const trigger = within(canvasElement).getByRole('button', { name: 'Show 2 more pages' })
    await waitFor(() => expect(trigger).toHaveFocus())
    const button = getComputedStyle(trigger)
    await expect(button.boxShadow).toContain('inset')
    await expect(button.outlineStyle).toBe('solid')
  },
}

/** A link step, a separator after it unless it is the last. */
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

/**
 * `collapse`: when the breadcrumb is narrower than 36rem only the parent shows,
 * as a back link. Trails it cannot collapse sensibly stay whole — one item, or
 * an ellipsis in the parent slot — and a trail without `collapse` is never
 * touched. The trails sit in fixed-width frames because collapse measures the
 * breadcrumb, not the viewport, so both widths are asserted on every run.
 */
export const Collapse: Story = {
  name: 'Collapse when narrow',
  render: () => (
    <div className='grid gap-8'>
      <div className='grid w-[375px] gap-6' data-testid='narrow'>
        <Breadcrumb collapse data-testid='full'>
          <BreadcrumbList>
            <Steps
              labels={['Home', 'Services', 'Licences and permits']}
              current='Apply for a recreational fishing licence'
            />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb collapse variant='band' data-testid='two'>
          <BreadcrumbList>
            <Steps labels={['Home']} current='Contact us' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb collapse variant='rail' data-testid='one'>
          <BreadcrumbList>
            <Steps labels={[]} current='Home' />
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb collapse variant='soft' data-testid='ellipsis'>
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
                <DropdownMenuContent sideOffset={14}>
                  <DropdownMenuLinkItem href='#services'>Services</DropdownMenuLinkItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Fees and exemptions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb data-testid='off'>
          <BreadcrumbList>
            <Steps labels={['Home', 'Services']} current='Apply online' />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='w-[48rem]'>
        <Breadcrumb collapse data-testid='wide'>
          <BreadcrumbList>
            <Steps labels={['Home', 'Services']} current='Apply online' />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = (id: string) => canvasElement.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
    /** The text of each list child still displayed, separators as '|'. */
    const shown = (id: string) =>
      [...nav(id).querySelectorAll<HTMLElement>('[data-slot="breadcrumb-list"] > li')]
        .filter((li) => getComputedStyle(li).display !== 'none')
        .map((li) => (li.dataset.slot === 'breadcrumb-separator' ? '|' : li.textContent))
    /** The masked back chevron on the parent step, or 'none'. */
    const chevron = (id: string) => {
      const items = nav(id).querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"]')
      const parent = items[items.length - 2]
      return parent ? getComputedStyle(parent, '::before').maskImage : 'none'
    }

    // Narrow: only the parent, as a back link.
    await expect(shown('full')).toEqual(['Licences and permits'])
    await expect(chevron('full')).toContain('url(')
    await expect(shown('two')).toEqual(['Home'])
    await expect(chevron('two')).toContain('url(')
    // The parent stays a real link, named by its text alone (the chevron is a
    // pseudo-element, so it adds nothing to the name).
    await expect(
      within(nav('full')).getByRole('link', { name: 'Licences and permits' }),
    ).toBeVisible()

    // Never collapsed: nothing to go back to, a menu in the parent slot, or not opted in.
    await expect(shown('one')).toEqual(['Home'])
    await expect(shown('ellipsis')).toEqual(['Home', '|', '', '|', 'Fees and exemptions'])
    await expect(shown('off')).toEqual(['Home', '|', 'Services', '|', 'Apply online'])
    await expect(chevron('off')).toBe('none')

    // Wide enough: the whole trail, no chevron, even with collapse on.
    await expect(shown('wide')).toEqual(['Home', '|', 'Services', '|', 'Apply online'])
    await expect(chevron('wide')).toBe('none')
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

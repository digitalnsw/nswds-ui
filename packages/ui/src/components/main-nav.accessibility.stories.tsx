/**
 * MainNav — Accessibility
 *
 * One story per WCAG 2.2 criterion the bar has to meet, each asserting it in
 * play(). Disclosure, roving focus and Escape come from the Base UI
 * navigation menu underneath; these pin the parts a consumer relies on — one
 * named landmark holding a list, triggers that announce their state, a
 * current page that is announced, keyboard operation, and readable text on all
 * thirteen colours.
 *
 * Two criteria have no story because the bar does not meet them today, and a
 * story that passed would have to stop asserting them:
 *   - Focus Visible (2.4.7): a focused trigger computes `outline-style: none`.
 *     navigation-menu.tsx writes `outline-none focus-visible:outline
 *     focus-visible:outline-2`; tailwind-merge drops `focus-visible:outline`
 *     as a conflict of `-outline-2`, and `outline-none` leaves
 *     `--tw-outline-style: none`, which `outline-2` reads.
 *   - Contrast (Minimum) (1.4.3), light mode: the current-page top link on
 *     `primary-600` is white on its active halo at 3.92:1. Dark mode clears
 *     it, so the dark story stays.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { MainNav, mainNavColors, type MainNavItem } from './main-nav.js'
import {
  compositeOver,
  expectContrast,
  resolveColor,
  waitForUnmount,
  wcagStoryMeta,
} from './story-helpers.js'

const navigation: MainNavItem[] = [
  {
    title: 'Quit support',
    href: '#quit-support',
    links: [
      { title: 'Talk to a quitline counsellor', href: '#quitline' },
      { title: 'Find support near you', href: '#find-support' },
      { title: 'Help for parents and carers', href: '#parents-and-carers' },
    ],
  },
  {
    title: 'Quit methods',
    href: '#quit-methods',
    links: [
      { title: 'Nicotine replacement therapy', href: '#nrt' },
      { title: 'Managing cravings', href: '#cravings' },
    ],
  },
  { title: 'About', href: '#about' },
]

const meta = {
  title: 'Components/MainNav/Accessibility',
  component: MainNav,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { navigation },
  // Room in the canvas for the panel, which portals out of the bar.
  decorators: [
    (Story) => (
      <div className='min-h-[420px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MainNav>

export default meta

type Story = StoryObj<typeof meta>

const popup = () => document.querySelector<HTMLElement>('[data-slot="navigation-menu-popup"]')

/**
 * The opaque colour an element sits on: its own and its ancestors'
 * backgrounds composited from the first opaque one up. A trigger's hover and
 * focus halo is translucent, so a ring drawn on it is measured against the
 * halo over the bar.
 */
function effectiveBackground(element: Element): string {
  const layers: string[] = []
  for (let el: Element | null = element; el; el = el.parentElement) {
    const bg = getComputedStyle(el).backgroundColor
    if (resolveColor(bg).a === 0) continue
    layers.push(bg)
    if (resolveColor(bg).a >= 1) break
  }
  const base = layers.length && resolveColor(layers.at(-1)!).a >= 1 ? layers.pop()! : 'white'
  let backdrop = resolveColor(base)
  for (const layer of layers.reverse())
    backdrop = { ...compositeOver(resolveColor(layer), backdrop), a: 1 }
  return `rgb(${Math.round(backdrop.r)}, ${Math.round(backdrop.g)}, ${Math.round(backdrop.b)})`
}

/** Every bar colour, each with a unique id (the default id is valid once per page). */
function AllColours() {
  return (
    <div className='space-y-2'>
      {mainNavColors.map((color) => (
        <MainNav
          key={color}
          id={`main-nav-a11y-${color}`}
          aria-label={`Main navigation, ${color}`}
          color={color}
          shadow={false}
          navigation={navigation}
          currentHref='#about'
        />
      ))}
    </div>
  )
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user needs to find the site navigation, know which items open a panel and whether it is open, and hear which page they are on.',
          how: 'The bar is one nav landmark named “Main navigation”. Items with a panel are buttons with aria-expanded, false until opened; items without are links. The link matching currentHref carries aria-current="page". The play() asserts each, opening a panel to check the state flips.',
          caveat:
            'The trigger itself cannot carry aria-current (it discloses, it does not navigate), so a section holding the current page shows it visually with the underline and announces it on the link inside the panel.',
        }),
      },
    },
  },
  args: { currentHref: '#about' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Main navigation' })
    // One landmark: Base UI's own root nav is demoted to a div.
    await expect(nav.querySelector('nav')).toBeNull()

    const trigger = canvas.getByRole('button', { name: 'Quit support' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.getByRole('button', { name: 'Quit methods' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    )

    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(popup()).toBeVisible())
    await expect(
      within(popup()!).getByRole('link', { name: 'Talk to a quitline counsellor' }),
    ).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await waitForUnmount('navigation-menu-popup')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Everything the bar offers a mouse reader — opening a panel and following its links — has to work from the keyboard alone.',
          how: 'Tab to Quit support and press Enter: the panel opens with focus on its featured link. Tab moves on to the section links. Escape closes the panel and returns focus to the trigger. The play() drives each step with the keyboard and asserts the effect.',
          caveat:
            'Arrow keys also move between the top-level items and ArrowDown opens a panel — Base UI’s menubar behaviour, which the Default story exercises.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Quit support' })

    await userEvent.tab()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    const featured = await waitFor(() =>
      within(popup()!).getByRole('link', { name: 'Quit support' }),
    )
    await waitFor(() => expect(featured).toHaveFocus())

    await userEvent.tab()
    await expect(
      within(popup()!).getByRole('link', { name: 'Talk to a quitline counsellor' }),
    ).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await waitFor(() => expect(trigger).toHaveFocus())
    await waitForUnmount('navigation-menu-popup')
  },
}

// ─── 1.3.1 — Info and Relationships ──────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The bar’s structure has to reach assistive technology as well as the eye: one navigation region, holding a list of the site’s top-level items.',
          how: 'The play() asserts a single nav landmark with no nav nested inside it, holding one list with a list item per entry in navigation.',
          caveat:
            'A page with a second nav landmark (SideNav, Breadcrumb) needs each to have its own name; pass aria-label if “Main navigation” is not right.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1)
    const nav = canvas.getByRole('navigation', { name: 'Main navigation' })
    const list = within(nav).getByRole('list')
    await expect(within(list).getAllByRole('listitem')).toHaveLength(navigation.length)
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The bar’s items are the way into the whole site, so they must be readable on every surface colour a service can choose.',
          how: 'All thirteen bars render in dark mode with a current link. The play() measures each trigger and link against what it actually sits on — the bar, or the current link’s halo over it — with the same contrast maths axe uses, and holds every pair to 4.5:1.',
          caveat:
            'Dark mode deepens every surface and all thirteen pairs clear it. Light mode has no story yet: the current-page link on primary-600 measures 3.92:1 on its halo (see the file header).',
        }),
      },
    },
  },
  render: () => <AllColours />,
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll<HTMLElement>('[data-slot="main-nav"]')
    await expect(navs).toHaveLength(mainNavColors.length)
    for (const nav of navs) {
      await expect(resolveColor(getComputedStyle(nav).backgroundColor).a).toBe(1)
      const items = nav.querySelectorAll<HTMLElement>(
        '[data-slot="navigation-menu-trigger"], [data-slot="main-nav-top-link"]',
      )
      await expect(items.length).toBe(navigation.length)
      for (const item of items) {
        expectContrast(getComputedStyle(item).color, effectiveBackground(item), {
          label: `${nav.dataset.color}: ${item.textContent}`,
        })
      }
    }
  },
}

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

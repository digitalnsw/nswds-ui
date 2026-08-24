/**
 * TabNav — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { TabNav, TabNavLink } from './tab-nav.js'

const PAGES = [
  { href: '/colour/themes', title: 'Colour themes' },
  { href: '/colour/brand', title: 'Brand palette' },
  { href: '/colour/aboriginal', title: 'Aboriginal palette' },
  { href: '/colour/semantic', title: 'Semantic palette' },
  { href: '/colour/data-visualisation', title: 'Data visualisation' },
]

const CURRENT = '/colour/brand'

const meta = {
  title: 'Components/Tab Navigation',
  component: TabNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'TabNav is flat horizontal navigation between the pages of one section — the bar under the site header listing a section\'s peer pages. It is deliberately distinct from the other navigation components: MainNav moves between sites/sections, SideNav between pages as a tree, StepNav through a journey, OnThisPage within the page you are on. These are NOT ARIA tabs: the name describes the visual idiom, but the semantics are a nav landmark over links, each marked aria-current="page" when it is the one being read. The current tab comes from the currentHref prop, never from click state, so a fresh page load marks the right tab.',
      },
    },
  },
  args: {
    currentHref: CURRENT,
    border: true,
    'aria-label': 'Colour',
  },
  argTypes: {
    currentHref: {
      control: 'select',
      options: PAGES.map((page) => page.href),
      description:
        "The current page's href. Matched exactly — prefix matching is the caller's job via the link's `current` prop.",
      table: { category: 'Behaviour' },
    },
    border: {
      control: 'boolean',
      description: 'The rule the tabs sit on. Turn it off inside a Card that draws its own edge.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
    children: { table: { disable: true } },
  },
  render: (args) => (
    <TabNav {...args}>
      {PAGES.map((page) => (
        <TabNavLink key={page.href} href={page.href}>
          {page.title}
        </TabNavLink>
      ))}
    </TabNav>
  ),
} satisfies Meta<typeof TabNav>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNav(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="tab-nav"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="tab-nav"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    // A named landmark, or it is indistinguishable from the page's other navs.
    if (nav.getAttribute('aria-label') !== 'Colour') {
      throw new Error(`Expected a named landmark, received "${nav.getAttribute('aria-label')}".`)
    }

    // list-style: none strips list semantics in Safari/VoiceOver.
    const list = nav.querySelector('ul')
    if (list?.getAttribute('role') !== 'list') {
      throw new Error('Expected an explicit role="list" on the list.')
    }

    const links = nav.querySelectorAll('a')
    if (links.length !== PAGES.length) {
      throw new Error(`Expected ${PAGES.length} links, received ${links.length}.`)
    }

    // Exactly one tab is the current page, and it is the one matching
    // currentHref — not the first, and not whichever was last clicked.
    const current = nav.querySelectorAll('[aria-current]')
    if (current.length !== 1) {
      throw new Error(`Expected exactly one current tab, received ${current.length}.`)
    }
    if (current[0]?.getAttribute('aria-current') !== 'page') {
      throw new Error(
        `Expected aria-current="page", received "${current[0]?.getAttribute('aria-current')}".`,
      )
    }
    if (current[0]?.getAttribute('href') !== CURRENT) {
      throw new Error(
        `Expected the current tab to be ${CURRENT}, received "${current[0]?.getAttribute('href')}".`,
      )
    }

    // These are links, not ARIA tabs. role="tab"/"tablist" would promise
    // aria-controls panels that do not exist.
    if (nav.querySelector('[role="tab"], [role="tablist"]')) {
      throw new Error('Expected no ARIA tab roles — TabNav is a nav landmark over links.')
    }
  },
}

export const Variants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className='flex flex-col gap-10'>
      <section>
        <h3 className='mb-3 font-bold text-foreground'>Current page</h3>
        <TabNav currentHref={CURRENT} aria-label='Colour'>
          {PAGES.map((page) => (
            <TabNavLink key={page.href} href={page.href}>
              {page.title}
            </TabNavLink>
          ))}
        </TabNav>
      </section>

      <section>
        <h3 className='mb-3 font-bold text-foreground'>
          No current page — an href the bar does not list
        </h3>
        <TabNav currentHref='/somewhere-else' aria-label='Colour, nothing current'>
          {PAGES.map((page) => (
            <TabNavLink key={page.href} href={page.href}>
              {page.title}
            </TabNavLink>
          ))}
        </TabNav>
      </section>

      <section>
        <h3 className='mb-3 font-bold text-foreground'>
          Explicit <code>current</code> — the escape hatch for prefix matching
        </h3>
        <TabNav aria-label='Colour, explicitly marked'>
          {PAGES.map((page) => (
            <TabNavLink
              key={page.href}
              href={page.href}
              current={page.href === '/colour/data-visualisation'}
            >
              {page.title}
            </TabNavLink>
          ))}
        </TabNav>
      </section>

      <section>
        <h3 className='mb-3 font-bold text-foreground'>Without the rule</h3>
        <TabNav currentHref={CURRENT} border={false} aria-label='Colour, no rule'>
          {PAGES.map((page) => (
            <TabNavLink key={page.href} href={page.href}>
              {page.title}
            </TabNavLink>
          ))}
        </TabNav>
      </section>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  parameters: { layout: 'padded' },
  render: () => (
    <TabNav currentHref={CURRENT} aria-label='Colour'>
      {PAGES.map((page) => (
        <TabNavLink key={page.href} href={page.href}>
          {page.title}
        </TabNavLink>
      ))}
    </TabNav>
  ),
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    // The bar must be its own scroll container, or a long section overflows
    // the page instead of scrolling within the bar.
    const overflowX = getComputedStyle(nav).overflowX
    if (overflowX !== 'auto' && overflowX !== 'scroll') {
      throw new Error(`Expected the bar to scroll, received overflow-x "${overflowX}".`)
    }

    // Current state must not be colour-only: the marker rule carries it too.
    const active = nav.querySelector<HTMLElement>('[data-active]')
    if (!active) {
      throw new Error('Could not find the current tab.')
    }
    if (getComputedStyle(active).borderBottomWidth !== '2px') {
      throw new Error(
        `Expected a 2px marker rule on the current tab, received "${getComputedStyle(active).borderBottomWidth}".`,
      )
    }

    // The idle tabs draw the rule too, in transparent, so becoming current
    // never changes a tab's size and the bar cannot reflow.
    const idle = nav.querySelector<HTMLElement>('a:not([data-active])')
    if (!idle) {
      throw new Error('Could not find an idle tab.')
    }
    if (getComputedStyle(idle).borderBottomWidth !== '2px') {
      throw new Error(
        `Expected idle tabs to reserve the marker rule, received "${getComputedStyle(idle).borderBottomWidth}".`,
      )
    }

    // The marker must sit ON the list's rule, not float a hairline above it.
    // `-mb-px` pulls the 2px marker down over the list's 1px border so the two
    // read as one edge; if that margin is ever dropped or the list's border
    // moves, the tab's bottom stops coinciding with the list's and the bar
    // grows a visible seam. Geometry rather than a screenshot, so it keeps
    // holding in CI.
    const list = nav.querySelector<HTMLElement>('[data-slot="tab-nav-list"]')
    if (!list) {
      throw new Error('Could not find the list.')
    }
    const gap = Math.abs(
      active.getBoundingClientRect().bottom - list.getBoundingClientRect().bottom,
    )
    if (gap > 0.5) {
      throw new Error(
        `Expected the marker rule to sit on the list's rule, but the tab's bottom is ${gap.toFixed(2)}px off it.`,
      )
    }
  },
}

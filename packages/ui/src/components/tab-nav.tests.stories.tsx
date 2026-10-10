/**
 * TabNav — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
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
  title: 'Components/TabNav/Tests',
  component: TabNav,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
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

export const CssCheck: Story = {
  name: 'CSS check',
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

// ─── Type guards ──────────────────────────────────────────────────────────────

/**
 * `TabNavLink` must not accept `as`. `Link` strips `href` from any non-anchor
 * intrinsic, so `as='button'` typechecked and rendered
 * `<button href=null aria-current='page'>` — a control that could not navigate
 * while announcing itself as the current page (WCAG 2.2, 4.1.2).
 *
 * Not a story: it is never exported, so Storybook does not collect it. Stories
 * are covered by `tsc --noEmit`, so if `as` is ever re-added to the props the
 * directive below stops suppressing anything and the build fails on the unused
 * `@ts-expect-error` — which is the point of writing it this way.
 */
function assertAsIsNotAccepted() {
  return (
    <TabNav>
      {/* @ts-expect-error `as` is deliberately omitted from TabNavLinkProps. */}
      <TabNavLink href='/a' as='button'>
        Never rendered
      </TabNavLink>
    </TabNav>
  )
}

void assertAsIsNotAccepted

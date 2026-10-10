/**
 * MainNav — Tests
 *
 * Stories that prove something rather than show something: panel geometry
 * under RTL, the hrefless section lead, every surface's ink, container
 * widths, sticky stacking, overflow, the empty state and the CSS check.
 * Hidden from the sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { DirectionProvider } from './direction.js'
import { Header, HeaderBrand } from './header.js'
import { MainNav, type MainNavItem } from './main-nav.js'
import { Masthead } from './masthead.js'

/**
 * Seven top-level items — a realistic NSW cluster site — which cannot fit a
 * phone-width bar at the trigger's 16px bold type and 16/32px gutters.
 */
const manyItemsNavigation: MainNavItem[] = [
  { title: 'Services', href: '#services', links: [{ title: 'All services', href: '#all' }] },
  { title: 'Housing', href: '#housing' },
  { title: 'Education', href: '#education' },
  { title: 'Transport', href: '#transport' },
  { title: 'Health', href: '#health' },
  { title: 'Business', href: '#business' },
  { title: 'Contact us', href: '#contact' },
]

const meta = {
  title: 'Components/MainNav/Tests',
  component: MainNav,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    navigation: [],
    color: 'white',
    container: 'fluid',
    border: 'none',
    sticky: false,
    shadow: true,
  },
} satisfies Meta<typeof MainNav>

export default meta

type Story = StoryObj<typeof meta>

// ─── Demo content (from nswds-app NavigationMenuMainNavigationDemo) ──────────

const demoNavigation: MainNavItem[] = [
  {
    title: 'Quit support',
    href: '#quit-support',
    links: [
      { title: 'Talk to a quitline counsellor', href: '#quitline' },
      { title: 'Find support near you', href: '#find-support' },
      { title: 'Help for parents and carers', href: '#parents-and-carers' },
      { title: 'Support for Aboriginal people', href: '#aboriginal-support' },
      { title: 'Support for pregnancy', href: '#pregnancy-support' },
      { title: 'Support in different languages', href: '#languages' },
    ],
  },
  {
    title: 'Quit methods',
    href: '#quit-methods',
    links: [
      { title: 'Nicotine replacement therapy', href: '#nrt' },
      { title: 'Prescription medicines', href: '#prescription-medicines' },
      { title: 'Cold turkey', href: '#cold-turkey' },
      { title: 'Vaping and quitting', href: '#vaping' },
      { title: 'Building a quit plan', href: '#quit-plan' },
      { title: 'Managing cravings', href: '#cravings' },
    ],
  },
  {
    title: 'Resources',
    href: '#resources',
    links: [
      { title: 'Fact sheets', href: '#fact-sheets' },
      { title: 'Stories from ex-smokers', href: '#stories' },
      { title: 'Tools and calculators', href: '#tools' },
      { title: 'Support articles', href: '#articles' },
      { title: 'Downloadable posters', href: '#posters' },
      { title: 'Workplace guidance', href: '#workplace' },
    ],
  },
  {
    title: 'About',
    href: '#about',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Poll until `predicate` holds, so popup mount/teleport has time to settle. */
async function waitFor(predicate: () => boolean, message: string, timeout = 2000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (predicate()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 16))
  }
  throw new Error(message)
}

function getNav(canvasElement: HTMLElement) {
  const nav = canvasElement.querySelector<HTMLElement>('[data-slot="main-nav"]')
  if (!nav) {
    throw new Error('Could not find an element with [data-slot="main-nav"].')
  }
  return nav
}

// The popup renders through a portal on document.body, outside canvasElement.
function queryPopup() {
  return document.querySelector<HTMLElement>('[data-slot="navigation-menu-popup"]')
}

// ─── Stories ──────────────────────────────────────────────────────────────────
/**
 * Under RTL the mega panel must still span the nav container edge-to-edge —
 * and it does so through the SAME physical offset used in LTR, which is the
 * point of this story.
 *
 * `alignOffset` does not mirror. Base UI's `useAnchorPositioning` consults the
 * direction only to map a logical `side` (`inline-start`/`inline-end`), and
 * MainNav passes the physical `side='bottom'`, so `align='start'` resolves to
 * the popup's LEFT edge in both directions and the offset is applied on
 * floating-ui's physical cross axis. Adding a mirror was measured putting the
 * panel at left=914 against a container at left=0. See the comment on
 * `alignOffset` in main-nav.tsx.
 *
 * This story therefore pins the geometry rather than a mirroring rule: if a
 * future Base UI release starts mirroring `align`, it fails here instead of in
 * a consumer's RTL site. Asserting the right edge as well as the width is what
 * gives it teeth — a width-only check passes on a panel positioned entirely
 * off-screen.
 *
 * `dir='rtl'` is what drives the CSS (logical properties, the `rtl:` variant).
 * `DirectionProvider` is included because it is the documented full-RTL setup
 * a consumer should write (see direction.stories.tsx), but it is NOT what
 * positions this panel: removing it leaves every assertion here passing,
 * precisely because `side` is physical.
 */
export const RightToLeft: Story = {
  name: 'Right to left',
  args: {
    navigation: demoNavigation,
    currentHref: '#find-support',
  },
  render: (args) => (
    <div dir='rtl' className='min-h-[520px]'>
      <DirectionProvider direction='rtl'>
        <MainNav {...args} />
      </DirectionProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)
    const container = nav.querySelector<HTMLElement>('[data-slot="main-nav-container"]')!

    // Guard the premise: if the container did not actually lay out RTL, the
    // assertions below would pass for the wrong reason.
    if (getComputedStyle(container).direction !== 'rtl') {
      throw new Error('Expected the nav container to compute direction: rtl.')
    }

    const trigger = nav.querySelector<HTMLButtonElement>('[data-slot="navigation-menu-trigger"]')!
    trigger.focus()
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    )
    await waitFor(() => queryPopup() !== null, 'Expected ArrowDown to open the popup in RTL.')

    // Same edge-to-edge contract as Default, checked on BOTH edges so a
    // mirrored-but-wrong offset cannot satisfy it.
    const containerRect = container.getBoundingClientRect()
    const spansContainer = () => {
      const rect = queryPopup()?.getBoundingClientRect()
      return (
        !!rect &&
        Math.abs(rect.width - containerRect.width) < 2 &&
        Math.abs(rect.right - containerRect.right) < 2 &&
        Math.abs(rect.left - containerRect.left) < 2
      )
    }
    try {
      await waitFor(spansContainer, 'timeout', 4000)
    } catch {
      // Report the geometry, not just "it did not match". A misplaced panel is
      // off by a specific number of pixels, and that number says which term of
      // the offset is wrong — the trigger edge, the container edge, or the sign.
      const rect = queryPopup()?.getBoundingClientRect()
      const box = (r?: DOMRect) =>
        r
          ? `left=${r.left.toFixed(1)} right=${r.right.toFixed(1)} width=${r.width.toFixed(1)}`
          : 'absent'
      throw new Error(
        'Expected the RTL panel to span the nav container edge-to-edge.\n' +
          `  container: ${box(containerRect)}\n` +
          `  panel:     ${box(rect)}\n` +
          `  trigger:   ${box(trigger.getBoundingClientRect())}`,
      )
    }

    const escapeTarget =
      document.activeElement instanceof HTMLElement ? document.activeElement : trigger
    escapeTarget.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )
    await waitFor(
      () => !trigger.hasAttribute('data-popup-open') && queryPopup() === null,
      'Expected Escape to close and unmount the menu.',
    )
  },
}

/**
 * A section with `links` but no `href` is a legitimate input (the type marks
 * `href` optional): the panel lead demotes to a plain heading row — same
 * visual weight, but no anchor (a dead `href="#"` link announced as a link
 * would trap readers), no hover halo, and no east arrow. Dev builds warn via
 * `warnIfItemUnlinked`, so the console noise in this story is deliberate.
 */
export const SectionWithoutHref: Story = {
  name: 'Section without href',
  args: {
    navigation: [
      {
        title: 'Support',
        links: [
          { title: 'Talk to a counsellor', href: '#counsellor' },
          { title: 'Find support near you', href: '#find-support' },
        ],
      },
    ],
  },
  render: (args) => (
    <div className='min-h-[520px]'>
      <MainNav {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)
    const trigger = nav.querySelector<HTMLButtonElement>('[data-slot="navigation-menu-trigger"]')
    if (!trigger) {
      throw new Error('Expected the hrefless section to still render a mega-panel trigger.')
    }

    trigger.focus()
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    )
    await waitFor(() => queryPopup() !== null, 'Expected ArrowDown to open the popup.')

    // The lead renders as the non-interactive heading row, visible and titled…
    await waitFor(() => {
      const heading = queryPopup()?.querySelector<HTMLElement>(
        '[data-slot="main-nav-featured-heading"]',
      )
      return (
        !!heading &&
        heading.getBoundingClientRect().height > 0 &&
        !!heading.textContent?.includes('Support')
      )
    }, 'Expected the hrefless section lead to render as a plain heading row.')

    // …never as an anchor, and without the east-arrow affordance (an arrow on
    // a non-link would promise navigation that never happens).
    const popup = queryPopup()!
    if (popup.querySelector('[data-slot="main-nav-featured-link"]')) {
      throw new Error('Expected no featured lead LINK when the section has no href.')
    }
    const heading = popup.querySelector<HTMLElement>('[data-slot="main-nav-featured-heading"]')!
    if (heading.closest('a') || heading.querySelector('a')) {
      throw new Error('Expected the hrefless lead to render outside any anchor.')
    }
    if (heading.querySelector('svg')) {
      throw new Error('Expected the plain heading row to render without the arrow icon.')
    }

    // The section links themselves are unaffected.
    const cells = popup.querySelectorAll('[data-slot="main-nav-section-link"]')
    if (cells.length !== 2) {
      throw new Error(`Expected 2 section links in the panel, got ${cells.length}.`)
    }

    // Close before the after-play axe pass: a mounted popup keeps Base UI's
    // focus-guard sentinels alive, which axe flags as aria-hidden-focus (see
    // the closeMenu helper comment in navigation-menu.stories.tsx). Closed,
    // axe audits the resting state — proving the heading row stays clean.
    const escapeTarget =
      document.activeElement instanceof HTMLElement ? document.activeElement : trigger
    escapeTarget.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )
    await waitFor(
      () => !trigger.hasAttribute('data-popup-open') && queryPopup() === null,
      'Expected Escape to close and unmount the menu.',
    )
  },
}

// Multi-instance stories pass unique ids: the component defaults to
// id="nsw-main-navigation", which is only valid once per page. A
// representative subset of the thirteen surfaces — one per family plus the
// default.
export const Colours: Story = {
  render: () => (
    <div className='space-y-4'>
      <MainNav id='main-nav-white' color='white' navigation={demoNavigation} />
      <MainNav id='main-nav-primary-800' color='primary-800' navigation={demoNavigation} />
      <MainNav id='main-nav-grey-200' color='grey-200' navigation={demoNavigation} />
      <MainNav id='main-nav-accent-600' color='accent-600' navigation={demoNavigation} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll<HTMLElement>('[data-slot="main-nav"]')
    if (navs.length !== 4) {
      throw new Error(`Expected 4 navigation bars, got ${navs.length}.`)
    }

    for (const nav of navs) {
      const color = nav.dataset.color
      const styles = getComputedStyle(nav)

      // Every variant paints a real surface…
      if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
        throw new Error(`Expected the ${color} bar to paint a visible background.`)
      }
      // …and declares the single ink every derived colour resolves from.
      if (styles.getPropertyValue('--main-nav-ink').trim() === '') {
        throw new Error(`Expected the ${color} variant to declare --main-nav-ink.`)
      }

      // Trigger text rides the ink, so it must resolve to a real colour that
      // differs from the surface (a same-colour pair would be invisible).
      const trigger = nav.querySelector<HTMLElement>('[data-slot="navigation-menu-trigger"]')
      if (!trigger) {
        throw new Error(`Expected triggers inside the ${color} bar.`)
      }
      if (getComputedStyle(trigger).color === styles.backgroundColor) {
        throw new Error(`The ${color} bar's trigger text paints its own surface colour.`)
      }
    }
  },
}

export const Containers: Story = {
  render: () => (
    <div className='space-y-4'>
      <MainNav id='main-nav-fluid' container='fluid' color='grey-200' navigation={demoNavigation} />
      <MainNav
        id='main-nav-contained'
        container='contained'
        color='grey-200'
        navigation={demoNavigation}
      />
      <MainNav
        id='main-nav-contained-custom'
        container='contained'
        color='grey-200'
        navigation={demoNavigation}
        style={{ '--main-nav-max-width': '48rem' } as React.CSSProperties}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const containers = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="main-nav-container"]',
    )
    if (containers.length !== 3) {
      throw new Error(`Expected 3 container wrappers, got ${containers.length}.`)
    }
    const [fluid, contained, custom] = containers
    if (fluid!.getBoundingClientRect().width <= contained!.getBoundingClientRect().width - 1) {
      // Only meaningful when the viewport exceeds 75rem, so tolerate equality.
      throw new Error('Expected the fluid container to be at least as wide as the contained one.')
    }
    if (custom!.getBoundingClientRect().width > 48 * 16 + 1) {
      throw new Error('Expected --main-nav-max-width: 48rem to cap the custom container.')
    }
  },
}

/**
 * Page chrome: Masthead + sticky Header + sticky MainNav. The app source
 * measured the header with a `useSelectorHeight` hook inside the nav
 * component; here the consumer owns that concern — this story measures its
 * own header and writes the result into `--main-nav-top`, which is exactly
 * what an app with a fixed-height header can do statically.
 */
function StickyChrome() {
  const headerRef = React.useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    const element = headerRef.current
    if (!element) {
      return
    }
    const measure = () => setHeaderHeight(element.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <Masthead color='dark' />
      <Header ref={headerRef} color='white' sticky>
        <HeaderBrand sitename='Design System' />
      </Header>
      <MainNav
        navigation={demoNavigation}
        currentHref='#find-support'
        color='grey-200'
        sticky
        style={{ '--main-nav-top': `${headerHeight}px` } as React.CSSProperties}
      />
      <main id='content' className='h-[200vh] bg-background p-6 text-foreground'>
        Scroll: the Header pins to the top and the MainNav pins directly below it —
        <code>--main-nav-top</code> carries the measured header height.
      </main>
    </div>
  )
}

export const Sticky: Story = {
  name: 'Sticky page chrome',
  render: () => <StickyChrome />,
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    if (getComputedStyle(nav).position !== 'sticky') {
      throw new Error('Expected the sticky nav to have position: sticky.')
    }

    // The measured header height lands in --main-nav-top, and the computed
    // `top` resolves through it to a real pixel offset.
    await waitFor(() => {
      const top = Number.parseFloat(getComputedStyle(nav).top)
      return Number.isFinite(top) && top > 0
    }, 'Expected --main-nav-top to resolve to the measured header height.')

    const header = canvasElement.querySelector<HTMLElement>('[data-slot="header"]')!
    const top = Number.parseFloat(getComputedStyle(nav).top)
    if (Math.abs(top - header.getBoundingClientRect().height) > 1) {
      throw new Error(
        `Expected the nav's top (${top}px) to equal the header height (${header.getBoundingClientRect().height}px).`,
      )
    }
  },
}

/**
 * More top-level items than fit. The item row is a horizontal scroll
 * container, so an overlong bar pans instead of overflowing its container and
 * pushing a horizontal scrollbar onto the whole page.
 *
 * This is a safety net, not the mobile pattern: items scrolled out of view are
 * close to undiscoverable. Hide the bar below `lg` and render `MobileNav`
 * instead — see the Wrap-Don't-Clip note in DESIGN.md's Navigation section.
 */
export const ManyItems: Story = {
  name: 'Many items (overflow)',
  args: {
    navigation: manyItemsNavigation,
    color: 'primary-800',
  },
  render: (args) => (
    // Deliberately narrower than the bar needs, to force the overflow case.
    <div className='w-96 overflow-hidden'>
      <MainNav {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)
    const list = nav.querySelector<HTMLElement>('[data-slot="navigation-menu-list"]')
    if (!list) {
      throw new Error('Expected the menubar list to render.')
    }

    // The scrollbar-hiding declarations beside it only mean something if an
    // overflow value actually establishes a scroll container.
    const overflowX = getComputedStyle(list).overflowX
    if (overflowX !== 'auto' && overflowX !== 'scroll') {
      throw new Error(
        `Expected the item row to be a horizontal scroll container, got overflow-x: "${overflowX}".`,
      )
    }

    if (list.scrollWidth <= list.clientWidth) {
      throw new Error(
        'Expected this fixture to actually overflow — the story proves nothing otherwise.',
      )
    }

    // It genuinely pans rather than merely reporting an overflow.
    list.scrollLeft = 40
    if (list.scrollLeft === 0) {
      throw new Error('Expected the overflowing item row to scroll horizontally.')
    }
    list.scrollLeft = 0

    // Focus rings must be inset, or the scroll container clips them on the
    // first and last items.
    const trigger = nav.querySelector<HTMLElement>('[data-slot="navigation-menu-trigger"]')
    if (!trigger) {
      throw new Error('Expected at least one trigger.')
    }
    trigger.focus()
    const offset = parseFloat(getComputedStyle(trigger).outlineOffset)
    if (!(offset < 0)) {
      throw new Error(
        `Expected an inset focus ring inside the scroll container, got outline-offset ${offset}px.`,
      )
    }
  },
}

/**
 * Empty navigation data renders a message, not an unexplained coloured strip.
 * Empty is a runtime state — unpublished content, permission filtering, a
 * failed fetch — as distinct from malformed data, which stays a dev-only
 * console warning.
 */
export const Empty: Story = {
  args: {
    navigation: [],
    color: 'primary-800',
  },
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    const empty = nav.querySelector<HTMLElement>('[data-slot="main-nav-empty"]')
    if (!empty) {
      throw new Error('Expected an empty-state message when navigation is empty.')
    }
    if (!empty.textContent?.trim()) {
      throw new Error('Expected the empty state to carry visible text.')
    }

    // No menubar is mounted for a bar that can never open.
    if (nav.querySelector('[data-slot="navigation-menu-list"]')) {
      throw new Error('Expected no menubar list to render for an empty navigation.')
    }

    // The landmark survives, so page structure is unchanged.
    if (nav.tagName !== 'NAV' || !nav.getAttribute('aria-label')) {
      throw new Error('Expected the named nav landmark to render even when empty.')
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
  args: {
    navigation: demoNavigation,
    color: 'primary-800',
    border: 'both',
  },
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the colour variant resolves bg-primary-800
    // to a real colour, declares the single --main-nav-ink token, and the edge
    // rules resolve through the --main-nav-ink → --main-nav-border color-mix
    // chain to a paintable colour.
    const nav = getNav(canvasElement)
    const styles = getComputedStyle(nav)

    if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${styles.backgroundColor}". Is globals.css loaded?`,
      )
    }

    if (styles.getPropertyValue('--main-nav-ink').trim() === '') {
      throw new Error('Expected the colour variant to declare --main-nav-ink.')
    }
    if (styles.getPropertyValue('--main-nav-border').trim() === '') {
      throw new Error('Expected --main-nav-border to mix down from --main-nav-ink.')
    }
    if (styles.borderTopColor === '' || styles.borderTopColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected border="both" to draw an ink-derived top rule, got "${styles.borderTopColor}".`,
      )
    }
  },
}

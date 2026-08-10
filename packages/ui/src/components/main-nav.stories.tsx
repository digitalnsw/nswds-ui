/**
 * MainNav — Default + Colours + Containers + Sticky + CssCheck + Playground
 *
 * The full-width NSW site navigation bar with mega-menu panels: a data-driven
 * consolidation of the nswds-app MainNavigation components, rebuilt on the
 * package's NavigationMenu (Base UI underneath).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Header, HeaderBrand } from './header.js'
import { MainNav, type MainNavItem } from './main-nav.js'
import { Masthead } from './masthead.js'

const meta = {
  title: 'Components/MainNav',
  component: MainNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>MainNav</h1>
            <p className='text-base text-muted-foreground'>
              The site&rsquo;s primary navigation bar. Items with <code>links</code> open mega
              panels — a featured lead link above a bordered grid of section links, spanning the
              nav&rsquo;s full width — and items without them render as plain links styled like the
              triggers. Everything is driven by the <code>navigation</code> data prop; every anchor
              renders through <code>Link</code>, so a framework link injected via{' '}
              <code>LinkProvider</code> is used automatically.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Colours</h2>
            <p className='text-base text-muted-foreground'>
              Thirteen surfaces — the Footer&rsquo;s exact vocabulary and dark-mode deepening, so a
              service themes its whole chrome with one word. Every light pair is WCAG 2.2 AA (eleven
              are AAA) and every dark pair is AAA. Panels always render on the house popover surface
              with the family&rsquo;s accent ink.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Current page</h2>
            <p className='text-base text-muted-foreground'>
              There is no router coupling: pass <code>currentHref</code> and the exact matching link
              announces <code>aria-current=&quot;page&quot;</code> while its top-level item carries
              the underline. Under a sticky <code>Header</code>, set <code>--main-nav-top</code> to
              the header height and pass <code>sticky</code> — see the Sticky story.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Full-width site navigation bar with mega-menu panels, in the Footer&rsquo;s thirteen surface colours. Data-driven; Base UI navigation-menu underneath via the NavigationMenu component.',
      },
    },
  },
  args: {
    navigation: [],
    color: 'white',
    container: 'fluid',
    border: 'none',
    sticky: false,
    shadow: true,
  },
  argTypes: {
    navigation: {
      control: false,
      description:
        'Top-level items. With `links` an item opens a mega panel (its `href` becomes the featured lead link); without them it renders as a plain link.',
      table: { category: 'Content' },
    },
    currentHref: {
      control: 'text',
      description:
        'The current page&rsquo;s href — the matching link gets aria-current="page" and its top-level item the underline. Compare your router&rsquo;s pathname in the consumer.',
      table: { category: 'Behaviour' },
    },
    color: {
      control: 'select',
      options: [
        'white',
        'primary-800',
        'primary-600',
        'primary-400',
        'primary-200',
        'grey-800',
        'grey-600',
        'grey-400',
        'grey-200',
        'accent-800',
        'accent-600',
        'accent-400',
        'accent-200',
      ],
      description:
        'Surface colour — the Footer&rsquo;s thirteen-name vocabulary and dark-mode deepening.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper layout — fluid is full-bleed (nswds-app), contained centres a 1200px column (legacy nsw-container). Panels span the container&rsquo;s width.',
      table: { category: 'Layout' },
    },
    border: {
      control: 'inline-radio',
      options: ['none', 'top', 'bottom', 'both'],
      description: 'Edge rules, drawn from the surface&rsquo;s ink.',
      table: { category: 'Appearance' },
    },
    sticky: {
      control: 'boolean',
      description:
        'Stick to the viewport top. Set --main-nav-top to a sticky header&rsquo;s height to stack below it.',
      table: { category: 'Layout' },
    },
    shadow: {
      control: 'boolean',
      description: 'Drop shadow under the bar.',
      table: { category: 'Appearance' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
    containerClassName: {
      table: { disable: true, category: 'Advanced' },
    },
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

export const Default: Story = {
  args: {
    navigation: demoNavigation,
    currentHref: '#find-support',
  },
  render: (args) => (
    // The spacer leaves room in the canvas for the portalled panel.
    <div className='min-h-[520px]'>
      <MainNav {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    if (nav.tagName !== 'NAV') {
      throw new Error(`Expected MainNav to render a <nav> landmark, got <${nav.tagName}>.`)
    }
    if (nav.getAttribute('aria-label') !== 'Main navigation') {
      throw new Error('Expected the default aria-label "Main navigation".')
    }
    if (nav.id !== 'nsw-main-navigation') {
      throw new Error('Expected the legacy-shell default id "nsw-main-navigation".')
    }
    // One landmark only: Base UI's own root nav is demoted to a div.
    if (nav.querySelector('nav')) {
      throw new Error('Expected no nested <nav> landmark inside MainNav.')
    }

    const triggers = Array.from(
      nav.querySelectorAll<HTMLButtonElement>('[data-slot="navigation-menu-trigger"]'),
    )
    if (triggers.length !== 3) {
      throw new Error(`Expected 3 mega-panel triggers, got ${triggers.length}.`)
    }
    const trigger = triggers[0]!

    // The panel-less "About" item renders as a link, not a trigger.
    const topLink = nav.querySelector<HTMLAnchorElement>('[data-slot="main-nav-top-link"]')
    if (!topLink || !topLink.textContent?.includes('About')) {
      throw new Error(
        'Expected the panel-less item to render as a [data-slot="main-nav-top-link"].',
      )
    }

    // currentHref="#find-support" lives inside "Quit support": its trigger
    // carries the underline attribute, the others don't.
    if (!trigger.hasAttribute('data-current')) {
      throw new Error('Expected the trigger owning currentHref to carry data-current.')
    }
    if (triggers[1]!.hasAttribute('data-current')) {
      throw new Error('Expected only the matching trigger to carry data-current.')
    }

    // Keyboard open: focus the trigger, then ArrowDown (Base UI's open key for
    // a horizontal menubar — handled in React, so a dispatched event works).
    trigger.focus()
    if (document.activeElement !== trigger) {
      throw new Error('Expected the trigger to take keyboard focus.')
    }
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    )
    await waitFor(() => queryPopup() !== null, 'Expected ArrowDown to open the popup.')
    if (trigger.getAttribute('aria-expanded') !== 'true') {
      throw new Error('Expected the open trigger to have aria-expanded="true".')
    }

    // The mega panel teleported into the popup: featured lead link visible.
    await waitFor(() => {
      const featured = queryPopup()?.querySelector<HTMLElement>(
        '[data-slot="main-nav-featured-link"]',
      )
      return (
        !!featured &&
        featured.getBoundingClientRect().height > 0 &&
        !!featured.textContent?.includes('Quit support')
      )
    }, 'Expected the featured lead link to be visible inside the panel.')

    // Panel spans the nav container's full width (measured wrapper +
    // alignOffset). Poll: the popup morphs its width over a 300ms transition.
    const containerRect = nav
      .querySelector('[data-slot="main-nav-container"]')!
      .getBoundingClientRect()
    await waitFor(
      () => {
        const rect = queryPopup()?.getBoundingClientRect()
        return (
          !!rect &&
          Math.abs(rect.width - containerRect.width) < 2 &&
          Math.abs(rect.left - containerRect.left) < 2
        )
      },
      'Expected the panel to span the nav container edge-to-edge.',
      4000,
    )

    // aria-current wiring: the exact matching section link announces itself.
    const activeLink = queryPopup()!.querySelector<HTMLAnchorElement>(
      '[data-slot="main-nav-section-link"][data-active]',
    )
    if (!activeLink) {
      throw new Error('Expected the currentHref section link to carry data-active.')
    }
    if (activeLink.getAttribute('aria-current') !== 'page') {
      throw new Error('Expected the current section link to announce aria-current="page".')
    }
    if (!activeLink.textContent?.includes('Find support near you')) {
      throw new Error(
        `Expected "#find-support" to mark "Find support near you", got "${activeLink.textContent}".`,
      )
    }

    // Six bordered section links in the grid.
    const cells = queryPopup()!.querySelectorAll('[data-slot="main-nav-section-link"]')
    if (cells.length !== 6) {
      throw new Error(`Expected 6 section links in the panel, got ${cells.length}.`)
    }

    // Escape closes. Dispatch from wherever focus landed so the event bubbles
    // through the React tree that owns the dismiss handler.
    const escapeTarget =
      document.activeElement instanceof HTMLElement ? document.activeElement : trigger
    escapeTarget.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )
    // Wait for the popup itself to unmount, not just the trigger state: Base
    // UI keeps the popup (and its focusable focus-guard sentinels) mounted
    // through the exit animation, and the a11y addon's after-play axe pass
    // would flag the guards (aria-hidden-focus) if it ran mid-exit.
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

export const Borders: Story = {
  name: 'Border positions',
  render: () => (
    <div className='space-y-4'>
      <MainNav
        id='main-nav-border-none'
        color='grey-200'
        border='none'
        navigation={demoNavigation}
      />
      <MainNav id='main-nav-border-top' color='grey-200' border='top' navigation={demoNavigation} />
      <MainNav
        id='main-nav-border-bottom'
        color='grey-200'
        border='bottom'
        navigation={demoNavigation}
      />
      <MainNav
        id='main-nav-border-both'
        color='grey-200'
        border='both'
        navigation={demoNavigation}
      />
    </div>
  ),
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

export const CssCheck: Story = {
  name: 'CSS Check',
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

export const Playground: Story = {
  args: {
    navigation: demoNavigation,
    currentHref: '#find-support',
  },
  render: (args) => (
    <div className='min-h-[520px]'>
      <MainNav {...args} />
    </div>
  ),
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

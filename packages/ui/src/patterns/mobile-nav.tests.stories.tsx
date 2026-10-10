/**
 * MobileNav — Tests
 *
 * The behaviour the drawer promises, asserted end to end: it opens from the
 * left, is named by its sr-only title, drills, marks the current page, closes
 * on every route (leaf link, the menu's own close button, a controlled
 * consumer) and returns focus to the trigger. Plus the CSS check proving
 * globals.css loaded.
 *
 * The sheet portals to document.body, so everything inside the drawer is
 * queried from `document`, never from `canvasElement`.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import type { PushMenuItem } from '../components/push-menu.js'

import { Button, ButtonLink } from '../components/button.js'
import { Header, HeaderActions, HeaderBrand } from '../components/header.js'
import { Masthead } from '../components/masthead.js'
import { MobileNav } from './mobile-nav.js'

const navigation: PushMenuItem[] = [
  { id: 'home', title: 'Home', href: '#home' },
  {
    id: 'about',
    title: 'About us',
    links: [
      { id: 'about-overview', title: 'Overview', href: '#about-overview' },
      { id: 'about-people', title: 'Our people', href: '#about-people' },
      {
        id: 'about-structure',
        title: 'Our structure',
        links: [
          { id: 'structure-divisions', title: 'Divisions', href: '#divisions' },
          { id: 'structure-agencies', title: 'Agencies', href: '#agencies' },
        ],
      },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    links: [
      { id: 'services-payments', title: 'Payments', href: '#payments' },
      { id: 'services-licences', title: 'Licences', href: '#licences' },
    ],
  },
  { id: 'contact', title: 'Contact', href: '#contact' },
]

const meta = {
  title: 'Patterns/MobileNav/Tests',
  component: MobileNav,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    navigation,
    title: 'Menu',
    currentHref: '#about-overview',
  },
} satisfies Meta<typeof MobileNav>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Poll until `predicate` holds — sheet and slide transitions need to settle. */
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

function getTrigger(canvasElement: HTMLElement) {
  const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="mobile-nav-trigger"]')
  if (!trigger) {
    throw new Error('Could not find an element with [data-slot="mobile-nav-trigger"].')
  }
  return trigger
}

// The sheet portals to document.body, so everything inside the drawer must be
// queried from `document`, never from `canvasElement`.
function querySheet() {
  return document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Open, drill one level, follow a leaf link: the drawer closes and focus returns. */
export const DrillInAndFollowLink: Story = {
  name: 'Drill in and follow a link',
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)
    if (trigger.getAttribute('aria-label') !== 'Open navigation menu') {
      throw new Error(
        `Expected the trigger to be named "Open navigation menu", got "${trigger.getAttribute('aria-label')}".`,
      )
    }

    // Open the drawer. From here on, query document — the sheet portals to
    // document.body, so it never appears inside canvasElement.
    trigger.click()
    await waitFor(
      () => Boolean(querySheet() && document.querySelector('[data-slot="push-menu"]')),
      'Expected the sheet and the push menu to appear after clicking the trigger.',
    )

    const sheet = querySheet()!
    if (sheet.dataset.side !== 'left') {
      throw new Error(
        `Expected the drawer to open from the left, got side="${sheet.dataset.side}".`,
      )
    }

    // The dialog's accessible name is the sr-only SheetTitle, not PushMenu's
    // visible (per-level, unwired) heading.
    const labelledBy = sheet.getAttribute('aria-labelledby')
    const titleEl = labelledBy ? document.getElementById(labelledBy) : null
    if (!titleEl || !titleEl.textContent?.includes('Menu')) {
      throw new Error('Expected the sheet to be labelled "Menu" via its sr-only SheetTitle.')
    }

    // Drill one level in.
    const branch = document.querySelector<HTMLButtonElement>('[data-item-id="about"]')
    if (!branch) {
      throw new Error('Expected a drill-in button for the "about" item.')
    }
    branch.click()
    await waitFor(() => {
      const heading = document.querySelector('[data-current] [data-slot="push-menu-title"]')
      return heading?.textContent === 'About us'
    }, 'Expected drilling in to reveal a level titled "About us".')

    // currentHref flows through to the menu's leaf links. The matching link
    // is second-level, so it only mounts once its level is drilled into —
    // asserting before the drill would query a link that does not exist yet.
    await waitFor(
      () =>
        Boolean(
          document.querySelector(
            '[data-slot="push-menu-link"][aria-current="page"][href="#about-overview"]',
          ),
        ),
      'Expected the link matching currentHref to carry aria-current="page".',
    )

    // Wait for the slide to settle, then follow the leaf link. The anchor's
    // DEFAULT action must be suppressed first: a real navigation replaces the
    // Vitest tester page's URL and kills its session — the run dies with
    // "Browser connection was closed", not a test failure, and the crash
    // point is invisible. Same hazard side-nav.stories handles by calling
    // preventDefault inside onNavigate; MobileNav wires PushMenu's
    // onItemClick internally (no event exposed), so suppress at the document
    // level for exactly one click. React's own onClick still runs, so the
    // drawer-close behaviour under test is unaffected.
    await waitFor(
      () => !document.querySelector('[data-slot="push-menu"]')?.hasAttribute('data-animating'),
      'Expected the forward slide to settle before following the leaf link.',
    )
    let leaf: HTMLElement | null = null
    await waitFor(() => {
      leaf = document.querySelector<HTMLElement>('[data-current] [data-item-id="about-overview"]')
      return Boolean(leaf)
    }, 'Expected the "about-overview" leaf link on the current level.')
    const suppressNavigation = (event: Event) => event.preventDefault()
    document.addEventListener('click', suppressNavigation, { capture: true })
    try {
      leaf!.click()
    } finally {
      document.removeEventListener('click', suppressNavigation, { capture: true })
    }

    // Choosing a destination closes the drawer (onItemClick → setOpen(false)).
    await waitFor(
      () => querySheet() === null,
      'Expected the sheet to close after clicking a leaf link.',
    )

    // Base UI returns focus to the trigger on close.
    await waitFor(
      () => document.activeElement === trigger,
      'Expected focus to return to the hamburger trigger after the sheet closed.',
    )
  },
}

/** In HeaderActions; closes through the menu's own close button, its only one. */
export const PageChrome: Story = {
  name: 'Page chrome',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className='relative'>
      <Masthead color='dark' />
      <Header color='white' sticky={false}>
        <HeaderBrand sitename='Design System' />
        <HeaderActions>
          <MobileNav {...args} />
        </HeaderActions>
      </Header>
      <main id='content' className='space-y-4 bg-background p-6 text-foreground'>
        <h1 className='text-2xl font-bold'>Page content</h1>
        <p className='max-w-prose text-base text-muted-foreground'>
          The masthead and header stack above the page as usual; the mobile nav sits in the
          header&rsquo;s actions cluster. Opening it slides the navigation drawer over this content
          and locks scrolling behind it until it closes.
        </p>
      </main>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const actions = canvasElement.querySelector('[data-slot="header-actions"]')
    if (!actions) {
      throw new Error('Expected a [data-slot="header-actions"] region in the header.')
    }
    const trigger = getTrigger(canvasElement)
    if (!actions.contains(trigger)) {
      throw new Error('Expected the mobile nav trigger to sit inside HeaderActions.')
    }

    // Open, then close via the menu's own header close button — the drawer's
    // only close affordance (the sheet's built-in one is disabled). Query
    // document from here: the sheet portals to document.body.
    trigger.click()
    await waitFor(
      () => Boolean(querySheet() && document.querySelector('[data-slot="push-menu"]')),
      'Expected the sheet and the push menu to appear after clicking the trigger.',
    )
    if (document.querySelector('[data-slot="sheet-content"] [data-slot="sheet-close"]')) {
      throw new Error(
        "Expected the sheet's built-in close button to be disabled in favour of the menu's own.",
      )
    }

    const close = document.querySelector<HTMLElement>('[data-slot="push-menu-close-button"]')
    if (!close) {
      throw new Error("Expected the push menu's close button to render (onClose is wired).")
    }
    close.click()
    await waitFor(
      () => querySheet() === null,
      "Expected the sheet to close via the menu's close button.",
    )
  },
}

/** Children render in their own region, below the menu, inside the drawer. */
export const WithExtraContent: Story = {
  name: 'With extra content',
  args: {
    children: (
      <ButtonLink href='#sign-in' variant='outline' color='primary' block>
        Sign in
      </ButtonLink>
    ),
  },
  play: async ({ canvasElement }) => {
    getTrigger(canvasElement).click()
    // Query document — the sheet portals to document.body.
    await waitFor(() => querySheet() !== null, 'Expected the sheet to open.')

    const extra = document.querySelector<HTMLElement>('[data-slot="mobile-nav-extra"]')
    if (!extra) {
      throw new Error('Expected children to render in a [data-slot="mobile-nav-extra"] region.')
    }
    if (!extra.querySelector('a[href="#sign-in"]')) {
      throw new Error('Expected the extra content to contain the sign-in link.')
    }
    // The extra region sits below the menu, inside the drawer.
    const menu = document.querySelector('[data-slot="push-menu"]')
    if (!menu || !(menu.compareDocumentPosition(extra) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Expected the extra content to follow the push menu in the drawer.')
    }

    document.querySelector<HTMLElement>('[data-slot="push-menu-close-button"]')?.click()
    await waitFor(() => querySheet() === null, 'Expected the sheet to close again.')
  },
}

/** Controlled open state: an external control drives `open` + `onOpenChange`. */
function ControlledExample() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className='flex flex-col items-center gap-4'>
      <Button variant='outline' color='primary' onClick={() => setOpen(true)}>
        Open navigation from outside
      </Button>
      <p className='text-base text-muted-foreground'>
        Drawer is <span data-testid='controlled-state'>{open ? 'open' : 'closed'}</span>
      </p>
      <MobileNav navigation={navigation} title='Menu' open={open} onOpenChange={setOpen} />
    </div>
  )
}

/** A close from inside the drawer round-trips to the consumer's state. */
export const Controlled: Story = {
  name: 'Controlled',
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const external = [...canvasElement.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Open navigation from outside'),
    )
    if (!external) {
      throw new Error('Expected the external open button to render.')
    }

    // The external control opens the drawer through the `open` prop.
    external.click()
    await waitFor(() => querySheet() !== null, 'Expected the controlled sheet to open.')

    // Closing from inside the drawer must round-trip through onOpenChange —
    // the state readout proves the consumer's state stayed in sync.
    document.querySelector<HTMLElement>('[data-slot="push-menu-close-button"]')?.click()
    await waitFor(
      () => querySheet() === null,
      'Expected the controlled sheet to close via the menu close button.',
    )
    const readout = canvasElement.querySelector('[data-testid="controlled-state"]')
    if (readout?.textContent !== 'closed') {
      throw new Error(
        `Expected onOpenChange to report the close back to the consumer, readout says "${readout?.textContent}".`,
      )
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    getTrigger(canvasElement).click()
    // Query document — the sheet portals to document.body.
    await waitFor(
      () => Boolean(querySheet() && document.querySelector('[data-slot="push-menu"]')),
      'Expected the sheet and the push menu to appear.',
    )

    // Proves globals.css is loaded: the drawer surface (bg-popover on both the
    // sheet and the menu) resolves to a real, non-transparent colour.
    for (const slot of ['sheet-content', 'push-menu']) {
      const el = document.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
      const bg = el ? getComputedStyle(el).backgroundColor : ''
      if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
        throw new Error(
          `Expected [data-slot="${slot}"] to resolve bg-popover to a visible colour, got "${bg}". Is globals.css loaded?`,
        )
      }
    }

    // Leave the canvas closed for the next story.
    document.querySelector<HTMLElement>('[data-slot="push-menu-close-button"]')?.click()
    await waitFor(() => querySheet() === null, 'Expected the sheet to close again.')
  },
}

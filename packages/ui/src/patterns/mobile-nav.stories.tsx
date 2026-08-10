/**
 * MobileNav — Default + PageChrome + WithExtraContent + Controlled + CssCheck
 *
 * A registry block: hamburger trigger opening a left-side sheet that contains
 * the multi-level PushMenu. Copy-and-adapt source, not a published component.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import type { PushMenuItem } from '../components/push-menu.js'

import { Button, ButtonLink } from '../components/button.js'
import { Header, HeaderActions, HeaderBrand } from '../components/header.js'
import { Masthead } from '../components/masthead.js'
import { MobileNav } from './mobile-nav.js'

// ── Sample content — replace with your service's own ────────────────────────
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
  title: 'Patterns/Mobile nav',
  component: MobileNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Mobile nav</h1>
            <p className='text-base text-muted-foreground'>
              A hamburger button that opens a left-side drawer containing the multi-level{' '}
              <code>PushMenu</code>. A registry block composed from published components —{' '}
              <code>Button</code>, <code>Sheet</code> and <code>PushMenu</code> — so Base UI owns
              the focus trap, scroll lock and dismissal. Copy the source and adapt it.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Placement</h2>
            <p className='text-base text-muted-foreground'>
              Drop it inside <code>HeaderActions</code>; the published <code>Header</code> already
              carries the brand lockup at every width, so this block is only the drawer. Hide it at
              desktop widths from the outside (a <code>lg:hidden</code> wrapper) when a service
              swaps to a horizontal nav there. Choosing a destination closes the drawer, and the
              menu&rsquo;s own close button closes the sheet — there is deliberately no second close
              control.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Hamburger trigger opening a left-side sheet with the multi-level PushMenu. A copy-and-adapt registry block composed from Button, Sheet and PushMenu.',
      },
    },
  },
  args: {
    navigation,
    title: 'Menu',
    currentHref: '#about-overview',
  },
  argTypes: {
    navigation: {
      control: false,
      description: 'The menu tree, passed straight to PushMenu. Item ids must be unique.',
      table: { category: 'Content' },
    },
    currentHref: {
      control: 'text',
      description: 'Current pathname — the matching leaf link gets aria-current="page".',
      table: { category: 'Content' },
    },
    title: {
      control: 'text',
      description: 'Names the dialog (sr-only SheetTitle) and heads the menu root level.',
      table: { category: 'Content' },
    },
    open: {
      control: false,
      description: 'Controlled open state. Leave unset for uncontrolled.',
      table: { category: 'State' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { category: 'State' },
    },
    onOpenChange: {
      control: false,
      description: 'Fired on every open/close transition, whatever caused it.',
      table: { category: 'Events' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
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

export const Default: Story = {
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
      <p className='text-sm text-muted-foreground'>
        Drawer is <span data-testid='controlled-state'>{open ? 'open' : 'closed'}</span>
      </p>
      <MobileNav navigation={navigation} title='Menu' open={open} onOpenChange={setOpen} />
    </div>
  )
}

export const Controlled: Story = {
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
  name: 'CSS Check',
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

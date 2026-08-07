/**
 * PushMenu — Default + Options + WithinSheet + CssCheck + Playground
 *
 * Multi-level slide-in-place drill-down menu for mobile navigation. Items with
 * children drill into a new level; leaf items are links. Focus, inertness and
 * announcements move with the level.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { PushMenu, type PushMenuItem } from './push-menu.js'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet.js'

const sampleNavigation: PushMenuItem[] = [
  {
    id: 'services',
    title: 'Services',
    links: [
      {
        id: 'transport',
        title: 'Transport',
        links: [
          { id: 'opal', title: 'Opal cards', href: '/services/transport/opal' },
          { id: 'rego', title: 'Vehicle registration', href: '/services/transport/rego' },
          { id: 'licences', title: 'Driver licences', href: '/services/transport/licences' },
        ],
      },
      {
        id: 'housing',
        title: 'Housing and property',
        links: [
          { id: 'renting', title: 'Renting', href: '/services/housing/renting' },
          { id: 'buying', title: 'Buying and selling', href: '/services/housing/buying' },
        ],
      },
      { id: 'grants', title: 'Grants and funding', href: '/services/grants' },
    ],
  },
  { id: 'about', title: 'About us', href: '/about' },
  { id: 'contact', title: 'Contact', href: '/contact' },
]

const meta = {
  title: 'Components/PushMenu',
  component: PushMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>PushMenu</h1>
            <p className='text-base text-muted-foreground'>
              A multi-level drill-down menu for mobile navigation. Items with children slide a new
              level in from the right; leaf items are links rendered through <code>Link</code>, so
              apps can inject their framework link component with <code>LinkProvider</code>. Compose
              it inside <code>SheetContent side=&quot;left&quot;</code> for the classic mobile
              drawer.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Behaviour</h2>
            <ul className='list-disc space-y-2 pl-6 text-base text-muted-foreground'>
              <li>
                Focus moves with the level: drilling forward focuses the new level&rsquo;s Back
                button, going back returns focus to the item that opened the level just left.
              </li>
              <li>
                Hidden levels carry the <code>inert</code> attribute, so their links are neither
                tabbable nor exposed to assistive tech.
              </li>
              <li>
                A visually-hidden <code>aria-live</code> region announces each level change, and
                leaf links matching <code>currentHref</code> get{' '}
                <code>aria-current=&quot;page&quot;</code>.
              </li>
              <li>
                Slides respect <code>prefers-reduced-motion</code>, and the duration is tunable via
                the <code>durationMs</code> prop, which drives both the{' '}
                <code>--push-menu-duration</code> custom property and the settle timeouts — never
                override the custom property directly.
              </li>
            </ul>
          </section>
        </div>
      ),
      description: {
        component:
          'Multi-level slide-in-place drill-down menu for mobile navigation, with managed focus, inert hidden levels and live-region announcements.',
      },
    },
  },
  args: {
    navigation: sampleNavigation,
    title: 'Menu',
    currentHref: '/about',
    showBreadcrumbs: true,
    // 50ms, not the 300ms default: the plays drive several full slide/settle
    // cycles, and under the Vitest browser pool's parallel-tab load the real
    // duration stacks past the test budget. The transition path is identical
    // at any duration; the Options story separately proves a custom value
    // reaches the CSS var.
    durationMs: 50,
    backLabel: 'Back',
    closeLabel: 'Close menu',
    headingLevel: 2,
  },
  argTypes: {
    navigation: {
      description: 'The menu tree. Item ids must be unique across the whole tree.',
      table: { category: 'Content' },
    },
    currentHref: {
      control: 'text',
      description:
        'The app’s current pathname; matching leaf links get aria-current="page" and the active treatment.',
      table: { category: 'Content' },
    },
    title: {
      control: 'text',
      description: 'Root level title, shown in the header row. Also the default aria-label.',
      table: { category: 'Content' },
    },
    headingLevel: {
      control: 'inline-radio',
      options: [2, 3, 4, 5, 6],
      description: 'Heading level for the per-level titles.',
      table: { category: 'Content' },
    },
    showBreadcrumbs: {
      control: 'boolean',
      description: 'Show the breadcrumb trail under the header on sub-levels.',
      table: { category: 'Appearance' },
    },
    durationMs: {
      control: { type: 'number', min: 0, step: 50 },
      description:
        'Slide duration in ms; drives both the --push-menu-duration custom property and the settle timeouts.',
      table: { category: 'Appearance' },
    },
    backLabel: {
      control: 'text',
      description: 'Label for the Back button on sub-levels.',
      table: { category: 'Content' },
    },
    closeLabel: {
      control: 'text',
      description: 'Accessible label for the close button.',
      table: { category: 'Content' },
    },
    onItemClick: {
      description: 'Fired when a leaf item is activated.',
      table: { category: 'Events' },
    },
    onNavigate: {
      description: 'Fired after a forward/back slide settles on a level.',
      table: { category: 'Events' },
    },
    onClose: {
      description: 'Renders a close button in the header row when provided.',
      table: { category: 'Events' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  // The menu fills its container's height — frame every story the way an app
  // would (a drawer-shaped column on the house popup surface).
  render: (args) => (
    <div className='h-96 w-80 overflow-hidden rounded-lg shadow-md ring-1 ring-foreground/10'>
      <PushMenu {...args} />
    </div>
  ),
} satisfies Meta<typeof PushMenu>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMenu(root: ParentNode) {
  const el = root.querySelector<HTMLElement>('[data-slot="push-menu"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="push-menu"].')
  }
  return el
}

/**
 * Yield to the browser without `setTimeout`: the Vitest browser pool runs
 * story files in parallel tabs, and Chromium throttles background-tab timers
 * to ~1s ticks — a 16ms poll sleep becomes a full second, and this file's
 * slide-driven plays (several polls each, plus the component's own settle
 * timeouts) blow the 15s test budget under load. MessageChannel messages are
 * not throttled, so polls stay responsive in hidden tabs.
 */
function yieldToBrowser() {
  return new Promise<void>((resolve) => {
    const channel = new MessageChannel()
    channel.port1.onmessage = () => resolve()
    channel.port2.postMessage(0)
  })
}

/** Poll until `predicate` holds, so slide-driven state has time to settle. */
async function waitFor(predicate: () => boolean, message: string, timeout = 2000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (predicate()) {
      return
    }
    await yieldToBrowser()
  }
  throw new Error(message)
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const menu = getMenu(canvasElement)

    if (menu.tagName !== 'NAV') {
      throw new Error(`Expected PushMenu to render a <nav> landmark, got <${menu.tagName}>.`)
    }

    // currentHref marks the matching leaf link as the current page.
    const currentLink = menu.querySelector<HTMLElement>(
      '[data-slot="push-menu-link"][aria-current="page"]',
    )
    if (!currentLink || !currentLink.textContent?.includes('About us')) {
      throw new Error(
        'Expected the link matching currentHref="/about" to carry aria-current="page".',
      )
    }

    // Drill into a branch item.
    const branch = menu.querySelector<HTMLButtonElement>('[data-item-id="services"]')
    if (!branch) {
      throw new Error('Expected a drill-in button for the "services" item.')
    }
    branch.click()

    await waitFor(() => {
      const heading = menu.querySelector('[data-current] [data-slot="push-menu-title"]')
      return heading?.textContent === 'Services'
    }, 'Expected drilling in to reveal a level titled "Services".')

    // The live region appends the level number below the root, so navigating
    // between identically-titled levels still changes the announced text.
    const liveRegion = menu.querySelector<HTMLElement>('[data-slot="push-menu-live-region"]')
    if (liveRegion?.textContent !== 'Services, level 2') {
      throw new Error(
        `Expected the live region to announce "Services, level 2", got "${liveRegion?.textContent}".`,
      )
    }

    // Focus lands on the new level's Back button.
    await waitFor(
      () => document.activeElement?.getAttribute('data-slot') === 'push-menu-back-button',
      `Expected focus to move to the Back button after drilling in, got "${document.activeElement?.tagName}".`,
    )

    // The level left behind is inert — its links must not be reachable.
    const rootLevel = menu.querySelector<HTMLElement>('[data-level-id="level-root"]')
    if (!rootLevel) {
      throw new Error('Expected the root level to stay mounted behind the new one.')
    }
    if (!rootLevel.hasAttribute('inert')) {
      throw new Error('Expected the non-current root level to carry the inert attribute.')
    }

    // Wait for the forward slide to settle first — navigateBack drops clicks
    // while data-animating is present (by design), and a programmatic .click()
    // is not stopped by the pointer-events-none guard.
    await waitFor(
      () => !menu.hasAttribute('data-animating'),
      'Expected the forward slide to settle before navigating back.',
    )

    // Go back: the drill-in item that opened the level regains focus.
    ;(document.activeElement as HTMLElement).click()
    await waitFor(
      () => menu.querySelectorAll('[data-slot="push-menu-level"]').length === 1,
      'Expected the sub-level to be removed after navigating back.',
    )
    await waitFor(
      () => document.activeElement?.getAttribute('data-item-id') === 'services',
      `Expected focus to return to the "services" item after going back, got "${document.activeElement?.getAttribute('data-item-id')}".`,
    )
    if (rootLevel.hasAttribute('inert')) {
      throw new Error('Expected the root level to shed inert once it is current again.')
    }

    // Back at the root the live region drops the level suffix. Read into a
    // fresh binding: TS still carries the "Services, level 2" narrowing from
    // the earlier assertion across the awaits (property narrowing is only
    // invalidated by assignments it can see, not by intervening calls).
    const settledAnnouncement: string | null = liveRegion.textContent
    if (settledAnnouncement !== 'Menu') {
      throw new Error(
        `Expected the live region to announce the bare root title "Menu", got "${settledAnnouncement}".`,
      )
    }
  },
}

export const Options: Story = {
  name: 'Options',
  render: () => (
    <div className='flex flex-wrap justify-center gap-6'>
      <div className='h-96 w-72 overflow-hidden rounded-lg shadow-md ring-1 ring-foreground/10'>
        <PushMenu navigation={sampleNavigation} title='Default' currentHref='/about' />
      </div>
      <div className='h-96 w-72 overflow-hidden rounded-lg shadow-md ring-1 ring-foreground/10'>
        <PushMenu
          navigation={sampleNavigation}
          title='No breadcrumbs'
          showBreadcrumbs={false}
          durationMs={150}
          backLabel='Go back'
        />
      </div>
      <div className='h-96 w-72 overflow-hidden rounded-lg shadow-md ring-1 ring-foreground/10'>
        <PushMenu
          navigation={sampleNavigation}
          title='With close button'
          headingLevel={3}
          onClose={() => {}}
          closeLabel='Dismiss navigation'
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const menus = canvasElement.querySelectorAll<HTMLElement>('[data-slot="push-menu"]')
    if (menus.length !== 3) {
      throw new Error(`Expected 3 menus, got ${menus.length}.`)
    }

    const [withCurrent, noBreadcrumbs, withClose] = menus

    // Active treatment only where currentHref matches.
    if (!withCurrent!.querySelector('[aria-current="page"]')) {
      throw new Error('Expected the first menu to mark its current page link.')
    }

    // Close button renders only when onClose is provided, and closeLabel
    // replaces the default aria-label.
    const close = withClose!.querySelector<HTMLElement>('[data-slot="push-menu-close-button"]')
    if (!close) {
      throw new Error('Expected the third menu to render a close button.')
    }
    if (close.getAttribute('aria-label') !== 'Dismiss navigation') {
      throw new Error(
        `Expected closeLabel to set the close button's aria-label, got "${close.getAttribute('aria-label')}".`,
      )
    }
    if (withCurrent!.querySelector('[data-slot="push-menu-close-button"]')) {
      throw new Error('Expected no close button without an onClose handler.')
    }

    // headingLevel lands the level title at the requested outline depth.
    if (!withClose!.querySelector('h3[data-slot="push-menu-title"]')) {
      throw new Error('Expected headingLevel={3} to render the level title as an <h3>.')
    }

    // durationMs drives the custom property the slide transition reads.
    const duration = getComputedStyle(noBreadcrumbs!).getPropertyValue('--push-menu-duration')
    if (duration.trim() !== '150ms') {
      throw new Error(`Expected durationMs={150} to set --push-menu-duration, got "${duration}".`)
    }

    // Drill in: the Back button always renders on sub-levels (it is the only
    // route back) and carries the custom backLabel; the trail stays hidden.
    noBreadcrumbs!.querySelector<HTMLButtonElement>('[data-item-id="services"]')!.click()
    await waitFor(
      () =>
        noBreadcrumbs!.querySelector('[data-current] [data-slot="push-menu-back-button"]') !== null,
      'Expected the sub-level to render a Back button.',
    )
    const back = noBreadcrumbs!.querySelector<HTMLElement>(
      '[data-current] [data-slot="push-menu-back-button"]',
    )
    if (!back!.textContent?.includes('Go back')) {
      throw new Error(`Expected backLabel to set the Back button text, got "${back!.textContent}".`)
    }
    if (noBreadcrumbs!.querySelector('[data-slot="push-menu-breadcrumb"]')) {
      throw new Error('Expected showBreadcrumbs={false} to hide the breadcrumb trail.')
    }
  },
}

/**
 * The intended composition: PushMenu filling a left-side Sheet, with the
 * menu's own close button closing the drawer.
 */
function PushMenuSheetDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'>
        Open navigation
      </SheetTrigger>
      <SheetContent side='left' showCloseButton={false} className='p-0'>
        <SheetTitle className='sr-only'>Site navigation</SheetTitle>
        <PushMenu
          navigation={sampleNavigation}
          currentHref='/about'
          onClose={() => setOpen(false)}
          className='h-full'
        />
      </SheetContent>
    </Sheet>
  )
}

export const WithinSheet: Story = {
  name: 'Within a Sheet',
  render: () => <PushMenuSheetDemo />,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sheet-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="sheet-trigger"].')
    }
    trigger.click()

    // The sheet portals to the body — query the document, not the canvas.
    await waitFor(
      () => document.querySelector('[data-slot="sheet-content"] [data-slot="push-menu"]') !== null,
      'Expected the PushMenu to render inside the opened Sheet.',
    )

    // The menu's close button closes the drawer.
    const close = document.querySelector<HTMLElement>('[data-slot="push-menu-close-button"]')
    if (!close) {
      throw new Error('Expected the in-sheet menu to render a close button.')
    }
    close.click()
    await waitFor(
      () => document.querySelector('[data-slot="push-menu"]') === null,
      'Expected the Sheet (and the menu) to close via the menu close button.',
    )
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  // Own render, deliberately NOT spreading the meta args: the shared args set
  // durationMs 50 to keep the interactive plays fast, and this story's whole
  // point is asserting the component's own 300ms DEFAULT reaches the CSS var.
  render: () => (
    <div className='h-96 w-80 overflow-hidden rounded-lg shadow-md ring-1 ring-foreground/10'>
      <PushMenu navigation={sampleNavigation} title='Menu' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the house popup surface resolves
    // bg-popover to a real, non-transparent colour. The duration custom
    // property is set inline from the durationMs default (300).
    const menu = getMenu(canvasElement)
    const styles = getComputedStyle(menu)

    if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-popover to resolve to a visible colour, got "${styles.backgroundColor}". Is globals.css loaded?`,
      )
    }

    const duration = styles.getPropertyValue('--push-menu-duration').trim()
    if (duration !== '300ms') {
      throw new Error(`Expected --push-menu-duration to default to 300ms, got "${duration}".`)
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

/**
 * PushMenu — Tests
 *
 * Stories that prove something rather than show something: every option
 * reaching the DOM, focus staying in the menu inside a Sheet, long labels
 * wrapping, the empty state, Escape stepping back, and the CSS check. Hidden
 * from the sidebar; run in the Vitest suite and Chromatic.
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

/**
 * Real NSW service names, chosen because they exceed the ~25-character budget
 * a `w-3/4` drawer has on a 375px viewport — the case that used to clip.
 */
const longLabelNavigation: PushMenuItem[] = [
  {
    id: 'wwcc',
    title: 'Working with children check renewal and verification',
    href: '/services/working-with-children-check',
  },
  {
    id: 'bdm',
    title: 'Births, deaths and marriages certificate applications',
    links: [
      {
        id: 'birth',
        title: 'Apply for a commemorative birth certificate',
        href: '/services/bdm/birth',
      },
      {
        id: 'death',
        title: 'Register a death and obtain a certificate',
        href: '/services/bdm/death',
      },
    ],
  },
  { id: 'short', title: 'Contact', href: '/contact' },
]

const meta = {
  title: 'Components/PushMenu/Tests',
  component: PushMenu,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
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
      <SheetTrigger className='rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground'>
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
    const menu = document.querySelector<HTMLElement>('[data-slot="push-menu"]')!

    // Drill in and back INSIDE the dialog, and assert focus ends on the item
    // that opened the level. Regression test: focus used to be restored at
    // the level POP, while the focused Back button was being removed — Base
    // UI's dialog focus containment would then re-grab focus to the sheet
    // popup a frame later, silently overriding the restoration. Moving the
    // restoration to the back-slide START (revealed level un-inerted in the
    // same commit) keeps focus inside the menu the whole way.
    const branch = document.querySelector<HTMLButtonElement>('[data-item-id="services"]')
    if (!branch) {
      throw new Error('Expected the "services" drill-in button inside the sheet.')
    }
    branch.click()
    await waitFor(
      () => document.activeElement?.getAttribute('data-slot') === 'push-menu-back-button',
      'Expected focus on the Back button after drilling inside the sheet.',
    )
    await waitFor(
      () => !menu.hasAttribute('data-animating'),
      'Expected the forward slide to settle before navigating back.',
    )
    ;(document.activeElement as HTMLElement).click()
    await waitFor(
      () => menu.querySelectorAll('[data-slot="push-menu-level"]').length === 1,
      'Expected the sub-level to be removed after navigating back inside the sheet.',
    )
    // Poll rather than assert once: the old bug stole focus one frame AFTER
    // restoration, so a single immediate check would pass against it.
    await waitFor(
      () => document.activeElement?.getAttribute('data-item-id') === 'services',
      `Expected focus to stay on the "services" item after going back inside the sheet, got "${document.activeElement?.getAttribute('data-slot') ?? document.activeElement?.tagName}".`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (document.activeElement?.getAttribute('data-item-id') !== 'services') {
      throw new Error(
        `Expected focus to REMAIN on the "services" item (the dialog stole it), got "${document.activeElement?.getAttribute('data-slot') ?? document.activeElement?.tagName}".`,
      )
    }

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

/**
 * Long labels wrap instead of clipping. Real NSW service names run past the
 * ~25-character budget a drawer has on a small phone, and a clipped label is
 * unrecoverable on a touch device where there is no hover to reveal a title.
 */
export const LongLabels: Story = {
  args: {
    navigation: longLabelNavigation,
    title: 'Births, deaths, marriages and relationships',
    currentHref: '/services/working-with-children-check',
  },
  play: async ({ canvasElement }) => {
    const menu = getMenu(canvasElement)

    const row = menu.querySelector<HTMLElement>('[data-item-id="wwcc"]')
    if (!row) {
      throw new Error('Expected a row for the "wwcc" item.')
    }

    const label = row.querySelector<HTMLElement>('span')
    if (!label) {
      throw new Error('Expected the row label span.')
    }
    if (label.classList.contains('truncate')) {
      throw new Error("Row labels must wrap, not truncate — see the Wrap-Don't-Clip Rule.")
    }

    // The proof that it really wrapped: the label box is taller than one line.
    // scrollWidth <= clientWidth additionally proves nothing is clipped
    // horizontally, which is what a stray `truncate` would produce.
    const lineHeight = parseFloat(getComputedStyle(label).lineHeight)
    if (!(label.getBoundingClientRect().height > lineHeight * 1.5)) {
      throw new Error(
        `Expected the long label to wrap to more than one line (height ${label.getBoundingClientRect().height}, line-height ${lineHeight}).`,
      )
    }
    if (label.scrollWidth > label.clientWidth + 1) {
      throw new Error('Expected the wrapped label to be fully visible, not horizontally clipped.')
    }

    // The row grows with its label rather than clipping it, and still clears
    // the 44px floor.
    if (row.getBoundingClientRect().height < 44) {
      throw new Error(
        `Expected the row to hold the 44px floor, got ${row.getBoundingClientRect().height}px.`,
      )
    }

    // The level heading is the documented exception: it shares a fixed-height
    // header row, so it still truncates — but must carry the full string in a
    // title attribute so nothing is lost.
    const heading = menu.querySelector<HTMLElement>('[data-slot="push-menu-title"]')
    if (!heading?.classList.contains('truncate')) {
      throw new Error('Expected the level heading to keep its single-line truncation.')
    }
    if (heading.getAttribute('title') !== 'Births, deaths, marriages and relationships') {
      throw new Error('Expected the truncated heading to carry the full title attribute.')
    }
  },
}

/**
 * An empty tree is a runtime state, not a data mistake: unpublished content, a
 * permission-filtered menu, or a failed fetch all produce it. It renders a
 * message rather than a blank panel whose only affordance is the close button.
 */
export const Empty: Story = {
  args: {
    navigation: [],
    title: 'Menu',
    currentHref: undefined,
  },
  play: async ({ canvasElement }) => {
    const menu = getMenu(canvasElement)

    const empty = menu.querySelector<HTMLElement>('[data-slot="push-menu-empty"]')
    if (!empty) {
      throw new Error('Expected an empty-state message when navigation is empty.')
    }
    if (!empty.textContent?.trim()) {
      throw new Error('Expected the empty state to carry visible text.')
    }

    // The landmark and its heading survive, so the drawer is still navigable
    // and still announces itself.
    if (!menu.querySelector('[data-slot="push-menu-title"]')) {
      throw new Error('Expected the level heading to render alongside the empty state.')
    }
  },
}

/**
 * Escape below the root pops one level; Escape at the root is left alone so an
 * enclosing dialog can close as a dialog should.
 */
export const EscapeGoesBack: Story = {
  args: {
    navigation: sampleNavigation,
    title: 'Menu',
  },
  play: async ({ canvasElement }) => {
    const menu = getMenu(canvasElement)

    const branch = menu.querySelector<HTMLButtonElement>('[data-item-id="services"]')
    if (!branch) {
      throw new Error('Expected a drill-in button for the "services" item.')
    }
    branch.click()
    // Order matters: wait for the new level to EXIST before waiting for the
    // slide to settle. Checking `!data-animating` first passes instantly
    // against the pre-flush DOM — React has not committed the attribute yet —
    // and the rest of the play then runs mid-slide, where the menu
    // deliberately drops navigation and this story would fail for the wrong
    // reason.
    await waitFor(
      () => menu.querySelectorAll('[data-slot="push-menu-level"]').length === 2,
      'Expected drilling in to mount a second level.',
    )
    await waitFor(
      () => !menu.hasAttribute('data-animating'),
      'Expected the forward slide to settle.',
    )

    // Dispatched on the focused element so it travels the real capture path
    // the component listens on, and bubbles like a genuine keypress.
    function pressEscape() {
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      })
      ;(document.activeElement ?? menu).dispatchEvent(event)
      return event
    }

    const deepEvent = pressEscape()
    if (!deepEvent.defaultPrevented) {
      throw new Error('Expected Escape below the root level to be handled by the menu.')
    }
    await waitFor(
      () => menu.querySelectorAll('[data-slot="push-menu-level"]').length === 1,
      'Expected Escape to pop one level rather than closing the whole menu.',
    )
    await waitFor(() => !menu.hasAttribute('data-animating'), 'Expected the back slide to settle.')

    // At the root the key is left alone, so a Sheet wrapping this can still
    // dismiss on Escape.
    const rootEvent = pressEscape()
    if (rootEvent.defaultPrevented) {
      throw new Error(
        'Expected Escape at the root level to pass through so an enclosing dialog can close.',
      )
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
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

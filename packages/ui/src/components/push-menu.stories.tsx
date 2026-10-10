/**
 * PushMenu — the drill-down drawer menu for small screens.
 *
 *   Components/PushMenu        → this file: Docs, Default, Playground and one
 *                                story per docs section
 *   Components/PushMenu/Tests  → push-menu.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { IconMenu } from '../icons/menu.js'
import { Button } from './button.js'
import { generatePushMenuBreadcrumb, PushMenu, type PushMenuItem } from './push-menu.js'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// ─── Content ──────────────────────────────────────────────────────────────────

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

/** Level trails for the breadcrumb helper, from short to long enough to elide. */
const trails: ReadonlyArray<readonly string[]> = [
  ['Menu', 'Services', 'Transport'],
  ['Menu', 'Services', 'Transport', 'Driver licences', 'Renew a licence'],
]

/** A drawer-sized column: the menu fills its container's height. */
function DrawerFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-96 w-72 overflow-hidden rounded-md ring-1 ring-foreground/10'>{children}</div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function DrillingDownSection() {
  return (
    <ExampleSection
      title='Drilling down'
      description={
        <>
          An item with <code>links</code> slides its level in from the right; an item with an{' '}
          <code>href</code> is a link. Focus moves with the level — to the Back button going in, to
          the item that opened it coming out — and Escape below the top level steps back one level.
          Every <code>id</code> must be unique across the whole tree. The slide takes{' '}
          <code>durationMs</code> (300 by default) and honours reduced motion.
        </>
      }
    >
      <Example
        code={`const navigation: PushMenuItem[] = [
  {
    id: 'services',
    title: 'Services',
    links: [{ id: 'grants', title: 'Grants and funding', href: '/services/grants' }],
  },
  { id: 'contact', title: 'Contact', href: '/contact' },
]

<PushMenu navigation={navigation} title="Menu" />`}
      >
        <DrawerFrame>
          <PushMenu navigation={sampleNavigation} title='Menu' />
        </DrawerFrame>
      </Example>
    </ExampleSection>
  )
}

function CurrentPageSection() {
  return (
    <ExampleSection
      title='Current page'
      description={
        <>
          Pass the router&apos;s pathname as <code>currentHref</code>. The matching link announces{' '}
          <code>aria-current=&quot;page&quot;</code> and takes a left border with a light tint of
          the ink.
        </>
      }
    >
      <Example code={`<PushMenu navigation={navigation} currentHref={pathname} />`}>
        <DrawerFrame>
          <PushMenu navigation={sampleNavigation} title='Menu' currentHref='/about' />
        </DrawerFrame>
      </Example>
    </ExampleSection>
  )
}

function CloseButtonSection() {
  return (
    <ExampleSection
      title='Close button'
      description={
        <>
          Pass <code>onClose</code> to put a close button in the header row, on every level. Its
          name defaults to &ldquo;Close menu&rdquo;; set <code>closeLabel</code> to change it, and{' '}
          <code>backLabel</code> for the Back button.
        </>
      }
    >
      <Example code={`<PushMenu navigation={navigation} onClose={() => setOpen(false)} />`}>
        <ExampleCell label='without onClose'>
          <DrawerFrame>
            <PushMenu navigation={sampleNavigation} title='Menu' />
          </DrawerFrame>
        </ExampleCell>
        <ExampleCell label='onClose'>
          <DrawerFrame>
            <PushMenu navigation={sampleNavigation} title='Menu' onClose={() => {}} />
          </DrawerFrame>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function BreadcrumbTrailSection() {
  return (
    <ExampleSection
      title='Breadcrumb trail'
      description={
        <>
          Below the top level, a trail of the levels above sits under the header — choose Services
          to see it. It is decoration, hidden from assistive technology, because the heading and a
          live region already announce each level; turn it off with{' '}
          <code>showBreadcrumbs={'{false}'}</code>. To show the same trail somewhere else, such as a
          Sheet header, <code>generatePushMenuBreadcrumb</code> builds it from the level titles,
          eliding the middle once it passes <code>maxLength</code> (50 by default).
        </>
      }
    >
      <Example code={`<PushMenu navigation={navigation} showBreadcrumbs={false} />`}>
        <ExampleCell label='showBreadcrumbs (default)'>
          <DrawerFrame>
            <PushMenu navigation={sampleNavigation} title='Menu' />
          </DrawerFrame>
        </ExampleCell>
        <ExampleCell label='showBreadcrumbs={false}'>
          <DrawerFrame>
            <PushMenu navigation={sampleNavigation} title='Menu' showBreadcrumbs={false} />
          </DrawerFrame>
        </ExampleCell>
      </Example>
      <Example
        layout='stack'
        code={`generatePushMenuBreadcrumb([{ title: 'Menu' }, { title: 'Services' }, { title: 'Transport' }])
// 'Menu › Services › Transport'`}
      >
        {trails.map((titles) => (
          <ExampleCell key={titles.join('/')} label={`${titles.length} levels`}>
            <code>{generatePushMenuBreadcrumb(titles.map((title) => ({ title })))}</code>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function SheetScene() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant='outline' leadingVisual={IconMenu} />}>
        Menu
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

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          The menu fills a left Sheet, and its own close button closes the drawer — so turn off the
          Sheet&apos;s. The MobileNav block is this composition, ready to use; compose it yourself
          only when you need more control.
        </>
      }
    >
      <Example
        code={`<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger render={<Button variant="outline" leadingVisual={IconMenu} />}>
    Menu
  </SheetTrigger>
  <SheetContent side="left" showCloseButton={false} className="p-0">
    <SheetTitle className="sr-only">Site navigation</SheetTitle>
    <PushMenu navigation={navigation} onClose={() => setOpen(false)} className="h-full" />
  </SheetContent>
</Sheet>`}
      >
        <SheetScene />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function PushMenuDocs() {
  return (
    <DocsPage
      title='PushMenu'
      npm={['PushMenu', 'generatePushMenuBreadcrumb']}
      registry='push-menu'
      summary={
        <>
          A drill-down menu for small screens: each level slides in over the last, with a Back
          button to return, so a deep site tree fits a narrow drawer. Links render through{' '}
          <code>Link</code>, so a framework link set on <code>LinkProvider</code> is used
          automatically.
        </>
      }
    >
      <DocsUsage
        use={[
          'Site navigation on a phone, inside a left Sheet.',
          'A tree too deep for a mega panel’s single level.',
          'Building your own drawer when the MobileNav block does not fit.',
        ]}
        avoid={[
          'Most mobile navigation — use the MobileNav block, which composes this for you.',
          'The top-level navigation on wide screens — use MainNav.',
          'Moving around within a section beside the content — use SideNav.',
        ]}
      />
      <DrillingDownSection />
      <CurrentPageSection />
      <CloseButtonSection />
      <BreadcrumbTrailSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/PushMenu',
  component: PushMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: PushMenuDocs },
  },
  args: {
    navigation: sampleNavigation,
    title: 'Menu',
    currentHref: '/about',
    showBreadcrumbs: true,
    backLabel: 'Back',
    closeLabel: 'Close menu',
    headingLevel: 2,
  },
  argTypes: {
    navigation: {
      description: 'The menu tree. Item ids must be unique across the whole tree.',
      table: { category: 'Content' },
    },
    title: {
      control: 'text',
      description: 'Root level title, shown in the header row. Also the default aria-label.',
      table: { category: 'Content' },
    },
    backLabel: {
      control: 'text',
      description: 'Label for the Back button on sub-levels.',
      table: { category: 'Content' },
    },
    emptyMessage: {
      control: 'text',
      description:
        'Shown in place of the rows when a level has no items. Defaults to "No navigation items available."; `null` renders an empty level.',
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
        'Slide duration in ms (default 300); drives both the --push-menu-duration custom property and the settle timeouts.',
      table: { category: 'Appearance' },
    },
    currentHref: {
      control: 'text',
      description:
        'The app’s current pathname; matching leaf links get `aria-current="page"` and the active treatment.',
      table: { category: 'Behavior' },
    },
    escapeGoesBack: {
      control: 'boolean',
      description:
        'Below the root level, Escape pops one level instead of closing an enclosing dialog. Defaults to true.',
      table: { category: 'Behavior' },
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
    closeLabel: {
      control: 'text',
      description: 'Accessible label for the close button.',
      table: { category: 'Accessibility' },
    },
    headingLevel: {
      control: 'inline-radio',
      options: [2, 3, 4, 5, 6],
      description: 'Heading level for the per-level titles.',
      table: { category: 'Accessibility' },
    },
    submenuLabel: {
      control: 'text',
      description:
        'Visually hidden suffix on rows that drill into a submenu, so they do not sound like links. Defaults to "submenu".',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
  // The menu fills its container's height and slides levels sideways, so the
  // canvas stories sit in a drawer-shaped column.
  render: (args) => (
    <DrawerFrame>
      <PushMenu {...args} />
    </DrawerFrame>
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
  // 50ms, not the 300ms default: the play drives two full slide/settle
  // cycles, and under the Vitest browser pool's parallel-tab load the real
  // duration stacks past the test budget. The transition path is identical at
  // any duration.
  args: { durationMs: 50 },
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

export const Playground: Story = {}

export const DrillingDown: Story = {
  name: 'Drilling down',
  render: () => <DrillingDownSection />,
}

export const CurrentPage: Story = { name: 'Current page', render: () => <CurrentPageSection /> }

export const CloseButton: Story = { name: 'Close button', render: () => <CloseButtonSection /> }

export const BreadcrumbTrail: Story = {
  name: 'Breadcrumb trail',
  render: () => <BreadcrumbTrailSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

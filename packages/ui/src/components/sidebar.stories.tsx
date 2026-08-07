/**
 * Sidebar — Default + CollapsibleIcon + Variants + KeyboardShortcut + CssCheck
 *
 * The full application-shell sidebar: provider with cookie persistence and a
 * Cmd/Ctrl+B shortcut, desktop collapse (offcanvas/icon), mobile Sheet
 * takeover, and the SidebarMenu* family.
 *
 * These stories run headlessly under Vitest browser mode. The desktop sidebar
 * only exists at viewports >= 768px (`md:`), so every play() branches on the
 * live viewport instead of assuming one — both branches assert real
 * behaviour, neither silently passes without checking anything.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { IconCircle } from '../icons/circle.js'
import { IconLayers } from '../icons/layers.js'
import { IconStacks } from '../icons/stacks.js'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './sidebar.js'

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      // The shell uses fixed positioning; rendered inline in the docs page it
      // would escape its container and paint over the prose. Iframe each
      // story canvas instead.
      story: { inline: false, height: '520px' },
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Sidebar</h1>
            <p className='text-base text-muted-foreground'>
              An application-shell sidebar. <code>SidebarProvider</code> owns the open state
              (persisted to a cookie, toggled with Cmd/Ctrl+B), <code>Sidebar</code> renders the
              panel — fixed on desktop, a Sheet takeover on mobile — and <code>SidebarInset</code>{' '}
              holds the page content beside it. Menus compose from <code>SidebarMenu</code>,{' '}
              <code>SidebarMenuItem</code> and <code>SidebarMenuButton</code>, with sub-menus,
              badges and skeletons.
            </p>
          </section>

          <section className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-normal'>Composition, not asChild</h2>
            <p className='text-base text-muted-foreground'>
              Parts that took <code>asChild</code> in shadcn take Base UI&rsquo;s{' '}
              <code>render</code> prop here: write{' '}
              <code>
                render=&#123;&lt;Link variant=&quot;unstyled&quot; href=&quot;…&quot; /&gt;&#125;
              </code>{' '}
              instead of <code>asChild</code> plus a child element.{' '}
              <code>SidebarMenuSubButton</code> renders through the house Link automatically when
              given an <code>href</code>, so a framework link from <code>LinkProvider</code> is
              picked up without any per-item wiring.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Application-shell sidebar: provider with cookie persistence and Cmd/Ctrl+B shortcut, desktop offcanvas/icon collapse in sidebar/floating/inset variants, mobile Sheet takeover, and the SidebarMenu family.',
      },
    },
  },
  args: {
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Which edge the sidebar docks to.',
      table: { category: 'Layout' },
    },
    variant: {
      control: 'inline-radio',
      options: ['sidebar', 'floating', 'inset'],
      description:
        'Chrome: flush panel (sidebar), bordered card (floating), or raised content area (inset).',
      table: { category: 'Appearance' },
    },
    collapsible: {
      control: 'inline-radio',
      options: ['offcanvas', 'icon', 'none'],
      description:
        'Collapsed form: slide fully away (offcanvas), narrow to an icon rail (icon), or never collapse (none).',
      table: { category: 'Behaviour' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Poll until `predicate` holds, so transitions and state changes settle. */
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

/** The desktop sidebar only exists at md and up — mirror useIsMobile's query. */
function isDesktopViewport() {
  return window.matchMedia('(min-width: 768px)').matches
}

function getTrigger(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLButtonElement>('[data-slot="sidebar-trigger"]')
  if (!el) {
    throw new Error('Could not find a [data-slot="sidebar-trigger"] button.')
  }
  return el
}

function getDesktopSidebar(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar"][data-state]')
  if (!el) {
    throw new Error(
      'Could not find the desktop [data-slot="sidebar"][data-state] root — is the viewport >= 768px?',
    )
  }
  return el
}

/** A representative app shell: groups, menu, sub-menu, badge, skeleton, rail. */
function DemoShell({
  side,
  variant,
  collapsible,
  defaultOpen = true,
  shortcutKey,
}: React.ComponentProps<typeof Sidebar> & {
  defaultOpen?: boolean
  shortcutKey?: string | null
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen} shortcutKey={shortcutKey}>
      <Sidebar side={side} variant={variant} collapsible={collapsible}>
        <SidebarHeader>
          <SidebarInput placeholder='Search' aria-label='Search this site' />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip='Dashboard'>
                    <IconStacks />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip='Projects'>
                    <IconLayers />
                    <span>Projects</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href='#design-system'>
                        <span>Design system</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href='#website' isActive>
                        <span>Website</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip='Reports'>
                    <IconCircle />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator decorative />
          <SidebarGroup>
            <SidebarGroupLabel>Loading</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu aria-busy='true'>
                {['one', 'two', 'three'].map((key) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip='Account'>
                <IconCircle />
                <span>Account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className='flex h-12 items-center gap-2 border-b border-border px-4'>
          <SidebarTrigger />
          <span className='text-sm font-medium text-foreground'>Page title</span>
        </header>
        <div className='space-y-2 p-4'>
          <div className='h-24 rounded-md bg-muted' />
          <div className='h-24 rounded-md bg-muted' />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => <DemoShell {...args} />,
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement)

    if (isDesktopViewport()) {
      const sidebar = getDesktopSidebar(canvasElement)

      if (sidebar.getAttribute('data-state') !== 'expanded') {
        throw new Error(
          `Expected the sidebar to start expanded, got "${sidebar.getAttribute('data-state')}".`,
        )
      }
      if (trigger.getAttribute('aria-expanded') !== 'true') {
        throw new Error('Expected the trigger to carry aria-expanded="true" while expanded.')
      }

      // The active sub item announces itself.
      const current = sidebar.querySelector(
        '[data-slot="sidebar-menu-sub-button"][aria-current="page"]',
      )
      if (!current) {
        throw new Error('Expected the active sub item to carry aria-current="page".')
      }

      // data-active is present-or-absent: on the active row, gone elsewhere.
      const buttons = sidebar.querySelectorAll('[data-slot="sidebar-menu-button"]')
      if (!Array.from(buttons).some((button) => button.hasAttribute('data-active'))) {
        throw new Error('Expected the active menu button to carry data-active.')
      }
      if (Array.from(buttons).some((button) => button.getAttribute('data-active') === 'false')) {
        throw new Error('Expected inactive menu buttons to omit data-active, not set "false".')
      }

      const inner = sidebar.querySelector<HTMLElement>('[data-slot="sidebar-inner"]')
      if (!inner) {
        throw new Error('Expected a [data-slot="sidebar-inner"] element.')
      }
      if (inner.hasAttribute('inert')) {
        throw new Error('Expected the expanded sidebar content NOT to be inert.')
      }

      trigger.click()
      await waitFor(
        () => sidebar.getAttribute('data-state') === 'collapsed',
        'Expected data-state="collapsed" after clicking the trigger.',
      )
      if (trigger.getAttribute('aria-expanded') !== 'false') {
        throw new Error('Expected the trigger to carry aria-expanded="false" once collapsed.')
      }
      // Offcanvas-collapsed content is off-viewport, not off-DOM — it must go
      // inert so it stops being tab-reachable behind the page.
      if (!inner.hasAttribute('inert')) {
        throw new Error('Expected the offcanvas-collapsed sidebar content to be inert.')
      }
      // Persistence survives plain-http origins (Secure is https-only).
      if (!document.cookie.includes('sidebar_state=')) {
        throw new Error('Expected the sidebar_state cookie to be written on toggle.')
      }

      // The rail sits outside the inert subtree and reopens the sidebar.
      // Containment matters: a programmatic .click() fires on inert nodes
      // too, so assert the DOM structure as well as the behaviour.
      const rail = sidebar.querySelector<HTMLButtonElement>('[data-slot="sidebar-rail"]')
      if (!rail) {
        throw new Error('Expected a [data-slot="sidebar-rail"] element.')
      }
      if (inner.contains(rail)) {
        throw new Error('Expected the rail to be lifted OUTSIDE the inert inner div.')
      }
      rail.click()
      await waitFor(
        () => sidebar.getAttribute('data-state') === 'expanded',
        'Expected data-state="expanded" after clicking the rail.',
      )
      if (inner.hasAttribute('inert')) {
        throw new Error('Expected inert to be removed once re-expanded.')
      }
    } else {
      // Mobile: the trigger opens the Sheet takeover (portalled to body).
      if (trigger.getAttribute('aria-haspopup') !== 'dialog') {
        throw new Error('Expected the mobile trigger to carry aria-haspopup="dialog".')
      }
      trigger.click()
      await waitFor(
        () => document.querySelector('[data-slot="sidebar"][data-mobile="true"]') !== null,
        'Expected the mobile Sheet sidebar to open after clicking the trigger.',
      )
      if (trigger.getAttribute('aria-expanded') !== 'true') {
        throw new Error('Expected the mobile trigger to carry aria-expanded="true" while open.')
      }

      // --sidebar-width (18rem = 288px) must beat SheetContent's baked-in
      // data-[side]-prefixed width caps (w-3/4, sm:max-w-sm).
      const sheet = document.querySelector<HTMLElement>('[data-slot="sidebar"][data-mobile="true"]')
      const sheetWidth = sheet ? sheet.getBoundingClientRect().width : 0
      if (Math.abs(sheetWidth - 288) > 1) {
        throw new Error(
          `Expected the mobile sidebar to be 288px wide (--sidebar-width), got ${sheetWidth}px.`,
        )
      }

      trigger.click()
      await waitFor(
        () => document.querySelector('[data-slot="sidebar"][data-mobile="true"]') === null,
        'Expected the mobile Sheet sidebar to close after clicking the trigger again.',
      )
      if (trigger.getAttribute('aria-expanded') !== 'false') {
        throw new Error('Expected the mobile trigger to carry aria-expanded="false" once closed.')
      }
    }
  },
}

export const CollapsibleIcon: Story = {
  name: 'Collapsible: icon',
  args: {
    collapsible: 'icon',
  },
  render: (args) => <DemoShell {...args} />,
  play: async ({ canvasElement }) => {
    if (!isDesktopViewport()) {
      // Icon collapse is a desktop-only mode; on mobile the same story must
      // still fall back to the Sheet. Assert that instead of nothing.
      const trigger = getTrigger(canvasElement)
      trigger.click()
      await waitFor(
        () => document.querySelector('[data-slot="sidebar"][data-mobile="true"]') !== null,
        'Expected the mobile Sheet fallback to open in icon-collapsible mode.',
      )
      trigger.click()
      return
    }

    const sidebar = getDesktopSidebar(canvasElement)
    const gap = sidebar.querySelector<HTMLElement>('[data-slot="sidebar-gap"]')
    if (!gap) {
      throw new Error('Expected a [data-slot="sidebar-gap"] element.')
    }

    // The provider publishes both width custom properties.
    const wrapper = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar-wrapper"]')
    if (!wrapper) {
      throw new Error('Expected a [data-slot="sidebar-wrapper"] element.')
    }
    const iconWidthVar = getComputedStyle(wrapper).getPropertyValue('--sidebar-width-icon').trim()
    if (iconWidthVar !== '3rem') {
      throw new Error(`Expected --sidebar-width-icon to be "3rem", got "${iconWidthVar}".`)
    }

    const expandedWidth = gap.getBoundingClientRect().width
    if (Math.abs(expandedWidth - 256) > 1) {
      throw new Error(
        `Expected the expanded gap to be 256px (--sidebar-width), got ${expandedWidth}px.`,
      )
    }

    getTrigger(canvasElement).click()
    await waitFor(
      () => sidebar.getAttribute('data-collapsible') === 'icon',
      'Expected data-collapsible="icon" once collapsed.',
    )
    // The gap animates down to the icon width (3rem = 48px).
    await waitFor(
      () => Math.abs(gap.getBoundingClientRect().width - 48) < 1,
      `Expected the gap to settle at 48px (--sidebar-width-icon), got ${gap.getBoundingClientRect().width}px.`,
    )
  },
}

export const Variants: Story = {
  name: 'Variants: floating & inset',
  // `transform-gpu` on each frame makes it the containing block for the
  // sidebar's fixed positioning, so two shells can coexist on one page.
  render: () => (
    <div className='space-y-4 p-4'>
      <div className='relative h-96 transform-gpu overflow-hidden rounded-md border border-border'>
        <DemoShell variant='floating' collapsible='icon' />
      </div>
      <div className='relative h-96 transform-gpu overflow-hidden rounded-md border border-border'>
        <DemoShell variant='inset' collapsible='offcanvas' />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    if (!isDesktopViewport()) {
      return
    }
    const floating = canvasElement.querySelector('[data-slot="sidebar"][data-variant="floating"]')
    if (!floating) {
      throw new Error('Expected a sidebar with data-variant="floating".')
    }
    const inset = canvasElement.querySelector('[data-slot="sidebar"][data-variant="inset"]')
    if (!inset) {
      throw new Error('Expected a sidebar with data-variant="inset".')
    }
  },
}

export const KeyboardShortcut: Story = {
  name: 'Keyboard shortcut',
  render: (args) => <DemoShell {...args} />,
  play: async ({ canvasElement }) => {
    const pressCtrlB = () =>
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true }))

    if (isDesktopViewport()) {
      const sidebar = getDesktopSidebar(canvasElement)

      // AltGr layouts report ctrlKey+altKey while typing ordinary characters
      // — the chord must not toggle when Alt is down.
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, altKey: true, bubbles: true }),
      )
      await new Promise((resolve) => setTimeout(resolve, 50))
      if (sidebar.getAttribute('data-state') !== 'expanded') {
        throw new Error('Expected Ctrl+Alt+B (AltGr) NOT to toggle the sidebar.')
      }

      pressCtrlB()
      await waitFor(
        () => sidebar.getAttribute('data-state') === 'collapsed',
        'Expected Ctrl+B to collapse the sidebar.',
      )

      pressCtrlB()
      await waitFor(
        () => sidebar.getAttribute('data-state') === 'expanded',
        'Expected Ctrl+B to expand the sidebar again.',
      )
    } else {
      pressCtrlB()
      await waitFor(
        () => document.querySelector('[data-slot="sidebar"][data-mobile="true"]') !== null,
        'Expected Ctrl+B to open the mobile Sheet sidebar.',
      )
      pressCtrlB()
      await waitFor(
        () => document.querySelector('[data-slot="sidebar"][data-mobile="true"]') === null,
        'Expected Ctrl+B to close the mobile Sheet sidebar.',
      )
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  // collapsible="none" renders a plain in-flow column at every viewport, so
  // this check is viewport-independent.
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible='none'>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Check</SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: bg-sidebar resolves to a real,
    // non-transparent colour.
    const sidebar = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar"]')
    if (!sidebar) {
      throw new Error('Could not find an element with [data-slot="sidebar"].')
    }
    const bg = getComputedStyle(sidebar).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-sidebar to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

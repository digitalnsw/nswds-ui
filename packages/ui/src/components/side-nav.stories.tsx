/**
 * SideNav — left-rail navigation within a section of a site.
 *
 *   Components/SideNav        → this file: Docs, Default, Playground and one
 *                               story per docs section
 *   Components/SideNav/Tests  → side-nav.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { IconMenu } from '../icons/menu.js'
import { Button } from './button.js'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet.js'
import { SideNav, type SideNavItem } from './side-nav.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// ─── Content ──────────────────────────────────────────────────────────────────

/**
 * Docs-style tree: a flat top-level link, a section with a two-then-three
 * level branch, and a flat section — every shape the component renders.
 */
const docsNav: SideNavItem[] = [
  // A top-level item WITHOUT links renders as a plain rail link.
  { title: 'Overview', href: '/docs' },
  {
    title: 'Getting started',
    links: [
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Theming', href: '/docs/theming' },
      {
        // Nested branch → collapsible.
        title: 'Components',
        links: [
          { title: 'Button', href: '/docs/components/button' },
          { title: 'Header', href: '/docs/components/header' },
          {
            // Third level.
            title: 'Navigation',
            links: [
              { title: 'Side nav', href: '/docs/components/side-nav' },
              { title: 'Breadcrumbs', href: '/docs/components/breadcrumbs' },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Guides',
    links: [
      { title: 'Accessibility', href: '/docs/guides/accessibility' },
      { title: 'Releases', href: '/docs/guides/releases' },
    ],
  },
]

/** A rail's realistic width beside page content. */
const railClassName = 'w-64'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function SectionsAndBranchesSection() {
  return (
    <ExampleSection
      title='Sections and branches'
      description={
        <>
          The tree&apos;s shape decides what renders. A top-level item with <code>links</code> is a
          heading over an always-visible rail; one without is a plain rail link. Deeper items with{' '}
          <code>links</code> are collapsible branches, nesting to any depth — they are disclosure
          buttons, never links, so give destinations to the leaves.
        </>
      }
    >
      <Example
        code={`const sections: SideNavItem[] = [
  { title: 'Overview', href: '/docs' },
  {
    title: 'Getting started',
    links: [
      { title: 'Installation', href: '/docs/installation' },
      {
        title: 'Components',
        links: [{ title: 'Button', href: '/docs/components/button' }],
      },
    ],
  },
]

<SideNav sections={sections} />`}
      >
        <div className={railClassName}>
          <SideNav
            aria-label='Section navigation, deep nesting'
            sections={docsNav}
            currentHref='/docs/components/side-nav'
          />
        </div>
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
          <code>aria-current=&quot;page&quot;</code> and takes the rail&apos;s marker, and every
          branch on the path to it opens on arrival. Expansion is seeded once, on mount: pass{' '}
          <code>key={'{currentHref}'}</code> to re-open the path after client-side navigation.
        </>
      }
    >
      <Example code={`<SideNav sections={sections} currentHref={pathname} />`}>
        <ExampleCell label='a top-level link'>
          <div className={railClassName}>
            <SideNav aria-label='Current: top-level link' sections={docsNav} currentHref='/docs' />
          </div>
        </ExampleCell>
        <ExampleCell label='a link in a section'>
          <div className={railClassName}>
            <SideNav
              aria-label='Current: section link'
              sections={docsNav}
              currentHref='/docs/guides/releases'
            />
          </div>
        </ExampleCell>
        <ExampleCell label='no currentHref'>
          <div className={railClassName}>
            <SideNav aria-label='No current page' sections={docsNav} />
          </div>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function DrawerScene() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant='outline' leadingVisual={IconMenu} />}>
        In this section
      </SheetTrigger>
      <SheetContent side='left' className='p-6'>
        <SheetTitle>Getting started</SheetTitle>
        <SideNav
          sections={docsNav}
          currentHref='/docs/components/button'
          onNavigate={(event) => {
            // Keeps the specimen on this page; an app lets the link navigate.
            event.preventDefault()
            setOpen(false)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}

function ClosingADrawerSection() {
  return (
    <ExampleSection
      title='Closing a drawer'
      description={
        <>
          On a narrow screen the rail can move into a Sheet. <code>onNavigate</code> fires from
          every leaf link — never from a branch, which only opens and closes — so wire it to close
          the drawer once the reader has picked a page.
        </>
      }
    >
      <Example code={`<SideNav sections={sections} onNavigate={() => setOpen(false)} />`}>
        <DrawerScene />
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          The rail sits beside the page content. Its section headings are <code>h2</code> by
          default; step <code>headingLevel</code> down when the rail sits under another heading.
        </>
      }
    >
      <Example layout='fill'>
        <div className='flex flex-wrap gap-x-12 gap-y-8'>
          <div className={railClassName}>
            <SideNav sections={docsNav} currentHref='/docs/installation' />
          </div>
          <div className='min-w-0 flex-1 basis-80 space-y-4'>
            <p className='text-3xl/tight font-bold'>Installation</p>
            <p className='max-w-prose'>
              Install the design system from npm, or copy individual components into your project
              from the registry. Both channels ship the same NSW Government tokens.
            </p>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function SideNavDocs() {
  return (
    <DocsPage
      title='SideNav'
      npm='SideNav'
      registry='side-nav'
      summary={
        <>
          A left rail for moving around within one section of a site: headed groups of links that
          can nest into collapsible branches, opened onto the page the reader is on. Every link
          renders through <code>Link</code>, so a framework link set on <code>LinkProvider</code> is
          used automatically.
        </>
      }
    >
      <DocsUsage
        use={[
          'A section with more pages than its parent navigation can list — guidance, policy or documentation.',
          'Showing the reader where a page sits in a deep tree.',
          'Wide screens, beside the page content.',
        ]}
        avoid={[
          'The site’s top-level navigation — use MainNav.',
          'Drill-down navigation on a phone — use the MobileNav block, which puts PushMenu in a Sheet.',
          'Jumping between headings on one long page — use OnThisPage.',
        ]}
      />
      <SectionsAndBranchesSection />
      <CurrentPageSection />
      <ClosingADrawerSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: SideNavDocs },
  },
  args: {
    sections: docsNav,
    currentHref: '/docs/components/button',
    headingLevel: 2,
    'aria-label': 'Section navigation',
  },
  argTypes: {
    sections: {
      control: false,
      description:
        'The navigation tree. Top-level items with links are headed sections; deeper items with links are collapsible branches; items with href are leaf links.',
      table: { category: 'Content' },
    },
    emptyMessage: {
      control: 'text',
      description:
        'Shown when `sections` is empty. Defaults to "No navigation items available."; `null` renders nothing.',
      table: { category: 'Content' },
    },
    currentHref: {
      control: 'text',
      description:
        'The current page — sets `aria-current="page"` on the matching link and expands the branches containing it, on mount. Pass your router pathname.',
      table: { category: 'Behavior' },
    },
    onNavigate: {
      control: false,
      description:
        'Fired from every leaf link (never branch triggers) — the mobile-drawer close hook.',
      table: { category: 'Events' },
    },
    headingLevel: {
      control: 'inline-radio',
      options: [2, 3, 4, 5, 6],
      description:
        'Heading level for section titles; step down when the nav nests under another heading.',
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description:
        "Accessible name of the nav landmark, distinguishing it from the page's other navigation.",
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof SideNav>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNav(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="side-nav"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="side-nav"].')
  }
  return el
}

/** Find the branch trigger whose visible label is `title`. */
function getTrigger(scope: HTMLElement, title: string) {
  const trigger = Array.from(
    scope.querySelectorAll<HTMLButtonElement>('[data-slot="side-nav-trigger"]'),
  ).find((el) => el.textContent?.trim() === title)
  if (!trigger) {
    throw new Error(`Could not find a branch trigger labelled "${title}".`)
  }
  return trigger
}

/** Poll until `predicate` holds, so collapsible state has time to settle. */
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

/** The rail at a realistic width; the section stories size their own. */
const railWidth: NonNullable<Story['decorators']> = [
  (Story) => (
    <div className='max-w-xs'>
      <Story />
    </div>
  ),
]

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  decorators: railWidth,
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    if (nav.tagName !== 'NAV') {
      throw new Error(`Expected SideNav to render a <nav> landmark, got <${nav.tagName}>.`)
    }
    if (nav.getAttribute('aria-label') !== 'Section navigation') {
      throw new Error(
        `Expected the landmark to be named "Section navigation", got "${nav.getAttribute('aria-label')}".`,
      )
    }

    // currentHref marks exactly one link as the current page.
    const currentLinks = nav.querySelectorAll<HTMLAnchorElement>('a[aria-current="page"]')
    if (currentLinks.length !== 1) {
      throw new Error(`Expected exactly one aria-current="page" link, got ${currentLinks.length}.`)
    }
    if (currentLinks[0]!.textContent?.trim() !== 'Button') {
      throw new Error(
        `Expected the current link to be "Button", got "${currentLinks[0]!.textContent}".`,
      )
    }

    // The branch containing the current link starts expanded…
    const componentsTrigger = getTrigger(nav, 'Components')
    if (!componentsTrigger.hasAttribute('data-panel-open')) {
      throw new Error(
        'Expected the "Components" branch to start open — it contains the current page.',
      )
    }
    if (componentsTrigger.getAttribute('aria-expanded') !== 'true') {
      throw new Error('Expected the open trigger to carry aria-expanded="true" (from Base UI).')
    }
    // …and the current link actually sits inside its panel.
    const componentsPanel = nav.querySelector<HTMLElement>('[data-slot="side-nav-panel"]')
    if (!componentsPanel || !componentsPanel.contains(currentLinks[0]!)) {
      throw new Error('Expected the current link to sit inside the open branch panel.')
    }

    // A sibling branch off the current path starts collapsed.
    const navigationTrigger = getTrigger(nav, 'Navigation')
    if (navigationTrigger.hasAttribute('data-panel-open')) {
      throw new Error('Expected the "Navigation" branch to start collapsed.')
    }

    // Clicking the collapsed trigger opens it…
    navigationTrigger.click()
    await waitFor(
      () => navigationTrigger.hasAttribute('data-panel-open'),
      'Expected data-panel-open on the "Navigation" trigger after clicking it.',
    )

    // …and its links become reachable and focusable.
    let sideNavLink: HTMLAnchorElement | undefined
    await waitFor(() => {
      sideNavLink = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a')).find(
        (el) => el.textContent?.trim() === 'Side nav',
      )
      return sideNavLink !== undefined
    }, 'Expected the "Side nav" link to appear once its branch opened.')

    sideNavLink!.focus()
    if (document.activeElement !== sideNavLink) {
      throw new Error('Expected a link inside the opened branch to take keyboard focus.')
    }
    sideNavLink!.blur()
  },
}

export const Playground: Story = { decorators: railWidth }

export const SectionsAndBranches: Story = {
  name: 'Sections and branches',
  render: () => <SectionsAndBranchesSection />,
}

export const CurrentPage: Story = { name: 'Current page', render: () => <CurrentPageSection /> }

export const ClosingADrawer: Story = {
  name: 'Closing a drawer',
  render: () => <ClosingADrawerSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

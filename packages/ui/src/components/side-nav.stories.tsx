/**
 * SideNav — Default + NestedDeep + CurrentStates + WithOnNavigate + CssCheck
 *
 * Left-rail section navigation: headed sections of links with arbitrary
 * collapsible nesting, auto-expanded onto the current page.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { SideNav, type SideNavItem } from './side-nav.js'

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

const meta = {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>SideNav</h1>
            <p className='text-base text-muted-foreground'>
              Left-rail section navigation for documentation-style pages. Sections are headed,
              always-visible lists; deeper items with children become collapsible branches. Pass the
              router&rsquo;s pathname as <code>currentHref</code> and the matching link gets{' '}
              <code>aria-current=&quot;page&quot;</code>, the active rail treatment, and every
              branch on the path to it starts expanded.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Anatomy</h2>
            <p className='text-base text-muted-foreground'>
              A top-level item with <code>links</code> renders as a section heading over a rail; one
              without renders as a plain rail link. Branch rows are disclosure buttons (Base UI
              Collapsible), never links — give destinations to leaves.
            </p>
            <div className='max-w-xs'>
              <SideNav sections={docsNav} currentHref='/docs/components/button' />
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Drawer hook</h2>
            <p className='text-base text-muted-foreground'>
              <code>onNavigate</code> fires from every leaf link — wire it to close a mobile drawer
              after the reader picks a destination.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Left-rail section navigation with headed sections, arbitrary collapsible nesting, and auto-expansion of the branch containing the current page.',
      },
    },
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
    currentHref: {
      control: 'text',
      description:
        'The current page — sets aria-current="page" on the matching link and expands the branches containing it. Pass your router pathname.',
      table: { category: 'State' },
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
      table: { category: 'Structure' },
    },
    'aria-label': {
      control: 'text',
      description:
        "Accessible name of the nav landmark, distinguishing it from the page's other navigation.",
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  decorators: [
    (Story) => (
      <div className='max-w-xs'>
        <Story />
      </div>
    ),
  ],
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
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

export const NestedDeep: Story = {
  name: 'Deep nesting',
  args: {
    // Third-level current page: every ancestor branch must open on arrival.
    currentHref: '/docs/components/side-nav',
  },
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    for (const title of ['Components', 'Navigation']) {
      const trigger = getTrigger(nav, title)
      if (!trigger.hasAttribute('data-panel-open')) {
        throw new Error(
          `Expected the "${title}" branch to auto-expand — it is on the path to the current page.`,
        )
      }
    }

    const current = nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
    if (!current || current.textContent?.trim() !== 'Side nav') {
      throw new Error(
        `Expected the third-level "Side nav" link to be current, got "${current?.textContent}".`,
      )
    }
  },
}

export const CurrentStates: Story = {
  name: 'Current page states',
  render: () => (
    <div className='flex flex-wrap gap-12'>
      <div className='w-64'>
        <SideNav aria-label='Current: top-level link' sections={docsNav} currentHref='/docs' />
      </div>
      <div className='w-64'>
        <SideNav
          aria-label='Current: section link'
          sections={docsNav}
          currentHref='/docs/guides/releases'
        />
      </div>
      <div className='w-64'>
        <SideNav aria-label='No current page' sections={docsNav} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll<HTMLElement>('[data-slot="side-nav"]')
    if (navs.length !== 3) {
      throw new Error(`Expected 3 SideNavs, got ${navs.length}.`)
    }
    const [topLevel, section, none] = navs

    const expectations: Array<[HTMLElement, string | null]> = [
      [topLevel!, 'Overview'],
      [section!, 'Releases'],
      [none!, null],
    ]
    for (const [nav, expected] of expectations) {
      const current = nav.querySelectorAll<HTMLAnchorElement>('a[aria-current="page"]')
      if (expected === null) {
        if (current.length !== 0) {
          throw new Error(
            `Expected no aria-current link without currentHref, got ${current.length}.`,
          )
        }
      } else {
        if (current.length !== 1 || current[0]!.textContent?.trim() !== expected) {
          throw new Error(
            `Expected exactly one current link ("${expected}") in "${nav.getAttribute('aria-label')}", got ${current.length} ("${current[0]?.textContent ?? ''}").`,
          )
        }
      }
    }

    // Off-path branches stay collapsed in every instance. "Components" is the
    // observable trigger; the nested "Navigation" branch lives INSIDE its
    // panel, which Base UI unmounts while closed — so for the inner branch,
    // absence from the DOM is the collapsed assertion.
    for (const nav of navs) {
      const components = getTrigger(nav, 'Components')
      if (components.hasAttribute('data-panel-open')) {
        throw new Error('Expected the off-path "Components" branch to stay collapsed.')
      }
      const navigationTrigger = Array.from(
        nav.querySelectorAll<HTMLButtonElement>('[data-slot="side-nav-trigger"]'),
      ).find((el) => el.textContent?.trim() === 'Navigation')
      if (navigationTrigger) {
        throw new Error(
          'Expected the nested "Navigation" trigger to be unmounted while its parent branch is collapsed.',
        )
      }
    }
  },
}

export const WithOnNavigate: Story = {
  name: 'onNavigate (drawer close hook)',
  args: {
    onNavigate: (event) => {
      // In an app this closes the mobile drawer; here it flags the anchor so
      // the play() below can observe the call. preventDefault keeps the story
      // iframe from actually navigating under the test runner.
      event.preventDefault()
      event.currentTarget.setAttribute('data-navigated', 'true')
    },
  },
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    const leaf = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a')).find(
      (el) => el.textContent?.trim() === 'Accessibility',
    )
    if (!leaf) {
      throw new Error('Expected the "Accessibility" leaf link to render.')
    }

    leaf.click()
    await waitFor(
      () => leaf.getAttribute('data-navigated') === 'true',
      'Expected onNavigate to fire when a leaf link is clicked.',
    )

    // Branch triggers are disclosure buttons, not links — they must never
    // reach onNavigate. Clicking one only toggles.
    const trigger = getTrigger(nav, 'Navigation')
    trigger.click()
    await waitFor(
      () => trigger.hasAttribute('data-panel-open'),
      'Expected the trigger click to toggle its branch open.',
    )
    if (trigger.getAttribute('data-navigated') === 'true') {
      throw new Error('Expected branch triggers not to fire onNavigate.')
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the active row resolves bg-primary-800/10
    // to a real colour, the rail resolves border-grey-400, and the heading
    // resolves the @nswds/tokens font-display stack.
    const nav = getNav(canvasElement)

    const current = nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
    if (!current) {
      throw new Error('Expected a current link to assert against.')
    }
    const linkStyles = getComputedStyle(current)
    if (linkStyles.backgroundColor === '' || linkStyles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800/10 on the current link to resolve to a visible colour, got "${linkStyles.backgroundColor}". Is globals.css loaded?`,
      )
    }
    if (linkStyles.borderLeftColor === '' || linkStyles.borderLeftColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected border-primary-800 on the current link to resolve, got "${linkStyles.borderLeftColor}".`,
      )
    }

    const list = nav.querySelector<HTMLElement>('[data-slot="side-nav-list"]')
    if (!list) {
      throw new Error('Expected a [data-slot="side-nav-list"] rail.')
    }
    const listStyles = getComputedStyle(list)
    if (listStyles.borderLeftColor === '' || listStyles.borderLeftColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the rail's border-grey-400 to resolve, got "${listStyles.borderLeftColor}".`,
      )
    }

    const heading = nav.querySelector<HTMLElement>('[data-slot="side-nav-heading"]')
    if (!heading) {
      throw new Error('Expected a [data-slot="side-nav-heading"] section title.')
    }
    if (!getComputedStyle(heading).fontFamily.includes('Public Sans')) {
      throw new Error(
        `Expected the heading's font-display to resolve to the Public Sans stack, got "${getComputedStyle(heading).fontFamily}".`,
      )
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

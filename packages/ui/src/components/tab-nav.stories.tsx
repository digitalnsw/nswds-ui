/**
 * TabNav — Docs, Default, Playground and one story per docs section.
 *
 *   Components/TabNav        → this file
 *   Components/TabNav/Tests  → tab-nav.tests.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'
import { TabNav, TabNavLink } from './tab-nav.js'

const PAGES = [
  { href: '/colour/themes', title: 'Colour themes' },
  { href: '/colour/brand', title: 'Brand palette' },
  { href: '/colour/aboriginal', title: 'Aboriginal palette' },
  { href: '/colour/semantic', title: 'Semantic palette' },
  { href: '/colour/data-visualisation', title: 'Data visualisation' },
]

const CURRENT = '/colour/brand'

/** The peer pages of a licence section — long enough to overflow a narrow bar. */
const LICENCE_PAGES = [
  { href: '/fishing-licence/overview', title: 'Overview' },
  { href: '/fishing-licence/who-needs-one', title: 'Who needs a licence' },
  { href: '/fishing-licence/fees', title: 'Fees and exemptions' },
  { href: '/fishing-licence/apply', title: 'Apply or renew' },
  { href: '/fishing-licence/replace', title: 'Replace a lost licence' },
]

function ColourTabs({
  currentHref = CURRENT,
  border,
  label = 'Colour',
}: {
  currentHref?: string
  border?: boolean
  label?: string
}) {
  return (
    <TabNav currentHref={currentHref} border={border} aria-label={label}>
      {PAGES.map((page) => (
        <TabNavLink key={page.href} href={page.href}>
          {page.title}
        </TabNavLink>
      ))}
    </TabNav>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          By default the tabs sit on a 1px rule that runs the full scrollable width of the bar. Set{' '}
          <code>{'border={false}'}</code> inside a <code>Card</code> or panel that already draws its
          own edge, where a second rule reads as a double border.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<TabNav currentHref={pathname} border={false} aria-label="Colour">…</TabNav>`}
      >
        <ExampleCell label='border (default)'>
          <ColourTabs label='Colour, with rule' />
        </ExampleCell>
        <ExampleCell label='border={false}'>
          <ColourTabs border={false} label='Colour, without rule' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          The tab whose <code>href</code> equals <code>currentHref</code> is the current page: it
          takes the primary ink and a 2px marker rule, and is announced with{' '}
          <code>aria-current=&quot;page&quot;</code>. Matching is exact, so a page the bar does not
          list marks nothing rather than guessing.
        </>
      }
    >
      <Example
        layout='stack'
        code={`<TabNav currentHref="/colour/brand" aria-label="Colour">
  <TabNavLink href="/colour/themes">Colour themes</TabNavLink>
  <TabNavLink href="/colour/brand">Brand palette</TabNavLink>
</TabNav>`}
      >
        <ExampleCell label='currentHref matches a tab'>
          <ColourTabs label='Colour, current page' />
        </ExampleCell>
        <ExampleCell label='currentHref matches no tab'>
          <ColourTabs currentHref='/colour' label='Colour, nothing current' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function CustomMatchingSection() {
  return (
    <ExampleSection
      title='Custom matching'
      description={
        <>
          For any rule other than equality — a nested route, a query string, an index page that
          stays current for its children — compute it from your router and set <code>current</code>{' '}
          on the link. The bar never second-guesses it. Here the reader is on a chart guide inside
          Data visualisation.
        </>
      }
    >
      <Example
        code={`const pathname = '/colour/data-visualisation/charts'

<TabNav aria-label="Colour">
  {pages.map((page) => (
    <TabNavLink key={page.href} href={page.href} current={pathname.startsWith(page.href)}>
      {page.title}
    </TabNavLink>
  ))}
</TabNav>`}
      >
        <TabNav aria-label='Colour, prefix matched'>
          {PAGES.map((page) => (
            <TabNavLink
              key={page.href}
              href={page.href}
              current={'/colour/data-visualisation/charts'.startsWith(page.href)}
            >
              {page.title}
            </TabNavLink>
          ))}
        </TabNav>
      </Example>
    </ExampleSection>
  )
}

function OverflowSection() {
  return (
    <ExampleSection
      title='Overflow'
      description='When the tabs outgrow the space, the bar scrolls sideways within itself rather than wrapping or pushing the page wider. The clipped last tab signals there is more; touch, shift-wheel and the keyboard all reach it.'
    >
      <Example
        code={`<TabNav currentHref={pathname} aria-label="Recreational fishing licence">…</TabNav>`}
      >
        <div className='w-full max-w-sm'>
          <TabNav currentHref='/fishing-licence/fees' aria-label='Recreational fishing licence'>
            {LICENCE_PAGES.map((page) => (
              <TabNavLink key={page.href} href={page.href}>
                {page.title}
              </TabNavLink>
            ))}
          </TabNav>
        </div>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Under the section heading, listing the section’s peer pages. Name the landmark after the section it navigates, so it is distinguishable from the page’s other navigation.'
    >
      <Example layout='fill'>
        <div className='space-y-8'>
          <div className='space-y-2'>
            <p className='text-base font-semibold text-muted-foreground'>Recreational fishing</p>
            <p className='text-3xl/tight font-bold'>Recreational fishing licence</p>
          </div>
          <TabNav currentHref='/fishing-licence/fees' aria-label='Recreational fishing licence'>
            {LICENCE_PAGES.map((page) => (
              <TabNavLink key={page.href} href={page.href}>
                {page.title}
              </TabNavLink>
            ))}
          </TabNav>
          <div className='max-w-prose space-y-4'>
            <p className='text-2xl font-semibold'>Fees and exemptions</p>
            <p>
              The fee depends on how long your licence lasts. Some people do not have to pay,
              depending on their age or the concession card they hold.
            </p>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function TabNavDocs() {
  return (
    <DocsPage
      title='TabNav'
      npm={['TabNav', 'TabNavLink']}
      registry='tab-nav'
      summary={
        <>
          A flat horizontal bar of links between the peer pages of one section. Each tab is a real
          link to its own page, and the one being read is marked from <code>currentHref</code> —
          never from click state — so a fresh page load always marks the right tab. These are not
          ARIA tabs: the name describes the look, not a panel switcher.
        </>
      }
    >
      <DocsUsage
        use={[
          'Moving between the peer pages of one section, such as the parts of a licence guide.',
          'A section of three to seven pages with no hierarchy worth drawing.',
          'A bar directly under the page heading that stays the same on every page in the section.',
        ]}
        avoid={[
          'Switching panels within one page without a page load — use Tabs.',
          'A section whose pages nest — use SideNav.',
          'Jumping between headings on the page being read — use OnThisPage.',
          'Taking a reader through an ordered journey — use StepIndicator.',
        ]}
      />
      <VariantsSection />
      <StatesSection />
      <CustomMatchingSection />
      <OverflowSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/TabNav',
  component: TabNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: TabNavDocs },
  },
  args: {
    currentHref: CURRENT,
    border: true,
    'aria-label': 'Colour',
  },
  argTypes: {
    currentHref: {
      control: 'select',
      options: PAGES.map((page) => page.href),
      description:
        "The current page's href. Matched exactly — set `current` on a link for any other rule.",
      table: { category: 'Behavior' },
    },
    border: {
      control: 'boolean',
      description: 'The rule the tabs sit on. Turn it off inside a Card that draws its own edge.',
      table: { category: 'Appearance' },
    },
    'aria-label': {
      control: 'text',
      description:
        'Names the navigation landmark. Defaults to "Subsection navigation"; name it after the section.',
      table: { category: 'Accessibility' },
    },
    children: {
      control: false,
      description: 'The TabNavLink tabs.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <TabNav {...args}>
      {PAGES.map((page) => (
        <TabNavLink key={page.href} href={page.href}>
          {page.title}
        </TabNavLink>
      ))}
    </TabNav>
  ),
} satisfies Meta<typeof TabNav>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNav(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="tab-nav"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="tab-nav"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    // A named landmark, or it is indistinguishable from the page's other navs.
    if (nav.getAttribute('aria-label') !== 'Colour') {
      throw new Error(`Expected a named landmark, received "${nav.getAttribute('aria-label')}".`)
    }

    // list-style: none strips list semantics in Safari/VoiceOver.
    const list = nav.querySelector('ul')
    if (list?.getAttribute('role') !== 'list') {
      throw new Error('Expected an explicit role="list" on the list.')
    }

    const links = nav.querySelectorAll('a')
    if (links.length !== PAGES.length) {
      throw new Error(`Expected ${PAGES.length} links, received ${links.length}.`)
    }

    // Exactly one tab is the current page, and it is the one matching
    // currentHref — not the first, and not whichever was last clicked.
    const current = nav.querySelectorAll('[aria-current]')
    if (current.length !== 1) {
      throw new Error(`Expected exactly one current tab, received ${current.length}.`)
    }
    if (current[0]?.getAttribute('aria-current') !== 'page') {
      throw new Error(
        `Expected aria-current="page", received "${current[0]?.getAttribute('aria-current')}".`,
      )
    }
    if (current[0]?.getAttribute('href') !== CURRENT) {
      throw new Error(
        `Expected the current tab to be ${CURRENT}, received "${current[0]?.getAttribute('href')}".`,
      )
    }

    // These are links, not ARIA tabs. role="tab"/"tablist" would promise
    // aria-controls panels that do not exist.
    if (nav.querySelector('[role="tab"], [role="tablist"]')) {
      throw new Error('Expected no ARIA tab roles — TabNav is a nav landmark over links.')
    }

    // Every tab is a real anchor. The nav-over-links contract is what lets the
    // bar claim aria-current="page" at all: a non-anchor tab would announce
    // itself as the current page while being unable to navigate to one (WCAG
    // 2.2, 4.1.2). Checked at runtime as well as in the types, so the invariant
    // survives a consumer reaching past the type surface.
    for (const item of nav.querySelectorAll('[data-slot="tab-nav-item"]')) {
      const tab = item.firstElementChild
      if (tab?.tagName !== 'A') {
        throw new Error(`Expected every tab to render as an anchor, received <${tab?.tagName}>.`)
      }
    }
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const CustomMatching: Story = {
  name: 'Custom matching',
  render: () => <CustomMatchingSection />,
}

export const Overflow: Story = { name: 'Overflow', render: () => <OverflowSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

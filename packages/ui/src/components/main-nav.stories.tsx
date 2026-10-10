/**
 * MainNav — the site's primary navigation bar, with mega panels.
 *
 *   Components/MainNav        → this file: Docs, Default, Playground and one
 *                               story per docs section
 *   Components/MainNav/Tests  → main-nav.tests.stories.tsx
 *
 * NavigationMenu (navigation-menu.tsx) is the internal Base UI wrapper MainNav
 * is built on; it has no story set of its own, and these stories cover it.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { DirectionProvider } from './direction.js'
import { Header, HeaderBrand } from './header.js'
import { MainNav, type MainNavColor, type MainNavItem } from './main-nav.js'
import { Masthead } from './masthead.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

// ─── Content ──────────────────────────────────────────────────────────────────

/** A quit-smoking service's top level: three mega panels and one plain link. */
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

const colourFamilies: ReadonlyArray<{ name: string; colours: readonly MainNavColor[] }> = [
  {
    name: 'white and primary',
    colours: ['white', 'primary-800', 'primary-600', 'primary-400', 'primary-200'],
  },
  { name: 'grey', colours: ['grey-800', 'grey-600', 'grey-400', 'grey-200'] },
  { name: 'accent', colours: ['accent-800', 'accent-600', 'accent-400', 'accent-200'] },
]

/**
 * One bar under its label. Each specimen passes a unique `id`: MainNav
 * defaults to id="nsw-main-navigation", which is only valid once per page.
 */
function LabelledBar({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof MainNav>) {
  return (
    <div className='space-y-2'>
      <span className='block text-base text-muted-foreground'>{label}</span>
      <MainNav {...props} />
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function PanelsAndLinksSection() {
  return (
    <ExampleSection
      title='Panels and links'
      description={
        <>
          Everything comes from the <code>navigation</code> data. An item with <code>links</code>{' '}
          opens a mega panel: its own <code>href</code> becomes the featured link at the top, above
          a grid of the section&apos;s pages. An item without <code>links</code> is a plain link
          styled like the triggers. Panels are one level deep — for a deeper tree, use SideNav on
          the section&apos;s pages.
        </>
      }
    >
      <Example
        layout='fill'
        code={`const navigation: MainNavItem[] = [
  {
    title: 'Quit support',
    href: '/quit-support',
    links: [
      { title: 'Talk to a quitline counsellor', href: '/quitline' },
      { title: 'Find support near you', href: '/find-support' },
    ],
  },
  { title: 'About', href: '/about' },
]

<MainNav navigation={navigation} />`}
      >
        <MainNav id='main-nav-panels' navigation={demoNavigation} />
      </Example>
    </ExampleSection>
  )
}

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Thirteen surfaces, in the Footer&apos;s vocabulary and with its dark-mode deepening, so a
          service themes its chrome with one word. Every light pair meets WCAG 2.2 AA and every dark
          pair AAA. Panels always open on the popover surface, whatever the bar&apos;s colour.
        </>
      }
    >
      {colourFamilies.map(({ name, colours }, index) => (
        <Example
          key={name}
          layout='fill'
          className='space-y-6'
          code={index === 0 ? `<MainNav navigation={navigation} color="primary-800" />` : undefined}
        >
          {colours.map((color) => (
            <LabelledBar
              key={color}
              label={color}
              id={`main-nav-colour-${color}`}
              color={color}
              navigation={demoNavigation}
            />
          ))}
        </Example>
      ))}
    </ExampleSection>
  )
}

function BordersSection() {
  return (
    <ExampleSection
      title='Borders'
      description={
        <>
          <code>border</code> draws a rule on the top, the bottom, or both edges, mixed from the
          surface&apos;s own ink — use one to separate the bar from a header or page of the same
          colour.
        </>
      }
    >
      <Example
        layout='fill'
        className='space-y-6'
        code={`<MainNav navigation={navigation} color="grey-200" border="bottom" />`}
      >
        {(['none', 'top', 'bottom', 'both'] as const).map((border) => (
          <LabelledBar
            key={border}
            label={border}
            id={`main-nav-border-${border}`}
            color='grey-200'
            border={border}
            shadow={false}
            navigation={demoNavigation}
          />
        ))}
      </Example>
    </ExampleSection>
  )
}

function ContainersSection() {
  return (
    <ExampleSection
      title='Containers'
      description={
        <>
          <code>fluid</code> (the default) runs the items edge to edge; <code>contained</code>{' '}
          centres them in a 1200px column to line up with a contained Header. Set{' '}
          <code>--main-nav-max-width</code> to match a different column. Panels span the
          container&apos;s width either way.
        </>
      }
    >
      <Example
        layout='fill'
        className='space-y-6'
        code={`<MainNav navigation={navigation} container="contained" />`}
      >
        <LabelledBar
          label='fluid'
          id='main-nav-container-fluid'
          container='fluid'
          color='grey-200'
          navigation={demoNavigation}
        />
        <LabelledBar
          label='contained'
          id='main-nav-container-contained'
          container='contained'
          color='grey-200'
          navigation={demoNavigation}
        />
        <LabelledBar
          label='contained, --main-nav-max-width: 40rem'
          id='main-nav-container-custom'
          container='contained'
          color='grey-200'
          navigation={demoNavigation}
          style={{ '--main-nav-max-width': '40rem' } as React.CSSProperties}
        />
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
          <code>aria-current=&quot;page&quot;</code>, and the top-level item it belongs to carries
          the underline — a plain link directly, or the trigger whose panel holds the page (open
          Quit support in the second bar to see the marked link).
        </>
      }
    >
      <Example
        layout='fill'
        className='space-y-6'
        code={`<MainNav navigation={navigation} currentHref={pathname} />`}
      >
        <LabelledBar
          label='currentHref="#about" — a plain link'
          id='main-nav-current-link'
          currentHref='#about'
          navigation={demoNavigation}
        />
        <LabelledBar
          label='currentHref="#find-support" — a page inside a panel'
          id='main-nav-current-panel'
          currentHref='#find-support'
          navigation={demoNavigation}
        />
      </Example>
    </ExampleSection>
  )
}

/**
 * A sticky Header and a sticky MainNav in a scroll box. The consumer owns the
 * header's height: this measures it and writes the result into
 * `--main-nav-top`, which an app with a fixed-height header can set
 * statically instead.
 */
function StickyScene() {
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
    <div className='h-96 overflow-y-auto'>
      <Masthead id='main-nav-sticky-masthead' color='dark' />
      <Header id='main-nav-sticky-header' ref={headerRef} color='white' sticky>
        <HeaderBrand sitename='Quit smoking' />
      </Header>
      <MainNav
        id='main-nav-sticky'
        navigation={demoNavigation}
        color='grey-200'
        sticky
        style={{ '--main-nav-top': `${headerHeight}px` } as React.CSSProperties}
      />
      <div className='min-h-[48rem] space-y-4 bg-background p-6 text-foreground'>
        <p>Scroll this box: the Header pins to the top and the bar pins directly below it.</p>
        <p className='max-w-prose text-muted-foreground'>
          Quitting smoking is one of the best things you can do for your health. Free support is
          available from a quitline counsellor, your doctor or pharmacist.
        </p>
      </div>
    </div>
  )
}

function StickySection() {
  return (
    <ExampleSection
      title='Sticky'
      description={
        <>
          <code>sticky</code> pins the bar to the top of the viewport. Under a sticky Header, set{' '}
          <code>--main-nav-top</code> to the header&apos;s height so the two stack instead of
          overlapping.
        </>
      }
    >
      <Example
        layout='fill'
        className='max-sm:p-0 sm:p-0'
        code={`<Header ref={headerRef} sticky>…</Header>
<MainNav
  navigation={navigation}
  sticky
  style={{ '--main-nav-top': \`\${headerHeight}px\` }}
/>`}
      >
        <StickyScene />
      </Example>
    </ExampleSection>
  )
}

function RightToLeftSection() {
  return (
    <ExampleSection
      title='Right to left'
      description={
        <>
          Under <code>dir=&quot;rtl&quot;</code> the items run from the right and each panel still
          spans the bar edge to edge. Wrap the app in <code>DirectionProvider</code> as well, so
          every Base UI primitive agrees on the direction.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<div dir="rtl">
  <DirectionProvider direction="rtl">
    <MainNav navigation={navigation} />
  </DirectionProvider>
</div>`}
      >
        <div dir='rtl'>
          <DirectionProvider direction='rtl'>
            <MainNav id='main-nav-rtl' navigation={demoNavigation} currentHref='#find-support' />
          </DirectionProvider>
        </div>
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
          Masthead, Header and MainNav make the top of a NSW Government page, sitting flush. The bar
          does not hide itself on small screens: pass{' '}
          <code>className=&quot;hidden lg:block&quot;</code> and render the MobileNav block beside
          it for narrow viewports.
        </>
      }
    >
      <Example layout='fill' className='max-sm:p-0 sm:p-0'>
        <Masthead id='main-nav-in-context-masthead' color='dark' />
        <Header id='main-nav-in-context-header' color='white' sticky={false}>
          <HeaderBrand sitename='Quit smoking' />
        </Header>
        <MainNav id='main-nav-in-context' navigation={demoNavigation} currentHref='#quitline' />
        <div className='space-y-4 bg-background p-6 text-foreground'>
          <p className='text-3xl/tight font-bold'>Talk to a quitline counsellor</p>
          <p className='max-w-prose'>
            Quitline counsellors offer free, confidential advice and support to help you quit. Call
            13 7848 any day of the week.
          </p>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function MainNavDocs() {
  return (
    <DocsPage
      title='MainNav'
      npm='MainNav'
      registry='main-nav'
      summary={
        <>
          The site&apos;s primary navigation bar, below the Header. Top-level items open mega panels
          of the section&apos;s pages or link straight to a page, and the bar marks where the reader
          is. Every link renders through <code>Link</code>, so a framework link set on{' '}
          <code>LinkProvider</code> is used automatically.
        </>
      }
    >
      <DocsUsage
        use={[
          'The primary navigation of a site with a handful of top-level sections.',
          'Sections with several pages each — a mega panel puts them one click away.',
          'Wide screens, hidden below lg with the MobileNav block shown in its place.',
        ]}
        avoid={[
          'Moving around within one section of a site — use SideNav.',
          'Navigation on a phone — use the MobileNav block, which puts PushMenu in a Sheet.',
          'Switching between views of the same page — use TabNav or Tabs.',
        ]}
      />
      <ColoursSection />
      <PanelsAndLinksSection />
      <BordersSection />
      <ContainersSection />
      <CurrentPageSection />
      <StickySection />
      <RightToLeftSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/MainNav',
  component: MainNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: MainNavDocs },
  },
  // Room in the canvas for the panel, which portals out of the bar.
  decorators: [
    (Story) => (
      <div className='min-h-[520px]'>
        <Story />
      </div>
    ),
  ],
  args: {
    navigation: demoNavigation,
    currentHref: '#find-support',
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
    emptyMessage: {
      control: 'text',
      description:
        'Shown in the bar when `navigation` is empty. Defaults to "No navigation items available."; `null` renders an empty bar.',
      table: { category: 'Content' },
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
        'Surface colour — the Footer’s thirteen-name vocabulary and dark-mode deepening.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper: `fluid` runs edge to edge, `contained` centres a 1200px column (override with `--main-nav-max-width`). Panels span the container’s width.',
      table: { category: 'Appearance' },
    },
    border: {
      control: 'inline-radio',
      options: ['none', 'top', 'bottom', 'both'],
      description: 'Edge rules, drawn from the surface’s ink.',
      table: { category: 'Appearance' },
    },
    shadow: {
      control: 'boolean',
      description: 'Drop shadow under the bar.',
      table: { category: 'Appearance' },
    },
    currentHref: {
      control: 'text',
      description:
        'The current page’s href — the matching link gets `aria-current="page"` and its top-level item the underline. Pass your router’s pathname.',
      table: { category: 'Behavior' },
    },
    sticky: {
      control: 'boolean',
      description:
        'Stick to the viewport top. Set `--main-nav-top` to a sticky header’s height to stack below it.',
      table: { category: 'Behavior' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the nav landmark. Defaults to "Main navigation".',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
    containerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof MainNav>

export default meta

type Story = StoryObj<typeof meta>

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

export const Playground: Story = {}

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const PanelsAndLinks: Story = {
  name: 'Panels and links',
  render: () => <PanelsAndLinksSection />,
}

export const Borders: Story = { name: 'Borders', render: () => <BordersSection /> }

export const Containers: Story = { name: 'Containers', render: () => <ContainersSection /> }

export const CurrentPage: Story = { name: 'Current page', render: () => <CurrentPageSection /> }

export const Sticky: Story = { name: 'Sticky', render: () => <StickySection /> }

export const RightToLeft: Story = { name: 'Right to left', render: () => <RightToLeftSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

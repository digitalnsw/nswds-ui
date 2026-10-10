/**
 * Header — the top-of-page banner landmark.
 *
 *   Components/Header                → this file: Docs, Default, Playground
 *   Components/Header/Features       → header.features.stories.tsx
 *   Components/Header/Accessibility  → header.accessibility.stories.tsx
 *   Components/Header/Tests          → header.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import { IconDarkMode } from '../icons/dark-mode.js'
import { IconMenu } from '../icons/menu.js'
import { IconSearch } from '../icons/search.js'

import { Button, ButtonLink } from './button.js'
import { Header, HeaderActions, HeaderBrand } from './header.js'
import { Masthead } from './masthead.js'
import { SkipLink, SkipLinks } from './skip-link.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

const HEADER_COLORS = ['white', 'light', 'dark', 'grey'] as const

function getHeader(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="header"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="header"].')
  }
  return el
}

/** Stand-in for the controls an app supplies — search, theme, navigation. */
function DemoActions() {
  return (
    <HeaderActions>
      <Button
        variant='ghost'
        color='grey'
        size='icon'
        aria-label='Search'
        leadingVisual={IconSearch}
      />
      <Button
        variant='ghost'
        color='grey'
        size='icon'
        aria-label='Switch to dark theme'
        leadingVisual={IconDarkMode}
      />
      <Button
        variant='ghost'
        color='grey'
        size='icon'
        aria-label='Menu'
        leadingVisual={IconMenu}
        className='md:hidden'
      />
    </HeaderActions>
  )
}

/**
 * A labelled full-width specimen. ExampleCell sizes its child to its content,
 * which would shrink a full-bleed header to the width of its brand.
 */
function Strip({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className='space-y-2'>
      <p className='text-base text-muted-foreground'>{label}</p>
      <div className='ring-1 ring-foreground/10'>{children}</div>
    </div>
  )
}

const sitename = 'Department of Primary Industries'

// ─── Sections ─────────────────────────────────────────────────────────────────
// Every Header on the docs page takes its own id (the component defaults to
// id="nsw-header", valid once per page) and sticky={false}, so the specimens
// stack instead of pinning to the top of the docs page.

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Four surfaces, sharing the Masthead&rsquo;s vocabulary so one word themes the whole page
          chrome. Every text/background pair is WCAG 2.2 AAA, in both light and dark mode. On{' '}
          <code>dark</code> and <code>grey</code> the brand switches itself to the reversed logo and
          a white version badge — the NSW logo never inherits a colour, so the surface decides it.
          All four deepen in dark mode.
        </>
      }
    >
      <Example layout='fill' code={`<Header color="dark">…</Header>`}>
        <div className='space-y-6'>
          {HEADER_COLORS.map((color) => (
            <Strip key={color} label={color === 'white' ? 'white (default)' : color}>
              <Header id={`header-colour-${color}`} color={color} sticky={false}>
                <HeaderBrand sitename={sitename} version='2.1.0' />
              </Header>
            </Strip>
          ))}
        </div>
      </Example>
      <Example layout='fill' surface='dark'>
        <div className='space-y-6'>
          {HEADER_COLORS.map((color) => (
            <Strip key={color} label={`${color} — dark mode`}>
              <Header id={`header-colour-dark-${color}`} color={color} sticky={false}>
                <HeaderBrand sitename={sitename} version='2.1.0' />
              </Header>
            </Strip>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

export function BrandSection() {
  return (
    <ExampleSection
      title='Brand'
      description={
        <>
          <code>HeaderBrand</code> links the NSW Government logo and the site name to the home page.
          The site name is a <code>span</code>, never a heading — the page&apos;s own{' '}
          <code>h1</code> belongs to its main content. The version badge sits outside the link and
          reads “Version 2.1.0” to a screen reader; <code>badgeProps</code> reaches the badge when a
          house rule needs a larger size.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<HeaderBrand sitename="Department of Primary Industries" version="2.1.0" />`}
      >
        <div className='space-y-6'>
          <Strip label='logo only'>
            <Header id='header-brand-logo' sticky={false}>
              <HeaderBrand />
            </Header>
          </Strip>
          <Strip label='sitename'>
            <Header id='header-brand-sitename' sticky={false}>
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
          <Strip label='sitename + version'>
            <Header id='header-brand-version' sticky={false}>
              <HeaderBrand sitename={sitename} version='2.1.0' />
            </Header>
          </Strip>
          <Strip label={`badgeProps={{ size: 'lg' }}`}>
            <Header id='header-brand-badge' sticky={false}>
              <HeaderBrand sitename={sitename} version='2.1.0' badgeProps={{ size: 'lg' }} />
            </Header>
          </Strip>
          <Strip label='logo={false}'>
            <Header id='header-brand-no-logo' sticky={false}>
              <HeaderBrand logo={false} sitename={sitename} />
            </Header>
          </Strip>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function WithActionsSection() {
  return (
    <ExampleSection
      title='With actions'
      description={
        <>
          <code>HeaderActions</code> is the trailing slot for search, a theme switcher or sign-in. A
          row of icons uses <code>size=&quot;icon&quot;</code>, the 40×40 chrome square. Beside a
          labelled control, use <code>iconOnly</code> at the labelled control&apos;s{' '}
          <code>size</code> instead, so the row shares one height, and keep the label on one line
          with <code>labelWrap=&#123;false&#125;</code>.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<HeaderActions>
  <Button variant="ghost" color="grey" size="icon" aria-label="Search" leadingVisual={IconSearch} />
</HeaderActions>`}
      >
        <Strip label='icons only'>
          <Header id='header-actions-icons' sticky={false}>
            <HeaderBrand sitename={sitename} />
            <DemoActions />
          </Header>
        </Strip>
      </Example>
      <Example
        layout='fill'
        code={`<HeaderActions>
  <Button variant="ghost" color="grey" iconOnly aria-label="Search" leadingVisual={IconSearch} />
  <ButtonLink href="/sign-in" variant="outline" labelWrap={false}>Sign in</ButtonLink>
</HeaderActions>`}
      >
        <Strip label='icons beside a labelled action'>
          <Header id='header-actions-mixed' sticky={false}>
            <HeaderBrand sitename={sitename} />
            <HeaderActions>
              <Button
                variant='ghost'
                color='grey'
                iconOnly
                aria-label='Search'
                leadingVisual={IconSearch}
              />
              <Button
                variant='ghost'
                color='grey'
                iconOnly
                aria-label='Switch to dark theme'
                leadingVisual={IconDarkMode}
              />
              <ButtonLink href='#sign-in' variant='outline' labelWrap={false}>
                Sign in
              </ButtonLink>
            </HeaderActions>
          </Header>
        </Strip>
      </Example>
    </ExampleSection>
  )
}

export function ScrollStateSection() {
  return (
    <ExampleSection
      title='Scroll state'
      description={
        <>
          A sticky header exposes <code>data-scrolled</code> once the page has moved off the top.
          The built-in <code>shadow</code> treatment keys off it; style your own scrolled state with
          the same attribute.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Header className="data-scrolled:border-transparent">…</Header>`}
      >
        <div className='space-y-6'>
          <Strip label='at the top of the page'>
            <Header id='header-scroll-top' sticky={false}>
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
          <Strip label='data-scrolled'>
            {/* data-scrolled pinned on for the specimen; a real header sets it
                itself as the page scrolls. */}
            <Header id='header-scroll-scrolled' sticky={false} data-scrolled=''>
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function BorderAndShadowSection() {
  return (
    <ExampleSection
      title='Border and shadow'
      description={
        <>
          By default the header draws a hairline along its bottom edge in its own ink, and a light
          shadow once it is scrolled. Turn either off when the header sits on a band of the same
          colour, or when something directly below it draws its own edge.
        </>
      }
    >
      <Example layout='fill' code={`<Header border={false} shadow={false}>…</Header>`}>
        <div className='space-y-6'>
          <Strip label='border (default)'>
            <Header id='header-edge-border' sticky={false}>
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
          <Strip label='border={false}'>
            <Header id='header-edge-none' sticky={false} border={false}>
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
          <Strip label='scrolled, shadow={false}'>
            <Header id='header-edge-no-shadow' sticky={false} shadow={false} data-scrolled=''>
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function ContainersSection() {
  return (
    <ExampleSection
      title='Containers'
      description={
        <>
          <code>fluid</code> (the default) runs the row from the page edge; <code>contained</code>{' '}
          centres it in a 1200px column. Retune either with <code>--header-max-width</code> and{' '}
          <code>--header-padding-x</code>; set the max width on a shared ancestor to line the
          Masthead and Breadcrumb up with it.
        </>
      }
    >
      <Example layout='fill' code={`<Header container="contained">…</Header>`}>
        <div className='space-y-6'>
          <Strip label='fluid'>
            <Header id='header-container-fluid' container='fluid' color='light' sticky={false}>
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
          <Strip label='contained'>
            <Header
              id='header-container-contained'
              container='contained'
              color='light'
              sticky={false}
            >
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
          <Strip label='contained, --header-max-width: 40rem'>
            <Header
              id='header-container-custom'
              container='contained'
              color='light'
              sticky={false}
              style={{ '--header-max-width': '40rem' } as React.CSSProperties}
            >
              <HeaderBrand sitename={sitename} />
            </Header>
          </Strip>
        </div>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='SkipLinks, Masthead and Header stack in that order at the top of every page. Click inside the frame and press Tab to reveal the skip links above the masthead.'
    >
      <Example
        layout='fill'
        code={`<SkipLinks />
<Masthead />
<Header>
  <HeaderBrand sitename="Department of Primary Industries" version="2.1.0" />
  <HeaderActions>…</HeaderActions>
</Header>`}
      >
        {/* SkipLinks is `fixed` to the viewport; `absolute` keeps it inside
            this frame instead of the top of the docs page. */}
        <div className='relative overflow-hidden ring-1 ring-foreground/10'>
          {/* One link, to a frame-scoped id: the default pair also targets
              #nav, and this frame has no navigation to skip to. */}
          <SkipLinks color='dark' className='absolute'>
            <SkipLink color='dark' href='#header-context-content'>
              Skip to content
            </SkipLink>
          </SkipLinks>
          <Masthead id='header-context-masthead' color='dark' />
          <Header id='header-context' color='white' sticky={false}>
            <HeaderBrand sitename={sitename} version='2.1.0' />
            <DemoActions />
          </Header>
          <div
            id='header-context-content'
            className='space-y-2 bg-background px-6 py-6 text-foreground'
          >
            <p className='text-2xl font-bold'>Apply for a recreational fishing licence</p>
            <p className='text-base'>
              You need a licence to fish in NSW waters, including from the shore.
            </p>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function HeaderDocs() {
  return (
    <DocsPage
      title='Header'
      npm={['Header', 'HeaderBrand', 'HeaderActions']}
      registry='header'
      summary={
        <>
          The header carries the NSW Government brand, the service name and the controls that belong
          to every page. It sits directly below the Masthead, with SkipLinks rendered before both.
          Compose the row from <code>HeaderBrand</code> and <code>HeaderActions</code>. It is the
          page&apos;s <code>banner</code> landmark, so render it once.
        </>
      }
    >
      <DocsUsage
        use={[
          'The top of every page, rendered once in a shared layout below the Masthead.',
          'Naming the service beside the NSW Government logo, linked to its home page.',
          'Holding a few site-wide controls — search, theme, sign-in.',
        ]}
        avoid={[
          'Listing the sections of the site — use MainNav below the Header.',
          'Moving around on a small screen — use MobileNav, opened from a HeaderActions button.',
          'Saying the site is an official NSW Government website — use Masthead.',
        ]}
      />
      <ColoursSection />
      <BrandSection />
      <WithActionsSection />
      <ScrollStateSection />
      <BorderAndShadowSection />
      <ContainersSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: HeaderDocs },
  },
  args: {
    color: 'white',
    container: 'fluid',
    sticky: true,
    border: true,
    shadow: true,
    children: (
      <>
        <HeaderBrand sitename='Design System' version='2.1.0' />
        <DemoActions />
      </>
    ),
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: HEADER_COLORS,
      description:
        'Surface colour, sharing the Masthead and SkipLinks vocabulary. Every pair is WCAG 2.2 AAA and deepens in dark mode.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper layout — fluid is full-bleed, contained centres a 1200px column. Retune with --header-max-width and --header-padding-x.',
      table: { category: 'Appearance' },
    },
    border: {
      control: 'boolean',
      description: 'Hairline rule along the bottom edge, derived from the surface ink.',
      table: { category: 'Appearance' },
    },
    shadow: {
      control: 'boolean',
      description: 'Raise the header with a shadow once the page is scrolled.',
      table: { category: 'Appearance' },
    },
    sticky: {
      control: 'boolean',
      description: 'Stick to the top of the viewport as the page scrolls.',
      table: { category: 'Behavior' },
    },
    children: {
      control: false,
      description: 'The row: a HeaderBrand, then HeaderActions.',
      table: { category: 'Content' },
    },
    id: {
      control: 'text',
      description: 'Defaults to "nsw-header" for shells that target it. Unique per page.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
    containerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement)

    if (header.tagName !== 'HEADER') {
      throw new Error(`Expected the Header to render a <header> landmark, got <${header.tagName}>.`)
    }

    if (!header.querySelector('[data-slot="header-container"]')) {
      throw new Error('Expected an inner [data-slot="header-container"] wrapper.')
    }

    const brand = header.querySelector<HTMLElement>('[data-slot="header-brand"]')
    if (!brand) {
      throw new Error('Expected a [data-slot="header-brand"] region.')
    }

    // The brand is a working home link, and the logo's visually-hidden text
    // plus the site name form its accessible name.
    const link = brand.querySelector<HTMLAnchorElement>('a')
    if (!link) {
      throw new Error('Expected the brand to render a link.')
    }
    if (new URL(link.href).pathname !== '/') {
      throw new Error(
        `Expected the brand link to point at "/", got "${link.getAttribute('href')}".`,
      )
    }
    if (
      !link.textContent?.includes('NSW Government') ||
      !link.textContent.includes('Design System')
    ) {
      throw new Error(
        `Expected the brand link to name the organisation and the site, got "${link.textContent}".`,
      )
    }

    // Interactive: the link takes keyboard focus.
    link.focus()
    if (document.activeElement !== link) {
      throw new Error('Expected the brand link to be focusable.')
    }
    link.blur()

    // The version badge sits outside the link — it must never become part of
    // the home link's accessible name — and is announced with its label.
    const version = header.querySelector<HTMLElement>('[data-slot="header-version"]')
    if (!version) {
      throw new Error('Expected a [data-slot="header-version"] badge.')
    }
    if (link.contains(version)) {
      throw new Error('Expected the version badge to sit outside the brand link.')
    }
    if (version.textContent !== 'Version 2.1.0') {
      throw new Error(
        `Expected the badge to announce "Version 2.1.0", got "${version.textContent}".`,
      )
    }

    // Actions cluster present and reachable.
    const actions = header.querySelector('[data-slot="header-actions"]')
    if (!actions) {
      throw new Error('Expected a [data-slot="header-actions"] region.')
    }
    if (actions.querySelectorAll('button').length !== 3) {
      throw new Error('Expected the three demo action buttons to render.')
    }
  },
}

export const Playground: Story = {}

/**
 * Header — Default + Colours + Containers + Actions + Scroll + Playground
 *
 * The top-of-page banner landmark: brand lockup, site name, optional version
 * badge and a slot for header controls. Sits below SkipLinks and Masthead.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { IconDarkMode } from '../icons/dark-mode.js'
import { IconMenu } from '../icons/menu.js'
import { IconSearch } from '../icons/search.js'

import { Button } from './button.js'
import { Header, HeaderActions, HeaderBrand } from './header.js'
import { Masthead } from './masthead.js'
import { SkipLinks } from './skip-link.js'

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Header</h1>
            <p className='text-base text-muted-foreground'>
              The header carries the NSW Government brand, the service name and the controls that
              belong to every page. It sits directly below the Masthead, with SkipLinks rendered
              before both. Compose the row from <code>HeaderBrand</code> and{' '}
              <code>HeaderActions</code>.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Colours</h2>
            <p className='text-base text-muted-foreground'>
              Four surfaces, sharing the Masthead&rsquo;s vocabulary so one word themes the whole
              page chrome. Every text/background pair is WCAG 2.2 AAA, in both light and dark mode.
            </p>
            {/* Unique ids: the component defaults to id="nsw-header", which is
                only valid once per page. */}
            <div className='space-y-2'>
              <Header id='docs-header-white' color='white' sticky={false}>
                <HeaderBrand sitename='White' />
              </Header>
              <Header id='docs-header-light' color='light' sticky={false}>
                <HeaderBrand sitename='Light' />
              </Header>
              <Header id='docs-header-dark' color='dark' sticky={false}>
                <HeaderBrand sitename='Dark' />
              </Header>
              <Header id='docs-header-grey' color='grey' sticky={false}>
                <HeaderBrand sitename='Grey' />
              </Header>
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Scroll state</h2>
            <p className='text-base text-muted-foreground'>
              A sticky header exposes <code>data-scrolled</code> once the page has moved off the
              top. The built-in <code>shadow</code> treatment keys off it; style your own scrolled
              state with the same attribute.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'Top-of-page banner landmark with brand lockup, site name, version badge and a slot for header controls, in four WCAG 2.2 AAA surface colours.',
      },
    },
  },
  args: {
    color: 'white',
    container: 'fluid',
    sticky: true,
    border: true,
    shadow: true,
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['white', 'light', 'dark', 'grey'],
      description:
        'Surface colour, sharing the Masthead and SkipLink vocabulary. Every pair is WCAG 2.2 AAA and follows the theme in dark mode.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper layout — fluid is full-bleed (nswds-app), contained centres a 1200px column (legacy nsw-container).',
      table: { category: 'Layout' },
    },
    sticky: {
      control: 'boolean',
      description: 'Stick to the top of the viewport as the page scrolls.',
      table: { category: 'Layout' },
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
    children: {
      table: { disable: true, category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
    containerClassName: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHeader(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="header"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="header"].')
  }
  return el
}

/** Poll until `predicate` holds, so scroll-driven state has time to settle. */
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: (
      <>
        <HeaderBrand sitename='Design System' version='2.1.0' />
        <DemoActions />
      </>
    ),
  },
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

// Multi-instance stories pass unique ids: the component defaults to
// id="nsw-header", which is only valid once per page. sticky={false} keeps
// them stacked in the canvas instead of overlapping.
export const Colours: Story = {
  render: () => (
    <div className='space-y-2'>
      <Header id='header-white' color='white' sticky={false}>
        <HeaderBrand sitename='White (default)' version='2.1.0' />
      </Header>
      <Header id='header-light' color='light' sticky={false}>
        <HeaderBrand sitename='Light' version='2.1.0' />
      </Header>
      <Header id='header-dark' color='dark' sticky={false}>
        <HeaderBrand sitename='Dark' version='2.1.0' />
      </Header>
      <Header id='header-grey' color='grey' sticky={false}>
        <HeaderBrand sitename='Grey' version='2.1.0' />
      </Header>
      {/* A key that is merely present in badgeProps must not beat the
          surface-aware default. Passing `color: undefined` used to reach cva,
          which fell back to its own `primary` — this header's own background —
          and the badge disappeared. The contrast check below covers it. */}
      <Header id='header-dark-badge-undefined' color='dark' sticky={false}>
        <HeaderBrand
          sitename='Dark, badgeProps color undefined'
          version='2.1.0'
          badgeProps={{ color: undefined }}
        />
      </Header>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const headers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="header"]')
    if (headers.length !== 5) {
      throw new Error(`Expected 5 headers, got ${headers.length}.`)
    }

    // The dark surfaces must not paint the default (blue) wordmark, which
    // would disappear against them — HeaderBrand switches to the reversed
    // lockup via the colour context.
    for (const header of headers) {
      const color = header.dataset.color
      const wordmark = header.querySelector('svg path')
      if (!wordmark) {
        throw new Error(`Expected a logo inside the ${color} header.`)
      }
      const fill = getComputedStyle(wordmark).fill
      if (fill === '' || fill === 'none') {
        throw new Error(
          `Expected the ${color} header's logo to have a resolved fill, got "${fill}".`,
        )
      }
      const isReversed = wordmark.classList.contains('fill-white')
      if ((color === 'dark' || color === 'grey') !== isReversed) {
        throw new Error(
          `Expected the ${color} header to use the ${
            color === 'dark' || color === 'grey' ? 'reversed' : 'default'
          } logo lockup.`,
        )
      }

      // Same trap, second surface: Badge's primary ink IS the dark header's
      // background, so the version would read as a blank rectangle on it.
      const badge = header.querySelector<HTMLElement>('[data-slot="header-version"]')
      if (!badge) {
        throw new Error(`Expected a version badge inside the ${color} header.`)
      }
      if (getComputedStyle(badge).color === getComputedStyle(header).backgroundColor) {
        throw new Error(`The ${color} header's version badge paints its own surface colour.`)
      }
    }
  },
}

export const Containers: Story = {
  render: () => (
    <div className='space-y-2'>
      <Header id='header-fluid' container='fluid' color='light' sticky={false}>
        <HeaderBrand sitename='fluid — full-bleed (nswds-app parity)' />
      </Header>
      <Header id='header-contained' container='contained' color='light' sticky={false}>
        <HeaderBrand sitename='contained — centred 1200px column' />
      </Header>
      <Header
        id='header-contained-custom'
        container='contained'
        color='light'
        sticky={false}
        style={{ '--header-max-width': '40rem' } as React.CSSProperties}
      >
        <HeaderBrand sitename='contained — custom --header-max-width: 40rem' />
      </Header>
    </div>
  ),
}

export const Brand: Story = {
  name: 'Brand variations',
  render: () => (
    <div className='space-y-2'>
      <Header id='header-brand-logo-only' sticky={false}>
        <HeaderBrand />
      </Header>
      <Header id='header-brand-sitename' sticky={false}>
        <HeaderBrand sitename='Service name' />
      </Header>
      <Header id='header-brand-version' sticky={false}>
        <HeaderBrand sitename='Service name' version='2.1.0' />
      </Header>
      <Header id='header-brand-heading' sticky={false}>
        <HeaderBrand sitename='Site name in the outline' headingLevel={2} />
      </Header>
      <Header id='header-brand-no-logo' sticky={false}>
        <HeaderBrand logo={false} sitename='No logo' />
      </Header>
      <Header id='header-brand-badge-props' sticky={false}>
        <HeaderBrand sitename='Larger version badge' version='2.1.0' badgeProps={{ size: 'lg' }} />
      </Header>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const brands = canvasElement.querySelectorAll<HTMLElement>('[data-slot="header-brand"]')
    if (brands.length !== 6) {
      throw new Error(`Expected 6 brands, got ${brands.length}.`)
    }

    const [, plain, , heading, noLogo, badgeSized] = brands

    // Default: the site name is a span, not a heading — the page's own <h1>
    // belongs to its main content.
    if (plain!.querySelector('h1, h2, h3, h4, h5, h6')) {
      throw new Error('Expected the site name to render as a span unless headingLevel is set.')
    }
    // Opted in: it lands in the outline at the requested level.
    if (!heading!.querySelector('h2')) {
      throw new Error('Expected headingLevel={2} to render an <h2>.')
    }
    // logo={false} removes the mark and its visually-hidden organisation name.
    if (noLogo!.querySelector('svg')) {
      throw new Error('Expected logo={false} to omit the logo.')
    }

    // badgeProps reaches the version Badge, and `lg` resolves to 16px at every
    // viewport — the scale is flat, so this holds whatever width the test runs
    // at. Both halves matter to a service held to a minimum type size: without
    // the passthrough the size is unreachable, and before the scale was
    // flattened `lg` still fell to 14px above 640px.
    const sized = badgeSized!.querySelector<HTMLElement>('[data-slot="header-version"]')
    if (!sized) {
      throw new Error('Expected a version badge in the badgeProps header.')
    }
    const fontSize = getComputedStyle(sized).fontSize
    if (fontSize !== '16px') {
      throw new Error(`Expected badgeProps={{ size: 'lg' }} to render 16px text, got ${fontSize}.`)
    }
  },
}

export const Actions: Story = {
  name: 'With actions',
  render: () => (
    <Header sticky={false}>
      <HeaderBrand sitename='Design System' />
      <DemoActions />
    </Header>
  ),
}

export const Scrolled: Story = {
  name: 'Sticky and scrolled',
  render: () => (
    <div>
      <Header>
        <HeaderBrand sitename='Design System' />
        <DemoActions />
      </Header>
      <div className='h-[200vh] bg-background p-6 text-foreground'>
        Scroll the canvas: the header stays put and gains <code>data-scrolled</code>, which the
        shadow treatment keys off.
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement)

    if (header.hasAttribute('data-scrolled')) {
      throw new Error('Expected no data-scrolled attribute at the top of the page.')
    }

    window.scrollTo(0, 400)
    await waitFor(
      () => window.scrollY > 0,
      'The story canvas did not scroll — the page needs to overflow the viewport.',
    )
    await waitFor(
      () => header.hasAttribute('data-scrolled'),
      'Expected data-scrolled to appear once the page scrolled.',
    )

    window.scrollTo(0, 0)
    await waitFor(
      () => !header.hasAttribute('data-scrolled'),
      'Expected data-scrolled to clear once the page returned to the top.',
    )
  },
}

export const PageChrome: Story = {
  name: 'Page chrome',
  render: () => (
    <div className='relative'>
      <SkipLinks color='dark' />
      <Masthead color='dark' />
      <Header color='white' sticky={false}>
        <HeaderBrand sitename='Design System' version='2.1.0' />
        <DemoActions />
      </Header>
      <main id='content' className='bg-background p-6 text-foreground'>
        SkipLinks, Masthead and Header stack in that order. Tab into the canvas to reveal the skip
        links above the masthead.
      </main>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  args: {
    color: 'dark',
    sticky: false,
    children: <HeaderBrand sitename='Design System' />,
  },
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the dark colour variant resolves
    // bg-primary-800 to a real, non-transparent colour, and the bottom rule
    // resolves through the --header-ink → --header-border color-mix chain.
    const header = getHeader(canvasElement)
    const styles = getComputedStyle(header)

    if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${styles.backgroundColor}". Is globals.css loaded?`,
      )
    }

    const ink = styles.getPropertyValue('--header-ink').trim()
    if (ink === '') {
      throw new Error('Expected the colour variant to declare --header-ink.')
    }

    if (styles.borderBottomColor === '' || styles.borderBottomColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected --header-border to mix down from --header-ink, got "${styles.borderBottomColor}".`,
      )
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  args: {
    children: (
      <>
        <HeaderBrand sitename='Design System' version='2.1.0' />
        <DemoActions />
      </>
    ),
  },
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

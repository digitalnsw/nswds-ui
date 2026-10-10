/**
 * Header — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconDarkMode } from '../icons/dark-mode.js'
import { IconMenu } from '../icons/menu.js'
import { IconSearch } from '../icons/search.js'

import { Button, ButtonLink } from './button.js'
import { Header, HeaderActions, HeaderBrand } from './header.js'

const meta = {
  title: 'Components/Header/Tests',
  component: Header,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    color: 'white',
    container: 'fluid',
    sticky: true,
    border: true,
    shadow: true,
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HEADER_COLORS = ['white', 'light', 'dark', 'grey'] as const

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

// Multi-instance stories pass unique ids: the component defaults to
// id="nsw-header", which is only valid once per page. sticky={false} keeps
// them stacked in the canvas instead of overlapping.
export const Colours: Story = {
  name: 'Colours — logo lockup and badge per surface',
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

/**
 * Every colour deepens in dark mode (DESIGN.md, The Whole-Set Flip Rule): one
 * dark-mode story covering every member of the set, not just the default.
 * Mirrors Masthead's and SkipLink's, so the three chrome surfaces are held to
 * the same contract they are themed together by.
 *
 * Each card pairs the ambient surface with a locally-scoped `.dark`. When the
 * page is already dark the pairing collapses, and the assertion switches to
 * proving the nested `.dark` is idempotent instead.
 */
export const DarkMode: Story = {
  name: 'Dark mode',
  render: () => (
    <div className='space-y-4'>
      {HEADER_COLORS.map((color) => (
        <div
          key={color}
          data-surface-pair=''
          className='overflow-hidden rounded-sm border border-border'
        >
          <div className='border-b border-border bg-muted px-4 py-2 text-base font-medium'>
            {color}
          </div>
          <Header id={`header-pair-${color}`} color={color} sticky={false}>
            <HeaderBrand sitename='Design System' />
          </Header>
          <div className='dark'>
            <Header id={`header-pair-${color}-dark`} color={color} sticky={false}>
              <HeaderBrand sitename='Design System' />
            </Header>
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll<HTMLElement>('[data-surface-pair]')
    if (cards.length !== HEADER_COLORS.length) {
      throw new Error(`Expected ${HEADER_COLORS.length} colour cards, got ${cards.length}.`)
    }

    for (const card of cards) {
      const headers = card.querySelectorAll<HTMLElement>('[data-slot="header"]')
      const [ambient, nested] = headers
      if (!ambient || !nested) {
        throw new Error(`Expected 2 headers per card, got ${headers.length}.`)
      }
      const name = ambient.dataset.color ?? '(unknown)'
      const light = getComputedStyle(ambient).backgroundColor
      const dark = getComputedStyle(nested).backgroundColor

      if (ambient.closest('.dark, [data-theme="dark"]')) {
        if (light !== dark) {
          throw new Error(
            `With the page already dark, the nested .dark changed the "${name}" surface (${dark} vs ${light}) — a .dark inside a .dark must not compound.`,
          )
        }
        continue
      }

      if (light === dark) {
        throw new Error(
          `The "${name}" header renders the same surface (${light}) in both themes — it is not participating in dark mode.`,
        )
      }
    }
  },
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
    if (brands.length !== 5) {
      throw new Error(`Expected 5 brands, got ${brands.length}.`)
    }

    const [, plain, , noLogo, badgeSized] = brands

    // The site name is never a heading: the brand sits ahead of <main>, so a
    // heading here would precede the page's own <h1> in the outline.
    if (plain!.querySelector('h1, h2, h3, h4, h5, h6')) {
      throw new Error('Expected the site name to render as a span, not a heading.')
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

/**
 * An action row that mixes icon buttons with a labelled one. `size="icon"` is
 * the right call when the row is all icons, but it is a flat 40×40 that matches
 * no text step — drop it next to a `ButtonLink` and it sits short. `iconOnly`
 * at the same `size` as the labelled control keeps the row one height.
 */
export const MixedActions: Story = {
  name: 'With mixed actions — one row height',
  render: () => (
    <Header sticky={false}>
      <HeaderBrand sitename='Design System' />
      <HeaderActions>
        <Button
          data-probe='icon-only'
          variant='ghost'
          color='grey'
          size='default'
          iconOnly
          aria-label='Search'
          leadingVisual={IconSearch}
        />
        <Button
          variant='ghost'
          color='grey'
          size='default'
          iconOnly
          aria-label='Switch to dark theme'
          leadingVisual={IconDarkMode}
        />
        {/* `labelWrap={false}` is not incidental. `HeaderActions` is a flex row,
            so a labelled control shrinks when the header is cramped and its
            label wraps to a second line — which makes the row ragged again for
            an entirely different reason than the one this story is about. A
            header action should stay on one line; opt out explicitly. */}
        <ButtonLink
          data-probe='labelled'
          href='#'
          size='default'
          variant='outline'
          labelWrap={false}
        >
          Sign in
        </ButtonLink>
      </HeaderActions>
    </Header>
  ),
  play: async ({ canvasElement }) => {
    const square = canvasElement.querySelector<HTMLElement>('[data-probe="icon-only"]')
    const labelled = canvasElement.querySelector<HTMLElement>('[data-probe="labelled"]')
    if (!square || !labelled) {
      throw new Error('Expected both an icon-only Button and a labelled ButtonLink in the row.')
    }

    const a = square.getBoundingClientRect()
    const b = labelled.getBoundingClientRect()
    if (Math.abs(a.height - b.height) > 0.5) {
      throw new Error(
        `Header action row is ragged: the icon-only Button is ${a.height}px tall, the ButtonLink beside it ${b.height}px.`,
      )
    }
  },
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

export const CssCheck: Story = {
  name: 'CSS check',
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

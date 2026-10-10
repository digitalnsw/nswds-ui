/**
 * SkipLink — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Masthead } from './masthead.js'
import { SkipLink, SkipLinks } from './skip-link.js'

const meta = {
  title: 'Components/SkipLink/Tests',
  component: SkipLinks,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    color: 'dark',
  },
  // The links are invisible until focused, so stories render a page stub with
  // real skip targets.
  render: (args) => (
    <div className='min-h-48'>
      <SkipLinks {...args} />
      <Masthead />
      <div className='space-y-4 p-6'>
        <p className='text-base text-muted-foreground'>
          Click here, then press <kbd>Tab</kbd> to reveal the skip links.
        </p>
        <nav id='nav' aria-label='Main navigation' className='text-base'>
          Navigation landmark (#nav)
        </nav>
        <main id='content' className='text-base'>
          Main content landmark (#content)
        </main>
      </div>
    </div>
  ),
} satisfies Meta<typeof SkipLinks>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** The four curated colours, matching Masthead's set. */
const SKIP_LINK_COLORS = ['dark', 'light', 'white', 'grey'] as const

function getSkipLinks(canvasElement: HTMLElement) {
  const nav = canvasElement.querySelector<HTMLElement>('[data-slot="skip-links"]')
  if (!nav) {
    throw new Error('Could not find an element with [data-slot="skip-links"].')
  }
  return nav
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const CustomLinks: Story = {
  name: 'Custom links',
  play: async ({ canvasElement }) => {
    // Explicit children render exactly as given — the default #nav/#content
    // pair must not be injected alongside composed links.
    const links = [
      ...getSkipLinks(canvasElement).querySelectorAll<HTMLAnchorElement>('[data-slot="skip-link"]'),
    ]
    const hrefs = links.map((link) => link.getAttribute('href'))
    if (hrefs.join() !== '#main-navigation,#main-content,#search') {
      throw new Error(
        `Expected exactly the three composed skip links, found [${hrefs.join(', ')}].`,
      )
    }
  },
  render: (args) => (
    <div className='min-h-48'>
      <SkipLinks {...args}>
        <SkipLink color={args.color} href='#main-navigation'>
          Skip to navigation
        </SkipLink>
        <SkipLink color={args.color} href='#main-content'>
          Skip to content
        </SkipLink>
        <SkipLink color={args.color} href='#search'>
          Skip to search
        </SkipLink>
      </SkipLinks>
      <Masthead />
      <div className='space-y-4 p-6'>
        <p className='text-base text-muted-foreground'>
          Click here, then press <kbd>Tab</kbd> to cycle through three links.
        </p>
        <nav id='main-navigation' aria-label='Main navigation' className='text-base'>
          Navigation landmark
        </nav>
        <main id='main-content' className='text-base'>
          Main content landmark
        </main>
        <div id='search' className='text-base'>
          Search landmark
        </div>
      </div>
    </div>
  ),
}

/**
 * Every colour deepens in dark mode, matching `Masthead` step for step
 * (DESIGN.md, The Whole-Set Flip Rule).
 *
 * Worse here than on the Masthead if it is wrong: the bar is revealed at the
 * moment a keyboard user takes focus, so a pure-white surface on a dark page
 * arrives without warning rather than sitting statically at the top. Three of
 * the four colours used to render identically in both themes, and there was no
 * dark-mode story to show it.
 *
 * The background applies whether or not the bar is revealed, so this asserts
 * the surface directly without needing to move focus.
 */
export const DarkMode: Story = {
  name: 'Dark mode',
  render: () => (
    <div className='space-y-4'>
      {SKIP_LINK_COLORS.map((color) => (
        <div
          key={color}
          data-surface-pair=''
          className='overflow-hidden rounded-sm border border-border'
        >
          <div className='border-b border-border bg-muted px-4 py-2 text-base font-medium'>
            {color}
          </div>
          {/* relative: SkipLink is absolutely positioned and needs a
              positioned ancestor when it is not inside SkipLinks. */}
          <div className='relative h-16 overflow-hidden'>
            <SkipLink color={color} href='#content'>
              Skip to content
            </SkipLink>
          </div>
          <div className='dark relative h-16 overflow-hidden'>
            <SkipLink color={color} href='#content'>
              Skip to content
            </SkipLink>
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll<HTMLElement>('[data-surface-pair]')
    if (cards.length !== SKIP_LINK_COLORS.length) {
      throw new Error(`Expected ${SKIP_LINK_COLORS.length} colour cards, got ${cards.length}.`)
    }

    for (const card of cards) {
      const links = card.querySelectorAll<HTMLElement>('[data-slot="skip-link"]')
      const [ambient, nested] = links
      if (!ambient || !nested) {
        throw new Error(`Expected 2 skip links per card, got ${links.length}.`)
      }
      const light = getComputedStyle(ambient).backgroundColor
      const dark = getComputedStyle(nested).backgroundColor

      if (ambient.closest('.dark, [data-theme="dark"]')) {
        if (light !== dark) {
          throw new Error(
            `With the page already dark, the nested .dark changed the surface (${dark} vs ${light}) — a .dark inside a .dark must not compound.`,
          )
        }
        continue
      }

      if (light === dark) {
        throw new Error(
          `A skip link renders the same surface (${light}) in both themes — it is not participating in dark mode.`,
        )
      }
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the link resolves bg-primary-800 to a
    // real colour and the reveal translate is applied.
    const nav = getSkipLinks(canvasElement)
    const link = nav.querySelector<HTMLElement>('[data-slot="skip-link"]')
    if (!link) throw new Error('Skip link not found.')

    const bg = getComputedStyle(link).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }

    if (link.getBoundingClientRect().bottom > 0) {
      throw new Error(
        'Expected the unfocused skip link to be translated above the viewport. Is globals.css loaded?',
      )
    }

    // The bypass link is the first thing a keyboard or screen-magnifier user
    // meets, so it sits at the body size rather than the legacy 12px.
    const fontSize = parseFloat(getComputedStyle(link).fontSize)
    if (fontSize < 16) {
      throw new Error(`Expected the skip link to render at the 16px body size, got ${fontSize}px.`)
    }

    // Raising the type must not have disturbed the 44px revealed-bar floor.
    const minHeight = parseFloat(getComputedStyle(link).minHeight)
    if (minHeight < 44) {
      throw new Error(`Expected the skip link to hold a 44px minimum height, got ${minHeight}px.`)
    }
  },
}

/**
 * Masthead — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Masthead } from './masthead.js'

const meta = {
  title: 'Components/Masthead/Tests',
  component: Masthead,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    color: 'dark',
    container: 'fluid',
  },
} satisfies Meta<typeof Masthead>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** The four curated colours, in the order they are declared. */
const MASTHEAD_COLORS = ['dark', 'light', 'white', 'grey'] as const

function getMasthead(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="masthead"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="masthead"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Every colour deepens in dark mode, on the same ramp steps `Header` uses
 * (DESIGN.md, The Whole-Set Flip Rule).
 *
 * This story is the guard on that: before it existed there was no dark-mode
 * coverage here at all, and three of the four colours silently rendered
 * identically in both themes — a `white` masthead stayed pure white above a
 * `grey-900` header, an 18.9:1 band across the top of a dark page.
 *
 * Each card pairs the ambient surface with a locally-scoped `.dark` so the two
 * sit side by side. When the toolbar already has the page dark that pairing
 * collapses, and the assertion below switches to proving the nested `.dark` is
 * idempotent instead — a `.dark` inside a `.dark` must not compound.
 */
export const DarkMode: Story = {
  name: 'Dark mode',
  render: (args) => (
    <div className='space-y-4'>
      {MASTHEAD_COLORS.map((color) => (
        <div
          key={color}
          data-surface-pair=''
          className='overflow-hidden rounded-sm border border-border'
        >
          <div className='border-b border-border bg-muted px-4 py-2 text-base font-medium'>
            {color}
          </div>
          <Masthead {...args} id={`masthead-${color}`} color={color} />
          <div className='dark'>
            <Masthead {...args} id={`masthead-${color}-dark`} color={color} />
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll<HTMLElement>('[data-surface-pair]')
    if (cards.length !== MASTHEAD_COLORS.length) {
      throw new Error(`Expected ${MASTHEAD_COLORS.length} colour cards, got ${cards.length}.`)
    }

    for (const card of cards) {
      const strips = card.querySelectorAll<HTMLElement>('[data-slot="masthead"]')
      const [ambient, nested] = strips
      if (!ambient || !nested) {
        throw new Error(`Expected 2 mastheads per card, got ${strips.length}.`)
      }
      const name = ambient.dataset.color ?? '(unknown)'
      const light = getComputedStyle(ambient).backgroundColor
      const dark = getComputedStyle(nested).backgroundColor

      // Ask the DOM, not the toolbar global: it is the ancestor marker that
      // decides how these render, and a consumer may set [data-theme='dark'].
      if (ambient.closest('.dark, [data-theme="dark"]')) {
        if (light !== dark) {
          throw new Error(
            `With the page already dark, the nested .dark changed the "${name}" surface (${dark} vs ${light}) — a .dark inside a .dark must not compound.`,
          )
        }
        continue
      }

      // The regression guard. Three of these four used to be identical.
      if (light === dark) {
        throw new Error(
          `The "${name}" masthead renders the same surface (${light}) in both themes — it is not participating in dark mode.`,
        )
      }
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the dark colour variant resolves
    // bg-primary-800 to a real, non-transparent colour.
    const masthead = getMasthead(canvasElement)
    const bg = getComputedStyle(masthead).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

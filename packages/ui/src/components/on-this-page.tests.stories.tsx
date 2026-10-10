/**
 * OnThisPage — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { OnThisPage } from './on-this-page.js'

const ITEMS = [
  { id: 'specimen', title: 'Specimen' },
  { id: 'try', title: 'Try it' },
  { id: 'download', title: 'Download' },
  { id: 'install', title: 'Install' },
]

const meta = {
  title: 'Components/OnThisPage/Tests',
  component: OnThisPage,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    items: ITEMS,
  },
} satisfies Meta<typeof OnThisPage>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNav(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="on-this-page"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="on-this-page"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const CssCheck: Story = {
  name: 'CSS check',
  render: () => <OnThisPage items={ITEMS} orientation='horizontal' activeId='specimen' />,
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement)

    // The horizontal bar must be its own scroll container, or a long list of
    // sections overflows the page instead of scrolling within the bar.
    const overflowX = getComputedStyle(nav).overflowX
    if (overflowX !== 'auto' && overflowX !== 'scroll') {
      throw new Error(`Expected the horizontal bar to scroll, received overflow-x "${overflowX}".`)
    }

    // Active state must not be colour-only: the marker rule carries it too.
    const active = nav.querySelector<HTMLElement>('[data-active]')
    if (!active) {
      throw new Error('Could not find the active entry.')
    }
    const borderWidth = getComputedStyle(active).borderBottomWidth
    if (borderWidth !== '2px') {
      throw new Error(`Expected a 2px marker rule on the active entry, received "${borderWidth}".`)
    }
  },
}

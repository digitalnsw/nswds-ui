/**
 * Header — Accessibility
 *
 * One story per WCAG 2.2 criterion the header has to meet, each asserting it
 * in play(). The header is the page's banner landmark and its home link, so
 * these pin the structure a screen reader user navigates by, the name of that
 * link, a keyboard path through the row, and legibility on all four surfaces.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { IconDarkMode } from '../icons/dark-mode.js'
import { IconSearch } from '../icons/search.js'

import { Button } from './button.js'
import { Header, HeaderActions, HeaderBrand } from './header.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const HEADER_COLORS = ['white', 'light', 'dark', 'grey'] as const

const sitename = 'Department of Primary Industries'

const meta = {
  title: 'Components/Header/Accessibility',
  component: Header,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The opaque colour behind an element, compositing translucent layers — the
 * version badge's soft fill is a tint over the header.
 */
function effectiveBackground(element: Element): string {
  const layers: string[] = []
  for (let el: Element | null = element; el; el = el.parentElement) {
    const bg = getComputedStyle(el).backgroundColor
    if (resolveColor(bg).a === 0) continue
    layers.push(bg)
    if (resolveColor(bg).a >= 1) break
  }
  const base = layers.length && resolveColor(layers.at(-1)!).a >= 1 ? layers.pop()! : 'white'
  let backdrop = resolveColor(base)
  for (const layer of layers.reverse())
    backdrop = { ...compositeOver(resolveColor(layer), backdrop), a: 1 }
  return `rgb(${Math.round(backdrop.r)}, ${Math.round(backdrop.g)}, ${Math.round(backdrop.b)})`
}

/** A header with a brand, a version and two site-wide controls. */
function SiteHeader() {
  return (
    <Header sticky={false}>
      <HeaderBrand sitename={sitename} version='2.1.0' />
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
      </HeaderActions>
    </Header>
  )
}

/** All four surfaces, each with a unique id (the default is valid once per page). */
function AllSurfaces() {
  return (
    <div className='space-y-2'>
      {HEADER_COLORS.map((color) => (
        <Header key={color} id={`header-a11y-${color}`} color={color} sticky={false}>
          <HeaderBrand sitename={`${sitename} (${color})`} version='2.1.0' />
        </Header>
      ))}
    </div>
  )
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: "Screen reader users move around a page by landmark and by heading. The header has to be findable as the banner, and must not put the site name into the heading outline ahead of the page's own title.",
          how: 'List landmarks: "banner" comes first. List headings: the first is the page\'s h1, "Apply for a recreational fishing licence" — the site name is not a heading. The play() asserts the banner landmark, that it holds no heading, and that the first heading on the page is the h1.',
          caveat:
            'The banner role comes from the native <header>, which only carries it outside <main>, <article> and similar sectioning elements. Render Header at the top of the body.',
        }),
      },
    },
  },
  render: () => (
    <>
      <SiteHeader />
      <main className='px-6 py-6'>
        <h1 className='text-2xl font-bold'>Apply for a recreational fishing licence</h1>
      </main>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const banner = canvas.getByRole('banner')
    await expect(within(banner).queryAllByRole('heading')).toHaveLength(0)
    const [first] = canvas.getAllByRole('heading')
    await expect(first).toHaveProperty('tagName', 'H1')
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'The brand is a link home whose visible content is mostly a logo, and the version is a bare number. Both need names that make sense out loud.',
          how: 'Read the header: a link, "NSW Government Department of Primary Industries"; then "Version 2.1.0"; then the "Search" and "Switch to dark theme" buttons. The play() asserts the link\'s name, that the version is outside the link (so it is never part of the link\'s name) and announced with its label, and that each action is a named button.',
          caveat:
            'With no logo and no sitename the link has no name; HeaderBrand warns in development and takes a label prop for that case.',
        }),
      },
    },
  },
  render: () => <SiteHeader />,
  play: async ({ canvasElement }) => {
    const banner = within(canvasElement).getByRole('banner')
    const home = within(banner).getByRole('link')
    await expect(home).toHaveAccessibleName(`NSW Government ${sitename}`)
    await expect(home).toHaveAttribute('href', '/')
    const version = banner.querySelector('[data-slot="header-version"]')!
    await expect(home).not.toContainElement(version as HTMLElement)
    await expect(version).toHaveTextContent('Version 2.1.0')
    await expect(within(banner).getByRole('button', { name: 'Search' })).toBeInTheDocument()
    await expect(
      within(banner).getByRole('button', { name: 'Switch to dark theme' }),
    ).toBeInTheDocument()
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Everything in the header — the way home and the site-wide controls — has to work without a pointer.',
          how: 'Press Tab: the home link, then Search, then the theme switch, in reading order. The play() walks the row and asserts each stop.',
          caveat:
            "The controls are the consumer's. Use Button or ButtonLink in HeaderActions and they inherit keyboard support; a hand-rolled control does not.",
        }),
      },
    },
  },
  render: () => <SiteHeader />,
  play: async ({ canvasElement }) => {
    const banner = within(canvasElement).getByRole('banner')
    for (const stop of [
      within(banner).getByRole('link'),
      within(banner).getByRole('button', { name: 'Search' }),
      within(banner).getByRole('button', { name: 'Switch to dark theme' }),
    ]) {
      await userEvent.tab()
      await expect(stop).toHaveFocus()
    }
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'The home link has no underline or fill of its own, so focus is the only thing that marks it as the current stop.',
          how: "Tab to the brand on each surface: a 2px ring in the surface's own text colour, offset from the lockup. The play() asserts the ring on all four surfaces and measures it against the header at 3:1.",
          caveat:
            'The ring is outline-current, so it follows the surface ink in every colour and both themes without a colour of its own.',
        }),
      },
    },
  },
  render: () => <AllSurfaces />,
  play: async ({ canvasElement }) => {
    for (const header of canvasElement.querySelectorAll<HTMLElement>('[data-slot="header"]')) {
      const home = within(header).getByRole('link')
      await userEvent.tab()
      await expect(home).toHaveFocus()
      await waitFor(() => expect(getComputedStyle(home).outlineStyle).not.toBe('none'))
      const style = getComputedStyle(home)
      await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
      expectContrast(style.outlineColor, getComputedStyle(header).backgroundColor, {
        minimum: 3,
        label: `Focus ring on the ${header.dataset.color} header`,
      })
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: "The site name and version are the header's only text, on four surfaces that each change in dark mode.",
          how: 'All four surfaces are shown. The play() measures each site name against its header and holds it to the 7:1 the pairs are designed to, and measures each version badge against its fill over the header at 4.5:1. On dark and grey the badge switches itself to white so it never matches the surface.',
          caveat: 'The (dark) story measures the dark-mode surfaces.',
        }),
      },
    },
  },
  render: () => <AllSurfaces />,
  play: async ({ canvasElement }) => {
    const headers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="header"]')
    await expect(headers).toHaveLength(HEADER_COLORS.length)
    for (const header of headers) {
      const color = header.dataset.color
      const name = within(header).getByText(new RegExp(`\\(${color}\\)$`))
      expectContrast(getComputedStyle(name).color, getComputedStyle(header).backgroundColor, {
        minimum: 7,
        label: `Site name on the ${color} header`,
      })
      const badge = header.querySelector<HTMLElement>('[data-slot="header-version"]')!
      expectContrast(getComputedStyle(badge).color, effectiveBackground(badge), {
        label: `Version badge on the ${color} header`,
      })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

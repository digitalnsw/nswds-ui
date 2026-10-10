/**
 * SideNav — Accessibility
 *
 * One story per WCAG 2.2 criterion the rail has to meet, each asserting it in
 * play(). Disclosure semantics come from Base UI's Collapsible; these pin the
 * parts a consumer relies on — a named landmark of headed lists, branches
 * that announce their state, an announced current page, keyboard operation,
 * a visible focus ring and readable rows in both themes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { SideNav, type SideNavItem } from './side-nav.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const sections: SideNavItem[] = [
  { title: 'Overview', href: '#overview' },
  {
    title: 'Fishing licences',
    links: [
      { title: 'Who needs a licence', href: '#who-needs' },
      { title: 'Buy a licence', href: '#buy' },
      {
        title: 'Exemptions',
        links: [
          { title: 'Pensioners', href: '#pensioners' },
          { title: 'Aboriginal fishers', href: '#aboriginal-fishers' },
        ],
      },
    ],
  },
  {
    title: 'Rules',
    links: [
      { title: 'Bag and size limits', href: '#limits' },
      { title: 'Closed waters', href: '#closed-waters' },
    ],
  },
]

const meta = {
  title: 'Components/SideNav/Accessibility',
  component: SideNav,
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  args: { sections, currentHref: '#buy' },
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

/**
 * The opaque colour an element sits on: its own and its ancestors'
 * backgrounds composited from the first opaque one up. The current row's
 * highlight is translucent, so its text is measured against the highlight
 * over the page.
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

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user needs to tell the rail from the page’s other navigation, know which rows open and close and whether they are open, and hear which page they are on.',
          how: 'The rail is a nav landmark named “Section navigation”. Branch rows are buttons with aria-expanded; leaves are links; the link matching currentHref carries aria-current="page". The play() asserts each, then opens a closed branch and checks its state flips.',
          caveat:
            'A branch row is never a link, so an item with both href and links loses its href; the component warns in development.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('navigation', { name: 'Section navigation' })
    await expect(canvas.getByRole('link', { name: 'Buy a licence' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(canvas.getByRole('link', { name: 'Who needs a licence' })).not.toHaveAttribute(
      'aria-current',
    )

    const branch = canvas.getByRole('button', { name: 'Exemptions' })
    await expect(branch).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(branch)
    await waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'true'))
    await expect(canvas.getByRole('link', { name: 'Pensioners' })).toBeVisible()
  },
}

// ─── 1.3.1 — Info and Relationships ──────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The rail’s grouping has to reach assistive technology: each section is a heading over a list of its pages, and a branch’s pages are a list nested in it.',
          how: 'The play() asserts one heading per headed section at headingLevel (h2 by default, h3 here), each followed by a list, and that an open branch holds a nested list.',
          caveat:
            'The lists carry role="list" because Safari drops list semantics when list-style is removed. Step headingLevel down when the rail sits under another heading.',
        }),
      },
    },
  },
  args: { headingLevel: 3 },
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Section navigation' })
    const headings = within(nav).getAllByRole('heading', { level: 3 })
    await expect(headings.map((h) => h.textContent)).toEqual(['Fishing licences', 'Rules'])
    for (const heading of headings) {
      await expect(heading.nextElementSibling).toHaveAttribute('role', 'list')
    }
    const branch = within(nav).getByRole('button', { name: 'Exemptions' })
    await userEvent.click(branch)
    const nested = await waitFor(() =>
      within(branch.closest('li')!).getByRole('list', { hidden: false }),
    )
    await expect(within(nested).getAllByRole('listitem')).toHaveLength(2)
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
          why: 'Opening a branch and following its links has to work from the keyboard alone.',
          how: 'Tab along the rail to the closed Exemptions branch and press Enter: it opens and Tab reaches its first link. Press Space on the branch: it closes. The play() drives each step with the keyboard.',
          caveat:
            'Rows are in plain tab order — Tab and Shift+Tab, not arrow keys — which suits a rail of links read top to bottom.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const branch = canvas.getByRole('button', { name: 'Exemptions' })
    // Overview, Fishing licences' two links, then the branch.
    for (let i = 0; i < 4; i++) await userEvent.tab()
    await expect(branch).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'true'))
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Pensioners' })).toHaveFocus()

    await userEvent.tab({ shift: true })
    await expect(branch).toHaveFocus()
    await userEvent.keyboard(' ')
    await waitFor(() => expect(branch).toHaveAttribute('aria-expanded', 'false'))
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7 / 1.4.11',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '1.4.11'],
          why: 'A keyboard user must always see which row has focus.',
          how: 'Tab to the first link, then the current link. The play() asserts a 2px solid outline in the row’s own text colour, offset 2px, and measures it at 3:1 or more against what the row sits on.',
          caveat:
            'The ring is outline-current, so it follows the row’s ink — including the current row’s primary ink and every dark-mode colour.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const overview = canvas.getByRole('link', { name: 'Overview' })
    await expect(overview).toHaveFocus()
    for (const row of [overview, canvas.getByRole('link', { name: 'Buy a licence' })]) {
      row.focus()
      const style = getComputedStyle(row)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(style.outlineOffset).toBe('2px')
      await waitFor(() => expect(getComputedStyle(row).outlineColor).toBe(style.color))
      expectContrast(style.outlineColor, effectiveBackground(row.parentElement!), {
        minimum: 3,
        label: `${row.textContent} focus ring`,
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
          why: 'Every row and heading has to be readable, including the current row on its tinted highlight.',
          how: 'The play() opens every branch, then measures each heading, link and branch row against what it actually sits on — compositing the current row’s translucent highlight over the page — and holds each to 4.5:1.',
          caveat:
            'Rows step from 16px to 14px from the sm breakpoint up, so they are held to the normal-text ratio. The dark story repeats every check.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Section navigation' })
    const branch = within(nav).getByRole('button', { name: 'Exemptions' })
    await userEvent.click(branch)
    await waitFor(() => expect(within(nav).getByRole('link', { name: 'Pensioners' })).toBeVisible())
    const rows = nav.querySelectorAll<HTMLElement>(
      '[data-slot="side-nav-heading"], [data-slot="side-nav-link"], [data-slot="side-nav-trigger"]',
    )
    // Two headings, seven links and the one branch row.
    await expect(rows.length).toBe(10)
    for (const row of rows) {
      expectContrast(getComputedStyle(row).color, effectiveBackground(row), {
        label: row.textContent ?? '',
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

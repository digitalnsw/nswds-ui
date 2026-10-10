/**
 * TabNav — Accessibility
 *
 * One story per WCAG 2.2 criterion the bar has to meet, each asserting it in
 * play(). TabNav is a nav landmark over a list of ordinary links, so these
 * pin that shape — a named landmark, a real list, one announced current page,
 * plain Tab order that reaches tabs scrolled out of view — plus a visible
 * focus ring and readable tabs and marker in both themes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'
import { TabNav, TabNavLink } from './tab-nav.js'

const PAGES = [
  { href: '#overview', title: 'Overview' },
  { href: '#who-needs-one', title: 'Who needs a licence' },
  { href: '#fees', title: 'Fees and exemptions' },
  { href: '#apply', title: 'Apply or renew' },
  { href: '#replace', title: 'Replace a lost licence' },
]

const meta = {
  title: 'Components/TabNav/Accessibility',
  component: TabNav,
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  args: { currentHref: '#fees', 'aria-label': 'Recreational fishing licence' },
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

/**
 * The opaque colour an element sits on: its own and its ancestors'
 * backgrounds composited from the first opaque one up.
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
          why: 'A screen reader user has to recognise the bar as navigation, tell it from the page’s other navigation, and hear which page they are on — without being promised tab panels that do not exist.',
          how: 'The play() asserts a nav landmark with the section’s name, every tab a link, exactly one carrying aria-current="page", and no tab or tablist roles.',
          caveat:
            'The landmark defaults to “Subsection navigation”; name it after the section, as here, so a page with several navs reads clearly.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: 'Recreational fishing licence' })
    await expect(within(nav).getAllByRole('link')).toHaveLength(PAGES.length)
    await expect(canvas.getByRole('link', { name: 'Fees and exemptions' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(nav.querySelectorAll('[aria-current]')).toHaveLength(1)
    await expect(canvas.queryByRole('tab')).toBeNull()
    await expect(canvas.queryByRole('tablist')).toBeNull()
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
          why: 'The tabs are a set of peer pages, so assistive technology should hear them as one list and be told how many there are.',
          how: 'The play() asserts the landmark holds one list with a list item per tab, each holding its link.',
          caveat:
            'The list carries role="list" because Safari drops list semantics when list-style is removed.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation')
    const list = within(nav).getByRole('list')
    const items = within(list).getAllByRole('listitem')
    await expect(items).toHaveLength(PAGES.length)
    for (const [i, item] of items.entries()) {
      await expect(within(item).getByRole('link')).toHaveTextContent(PAGES[i]!.title)
    }
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
          why: 'Every tab has to be reachable from the keyboard, including tabs scrolled out of a narrow bar.',
          how: 'The bar is squeezed so its last tabs overflow. Tab through it: each link takes focus in order, the overflowed ones included. The play() asserts the overflow and the focus order.',
          caveat:
            'Tabs are plain links in Tab order, not a roving arrow-key group — that pattern belongs to ARIA tabs, which this is not.',
        }),
      },
    },
  },
  render: (args) => (
    <div className='max-w-xs'>
      <TabNav {...args}>
        {PAGES.map((page) => (
          <TabNavLink key={page.href} href={page.href}>
            {page.title}
          </TabNavLink>
        ))}
      </TabNav>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation')
    await expect(nav.scrollWidth).toBeGreaterThan(nav.clientWidth)
    const last = canvas.getByRole('link', { name: PAGES.at(-1)!.title })
    await expect(last.getBoundingClientRect().left).toBeGreaterThan(
      nav.getBoundingClientRect().right,
    )
    for (const page of PAGES) {
      await userEvent.tab()
      await expect(canvas.getByRole('link', { name: page.title })).toHaveFocus()
    }
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

const focusStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '1.4.11'],
          why: 'A keyboard user must always see which tab has focus.',
          how: 'Tab to the first tab, then focus the current one. The play() asserts a 2px solid outline drawn inside the tab and measures it at 3:1 or more against the tab’s background.',
          caveat:
            'The ring is inset because the bar scrolls sideways, and a scroll container clips anything drawn outside a child’s box. The dark story repeats the check.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const first = canvas.getByRole('link', { name: PAGES[0]!.title })
    await expect(first).toHaveFocus()
    for (const tab of [first, canvas.getByRole('link', { name: 'Fees and exemptions' })]) {
      tab.focus()
      const style = getComputedStyle(tab)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(style.outlineOffset).toBe('-2px')
      // The ring transitions in with the tab's colours; wait for it to land.
      await waitFor(() =>
        expectContrast(getComputedStyle(tab).outlineColor, effectiveBackground(tab), {
          minimum: 3,
          label: `${tab.textContent} focus ring`,
        }),
      )
    }
  },
}

export const FocusVisible: Story = { ...focusStory, name: 'Focus Visible — 2.4.7 / 1.4.11' }

export const FocusVisibleDark: Story = {
  ...focusStory,
  name: 'Focus Visible — 2.4.7 / 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['1.4.3', '1.4.11'],
          why: 'Every tab label must be readable, and the current tab’s marker rule is the only thing besides colour that shows which page is current, so it must stand out too.',
          how: 'The play() measures each tab’s text against its background at 4.5:1, and the current tab’s 2px marker against the page at 3:1.',
          caveat: 'The dark story repeats every check.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation')
    for (const tab of within(nav).getAllByRole('link')) {
      expectContrast(getComputedStyle(tab).color, effectiveBackground(tab), {
        label: tab.textContent ?? '',
      })
    }
    const current = within(nav).getByRole('link', { name: 'Fees and exemptions' })
    const marker = getComputedStyle(current)
    await expect(marker.borderBottomWidth).toBe('2px')
    expectContrast(marker.borderBottomColor, effectiveBackground(current), {
      minimum: 3,
      label: 'Current tab marker',
    })
  },
}

export const ContrastMinimum: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 / 1.4.11',
}

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 / 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

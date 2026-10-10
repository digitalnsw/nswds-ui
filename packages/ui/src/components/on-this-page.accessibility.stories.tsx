/**
 * OnThisPage — Accessibility
 *
 * One story per WCAG 2.2 criterion the component has to meet, each asserting
 * it in play(). The entries are plain anchors, so focus and keyboard are
 * native; these pin what the component adds — a named landmark over a real
 * list, the reader's position announced as a location rather than a page, a
 * marker that is not colour alone, a visible focus ring and readable entries
 * in both themes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { OnThisPage } from './on-this-page.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const ITEMS = [
  { id: 'who-can-apply', title: 'Who can apply' },
  { id: 'what-you-need', title: 'What you need' },
  { id: 'how-to-apply', title: 'How to apply' },
  { id: 'after-you-apply', title: 'After you apply' },
]

const meta = {
  title: 'Components/OnThisPage/Accessibility',
  component: OnThisPage,
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  // Controlled, so the marked entry does not depend on the canvas's scroll.
  args: { items: ITEMS, activeId: 'how-to-apply' },
  render: (args) => (
    <div className='space-y-10'>
      <OnThisPage {...args} aria-label='On this page, bar' />
      <OnThisPage {...args} orientation='vertical' aria-label='On this page, rail' />
    </div>
  ),
} satisfies Meta<typeof OnThisPage>

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

/** The width and colour of the marker rule each orientation draws. */
function marker(link: HTMLElement) {
  const style = getComputedStyle(link)
  return link.closest('[data-orientation="vertical"]')
    ? { width: style.borderInlineStartWidth, color: style.borderInlineStartColor }
    : { width: style.borderBottomWidth, color: style.borderBottomColor }
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2 / 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['4.1.2', '1.3.1'],
          why: 'A screen reader user has to find the in-page links, tell them from the site’s navigation, and hear which section they have reached.',
          how: 'Each bar is a nav landmark with its own name, holding a list of links. The entry for the section reached carries aria-current="location" — not "page", since every entry points at the page already open. The play() asserts each, in both orientations.',
          caveat:
            'The default name is “On this page”. A page with both a bar and a rail, as here, needs a different name on each.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['On this page, bar', 'On this page, rail']) {
      const nav = canvas.getByRole('navigation', { name })
      const list = within(nav).getByRole('list')
      await expect(within(list).getAllByRole('listitem')).toHaveLength(ITEMS.length)
      const links = within(list).getAllByRole('link')
      await expect(links.map((link) => link.getAttribute('href'))).toEqual(
        ITEMS.map(({ id }) => `#${id}`),
      )
      const current = nav.querySelectorAll('[aria-current]')
      await expect(current).toHaveLength(1)
      await expect(current[0]).toHaveAttribute('aria-current', 'location')
      await expect(current[0]).toHaveTextContent('How to apply')
    }
  },
}

// ─── 1.4.1 — Use of Color ─────────────────────────────────────────────────────

export const UseOfColor: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'A reader who cannot tell the primary ink from the body text still has to see which section they are in.',
          how: 'The current entry draws a 2px marker rule — under it in the bar, beside it in the rail — that the other entries draw in transparent. The play() asserts the current marker is painted and every other one is not.',
          caveat:
            'The idle rule is drawn transparent rather than left off, so becoming current never changes an entry’s size.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    for (const link of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="on-this-page-link"]',
    )) {
      const { width, color } = marker(link)
      await expect(width).toBe('2px')
      const painted = resolveColor(color).a > 0
      await expect(painted).toBe(link.hasAttribute('aria-current'))
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
          why: 'Every entry has to be reachable from the keyboard, so a keyboard reader can jump to any section.',
          how: 'Tab through the bar: each entry takes focus in document order. The play() asserts the order.',
          caveat:
            'The entries are plain anchors, so Enter follows them natively; nothing is added or overridden.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'On this page, bar' })
    for (const { title } of ITEMS) {
      await userEvent.tab()
      await expect(within(nav).getByRole('link', { name: title })).toHaveFocus()
    }
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

const focusStory: Story = {
  // CI's real pointer can rest wherever the previous story left it — over the
  // first entry here — and paint a genuine :hover tint under the ring, which
  // this rest-state contrast check would misread. Focus is driven from the
  // keyboard and .focus(), so the pointer is switched off for the canvas.
  decorators: [
    (Story) => (
      <div className='pointer-events-none'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '1.4.11'],
          why: 'A keyboard user must always see which entry has focus.',
          how: 'Tab to the first entry, then focus the current one and each rail entry. The play() asserts a 2px solid outline drawn inside the entry and measures it at 3:1 or more against what the entry sits on.',
          caveat:
            'The ring is inset because the bar scrolls sideways, and a scroll container clips anything drawn outside a child’s box. The dark story repeats the check.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    const links = [
      ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="on-this-page-link"]'),
    ]
    await expect(links[0]).toHaveFocus()
    for (const link of links) {
      link.focus()
      const style = getComputedStyle(link)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(style.outlineOffset).toBe('-2px')
      // The ring transitions in with the entry's colours; wait for it to land.
      await waitFor(() =>
        expectContrast(getComputedStyle(link).outlineColor, effectiveBackground(link), {
          minimum: 3,
          label: `${link.textContent} focus ring`,
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
          why: 'Every entry must be readable, and the current entry’s marker must stand out from the page.',
          how: 'The play() measures each entry’s text against what it sits on at 4.5:1, and the current marker in both orientations at 3:1.',
          caveat: 'The dark story repeats every check.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    for (const link of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="on-this-page-link"]',
    )) {
      expectContrast(getComputedStyle(link).color, effectiveBackground(link), {
        label: link.textContent ?? '',
      })
      if (link.hasAttribute('aria-current')) {
        expectContrast(marker(link).color, effectiveBackground(link), {
          minimum: 3,
          label: `${link.textContent} marker`,
        })
      }
    }
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

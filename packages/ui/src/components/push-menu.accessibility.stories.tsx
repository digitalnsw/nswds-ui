/**
 * PushMenu — Accessibility
 *
 * One story per WCAG 2.2 criterion the menu has to meet, each asserting it in
 * play(). The menu manages its own focus, inert levels and live region (see
 * push-menu.tsx); these pin the parts a reader relies on — a named landmark,
 * drill-in rows that say they open a submenu, focus that follows the level,
 * an announced level change, a visible focus ring, readable rows in both
 * themes and 44px rows.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { PushMenu, type PushMenuItem } from './push-menu.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const navigation: PushMenuItem[] = [
  {
    id: 'services',
    title: 'Services',
    links: [
      { id: 'opal', title: 'Opal cards', href: '#opal' },
      { id: 'rego', title: 'Vehicle registration', href: '#rego' },
    ],
  },
  { id: 'about', title: 'About us', href: '#about' },
  { id: 'contact', title: 'Contact', href: '#contact' },
]

const meta = {
  title: 'Components/PushMenu/Accessibility',
  component: PushMenu,
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  args: { navigation, title: 'Menu', currentHref: '#about' },
  decorators: [
    (Story) => (
      <div className='h-96 w-72 overflow-hidden rounded-md ring-1 ring-foreground/10'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PushMenu>

export default meta

type Story = StoryObj<typeof meta>

const level = (canvasElement: HTMLElement, depth: number) =>
  canvasElement.querySelectorAll<HTMLElement>('[data-slot="push-menu-level"]')[depth - 1]

/**
 * The opaque colour an element sits on: its own and its ancestors'
 * backgrounds composited from the first opaque one up. The current row's tint
 * is translucent, so its text is measured against the tint over the menu.
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
          why: 'A screen reader user has to tell a row that opens a submenu from a link that leaves the page, and hear which page they are on.',
          how: 'The menu is a nav landmark named by its title. A drill-in row is a button whose name ends “submenu”; a leaf is a link; the link matching currentHref carries aria-current="page". The play() asserts each.',
          caveat:
            'The chevron is hidden from assistive technology, so the “submenu” suffix carries the difference; change it with submenuLabel, never remove it without another cue.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('navigation', { name: 'Menu' })
    await expect(canvas.getByRole('button', { name: 'Services submenu' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'About us' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(canvas.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1 / 2.4.3',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.1.1', '2.4.3'],
          why: 'Drilling in and coming back out has to work from the keyboard, and focus must land where the reader is rather than falling to the page.',
          how: 'Tab to Services and press Enter: the next level slides in with focus on its Back button. Press Enter on Back: the first level returns with focus on Services. Drill in again and press Escape: it steps back one level. The play() asserts each focus move.',
          caveat:
            'Escape at the top level is left to bubble, so inside a Sheet it still closes the drawer. escapeGoesBack={false} gives plain dialog behaviour at every level.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Queried fresh each time: a level's rows re-render as it slides.
    const services = () =>
      within(level(canvasElement, 1)!).getByRole('button', { name: 'Services submenu' })
    // The Back button of whichever level is showing (the one not inert).
    const back = () =>
      within(
        canvasElement.querySelector<HTMLElement>('[data-slot="push-menu-level"]:not([inert])')!,
      ).getByRole('button', { name: 'Back' })

    await userEvent.tab()
    await expect(services()).toHaveFocus()

    // The menu ignores navigation until a slide has settled, as a reader
    // would see it do; wait for that before each next key.
    const settled = () =>
      waitFor(() => expect(canvasElement.querySelector('[data-animating]')).toBeNull())

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(back()).toHaveFocus())
    await expect(level(canvasElement, 1)).toHaveAttribute('inert')
    await settled()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(services()).toHaveFocus())
    await settled()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(back()).toHaveFocus())
    await settled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(services()).toHaveFocus())
  },
}

// ─── 4.1.3 — Status Messages ──────────────────────────────────────────────────

export const StatusMessages: Story = {
  name: 'Status Messages — 4.1.3',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.3',
          why: 'A level change replaces the whole list. A screen reader user must be told where they have arrived without focus being taken from them to say so.',
          how: 'A single polite live region holds the current level’s title, with its level number below the top. The play() drills into Services and asserts the region reads “Services, level 2”, then goes back and asserts “Menu”.',
          caveat:
            'The region is mounted once at the root: a live attribute on each level’s freshly mounted heading would not be announced reliably.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const live = canvasElement.querySelector<HTMLElement>('[data-slot="push-menu-live-region"]')
    await expect(live).toHaveAttribute('aria-live', 'polite')
    await expect(live).toHaveTextContent('Menu')

    within(level(canvasElement, 1)!).getByRole('button', { name: 'Services submenu' }).click()
    await waitFor(() => expect(live).toHaveTextContent('Services, level 2'))

    // Back takes clicks once the slide has settled (rows ignore the pointer mid-slide).
    const back = within(level(canvasElement, 2)!).getByRole('button', { name: 'Back' })
    await waitFor(() => expect(getComputedStyle(back).pointerEvents).not.toBe('none'))
    await userEvent.click(back)
    await waitFor(() => expect(live!.textContent).toBe('Menu'))
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
          how: 'Tab to the first row, then focus the current row. The play() asserts a 2px solid outline drawn inside the row and measures it at 3:1 or more against what the row sits on, including the current row’s tint.',
          caveat:
            'The ring is inset because each level scrolls inside the menu’s clipped frame, which would cut off a ring drawn outside the row.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const services = canvas.getByRole('button', { name: 'Services submenu' })
    await expect(services).toHaveFocus()
    for (const row of [services, canvas.getByRole('link', { name: 'About us' })]) {
      row.focus()
      const style = getComputedStyle(row)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(style.outlineOffset).toBe('-2px')
      // The ring's colour transitions in with the row's colours; wait for it to land.
      await waitFor(() =>
        expectContrast(getComputedStyle(row).outlineColor, effectiveBackground(row), {
          minimum: 3,
          label: `${row.textContent} focus ring`,
        }),
      )
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
          why: 'Every row has to be readable, the current row included, on the menu’s popover surface.',
          how: 'The play() measures the level title and each row against what it actually sits on — compositing the current row’s translucent tint over the menu — and holds each to 4.5:1.',
          caveat: 'The dark story repeats every check.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const top = level(canvasElement, 1)!
    const texts = top.querySelectorAll<HTMLElement>(
      '[data-slot="push-menu-title"], [data-slot="push-menu-item"], [data-slot="push-menu-link"]',
    )
    await expect(texts.length).toBe(4)
    for (const el of texts) {
      expectContrast(getComputedStyle(el).color, effectiveBackground(el), {
        label: el.textContent ?? '',
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

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSizeMinimum: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'The menu is for phones, so every row has to be easy to hit with a thumb.',
          how: 'The play() measures every row on the first level: each is the drawer’s full width and at least 44px tall, well over the 24px minimum.',
          caveat:
            'Rows wrap long labels rather than truncating them, so a row grows taller, never shorter.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const rows = level(canvasElement, 1)!.querySelectorAll<HTMLElement>(
      '[data-slot="push-menu-item"], [data-slot="push-menu-link"]',
    )
    await expect(rows.length).toBe(navigation.length)
    for (const row of rows) {
      const { width, height } = row.getBoundingClientRect()
      await expect(height).toBeGreaterThanOrEqual(44)
      await expect(width).toBeGreaterThanOrEqual(24)
    }
  },
}

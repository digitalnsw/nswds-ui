/**
 * SiteSearch — Accessibility
 *
 * One story per WCAG 2.2 criterion the palette has to meet, each asserting it
 * in play(). The panel is a Base UI Dialog and the search a Base UI
 * Autocomplete; these pin what a consumer relies on — names and roles, the
 * keyboard path from trigger to result, where focus goes, the empty-state
 * announcement and the size of the targets.
 *
 * The panel renders through a portal, so play() queries `document`.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { SiteSearch, type SiteSearchGroup, type SiteSearchItem } from './site-search.js'
import { closeOverlay, waitForUnmount, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/SiteSearch/Accessibility',
  component: SiteSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiteSearch>

export default meta

// Every story renders its own example, so none takes the component's
// required props as args.
type Story = StoryObj

const groups: SiteSearchGroup[] = [
  {
    title: 'Driving and transport',
    items: [
      { title: 'Renew a driver licence', href: '/driving/renew-licence', keywords: ['license'] },
      { title: 'Check a vehicle registration', href: '/vehicles/rego-check', keywords: ['rego'] },
    ],
  },
  {
    title: 'Births, deaths and marriages',
    items: [{ title: 'Order a birth certificate', href: '/bdm/birth-certificate' }],
  },
]

const selected = fn<(item: SiteSearchItem) => void>()

function Palette() {
  return (
    <SiteSearch
      groups={groups}
      onSelect={selected}
      shortcut={false}
      label='Search Service NSW'
      emptyMessage='No services match that search.'
    />
  )
}

const panel = () => document.querySelector<HTMLElement>('[data-slot="site-search-panel"]')
const searchInput = () =>
  within(document.body).getByRole('combobox', { name: 'Search Service NSW' })

async function openWithKeyboard(canvasElement: HTMLElement) {
  const trigger = within(canvasElement).getByRole('button', { name: 'Search Service NSW' })
  await userEvent.tab()
  await expect(trigger).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  await waitFor(() => expect(searchInput()).toHaveFocus())
  return trigger
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user has to know the trigger opens a dialog and whether it is open, that the panel is a named dialog, and that the field inside is a combobox whose suggestions they can move through.',
          how: 'The play() reads the icon-only trigger (a button named by label, aria-haspopup="dialog", collapsed), opens it, then reads the panel (a dialog with the same name) and the field (a combobox, also named by label, that is expanded and controls the results list).',
          caveat:
            'Every name comes from the label prop — localise it. A custom trigger owns its own name.',
        }),
      },
    },
  },
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Search Service NSW' })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await waitFor(() => expect(searchInput()).toHaveFocus())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(
      within(document.body).getByRole('dialog', { name: 'Search Service NSW' }),
    ).toBeInTheDocument()
    const input = searchInput()
    await expect(input).toHaveAttribute('aria-expanded', 'true')
    const list = document.getElementById(input.getAttribute('aria-controls') ?? '')
    await expect(list).toHaveAttribute('role', 'listbox')
    await closeOverlay('site-search-panel')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'The whole job — open the palette, find a page, choose it — has to be possible from the keyboard alone.',
          how: 'Tab to the trigger and press Enter: the palette opens with focus in the field. Type “rego”: one result is left and highlighted. Press Enter: onSelect receives it and the palette closes. The play() asserts each step.',
          caveat:
            'Arrow keys move the highlight while focus stays in the field (aria-activedescendant), so typing never stops working.',
        }),
      },
    },
  },
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    selected.mockClear()
    await openWithKeyboard(canvasElement)
    await userEvent.keyboard('rego')
    await waitFor(() =>
      expect(document.querySelectorAll('[data-slot="site-search-item"]')).toHaveLength(1),
    )
    await waitFor(() =>
      expect(document.querySelector('[data-slot="site-search-item"]')).toHaveAttribute(
        'data-highlighted',
      ),
    )
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(selected).toHaveBeenCalledTimes(1))
    await expect(selected.mock.calls[0]![0].href).toBe('/vehicles/rego-check')
    await waitForUnmount('site-search-panel')
  },
}

// ─── 2.4.3 — Focus Order ──────────────────────────────────────────────────────

export const FocusOrder: Story = {
  name: 'Focus Order — 2.4.3',
  parameters: {
    wcag: ['2.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.3',
          why: 'When a dialog opens, focus has to move into it; when it closes, focus has to come back to where the reader was — not to the top of the page.',
          how: 'Open the palette from the keyboard: focus lands in the search field. Press Tab: focus stays inside the panel. Press Escape: the palette closes and focus returns to the trigger. The play() asserts each.',
          caveat: 'The focus trap and restore are Base UI Dialog behaviour.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex items-center gap-4'>
      <Palette />
      <button type='button' className='rounded-sm px-2 underline'>
        After the search
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = await openWithKeyboard(canvasElement)
    // Tab past the last control: the trap wraps focus back into the panel.
    await userEvent.tab()
    await waitFor(() => expect(panel()!.contains(document.activeElement)).toBe(true))
    await userEvent.keyboard('{Escape}')
    await waitForUnmount('site-search-panel')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

// ─── 4.1.3 — Status Messages ──────────────────────────────────────────────────

export const StatusMessages: Story = {
  name: 'Status Messages — 4.1.3',
  parameters: {
    wcag: ['4.1.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.3',
          why: 'When a search finds nothing, a screen reader user typing in the field has to hear so without focus moving to the message.',
          how: 'Open the palette and search for “passport”: nothing matches and the empty message appears. The play() asserts the message sits in a live region that is mounted before it is filled, so the change is announced, and that focus stays in the field.',
          caveat:
            'The live region is Base UI Autocomplete.Empty, always mounted and empty until the list is.',
        }),
      },
    },
  },
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    await openWithKeyboard(canvasElement)
    const region = document.querySelector<HTMLElement>('[data-slot="site-search-empty"]')!
    await expect(region).toHaveAttribute('aria-live', 'polite')
    await expect(region).toHaveTextContent('')
    await userEvent.keyboard('passport')
    await waitFor(() => expect(region).toHaveTextContent('No services match that search.'))
    await expect(searchInput()).toHaveFocus()
    await closeOverlay('site-search-panel')
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSizeMinimum: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'The default trigger is an icon-only button in a header; it has to be big enough to hit.',
          how: 'The play() measures the default trigger and asserts it is at least 24 by 24 CSS pixels.',
          caveat: 'A custom trigger brings its own size; Button’s sizes all clear the minimum.',
        }),
      },
    },
  },
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Search Service NSW' })
    const { width, height } = trigger.getBoundingClientRect()
    await expect(width).toBeGreaterThanOrEqual(24)
    await expect(height).toBeGreaterThanOrEqual(24)
  },
}

// ─── 2.5.5 — Target Size (Enhanced) ───────────────────────────────────────────

export const TargetSizeEnhanced: Story = {
  name: 'Target Size (Enhanced) — 2.5.5',
  parameters: {
    wcag: ['2.5.5'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.5',
          why: 'Results are tapped on phones, stacked one on top of another; rows of at least 44px make the right one easy to hit.',
          how: 'Open the palette: the play() measures every result row and asserts each is at least 44px tall and wider than that.',
          caveat:
            'Level AAA, met on purpose: the rows are min-h-11. Shown alongside the AA minimum it exceeds.',
        }),
      },
    },
  },
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    await openWithKeyboard(canvasElement)
    // The panel scales up from 95% as it opens; measure once it has settled.
    await Promise.all(
      panel()!
        .getAnimations({ subtree: true })
        .map((a) => a.finished),
    )
    await waitFor(() => expect(panel()).not.toHaveAttribute('data-starting-style'))
    const rows = [...document.querySelectorAll<HTMLElement>('[data-slot="site-search-item"]')]
    await expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      const { width, height } = row.getBoundingClientRect()
      await expect(height).toBeGreaterThanOrEqual(44)
      await expect(width).toBeGreaterThanOrEqual(44)
    }
    await closeOverlay('site-search-panel')
  },
}

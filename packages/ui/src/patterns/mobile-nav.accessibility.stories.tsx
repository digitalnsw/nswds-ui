/**
 * MobileNav — Accessibility
 *
 * One story per WCAG 2.2 criterion the block has to meet, each asserting it in
 * play(). The modal behaviour — focus trap, Escape, focus return — is Base
 * UI's dialog, reached through Sheet; the menu itself is PushMenu. These pin
 * the parts a consumer relies on when they drop the block into a header.
 *
 * The drawer portals to document.body, so everything inside it is queried
 * from `document`, never from `canvasElement`. Each story that opens it closes
 * it again with `closeOverlay`, so the end-of-play axe pass never races a
 * closing popup.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import type { PushMenuItem } from '../components/push-menu.js'

import { Header, HeaderActions, HeaderBrand } from '../components/header.js'
import {
  closeOverlay,
  expectContrast,
  waitForUnmount,
  wcagStoryMeta,
} from '../components/story-helpers.js'
import { MobileNav } from './mobile-nav.js'

const navigation: PushMenuItem[] = [
  { id: 'home', title: 'Home', href: '#home' },
  {
    id: 'about',
    title: 'About us',
    links: [
      { id: 'about-overview', title: 'Overview', href: '#about-overview' },
      { id: 'about-people', title: 'Our people', href: '#about-people' },
    ],
  },
  { id: 'contact', title: 'Contact', href: '#contact' },
]

const meta = {
  title: 'Patterns/MobileNav/Accessibility',
  component: MobileNav,
  parameters: { layout: 'padded' },
  args: { navigation, title: 'Menu', currentHref: '#home' },
  render: (args) => (
    <Header color='white' sticky={false}>
      <HeaderBrand sitename='Service NSW' />
      <HeaderActions>
        <MobileNav {...args} />
      </HeaderActions>
    </Header>
  ),
} satisfies Meta<typeof MobileNav>

export default meta

type Story = StoryObj<typeof meta>

const page = within(document.body)

function trigger(canvasElement: HTMLElement) {
  return within(canvasElement).getByRole('button', { name: 'Open navigation menu' })
}

const sheet = () => document.querySelector<HTMLElement>('[data-slot="sheet-content"]')

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'The trigger shows only an icon, so a screen reader user depends on its programmatic name and expanded state to know what it does and whether the menu is open; inside, they need a named dialog and to hear which link is the current page.',
          how: 'Inspect the trigger: a button named "Open navigation menu", aria-expanded false. Open it: a dialog named by the title ("Menu"), a navigation landmark of the same name, and the link matching currentHref carrying aria-current="page". The play() asserts each.',
          caveat:
            'The dialog takes its name from a visually hidden SheetTitle, not from the menu heading, which changes as the reader drills in. Pass a title that names your menu if "Menu" is not enough.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)
    const dialog = await page.findByRole('dialog', { name: 'Menu' })
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const nav = within(dialog).getByRole('navigation', { name: 'Menu' })
    await expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(within(nav).getByRole('link', { name: 'Contact' })).not.toHaveAttribute(
      'aria-current',
    )

    await closeOverlay('sheet-content')
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
          why: 'On a phone with a keyboard or switch control, the whole site navigation lives behind this one button: opening it, moving through levels and closing it must all work without a pointer.',
          how: 'Tab to the trigger and press Enter: the drawer opens. Tab to "About us" and press Enter: its level opens. Press Escape: back to the top level. Press Escape again: the drawer closes and focus is back on the trigger. The play() drives each step from the keyboard and asserts its effect.',
          caveat:
            'Below the top level Escape steps back one level (PushMenu’s escapeGoesBack, on by default) so one keypress never throws away the reader’s place; at the top it reaches Base UI’s dialog, which closes. Neither is hand-rolled here.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    while (document.activeElement !== button) {
      await userEvent.tab()
      if (!canvasElement.contains(document.activeElement)) {
        throw new Error('Tabbing left the canvas without reaching the trigger.')
      }
    }
    await userEvent.keyboard('{Enter}')
    const dialog = await page.findByRole('dialog', { name: 'Menu' })

    const about = within(dialog).getByRole('button', { name: /About us/ })
    for (let presses = 0; document.activeElement !== about; presses++) {
      if (presses > 10) {
        throw new Error('Tab never reached the "About us" drill-in button.')
      }
      await userEvent.tab()
    }
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(
        document.querySelector('[data-current] [data-slot="push-menu-title"]'),
      ).toHaveTextContent('About us'),
    )

    // Below the root, Escape steps back one level rather than dismissing the
    // whole drawer; at the root it closes the drawer and focus returns.
    await waitFor(() =>
      expect(document.querySelector('[data-slot="push-menu"]')).not.toHaveAttribute(
        'data-animating',
      ),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        document.querySelector('[data-current] [data-slot="push-menu-title"]'),
      ).toHaveTextContent('Menu'),
    )
    await expect(sheet()).toBeInTheDocument()
    await waitFor(() =>
      expect(document.querySelector('[data-slot="push-menu"]')).not.toHaveAttribute(
        'data-animating',
      ),
    )
    await userEvent.keyboard('{Escape}')
    await waitForUnmount('sheet-content')
    await waitFor(() => expect(button).toHaveFocus())
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
          why: 'When the drawer opens over the page, focus has to move into it — or the next Tab lands on the page underneath, hidden behind the backdrop. When it closes, focus has to return to the trigger, or the reader starts again from the top of the page.',
          how: 'Open the drawer: focus is inside it. Close it with the menu’s own close button: focus is back on the trigger. The play() asserts both.',
          caveat:
            'The focus trap and return are Base UI’s dialog. The menu’s close button is the drawer’s only close control — the sheet’s built-in one is turned off — so there is one place to look for it.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await userEvent.click(button)
    await page.findByRole('dialog', { name: 'Menu' })
    await waitFor(() => expect(sheet()).toContainElement(document.activeElement as HTMLElement))

    await userEvent.click(page.getByRole('button', { name: 'Close menu' }))
    await waitForUnmount('sheet-content')
    await waitFor(() => expect(button).toHaveFocus())
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'A keyboard user has to see that focus has reached the menu button before pressing Enter on it.',
          how: 'Tab to the trigger: Button’s 2px outline appears, offset onto the header. The play() asserts a solid outline of non-zero width on the focused trigger.',
          caveat:
            'The ring comes from Button and follows its ink, so it flips with the theme. A consumer who restyles the trigger must keep an outline.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    while (document.activeElement !== button) {
      await userEvent.tab()
      if (!canvasElement.contains(document.activeElement)) {
        throw new Error('Tabbing left the canvas without reaching the trigger.')
      }
    }
    const style = getComputedStyle(button)
    await expect(style.outlineStyle).not.toBe('none')
    await expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0)
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Non-text Contrast — 1.4.11',
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The menu icon is the only thing that tells a sighted reader the button is there, so it must clear 3:1 against the header it sits on.',
          how: 'The play() measures the icon’s colour against the header’s background with the same contrast maths axe uses.',
          caveat:
            'Measured on the white Header, the usual home for this block, in both themes. On a coloured header re-check the pair, or pass the trigger a colour made for that surface in your copied source.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const icon = trigger(canvasElement).querySelector('svg')
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="header"]')
    if (!icon || !header) throw new Error('Expected the trigger icon inside a Header.')
    expectContrast(getComputedStyle(icon).color, getComputedStyle(header).backgroundColor, {
      minimum: 3,
      label: 'Menu icon on the header',
    })
  },
}

export const NonTextContrast: Story = { ...contrastStory, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...contrastStory,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSize: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'The trigger is used on touch screens, by thumb, often one-handed: it must be at least 24 by 24 CSS pixels.',
          how: 'The play() measures the trigger’s rendered box.',
          caveat:
            'The trigger is Button’s icon size, which is larger than the minimum; shrinking it in a copied source is what would break this.',
        }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const { width, height } = trigger(canvasElement).getBoundingClientRect()
    await expect(width).toBeGreaterThanOrEqual(24)
    await expect(height).toBeGreaterThanOrEqual(24)
  },
}

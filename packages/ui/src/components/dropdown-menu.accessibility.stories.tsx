/**
 * DropdownMenu — Accessibility
 *
 * One story per WCAG 2.2 criterion a menu has to meet, each asserting it in
 * play(). Roving focus, typeahead, focus return and the menu roles come from
 * the Base UI menu; these pin the parts a consumer relies on — that the
 * trigger and every kind of row expose their role and state, that groups are
 * named by their labels, that the whole menu works from the keyboard and
 * hands focus back, that the focused row is visible in every look, and that
 * the rows are readable in both themes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type DropdownMenuVariant,
} from './dropdown-menu.js'
import {
  closeOverlay,
  compositeOver,
  contrastRatio,
  expectContrast,
  resolveColor,
  waitForUnmount,
  wcagStoryMeta,
} from './story-helpers.js'

const meta = {
  title: 'Components/DropdownMenu/Accessibility',
  component: DropdownMenu,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

function AccountMenu({
  variant,
  trigger = 'My account',
  onSelect,
}: {
  variant?: DropdownMenuVariant
  trigger?: string
  onSelect?: (item: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Signed in as Alex</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onSelect?.('Profile')}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSelect?.('Notifications')}>
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onClick={() => onSelect?.('Sign out')}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ViewMenu() {
  const [showClosed, setShowClosed] = useState(false)
  const [sort, setSort] = useState('closing')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>View options</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showClosed} onCheckedChange={setShowClosed}>
            Closed grants
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value='closing'>Closing date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='amount'>Grant amount</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const openMenu = async (canvasElement: HTMLElement, name: string) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
  return within(document.body).findByRole('menu')
}

/**
 * The opaque colour painted behind an element: its own background, else the
 * nearest ancestor's, with any translucent layers between composited on.
 */
function surfaceBehind(element: Element): string {
  const layers: ReturnType<typeof resolveColor>[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const colour = resolveColor(getComputedStyle(node).backgroundColor)
    if (colour.a === 0) continue
    layers.push(colour)
    if (colour.a === 1) break
  }
  let base: { r: number; g: number; b: number } =
    layers.at(-1)?.a === 1 ? layers.pop()! : { r: 255, g: 255, b: 255 }
  for (const layer of layers.reverse()) base = compositeOver(layer, base)
  return `rgb(${base.r} ${base.g} ${base.b})`
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
          why: 'A screen reader announces a menu by its roles and states: that the trigger opens a menu and whether it is open, which rows are actions, which are on/off settings and which pick one of several — and their current values.',
          how: 'Open View options. The play() asserts the trigger’s aria-haspopup and aria-expanded, the menu role, the checkbox row’s menuitemcheckbox role and aria-checked before and after it is toggled, and the radio rows’ menuitemradio role and aria-checked.',
          caveat:
            'A disabled row is still announced, with aria-disabled — see the Keyboard story — so a reader learns the option exists.',
        }),
      },
    },
  },
  render: () => <ViewMenu />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'View options' })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    const menu = await openMenu(canvasElement, 'View options')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const closed = within(menu).getByRole('menuitemcheckbox', { name: 'Closed grants' })
    await expect(closed).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(closed)
    await waitFor(() => expect(closed).toHaveAttribute('aria-checked', 'true'))

    const closing = within(menu).getByRole('menuitemradio', { name: 'Closing date' })
    const amount = within(menu).getByRole('menuitemradio', { name: 'Grant amount' })
    await expect(closing).toHaveAttribute('aria-checked', 'true')
    await expect(amount).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(amount)
    await waitFor(() => expect(amount).toHaveAttribute('aria-checked', 'true'))
    await expect(closing).toHaveAttribute('aria-checked', 'false')

    await closeOverlay('dropdown-menu-content')
  },
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The grouping a sighted reader sees — a label over a set of rows, a line between sets — must reach assistive tech too, or the rows read as one undifferentiated list.',
          how: 'Open View options. The play() asserts each DropdownMenuGroup is a group named by its DropdownMenuLabel, that each group holds its own rows, and that the divider is a separator.',
          caveat:
            'A DropdownMenuLabel names a group only inside a DropdownMenuGroup; outside one it is just text.',
        }),
      },
    },
  },
  render: () => <ViewMenu />,
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement, 'View options')
    const show = within(menu).getByRole('group', { name: 'Show' })
    const sort = within(menu).getByRole('group', { name: 'Sort by' })
    await expect(
      within(show).getByRole('menuitemcheckbox', { name: 'Closed grants' }),
    ).toBeInTheDocument()
    await expect(within(sort).getAllByRole('menuitemradio')).toHaveLength(2)
    await expect(within(menu).getByRole('separator')).toBeInTheDocument()
    await closeOverlay('dropdown-menu-content')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const selected = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Every row in a menu must be reachable and usable from the keyboard: the menu opens from its button, the arrows move between rows, Enter chooses one, and Escape backs out.',
          how: 'Tab to the trigger and press Enter: the menu opens on the first row. ArrowDown moves to Notifications and Enter chooses it, closing the menu. Open it again: ArrowDown reaches the disabled Billing row, announced as disabled, where Enter does nothing. Escape closes the menu. The play() drives and asserts each step.',
          caveat:
            'Typeahead also works — typing a row’s first letters moves to it — and loopFocus (on by default) wraps from the last row to the first.',
        }),
      },
    },
  },
  render: () => <AccountMenu onSelect={selected} />,
  play: async ({ canvasElement }) => {
    selected.mockClear()
    const trigger = within(canvasElement).getByRole('button', { name: 'My account' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    let menu = await within(document.body).findByRole('menu')
    await waitFor(() =>
      expect(within(menu).getByRole('menuitem', { name: 'Profile' })).toHaveFocus(),
    )
    await userEvent.keyboard('{ArrowDown}')
    await expect(within(menu).getByRole('menuitem', { name: 'Notifications' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitForUnmount('dropdown-menu-content')
    await expect(selected).toHaveBeenCalledWith('Notifications')

    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    menu = await within(document.body).findByRole('menu')
    const billing = within(menu).getByRole('menuitem', { name: 'Billing' })
    await expect(billing).toHaveAttribute('aria-disabled', 'true')
    await waitFor(() =>
      expect(within(menu).getByRole('menuitem', { name: 'Profile' })).toHaveFocus(),
    )
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect(billing).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeInTheDocument()
    await expect(selected).toHaveBeenCalledTimes(1)

    await closeOverlay('dropdown-menu-content')
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
          why: 'The menu is portaled to the end of the page, so focus has to be carried into it when it opens and handed back to the trigger when it closes, or the reader is stranded.',
          how: 'Open the menu from the keyboard: focus moves to the first row. Rows are visited top to bottom with ArrowDown and the disabled row is not skipped. Escape returns focus to the trigger. The play() asserts every step.',
          caveat:
            'Tab does not move between rows — that is the menu pattern. Tab closes the menu and moves on, as Escape does.',
        }),
      },
    },
  },
  render: () => <AccountMenu />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'My account' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await within(document.body).findByRole('menu')
    const rows = within(menu).getAllByRole('menuitem')
    await expect(rows.map((row) => row.textContent)).toEqual([
      'Profile',
      'Notifications',
      'Billing',
      'Sign out',
    ])
    await waitFor(() => expect(rows[0]).toHaveFocus())
    for (const row of rows.slice(1)) {
      await userEvent.keyboard('{ArrowDown}')
      await expect(row).toHaveFocus()
    }
    await closeOverlay('dropdown-menu-content')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

// ─── 2.4.7 / 1.4.11 — Focus Visible ───────────────────────────────────────────

const looks: DropdownMenuVariant[] = ['default', 'band', 'rule']

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7 / 1.4.11',
  parameters: {
    wcag: ['2.4.7', '1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '1.4.11'],
          why: 'A tint alone marks the highlighted row at about 1.1:1 — not a cue anyone can rely on. Each look must draw the keyboard-focused row with something that clears 3:1 against the menu.',
          how: 'Each look’s menu is opened from the keyboard and the focused row measured. default: a 2px outline, at least 3:1 against the menu. band: the row’s solid fill, at least 3:1 against the menu. rule: the 4px start rail, at least 3:1 against the menu. The play() asserts each.',
          caveat:
            'The outline keys on :focus-visible, so a pointer hover shows only the tint — the ring is for the keyboard, where it is needed.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex gap-4'>
      {looks.map((look) => (
        <AccountMenu key={look} variant={look} trigger={`Open ${look}`} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const look of looks) {
      within(canvasElement)
        .getByRole('button', { name: `Open ${look}` })
        .focus()
      await userEvent.keyboard('{Enter}')
      const menu = await within(document.body).findByRole('menu')
      const row = within(menu).getByRole('menuitem', { name: 'Profile' })
      await waitFor(() => expect(row).toHaveFocus())
      const menuSurface = surfaceBehind(menu)
      const style = getComputedStyle(row)
      if (look === 'default') {
        await expect(style.outlineStyle).not.toBe('none')
        await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
        expectContrast(style.outlineColor, menuSurface, { minimum: 3, label: 'default ring' })
      } else if (look === 'band') {
        expectContrast(surfaceBehind(row), menuSurface, { minimum: 3, label: 'band fill' })
      } else {
        await expect(parseFloat(style.borderInlineStartWidth)).toBeGreaterThanOrEqual(4)
        expectContrast(style.borderInlineStartColor, menuSurface, {
          minimum: 3,
          label: 'rule rail',
        })
      }
      await closeOverlay('dropdown-menu-content')
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'Row text must clear 4.5:1 against the menu at rest and against the highlight when a row is focused — including the danger row, and the inverse text on band’s solid highlight.',
          how: 'Each look’s menu is opened and the play() measures the group label, every enabled row at rest, then each enabled row again while it is focused, against the colour actually painted behind it.',
          caveat:
            'The disabled row is excluded: WCAG exempts inactive controls, and it is dimmed on purpose. Measured in both themes (see the dark story).',
        }),
      },
    },
  },
  render: () => (
    <div className='flex gap-4'>
      {looks.map((look) => (
        <AccountMenu key={look} variant={look} trigger={`Open ${look}`} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const look of looks) {
      within(canvasElement)
        .getByRole('button', { name: `Open ${look}` })
        .focus()
      await userEvent.keyboard('{Enter}')
      const menu = await within(document.body).findByRole('menu')
      const label = menu.querySelector('[data-slot="dropdown-menu-label"]')!
      expectContrast(getComputedStyle(label).color, surfaceBehind(label), {
        label: `${look} group label`,
      })
      const rows = within(menu)
        .getAllByRole('menuitem')
        .filter((row) => row.getAttribute('aria-disabled') !== 'true')
      await waitFor(() => expect(rows[0]).toHaveFocus())
      // At rest: every row but the first, which the keyboard opened onto.
      for (const row of rows.slice(1)) {
        const ratio = contrastRatio(getComputedStyle(row).color, surfaceBehind(row))
        await expect(ratio, `${look} ${row.textContent} at rest`).toBeGreaterThanOrEqual(4.5)
      }
      // Focused: walk down the menu, passing over the disabled row.
      for (const row of rows) {
        for (let i = 0; i < 3 && document.activeElement !== row; i++) {
          await userEvent.keyboard('{ArrowDown}')
        }
        await expect(row).toHaveFocus()
        const ratio = contrastRatio(getComputedStyle(row).color, surfaceBehind(row))
        await expect(ratio, `${look} ${row.textContent} focused`).toBeGreaterThanOrEqual(4.5)
      }
      await closeOverlay('dropdown-menu-content')
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

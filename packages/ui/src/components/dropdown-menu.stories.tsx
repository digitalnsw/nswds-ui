/**
 * DropdownMenu — a menu of actions opened from a trigger, on the Base UI menu
 * primitive. Base UI owns roving focus, typeahead, submenus and dismissal.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentProps, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { IconMoreHoriz } from '../icons/more-horiz.js'
import { Button } from './button.js'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type DropdownMenuVariant,
} from './dropdown-menu.js'
import { closeOverlay } from './story-helpers.js'

/**
 * The menu stories take the look as an arg, so the Controls panel can switch
 * any of them between default, band and rule. It is a prop of
 * `DropdownMenuContent`, not of the root the meta documents, hence the
 * widened args type.
 */
type StoryArgs = ComponentProps<typeof DropdownMenu> & { variant?: DropdownMenuVariant }

const meta = {
  title: 'Components/Dropdown Menu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A menu of actions, links, checkboxes and radio options opened from a trigger. Base UI provides roving focus, typeahead, submenus, focus return and Escape / outside-click dismissal. Use DropdownMenuLinkItem for navigation so the browser keeps its link behaviour.',
      },
    },
  },
  args: { variant: 'default' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'band', 'rule'],
      description:
        "The look, set on DropdownMenuContent: default (Hairline), band or rule. Stories that pin a look ('Looks', 'Submenu alignment') ignore it.",
      table: { category: 'Appearance' },
    },
  },
  render: ({ variant, ...args }) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant='outline' />}>My account</DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Signed in as Alex</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
          <DropdownMenuLinkItem href='#help'>Help and support</DropdownMenuLinkItem>
          <DropdownMenuItem disabled>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive'>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

const closeWithEscape = () => closeOverlay('dropdown-menu-content')

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'My account' })
    await userEvent.click(trigger)

    const menu = await within(document.body).findByRole('menu')
    const items = within(menu).getAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Profile⇧⌘P',
      'Notifications',
      'Help and support',
      'Billing',
      'Sign out',
    ])
    // The link item is a real anchor, not a scripted div.
    await expect(within(menu).getByRole('menuitem', { name: 'Help and support' }).tagName).toBe('A')

    // Keyboard: ArrowDown from the trigger-opened menu lands on the first item.
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName(/^Profile/))

    // A disabled item stays reachable by keyboard, is announced as disabled,
    // and Enter on it does nothing — the menu stays open. (It takes no pointer
    // events at all, so a click cannot reach it.)
    const billing = within(menu).getByRole('menuitem', { name: 'Billing' })
    await expect(billing).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    await waitFor(() => expect(billing).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(document.querySelector('[data-slot="dropdown-menu-content"]')).toBeInTheDocument()

    await closeWithEscape()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

/**
 * DropdownMenuLinkItem closes the menu on activation — Base UI's own default
 * leaves it open, which strands the menu over the new route under client-side
 * routing. The click's navigation is cancelled in the capture phase: following
 * even a hash link would navigate the Vitest tester page and kill the run.
 */
export const LinkItemCloses: Story = {
  name: 'Link item closes the menu',
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'My account' })
    await userEvent.click(trigger)
    const menu = await within(document.body).findByRole('menu')

    const cancelNavigation = (event: MouseEvent) => event.preventDefault()
    document.addEventListener('click', cancelNavigation, { capture: true })
    try {
      await userEvent.click(within(menu).getByRole('menuitem', { name: 'Help and support' }))
      await waitFor(() =>
        expect(
          document.querySelector('[data-slot="dropdown-menu-content"]'),
        ).not.toBeInTheDocument(),
      )
    } finally {
      document.removeEventListener('click', cancelNavigation, { capture: true })
    }
  },
}

export const CheckboxesAndRadios: Story = {
  name: 'Checkboxes and radios',
  render: function Render({ variant }) {
    const [showStatus, setShowStatus] = useState(true)
    const [showArchived, setShowArchived] = useState(false)
    const [sort, setSort] = useState('newest')
    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant='outline' />}>View</DropdownMenuTrigger>
        <DropdownMenuContent variant={variant}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
              Archived
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value='newest'>Newest first</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='oldest'>Oldest first</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'View' }))
    const menu = await within(document.body).findByRole('menu')

    const archived = within(menu).getByRole('menuitemcheckbox', { name: 'Archived' })
    // pe-10 replaces the base pe-4 (twMerge) rather than sitting beside it,
    // so a consumer's own build re-emitting pe-4 cannot pull the text under
    // the check indicator.
    await expect(archived.className).not.toMatch(/(^|\s)pe-4(\s|$)/)
    await expect(getComputedStyle(archived).paddingInlineEnd).toBe('40px')
    await expect(archived).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(archived)
    await waitFor(() => expect(archived).toHaveAttribute('aria-checked', 'true'))

    const oldest = within(menu).getByRole('menuitemradio', { name: 'Oldest first' })
    await userEvent.click(oldest)
    await waitFor(() => expect(oldest).toHaveAttribute('aria-checked', 'true'))

    // Checkbox and radio items keep the menu open, so it still needs closing.
    await closeWithEscape()
  },
}

export const Submenu: Story = {
  name: 'Submenu',
  render: ({ variant }) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>Actions</DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Drafts</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Actions' }))
    const menu = await within(document.body).findByRole('menu')
    const subTrigger = within(menu).getByRole('menuitem', { name: 'Move to' })

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await waitFor(() => expect(subTrigger).toHaveFocus())
    await userEvent.keyboard('{ArrowRight}')

    const sub = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-slot="dropdown-menu-sub-content"]')
      if (!el) throw new Error('Submenu not mounted.')
      return el
    })
    await waitFor(() => expect(within(sub).getByRole('menuitem', { name: 'Drafts' })).toHaveFocus())

    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(subTrigger).toHaveFocus())
    await closeWithEscape()
  },
}

/**
 * `inset` lines an icon-less row up with siblings that lead with an icon, and
 * `inset={false}` must not: the variant keys on the attribute's presence, so
 * a stamped `data-inset="false"` would indent too.
 */
export const Inset: Story = {
  name: 'Inset',
  render: ({ variant }) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>Share</DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>Share</DropdownMenuLabel>
          <DropdownMenuItem inset>Copy link</DropdownMenuItem>
          <DropdownMenuItem inset={false}>Email</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Share' }))
    const menu = await within(document.body).findByRole('menu')

    const inset = within(menu).getByRole('menuitem', { name: 'Copy link' })
    const flush = within(menu).getByRole('menuitem', { name: 'Email' })
    const label = menu.querySelector<HTMLElement>('[data-slot="dropdown-menu-label"]')
    await expect(getComputedStyle(inset).paddingInlineStart).toBe('40px')
    await expect(getComputedStyle(label!).paddingInlineStart).toBe('40px')
    await expect(flush).not.toHaveAttribute('data-inset')
    await expect(getComputedStyle(flush).paddingInlineStart).toBe('16px')

    await closeWithEscape()
  },
}

/**
 * A label dropped straight into the content, outside any group — the shadcn /
 * Radix habit. Base UI's group label throws there on first open; the wrapper
 * supplies a group so the menu opens and the label renders.
 */
export const LabelOutsideGroup: Story = {
  name: 'Label outside a group',
  render: ({ variant }) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant='outline' />}>Account</DropdownMenuTrigger>
      <DropdownMenuContent variant={variant}>
        <DropdownMenuLabel>Signed in as Alex</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Account' }))
    const menu = await within(document.body).findByRole('menu')
    // Waits out the open animation, which starts from opacity 0.
    await waitFor(() => expect(within(menu).getByText('Signed in as Alex')).toBeVisible())
    await expect(within(menu).getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument()
    await closeWithEscape()
  },
}

const LOOKS = ['default', 'band', 'rule'] as const

/**
 * The three approved looks, each checked on a keyboard-highlighted row:
 * default rings it, band fills it solid, rule gives it a 4px start rail.
 */
export const Looks: Story = {
  name: 'Looks',
  render: () => (
    <div className='flex flex-wrap items-start gap-4'>
      {LOOKS.map((look) => (
        <DropdownMenu key={look}>
          <DropdownMenuTrigger render={<Button variant='outline' />}>
            Menu {look}
          </DropdownMenuTrigger>
          <DropdownMenuContent variant={look}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Signed in as Alex</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const open = async (look: string) => {
      await userEvent.click(canvas.getByRole('button', { name: `Menu ${look}` }))
      const menu = await within(document.body).findByRole('menu')
      await expect(menu).toHaveAttribute('data-variant', look)
      await userEvent.keyboard('{ArrowDown}')
      const profile = within(menu).getByRole('menuitem', { name: 'Profile' })
      await waitFor(() => expect(profile).toHaveFocus())
      return { menu, style: getComputedStyle(profile) }
    }

    const byDefault = await open('default')
    // Style, not width: `outline-hidden` already gives every row a 2px
    // transparent outline, so a width check passes with no ring painted.
    await expect(byDefault.style.outlineStyle).toBe('solid')
    await expect(byDefault.style.outlineWidth).toBe('2px')
    const defaultBg = byDefault.style.backgroundColor
    await closeWithEscape()

    const band = await open('band')
    await expect(band.style.backgroundColor).not.toBe(defaultBg)
    await expect(band.style.outlineStyle).toBe('none')
    await expect(band.style.color).not.toBe(getComputedStyle(band.menu).color)
    await closeWithEscape()

    const rule = await open('rule')
    await expect(rule.style.borderInlineStartWidth).toBe('4px')
    await expect(rule.style.outlineStyle).toBe('none')
    await expect(getComputedStyle(rule.menu).borderTopWidth).toBe('4px')
    await closeWithEscape()
  },
}

/**
 * A submenu's first row lines up with the row that opened it, in every look —
 * band's rows start flush with the popup edge, so its offset differs.
 */
export const SubmenuAlignment: Story = {
  name: 'Submenu alignment',
  render: () => (
    <div className='flex flex-wrap items-start gap-4'>
      {(['default', 'band', 'rule'] as const).map((look) => (
        <DropdownMenu key={look}>
          <DropdownMenuTrigger render={<Button variant='outline' />}>
            Actions {look}
          </DropdownMenuTrigger>
          <DropdownMenuContent variant={look}>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Drafts</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const look of ['default', 'band', 'rule']) {
      await userEvent.click(within(canvasElement).getByRole('button', { name: `Actions ${look}` }))
      const menu = await within(document.body).findByRole('menu')
      const subTrigger = within(menu).getByRole('menuitem', { name: 'Move to' })
      await userEvent.keyboard('{ArrowDown}{ArrowDown}')
      await waitFor(() => expect(subTrigger).toHaveFocus())
      await userEvent.keyboard('{ArrowRight}')
      const drafts = await within(document.body).findByRole('menuitem', { name: 'Drafts' })
      await waitFor(() => expect(drafts).toHaveFocus())
      // The submenu portals out of its parent, so it inherits the look by
      // context rather than from the DOM.
      await expect(
        document.querySelector('[data-slot="dropdown-menu-sub-content"]'),
      ).toHaveAttribute('data-variant', look)
      // Positioning settles after the popup mounts, so poll the offset.
      await waitFor(() =>
        expect(
          Math.abs(drafts.getBoundingClientRect().top - subTrigger.getBoundingClientRect().top),
        ).toBeLessThanOrEqual(1),
      )
      await userEvent.keyboard('{Escape}')
      await closeWithEscape()
    }
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: ({ variant }) => (
    <div className='flex flex-wrap gap-4'>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant='ghost' iconOnly aria-label='More actions' />}>
          <IconMoreHoriz />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' variant={variant}>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Drafts</DropdownMenuItem>
              <DropdownMenuItem>Submitted</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'My account' }))
    const menu = await within(document.body).findByRole('menu')

    // Proves globals.css loaded: --popover resolves to a real colour.
    await expect(getComputedStyle(menu).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    // 16px text floor and a 44px minimum target on every row.
    const item = within(menu).getByRole('menuitem', { name: 'Notifications' })
    const style = getComputedStyle(item)
    await expect(style.fontSize).toBe('16px')
    await expect(Number.parseFloat(style.minHeight)).toBeGreaterThanOrEqual(44)
    const label = menu.querySelector<HTMLElement>('[data-slot="dropdown-menu-label"]')
    await expect(getComputedStyle(label!).fontSize).toBe('16px')

    // The destructive item takes the danger ink, so it cannot match a default row.
    const signOut = within(menu).getByRole('menuitem', { name: 'Sign out' })
    await expect(signOut).toHaveAttribute('data-variant', 'destructive')
    await expect(getComputedStyle(signOut).color).not.toBe(style.color)

    await closeWithEscape()
  },
}

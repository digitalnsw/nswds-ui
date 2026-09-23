/**
 * Dialog — a centred modal window on the Base UI dialog primitive. Base UI
 * owns the focus trap, scroll lock, focus return and Escape / outside-click
 * dismissal.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog.js'
import { closeOverlay } from './story-helpers.js'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal window centred over the page. Base UI provides the focus trap, scroll lock, focus return and Escape / outside-click dismissal. Use AlertDialog instead when the user must make an explicit choice.',
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button />}>Edit contact details</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit contact details</DialogTitle>
          <DialogDescription>
            We use these details to contact you about your application.
          </DialogDescription>
        </DialogHeader>
        <p>Your changes are saved when you select Save.</p>
        <DialogFooter>
          <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

const closeWithEscape = () => closeOverlay('dialog-content')

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit contact details' })
    await userEvent.click(trigger)

    // The popup is PORTALED to the document body, so query the whole document
    // rather than canvasElement.
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Edit contact details',
    })
    await expect(dialog).toHaveAccessibleDescription(
      'We use these details to contact you about your application.',
    )
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))

    await closeWithEscape()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

/**
 * The close button is icon-only and portaled, so `closeLabel` is the only name
 * AT ever hears for it and the only way a consumer can translate it.
 */
export const TranslatedCloseLabel: Story = {
  name: 'Translated close label',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Abrir</DialogTrigger>
      <DialogContent closeLabel='Cerrar ventana'>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Realice cambios en su perfil aquí.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Abrir' }))
    const close = await within(document.body).findByRole('button', { name: 'Cerrar ventana' })
    await userEvent.click(close)
    await waitFor(() =>
      expect(document.querySelector('[data-slot="dialog-content"]')).not.toBeInTheDocument(),
    )
  },
}

/**
 * Base UI focuses the first tabbable element on open. The close button is
 * first in the DOM so that is the close button, not a footer action — with
 * the footer first, a long dialog opened scrolled to the bottom and put the
 * reader past everything above it.
 */
export const LongContentOpensAtTop: Story = {
  name: 'Long content opens at the top',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Read the conditions</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conditions of use</DialogTitle>
        </DialogHeader>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>Condition {i + 1}. Long enough content to overflow the viewport.</p>
        ))}
        <DialogFooter>
          <DialogClose render={<Button />}>I agree</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Read the conditions' }),
    )
    const dialog = await within(document.body).findByRole('dialog', { name: 'Conditions of use' })
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Close' })).toHaveFocus())
    await expect(dialog.scrollHeight).toBeGreaterThan(dialog.clientHeight)
    await expect(dialog.scrollTop).toBe(0)
    await closeWithEscape()
  },
}

/**
 * `showCloseButton={false}` removes the corner button (and the header padding
 * reserved for it); `DialogFooter showCloseButton` supplies a labelled one.
 */
export const FooterClose: Story = {
  name: 'Footer close',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Saved</DialogTitle>
          <DialogDescription>Your details have been updated.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton closeLabel='Done' />
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open' }))
    const dialog = await within(document.body).findByRole('dialog', { name: 'Saved' })

    await expect(
      within(dialog)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Done'])
    const header = dialog.querySelector<HTMLElement>('[data-slot="dialog-header"]')
    // Only the 24px gutter: no room reserved for a corner button that is not there.
    await expect(getComputedStyle(header!).paddingInlineEnd).toBe('24px')

    await userEvent.click(within(dialog).getByRole('button', { name: 'Done' }))
    await waitFor(() =>
      expect(document.querySelector('[data-slot="dialog-content"]')).not.toBeInTheDocument(),
    )
  },
}

const LOOKS = ['default', 'band', 'rule'] as const

/**
 * The three approved looks. Each is opened and checked for the one property
 * that tells it apart — and none of them blurs the page behind.
 */
export const Looks: Story = {
  name: 'Looks',
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {LOOKS.map((look) => (
        <Dialog key={look}>
          <DialogTrigger render={<Button variant='outline' />}>Open {look}</DialogTrigger>
          <DialogContent variant={look}>
            <DialogHeader>
              <DialogTitle>Edit contact details</DialogTitle>
              <DialogDescription>
                We use these details to contact you about your application.
              </DialogDescription>
            </DialogHeader>
            <p>Your changes are saved when you select Save.</p>
            <DialogFooter>
              <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const seen: Record<string, { headerBorder: string; headerBg: string; capWidth: string }> = {}
    for (const look of LOOKS) {
      await userEvent.click(canvas.getByRole('button', { name: `Open ${look}` }))
      const popup = await waitFor(() => {
        const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
        if (!el) throw new Error('Dialog popup not mounted.')
        return el
      })
      await expect(popup).toHaveAttribute('data-variant', look)
      const overlay = document.querySelector<HTMLElement>('[data-slot="dialog-overlay"]')
      await expect(getComputedStyle(overlay!).backdropFilter).toBe('none')
      const header = popup.querySelector<HTMLElement>('[data-slot="dialog-header"]')!
      const popupStyle = getComputedStyle(popup)
      const headerStyle = getComputedStyle(header)
      seen[look] = {
        headerBorder: headerStyle.borderBottomWidth,
        headerBg: headerStyle.backgroundColor,
        capWidth: popupStyle.borderTopWidth,
      }
      await closeWithEscape()
    }
    // default: the header is divided off by a hairline.
    await expect(seen.default!.headerBorder).toBe('1px')
    // band: the header is a filled band, unlike the others.
    await expect(seen.band!.headerBg).not.toBe(seen.default!.headerBg)
    // rule: a 4px cap on the popup's top edge.
    await expect(seen.rule!.capWidth).toBe('4px')
    await expect(seen.default!.capWidth).toBe('0px')
  },
}

/**
 * The structural cases the header rules have to survive: content wrapped in a
 * <form>, a title placed in the body, no header at all, and a header with
 * nothing below it. Each is opened and measured.
 */
export const Structure: Story = {
  name: 'Structure',
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Dialog>
        <DialogTrigger render={<Button variant='outline' />}>In a form</DialogTrigger>
        <DialogContent variant='band'>
          <form className='grid gap-6' onSubmit={(event) => event.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Update the postal address we send your renewal notices to</DialogTitle>
            </DialogHeader>
            <p>Changes apply from your next notice.</p>
            <DialogFooter>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger render={<Button variant='outline' />}>Body title</DialogTrigger>
        <DialogContent variant='band'>
          <DialogHeader>
            <DialogTitle>Band title</DialogTitle>
          </DialogHeader>
          <DialogDescription>A description placed in the body.</DialogDescription>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger render={<Button variant='outline' />}>No header</DialogTrigger>
        <DialogContent variant='band'>
          <p data-testid='first'>Your session will expire in 2 minutes. Continue?</p>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger render={<Button variant='outline' />}>Header only</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saved</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const open = async (name: string) => {
      await userEvent.click(canvas.getByRole('button', { name }))
      return within(document.body).findByRole('dialog')
    }
    const closeInk = (dialog: HTMLElement) =>
      getComputedStyle(within(dialog).getByRole('button', { name: 'Close' })).color
    const inverse = 'oklch(1 0 0)'

    // In a form: the header is not a direct child, yet the close button still
    // takes the band's ink and the title still clears it.
    let dialog = await open('In a form')
    const header = dialog.querySelector<HTMLElement>('[data-slot="dialog-header"]')!
    await expect(closeInk(dialog)).toBe(inverse)
    await expect(getComputedStyle(header).paddingInlineEnd).toBe('72px')
    await closeWithEscape()

    // A description in the body stays on the popover, so keeps its own ink.
    dialog = await open('Body title')
    const description = dialog.querySelector<HTMLElement>('[data-slot="dialog-description"]')!
    await expect(getComputedStyle(description).color).not.toBe(inverse)
    await closeWithEscape()

    // No header: no band to take the inverse ink from, and the first content
    // reserves the close button's 48px.
    dialog = await open('No header')
    await expect(closeInk(dialog)).not.toBe(inverse)
    await expect(getComputedStyle(within(dialog).getByTestId('first')).paddingInlineEnd).toBe(
      '48px',
    )
    await closeWithEscape()

    // Header only: no divider drawn over empty space.
    dialog = await open('Header only')
    const lone = dialog.querySelector<HTMLElement>('[data-slot="dialog-header"]')!
    await expect(getComputedStyle(lone).borderBottomWidth).toBe('0px')
    await closeWithEscape()
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Dialog>
        <DialogTrigger render={<Button variant='outline' />}>Close button</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>With the close button</DialogTitle>
            <DialogDescription>The default: an icon button in the corner.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger render={<Button variant='outline' />}>Long content</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              A long title that must wrap clear of the close button rather than run under it
            </DialogTitle>
          </DialogHeader>
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>
              Paragraph {i + 1}. The popup caps its height at the viewport and scrolls, so a footer
              never ends up off-screen.
            </p>
          ))}
          <DialogFooter>
            <DialogClose render={<Button />}>Done</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Edit contact details' }),
    )
    const popup = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
      if (!el) throw new Error('Dialog popup not mounted.')
      return el
    })

    // Proves globals.css loaded: --popover resolves to a real colour.
    const bg = getComputedStyle(popup).backgroundColor
    await expect(bg).not.toBe('rgba(0, 0, 0, 0)')

    // The 16px text floor: the description is the smallest text in the popup.
    const description = popup.querySelector<HTMLElement>('[data-slot="dialog-description"]')
    await expect(getComputedStyle(description!).fontSize).toBe('16px')

    // The header bleeds to the edge and reserves room for the corner close
    // button: 24px gutter + 48px.
    const header = popup.querySelector<HTMLElement>('[data-slot="dialog-header"]')
    await expect(getComputedStyle(header!).paddingInlineEnd).toBe('72px')

    await closeWithEscape()
  },
}

/**
 * AlertDialog — a modal that requires an explicit choice, on the Base UI
 * alert-dialog primitive (`role="alertdialog"`, no outside-click dismissal;
 * Escape still closes it, as Cancel).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { IconWarning } from '../icons/warning.js'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog.js'
import { Button } from './button.js'
import { waitForUnmount as waitForSlotUnmount } from './story-helpers.js'

const meta = {
  title: 'Components/Alert Dialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal that interrupts the user to confirm or cancel a consequential action. It has no close button and does not dismiss on an outside click; Escape closes it and counts as Cancel. AlertDialogAction does not close the dialog by itself — close it from your handler once the action succeeds.',
      },
    },
  },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant='outline' />}>
        Withdraw application
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw your application?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to start a new application if you change your mind.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep application</AlertDialogCancel>
          <AlertDialogAction color='danger'>Withdraw</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

const waitForUnmount = () => waitForSlotUnmount('alert-dialog-content')

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Withdraw application' })
    await userEvent.click(trigger)

    const dialog = await within(document.body).findByRole('alertdialog', {
      name: 'Withdraw your application?',
    })
    await expect(dialog).toHaveAccessibleDescription(
      'You will need to start a new application if you change your mind.',
    )
    // No corner close button: the footer's two choices are the only buttons.
    await expect(
      within(dialog)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Keep application', 'Withdraw'])

    await userEvent.click(within(dialog).getByRole('button', { name: 'Keep application' }))
    await waitForUnmount()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

/**
 * The action runs its handler and closes the dialog itself by controlling
 * `open` — the pattern for an action that can fail.
 */
export const ControlledAction: Story = {
  name: 'Controlled action',
  render: function Render() {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('Not withdrawn')
    return (
      <div className='flex flex-col items-center gap-4'>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger render={<Button variant='outline' />}>
            Withdraw application
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Withdraw your application?</AlertDialogTitle>
              <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep application</AlertDialogCancel>
              <AlertDialogAction
                color='danger'
                onClick={() => {
                  setStatus('Withdrawn')
                  setOpen(false)
                }}
              >
                Withdraw
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p data-testid='status'>{status}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Withdraw application' }))
    const dialog = await within(document.body).findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Withdraw' }))
    await waitForUnmount()
    await expect(canvas.getByTestId('status')).toHaveTextContent('Withdrawn')
  },
}

/**
 * The alert dialog's defining difference from Dialog: an outside click does
 * NOT dismiss it. Escape still does, and acts as Cancel.
 */
export const OutsideClickDoesNotDismiss: Story = {
  name: 'Outside click does not dismiss',
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Withdraw application' })
    await userEvent.click(trigger)
    const dialog = await within(document.body).findByRole('alertdialog')

    const overlay = document.querySelector<HTMLElement>('[data-slot="alert-dialog-overlay"]')
    if (!overlay) throw new Error('Alert dialog overlay not mounted.')
    await userEvent.click(overlay)
    // Give a dismissal the chance to start before asserting it did not.
    await new Promise((resolve) => setTimeout(resolve, 300))
    await expect(within(document.body).getByRole('alertdialog')).toBe(dialog)

    await userEvent.keyboard('{Escape}')
    await waitForUnmount()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

/** `size='sm'` narrows the popup and splits the footer into two equal buttons. */
export const Small: Story = {
  name: 'Small',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant='outline' />}>Sign out</AlertDialogTrigger>
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out?</AlertDialogTitle>
          <AlertDialogDescription>Unsaved changes will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction>Sign out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Sign out' }))
    const dialog = await within(document.body).findByRole('alertdialog')
    await expect(getComputedStyle(dialog).maxWidth).toBe('384px')

    const footer = dialog.querySelector<HTMLElement>('[data-slot="alert-dialog-footer"]')
    await expect(getComputedStyle(footer!).display).toBe('grid')
    const [stay, signOut] = within(footer!).getAllByRole('button')
    await expect(Math.round(stay!.getBoundingClientRect().width)).toBe(
      Math.round(signOut!.getBoundingClientRect().width),
    )

    await userEvent.click(stay!)
    await waitForUnmount()
  },
}

const LOOKS = ['default', 'band', 'rule'] as const

function LookDialog({ look, danger }: { look: (typeof LOOKS)[number]; danger: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant='outline' />}>
        {look} {danger ? 'danger' : 'plain'}
      </AlertDialogTrigger>
      <AlertDialogContent variant={look}>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <IconWarning aria-hidden='true' />
          </AlertDialogMedia>
          <AlertDialogTitle>{danger ? 'Delete this draft?' : 'Sign out?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {danger ? 'The draft is deleted permanently.' : 'Unsaved changes will be lost.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction color={danger ? 'danger' : undefined}>
            {danger ? 'Delete draft' : 'Sign out'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * The three approved looks. Under `band` and `rule` the colour follows the
 * decision: a danger action turns the band and the rule to the danger ramp,
 * any other action keeps the action colour.
 */
export const Looks: Story = {
  name: 'Looks',
  render: () => (
    <div className='grid grid-cols-2 gap-4'>
      {LOOKS.flatMap((look) => [
        <LookDialog key={`${look}-plain`} look={look} danger={false} />,
        <LookDialog key={`${look}-danger`} look={look} danger />,
      ])}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const read = async (name: string) => {
      await userEvent.click(canvas.getByRole('button', { name }))
      const dialog = await within(document.body).findByRole('alertdialog')
      const header = dialog.querySelector<HTMLElement>('[data-slot="alert-dialog-header"]')!
      const result = {
        variant: dialog.getAttribute('data-variant'),
        band: getComputedStyle(header).backgroundColor,
        rule: getComputedStyle(dialog).borderTopColor,
        titleColor: getComputedStyle(
          dialog.querySelector<HTMLElement>('[data-slot="alert-dialog-title"]')!,
        ).color,
        ruleWidth: getComputedStyle(dialog).borderTopWidth,
      }
      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
      await waitForUnmount()
      return result
    }

    const bandPlain = await read('band plain')
    const bandDanger = await read('band danger')
    await expect(bandDanger.variant).toBe('band')
    await expect(bandPlain.band).not.toBe('rgba(0, 0, 0, 0)')
    await expect(bandDanger.band).not.toBe(bandPlain.band)
    // Button's danger pairing: white on danger-600, 6.6:1 in both modes.
    await expect(bandDanger.titleColor).toBe('oklch(1 0 0)')

    const rulePlain = await read('rule plain')
    const ruleDanger = await read('rule danger')
    await expect(rulePlain.ruleWidth).toBe('4px')
    await expect(ruleDanger.rule).not.toBe(rulePlain.rule)

    const plain = await read('default plain')
    await expect(plain.ruleWidth).toBe('0px')
  },
}

/**
 * In dark mode `--text-inverse` is near-black, which on `--danger-solid` is
 * 4.06:1 — under the 4.5:1 floor. The danger band therefore uses Button's own
 * pairing, white on danger-600, in both modes. Only a dark page can tell the
 * two apart, since in light mode `--text-inverse` is white as well.
 */
export const DangerBandInDark: Story = {
  name: 'Danger band in dark',
  globals: { theme: 'dark' },
  render: () => <LookDialog look='band' danger />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'band danger' }))
    const dialog = await within(document.body).findByRole('alertdialog')
    const title = dialog.querySelector<HTMLElement>('[data-slot="alert-dialog-title"]')!
    const description = dialog.querySelector<HTMLElement>('[data-slot="alert-dialog-description"]')!
    await expect(getComputedStyle(title).color).toBe('oklch(1 0 0)')
    await expect(getComputedStyle(description).color).toBe('oklch(1 0 0)')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await waitForUnmount()
  },
}

/**
 * `tone='danger'` marks a destructive confirm whose danger button is not an
 * `AlertDialogAction` — here a plain Button — so the band still turns red. A
 * description placed below the band keeps its own ink rather than the band's.
 */
export const Tone: Story = {
  name: 'Tone',
  render: () => (
    <div className='flex gap-4'>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='outline' />}>Plain button</AlertDialogTrigger>
        <AlertDialogContent variant='band'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>The draft is deleted permanently.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button color='danger'>Delete draft</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='outline' />}>With tone</AlertDialogTrigger>
        <AlertDialogContent variant='band' tone='danger'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button color='danger'>Delete draft</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const read = async (name: string) => {
      await userEvent.click(canvas.getByRole('button', { name }))
      const dialog = await within(document.body).findByRole('alertdialog')
      const header = dialog.querySelector<HTMLElement>('[data-slot="alert-dialog-header"]')!
      const description = dialog.querySelector<HTMLElement>(
        '[data-slot="alert-dialog-description"]',
      )
      const result = {
        band: getComputedStyle(header).backgroundColor,
        descriptionInk: description ? getComputedStyle(description).color : null,
      }
      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
      await waitForUnmount()
      return result
    }
    const plain = await read('Plain button')
    const toned = await read('With tone')
    // Undetected danger stays on the action colour; tone='danger' turns it red.
    await expect(toned.band).not.toBe(plain.band)
    // Below the band, the description keeps its muted ink.
    await expect(plain.descriptionInk).not.toBe('oklch(1 0 0)')
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant='outline' />}>With media</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className='bg-(--danger-surface) text-(--danger-text)'>
              <IconWarning aria-hidden='true' />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              The draft and its attachments are deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction color='danger'>Delete draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Withdraw application' }),
    )
    const popup = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-slot="alert-dialog-content"]')
      if (!el) throw new Error('Alert dialog popup not mounted.')
      return el
    })

    // Proves globals.css loaded: --popover resolves to a real colour.
    await expect(getComputedStyle(popup).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    const description = popup.querySelector<HTMLElement>('[data-slot="alert-dialog-description"]')
    await expect(getComputedStyle(description!).fontSize).toBe('16px')

    await userEvent.click(within(popup).getByRole('button', { name: 'Keep application' }))
    await waitForUnmount()
  },
}

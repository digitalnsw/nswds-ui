/**
 * AlertDialog — Accessibility
 *
 * One story per WCAG 2.2 criterion a confirmation dialog has to meet, each
 * asserting it in play(). The role, focus trap and focus return come from the
 * Base UI alert-dialog; these pin the parts a consumer relies on — that the
 * question is announced as an alert dialog, can be answered and cancelled
 * from the keyboard, starts focus on the safe choice and gives it back, shows
 * where focus is, and is readable in every look, tone and theme.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogVariant,
} from './alert-dialog.js'
import { Button } from './button.js'
import {
  closeOverlay,
  compositeOver,
  expectContrast,
  resolveColor,
  waitForUnmount,
  wcagStoryMeta,
} from './story-helpers.js'

const meta = {
  title: 'Components/AlertDialog/Accessibility',
  component: AlertDialog,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

function WithdrawDialog({
  onWithdraw,
  variant,
  danger = true,
  trigger = 'Withdraw application',
}: {
  onWithdraw?: () => void
  variant?: AlertDialogVariant
  danger?: boolean
  trigger?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant='outline' />}>{trigger}</AlertDialogTrigger>
      <AlertDialogContent variant={variant}>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw your application?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to start a new application if you change your mind.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep application</AlertDialogCancel>
          <AlertDialogAction
            color={danger ? 'danger' : undefined}
            onClick={() => {
              onWithdraw?.()
              setOpen(false)
            }}
          >
            Withdraw
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const trigger = (canvasElement: HTMLElement, name = 'Withdraw application') =>
  within(canvasElement).getByRole('button', { name })

async function openWithKeyboard(canvasElement: HTMLElement) {
  await userEvent.tab()
  await expect(trigger(canvasElement)).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  return within(document.body).findByRole('alertdialog', { name: 'Withdraw your application?' })
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
          why: 'An alert dialog interrupts the reader, so a screen reader must announce it as one — with the question as its name and the consequence as its description — and both choices must be named buttons.',
          how: 'Open the dialog. The play() asserts the trigger says it opens a dialog and whether it is expanded, that the popup has role alertdialog named by the title and described by the description, that the page behind is hidden from assistive tech, and that the only buttons are the two named choices.',
          caveat:
            'Base UI conveys modality by marking the rest of the page aria-hidden rather than by setting aria-modal. There is no corner close button: the reader answers the question.',
        }),
      },
    },
  },
  render: () => <WithdrawDialog />,
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)
    const dialog = await within(document.body).findByRole('alertdialog', {
      name: 'Withdraw your application?',
    })
    await expect(dialog).toHaveAccessibleDescription(
      'You will need to start a new application if you change your mind.',
    )
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(button.closest('[aria-hidden="true"]')).not.toBeNull())
    await expect(
      within(dialog)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Keep application', 'Withdraw'])
    await closeOverlay('alert-dialog-content')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const withdrawn = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Both answers to the question — and backing out of it — must be reachable from the keyboard alone.',
          how: 'Tab to the trigger and press Enter: the dialog opens. Escape closes it without acting. Open it again, Tab to Withdraw and press Enter: the action runs once and the dialog closes. Tab never leaves the dialog. The play() drives and asserts each step.',
          caveat:
            'Escape always counts as Cancel — an outside click does not dismiss an alert dialog, but Escape must, so closing the dialog must never perform the action.',
        }),
      },
    },
  },
  render: () => <WithdrawDialog onWithdraw={withdrawn} />,
  play: async ({ canvasElement }) => {
    withdrawn.mockClear()
    let dialog = await openWithKeyboard(canvasElement)
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    await userEvent.keyboard('{Escape}')
    await waitForUnmount('alert-dialog-content')
    await expect(withdrawn).not.toHaveBeenCalled()

    await waitFor(() => expect(trigger(canvasElement)).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    dialog = await within(document.body).findByRole('alertdialog')
    const withdraw = within(dialog).getByRole('button', { name: 'Withdraw' })
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    // Focus is trapped: three Tabs cycle the two buttons without leaving.
    for (let i = 0; i < 3; i++) {
      await userEvent.tab()
      await waitFor(() =>
        expect(dialog.contains(document.activeElement), document.activeElement?.outerHTML).toBe(
          true,
        ),
      )
    }
    if (document.activeElement !== withdraw) await userEvent.tab()
    await expect(withdraw).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitForUnmount('alert-dialog-content')
    await expect(withdrawn).toHaveBeenCalledTimes(1)
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
          why: 'When the question appears, focus must move into it — onto the safe choice, so a stray Enter does not act — and come back to the trigger when it is answered.',
          how: 'Open the dialog from the keyboard: focus lands on Cancel, the first choice. Tab moves to the action. Cancelling returns focus to the trigger. The play() asserts every step.',
          caveat:
            'Keep AlertDialogCancel before AlertDialogAction in the footer. The order in the DOM is the focus order, whatever the layout draws.',
        }),
      },
    },
  },
  render: () => <WithdrawDialog />,
  play: async ({ canvasElement }) => {
    const dialog = await openWithKeyboard(canvasElement)
    const cancel = within(dialog).getByRole('button', { name: 'Keep application' })
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab()
    await expect(within(dialog).getByRole('button', { name: 'Withdraw' })).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect(cancel).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitForUnmount('alert-dialog-content')
    await waitFor(() => expect(trigger(canvasElement)).toHaveFocus())
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
          why: 'With only two choices and one of them destructive, a keyboard reader must see which one Enter will press.',
          how: 'Open the dialog and Tab between the two buttons. The play() asserts each focused button paints an outline.',
          caveat: 'The indicator is Button’s own focus outline, in the button’s colour.',
        }),
      },
    },
  },
  render: () => <WithdrawDialog />,
  play: async ({ canvasElement }) => {
    const dialog = await openWithKeyboard(canvasElement)
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    for (let i = 0; i < 2; i++) {
      const style = getComputedStyle(document.activeElement!)
      await expect(style.outlineStyle).not.toBe('none')
      await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
      await userEvent.tab()
    }
    await closeOverlay('alert-dialog-content')
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const cases: ReadonlyArray<readonly [AlertDialogVariant, boolean]> = [
  ['default', false],
  ['band', false],
  ['band', true],
  ['rule', false],
  ['rule', true],
]

const contrastStory: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The question and its consequence must clear 4.5:1 against the surface they sit on — including the band header, which takes the danger colour for a destructive confirm.',
          how: 'Each look is opened in turn — band and rule both with the action colour and with a danger action — and the play() measures the title and description against the colour actually painted behind them.',
          caveat:
            'Measured in both themes (see the dark story). The buttons are covered by Button’s own contrast stories.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {cases.map(([look, danger]) => (
        <WithdrawDialog
          key={`${look}-${danger}`}
          variant={look}
          danger={danger}
          trigger={`${look}${danger ? ' danger' : ''}`}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const [look, danger] of cases) {
      const name = `${look}${danger ? ' danger' : ''}`
      await userEvent.click(trigger(canvasElement, name))
      const dialog = await within(document.body).findByRole('alertdialog')
      await waitFor(() => expect(dialog).not.toHaveAttribute('data-starting-style'))
      for (const slot of ['alert-dialog-title', 'alert-dialog-description']) {
        const element = dialog.querySelector(`[data-slot="${slot}"]`)!
        expectContrast(getComputedStyle(element).color, surfaceBehind(element), {
          label: `${name} ${slot}`,
        })
      }
      await closeOverlay('alert-dialog-content')
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

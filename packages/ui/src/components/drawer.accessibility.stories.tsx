/**
 * Drawer — Accessibility
 *
 * One story per WCAG 2.2 criterion a drawer has to meet, each asserting it in
 * play(). Vaul builds the drawer on the Radix dialog, which owns the role,
 * focus trap, focus return and Escape; these pin the parts a consumer relies
 * on — that the drawer is announced as a named modal, works without dragging,
 * shows where focus is, and is readable in both themes.
 *
 * Focus Order (2.4.3) has no story: with Vaul's default `autoFocus={false}`,
 * opening the drawer leaves focus on the trigger, which the open modal hides
 * from assistive tech. That is a finding against the component, not a story
 * to weaken until it passes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer.js'
import { closeOverlay, expectContrast, waitForUnmount, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Drawer/Accessibility',
  component: Drawer,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

function BookingDrawer({ onReschedule }: { onReschedule?: () => void }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline'>Manage booking</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Manage your booking</DrawerTitle>
          <DrawerDescription>Driver knowledge test, Tuesday 14 October.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={onReschedule}>Reschedule</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant='outline'>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const trigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Manage booking' })

async function openWithKeyboard(canvasElement: HTMLElement) {
  await userEvent.tab()
  await expect(trigger(canvasElement)).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  return within(document.body).findByRole('dialog', { name: 'Manage your booking' })
}

/** Tabs forward until `target` has focus, failing after a few presses. */
async function tabTo(target: HTMLElement) {
  for (let i = 0; i < 6 && document.activeElement !== target; i++) {
    await userEvent.tab()
    await waitFor(() => expect(document.activeElement).not.toBe(document.body))
  }
  await expect(target).toHaveFocus()
  return target
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
          why: 'A drawer looks like part of the page sliding up, but it is a modal dialog. A screen reader must announce it as one, with a name and a purpose, and the trigger must say what it opens.',
          how: 'Open the drawer. The play() asserts the trigger says it opens a dialog and whether it is expanded, that the panel has role dialog named by DrawerTitle and described by DrawerDescription, and that the page behind is hidden from assistive tech while it is open.',
          caveat:
            'The drag handle is decorative and has no role. A drawer without a DrawerTitle has no name — always give it one.',
        }),
      },
    },
  },
  render: () => <BookingDrawer />,
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)
    const drawer = await within(document.body).findByRole('dialog', {
      name: 'Manage your booking',
    })
    await expect(drawer).toHaveAccessibleDescription('Driver knowledge test, Tuesday 14 October.')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(button.closest('[aria-hidden="true"]')).not.toBeNull())
    await closeOverlay('drawer-content')
    await waitFor(() => expect(button.closest('[aria-hidden="true"]')).toBeNull())
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const rescheduled = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Dragging is the drawer’s signature gesture, but it can never be the only way: a keyboard reader must open it, act in it and dismiss it without a pointer.',
          how: 'Tab to the trigger and press Enter: the drawer opens. Escape closes it. Open it again, Tab to Reschedule and press Enter: the action runs and the drawer closes. The play() drives and asserts each step.',
          caveat:
            'A drawer has no corner close button: the DrawerClose in the footer is what makes it dismissible without dragging or Escape, so never leave it out. Vaul does not move focus into the drawer on open by default (autoFocus is off), so the reader has to Tab in.',
        }),
      },
    },
  },
  render: () => <BookingDrawer onReschedule={rescheduled} />,
  play: async ({ canvasElement }) => {
    rescheduled.mockClear()
    await openWithKeyboard(canvasElement)
    await userEvent.keyboard('{Escape}')
    await waitForUnmount('drawer-content')
    await expect(rescheduled).not.toHaveBeenCalled()

    await waitFor(() => expect(trigger(canvasElement)).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    const drawer = await within(document.body).findByRole('dialog', {
      name: 'Manage your booking',
    })
    const reschedule = await tabTo(within(drawer).getByRole('button', { name: 'Reschedule' }))
    await expect(reschedule).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitForUnmount('drawer-content')
    await expect(rescheduled).toHaveBeenCalledTimes(1)
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
          why: 'A keyboard reader must see which of the drawer’s stacked, full-width buttons has focus.',
          how: 'Open the drawer and Tab to each footer button. The play() asserts each focused button paints an outline.',
          caveat: 'The indicator is Button’s own focus outline.',
        }),
      },
    },
  },
  render: () => <BookingDrawer />,
  play: async ({ canvasElement }) => {
    const drawer = await openWithKeyboard(canvasElement)
    for (const name of ['Reschedule', 'Close']) {
      const button = await tabTo(within(drawer).getByRole('button', { name }))
      await expect(button).toHaveFocus()
      const style = getComputedStyle(button)
      await expect(style.outlineStyle).not.toBe('none')
      await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
    }
    await closeOverlay('drawer-content')
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
          why: 'The drawer’s title and description must clear 4.5:1 against its surface.',
          how: 'The drawer is opened and the play() measures the title and description against the panel’s surface, which the drawer paints on a ::before layer inset from its edges.',
          caveat: 'Measured in both themes (see the dark story).',
        }),
      },
    },
  },
  render: () => <BookingDrawer />,
  play: async ({ canvasElement }) => {
    await userEvent.click(trigger(canvasElement))
    const drawer = await within(document.body).findByRole('dialog', {
      name: 'Manage your booking',
    })
    const surface = getComputedStyle(drawer, '::before').backgroundColor
    for (const slot of ['drawer-title', 'drawer-description']) {
      const element = drawer.querySelector(`[data-slot="${slot}"]`)!
      expectContrast(getComputedStyle(element).color, surface, { label: slot })
    }
    await closeOverlay('drawer-content')
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

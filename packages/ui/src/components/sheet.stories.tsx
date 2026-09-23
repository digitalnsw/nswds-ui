/**
 * Sheet — an edge-anchored dialog that slides in from any side, on the Base UI
 * dialog primitive. Base UI owns the focus trap, scroll lock, and dismissal.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.js'

const triggerClasses = 'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An edge-anchored dialog that slides in from the top, right, bottom, or left. Base UI provides the focus trap, scroll lock, and Escape / outside-click dismissal.',
      },
    },
  },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger className={triggerClasses}>Open sheet</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Save when you are done.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-slot="sheet-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="sheet-trigger"].')
    }
  },
}

/**
 * The close button is icon-only and portaled, so `closeLabel` is the only name
 * AT ever hears for it and the only way a consumer can translate it. Nothing
 * opened the sheet before, so the whole path could have broken silently.
 */
export const TranslatedCloseLabel: Story = {
  name: 'Translated close label',
  render: () => (
    <Sheet>
      <SheetTrigger className={triggerClasses}>Open sheet</SheetTrigger>
      <SheetContent closeLabel='Cerrar panel'>
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>Realice cambios en su perfil aquí.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sheet-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="sheet-trigger"].')
    }
    trigger.click()

    // The popup is PORTALED to the document body, so query the whole document
    // rather than canvasElement — querying the canvas is how this assertion
    // would silently pass on nothing.
    const screen = within(document.body)
    const close = await waitFor(() => screen.getByRole('button', { name: 'Cerrar panel' }))
    await expect(close).toBeInTheDocument()

    // Close again so the suite's next story starts from a clean body and the
    // a11y pass does not run against a mounted dialog's focus guards.
    close.click()
    await waitFor(() =>
      expect(document.querySelector('[data-slot="sheet-content"]')).not.toBeInTheDocument(),
    )
  },
}

/**
 * Base UI focuses the first tabbable element on open. The close button is
 * first in the DOM so that is the close button, not a footer action — with
 * the footer first, a long sheet opened scrolled to the bottom and put the
 * reader past everything above it.
 */
export const LongContentOpensAtTop: Story = {
  name: 'Long content opens at the top',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Read the conditions</SheetTrigger>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Conditions of use</SheetTitle>
        </SheetHeader>
        <div className='flex flex-col gap-4 px-6'>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>Condition {i + 1}. Long enough content to overflow the viewport.</p>
          ))}
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>I agree</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Read the conditions' }),
    )
    // The popup is portaled, so query the whole document, not the canvas.
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Conditions of use' },
      { timeout: 3000 },
    )
    await waitFor(
      () => expect(within(sheet).getByRole('button', { name: 'Close' })).toHaveFocus(),
      { timeout: 3000 },
    )
    // The popup is the scroll container here; unless it really scrolls, the
    // scrollTop assertion passes on nothing. scrollHeight alone is not enough:
    // it exceeds clientHeight under `overflow: visible` too, where scrollTop
    // is always 0.
    await expect(getComputedStyle(sheet).overflowY).toBe('auto')
    await expect(sheet.scrollHeight).toBeGreaterThan(sheet.clientHeight)
    await expect(sheet.scrollTop).toBe(0)

    await userEvent.keyboard('{Escape}')
    await waitFor(
      () => expect(document.querySelector('[data-slot="sheet-content"]')).not.toBeInTheDocument(),
      { timeout: 3000 },
    )
  },
}

/**
 * The close button is first in the DOM, and positioned elements without a
 * z-index paint in DOM order, so any later positioned child in the corner —
 * a Button is `relative` — would draw over it and take its clicks. Its own
 * z-index keeps it on top.
 */
export const CloseButtonStaysOnTop: Story = {
  name: 'Close button stays on top',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open toolbar sheet</SheetTrigger>
      <SheetContent>
        <Button>Action spanning the top edge</Button>
        <SheetTitle>Toolbar sheet</SheetTitle>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open toolbar sheet' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Toolbar sheet' },
      { timeout: 3000 },
    )
    const close = within(sheet).getByRole('button', { name: 'Close' })
    const action = within(sheet).getByRole('button', { name: 'Action spanning the top edge' })

    // Wait out the slide-in so the rects are final: it starts 2.5rem off-screen,
    // and getAnimations() can be empty before the transition registers, so
    // wait for the right-side sheet to reach the viewport edge instead. Then
    // prove the two really overlap, or the hit test below passes on nothing.
    await waitFor(
      () =>
        expect(Math.round(sheet.getBoundingClientRect().right)).toBe(
          document.documentElement.clientWidth,
        ),
      { timeout: 3000 },
    )
    const c = close.getBoundingClientRect()
    const a = action.getBoundingClientRect()
    await expect(a.bottom > c.top && a.top < c.bottom && a.right > c.left && a.left < c.right).toBe(
      true,
    )

    const hit = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2)
    await expect(close.contains(hit)).toBe(true)

    await userEvent.keyboard('{Escape}')
    await waitFor(
      () => expect(document.querySelector('[data-slot="sheet-content"]')).not.toBeInTheDocument(),
      { timeout: 3000 },
    )
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground'>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Side: {side}</SheetTitle>
              <SheetDescription>Slides in from the {side}.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the trigger resolves the semantic
    // --primary token to a real, non-transparent colour.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="sheet-trigger"]')
    if (!trigger) throw new Error('Sheet trigger not found.')
    const bg = getComputedStyle(trigger).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the --primary token to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }
  },
}

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
import { closeOverlay, waitForUnmount } from './story-helpers.js'

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Runs a play's assertions, then closes the sheet with the shared
 * `closeOverlay` — on failure too, so a leftover dialog never adds an axe
 * failure on top of the real one. A failed close after a failed assertion is
 * dropped so the first error is reported.
 */
async function thenCloseSheet(assertions: () => Promise<void>) {
  try {
    await assertions()
  } catch (error) {
    await closeOverlay('sheet-content').catch(() => {})
    throw error
  }
  await closeOverlay('sheet-content')
}

/**
 * Waits out the slide-in so rects are final. getAnimations() alone can be
 * empty before the transition registers, so also require that the starting
 * style has gone — once it has, reading animations flushes style and the
 * running transition shows up until it ends.
 */
async function waitForSlideIn(sheet: HTMLElement) {
  await waitFor(
    () => {
      expect(sheet).not.toHaveAttribute('data-starting-style')
      expect(sheet.getAnimations()).toHaveLength(0)
    },
    { timeout: 3000 },
  )
}

const conditions = (
  <div className='flex flex-col gap-4 px-6'>
    {Array.from({ length: 30 }, (_, i) => (
      <p key={i}>Condition {i + 1}. Long enough content to overflow the viewport.</p>
    ))}
  </div>
)

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
    await waitForUnmount('sheet-content')
  },
}

/**
 * Base UI focuses the first tabbable element on a keyboard or mouse open. The
 * close button is first in the DOM so that is the close button, not a footer
 * action — with the footer first, a long sheet opened scrolled to the bottom
 * and put the reader past everything above it. The sheet scrolls by default:
 * without that, content past the viewport could not be reached at all.
 */
export const LongContentOpensAtTop: Story = {
  name: 'Long content opens at the top',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Read the conditions</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Conditions of use</SheetTitle>
        </SheetHeader>
        {conditions}
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
    await thenCloseSheet(async () => {
      await waitFor(
        () => expect(within(sheet).getByRole('button', { name: 'Close' })).toHaveFocus(),
        { timeout: 3000 },
      )
      // The popup is the scroll container; unless it really scrolls, the
      // scrollTop assertion passes on nothing. scrollHeight alone is not
      // enough: it exceeds clientHeight under `overflow: visible` too, where
      // scrollTop is always 0.
      await expect(getComputedStyle(sheet).overflowY).toBe('auto')
      await expect(sheet.scrollHeight).toBeGreaterThan(sheet.clientHeight)
      await expect(sheet.scrollTop).toBe(0)

      // The header keeps a long title clear of the close button (it spans
      // 16px-56px from the end edge).
      const header = sheet.querySelector<HTMLElement>('[data-slot="sheet-header"]')!
      await expect(getComputedStyle(header).paddingInlineEnd).toBe('64px')

      // No text below the 16px floor.
      const title = within(sheet).getByText('Conditions of use')
      const body = within(sheet).getByText(/^Condition 1\./)
      await expect(parseFloat(getComputedStyle(body).fontSize)).toBeGreaterThanOrEqual(16)
      await expect(parseFloat(getComputedStyle(title).fontSize)).toBeGreaterThan(16)
    })
  },
}

/**
 * Without the close button there is no known-safe first control, so the sheet
 * focuses itself (Base UI does so without scrolling) rather than a footer
 * action below the fold. The header reserves no room for a button it lacks.
 */
export const WithoutCloseButtonOpensAtTop: Story = {
  name: 'Without the close button, long content opens at the top',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Read the terms</SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Terms of use</SheetTitle>
        </SheetHeader>
        {conditions}
        <SheetFooter>
          <SheetClose render={<Button />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Read the terms' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Terms of use' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      await waitFor(() => expect(sheet).toHaveFocus(), { timeout: 3000 })
      await expect(sheet.scrollHeight).toBeGreaterThan(sheet.clientHeight)
      await expect(sheet.scrollTop).toBe(0)

      const header = sheet.querySelector<HTMLElement>('[data-slot="sheet-header"]')!
      await expect(getComputedStyle(header).paddingInlineEnd).toBe('24px')
    })
  },
}

/**
 * An edit panel commonly wraps everything in a `<form>`, so the header is not
 * a direct child of the sheet. It still reserves room for the close button,
 * or a long title runs underneath it.
 */
export const HeaderInsideForm: Story = {
  name: 'Header inside a form keeps clear of the close button',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Edit preferences</SheetTrigger>
      <SheetContent>
        <form onSubmit={(event) => event.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Update your contact and delivery preferences</SheetTitle>
          </SheetHeader>
        </form>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Edit preferences' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Update your contact and delivery preferences' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const header = sheet.querySelector<HTMLElement>('[data-slot="sheet-header"]')!
      await expect(header.parentElement?.tagName).toBe('FORM')
      await expect(getComputedStyle(header).paddingInlineEnd).toBe('64px')
    })
  },
}

/**
 * The close button is first in the DOM, and positioned elements paint in DOM
 * order when their z-index ties, so a later positioned child in the corner —
 * a Button is `relative`, a sticky header is conventionally z-10 — would draw
 * over it and take its clicks. Its own z-20 keeps it on top.
 */
export const CloseButtonStaysOnTop: Story = {
  name: 'Close button stays on top',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open toolbar sheet</SheetTrigger>
      <SheetContent>
        <Button className='z-10'>Action spanning the top edge</Button>
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
    await thenCloseSheet(async () => {
      const close = within(sheet).getByRole('button', { name: 'Close' })
      const action = within(sheet).getByRole('button', { name: 'Action spanning the top edge' })

      // Prove the two really overlap once the rects are final, or the hit
      // test below passes on nothing.
      await waitForSlideIn(sheet)
      const c = close.getBoundingClientRect()
      const a = action.getBoundingClientRect()
      await expect(
        a.bottom > c.top && a.top < c.bottom && a.right > c.left && a.left < c.right,
      ).toBe(true)

      const hit = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2)
      await expect(close.contains(hit)).toBe(true)
    })
  },
}

// Module scope so the ref keeps one identity across renders, as a consumer's
// stable callback ref would.
const cleanupRefCalls: Array<HTMLElement | null | 'cleanup'> = []
function cleanupRef(node: HTMLDivElement | null) {
  cleanupRefCalls.push(node)
  return () => {
    cleanupRefCalls.push('cleanup')
  }
}

/**
 * SheetContent merges a consumer's `ref` with its own. React 19 keeps a
 * callback ref's return value as its cleanup and, when there is one, never
 * calls the ref with null — so the merge must hand that cleanup back rather
 * than swallow it, or a consumer's teardown never runs.
 */
export const ForwardsCleanupRef: Story = {
  name: 'Forwards a cleanup-returning ref',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open ref sheet</SheetTrigger>
      <SheetContent ref={cleanupRef}>
        <SheetHeader>
          <SheetTitle>Ref sheet</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    cleanupRefCalls.length = 0
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open ref sheet' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Ref sheet' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      await expect(cleanupRefCalls.at(-1)).toBe(sheet)
    })

    // Every attach was torn down by the consumer's own cleanup, never by a
    // null call. Counted rather than matched exactly so a StrictMode
    // double-attach would still pass.
    const attaches = cleanupRefCalls.filter((call) => call instanceof HTMLElement).length
    const cleanups = cleanupRefCalls.filter((call) => call === 'cleanup').length
    await expect(cleanupRefCalls).not.toContain(null)
    await expect(attaches).toBeGreaterThan(0)
    await expect(cleanups).toBe(attaches)
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

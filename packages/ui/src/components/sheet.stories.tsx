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

/**
 * Asserts an element's content box does not intersect the close button, in
 * both axes and either writing direction, after the slide-in settles. Also
 * requires the border boxes to overlap first — otherwise the element was never
 * in the button's corner and "clear" would pass on nothing.
 */
async function expectClearOfClose(sheet: HTMLElement, element: HTMLElement) {
  await waitForSlideIn(sheet)
  const close = within(sheet).getByRole('button', { name: 'Close' }).getBoundingClientRect()
  const border = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  const px = (value: string) => parseFloat(value) || 0
  const content = {
    left: border.left + px(style.borderLeftWidth) + px(style.paddingLeft),
    right: border.right - px(style.borderRightWidth) - px(style.paddingRight),
    top: border.top + px(style.borderTopWidth) + px(style.paddingTop),
    bottom: border.bottom - px(style.borderBottomWidth) - px(style.paddingBottom),
  }
  const intersects = (box: { left: number; right: number; top: number; bottom: number }) =>
    box.left < close.right &&
    box.right > close.left &&
    box.top < close.bottom &&
    box.bottom > close.top
  await expect(intersects(border)).toBe(true)
  await expect(intersects(content)).toBe(false)
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
      // The form wraps the header, so it is left to the header rule rather
      // than padded as a whole.
      await expect(getComputedStyle(header.parentElement!).paddingInlineEnd).toBe('0px')
    })
  },
}

/**
 * With no SheetHeader, the first visible thing after the close button — here a
 * SheetTitle given its own gutter — reserves the button's room instead, so a
 * long title does not run under it. The popup has no gutter of its own and the
 * button reaches 56px from the end edge, so that is 64px (Dialog's 48px sits
 * on a 24px gutter).
 */
export const NoHeaderKeepsClearOfCloseButton: Story = {
  name: 'Without a header, the first content keeps clear of the close button',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open notice</SheetTrigger>
      <SheetContent>
        <SheetTitle className='px-6 pt-6'>
          Your application has been received and is being assessed
        </SheetTitle>
        <p className='px-6'>We will contact you within 10 business days.</p>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open notice' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Your application has been received and is being assessed' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const title = within(sheet).getByText(
        'Your application has been received and is being assessed',
      )
      await expect(getComputedStyle(title).paddingInlineEnd).toBe('64px')
      await expectClearOfClose(sheet, title)

      // Only the first element: later content keeps its own padding.
      const body = within(sheet).getByText('We will contact you within 10 business days.')
      await expect(getComputedStyle(body).paddingInlineEnd).toBe('24px')
    })
  },
}

/**
 * The padding goes to whatever sits beside the close button, so an intro that
 * comes BEFORE the header is padded too: it is the content in the button's
 * corner. Gating on "no header anywhere in the sheet" would let the intro run
 * under the button. The header further down keeps its own padding.
 */
export const IntroBeforeHeaderKeepsClear: Story = {
  name: 'Intro before the header keeps clear of the close button',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open intro sheet</SheetTrigger>
      <SheetContent>
        <p className='px-6 pt-6'>
          Before you start, have your licence number and renewal notice ready.
        </p>
        <SheetHeader>
          <SheetTitle>Renew your licence</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open intro sheet' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Renew your licence' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const intro = within(sheet).getByText(/^Before you start/)
      await expect(getComputedStyle(intro).paddingInlineEnd).toBe('64px')
      await expectClearOfClose(sheet, intro)

      const header = sheet.querySelector<HTMLElement>('[data-slot="sheet-header"]')!
      await expect(getComputedStyle(header).paddingInlineEnd).toBe('64px')
    })
  },
}

/**
 * A visually hidden first element (the common sr-only SheetTitle that names a
 * sheet without a visible title) is skipped: the padding goes to the first
 * VISIBLE content, which is what actually sits in the button's corner.
 */
export const HiddenTitleFirstKeepsClear: Story = {
  name: 'An sr-only title first still keeps the visible content clear',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open filters</SheetTrigger>
      <SheetContent>
        <SheetTitle className='sr-only'>Filters</SheetTitle>
        <p className='px-6 pt-6'>Choose the services you want to see listed below.</p>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open filters' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Filters' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const intro = within(sheet).getByText(/^Choose the services/)
      await expect(getComputedStyle(intro).paddingInlineEnd).toBe('64px')
      await expectClearOfClose(sheet, intro)
    })
  },
}

/**
 * `data-sheet-bleed` opts the first element out of the reserved room, for
 * content meant to run under the close button — a full-bleed banner, or a
 * wrapper holding the whole sheet whose rows should reach the edge.
 */
export const BleedOptOut: Story = {
  name: 'data-sheet-bleed lets the first element run under the close button',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open banner sheet</SheetTrigger>
      <SheetContent>
        <div data-sheet-bleed='' data-testid='banner' className='h-24 bg-foreground/10' />
        <SheetHeader>
          <SheetTitle>Banner sheet</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open banner sheet' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Banner sheet' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const banner = within(sheet).getByTestId('banner')
      await expect(getComputedStyle(banner).paddingInlineEnd).toBe('0px')
    })
  },
}

/**
 * Without the close button there is nothing to keep clear of, so the first
 * element keeps its own padding.
 */
export const NoCloseButtonNoReservedRoom: Story = {
  name: 'Without the close button, no room is reserved',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open plain sheet</SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetTitle className='px-6 pt-6'>Plain sheet</SheetTitle>
        <SheetFooter>
          <SheetClose render={<Button />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open plain sheet' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Plain sheet' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const title = within(sheet).getByText('Plain sheet')
      await expect(getComputedStyle(title).paddingInlineEnd).toBe('24px')
    })
  },
}

/**
 * A consumer's own SheetClose carries the same `data-slot` as the built-in
 * button, but it is not the corner button: with `showCloseButton={false}` it
 * must not switch the reserved room on for the content after it.
 */
export const ConsumerCloseWithoutBuiltIn: Story = {
  name: "A consumer SheetClose doesn't reserve room without the close button",
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open results</SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetClose render={<Button variant='ghost' />}>Back</SheetClose>
        <SheetTitle className='px-6 pt-6'>Search results</SheetTitle>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open results' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Search results' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const title = within(sheet).getByText('Search results')
      await expect(getComputedStyle(title).paddingInlineEnd).toBe('24px')
      // Nor is the Back button itself given the corner's room.
      const back = within(sheet).getByRole('button', { name: 'Back' })
      await expect(getComputedStyle(back).paddingInlineEnd).not.toBe('64px')
    })
  },
}

/**
 * With the close button shown, a consumer SheetClose placed first IS the
 * content in the corner, so it is padded like any other first child.
 */
export const ConsumerCloseFirstKeepsClear: Story = {
  name: 'A consumer SheetClose placed first keeps clear of the close button',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open result</SheetTrigger>
      <SheetContent>
        <SheetClose render={<Button variant='ghost' className='w-full justify-start' />}>
          Back to all search results
        </SheetClose>
        <SheetHeader>
          <SheetTitle>Result details</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open result' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Result details' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const back = within(sheet).getByRole('button', { name: 'Back to all search results' })
      await expect(getComputedStyle(back).paddingInlineEnd).toBe('64px')
      await expectClearOfClose(sheet, back)
    })
  },
}

/**
 * A header nested more than one level deep (a form holding a layout div) is
 * padded once, by the header rule; the wrappers around it are not padded as
 * well, or the title would end 128px from the edge.
 */
export const HeaderTwoLevelsDeep: Story = {
  name: 'A header nested two levels deep is padded once',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Edit contact</SheetTrigger>
      <SheetContent>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className='flex flex-col'>
            <SheetHeader>
              <SheetTitle>Update your contact preferences</SheetTitle>
            </SheetHeader>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Edit contact' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Update your contact preferences' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const header = sheet.querySelector<HTMLElement>('[data-slot="sheet-header"]')!
      const layout = header.parentElement!
      const form = layout.parentElement!
      await expect(getComputedStyle(header).paddingInlineEnd).toBe('64px')
      await expect(getComputedStyle(layout).paddingInlineEnd).toBe('0px')
      await expect(getComputedStyle(form).paddingInlineEnd).toBe('0px')
    })
  },
}

/**
 * An intro inside the form that wraps the header is still the content in the
 * button's corner, so it is padded, as it is when it sits directly in the
 * sheet.
 */
export const IntroInsideHeaderForm: Story = {
  name: 'An intro inside a header-wrapping form keeps clear of the close button',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Renew in a form</SheetTrigger>
      <SheetContent>
        <form onSubmit={(event) => event.preventDefault()}>
          <p className='px-6 pt-6'>Before you start, have your licence number ready.</p>
          <SheetHeader>
            <SheetTitle>Renew your licence online</SheetTitle>
          </SheetHeader>
        </form>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Renew in a form' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Renew your licence online' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const intro = within(sheet).getByText(/^Before you start, have your licence number ready/)
      await expect(getComputedStyle(intro).paddingInlineEnd).toBe('64px')
      await expectClearOfClose(sheet, intro)
      await expect(getComputedStyle(intro.parentElement!).paddingInlineEnd).toBe('0px')
    })
  },
}

/**
 * `data-sheet-bleed` opts a SheetHeader out as well — the most common first
 * child — e.g. for a full-bleed header band meant to run under the button.
 */
export const BleedHeaderOptOut: Story = {
  name: 'data-sheet-bleed opts a header out too',
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>Open band sheet</SheetTrigger>
      <SheetContent>
        <SheetHeader data-sheet-bleed=''>
          <SheetTitle>Band sheet</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open band sheet' }))
    const sheet = await within(document.body).findByRole(
      'dialog',
      { name: 'Band sheet' },
      { timeout: 3000 },
    )
    await thenCloseSheet(async () => {
      const header = sheet.querySelector<HTMLElement>('[data-slot="sheet-header"]')!
      await expect(getComputedStyle(header).paddingInlineEnd).toBe('24px')
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

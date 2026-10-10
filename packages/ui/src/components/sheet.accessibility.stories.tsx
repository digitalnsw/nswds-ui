/**
 * Sheet — Accessibility
 *
 * One story per WCAG 2.2 criterion an edge-anchored dialog has to meet, each
 * asserting it in play(). The focus trap, scroll lock, focus return and
 * Escape come from the Base UI dialog; these pin the parts a consumer relies
 * on — that the sheet is announced as a named modal, can be driven and left
 * from the keyboard, takes focus in at the top and gives it back, shows where
 * focus is, and is readable in both themes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import { Checkbox } from './checkbox.js'
import { Field, FieldLabel } from './field.js'
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
import {
  closeOverlay,
  compositeOver,
  expectContrast,
  resolveColor,
  waitForUnmount,
  wcagStoryMeta,
} from './story-helpers.js'

const meta = {
  title: 'Components/Sheet/Accessibility',
  component: Sheet,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

function FilterSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant='outline' />}>Filter grants</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter grants</SheetTitle>
          <SheetDescription>Show only the grants you are eligible for.</SheetDescription>
        </SheetHeader>
        <div className='grid gap-3 px-6'>
          <Field orientation='horizontal' className='min-h-11 gap-4'>
            <Checkbox name='applicant' value='business' />
            <FieldLabel className='font-normal'>Small businesses</FieldLabel>
          </Field>
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>Show results</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const trigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Filter grants' })

async function openWithKeyboard(canvasElement: HTMLElement) {
  await userEvent.tab()
  await expect(trigger(canvasElement)).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  return within(document.body).findByRole('dialog', { name: 'Filter grants' })
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
          why: 'A sheet is a modal dialog drawn at the edge of the screen. A screen reader must announce it as one, with a name and a purpose, and know the page behind is out of reach.',
          how: 'Open the sheet. The play() asserts the trigger says it opens a dialog and whether it is expanded, that the popup has role dialog named by SheetTitle and described by SheetDescription, that the page behind is hidden from assistive tech, and that the corner button is named.',
          caveat:
            'Base UI conveys modality by marking the rest of the page aria-hidden rather than by setting aria-modal. The corner button’s only name is closeLabel — translate it with the page.',
        }),
      },
    },
  },
  render: () => <FilterSheet />,
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)
    const sheet = await within(document.body).findByRole('dialog', { name: 'Filter grants' })
    await expect(sheet).toHaveAccessibleDescription('Show only the grants you are eligible for.')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(button.closest('[aria-hidden="true"]')).not.toBeNull())
    await expect(within(sheet).getByRole('button', { name: 'Close' })).toBeInTheDocument()
    await closeOverlay('sheet-content')
    await expect(button.closest('[aria-hidden="true"]')).toBeNull()
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
          why: 'Opening a sheet, using what is inside it and dismissing it must all work without a mouse.',
          how: 'Tab to the trigger and press Enter: the sheet opens. Tab moves through its controls and wraps inside it. Space ticks the checkbox. Escape closes the sheet. The play() drives and asserts each step.',
          caveat:
            'Escape always closes a sheet, whatever disablePointerDismissal says; it stops only outside clicks.',
        }),
      },
    },
  },
  render: () => <FilterSheet />,
  play: async ({ canvasElement }) => {
    const sheet = await openWithKeyboard(canvasElement)
    const inside = () => sheet.contains(document.activeElement)
    await waitFor(() => expect(inside()).toBe(true))

    await userEvent.tab()
    const checkbox = within(sheet).getByRole('checkbox', { name: 'Small businesses' })
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')

    // Close, checkbox, Show results — then round again, never out to the page.
    for (let i = 0; i < 4; i++) {
      await userEvent.tab()
      await waitFor(() => expect(inside()).toBe(true))
    }

    await userEvent.keyboard('{Escape}')
    await waitForUnmount('sheet-content')
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
          why: 'When a sheet opens, focus has to move into it at the top and follow the reading order; when it closes, focus has to return to the control that opened it.',
          how: 'Open the sheet from the keyboard: focus lands on the close button, first in the DOM. Tab reaches the checkbox, then Show results. Pressing it closes the sheet and focus returns to the trigger. The play() asserts every step.',
          caveat:
            'With showCloseButton={false} the sheet focuses itself instead, so a long sheet still opens at the top; initialFocus can choose a field when the sheet exists to fill it in.',
        }),
      },
    },
  },
  render: () => <FilterSheet />,
  play: async ({ canvasElement }) => {
    const sheet = await openWithKeyboard(canvasElement)
    await waitFor(() => expect(within(sheet).getByRole('button', { name: 'Close' })).toHaveFocus())
    await userEvent.tab()
    await expect(within(sheet).getByRole('checkbox', { name: 'Small businesses' })).toHaveFocus()
    await userEvent.tab()
    const done = within(sheet).getByRole('button', { name: 'Show results' })
    await expect(done).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitForUnmount('sheet-content')
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
          why: 'A keyboard reader must see which control in the sheet has focus, starting with the icon-only close button it opens on.',
          how: 'Open the sheet and Tab through every control. The play() asserts each focused control paints an outline or a ring.',
          caveat:
            'The indicators are the controls’ own. The sheet scrolls its content but does not clip the rings of controls inside its padding.',
        }),
      },
    },
  },
  render: () => <FilterSheet />,
  play: async ({ canvasElement }) => {
    const sheet = await openWithKeyboard(canvasElement)
    await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true))
    for (let i = 0; i < 3; i++) {
      const focused = document.activeElement as HTMLElement
      const style = getComputedStyle(focused)
      const visible =
        (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1) ||
        style.boxShadow !== 'none'
      await expect(visible, `focus indicator on ${focused.outerHTML.slice(0, 80)}`).toBe(true)
      await userEvent.tab()
    }
    await closeOverlay('sheet-content')
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
          why: 'The title, description and labels in a sheet must clear 4.5:1 against the sheet’s surface.',
          how: 'The sheet is opened and the play() measures the title, the description and the checkbox label against the colour painted behind them.',
          caveat: 'Measured in both themes (see the dark story).',
        }),
      },
    },
  },
  render: () => <FilterSheet />,
  play: async ({ canvasElement }) => {
    await userEvent.click(trigger(canvasElement))
    const sheet = await within(document.body).findByRole('dialog', { name: 'Filter grants' })
    await waitFor(() => expect(sheet).not.toHaveAttribute('data-starting-style'))
    for (const [label, element] of [
      ['title', sheet.querySelector('[data-slot="sheet-title"]')!],
      ['description', sheet.querySelector('[data-slot="sheet-description"]')!],
      ['label', within(sheet).getByText('Small businesses')],
    ] as const) {
      expectContrast(getComputedStyle(element).color, surfaceBehind(element), { label })
    }
    await closeOverlay('sheet-content')
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

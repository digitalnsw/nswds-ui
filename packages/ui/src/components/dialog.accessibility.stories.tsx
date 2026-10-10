/**
 * Dialog — Accessibility
 *
 * One story per WCAG 2.2 criterion a modal dialog has to meet, each asserting
 * it in play(). The focus trap, scroll lock, focus return and Escape come from
 * the Base UI dialog; these pin the parts a consumer relies on — that the
 * dialog is announced as a named modal, can be driven and left from the
 * keyboard, takes focus in and gives it back, shows where focus is, and is
 * readable in every look and theme.
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
  type DialogVariant,
} from './dialog.js'
import { Input } from './input.js'
import { Label } from './label.js'
import {
  closeOverlay,
  compositeOver,
  expectContrast,
  resolveColor,
  waitForUnmount,
  wcagStoryMeta,
} from './story-helpers.js'

const meta = {
  title: 'Components/Dialog/Accessibility',
  component: Dialog,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

function ContactDialog({ variant = 'default' }: { variant?: DialogVariant }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant='outline' />}>Edit contact details</DialogTrigger>
      <DialogContent variant={variant}>
        <DialogHeader>
          <DialogTitle>Edit contact details</DialogTitle>
          <DialogDescription>
            We use these details to contact you about your application.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-2'>
          <Label htmlFor={`a11y-phone-${variant}`}>Phone number</Label>
          <Input id={`a11y-phone-${variant}`} type='tel' defaultValue='0400 000 000' />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const trigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Edit contact details' })

async function openWithKeyboard(canvasElement: HTMLElement) {
  await userEvent.tab()
  await expect(trigger(canvasElement)).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  return within(document.body).findByRole('dialog', { name: 'Edit contact details' })
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
          why: 'A screen reader must announce that a dialog opened, that it is modal, what it is called and what it is for — otherwise the reader does not know the page behind is out of reach.',
          how: 'Open the dialog. The play() asserts the trigger says it opens a dialog and reports whether it is expanded, that the popup has role dialog with a name from DialogTitle and a description from DialogDescription, and that the page behind is hidden from assistive tech while it is open.',
          caveat:
            'Base UI conveys modality by marking everything outside the dialog aria-hidden rather than by setting aria-modal. The name and description come only from DialogTitle and DialogDescription — a dialog without a title has no name, so always give it one, visually hidden if need be.',
        }),
      },
    },
  },
  render: () => <ContactDialog />,
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Edit contact details',
    })
    await expect(dialog).toHaveAccessibleDescription(
      'We use these details to contact you about your application.',
    )
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    // Modal: the page behind is out of the accessibility tree while it is open.
    await waitFor(() => expect(button.closest('[aria-hidden="true"]')).not.toBeNull())
    // The icon-only corner button is named by closeLabel.
    await expect(within(dialog).getByRole('button', { name: 'Close' })).toBeInTheDocument()
    await closeOverlay('dialog-content')
    await expect(button.closest('[aria-hidden="true"]')).toBeNull()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
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
          why: 'Everything a mouse reader does with a dialog — open it, use what is inside, dismiss it — must work from the keyboard alone.',
          how: 'Tab to the trigger and press Enter: the dialog opens. Tab moves through its controls and wraps inside it rather than escaping to the page. Escape closes it. The play() drives and asserts each step.',
          caveat:
            'disablePointerDismissal stops only outside clicks; Escape always closes the dialog, so never rely on a dialog staying open to keep the reader on a task.',
        }),
      },
    },
  },
  render: () => <ContactDialog />,
  play: async ({ canvasElement }) => {
    const dialog = await openWithKeyboard(canvasElement)
    const inside = () => dialog.contains(document.activeElement)
    await waitFor(() => expect(inside()).toBe(true))

    // Close, phone field, Cancel, Save — then back round, never out to the page.
    for (let i = 0; i < 5; i++) {
      await userEvent.tab()
      await waitFor(() => expect(inside()).toBe(true))
    }
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(inside()).toBe(true))

    await userEvent.keyboard('{Escape}')
    await waitForUnmount('dialog-content')
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
          why: 'When a dialog opens, focus has to move into it, start at the top, and follow the reading order; when it closes, focus has to come back to where the reader was.',
          how: 'Open the dialog from the keyboard. Focus lands on the close button, which is first in the DOM, so the reader starts at the title. Tab reaches the field, then Cancel, then Save. Choosing Cancel returns focus to the trigger. The play() asserts every step.',
          caveat:
            'The close button comes first in the DOM even though it is drawn in the corner — that is what makes a long dialog open at the top. With showCloseButton={false}, Base UI focuses the first control instead.',
        }),
      },
    },
  },
  render: () => <ContactDialog />,
  play: async ({ canvasElement }) => {
    const dialog = await openWithKeyboard(canvasElement)
    const close = within(dialog).getByRole('button', { name: 'Close' })
    await waitFor(() => expect(close).toHaveFocus())

    await userEvent.tab()
    await expect(within(dialog).getByLabelText('Phone number')).toHaveFocus()
    await userEvent.tab()
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus()
    await userEvent.tab()
    await expect(within(dialog).getByRole('button', { name: 'Save' })).toHaveFocus()

    await userEvent.tab({ shift: true })
    await userEvent.keyboard('{Enter}')
    await waitForUnmount('dialog-content')
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
          why: 'A keyboard reader inside a dialog must always see which control has focus, including the icon-only close button in the corner.',
          how: 'Open the dialog and Tab through every control. The play() asserts each focused control paints an outline or a ring.',
          caveat:
            'The indicators are Button’s and Input’s own; the dialog adds none and clips none — the popup does not hide overflow along the edges the rings sit on.',
        }),
      },
    },
  },
  render: () => <ContactDialog />,
  play: async ({ canvasElement }) => {
    const dialog = await openWithKeyboard(canvasElement)
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    for (let i = 0; i < 4; i++) {
      const focused = document.activeElement as HTMLElement
      const style = getComputedStyle(focused)
      const visible =
        (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1) ||
        style.boxShadow !== 'none'
      await expect(visible, `focus indicator on ${focused.outerHTML.slice(0, 80)}`).toBe(true)
      await userEvent.tab()
    }
    await closeOverlay('dialog-content')
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const looks: DialogVariant[] = ['default', 'band', 'rule']

const contrastStory: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The title, description and body text of a dialog must clear 4.5:1 against the surface they sit on — including the solid band header, where the text is inverse.',
          how: 'Each look is opened in turn and the play() measures the title, the description and the field label against the colour actually painted behind them.',
          caveat:
            'Measured in both themes (see the dark story). Button and Input contrast are covered by their own stories.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex gap-4'>
      {looks.map((look) => (
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const look of looks) {
      await userEvent.click(within(canvasElement).getByRole('button', { name: `Open ${look}` }))
      const dialog = await within(document.body).findByRole('dialog', {
        name: 'Edit contact details',
      })
      await waitFor(() => expect(dialog).not.toHaveAttribute('data-starting-style'))
      for (const [label, element] of [
        ['title', dialog.querySelector('[data-slot="dialog-title"]')!],
        ['description', dialog.querySelector('[data-slot="dialog-description"]')!],
        ['body text', within(dialog).getByText(/Your changes are saved/)],
      ] as const) {
        expectContrast(getComputedStyle(element).color, surfaceBehind(element), {
          label: `${look} ${label}`,
        })
      }
      await closeOverlay('dialog-content')
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

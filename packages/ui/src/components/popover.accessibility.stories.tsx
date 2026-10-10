/**
 * Popover — Accessibility
 *
 * One story per WCAG 2.2 criterion a popover has to meet, each asserting it
 * in play(). Positioning, focus management and dismissal come from the Base
 * UI popover; these pin the parts a consumer relies on — that the trigger
 * says what it opens and the panel is a named dialog, that it can be opened,
 * used and closed from the keyboard, that focus moves in and comes back, that
 * focus stays visible inside it, and that its text is readable.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import { Input } from './input.js'
import { Label } from './label.js'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover.js'
import {
  closeOverlay,
  compositeOver,
  expectContrast,
  resolveColor,
  waitForUnmount,
  wcagStoryMeta,
} from './story-helpers.js'

const meta = {
  title: 'Components/Popover/Accessibility',
  component: Popover,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

function ReminderPopover({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={<Button variant='outline' />}>Email me a reminder</PopoverTrigger>
      <PopoverContent align='start'>
        <PopoverHeader>
          <PopoverTitle>Email me a reminder</PopoverTitle>
          <PopoverDescription>
            We will email you a week before applications close.
          </PopoverDescription>
        </PopoverHeader>
        <div className='grid gap-2'>
          <Label htmlFor='a11y-reminder-email'>Email address</Label>
          <Input id='a11y-reminder-email' type='email' />
        </div>
        <Button>Send reminder</Button>
      </PopoverContent>
    </Popover>
  )
}

const trigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Email me a reminder' })

async function openWithKeyboard(canvasElement: HTMLElement) {
  await userEvent.tab()
  await expect(trigger(canvasElement)).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  return within(document.body).findByRole('dialog', { name: 'Email me a reminder' })
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
          why: 'A screen reader must hear that the trigger opens something and whether it is open, and the panel must be announced with a name so the reader knows where they landed.',
          how: 'Open the popover. The play() asserts the trigger’s aria-haspopup and aria-expanded before and after, and that the panel has role dialog named by PopoverTitle and described by PopoverDescription.',
          caveat:
            'Without a PopoverTitle the panel has no name; give it one, visually hidden if the design has no heading. A popover is not modal by default, so the page behind stays in the accessibility tree.',
        }),
      },
    },
  },
  render: () => <ReminderPopover />,
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(button)
    const popover = await within(document.body).findByRole('dialog', {
      name: 'Email me a reminder',
    })
    await expect(popover).toHaveAccessibleDescription(
      'We will email you a week before applications close.',
    )
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await closeOverlay('popover-content')
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
          why: 'A popover opens on a click, so it must open on Enter too, and everything inside it must be usable without a mouse.',
          how: 'Tab to the trigger and press Enter: the popover opens. Tab to the email field and type into it. Escape closes the popover. The play() drives and asserts each step.',
          caveat: 'Space opens it as well — the trigger is a real button.',
        }),
      },
    },
  },
  render: () => <ReminderPopover />,
  play: async ({ canvasElement }) => {
    const popover = await openWithKeyboard(canvasElement)
    const field = await tabTo(within(popover).getByLabelText('Email address'))
    await userEvent.keyboard('alex.citizen@example.com')
    await expect(field).toHaveValue('alex.citizen@example.com')
    await userEvent.keyboard('{Escape}')
    await waitForUnmount('popover-content')
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
          why: 'The panel is portaled to the end of the page, so without focus management a keyboard reader would have to Tab past the whole page to reach it. Focus must move into it on open and back to the trigger on close.',
          how: 'Open the popover from the keyboard: focus moves into the panel, onto the email field, its first control. Tab reaches Send reminder next, in reading order. Escape returns focus to the trigger. The play() asserts every step.',
          caveat:
            'Base UI focuses the panel’s first tabbable control by default; initialFocus on PopoverContent can choose another.',
        }),
      },
    },
  },
  render: () => <ReminderPopover />,
  play: async ({ canvasElement }) => {
    const popover = await openWithKeyboard(canvasElement)
    const field = within(popover).getByLabelText('Email address')
    const send = within(popover).getByRole('button', { name: 'Send reminder' })
    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.tab()
    await expect(send).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitForUnmount('popover-content')
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
          why: 'Inside a small floating panel, a keyboard reader must still see which control has focus.',
          how: 'Open the popover and Tab to the field and the button. The play() asserts each paints an outline or a ring while focused.',
          caveat: 'The indicators are Input’s and Button’s own; the popover clips neither.',
        }),
      },
    },
  },
  render: () => <ReminderPopover />,
  play: async ({ canvasElement }) => {
    const popover = await openWithKeyboard(canvasElement)
    for (const control of [
      within(popover).getByLabelText('Email address'),
      within(popover).getByRole('button', { name: 'Send reminder' }),
    ]) {
      await tabTo(control)
      const style = getComputedStyle(control)
      const visible =
        (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1) ||
        style.boxShadow !== 'none'
      await expect(visible, `focus indicator on ${control.outerHTML.slice(0, 80)}`).toBe(true)
    }
    await closeOverlay('popover-content')
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
          why: 'The popover’s title, description and labels must clear 4.5:1 against its surface.',
          how: 'The popover is opened and the play() measures the title, the description and the field label against the colour painted behind them.',
          caveat: 'Measured in both themes (see the dark story).',
        }),
      },
    },
  },
  render: () => <ReminderPopover defaultOpen />,
  play: async () => {
    const popover = await within(document.body).findByRole('dialog', {
      name: 'Email me a reminder',
    })
    for (const [label, element] of [
      ['title', popover.querySelector('[data-slot="popover-title"]')!],
      ['description', popover.querySelector('[data-slot="popover-description"]')!],
      ['label', within(popover).getByText('Email address')],
    ] as const) {
      expectContrast(getComputedStyle(element).color, surfaceBehind(element), { label })
    }
    await closeOverlay('popover-content')
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

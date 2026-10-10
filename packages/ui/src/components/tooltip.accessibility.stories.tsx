/**
 * Tooltip — Accessibility
 *
 * One story per WCAG 2.2 criterion a tooltip has to meet, each asserting it in
 * play(). Behaviour comes from the Base UI tooltip; these pin the parts a
 * consumer relies on — that the label appears for keyboard users, can be
 * dismissed without moving focus, never names the control by itself, and is
 * readable.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { IconPrint } from '../icons/index.js'
import { Button } from './button.js'
import { closeOverlay, expectContrast, wcagStoryMeta } from './story-helpers.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js'

const meta = {
  title: 'Components/Tooltip/Accessibility',
  component: Tooltip,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

function PrintTooltip({ onClick, defaultOpen }: { onClick?: () => void; defaultOpen?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger
          render={
            <Button
              variant='outline'
              iconOnly
              aria-label='Print this page'
              leadingVisual={IconPrint}
              onClick={onClick}
            />
          }
        />
        <TooltipContent>Print this page</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const tooltip = () => document.querySelector<HTMLElement>('[data-slot="tooltip-content"]')

// ─── 1.4.13 — Content on Hover or Focus ───────────────────────────────────────

export const ContentOnHoverOrFocus: Story = {
  name: 'Content on Hover or Focus — 1.4.13',
  parameters: {
    wcag: ['1.4.13'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.13',
          why: 'Content that appears on focus or hover must be dismissible without moving the pointer or focus, and must stay visible until it is dismissed or no longer relevant, so readers who magnify the screen or move slowly can still read it.',
          how: 'Tab to the button: the tooltip appears. Wait — it stays. Press Escape: it closes and focus stays on the button. The play() asserts all three.',
          caveat:
            'Hoverability (moving the pointer onto the label without it closing) is Base UI behaviour, on by default; disableHoverablePopup turns it off and should stay off for that reason.',
        }),
      },
    },
  },
  render: () => <PrintTooltip />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Print this page' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await waitFor(() => expect(tooltip()).toBeVisible())

    // Persistent: still there after a pause with no input.
    await new Promise((resolve) => setTimeout(resolve, 600))
    await expect(tooltip()).toBeVisible()

    // Dismissible without moving focus.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(tooltip()).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const printed = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Everything a tooltip offers a mouse reader must reach a keyboard reader too: the label appears on focus, and the control it describes still works from the keyboard.',
          how: 'Tab to the button: the tooltip appears without hovering. Press Enter: the button acts. The play() asserts both.',
          caveat:
            'A tooltip is never focusable itself and must hold nothing interactive — anything a reader needs to act on belongs in a Popover.',
        }),
      },
    },
  },
  render: () => <PrintTooltip onClick={printed} />,
  play: async ({ canvasElement }) => {
    printed.mockClear()
    const trigger = within(canvasElement).getByRole('button', { name: 'Print this page' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await waitFor(() => expect(tooltip()).toBeVisible())
    await userEvent.keyboard('{Enter}')
    await expect(printed).toHaveBeenCalledTimes(1)
    await closeOverlay('tooltip-content')
  },
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
          why: 'A tooltip is shown only on hover and focus, so it cannot be the only thing naming a control: a screen reader user may never trigger it, and the label is gone when it closes.',
          how: 'Inspect the button with the tooltip closed: its accessible name comes from aria-label. The play() asserts the name is there before the tooltip ever opens, and that the tooltip repeats it rather than replacing it.',
          caveat:
            'Give every icon-only trigger an aria-label even with a tooltip; the tooltip is the visual echo of that name.',
        }),
      },
    },
  },
  render: () => <PrintTooltip />,
  play: async ({ canvasElement }) => {
    // Named with the tooltip closed — the name does not depend on it.
    await expect(tooltip()).not.toBeInTheDocument()
    const trigger = within(canvasElement).getByRole('button', { name: 'Print this page' })
    await expect(trigger).toHaveAccessibleName('Print this page')

    trigger.focus()
    await waitFor(() => expect(tooltip()).toBeVisible())
    await expect(tooltip()).toHaveTextContent('Print this page')
    await expect(trigger).toHaveAccessibleName('Print this page')
    await closeOverlay('tooltip-content')
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
          why: 'Tooltip text is small and brief, so it must clear 4.5:1 against its own surface to be read at a glance.',
          how: 'The tooltip is opened and the play() measures its text colour against its background with the same contrast maths axe uses.',
          caveat:
            'The surface is the foreground token and the text the background token, so the pair inverts with the theme and holds in both modes.',
        }),
      },
    },
  },
  render: () => <PrintTooltip defaultOpen />,
  play: async () => {
    await waitFor(() => expect(tooltip()).toBeVisible())
    const style = getComputedStyle(tooltip()!)
    expectContrast(style.color, style.backgroundColor, { label: 'Tooltip text' })
    await closeOverlay('tooltip-content')
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

/**
 * Collapsible — Accessibility
 *
 * One story per WCAG 2.2 criterion a disclosure has to meet, each asserting it
 * in play(). Base UI supplies the behaviour: the trigger is a native button
 * that reports its state with aria-expanded and points at the panel. These pin
 * what a keyboard and screen reader user relies on.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { IconExpandMore } from '../icons/expand-more.js'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js'
import { Link } from './link.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Collapsible/Accessibility',
  component: Collapsible,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

function FeeExemptions() {
  return (
    <div className='max-w-md space-y-3'>
      <Collapsible>
        <CollapsibleTrigger className='group flex w-full items-center justify-between gap-4 rounded-sm px-3 py-2 text-start font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'>
          Who is exempt from the fee
          <IconExpandMore
            aria-hidden='true'
            className='size-6 shrink-0 group-data-[panel-open]:rotate-180'
          />
        </CollapsibleTrigger>
        <CollapsibleContent className='px-3 pt-2 pb-3'>
          You do not need to pay if you hold a{' '}
          <Link href='#concession'>Pensioner Concession Card</Link>.
        </CollapsibleContent>
      </Collapsible>
      <Link href='#apply'>Start your application</Link>
    </div>
  )
}

const trigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Who is exempt from the fee' })

const panel = () => document.querySelector<HTMLElement>('[data-slot="collapsible-content"]')

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user hears the trigger as a button and needs to know whether what it controls is showing. That state lives in aria-expanded, which has to change as the panel opens and closes.',
          how: 'The play() finds the trigger as a button by its visible text, asserts aria-expanded="false" while closed, clicks it, and asserts aria-expanded="true" with aria-controls pointing at the panel now in the page.',
          caveat:
            'The trigger is named by its text; keep the chevron aria-hidden so it does not add to the name.',
        }),
      },
    },
  },
  render: () => <FeeExemptions />,
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(panel()).not.toBeInTheDocument()

    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(panel()).toBeVisible())
    await expect(button).toHaveAttribute('aria-controls', panel()!.id)
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
          why: 'Opening and closing the panel must work without a pointer. A native button answers both Enter and Space.',
          how: 'Tab to the trigger. Enter opens the panel; Space closes it again. The play() asserts each step.',
          caveat:
            'Base UI renders the trigger as a <button>, so keyboard support comes from the element; render it as something else and you take that on yourself.',
        }),
      },
    },
  },
  render: () => <FeeExemptions />,
  play: async ({ canvasElement }) => {
    const button = trigger(canvasElement)
    await userEvent.tab()
    await expect(button).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(panel()).toBeVisible())

    await userEvent.keyboard(' ')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(panel()).not.toBeInTheDocument())
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
          why: 'What a disclosure reveals must come next in the tab order, right after the control that revealed it — not at the end of the page — and must leave the tab order again when it is hidden.',
          how: 'With the panel closed, Tab from the trigger goes straight to the link after it. Open the panel and Tab from the trigger reaches the link inside the panel first. The play() asserts both orders.',
          caveat:
            'The panel unmounts while closed, so links inside it are out of the tab order then. Pass keepMounted to CollapsibleContent and Base UI hides it with the hidden attribute instead, which has the same effect.',
        }),
      },
    },
  },
  render: () => <FeeExemptions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = trigger(canvasElement)

    // Closed: trigger, then the link after the disclosure.
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Start your application' })).toHaveFocus()

    // Open: trigger, then the link inside the panel.
    await userEvent.click(button)
    await waitFor(() => expect(panel()).toBeVisible())
    button.focus()
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Pensioner Concession Card' })).toHaveFocus()
  },
}

/**
 * HoverCard — Accessibility
 *
 * One story per WCAG 2.2 criterion a hover card has to meet, each asserting it
 * in play(). Timing, positioning and dismissal come from the Base UI preview
 * card; these pin the parts a consumer relies on — that the card appears for
 * keyboard readers too and can be dismissed and hovered, that the link it
 * decorates still works and keeps its own name, that focus on the link is
 * visible, and that the card is readable.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js'
import { Link } from './link.js'
import {
  closeOverlay,
  compositeOver,
  expectContrast,
  resolveColor,
  waitForUnmount,
  wcagStoryMeta,
} from './story-helpers.js'

const meta = {
  title: 'Components/HoverCard/Accessibility',
  component: HoverCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

function AgencyLink({ onClick, defaultOpen }: { onClick?: () => void; defaultOpen?: boolean }) {
  return (
    <p>
      Renew online or visit{' '}
      <HoverCard defaultOpen={defaultOpen}>
        <HoverCardTrigger
          render={
            <Link
              href='#service-nsw'
              onClick={(event) => {
                event.preventDefault()
                onClick?.()
              }}
            />
          }
        >
          Service NSW
        </HoverCardTrigger>
        <HoverCardContent>
          <p className='text-base font-semibold'>Service NSW</p>
          <p className='text-base text-muted-foreground'>
            Apply for licences, permits and rebates online, by phone on 13 77 88, or at a service
            centre.
          </p>
        </HoverCardContent>
      </HoverCard>{' '}
      with your current licence.
    </p>
  )
}

const link = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('link', { name: 'Service NSW' })

const card = () => document.querySelector<HTMLElement>('[data-slot="hover-card-content"]')

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

// ─── 1.4.13 — Content on Hover or Focus ───────────────────────────────────────

export const ContentOnHoverOrFocus: Story = {
  name: 'Content on Hover or Focus — 1.4.13',
  parameters: {
    wcag: ['1.4.13'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.13',
          why: 'A card that appears on hover or focus must be dismissible without moving the pointer or focus, hoverable so the reader can move onto it to read it, and must stay until it is dismissed or no longer relevant.',
          how: 'Tab to the link: the card appears and stays. Escape closes it with focus still on the link. Hover the link to open it again, then move the pointer onto the card: it stays open. The play() asserts each step.',
          caveat:
            'The 300ms close delay is what lets the pointer cross from the link to the card; keep a non-zero closeDelay on the trigger.',
        }),
      },
    },
  },
  render: () => <AgencyLink />,
  play: async ({ canvasElement }) => {
    const trigger = link(canvasElement)
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await waitFor(() => expect(card()).toBeVisible(), { timeout: 3000 })

    // Persistent: still there after a pause with no input.
    await new Promise((resolve) => setTimeout(resolve, 800))
    await expect(card()).toBeVisible()

    // Dismissible without moving focus.
    await userEvent.keyboard('{Escape}')
    await waitForUnmount('hover-card-content')
    await expect(trigger).toHaveFocus()

    // Hoverable: the pointer can move onto the card without it closing.
    trigger.blur()
    await userEvent.hover(trigger)
    await waitFor(() => expect(card()).toBeVisible(), { timeout: 3000 })
    await userEvent.unhover(trigger)
    await userEvent.hover(card()!)
    await new Promise((resolve) => setTimeout(resolve, 600))
    await expect(card()).toBeVisible()
    await userEvent.unhover(card()!)
    await waitForUnmount('hover-card-content')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const followed = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'A keyboard reader must get the same preview a mouse reader does, and the link must still work from the keyboard while the card is open.',
          how: 'Tab to the link: the card opens on focus, without hovering. Press Enter: the link is followed. The play() asserts both.',
          caveat:
            'A touch reader never sees a hover card at all, so nothing in it can be the only way to learn or do something.',
        }),
      },
    },
  },
  render: () => <AgencyLink onClick={followed} />,
  play: async ({ canvasElement }) => {
    followed.mockClear()
    const trigger = link(canvasElement)
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await waitFor(() => expect(card()).toBeVisible(), { timeout: 3000 })
    await userEvent.keyboard('{Enter}')
    await expect(followed).toHaveBeenCalledTimes(1)
    await closeOverlay('hover-card-content')
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
          why: 'The trigger is a link and must stay one: its role, name and destination are what a screen reader announces, and the card only adds to them.',
          how: 'The play() asserts the trigger is a link named by its own text with its href, before the card opens and while it is open, and that the card takes no focus when it appears.',
          caveat:
            'The card is supplementary and is not announced on focus. Do not put the only copy of anything a reader needs in it.',
        }),
      },
    },
  },
  render: () => <AgencyLink />,
  play: async ({ canvasElement }) => {
    const trigger = link(canvasElement)
    await expect(trigger).toHaveAttribute('href', '#service-nsw')
    await expect(trigger).toHaveAccessibleName('Service NSW')

    await userEvent.tab()
    await waitFor(() => expect(card()).toBeVisible(), { timeout: 3000 })
    await expect(trigger).toHaveFocus()
    await expect(within(card()!).queryAllByRole('link')).toHaveLength(0)
    await expect(within(card()!).queryAllByRole('button')).toHaveLength(0)
    await expect(link(canvasElement)).toHaveAccessibleName('Service NSW')
    await closeOverlay('hover-card-content')
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
          why: 'Focusing the link is what opens the card for a keyboard reader, so the link must show it has focus.',
          how: 'Tab to the link. The play() asserts it paints a 2px focus outline.',
          caveat: 'The outline is Link’s own focus-visible style; HoverCardTrigger adds nothing.',
        }),
      },
    },
  },
  render: () => <AgencyLink />,
  play: async ({ canvasElement }) => {
    const trigger = link(canvasElement)
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    const style = getComputedStyle(trigger)
    await expect(style.outlineStyle).not.toBe('none')
    await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
    await waitFor(() => expect(card()).toBeVisible(), { timeout: 3000 })
    await closeOverlay('hover-card-content')
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
          why: 'Text in the card must clear 4.5:1 against the card’s surface, muted lines included.',
          how: 'The card is opened and the play() measures every line of text in it against the colour painted behind it.',
          caveat: 'Measured in both themes (see the dark story).',
        }),
      },
    },
  },
  render: () => <AgencyLink defaultOpen />,
  play: async () => {
    await waitFor(() => expect(card()).toBeVisible())
    for (const line of card()!.querySelectorAll('p')) {
      expectContrast(getComputedStyle(line).color, surfaceBehind(line), {
        label: line.textContent ?? 'card text',
      })
    }
    await closeOverlay('hover-card-content')
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

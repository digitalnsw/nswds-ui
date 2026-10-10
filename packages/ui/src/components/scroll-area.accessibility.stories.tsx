/**
 * ScrollArea — Accessibility
 *
 * One story per WCAG 2.2 criterion a scrolling region has to meet, each
 * asserting it in play(). Scrolling itself is the browser's; Base UI makes the
 * viewport a Tab stop while it overflows, and the component draws a focus ring
 * on it. These pin the parts a keyboard or screen reader user relies on.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from './button.js'
import { ScrollArea } from './scroll-area.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/ScrollArea/Accessibility',
  component: ScrollArea,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

const centres = [
  'Albury',
  'Armidale',
  'Bathurst',
  'Blacktown',
  'Bondi Junction',
  'Broken Hill',
  'Campbelltown',
  'Coffs Harbour',
  'Dubbo',
  'Gosford',
  'Goulburn',
  'Griffith',
]

const frame = 'h-40 w-56 rounded-md border border-border bg-background'

function CentreList({ items = centres }: { items?: string[] }) {
  return (
    <ul className='p-4' aria-label='Service centres'>
      {items.map((centre) => (
        <li key={centre} className='py-1'>
          {centre}
        </li>
      ))}
    </ul>
  )
}

const viewports = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll<HTMLElement>('[data-slot="scroll-area-viewport"]')

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Content hidden below the fold of a scroll box must be reachable without a mouse. A keyboard user can only scroll a region that can take focus.',
          how: 'Two areas: one overflows, one fits. Tab from before them: focus lands on the overflowing viewport, and the next Tab skips the area that has nothing to scroll and reaches the button after it. The play() asserts both.',
          caveat:
            'Once focused, the arrow keys, Page Up / Page Down and Space scroll the viewport natively; synthetic key events cannot drive native scrolling, so that half is not asserted here.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap items-start gap-6'>
      <Button variant='outline'>Before</Button>
      <ScrollArea className={frame}>
        <CentreList />
      </ScrollArea>
      <ScrollArea className={frame}>
        <CentreList items={['Albury', 'Armidale']} />
      </ScrollArea>
      <Button variant='outline'>After</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [overflowing, fitting] = viewports(canvasElement)
    await waitFor(() => expect(overflowing).toHaveAttribute('tabindex', '0'))
    await waitFor(() => expect(fitting).toHaveAttribute('tabindex', '-1'))

    canvas.getByRole('button', { name: 'Before' }).focus()
    await userEvent.tab()
    await expect(overflowing).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'After' })).toHaveFocus()
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
          why: 'A focused scroll box looks exactly like an unfocused one unless something marks it, and the reader then cannot tell why the arrow keys stopped moving the page.',
          how: 'Tab to the viewport. The play() asserts it has focus and draws a ring — a box-shadow — that it does not draw at rest.',
          caveat:
            'The ring is drawn on the viewport, inside the border, so a parent with overflow: hidden does not clip it.',
        }),
      },
    },
  },
  render: () => (
    <ScrollArea className={frame}>
      <CentreList />
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const [viewport] = viewports(canvasElement)
    await waitFor(() => expect(viewport).toHaveAttribute('tabindex', '0'))
    await expect(getComputedStyle(viewport!).boxShadow).toBe('none')
    await userEvent.tab()
    await expect(viewport).toHaveFocus()
    await waitFor(() => expect(getComputedStyle(viewport!).boxShadow).not.toBe('none'))
  },
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'Restyling the scrollbar must not cost the content its structure: a list inside a scroll area is still a list, with every item in the accessibility tree whether or not it is scrolled into view.',
          how: 'The play() finds the list by its name inside the area and asserts all twelve items are exposed, including the ones clipped below the fold.',
          caveat:
            'The viewport itself is role="presentation" — it is a scrolling surface, not a landmark. Name the content inside it, as the list here is named, when a reader needs to know what the box holds.',
        }),
      },
    },
  },
  render: () => (
    <ScrollArea className={frame}>
      <CentreList />
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Service centres' })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(centres.length)
  },
}

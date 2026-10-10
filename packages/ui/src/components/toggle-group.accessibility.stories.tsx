/**
 * ToggleGroup — Accessibility
 *
 * One story per WCAG 2.2 criterion a toggle group has to meet, each asserting
 * it in play(). Roving focus, arrow-key navigation and the group semantics come
 * from the Base UI ToggleGroup; these pin what a consumer relies on.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { IconFormatAlignCenter } from '../icons/format-align-center.js'
import { IconFormatAlignLeft } from '../icons/format-align-left.js'
import { IconFormatAlignRight } from '../icons/format-align-right.js'
import { wcagStoryMeta } from './story-helpers.js'
import { ToggleGroup, ToggleGroupItem } from './toggle-group.js'

const meta = {
  title: 'Components/ToggleGroup/Accessibility',
  component: ToggleGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

function Alignment(props: ComponentProps<typeof ToggleGroup>) {
  return (
    <ToggleGroup aria-label='Text alignment' defaultValue={['left']} {...props}>
      <ToggleGroupItem value='left' aria-label='Align left'>
        <IconFormatAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value='center' aria-label='Align centre'>
        <IconFormatAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value='right' aria-label='Align right'>
        <IconFormatAlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  )
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
          why: 'A screen reader user needs to hear that the buttons belong together, what the set is for, which one is on, and that pressing another moves the selection.',
          how: 'Inspect the group: it is a named group of buttons, each with aria-pressed. Press Align centre: it turns on and Align left turns off. The play() asserts the group, its name and each state change.',
          caveat:
            'The group takes its name from aria-label (or aria-labelledby) — set one. Base UI owns aria-pressed on the items.',
        }),
      },
    },
  },
  render: () => <Alignment />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('group', { name: 'Text alignment' })).toBeInTheDocument()
    const left = canvas.getByRole('button', { name: 'Align left' })
    const centre = canvas.getByRole('button', { name: 'Align centre' })
    await expect(left).toHaveAttribute('aria-pressed', 'true')
    await expect(centre).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(centre)
    await expect(centre).toHaveAttribute('aria-pressed', 'true')
    await expect(left).toHaveAttribute('aria-pressed', 'false')
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
          why: 'The whole group has to work without a pointer: reaching it, moving between its items and pressing one.',
          how: 'Tab into the group: focus lands on an item. Press the Right arrow to move to the next item, then Space to press it. Tab again: focus leaves the group, which is one stop in the tab order. The play() asserts each step.',
          caveat:
            'Arrow keys move focus without pressing — the reader chooses with Space or Enter. Base UI owns the roving focus.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex items-center gap-4'>
      <Alignment />
      <button type='button' className='rounded-sm px-2 underline'>
        After the group
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const left = canvas.getByRole('button', { name: 'Align left' })
    const centre = canvas.getByRole('button', { name: 'Align centre' })
    await userEvent.tab()
    await expect(left).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(centre).toHaveFocus()
    await expect(centre).toHaveAttribute('aria-pressed', 'false')
    await userEvent.keyboard(' ')
    await expect(centre).toHaveAttribute('aria-pressed', 'true')
    await expect(left).toHaveAttribute('aria-pressed', 'false')
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'After the group' })).toHaveFocus()
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
          why: 'Arrow keys move focus inside the group without pressing anything, so the focus ring is the only sign of where the reader is.',
          how: 'Tab into the group and arrow along it: each item shows a 3px ring as it takes focus. The play() asserts the ring is painted on each focused item, joined (spacing 0) and spaced alike.',
          caveat:
            'A focused item is lifted above its neighbours (z-index), so in a joined group the shared borders do not cover its ring.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-col items-start gap-6'>
      <Alignment variant='outline' />
      <Alignment variant='outline' spacing={0} aria-label='Text alignment (joined)' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = within(canvasElement).getAllByRole('button')
    for (const [index, item] of items.entries()) {
      await expect(getComputedStyle(item).boxShadow).toBe('none')
      // The first item of each group is reached with Tab, the rest with the arrow.
      await userEvent.keyboard(index % 3 === 0 ? '{Tab}' : '{ArrowRight}')
      await expect(item).toHaveFocus()
      await expect(getComputedStyle(item).boxShadow).not.toBe('none')
    }
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSizeMinimum: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Items in a group sit right next to each other — joined, with no gap at all — so each has to be big enough to hit on its own.',
          how: 'The play() measures every item at every size, joined, and asserts each is at least 24 by 24 CSS pixels.',
          caveat: 'sm sits exactly on the 24px minimum; prefer default where there is room.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-col items-start gap-6'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Alignment
          key={size}
          size={size}
          variant='outline'
          spacing={0}
          aria-label={`Text alignment (${size})`}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const item of within(canvasElement).getAllByRole('button')) {
      const { width, height } = item.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(24)
      await expect(height).toBeGreaterThanOrEqual(24)
    }
  },
}

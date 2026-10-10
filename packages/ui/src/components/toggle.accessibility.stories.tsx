/**
 * Toggle — Accessibility
 *
 * One story per WCAG 2.2 criterion a toggle has to meet, each asserting it in
 * play(). The pressed state, keyboard handling and focus come from the Base UI
 * Toggle; these pin the parts a consumer relies on — that the state is
 * announced, the control works from the keyboard, focus shows, and every size
 * is big enough to hit.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { IconFormatBold } from '../icons/format-bold.js'
import { wcagStoryMeta } from './story-helpers.js'
import { Toggle } from './toggle.js'

const meta = {
  title: 'Components/Toggle/Accessibility',
  component: Toggle,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

const boldToggle = () => (
  <Toggle aria-label='Bold'>
    <IconFormatBold />
  </Toggle>
)

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A toggle looks like a button but holds a state. A screen reader user has to hear what it is, what it does and whether it is on — and hear the change when they press it.',
          how: 'Inspect the toggle: it is a button named by its aria-label, with aria-pressed="false". Press it: aria-pressed becomes "true". The play() asserts the role, the name and both states.',
          caveat:
            'An icon-only toggle has no name of its own — the aria-label is required. Base UI owns aria-pressed; never set it yourself.',
        }),
      },
    },
  },
  render: boldToggle,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
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
          why: 'Everything a toggle does with a pointer has to work from the keyboard: reaching it, and turning it on and off.',
          how: 'Tab to the toggle, then press Space and Enter: each press flips it. The play() asserts focus arrives with Tab and that both keys flip aria-pressed.',
          caveat: 'The keys come from the native button Base UI renders; nothing is hand-rolled.',
        }),
      },
    },
  },
  render: boldToggle,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await userEvent.tab()
    await expect(toggle).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
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
          why: 'Keyboard users must be able to see which control has focus — in a toolbar of near-identical icon toggles more than anywhere.',
          how: 'Tab to each toggle: a 3px ring appears round it. The play() tabs to both variants and asserts a ring is painted on keyboard focus and not at rest.',
          caveat:
            'The ring is a box-shadow in the ring token at half strength, drawn on :focus-visible only, so a mouse press does not show it.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex gap-4'>
      <Toggle aria-label='Bold'>
        <IconFormatBold />
      </Toggle>
      <Toggle variant='outline' aria-label='Bold (outline)'>
        <IconFormatBold />
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const toggles = within(canvasElement).getAllByRole('button')
    for (const toggle of toggles) {
      await expect(getComputedStyle(toggle).boxShadow).toBe('none')
      await userEvent.tab()
      await expect(toggle).toHaveFocus()
      await expect(getComputedStyle(toggle).boxShadow).not.toBe('none')
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
          why: 'A target too small to hit reliably shuts out people with tremor or limited dexterity, and toggles often sit tightly packed in toolbars.',
          how: 'The play() measures each size step and asserts it is at least 24 by 24 CSS pixels: sm is 24, default 28, lg 32.',
          caveat:
            'sm sits exactly on the minimum, so give sm toggles the spacing the criterion asks for, or use default.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex items-center gap-4'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Toggle key={size} size={size} variant='outline' aria-label={`Bold (${size})`}>
          <IconFormatBold />
        </Toggle>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const toggle of within(canvasElement).getAllByRole('button')) {
      const { width, height } = toggle.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(24)
      await expect(height).toBeGreaterThanOrEqual(24)
    }
  },
}

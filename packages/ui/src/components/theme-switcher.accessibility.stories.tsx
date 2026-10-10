/**
 * ThemeSwitcher — Accessibility
 *
 * One story per WCAG 2.2 criterion the switcher has to meet, each asserting it
 * in play(). It is an icon-only Button whose name says what pressing it will
 * do; these pin that name and its flip, the keyboard, the focus ring, the
 * icon's contrast and the size of the target.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'
import { ThemeSwitcher } from './theme-switcher.js'

const meta = {
  title: 'Components/ThemeSwitcher/Accessibility',
  component: ThemeSwitcher,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ThemeSwitcher>

export default meta

type Story = StoryObj<typeof meta>

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'An icon-only control has no visible words, so its name is all a screen reader user gets. It has to say what pressing will do, and change when the mode changes.',
          how: 'Inspect the switcher: a button named “Switch to dark theme”, with no aria-pressed. Press it: the name becomes “Switch to light theme”. The play() asserts the role, both names, and that aria-pressed is never set.',
          caveat:
            'No aria-pressed by design: “Switch to dark theme, pressed” would contradict itself. The flipping name carries the state.',
        }),
      },
    },
  },
  render: () => <ThemeSwitcher />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Switch to dark theme' })
    await expect(button).not.toHaveAttribute('aria-pressed')
    await expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    await userEvent.click(button)
    await expect(button).toHaveAccessibleName('Switch to light theme')
    await expect(button).not.toHaveAttribute('aria-pressed')
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
          why: 'Changing the theme has to work without a pointer.',
          how: 'Tab to the switcher and press Enter, then Space: each flips the theme. The play() asserts focus arrives and both keys flip the name and data-mode.',
          caveat: 'It is a native button underneath, so both keys come for free.',
        }),
      },
    },
  },
  render: () => <ThemeSwitcher />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Switch to dark theme' })
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(button).toHaveAttribute('data-mode', 'dark')
    await expect(button).toHaveAccessibleName('Switch to light theme')
    await userEvent.keyboard(' ')
    await expect(button).toHaveAttribute('data-mode', 'light')
    await expect(button).toHaveAccessibleName('Switch to dark theme')
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
          why: 'Keyboard users must see when focus is on the switcher, among the other icon buttons in a header.',
          how: 'Tab to the switcher: Button’s 2px outline appears outside it. The play() asserts there is no outline at rest and a solid 2px one on keyboard focus.',
          caveat: 'The ring is Button’s own; the switcher adds nothing to it.',
        }),
      },
    },
  },
  render: () => <ThemeSwitcher />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button')
    await expect(getComputedStyle(button).outlineStyle).toBe('none')
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await expect(getComputedStyle(button).outlineStyle).toBe('solid')
    await expect(getComputedStyle(button).outlineWidth).toBe('2px')
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

/** A colour flattened onto an opaque backdrop, as an rgb() string. */
function flatten(colour: string, backdrop: string) {
  const { r, g, b } = compositeOver(resolveColor(colour), resolveColor(backdrop))
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

const nonTextContrast: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The sun or moon is the only thing that says what the button does, so it has to reach 3:1 against the button behind it.',
          how: 'The play() measures the icon’s colour against the button’s fill — translucent tint layers, so flattened onto the page first — for the default switcher in both of its modes.',
          caveat:
            'The icon paints with fill-current, so it follows the Button ink of whatever variant and colour you choose.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex gap-4 bg-background p-4' data-testid='surface'>
      <ThemeSwitcher defaultTheme='light' />
      <ThemeSwitcher defaultTheme='dark' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = getComputedStyle(canvas.getByTestId('surface')).backgroundColor
    for (const button of canvas.getAllByRole('button')) {
      const icon = button.querySelector('svg')!
      // Button paints its tint twice in light mode — on the element and on a
      // ::before fill layer — so both are composited onto the page.
      let fill = flatten(getComputedStyle(button).backgroundColor, page)
      const before = getComputedStyle(button, '::before')
      if (before.display !== 'none') fill = flatten(before.backgroundColor, fill)
      expectContrast(getComputedStyle(icon).fill, fill, {
        minimum: 3,
        label: `${button.getAttribute('aria-label')} icon`,
      })
    }
  },
}

export const NonTextContrast: Story = { ...nonTextContrast, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
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
          why: 'A single icon button in a header has to be easy to hit.',
          how: 'The play() measures the default switcher and asserts it is at least 24 by 24 CSS pixels — it is Button’s 40px icon square.',
          caveat: 'With iconOnly at the sm step it is larger still.',
        }),
      },
    },
  },
  render: () => <ThemeSwitcher />,
  play: async ({ canvasElement }) => {
    const { width, height } = within(canvasElement).getByRole('button').getBoundingClientRect()
    await expect(width).toBeGreaterThanOrEqual(24)
    await expect(height).toBeGreaterThanOrEqual(24)
  },
}

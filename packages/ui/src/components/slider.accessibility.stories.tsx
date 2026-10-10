/**
 * Slider — Accessibility
 *
 * One story per WCAG 2.2 criterion a slider has to meet, each asserting it in
 * play(). The value, keyboard stepping and the slider role come from the Base
 * UI slider, which renders a real <input type="range"> inside each thumb; the
 * name comes from the surrounding Field. These pin what a consumer relies on.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldLabel } from './field.js'
import { Slider } from './slider.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Slider/Accessibility',
  component: Slider,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

const aud = { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 } as const

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user has to hear that this is a slider, what it sets, and its current value — in the right unit, and for each thumb of a range.',
          how: 'Inspect each thumb: it is a slider named by the FieldLabel, with its minimum, maximum and value, and a value text formatted as currency. The play() asserts all of them for both thumbs of a range.',
          caveat:
            'The name comes from the Field — a Slider outside a Field with a FieldLabel is unnamed. Pass format so the announced value carries its unit.',
        }),
      },
    },
  },
  render: () => (
    <Field className='max-w-md'>
      <FieldLabel>Weekly rent</FieldLabel>
      <Slider defaultValue={[350, 600]} min={100} max={1000} step={10} format={aud} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const sliders = within(canvasElement).getAllByRole('slider')
    await expect(sliders).toHaveLength(2)
    for (const [slider, value] of [
      [sliders[0]!, 350],
      [sliders[1]!, 600],
    ] as const) {
      // Base UI wires the label one render after mount — poll for it.
      await waitFor(() => expect(slider).toHaveAccessibleName(/Weekly rent/))
      await expect(slider).toHaveAttribute('min', '100')
      await expect(slider).toHaveAttribute('max', '1000')
      await expect(slider).toHaveAttribute('aria-valuenow', String(value))
      await expect(slider.getAttribute('aria-valuetext')).toContain(`$${value}`)
    }
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
          why: 'Dragging is not an option for everyone. Every value a pointer can reach has to be reachable from the keyboard.',
          how: 'Tab to the thumb, then: Right arrow adds one step, Page Up adds a large step (10), Home goes to the minimum and End to the maximum. The play() asserts each.',
          caveat: 'The keys come from the native range input Base UI renders inside the thumb.',
        }),
      },
    },
  },
  render: () => (
    <Field className='max-w-md'>
      <FieldLabel>Search radius (km)</FieldLabel>
      <Slider defaultValue={[20]} min={0} max={50} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider')
    await userEvent.tab()
    await expect(slider).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(slider).toHaveValue('21')
    await userEvent.keyboard('{PageUp}')
    await expect(slider).toHaveValue('31')
    await userEvent.keyboard('{Home}')
    await expect(slider).toHaveValue('0')
    await userEvent.keyboard('{End}')
    await expect(slider).toHaveValue('50')
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextContrast: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The thumb is what a reader grabs and the filled range is what shows the value, so both have to stand out at 3:1.',
          how: 'The play() measures the thumb’s border against the page and the filled range against the page.',
          caveat:
            'The unfilled track is a quiet guide, not the part that carries the value, so it is not held to 3:1.',
        }),
      },
    },
  },
  render: () => (
    <div className='bg-background p-4' data-testid='surface'>
      <Field className='max-w-md'>
        <FieldLabel>Search radius (km)</FieldLabel>
        <Slider defaultValue={[20]} min={0} max={50} />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = getComputedStyle(within(canvasElement).getByTestId('surface')).backgroundColor
    const thumb = canvasElement.querySelector<HTMLElement>('[data-slot="slider-thumb"]')!
    const range = canvasElement.querySelector<HTMLElement>('[data-slot="slider-range"]')!
    expectContrast(getComputedStyle(thumb).borderTopColor, page, {
      minimum: 3,
      label: 'Thumb border',
    })
    expectContrast(getComputedStyle(range).backgroundColor, page, {
      minimum: 3,
      label: 'Filled range',
    })
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
          why: 'The thumb is drawn at 12px, well under the 24px minimum, so its hit area has to be bigger than what is drawn.',
          how: 'The thumb carries an invisible hit area 8px beyond each edge — 28px across. The play() asks the browser what is under points 11px left, right, above and below the thumb’s centre, and asserts each lands on the thumb.',
          caveat:
            'Hit-testing with elementFromPoint, so this measures what a pointer actually reaches, not the drawn size.',
        }),
      },
    },
  },
  render: () => (
    <Field className='max-w-md py-6'>
      <FieldLabel>Search radius (km)</FieldLabel>
      <Slider defaultValue={[25]} min={0} max={50} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const thumb = canvasElement.querySelector<HTMLElement>('[data-slot="slider-thumb"]')!
    const box = thumb.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    for (const [dx, dy] of [
      [-11, 0],
      [11, 0],
      [0, -11],
      [0, 11],
    ] as const) {
      const hit = document.elementFromPoint(x + dx, y + dy)
      await expect(thumb.contains(hit)).toBe(true)
    }
  },
}

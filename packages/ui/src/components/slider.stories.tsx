/**
 * Slider — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { IconFormatSize } from '../icons/format-size.js'
import { Slider } from './slider.js'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: {
      description: {
        component:
          'Slider selects a number from a range, built on the Base UI Slider primitive — all keyboard stepping (arrows, Home/End, PageUp/PageDown), pointer handling, ARIA and RTL come from there. Inside a Field it needs no label of its own: Base UI reads the surrounding Field context, so FieldLabel associates with it the same way it does for Input.',
      },
    },
  },
  args: {
    label: 'Size',
    defaultValue: 56,
    min: 16,
    max: 140,
    step: 1,
    suffix: 'px',
    showValue: true,
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    suffix: {
      control: 'text',
      description: 'Visual unit appended to the readout. Use `format` for a unit AT should hear.',
      table: { category: 'Content' },
    },
    showValue: { control: 'boolean', table: { category: 'Appearance' } },
    disabled: { control: 'boolean', table: { category: 'Behaviour' } },
    className: { table: { disable: true, category: 'Advanced' } },
  },
  render: (args) => (
    <div className='max-w-md'>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Base UI renders the thumb as a `<div>` wrapping a real
 * `<input type="range">`, and it is the INPUT that carries the value and the
 * (implicit) `slider` role — not the thumb element. Assertions have to target
 * it, or they test the wrapper and pass on a broken control.
 */
function getThumbInput(canvasElement: HTMLElement) {
  const thumb = canvasElement.querySelector<HTMLElement>('[data-slot="slider-thumb"]')
  if (!thumb) {
    throw new Error('Could not find an element with [data-slot="slider-thumb"].')
  }
  const input = thumb.querySelector<HTMLInputElement>('input[type="range"]')
  if (!input) {
    throw new Error('Expected the thumb to contain an <input type="range">.')
  }
  return input
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const input = getThumbInput(canvasElement)

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    // A range input's `slider` role is implicit, so check the value contract.
    await expect(input).toHaveValue(String(args.defaultValue))
    await expect(input).toHaveAttribute('aria-valuenow', String(args.defaultValue))
    await expect(input).toHaveAttribute('min', String(args.min))
    await expect(input).toHaveAttribute('max', String(args.max))

    // The visible label must actually name the control, or the slider is
    // unnamed to a screen reader (WCAG 2.2, 4.1.2).
    await expect(input).toHaveAccessibleName('Size')

    // Keyboard stepping is inherited, not hand-rolled — prove it works with a
    // real key press. A synthetic KeyboardEvent would not move a native range
    // input, so it would pass whether the behaviour existed or not.
    input.focus()
    await userEvent.keyboard('{ArrowRight}')

    await expect(input).toHaveValue(String(Number(args.defaultValue) + Number(args.step ?? 1)))
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex max-w-md flex-col gap-8'>
      <Slider label='Size' defaultValue={56} min={16} max={140} suffix='px' icon={IconFormatSize} />
      <Slider label='Weight' defaultValue={700} min={100} max={900} step={100} />
      <Slider label='No readout' defaultValue={40} showValue={false} />
      <Slider label='Disabled' defaultValue={25} disabled />
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector<HTMLElement>('[data-slot="slider-indicator"]')
    if (!indicator) {
      throw new Error('Could not find [data-slot="slider-indicator"].')
    }

    // Proves globals.css loaded: bg-primary resolves to a real colour rather
    // than staying transparent.
    const background = getComputedStyle(indicator).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

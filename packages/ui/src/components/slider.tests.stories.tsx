/**
 * Slider — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, FieldLabel } from './field.js'
import { Slider } from './slider.js'

const meta = {
  title: 'Components/Slider/Tests',
  component: Slider,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    defaultValue: 56,
    min: 16,
    max: 140,
    step: 1,
  },
  render: (args) => (
    <Field className='max-w-md'>
      <FieldLabel>Size</FieldLabel>
      <Slider {...args} />
    </Field>
  ),
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector<HTMLElement>('[data-slot="slider-range"]')
    if (!indicator) {
      throw new Error('Could not find [data-slot="slider-range"].')
    }

    // Proves globals.css loaded: bg-primary resolves to a real colour rather
    // than staying transparent.
    const background = getComputedStyle(indicator).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

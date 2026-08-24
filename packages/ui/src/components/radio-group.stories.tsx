/**
 * RadioGroup — Default, Variants, CssCheck
 *
 * A single-select set of radios built on the Base UI RadioGroup + Radio
 * primitives — the `radiogroup`/`radio` roles, roving focus and arrow-key
 * navigation come from there. We style each control and its indicator dot.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { RadioGroup, RadioGroupItem } from './radio-group.js'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single-select set of radios on the Base UI RadioGroup + Radio primitives. Base UI owns the `radiogroup`/`radio` roles, roving focus and arrow-key navigation; each `RadioGroupItem` needs a `value`. Pair items with visible labels in a real form.',
      },
    },
  },
  render: (args) => (
    <RadioGroup {...args} aria-label='Contact method' defaultValue='email'>
      <label className='flex items-center gap-2 text-sm text-foreground'>
        <RadioGroupItem value='email' />
        Email
      </label>
      <label className='flex items-center gap-2 text-sm text-foreground'>
        <RadioGroupItem value='sms' />
        SMS
      </label>
      <label className='flex items-center gap-2 text-sm text-foreground'>
        <RadioGroupItem value='post' />
        Post
      </label>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="radio-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="radio-group"].')
    }

    const items = canvasElement.querySelectorAll<HTMLElement>('[data-slot="radio-group-item"]')
    await expect(items).toHaveLength(3)

    // The item matching defaultValue ('email', the first item) starts checked;
    // Base UI owns the checked state, so assert it arrived rather than
    // re-implementing it.
    const checked = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="radio-group-item"][aria-checked="true"]',
    )
    await expect(checked).toHaveLength(1)
    await expect(items[0]).toHaveAttribute('aria-checked', 'true')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <RadioGroup aria-label='Default' defaultValue='b'>
        <div className='flex items-center gap-4'>
          <RadioGroupItem value='a' aria-label='Unchecked' />
          <RadioGroupItem value='b' aria-label='Checked' />
        </div>
      </RadioGroup>

      <RadioGroup aria-label='Disabled' defaultValue='y' disabled>
        <div className='flex items-center gap-4'>
          <RadioGroupItem value='x' aria-label='Disabled unchecked' />
          <RadioGroupItem value='y' aria-label='Disabled checked' />
        </div>
      </RadioGroup>

      <RadioGroup aria-label='Invalid'>
        <div className='flex items-center gap-4'>
          <RadioGroupItem value='m' aria-label='Invalid' aria-invalid />
        </div>
      </RadioGroup>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // The item matching defaultValue renders checked without interaction, so
    // its bg-primary is present on mount.
    const checked = canvasElement.querySelector<HTMLElement>(
      '[data-slot="radio-group-item"][aria-checked="true"]',
    )
    if (!checked) {
      throw new Error('Could not find a checked [data-slot="radio-group-item"].')
    }

    // Proves globals.css loaded: a checked radio has bg-primary, which must
    // resolve to a real colour rather than staying transparent.
    const background = getComputedStyle(checked).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

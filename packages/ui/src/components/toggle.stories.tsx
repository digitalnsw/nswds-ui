/**
 * Toggle — Default, Variants, CssCheck
 *
 * A two-state pressable button built on the Base UI Toggle primitive — the
 * pressed state (`aria-pressed` / `data-state`), keyboard handling and focus
 * come from there. `variant` and `size` are driven by `toggleVariants` (cva).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { IconFormatBold } from '../icons/format-bold.js'
import { IconFormatItalic } from '../icons/format-italic.js'
import { Toggle } from './toggle.js'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A two-state pressable button on the Base UI Toggle primitive. Base UI owns `aria-pressed`, keyboard handling and focus; `variant` (`default` | `outline`) and `size` (`sm` | `default` | `lg`) come from the `toggleVariants` cva.',
      },
    },
  },
  args: {
    'aria-label': 'Bold',
  },
  render: (args) => (
    <Toggle {...args}>
      <IconFormatBold />
    </Toggle>
  ),
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector<HTMLElement>('[data-slot="toggle"]')
    if (!toggle) {
      throw new Error('Could not find [data-slot="toggle"].')
    }

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    await expect(toggle).toHaveAccessibleName('Bold')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    // Pressing is inherited, not hand-rolled — prove it with a real click.
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <Toggle aria-label='Bold default'>
          <IconFormatBold />
        </Toggle>
        <Toggle aria-label='Bold pressed' defaultPressed>
          <IconFormatBold />
        </Toggle>
        <Toggle aria-label='Bold outline' variant='outline'>
          <IconFormatBold />
        </Toggle>
        <Toggle aria-label='Bold disabled' disabled>
          <IconFormatBold />
        </Toggle>
      </div>
      <div className='flex items-center gap-3'>
        <Toggle aria-label='Italic small' size='sm'>
          <IconFormatItalic />
        </Toggle>
        <Toggle aria-label='Italic default' size='default'>
          <IconFormatItalic />
        </Toggle>
        <Toggle aria-label='Italic large' size='lg'>
          <IconFormatItalic />
        </Toggle>
      </div>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  args: { defaultPressed: true },
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector<HTMLElement>('[data-slot="toggle"]')
    if (!toggle) {
      throw new Error('Could not find [data-slot="toggle"].')
    }

    // Proves globals.css loaded: a pressed toggle has bg-muted, which must
    // resolve to a real colour rather than staying transparent.
    const background = getComputedStyle(toggle).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-muted to resolve, received "${background}".`)
    }
  },
}

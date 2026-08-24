/**
 * Checkbox — Default, Variants, CssCheck
 *
 * A binary checkbox built on the Base UI Checkbox primitive — focus, keyboard
 * toggling and the ARIA `checkbox` role all come from there. We style the box
 * and the check indicator on top.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { Checkbox } from './checkbox.js'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A binary checkbox on the Base UI Checkbox primitive. Base UI owns the `checkbox` role, keyboard toggling and focus; give it an accessible name via `aria-label` (or a surrounding Field) so screen readers announce it.',
      },
    },
  },
  args: {
    'aria-label': 'Accept terms',
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector<HTMLElement>('[data-slot="checkbox"]')
    if (!checkbox) {
      throw new Error('Could not find [data-slot="checkbox"].')
    }

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    await expect(checkbox).toHaveAccessibleName('Accept terms')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')

    // Toggling is inherited, not hand-rolled — prove it with a real click.
    await userEvent.click(checkbox)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex items-center gap-6'>
      <Checkbox aria-label='Unchecked' />
      <Checkbox aria-label='Checked' defaultChecked />
      <Checkbox aria-label='Disabled' disabled />
      <Checkbox aria-label='Disabled checked' defaultChecked disabled />
      <Checkbox aria-label='Invalid' aria-invalid />
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  args: { defaultChecked: true },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector<HTMLElement>('[data-slot="checkbox"]')
    if (!checkbox) {
      throw new Error('Could not find [data-slot="checkbox"].')
    }

    // Proves globals.css loaded: a checked checkbox has bg-primary, which must
    // resolve to a real colour rather than staying transparent.
    const background = getComputedStyle(checkbox).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

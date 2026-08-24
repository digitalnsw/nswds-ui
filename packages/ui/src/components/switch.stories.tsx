/**
 * Switch — Default, Variants, CssCheck
 *
 * An on/off toggle built on the Base UI Switch primitive — the `switch` role,
 * keyboard toggling and focus come from there. We style the track and thumb,
 * and add a `size` variant (`sm` | `default`).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { Switch } from './switch.js'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An on/off toggle on the Base UI Switch primitive. Base UI owns the `switch` role, keyboard toggling and focus; give it an accessible name via `aria-label` (or a surrounding Field). A `size` prop (`sm` | `default`) tunes the track dimensions.',
      },
    },
  },
  args: {
    'aria-label': 'Enable notifications',
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>('[data-slot="switch"]')
    if (!control) {
      throw new Error('Could not find [data-slot="switch"].')
    }

    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    await expect(control).toHaveAccessibleName('Enable notifications')
    await expect(control).toHaveAttribute('aria-checked', 'false')

    // Toggling is inherited, not hand-rolled — prove it with a real click.
    await userEvent.click(control)
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex items-center gap-6'>
      <Switch aria-label='Off' />
      <Switch aria-label='On' defaultChecked />
      <Switch aria-label='Small off' size='sm' />
      <Switch aria-label='Small on' size='sm' defaultChecked />
      <Switch aria-label='Disabled' disabled />
      <Switch aria-label='Disabled on' defaultChecked disabled />
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  args: { defaultChecked: true },
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>('[data-slot="switch"]')
    if (!control) {
      throw new Error('Could not find [data-slot="switch"].')
    }

    // Proves globals.css loaded: a checked switch's track has bg-primary, which
    // must resolve to a real colour rather than staying transparent.
    const background = getComputedStyle(control).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-primary to resolve, received "${background}".`)
    }
  },
}

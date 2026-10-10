/**
 * ToggleGroup — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconFormatAlignCenter } from '../icons/format-align-center.js'
import { IconFormatAlignLeft } from '../icons/format-align-left.js'
import { IconFormatAlignRight } from '../icons/format-align-right.js'
import { ToggleGroup, ToggleGroupItem } from './toggle-group.js'

const meta = {
  title: 'Components/ToggleGroup/Tests',
  component: ToggleGroup,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <ToggleGroup {...args} defaultValue={['left']}>
      <ToggleGroupItem value='left' aria-label='Align left'>
        <IconFormatAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value='center' aria-label='Align center'>
        <IconFormatAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value='right' aria-label='Align right'>
        <IconFormatAlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // The item matching the group's defaultValue renders pressed without
    // interaction, so its bg-muted is present on mount.
    const pressed = canvasElement.querySelector<HTMLElement>(
      '[data-slot="toggle-group-item"][aria-pressed="true"]',
    )
    if (!pressed) {
      throw new Error('Could not find a pressed [data-slot="toggle-group-item"].')
    }

    // Proves globals.css loaded: a pressed item has bg-muted, which must
    // resolve to a real colour rather than staying transparent.
    const background = getComputedStyle(pressed).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected bg-muted to resolve, received "${background}".`)
    }
  },
}

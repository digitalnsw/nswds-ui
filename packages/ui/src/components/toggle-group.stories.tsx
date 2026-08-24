/**
 * ToggleGroup — Default, Variants, CssCheck
 *
 * A set of related toggles built on the Base UI ToggleGroup primitive — roving
 * focus, arrow-key navigation and the group ARIA come from there. `variant`,
 * `size` and `spacing` cascade to the items via context.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { IconFormatAlignCenter } from '../icons/format-align-center.js'
import { IconFormatAlignLeft } from '../icons/format-align-left.js'
import { IconFormatAlignRight } from '../icons/format-align-right.js'
import { ToggleGroup, ToggleGroupItem } from './toggle-group.js'

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of related toggles on the Base UI ToggleGroup primitive. Base UI owns roving focus, arrow-key navigation and the group ARIA; `variant`, `size` and `spacing` set on the group cascade to each `ToggleGroupItem` via context.',
      },
    },
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="toggle-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="toggle-group"].')
    }

    const items = canvasElement.querySelectorAll<HTMLElement>('[data-slot="toggle-group-item"]')
    await expect(items).toHaveLength(3)

    // The item matching the group's defaultValue starts pressed; Base UI owns
    // the pressed state, so assert it arrived rather than re-implementing it.
    const leftItem = canvasElement.querySelector<HTMLElement>(
      '[data-slot="toggle-group-item"][aria-label="Align left"]',
    )
    if (!leftItem) {
      throw new Error('Could not find the "Align left" item.')
    }
    await expect(leftItem).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col items-start gap-6'>
      <ToggleGroup variant='outline' defaultValue={['center']}>
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

      <ToggleGroup size='sm' spacing={0} defaultValue={['left']}>
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

      <ToggleGroup orientation='vertical' size='lg' defaultValue={['right']}>
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
    </div>
  ),
}

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

/**
 * Select — Tests
 *
 * Stories that exist to prove something rather than to show it. Hidden from
 * the sidebar; they run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.js'

const meta = {
  title: 'Components/Select/Tests',
  component: Select,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className='w-56' aria-label='State'>
        <SelectValue placeholder='Select a state' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='nsw'>New South Wales</SelectItem>
        <SelectItem value='vic'>Victoria</SelectItem>
        <SelectItem value='qld'>Queensland</SelectItem>
        <SelectItem value='wa'>Western Australia</SelectItem>
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Target the always-visible trigger, never the portaled popup.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="select-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="select-trigger"].')
    }

    // Proves globals.css loaded: the --input-border token resolves to a real
    // colour rather than staying transparent.
    const borderColor = getComputedStyle(trigger).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected the --input-border token to resolve, received "${borderColor}".`)
    }
  },
}

/**
 * NativeSelect — Tests
 *
 * Stories that exist to prove something rather than to show it. Hidden from
 * the sidebar; they run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { NativeSelect, NativeSelectOption } from './native-select.js'

const meta = {
  title: 'Components/NativeSelect/Tests',
  component: NativeSelect,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    'aria-label': 'State',
    defaultValue: 'nsw',
  },
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOption value='nsw'>New South Wales</NativeSelectOption>
      <NativeSelectOption value='vic'>Victoria</NativeSelectOption>
      <NativeSelectOption value='qld'>Queensland</NativeSelectOption>
    </NativeSelect>
  ),
} satisfies Meta<typeof NativeSelect>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector<HTMLElement>('[data-slot="native-select"]')
    if (!select) {
      throw new Error('Could not find [data-slot="native-select"].')
    }

    // Proves globals.css loaded: the --input-border token resolves to a real
    // colour rather than staying transparent.
    const borderColor = getComputedStyle(select).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected the --input-border token to resolve, received "${borderColor}".`)
    }
  },
}

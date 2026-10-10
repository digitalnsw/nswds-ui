/**
 * NativeSelect — Tests
 *
 * Stories that exist to prove something rather than to show it. Hidden from
 * the sidebar; they run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { NativeSelect, NativeSelectOption } from './native-select.js'
import { resolveColor } from './story-helpers.js'

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

    // Proves globals.css loaded: the border is the --input-border token. Width
    // and style alone are not enough — an unstyled control already draws a
    // border of its own — so the colour is compared, by pixel, with the token
    // this element resolves (getComputedStyle reports oklch strings, which
    // cannot be compared as text).
    const style = getComputedStyle(select)
    if (style.borderTopWidth !== '1px' || style.borderTopStyle !== 'solid') {
      throw new Error(
        `Expected a 1px solid border, received ${style.borderTopWidth} ${style.borderTopStyle}.`,
      )
    }
    const token = style.getPropertyValue('--input-border').trim()
    if (!token) throw new Error('Expected the --input-border token to resolve.')
    const [border, expected] = [resolveColor(style.borderTopColor), resolveColor(token)]
    if ((['r', 'g', 'b'] as const).some((c) => Math.abs(border[c] - expected[c]) > 2)) {
      throw new Error(
        `Expected the border to be the --input-border token (${token}), received "${style.borderTopColor}".`,
      )
    }
  },
}

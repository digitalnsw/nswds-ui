/**
 * Select — Tests
 *
 * Stories that exist to prove something rather than to show it. Hidden from
 * the sidebar; they run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.js'
import { resolveColor } from './story-helpers.js'

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

    // Proves globals.css loaded: the border is the --input-border token. Width
    // and style alone are not enough — an unstyled control already draws a
    // border of its own — so the colour is compared, by pixel, with the token
    // this element resolves (getComputedStyle reports oklch strings, which
    // cannot be compared as text).
    const style = getComputedStyle(trigger)
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

/**
 * `null` is the value cva and `??` disagree on: cva reads an explicit `null`
 * as "no variant" (no classes for that axis at all) where `??` falls through
 * to the default. Before the variants were normalised once, that produced a
 * trigger whose `data-size` and `data-variant` said `default` while its
 * classes carried neither the default height nor the default border. This
 * renders the two spellings side by side and holds them to the same output.
 * `size` and `variant` collide with no native attribute and take `null` as typed.
 */
export const NullVariantsAreTheDefaults: Story = {
  name: 'Null variants are the defaults',
  render: () => (
    <div className='space-y-4'>
      <Select>
        <SelectTrigger className='w-56' aria-label='Default variants'>
          <SelectValue placeholder='Default variants' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='nsw'>New South Wales</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className='w-56' aria-label='Null variants' variant={null} size={null}>
          <SelectValue placeholder='Null variants' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='nsw'>New South Wales</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const triggers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="select-trigger"]')
    const [byDefault, byNull] = triggers
    if (!byDefault || !byNull || triggers.length !== 2) {
      throw new Error(`Expected 2 triggers, got ${triggers.length}.`)
    }

    for (const key of ['size', 'variant'] as const) {
      if (byNull.dataset[key] !== 'default') {
        throw new Error(
          `Expected ${key}={null} to report data-${key}="default", got "${byNull.dataset[key]}".`,
        )
      }
    }
    if (!byNull.classList.contains('h-12')) {
      throw new Error(
        `Expected size={null} to carry the default size classes (h-12), got "${byNull.className}".`,
      )
    }
    if (byNull.className !== byDefault.className) {
      throw new Error(
        `Expected the null spelling to render the same classes as the default:\n  default: ${byDefault.className}\n  null:    ${byNull.className}`,
      )
    }
    if (getComputedStyle(byNull).height !== getComputedStyle(byDefault).height) {
      throw new Error('Expected size={null} to render at the default height.')
    }
  },
}

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

/**
 * `null` is the value cva and `??` disagree on: cva reads an explicit `null`
 * as "no variant" (no classes for that axis at all) where `??` falls through
 * to the default. Before the variants were normalised once, that produced a
 * wrapper and `<select>` whose `data-size`/`data-variant` said `default` while
 * the control carried neither the default height nor the default border. This
 * renders the two spellings side by side and holds them to the same output.
 * `size` is omitted from the native props and `variant` has no native
 * attribute, so both take `null` as typed.
 */
export const NullVariantsAreTheDefaults: Story = {
  name: 'Null variants are the defaults',
  render: (args) => (
    <div className='space-y-4'>
      <NativeSelect {...args} aria-label='Default variants'>
        <NativeSelectOption value='nsw'>New South Wales</NativeSelectOption>
      </NativeSelect>
      <NativeSelect {...args} aria-label='Null variants' variant={null} size={null}>
        <NativeSelectOption value='nsw'>New South Wales</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wrappers = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="native-select-wrapper"]',
    )
    const selects = canvasElement.querySelectorAll<HTMLElement>('[data-slot="native-select"]')
    const [wrapDefault, wrapNull] = wrappers
    const [byDefault, byNull] = selects
    if (!wrapDefault || !wrapNull || !byDefault || !byNull || selects.length !== 2) {
      throw new Error(`Expected 2 native selects, got ${selects.length}.`)
    }

    for (const el of [wrapNull, byNull]) {
      for (const key of ['size', 'variant'] as const) {
        if (el.dataset[key] !== 'default') {
          throw new Error(
            `Expected ${key}={null} to report data-${key}="default" on ${el.dataset.slot}, got "${el.dataset[key]}".`,
          )
        }
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

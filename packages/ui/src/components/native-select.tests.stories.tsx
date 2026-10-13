/**
 * NativeSelect — Tests
 *
 * Stories that exist to prove something rather than to show it. Hidden from
 * the sidebar; they run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { NativeSelect, NativeSelectOption } from './native-select.js'
import { expectNullVariantsMatchDefault, queryVariantPair, resolveColor } from './story-helpers.js'

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
 * to the default. Each variant is now resolved once (`resolveVariant`), so the
 * null spelling and the default spelling must render identically: classes,
 * data attributes and painted result. `size` is omitted from the native props and `variant` has no native
 * attribute, so both take `null` as typed; the wrapper mirrors the control's
 * attributes and is held to the same values.
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
    const [wrapDefault, wrapNull] = queryVariantPair(canvasElement, 'native-select-wrapper')
    expectNullVariantsMatchDefault(wrapDefault, wrapNull, {
      attrs: { size: 'default', variant: 'default' },
      sentinelClass: 'group/native-select',
      style: [],
    })
    const [byDefault, byNull] = queryVariantPair(canvasElement, 'native-select')
    expectNullVariantsMatchDefault(byDefault, byNull, {
      attrs: { size: 'default', variant: 'default' },
      sentinelClass: 'h-12',
      style: ['height'],
    })
  },
}

/**
 * NativeSelect — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from './native-select.js'

const meta = {
  title: 'Components/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A styled wrapper around the native `<select>` element. The browser owns the option list and all keyboard/pointer behaviour; we only style the control and overlay the chevron. Use it where the platform picker is preferable (mobile, dense forms) — reach for `Select` when a fully custom popup is required.',
      },
    },
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // A native <select> exposes the implicit `combobox` role and carries its
    // options directly in the DOM — assert both rather than the wrapper div.
    const select = canvas.getByRole('combobox') as HTMLSelectElement
    await expect(select).toBeInTheDocument()
    await expect(select).toHaveValue(String(args.defaultValue))
    await expect(select.options.length).toBeGreaterThan(1)

    // Selecting an option is browser-owned; prove it round-trips a real value.
    await userEvent.selectOptions(select, 'vic')
    await expect(select).toHaveValue('vic')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col items-start gap-4'>
      <NativeSelect aria-label='Default size' defaultValue='a'>
        <NativeSelectOption value='a'>Default size</NativeSelectOption>
        <NativeSelectOption value='b'>Second option</NativeSelectOption>
      </NativeSelect>

      <NativeSelect aria-label='Small size' size='sm' defaultValue='a'>
        <NativeSelectOption value='a'>Small size</NativeSelectOption>
        <NativeSelectOption value='b'>Second option</NativeSelectOption>
      </NativeSelect>

      <NativeSelect aria-label='Grouped options' defaultValue='syd'>
        <NativeSelectOptGroup label='New South Wales'>
          <NativeSelectOption value='syd'>Sydney</NativeSelectOption>
          <NativeSelectOption value='new'>Newcastle</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label='Victoria'>
          <NativeSelectOption value='mel'>Melbourne</NativeSelectOption>
          <NativeSelectOption value='gee'>Geelong</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>

      <NativeSelect aria-label='Disabled' defaultValue='a' disabled>
        <NativeSelectOption value='a'>Disabled</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector<HTMLElement>('[data-slot="native-select"]')
    if (!select) {
      throw new Error('Could not find [data-slot="native-select"].')
    }

    // Proves globals.css loaded: border-input resolves to a real colour rather
    // than staying transparent.
    const borderColor = getComputedStyle(select).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected border-input to resolve, received "${borderColor}".`)
    }
  },
}

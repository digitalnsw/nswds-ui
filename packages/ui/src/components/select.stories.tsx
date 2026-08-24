/**
 * Select — Default, Variants, CssCheck
 *
 * Built on the Base UI Select primitive: the trigger renders in the canvas, but
 * the option list is PORTALED to document.body, so it must be queried there.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select.js'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A custom-styled select on the Base UI Select primitive. Base UI owns the focus management, typeahead, keyboard navigation, ARIA, and the portaled popup positioning. The trigger renders inline; the option list is portaled to the document body.',
      },
    },
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The trigger renders in the canvas; assert it first — this is the robust
    // half of the check.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="select-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="select-trigger"].')
    }
    await expect(trigger).toBeEnabled()

    // Opening reveals the PORTALED list on document.body, not in canvasElement.
    await userEvent.click(trigger)
    const body = within(document.body)
    const option = await body.findByRole('option', { name: 'Victoria' })
    await expect(option).toBeInTheDocument()
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex flex-col items-start gap-6'>
      {/* Grouped items with labels and a separator */}
      <Select defaultValue='syd'>
        <SelectTrigger className='w-56' aria-label='City'>
          <SelectValue placeholder='Select a city' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>New South Wales</SelectLabel>
            <SelectItem value='syd'>Sydney</SelectItem>
            <SelectItem value='new'>Newcastle</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Victoria</SelectLabel>
            <SelectItem value='mel'>Melbourne</SelectItem>
            <SelectItem value='gee'>Geelong</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Small trigger */}
      <Select defaultValue='vic'>
        <SelectTrigger size='sm' className='w-56' aria-label='State (small)'>
          <SelectValue placeholder='Select a state' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='nsw'>New South Wales</SelectItem>
          <SelectItem value='vic'>Victoria</SelectItem>
          <SelectItem value='qld'>Queensland</SelectItem>
        </SelectContent>
      </Select>

      {/* Disabled */}
      <Select disabled>
        <SelectTrigger className='w-56' aria-label='Disabled'>
          <SelectValue placeholder='Unavailable' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='a'>Option A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Target the always-visible trigger, never the portaled popup.
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="select-trigger"]')
    if (!trigger) {
      throw new Error('Could not find [data-slot="select-trigger"].')
    }

    // Proves globals.css loaded: border-input resolves to a real colour rather
    // than staying transparent.
    const borderColor = getComputedStyle(trigger).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected border-input to resolve, received "${borderColor}".`)
    }
  },
}

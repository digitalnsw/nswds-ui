/**
 * InputGroup — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { IconAttachMoney } from '../icons/attach-money.js'
import { IconSearch } from '../icons/search.js'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group.js'

const meta = {
  title: 'Components/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composes an input with leading/trailing addons — icons, text affixes, or buttons — inside a single bordered control. `InputGroupAddon` positions its children inline (start/end) or block (top/bottom); `InputGroupInput` / `InputGroupTextarea` are the borderless controls, and `InputGroupButton` is a compact button sized to sit inside the group.',
      },
    },
  },
  render: () => (
    <div className='max-w-md'>
      <InputGroup>
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput placeholder='Search' aria-label='Search' />
      </InputGroup>
    </div>
  ),
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The group is a labelled control container; the addon-wrapped input is the
    // interactive part.
    const group = canvasElement.querySelector('[data-slot="input-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="input-group"].')
    }

    const input = canvas.getByRole('textbox', { name: 'Search' })
    await expect(input).toBeEnabled()

    // Typing must reach the borderless inner control.
    await userEvent.type(input, 'roads')
    await expect(input).toHaveValue('roads')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='flex max-w-md flex-col gap-6'>
      {/* Leading icon addon */}
      <InputGroup>
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput placeholder='Search the site' aria-label='Search the site' />
      </InputGroup>

      {/* Leading text affix + trailing button */}
      <InputGroup>
        <InputGroupAddon>
          <IconAttachMoney />
          <InputGroupText>AUD</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder='0.00' inputMode='decimal' aria-label='Amount' />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton>Apply</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {/* Block addon with a textarea */}
      <InputGroup>
        <InputGroupTextarea placeholder='Leave a comment' aria-label='Comment' rows={3} />
        <InputGroupAddon align='block-end'>
          <InputGroupText>Markdown supported</InputGroupText>
          <InputGroupButton className='ms-auto'>Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {/* Disabled */}
      <InputGroup>
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput placeholder='Disabled' aria-label='Disabled' disabled />
      </InputGroup>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="input-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="input-group"].')
    }

    // Proves globals.css loaded: border-input resolves to a real colour rather
    // than staying transparent.
    const borderColor = getComputedStyle(group).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected border-input to resolve, received "${borderColor}".`)
    }
  },
}

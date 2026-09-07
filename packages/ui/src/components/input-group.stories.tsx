/**
 * InputGroup — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { IconAttachMoney } from '../icons/attach-money.js'
import { IconSearch } from '../icons/search.js'
import {
  InputGroup,
  InputGroupAction,
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

      {/* Invalid — the group draws the danger border and focus outline; the
          inner control's own aria-invalid treatment is suppressed. */}
      <InputGroup>
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput placeholder='Invalid' aria-label='Invalid' aria-invalid />
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
  play: async ({ canvasElement }) => {
    // Every inner control must relabel itself `input-group-control`: the
    // wrapper's focus ring is a `has-[[data-slot=input-group-control]:focus-visible]`
    // rule, so a control that keeps its own slot name silently stops lighting
    // the group up. Input and Textarea both forward props last precisely so
    // this override wins — reorder that spread and this is what breaks.
    const controls = canvasElement.querySelectorAll('[data-slot="input-group-control"]')
    await expect(controls).toHaveLength(4)
    await expect(canvasElement.querySelector('textarea')).toHaveAttribute(
      'data-slot',
      'input-group-control',
    )
  },
}

/**
 * `InputGroupAction` is the attached trailing action: a solid primary block
 * that fills the group's height and sits flush against its trailing edge. It
 * is a distinct role from `InputGroupButton` — an action you press to do
 * something, not an inline icon affordance like a combobox chevron or a clear
 * button, which stay inside an addon.
 */
export const AttachedAction: Story = {
  name: 'Attached action',
  render: () => (
    <div className='flex max-w-md flex-col gap-6'>
      {/* Leading text affix + attached action */}
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>AUD</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder='0.00' inputMode='decimal' aria-label='Amount' />
        <InputGroupAction>Apply</InputGroupAction>
      </InputGroup>

      {/* No leading affix — the action carries the group on its own */}
      <InputGroup>
        <InputGroupInput placeholder='Search the site' aria-label='Search' />
        <InputGroupAction>Search</InputGroupAction>
      </InputGroup>

      {/* Block addon: the action fills the footer row's height */}
      <InputGroup>
        <InputGroupTextarea placeholder='Leave a comment' aria-label='Comment' rows={3} />
        <InputGroupAddon align='block-end'>
          <InputGroupText>Markdown supported</InputGroupText>
          <InputGroupAction className='ms-auto'>Send</InputGroupAction>
        </InputGroupAddon>
      </InputGroup>

      {/* Disabled */}
      <InputGroup>
        <InputGroupInput
          placeholder='0.00'
          inputMode='decimal'
          aria-label='Amount disabled'
          disabled
        />
        <InputGroupAction disabled>Apply</InputGroupAction>
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Every action must fill its group rather than Button's min-height floor
    // (52px at the default step, 60px below `sm`), and sit flush against the
    // group's inner edge. Checked on all of them, including the one nested in
    // a block-end addon, which has to defeat that addon's padding too.
    const groups = canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group"]')
    await expect(groups.length).toBe(4)

    for (const group of groups) {
      const action = group.querySelector<HTMLElement>('[data-slot="input-group-action"]')
      if (!action) {
        throw new Error('Every group in this story should carry an action.')
      }
      const groupBox = group.getBoundingClientRect()
      const actionBox = action.getBoundingClientRect()

      await expect(actionBox.height).toBeLessThanOrEqual(groupBox.height)
      // Flush trailing edge — only the group's own 1px border between them.
      await expect(Math.abs(groupBox.right - actionBox.right)).toBeLessThanOrEqual(2)
      // Square, so the group's radius can clip it.
      await expect(getComputedStyle(action).borderRadius).toBe('0px')
    }

    // The group clips ONLY because it holds an action — a bare overflow-hidden
    // would cut off descendant outlines, taking Combobox's chevron ring with it.
    await expect(getComputedStyle(groups[0]).overflow).toBe('hidden')

    // Still real buttons: the enabled one presses, the disabled one does not.
    const within0 = within(groups[0])
    const within3 = within(groups[3])
    await expect(within0.getByRole('button', { name: 'Apply' })).toBeEnabled()
    await expect(within3.getByRole('button', { name: 'Apply' })).toBeDisabled()
  },
}

/**
 * The three `InputGroupAction` fills. All share the same geometry — full group
 * height, flush trailing edge, square corners clipped by the group — and differ
 * only in fill weight: `open` is transparent, `subtle` is a 10% ink tint, and
 * `solid` (the default) is the primary fill.
 */
export const ActionFills: Story = {
  name: 'Action fills',
  render: () => (
    <div className='flex max-w-md flex-col gap-8'>
      {(['open', 'subtle', 'solid'] as const).map((variant) => (
        <div key={variant} className='flex flex-col gap-3'>
          <p className='text-base font-semibold'>{variant}</p>

          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>AUD</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              placeholder='0.00'
              inputMode='decimal'
              aria-label={`Amount ${variant}`}
            />
            <InputGroupAction variant={variant}>Apply</InputGroupAction>
          </InputGroup>

          <InputGroup>
            <InputGroupTextarea
              placeholder='Leave a comment'
              aria-label={`Comment ${variant}`}
              rows={3}
            />
            <InputGroupAddon align='block-end'>
              <InputGroupText>Markdown supported</InputGroupText>
              <InputGroupAction variant={variant} className='ms-auto'>
                Send
              </InputGroupAction>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const actions = canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group-action"]')
    await expect(actions.length).toBe(6)

    // Every fill keeps the shared geometry: flush to the group's inner edge and
    // never taller than the group.
    for (const action of actions) {
      const group = action.closest<HTMLElement>('[data-slot="input-group"]')
      if (!group) {
        throw new Error('An action rendered outside a group.')
      }
      const groupBox = group.getBoundingClientRect()
      const actionBox = action.getBoundingClientRect()
      await expect(actionBox.height).toBeLessThanOrEqual(groupBox.height)
      await expect(Math.abs(groupBox.right - actionBox.right)).toBeLessThanOrEqual(2)
    }

    // The three fills must actually differ, or they are not three variants.
    const fills = [...actions]
      .filter((a) => a.textContent?.trim() === 'Apply')
      .map((a) => getComputedStyle(a).backgroundColor)
    await expect(new Set(fills).size).toBe(3)
  },
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="input-group"]')
    if (!group) {
      throw new Error('Could not find [data-slot="input-group"].')
    }

    // Proves globals.css loaded: --input-border resolves to a real colour
    // rather than staying transparent.
    const borderColor = getComputedStyle(group).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected --input-border to resolve, received "${borderColor}".`)
    }
  },
}

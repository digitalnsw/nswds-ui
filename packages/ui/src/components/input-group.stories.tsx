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

      {/* Disabled — carries BOTH a glyph and an InputGroupText on purpose. An
          icon-only row cannot show whether an affix fade reaches a text span
          that sets its own colour, and two attempts to fade the affix were
          waved through against exactly that blind spot. */}
      <InputGroup>
        <InputGroupAddon>
          <IconSearch />
          <InputGroupText>AUD</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder='Disabled' aria-label='Disabled' disabled />
      </InputGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // An inline button has to look pressable without being hovered, so the
    // default is `soft` — a ghost default made it bare text. Callers that want
    // a bare icon affordance (Combobox's chevron and clear) opt into `ghost`
    // explicitly, so this assertion must not reach into those.
    const buttons = canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group-button"]')
    await expect(buttons.length).toBe(2)

    for (const button of buttons) {
      const styles = getComputedStyle(button)
      await expect(button.dataset.variant).toBe('soft')
      await expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      // Released from Button's min-height floor, so it fits the row it sits in.
      await expect(styles.minHeight).toBe('0px')
      await expect(button.getBoundingClientRect().height).toBeLessThanOrEqual(32)
    }

    // Block addons carry the Hairline chrome: a boundary and a recessed fill.
    const footer = canvasElement.querySelector<HTMLElement>('[data-align="block-end"]')
    if (!footer) {
      throw new Error('Could not find the block-end addon.')
    }
    const footerStyles = getComputedStyle(footer)
    await expect(footerStyles.borderTopWidth).toBe('1px')
    await expect(footerStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    // Pin the disabled affix treatment, comparing against the ENABLED group's
    // label rather than a literal so a token change cannot make this vacuous.
    const groups = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group"]')]
    const labelIn = (group: HTMLElement) =>
      [...group.querySelectorAll<HTMLElement>('[data-align="inline-start"] span')].find(
        (span) => span.textContent?.trim() === 'AUD',
      )
    // Select on the label FIRST, then split by disabled — most groups in this
    // story have no text affix at all, so filtering by disabled first picks the
    // icon-only search row and finds nothing.
    const labelled = groups.filter((group) => labelIn(group))
    const enabledGroup = labelled.find((group) => !group.querySelector(':disabled'))
    const disabledGroup = labelled.find((group) => group.querySelector(':disabled'))
    const enabledLabel = enabledGroup && labelIn(enabledGroup)
    const disabledLabel = disabledGroup && labelIn(disabledGroup)
    if (!enabledLabel || !disabledLabel) {
      throw new Error('Expected an enabled and a disabled group, each with an "AUD" text affix.')
    }
    const disabledAffix = disabledLabel.closest<HTMLElement>('[data-align="inline-start"]')
    const disabledIcon = disabledAffix?.querySelector('svg')
    if (!disabledAffix || !disabledIcon) {
      throw new Error('Expected the disabled affix to hold a glyph beside its label.')
    }
    // The affix stays legible in a disabled group: it is an adornment carrying
    // information ("AUD"), not part of the inactive control, and axe measures a
    // faded copy at 2.43:1 with no way to tell it belongs to something
    // disabled. Nothing here may fade — not the addon, not its children.
    await expect(getComputedStyle(disabledAffix).opacity).toBe('1')
    await expect(getComputedStyle(disabledLabel).opacity).toBe('1')
    await expect(getComputedStyle(disabledIcon).opacity).toBe('1')
    await expect(getComputedStyle(disabledLabel).color).toBe(getComputedStyle(enabledLabel).color)
    // The disabled signal lives on the chrome instead: the group's border goes
    // translucent and the affix swaps its caret for `not-allowed`.
    const disabledGroupEl = disabledLabel.closest<HTMLElement>('[data-slot="input-group"]')
    const enabledGroupEl = enabledLabel.closest<HTMLElement>('[data-slot="input-group"]')
    if (!disabledGroupEl || !enabledGroupEl) {
      throw new Error('Expected both labelled affixes to sit inside a group.')
    }
    await expect(getComputedStyle(disabledGroupEl).borderTopColor).not.toBe(
      getComputedStyle(enabledGroupEl).borderTopColor,
    )
    await expect(getComputedStyle(disabledAffix).cursor).toBe('not-allowed')
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
    const groups = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group"]')]
    await expect(groups.length).toBe(4)

    // Destructured, not indexed: this workspace typechecks with
    // `noUncheckedIndexedAccess`, so `groups[0]` is `HTMLElement | undefined`.
    const [firstGroup, , , disabledGroup] = groups
    if (!firstGroup || !disabledGroup) {
      throw new Error('Expected the first and the disabled group to be present.')
    }

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
    await expect(getComputedStyle(firstGroup).overflow).toBe('hidden')

    // Still real buttons: the enabled one presses, the disabled one does not.
    await expect(within(firstGroup).getByRole('button', { name: 'Apply' })).toBeEnabled()
    await expect(within(disabledGroup).getByRole('button', { name: 'Apply' })).toBeDisabled()

    // No hover assertions here on purpose: `userEvent.hover` dispatches
    // synthetic pointer events, which do not move the browser's real pointer,
    // so CSS `:hover` never engages and `firstGroup.matches(':hover')` stays
    // false. Any computed-style hover expectation in this harness would be
    // asserting the REST value under a hover-shaped name. Hover is verified
    // with a real pointer instead (see the design audit for this component).

    // A disabled control fades the group's CHROME — its border here, its affix
    // panel in the addon variants — while every child keeps its own state.
    //
    // The wrapper must NEVER carry `opacity`: ancestor opacity composites the
    // whole subtree and a child cannot opt out of it, so an enabled action
    // beside a disabled field would render at 50% (measured 3.12:1, under the
    // 4.5:1 floor) while still being clickable. These assertions pin that.
    const disabledControl = disabledGroup.querySelector<HTMLElement>(
      '[data-slot="input-group-control"]',
    )
    if (!disabledControl) {
      throw new Error('Expected the disabled group to hold a control.')
    }
    await expect(getComputedStyle(disabledGroup).opacity).toBe('1')
    await expect(getComputedStyle(firstGroup).opacity).toBe('1')
    // The control still fades itself, exactly as a bare disabled Input does.
    await expect(getComputedStyle(disabledControl).opacity).toBe('0.5')
    // ...and the chrome fades with it: the border goes translucent.
    await expect(getComputedStyle(disabledGroup).borderTopColor).not.toBe(
      getComputedStyle(firstGroup).borderTopColor,
    )

    // The regression that matters: a disabled control must not drag an ENABLED
    // button down with it.
    //
    // This has to be measured on a group whose action is NESTED IN AN ADDON,
    // and as an EFFECTIVE opacity. An earlier version of this test asserted
    // `getComputedStyle(action).opacity` on a group whose action is a direct
    // child of InputGroup, which is the one composition that structurally
    // cannot fail — it stayed green while a nested action rendered at 0.5.
    // Ancestor opacity does not show up on the element's own computed style,
    // so walk the chain and multiply.
    const effectiveOpacity = (el: HTMLElement) => {
      let value = 1
      let node: HTMLElement | null = el
      while (node && node !== canvasElement) {
        value *= Number.parseFloat(getComputedStyle(node).opacity)
        node = node.parentElement
      }
      return value
    }

    const nestedGroup = groups.find((group) => {
      const addon = group.querySelector('[data-slot="input-group-addon"]')
      const action = group.querySelector('[data-slot="input-group-action"]')
      return Boolean(addon && action && addon.contains(action))
    })
    if (!nestedGroup) {
      throw new Error('Expected one group to nest its action inside an addon.')
    }
    const nestedAction = nestedGroup.querySelector<HTMLButtonElement>(
      '[data-slot="input-group-action"]',
    )
    const nestedControl = nestedGroup.querySelector<HTMLTextAreaElement>(
      '[data-slot="input-group-control"]',
    )
    if (!nestedAction || !nestedControl) {
      throw new Error('Expected the nested group to hold both a control and an action.')
    }

    nestedControl.disabled = true
    await expect(nestedAction).toBeEnabled()
    // The action is enabled, so it must stay fully legible no matter which
    // ancestor fades. 0.5 here means an ancestor took `opacity`.
    await expect(effectiveOpacity(nestedAction)).toBe(1)
    nestedControl.disabled = false
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

    // Labels must be optically centred. Button's base is `items-baseline`,
    // which only reads centred while its own vertical padding balances the line
    // box — zeroing that padding parked every label 9px high in a 46px segment.
    // Measured off the text's own client rects, not assumed from the classes.
    for (const action of actions) {
      const box = action.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(action)
      const lines = [...range.getClientRects()].filter((r) => r.height > 0)
      await expect(lines.length).toBeGreaterThan(0)
      const textMid =
        (Math.min(...lines.map((r) => r.top)) + Math.max(...lines.map((r) => r.bottom))) / 2
      await expect(Math.abs(textMid - (box.top + box.bottom) / 2)).toBeLessThanOrEqual(1.5)
    }

    // One leading edge down the whole control: the writing surface's text and
    // the footer row's text must share an inset. Textarea's standalone 8px
    // padding put the placeholder 8px in while the footer sat at 16px, which
    // read as the comment field being cramped.
    for (const group of canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group"]')) {
      const textarea = group.querySelector<HTMLTextAreaElement>('textarea')
      const hint = group.querySelector<HTMLElement>('[data-align="block-end"] span')
      if (!textarea || !hint) {
        continue
      }
      const hintRange = document.createRange()
      hintRange.selectNodeContents(hint)
      const [firstHintRect] = [...hintRange.getClientRects()].filter((r) => r.height > 0)
      if (!firstHintRect) {
        throw new Error('The block-end hint rendered no text box.')
      }

      const surfaceTextLeft =
        textarea.getBoundingClientRect().left + parseFloat(getComputedStyle(textarea).paddingLeft)
      await expect(Math.abs(firstHintRect.left - surfaceTextLeft)).toBeLessThanOrEqual(1)
    }

    // ONE hairline colour for the whole control. Internal dividers drawn in a
    // lighter token than the group's own edge made every junction read as
    // heavier rather than as a hierarchy, and the lighter token fell under the
    // 3:1 boundary floor in dark mode.
    const hairlines = new Set<string>()
    for (const group of canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group"]')) {
      const parts = [
        group,
        group.querySelector<HTMLElement>('[data-align="inline-start"]'),
        group.querySelector<HTMLElement>('[data-align="block-end"]'),
        group.querySelector<HTMLElement>('[data-slot="input-group-action"]'),
      ]
      for (const part of parts) {
        if (!part) continue
        const styles = getComputedStyle(part)
        for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
          const width = styles[`border${side}Width` as 'borderTopWidth']
          if (parseFloat(width) === 0) continue
          await expect(width).toBe('1px')
          hairlines.add(styles[`border${side}Color` as 'borderTopColor'])
        }
      }
    }
    await expect(hairlines.size).toBe(1)
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

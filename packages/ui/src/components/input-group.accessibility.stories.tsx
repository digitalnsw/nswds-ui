/**
 * InputGroup — Accessibility
 *
 * One story per WCAG 2.2 criterion an input group has to meet, each asserting
 * it in play(). The group is a styled container: the field inside it is an
 * ordinary Input or Textarea and the actions are ordinary Buttons, so these pin
 * that the container keeps them that way — named, reachable, visibly focused —
 * and that its own chrome is readable.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { IconContentCopy } from '../icons/content-copy.js'
import { IconSearch } from '../icons/search.js'
import { Field, FieldDescription, FieldLabel } from './field.js'
import {
  InputGroup,
  InputGroupAction,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from './input-group.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/InputGroup/Accessibility',
  component: InputGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

function CouncilSearch({ onSearch }: { onSearch?: () => void }) {
  return (
    <div className='max-w-md'>
      <Field>
        <FieldLabel>Find your local council</FieldLabel>
        <FieldDescription>Enter a NSW postcode or suburb.</FieldDescription>
        <InputGroup>
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupInput autoComplete='postal-code' placeholder='For example, 2150' />
          <InputGroupAction onClick={onSearch}>Search</InputGroupAction>
        </InputGroup>
      </Field>
    </div>
  )
}

function Reference({ onCopy }: { onCopy?: () => void }) {
  return (
    <div className='max-w-md'>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>Ref</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label='Your reference number' defaultValue='WWC1234567E' readOnly />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton size='icon-xs' aria-label='Copy reference number' onClick={onCopy}>
            <IconContentCopy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The label and hint around a grouped field have to be tied to the input in code, not just placed beside it, or a screen reader user tabbing into the field hears neither.',
          how: 'Put the group in a Field with a FieldLabel and FieldDescription, exactly as for a bare Input. The play() asserts the input is named by the label and described by the hint, and that the group itself is a group.',
          caveat:
            'The icon in the leading addon is decorative and adds nothing to the name; the label does all the naming.',
        }),
      },
    },
  },
  render: () => <CouncilSearch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Find your local council' })
    await expect(input).toHaveAccessibleDescription('Enter a NSW postcode or suburb.')
    await expect(input.closest('[data-slot="input-group"]')).toHaveAttribute('role', 'group')
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Every control inside the group has to be announced for what it is: the field with its name and value, and each button with a name — including the icon-only ones.',
          how: 'The play() reads the field (a textbox named “Your reference number”, read-only, with its value) and the copy button (a button named by its aria-label).',
          caveat:
            'An icon-only InputGroupButton has no name of its own — give it an aria-label, as here.',
        }),
      },
    },
  },
  render: () => <Reference />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Your reference number' })
    await expect(input).toHaveValue('WWC1234567E')
    await expect(input).toHaveAttribute('readonly')
    await expect(canvas.getByRole('button', { name: 'Copy reference number' })).toBeEnabled()
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const searched = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'The field and the action attached to it have to be reachable and usable in order from the keyboard.',
          how: 'Tab into the field and type a postcode, then Tab to Search and press Enter. The play() asserts focus moves field → action and that Enter runs the search.',
          caveat:
            'The addon is not a tab stop: clicking it focuses the field, but it never takes focus itself.',
        }),
      },
    },
  },
  render: () => <CouncilSearch onSearch={searched} />,
  play: async ({ canvasElement }) => {
    searched.mockClear()
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Find your local council' })
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await userEvent.keyboard('2150')
    await expect(input).toHaveValue('2150')
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Search' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(searched).toHaveBeenCalledTimes(1)
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'The field inside the group draws no focus ring of its own, so the group has to draw one for it — and the attached action, flush against the edge, needs its own.',
          how: 'Tab into the field: the whole group takes a 2px outline. Tab to Search: the outline moves inside the action. The play() asserts each.',
          caveat:
            'The action draws its ring inset, because the group clips anything outside its corners.',
        }),
      },
    },
  },
  render: () => <CouncilSearch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Find your local council' })
    const group = input.closest<HTMLElement>('[data-slot="input-group"]')!
    await expect(getComputedStyle(group).outlineStyle).toBe('none')
    await userEvent.tab()
    await expect(input).toHaveFocus()
    await expect(getComputedStyle(group).outlineStyle).toBe('solid')
    await expect(getComputedStyle(group).outlineWidth).toBe('2px')

    await userEvent.tab()
    const action = canvas.getByRole('button', { name: 'Search' })
    await expect(action).toHaveFocus()
    await expect(getComputedStyle(group).outlineStyle).toBe('none')
    await expect(getComputedStyle(action).outlineStyle).toBe('solid')
    await expect(getComputedStyle(action).outlineWidth).toBe('2px')
  },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextContrast: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The group’s border is what shows there is a field here at all, so it has to reach 3:1 against the page and against the field’s own surface.',
          how: 'The play() measures the group border against the page and against the group’s fill.',
          caveat: 'Measured at rest; the focus outline and the invalid border are stronger still.',
        }),
      },
    },
  },
  render: () => (
    <div className='bg-background p-4' data-testid='surface'>
      <Reference />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = getComputedStyle(within(canvasElement).getByTestId('surface')).backgroundColor
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="input-group"]')!
    const style = getComputedStyle(group)
    expectContrast(style.borderTopColor, page, { minimum: 3, label: 'Group border on the page' })
    expectContrast(style.borderTopColor, style.backgroundColor, {
      minimum: 3,
      label: 'Group border on its fill',
    })
  },
}

export const NonTextContrast: Story = { ...nonTextContrast, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastMinimum: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'An affix like “Ref”, “$” or “km” is information, not decoration — it says what the value means — so it has to be as readable as the value.',
          how: 'The play() measures the affix text against its recessed cell and the value against the field.',
          caveat:
            'Affix text keeps its full colour even when the field is disabled, so this holds in every state.',
        }),
      },
    },
  },
  render: () => <Reference />,
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector<HTMLElement>('[data-slot="input-group-addon"] span')!
    const addon = text.closest<HTMLElement>('[data-slot="input-group-addon"]')!
    const group = addon.closest<HTMLElement>('[data-slot="input-group"]')!
    const input = within(canvasElement).getByRole('textbox')
    expectContrast(getComputedStyle(text).color, getComputedStyle(addon).backgroundColor, {
      label: 'Affix text',
    })
    expectContrast(getComputedStyle(input).color, getComputedStyle(group).backgroundColor, {
      label: 'Value text',
    })
  },
}

export const ContrastMinimum: Story = { ...contrastMinimum, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastMinimum,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

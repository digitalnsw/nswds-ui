/**
 * Combobox — Tests
 *
 * Stories that exist to prove something rather than to show it: a translated
 * chip remove label, and that the theme tokens resolved. Hidden from the
 * sidebar; they run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from './combobox.js'

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange']

const meta = {
  title: 'Components/Combobox/Tests',
  component: Combobox,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      // Base UI's hidden form-value <input> trips axe's `aria-hidden-focus`;
      // see the same override, and why it is safe, in combobox.stories.tsx.
      options: {
        rules: { 'aria-hidden-focus': { enabled: false } },
      },
    },
  },
  render: () => (
    <div className='w-64'>
      <Combobox items={fruits}>
        <ComboboxInput placeholder='Search fruit' aria-label='Fruit' />
        <ComboboxContent>
          <ComboboxEmpty>No fruit found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The chip's remove button is icon-only, so `removeLabel` is the only name AT
 * hears for it. In a list of chips a bare "Remove" is also ambiguous — the
 * prop exists so a consumer can name the chip being removed, which this story
 * demonstrates as well as covering the translation path.
 */
export const TranslatedRemoveLabel: Story = {
  name: 'Translated remove label',
  render: function TranslatedRemove() {
    const anchor = useComboboxAnchor()
    return (
      <div className='w-64'>
        <Combobox multiple items={fruits} defaultValue={['Apple', 'Banana']}>
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(value: string[]) =>
                value.map((item) => (
                  <ComboboxChip key={item} removeLabel={`Quitar ${item}`}>
                    {item}
                  </ComboboxChip>
                ))
              }
            </ComboboxValue>
            <ComboboxChipsInput placeholder='Añadir fruta' aria-label='Fruta (varias)' />
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>Sin resultados.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Each chip's remove button is findable by its own translated name — the
    // per-chip naming the prop exists for. getByRole throws when the name is
    // absent, so these ARE the assertions.
    await expect(canvas.getByRole('button', { name: 'Quitar Apple' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Quitar Banana' })).toBeInTheDocument()

    // Every chip here passes removeLabel, so finding NO button named "Remove"
    // proves the prop was honoured rather than ignored — an implementation
    // that dropped it would fall back to the default and be caught here.
    // (`canvas` is scoped to this story; Storybook renders each story in its
    // own DOM, so this says nothing about any other story's chips.)
    await expect(canvas.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
  },
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // The InputGroup wrapping the combobox input is always visible; never target
    // the portaled popup.
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

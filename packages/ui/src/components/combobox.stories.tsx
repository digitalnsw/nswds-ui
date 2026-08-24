/**
 * Combobox — Default, Variants, CssCheck
 *
 * Built on the Base UI Combobox primitive: the input renders in the canvas, but
 * the filtered list is PORTALED to document.body, so it must be queried there.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from './combobox.js'

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange']

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An autocomplete input on the Base UI Combobox primitive. Base UI owns the filtering, keyboard navigation, ARIA, and the portaled popup positioning. The input renders inline (wrapped in an InputGroup); the filtered list is portaled to the document body. Multi-select is available via `multiple` with `ComboboxChips`.',
      },
    },
    a11y: {
      // Base UI's Combobox renders an intentionally hidden form-value <input>
      // (id="…-hidden-input", tabindex="-1", aria-hidden, visually clipped) to
      // carry the value for native form submission. axe's `aria-hidden-focus`
      // flags it because a tabindex="-1" input is still programmatically
      // focusable — but it is not a real barrier: the element is hidden from
      // assistive tech by design and the visible combobox input carries all the
      // accessible semantics. Scope off only this rule; every other WCAG AA
      // rule (and the global tag pinning) stays enforced.
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The input renders in the canvas (role combobox); assert it first — this is
    // the robust half of the check.
    const input = canvas.getByRole('combobox', { name: 'Fruit' })
    await expect(input).toBeEnabled()

    // Opening reveals the PORTALED list on document.body, not in canvasElement.
    await userEvent.click(input)
    const body = within(document.body)
    const option = await body.findByRole('option', { name: 'Mango' })
    await expect(option).toBeInTheDocument()
  },
}

export const Variants: Story = {
  render: function VariantsRender() {
    const anchor = useComboboxAnchor()

    return (
      <div className='flex flex-col items-start gap-6'>
        {/* Single select with grouped items */}
        <div className='w-64'>
          <Combobox
            items={[
              { value: 'nsw', label: 'New South Wales' },
              { value: 'vic', label: 'Victoria' },
              { value: 'qld', label: 'Queensland' },
            ]}
          >
            <ComboboxInput placeholder='Search state' aria-label='State' />
            <ComboboxContent>
              <ComboboxEmpty>No state found.</ComboboxEmpty>
              <ComboboxList>
                {(item: { value: string; label: string }) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Static grouped items */}
        <div className='w-64'>
          <Combobox items={fruits}>
            <ComboboxInput placeholder='Search fruit' aria-label='Fruit (grouped)' />
            <ComboboxContent>
              <ComboboxEmpty>No fruit found.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxGroup>
                  <ComboboxLabel>Fruit</ComboboxLabel>
                  {fruits.map((item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Multi-select with chips */}
        <div className='w-64'>
          <Combobox multiple items={fruits} defaultValue={['Apple']}>
            <ComboboxChips ref={anchor}>
              <ComboboxValue>
                {(value: string[]) =>
                  value.map((item) => <ComboboxChip key={item}>{item}</ComboboxChip>)
                }
              </ComboboxValue>
              <ComboboxChipsInput placeholder='Add fruit' aria-label='Fruit (multiple)' />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
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
      </div>
    )
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

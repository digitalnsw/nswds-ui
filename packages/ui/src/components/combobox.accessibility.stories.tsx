/**
 * Combobox — Accessibility
 *
 * One story per WCAG 2.2 criterion a filtering combobox has to meet, each
 * asserting it in play(). Behaviour comes from the Base UI combobox (roles,
 * filtering, the open state and keyboard movement); these pin the parts a
 * consumer relies on — the input's name and hint, the keyboard path from
 * typing to chosen, named buttons, a visible focus ring, and the contrast of
 * its edge. The list is portalled to document.body, so it is queried there,
 * and every story that opens it closes it again before the end-of-play axe
 * pass.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
import { Field, FieldDescription, FieldLabel } from './field.js'
import { expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox/Accessibility',
  component: Combobox,
  parameters: {
    layout: 'padded',
    // Base UI's hidden form-value input is focusable by design; see the note in
    // combobox.stories.tsx for why only this rule is scoped off.
    a11y: { options: { rules: { 'aria-hidden-focus': { enabled: false } } } },
  },
}

export default meta

type Story = StoryObj<typeof meta>

const towns = ['Albury', 'Armidale', 'Bathurst', 'Dubbo', 'Orange', 'Tamworth', 'Wagga Wagga']

function TownList() {
  return (
    <ComboboxContent>
      <ComboboxEmpty>No towns found.</ComboboxEmpty>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  )
}

function TownField() {
  return (
    <Field className='w-72'>
      <FieldLabel>Nearest town or city</FieldLabel>
      <Combobox items={towns}>
        <ComboboxInput />
        <TownList />
      </Combobox>
      <FieldDescription>Start typing to filter the list.</FieldDescription>
    </Field>
  )
}

const popup = () => document.querySelector<HTMLElement>('[data-slot="combobox-content"]')

/**
 * Wait for the list to finish closing, so the end-of-play axe pass never
 * meets a list on its way out. The popup can stay in the DOM after it closes,
 * so this waits for it to be gone or hidden rather than for it to unmount.
 */
async function listClosed(input: HTMLElement) {
  await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'))
  await waitFor(
    () => {
      const list = popup()
      if (list) expect(list).not.toBeVisible()
    },
    { timeout: 3000 },
  )
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

/** Resolve a custom property to a colour by painting it on a probe. Mutates the DOM: never call inside waitFor. */
function tokenColour(element: HTMLElement, token: string): string {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  element.append(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
}

/** Computed colour strings differ in rounding and colour space, so compare painted pixels. */
function sameColour(a: string, b: string): boolean {
  const [x, y] = [resolveColor(a), resolveColor(b)]
  return x.r === y.r && x.g === y.g && x.b === y.b && x.a === y.a
}

/** The colour the control sits on: the nearest ancestor with a painted background. Read-only. */
function pageBackdrop(element: HTMLElement): string {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const colour = getComputedStyle(node).backgroundColor
    if (colour !== 'rgba(0, 0, 0, 0)' && colour !== 'transparent') return colour
  }
  return getComputedStyle(document.body).backgroundColor
}

/** Story globals apply after mount: wait for the theme class before resolving tokens. */
async function settleTheme(theme: unknown) {
  const dark = theme === 'dark'
  await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(dark))
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
          why: 'A screen reader has to announce what the input is for, whether its list is open, the options in it, and what was chosen.',
          how: 'Inside a Field the input has the combobox role named by the FieldLabel and reports aria-expanded; the button beside it, which shows the whole list, reports the same aria-expanded and aria-haspopup; opening the list shows a listbox of options, and choosing one fills the input. The play() asserts each.',
          caveat:
            'Outside a Field, name the input with aria-label — the placeholder is not a name.',
        }),
      },
    },
  },
  render: () => <TownField />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: 'Nearest town or city' })
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    const listButton = canvasElement.querySelector<HTMLElement>('[data-slot="input-group-button"]')!
    await expect(listButton).toHaveAttribute('aria-haspopup', 'listbox')
    await expect(listButton).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(input)
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'))
    const body = within(document.body)
    const listbox = await body.findByRole('listbox')
    await waitFor(() => expect(listbox).toBeVisible())
    await userEvent.click(await body.findByRole('option', { name: 'Dubbo' }))

    await listClosed(input)
    await expect(input).toHaveValue('Dubbo')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'People who cannot use a pointer must be able to filter the list, move through it and choose an option without leaving the input.',
          how: 'Tab into the input and type: the list opens, filtered. ArrowDown highlights the first match and Enter chooses it, filling the input; focus never leaves the input. Escape closes the list. The play() drives each key.',
          caveat:
            'The highlighted option is tracked with aria-activedescendant, so focus stays in the input while the arrow keys move through the list.',
        }),
      },
    },
  },
  render: () => <TownField />,
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Nearest town or city' })
    await userEvent.tab()
    await expect(input).toHaveFocus()

    await userEvent.keyboard('Wag')
    await waitFor(() => expect(popup()).toBeVisible())
    const body = within(document.body)
    await waitFor(() => expect(body.getAllByRole('option')).toHaveLength(1))
    await userEvent.keyboard('{ArrowDown}')
    const option = body.getByRole('option', { name: 'Wagga Wagga' })
    await waitFor(() => expect(option).toHaveAttribute('data-highlighted'))
    await userEvent.keyboard('{Enter}')
    await expect(input).toHaveValue('Wagga Wagga')
    await expect(input).toHaveFocus()

    // Reopen from the keyboard and close again without choosing.
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(popup()).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await listClosed(input)
    await expect(input).toHaveValue('Wagga Wagga')
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
          why: 'Keyboard users need to see which field they are typing into.',
          how: 'Tab into the input: the whole field — input and buttons together — draws a 2px outline 2px outside its border, in the danger ring colour when invalid. The play() reads that outline on a valid and an invalid field.',
          caveat:
            'The input draws no ring of its own; the InputGroup around it does, so the ring wraps the buttons too.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-72 gap-6'>
      <Combobox items={towns}>
        <ComboboxInput aria-label='Town or city' showTrigger={false} />
        <TownList />
      </Combobox>
      <Combobox items={towns}>
        <ComboboxInput aria-label='Invalid town or city' aria-invalid showTrigger={false} />
        <TownList />
      </Combobox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Town or city', 'Invalid town or city']) {
      await userEvent.tab()
      const input = canvas.getByRole('combobox', { name })
      await expect(input).toHaveFocus()
      const group = input.closest<HTMLElement>('[data-slot="input-group"]')!
      const style = getComputedStyle(group)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(style.outlineOffset).toBe('2px')
    }
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
          why: 'The border is what shows where to type, so it needs 3:1 against the page and against the field’s own fill.',
          how: 'The play() measures the field’s border against the page, its fill and its hover surface, and the invalid border against the page — in light mode and again in dark.',
          caveat:
            'The border is drawn by the InputGroup around the input, so that is the element measured.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid w-72 gap-6'>
      <Combobox items={towns}>
        <ComboboxInput aria-label='Town or city' />
        <TownList />
      </Combobox>
      <Combobox items={towns}>
        <ComboboxInput aria-label='Invalid town or city' aria-invalid />
        <TownList />
      </Combobox>
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const groupOf = (name: string) =>
      canvas.getByRole('combobox', { name }).closest<HTMLElement>('[data-slot="input-group"]')!
    const field = groupOf('Town or city')
    const invalid = groupOf('Invalid town or city')
    const border = tokenColour(field, '--input-border')
    const surface = tokenColour(field, '--input-surface')
    const hover = tokenColour(field, '--input-surface-hover')
    const invalidBorder = tokenColour(invalid, '--input-invalid-border')
    await waitFor(() => {
      expect(sameColour(getComputedStyle(field).borderTopColor, border)).toBe(true)
      expect(sameColour(getComputedStyle(invalid).borderTopColor, invalidBorder)).toBe(true)
    })
    const page = pageBackdrop(field)
    expectContrast(border, page, { minimum: 3, label: 'Border against the page' })
    expectContrast(border, surface, { minimum: 3, label: 'Border against the field' })
    expectContrast(border, hover, { minimum: 3, label: 'Border against the hover surface' })
    expectContrast(invalidBorder, page, { minimum: 3, label: 'Invalid border against the page' })
  },
}

export const NonTextContrast: Story = { ...nonTextContrast, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

function LanguageChips() {
  const anchor = useComboboxAnchor()
  return (
    <Field className='w-72'>
      <FieldLabel>Languages spoken at home</FieldLabel>
      <Combobox
        multiple
        items={['English', 'Greek', 'Vietnamese']}
        defaultValue={['English', 'Vietnamese']}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(value: string[]) =>
              value.map((item) => (
                <ComboboxChip key={item} removeLabel={`Remove ${item}`}>
                  {item}
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsInput />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>Choose all that apply.</FieldDescription>
    </Field>
  )
}

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The label and hint must be tied to the input in code, and each chosen answer’s remove button must say which answer it removes.',
          how: 'Inside a Field, the FieldDescription is the input’s accessible description. With multiple, each chip’s remove button takes its removeLabel, so it reads “Remove English”, not just “Remove”. The play() reads the description and the buttons’ names, and removes one chip.',
          caveat:
            'Always pass removeLabel with the chip’s text in it; a row of buttons all named “Remove” cannot be told apart by ear.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      <TownField />
      <LanguageChips />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Nearest town or city' }),
    ).toHaveAccessibleDescription('Start typing to filter the list.')

    const remove = canvas.getByRole('button', { name: 'Remove English' })
    await expect(canvas.getByRole('button', { name: 'Remove Vietnamese' })).toBeInTheDocument()
    await userEvent.click(remove)
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Remove English' })).not.toBeInTheDocument(),
    )
    await expect(canvas.getByRole('button', { name: 'Remove Vietnamese' })).toBeInTheDocument()
  },
}

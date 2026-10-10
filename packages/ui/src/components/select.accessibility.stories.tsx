/**
 * Select — Accessibility
 *
 * One story per WCAG 2.2 criterion a custom select has to meet, each asserting
 * it in play(). Behaviour comes from the Base UI select (roles, the open state,
 * focus, keyboard movement and typeahead); these pin the parts a consumer
 * relies on — the trigger's name and state, the keyboard path from closed to
 * chosen, a visible focus ring, and the contrast of the trigger and the list.
 * The list is portalled to document.body, so it is queried there, and every
 * story that opens it closes it again before the end-of-play axe pass.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldDescription, FieldLabel } from './field.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.js'
import { expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Select/Accessibility',
  component: Select,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

const states = {
  nsw: 'New South Wales',
  act: 'Australian Capital Territory',
  vic: 'Victoria',
  qld: 'Queensland',
}

function StateSelect({
  label,
  defaultValue,
  variant,
  invalid,
}: {
  label: string
  defaultValue?: string
  variant?: 'default' | 'filled'
  invalid?: boolean
}) {
  return (
    <Select items={states} defaultValue={defaultValue}>
      <SelectTrigger aria-label={label} variant={variant} aria-invalid={invalid} className='w-72'>
        <SelectValue placeholder='Select a state or territory' />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(states).map(([value, name]) => (
          <SelectItem key={value} value={value}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function StateField() {
  return (
    <Field className='w-72'>
      <FieldLabel>State or territory</FieldLabel>
      <Select items={states} defaultValue='nsw'>
        <SelectTrigger className='w-full'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(states).map(([value, name]) => (
            <SelectItem key={value} value={value}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>Where you live now.</FieldDescription>
    </Field>
  )
}

const popup = () => document.querySelector<HTMLElement>('[data-slot="select-content"]')

/**
 * Press Escape and wait for the list to close. Base UI keeps a Select's popup
 * mounted once it has opened, so closeOverlay's wait for it to leave the DOM
 * never resolves; wait for the trigger to report it closed and the popup to
 * stop being visible instead.
 */
async function closeSelect(trigger: HTMLElement) {
  await expect(popup()).toBeVisible()
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
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
          why: 'A screen reader has to announce what the select is for, what is chosen, whether its list is open, and each option in it.',
          how: 'Inside a Field the trigger is named by the FieldLabel and reports aria-expanded; opening it shows a listbox of options, and choosing one updates the trigger. The play() asserts each step.',
          caveat:
            'Outside a Field, name the trigger with aria-label or aria-labelledby — the placeholder is not a name.',
        }),
      },
    },
  },
  render: () => <StateField />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'State or territory' })
    await expect(trigger).toHaveTextContent('New South Wales')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    const body = within(document.body)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    await expect(await body.findByRole('listbox')).toBeVisible()
    await userEvent.click(await body.findByRole('option', { name: 'Victoria' }))

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(trigger).toHaveTextContent('Victoria')
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
          why: 'People who cannot use a pointer must be able to open the list, move through it, choose an option and get back to the form.',
          how: 'Tab to the trigger and press Enter: the list opens on the chosen option. The arrow keys move through it and Enter chooses; the list closes and focus returns to the trigger. Escape closes it without choosing. The play() drives each key.',
          caveat:
            'Typing the first letters of an option also jumps to it (typeahead) — Base UI behaviour, not asserted here.',
        }),
      },
    },
  },
  render: () => <StateSelect label='State or territory' defaultValue='nsw' />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'State or territory' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(popup()).toBeVisible())
    const body = within(document.body)
    await waitFor(() => expect(body.getByRole('option', { name: 'New South Wales' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() =>
      expect(body.getByRole('option', { name: 'Australian Capital Territory' })).toHaveFocus(),
    )
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(trigger).toHaveTextContent('Australian Capital Territory')
    await waitFor(() => expect(trigger).toHaveFocus())

    // Escape closes without changing the choice.
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(popup()).toBeVisible())
    await userEvent.keyboard('{ArrowDown}')
    await closeSelect(trigger)
    await expect(trigger).toHaveTextContent('Australian Capital Territory')
    await expect(trigger).toHaveFocus()
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
          why: 'Keyboard users need to see which control they are on.',
          how: 'Tab to a trigger: a 2px outline appears 2px outside it, in the danger ring colour when invalid. The play() reads the outline on each variant and on an invalid trigger.',
          caveat:
            'The trigger rings on :focus, not :focus-visible, so it also shows after a mouse click — a button does not match :focus-visible on click.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-6'>
      <StateSelect label='Default' defaultValue='nsw' />
      <StateSelect label='Filled' variant='filled' defaultValue='nsw' />
      <StateSelect label='Invalid' invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Default', 'Filled', 'Invalid']) {
      await userEvent.tab()
      const trigger = canvas.getByRole('combobox', { name })
      await expect(trigger).toHaveFocus()
      const style = getComputedStyle(trigger)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
      await expect(style.outlineOffset).toBe('2px')
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastMinimum: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The chosen value, the placeholder and every option are text people have to read: 4.5:1 against what they sit on.',
          how: 'The play() measures the trigger’s value and placeholder against the trigger, opens the list, and measures an option and the highlighted option against the list — in light mode and again in dark.',
          caveat:
            'Disabled options are exempt and are not measured. Colours are painted through a canvas, so oklch tokens are measured as drawn.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-6'>
      <StateSelect label='Chosen' defaultValue='nsw' />
      <StateSelect label='Empty' />
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const chosen = canvas.getByRole('combobox', { name: 'Chosen' })
    const empty = canvas.getByRole('combobox', { name: 'Empty' })
    const surface = tokenColour(chosen, '--input-surface')
    await waitFor(() =>
      expect(sameColour(getComputedStyle(chosen).backgroundColor, surface)).toBe(true),
    )
    expectContrast(getComputedStyle(chosen).color, surface, { label: 'Chosen value' })
    expectContrast(getComputedStyle(empty).color, surface, { label: 'Placeholder' })

    chosen.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(popup()).toBeVisible())
    const body = within(document.body)
    const highlighted = body.getByRole('option', { name: 'New South Wales' })
    const other = body.getByRole('option', { name: 'Victoria' })
    await waitFor(() => expect(highlighted).toHaveFocus())
    const list = getComputedStyle(popup()!).backgroundColor
    await waitFor(() =>
      expectContrast(getComputedStyle(other).color, list, { label: 'Option text' }),
    )
    await waitFor(() =>
      expectContrast(
        getComputedStyle(highlighted).color,
        getComputedStyle(highlighted).backgroundColor,
        { label: 'Highlighted option text' },
      ),
    )
    await closeSelect(chosen)
  },
}

export const ContrastMinimum: Story = { ...contrastMinimum, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastMinimum,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextContrast: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The border is what shows where the control is, so it needs 3:1 against the page and against the trigger’s own fill.',
          how: 'The play() measures the default trigger’s border against the page, its fill and its hover surface, and the invalid border against the page — in light mode and again in dark.',
          caveat:
            'Only the default variant is measured. The filled variant has no border at rest — its tint is barely distinguishable from the page — so it relies on its text and chevron to be found; prefer the default variant in forms.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid gap-6'>
      <StateSelect label='Default' defaultValue='nsw' />
      <StateSelect label='Invalid' invalid />
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox', { name: 'Default' })
    const invalid = canvas.getByRole('combobox', { name: 'Invalid' })
    const border = tokenColour(trigger, '--input-border')
    const surface = tokenColour(trigger, '--input-surface')
    const hover = tokenColour(trigger, '--input-surface-hover')
    const invalidBorder = tokenColour(invalid, '--input-invalid-border')
    await waitFor(() => {
      expect(sameColour(getComputedStyle(trigger).borderTopColor, border)).toBe(true)
      expect(sameColour(getComputedStyle(invalid).borderTopColor, invalidBorder)).toBe(true)
    })
    const page = pageBackdrop(trigger)
    expectContrast(border, page, { minimum: 3, label: 'Border against the page' })
    expectContrast(border, surface, { minimum: 3, label: 'Border against the fill' })
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

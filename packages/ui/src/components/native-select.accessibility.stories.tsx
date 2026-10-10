/**
 * NativeSelect — Accessibility
 *
 * One story per WCAG 2.2 criterion a native select has to meet, each asserting
 * it in play(). NativeSelect is a real `<select>`, so the browser owns its
 * role, its option list and its keyboard behaviour. These pin what our
 * styling could break — the label association, keyboard reach, a visible
 * focus ring, and the contrast of its text and edge.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Label } from './label.js'
import { NativeSelect, NativeSelectOption } from './native-select.js'
import { expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/NativeSelect/Accessibility',
  component: NativeSelect,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NativeSelect>

export default meta

type Story = StoryObj<typeof meta>

function StateOptions() {
  return (
    <>
      <NativeSelectOption value='nsw'>New South Wales</NativeSelectOption>
      <NativeSelectOption value='act'>Australian Capital Territory</NativeSelectOption>
      <NativeSelectOption value='vic'>Victoria</NativeSelectOption>
    </>
  )
}

function StateField({ id, ...props }: { id: string } & ComponentProps<typeof NativeSelect>) {
  return (
    <div className='grid w-72 gap-2'>
      <Label htmlFor={id}>State or territory</Label>
      <NativeSelect id={id} defaultValue='nsw' className='w-full' {...props}>
        <StateOptions />
      </NativeSelect>
    </div>
  )
}

// ─── Colour helpers ───────────────────────────────────────────────────────────

/**
 * Resolve a custom property to a colour by painting it on a probe. The probe
 * goes on the wrapper — a select cannot hold a span. Mutates the DOM: never
 * call inside waitFor.
 */
function tokenColour(element: HTMLElement, token: string): string {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  ;(element.parentElement ?? element).append(probe)
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
          why: 'A screen reader has to announce what the list is for and what is chosen in it.',
          how: 'The select keeps the native combobox role, is named by the Label pointed at its id, and reports its chosen option as its value. The play() asserts all three, then changes the choice.',
          caveat:
            'NativeSelect is a plain select, not a Base UI Field control: inside a Field, FieldLabel does not name it. Use Label with htmlFor, as here.',
        }),
      },
    },
  },
  render: () => <StateField id='native-select-a11y-name' />,
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole<HTMLSelectElement>('combobox', {
      name: 'State or territory',
    })
    await expect(select.tagName).toBe('SELECT')
    await expect(select).toHaveDisplayValue('New South Wales')
    await userEvent.selectOptions(select, 'vic')
    await expect(select).toHaveDisplayValue('Victoria')
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
          why: 'People who cannot use a pointer must be able to reach the select and leave it again.',
          how: 'Tab moves onto the select and on to the next control; the browser then opens and moves through its own list from the keyboard. The play() tabs through both selects in order.',
          caveat:
            'The open list is the browser’s own picker, outside the page, so its keys are the platform’s — not something the styling can change or a story can drive.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-6'>
      <StateField id='native-select-a11y-key-1' />
      <div className='grid w-72 gap-2'>
        <Label htmlFor='native-select-a11y-key-2'>Postal state or territory</Label>
        <NativeSelect id='native-select-a11y-key-2' defaultValue='act' className='w-full'>
          <StateOptions />
        </NativeSelect>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('combobox', { name: 'State or territory' })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('combobox', { name: 'Postal state or territory' })).toHaveFocus()
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
          how: 'Tab to a select: a 2px outline appears 2px outside its border, in the danger ring colour when invalid. The play() reads the outline on each variant and on an invalid select.',
          caveat:
            'Browsers treat a select as focus-visible on click as well, so the ring also shows for mouse users.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-6'>
      <NativeSelect aria-label='Default' defaultValue='nsw'>
        <StateOptions />
      </NativeSelect>
      <NativeSelect aria-label='Filled' variant='filled' defaultValue='nsw'>
        <StateOptions />
      </NativeSelect>
      <NativeSelect aria-label='Invalid' aria-invalid defaultValue='nsw'>
        <StateOptions />
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Default', 'Filled', 'Invalid']) {
      await userEvent.tab()
      const select = canvas.getByRole('combobox', { name })
      await expect(select).toHaveFocus()
      const style = getComputedStyle(select)
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
          why: 'The chosen option is text people have to read: 4.5:1 against the control.',
          how: 'The play() measures the select’s text against its own fill, for both variants, in light mode and again in dark.',
          caveat:
            'The open list is drawn by the browser in the system’s Canvas colours, so it is not measured here.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid gap-6'>
      <NativeSelect aria-label='Default' defaultValue='nsw'>
        <StateOptions />
      </NativeSelect>
      <NativeSelect aria-label='Filled' variant='filled' defaultValue='nsw'>
        <StateOptions />
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const field = canvas.getByRole('combobox', { name: 'Default' })
    const filled = canvas.getByRole('combobox', { name: 'Filled' })
    const surface = tokenColour(field, '--input-surface')
    const band = tokenColour(filled, '--secondary')
    await waitFor(() => {
      expect(sameColour(getComputedStyle(field).backgroundColor, surface)).toBe(true)
      expect(sameColour(getComputedStyle(filled).backgroundColor, band)).toBe(true)
    })
    expectContrast(getComputedStyle(field).color, surface, { label: 'Default select text' })
    expectContrast(getComputedStyle(filled).color, band, { label: 'Filled select text' })
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
          why: 'The border is what shows where the control is, so it needs 3:1 against the page and against the control’s own fill.',
          how: 'The play() measures the default variant’s border against the page, its fill and its hover surface, and the invalid border against the page — in light mode and again in dark.',
          caveat:
            'Only the default variant is measured. The filled variant has no border at rest — its tint is barely distinguishable from the page — so it relies on its text and chevron to be found; prefer the default variant in forms.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid gap-6'>
      <NativeSelect aria-label='Default' defaultValue='nsw'>
        <StateOptions />
      </NativeSelect>
      <NativeSelect aria-label='Invalid' aria-invalid defaultValue='nsw'>
        <StateOptions />
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const field = canvas.getByRole('combobox', { name: 'Default' })
    const invalid = canvas.getByRole('combobox', { name: 'Invalid' })
    const border = tokenColour(field, '--input-border')
    const surface = tokenColour(field, '--input-surface')
    const hover = tokenColour(field, '--input-surface-hover')
    const invalidBorder = tokenColour(invalid, '--input-invalid-border')
    await waitFor(() => {
      expect(sameColour(getComputedStyle(field).borderTopColor, border)).toBe(true)
      expect(sameColour(getComputedStyle(invalid).borderTopColor, invalidBorder)).toBe(true)
    })
    const page = pageBackdrop(field.parentElement!)
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

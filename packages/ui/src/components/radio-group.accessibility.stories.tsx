/**
 * RadioGroup — Accessibility
 *
 * One story per WCAG 2.2 criterion a radio group has to meet, each asserting it
 * in play(). Behaviour comes from the Base UI radio group (roles, single
 * selection, roving focus and arrow keys); these pin the parts a consumer
 * relies on — that the group and each option are named, the arrow keys move
 * the selection, focus is visible, the controls are drawn with enough
 * contrast, and an error is tied to the group.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
} from './field.js'
import { RadioGroup, RadioGroupItem } from './radio-group.js'
import { expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/RadioGroup/Accessibility',
  component: RadioGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

const topics = [
  ['government', 'NSW Government'],
  ['business', 'Business and Economy'],
  ['community', 'Community services'],
] as const

function Topic({
  label = 'Topic',
  invalid,
  ...props
}: { label?: string; invalid?: boolean } & ComponentProps<typeof RadioGroup>) {
  return (
    <Field className='max-w-md' invalid={invalid}>
      <FieldLabel>{label}</FieldLabel>
      <FieldDescription>Select the closest match.</FieldDescription>
      <RadioGroup {...props}>
        {topics.map(([value, name]) => (
          <FieldItem key={value} className='flex min-h-11 items-center gap-4'>
            <RadioGroupItem value={value} />
            <FieldLabel className='font-normal'>{name}</FieldLabel>
          </FieldItem>
        ))}
      </RadioGroup>
      {invalid ? <FieldError>Select a topic to continue.</FieldError> : null}
    </Field>
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
          why: 'A screen reader has to announce the question, each answer, and which one is chosen — and announce the change when another is chosen.',
          how: 'The group exposes the radiogroup role named by the Field’s label; each option the radio role named by its own FieldLabel, with aria-checked. The play() asserts the names and that choosing another option moves aria-checked to it.',
          caveat:
            'Each option needs its own FieldItem, or every FieldLabel in the Field would name the group instead of its option.',
        }),
      },
    },
  },
  render: () => <Topic defaultValue='government' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('radiogroup', { name: 'Topic' })
    const government = within(group).getByRole('radio', { name: 'NSW Government' })
    const business = within(group).getByRole('radio', { name: 'Business and Economy' })
    await expect(government).toHaveAttribute('aria-checked', 'true')
    await expect(business).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(canvas.getByText('Business and Economy'))
    await expect(business).toHaveAttribute('aria-checked', 'true')
    await expect(government).toHaveAttribute('aria-checked', 'false')
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
          why: 'People who cannot use a pointer must be able to reach the group and change the answer.',
          how: 'Tab moves into the group onto the chosen option — one tab stop for the whole group. The arrow keys move to the next or previous option and choose it. The play() tabs in, presses the down and up arrows, and checks focus and selection follow.',
          caveat:
            'Arrow keys wrap from the last option to the first. Tab leaves the group; it does not step through the options.',
        }),
      },
    },
  },
  render: () => <Topic defaultValue='business' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const business = canvas.getByRole('radio', { name: 'Business and Economy' })
    const community = canvas.getByRole('radio', { name: 'Community services' })

    await userEvent.tab()
    await expect(business).toHaveFocus()

    await userEvent.keyboard('[ArrowDown]')
    await expect(community).toHaveFocus()
    await expect(community).toHaveAttribute('aria-checked', 'true')

    await userEvent.keyboard('[ArrowUp]')
    await expect(business).toHaveFocus()
    await expect(business).toHaveAttribute('aria-checked', 'true')
    await expect(
      canvasElement.querySelectorAll('[role="radio"][aria-checked="true"]'),
    ).toHaveLength(1)
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
          why: 'Keyboard users need to see which option the arrow keys are on.',
          how: 'Tab into the group: a 2px outline in the ink colour appears around the focused radio (offset 3px, or 2px when invalid). The play() reads the outline on a valid and an invalid group.',
          caveat:
            'The ring is on :focus-visible, so it shows for keyboard focus and not after a mouse click — the browser decides which.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid gap-8'>
      <Topic defaultValue='government' />
      <Topic label='Preferred topic' defaultValue='government' invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const group of ['Topic', 'Preferred topic']) {
      await userEvent.tab()
      const radio = within(canvas.getByRole('radiogroup', { name: group })).getByRole('radio', {
        name: 'NSW Government',
      })
      await expect(radio).toHaveFocus()
      const style = getComputedStyle(radio)
      await expect(style.outlineStyle).toBe('solid')
      await expect(style.outlineWidth).toBe('2px')
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
          why: 'The circle is what shows an option is there, and the dot is what shows it is chosen, so both need 3:1 against what they sit on.',
          how: 'The play() measures the circle’s border against the page and the input surface, the chosen dot against the input surface, and the invalid border against the page — in light mode and again in dark.',
          caveat:
            'Disabled radios are exempt from 1.4.11 and are not measured. Colours are painted through a canvas, so oklch tokens are measured as drawn.',
        }),
      },
    },
  },
  render: () => (
    <div className='pointer-events-none grid gap-8'>
      <Topic defaultValue='government' />
      {/* The invalid radio on its own, outside an invalid Field: this story
          measures the radio, not the Field's error text. */}
      <RadioGroup aria-label='Preferred topic'>
        <RadioGroupItem value='government' aria-label='Invalid option' aria-invalid />
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement, globals }) => {
    await settleTheme(globals.theme)
    const canvas = within(canvasElement)
    const valid = canvas.getByRole('radiogroup', { name: 'Topic' })
    const chosen = within(valid).getByRole('radio', { name: 'NSW Government' })
    const unchosen = within(valid).getByRole('radio', { name: 'Business and Economy' })
    const invalid = canvas.getByRole('radio', { name: 'Invalid option' })
    const dot = chosen.querySelector<HTMLElement>('[data-slot="radio-group-indicator"]')!

    // Resolved outside waitFor: the probe mutates the DOM.
    const border = tokenColour(unchosen, '--text-default')
    const surface = tokenColour(unchosen, '--input-surface')
    const ink = tokenColour(
      chosen,
      document.documentElement.classList.contains('dark')
        ? '--color-primary-200'
        : '--color-primary-800',
    )
    const invalidBorder = tokenColour(invalid, '--input-invalid-border')

    await waitFor(() => {
      expect(sameColour(getComputedStyle(unchosen).borderTopColor, border)).toBe(true)
      expect(sameColour(getComputedStyle(dot).backgroundColor, ink)).toBe(true)
      expect(sameColour(getComputedStyle(invalid).borderTopColor, invalidBorder)).toBe(true)
    })

    const page = pageBackdrop(unchosen)
    expectContrast(border, page, { minimum: 3, label: 'Radio border against the page' })
    expectContrast(border, surface, { minimum: 3, label: 'Radio border against its fill' })
    expectContrast(ink, surface, { minimum: 3, label: 'Chosen dot against the input surface' })
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

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The question, its hint and each option’s hint must be tied to the controls in code, so a screen reader announces them together.',
          how: 'The Field’s FieldDescription describes the group; an option’s own FieldDescription, inside its FieldItem, is added to that option’s description and no other. The play() reads the group’s description and checks each option hint reaches only its own option.',
          caveat:
            'Keep each option’s hint inside its FieldItem. Outside it, the hint would describe the whole group.',
        }),
      },
    },
  },
  render: () => (
    <Field className='max-w-md'>
      <FieldLabel>How do you want to apply?</FieldLabel>
      <FieldDescription>You can change this later.</FieldDescription>
      <RadioGroup defaultValue='online'>
        {[
          ['online', 'Online', 'Get a decision in about 10 minutes.'],
          ['post', 'By post', 'Allow up to 4 weeks for a decision.'],
        ].map(([value, label, hint]) => (
          <FieldItem key={value} className='flex items-start gap-4'>
            <RadioGroupItem value={value!} />
            <FieldContent className='pt-1'>
              <FieldLabel className='font-normal'>{label}</FieldLabel>
              <FieldDescription>{hint}</FieldDescription>
            </FieldContent>
          </FieldItem>
        ))}
      </RadioGroup>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('radiogroup', { name: 'How do you want to apply?' })
    await expect(group).toHaveAccessibleDescription('You can change this later.')
    // Each option is described by its own hint (after the group's), and only its own.
    await expect(within(group).getByRole('radio', { name: 'By post' })).toHaveAccessibleDescription(
      expect.stringContaining('Allow up to 4 weeks for a decision.'),
    )
    await expect(
      within(group).getByRole('radio', { name: 'Online' }),
    ).not.toHaveAccessibleDescription(
      expect.stringContaining('Allow up to 4 weeks for a decision.'),
    )
  },
}

// ─── 3.3.1 — Error Identification ─────────────────────────────────────────────

export const ErrorIdentification: Story = {
  name: 'Error Identification — 3.3.1',
  parameters: {
    wcag: ['3.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.1',
          why: 'When no answer is chosen, the error has to be identified in text and tied to the question, not shown by colour alone.',
          how: 'Field invalid marks the group and every option aria-invalid, and the FieldError joins the group’s description. The play() asserts both.',
          caveat:
            'The red borders are a second signal, never the only one: always render the FieldError text.',
        }),
      },
    },
  },
  render: () => <Topic label='Preferred topic' invalid />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', { name: 'Preferred topic' })
    await expect(group).toHaveAttribute('aria-invalid', 'true')
    await expect(group).toHaveAccessibleDescription(
      'Select the closest match. Select a topic to continue.',
    )
    for (const radio of within(group).getAllByRole('radio')) {
      await expect(radio).toHaveAttribute('aria-invalid', 'true')
    }
  },
}

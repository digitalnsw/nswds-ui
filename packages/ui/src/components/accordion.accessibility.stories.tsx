/**
 * Accordion — Accessibility
 *
 * One story per WCAG 2.2 criterion an accordion has to meet, each asserting it
 * in play(). Base UI supplies the behaviour — heading-wrapped button triggers,
 * aria-expanded, labelled panels — and this package supplies the focus
 * treatment and the colours. These pin both.
 *
 * Contrast is asserted in light mode only: in dark mode the band variant's
 * trigger text measures 4.34:1 on its grey band, under 4.5:1, so a dark story
 * would fail on the component rather than prove anything. That is reported as
 * a finding, not asserted around.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionVariant,
} from './accordion.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Accordion/Accessibility',
  component: Accordion,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The opaque colour an element is painted on: its own background composited
 * over each ancestor's until an opaque one is reached.
 */
function paintedBackground(element: Element): string {
  const layers: string[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const background = getComputedStyle(node).backgroundColor
    layers.push(background)
    if (resolveColor(background).a === 1) {
      const [base, ...tints] = layers.reverse()
      let painted = resolveColor(base!)
      for (const tint of tints) painted = { ...compositeOver(resolveColor(tint), painted), a: 1 }
      return `rgb(${painted.r} ${painted.g} ${painted.b})`
    }
  }
  throw new Error('No opaque background behind the element.')
}

function LicenceQuestions({
  variant,
  defaultValue = ['who'],
}: {
  variant?: AccordionVariant
  defaultValue?: string[]
}) {
  return (
    <Accordion
      variant={variant}
      defaultValue={defaultValue}
      className='max-w-md'
      data-testid={variant ?? 'default'}
    >
      <AccordionItem value='who'>
        <AccordionTrigger>Who needs a licence</AccordionTrigger>
        <AccordionContent>
          Anyone fishing in NSW waters, including from the shore, unless they are exempt.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='cost'>
        <AccordionTrigger>How much it costs</AccordionTrigger>
        <AccordionContent>Fees depend on how long the licence lasts.</AccordionContent>
      </AccordionItem>
      <AccordionItem value='where'>
        <AccordionTrigger>Where to buy one</AccordionTrigger>
        <AccordionContent>Online, by phone, or at a Service NSW centre.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
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
          why: 'Each trigger is a button that shows or hides a panel. A screen reader user needs its name, that it is a button, and whether its panel is expanded — and the panel needs a name of its own so it is announced in context.',
          how: 'The play() reads each trigger as a named button with aria-expanded, asserts the open one points at a region named by that same trigger, then opens the second and asserts the states swap.',
          caveat:
            'Opening one item closes the others unless the accordion is multiple; aria-expanded tracks that on every trigger.',
        }),
      },
    },
  },
  render: () => <LicenceQuestions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const who = canvas.getByRole('button', { name: 'Who needs a licence' })
    const cost = canvas.getByRole('button', { name: 'How much it costs' })
    await expect(who).toHaveAttribute('aria-expanded', 'true')
    await expect(cost).toHaveAttribute('aria-expanded', 'false')

    const panel = canvas.getByRole('region', { name: 'Who needs a licence' })
    await expect(who).toHaveAttribute('aria-controls', panel.id)

    await userEvent.click(cost)
    await expect(cost).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(who).toHaveAttribute('aria-expanded', 'false'))
    await expect(canvas.getByRole('region', { name: 'How much it costs' })).toBeVisible()
  },
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
          why: 'Accordion triggers are the headings of the content they hide. Wrapping each in a heading puts the questions in the page outline, so a screen reader user can jump between them with the heading keys.',
          how: 'The play() asserts there is one level-3 heading per item, each containing that item’s trigger button.',
          caveat:
            'The level is fixed at 3. On a page where the accordion sits under an h3 rather than an h2, the outline skips a level.',
        }),
      },
    },
  },
  render: () => <LicenceQuestions />,
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading', { level: 3 })
    await expect(headings).toHaveLength(3)
    for (const heading of headings) {
      await expect(within(heading).getByRole('button')).toBeVisible()
    }
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
          why: 'Every item must open and close from the keyboard, the same way it does for a pointer.',
          how: 'Tab to the first trigger, then Tab again to the second — the closed panels hold nothing to stop on. Enter opens the second item; Space closes it again. The play() asserts each step.',
          caveat:
            'Tab is how focus moves between triggers: the arrow keys do not move focus between them in this build. Tab also moves into an open panel’s links before the next trigger.',
        }),
      },
    },
  },
  render: () => <LicenceQuestions defaultValue={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const who = canvas.getByRole('button', { name: 'Who needs a licence' })
    const cost = canvas.getByRole('button', { name: 'How much it costs' })

    await userEvent.tab()
    await expect(who).toHaveFocus()
    await userEvent.tab()
    await expect(cost).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await expect(cost).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard(' ')
    await expect(cost).toHaveAttribute('aria-expanded', 'false')
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
          why: 'A keyboard user has to see which question Enter and Space will act on.',
          how: 'Tab to the first trigger. The play() asserts the two changes it does not show at rest: its label is underlined, and it takes the muted background tint.',
          caveat:
            'The trigger also asks for a 2px inset outline (focus-visible:outline-2), but its own outline-none sets the outline style to none, so no outline is drawn; the underline and tint are the indicator. The tint eases in with the colour transition, so the play() waits for it.',
        }),
      },
    },
  },
  render: () => <LicenceQuestions defaultValue={[]} />,
  play: async ({ canvasElement }) => {
    const who = within(canvasElement).getByRole('button', { name: 'Who needs a licence' })
    const rest = getComputedStyle(who)
    await expect(rest.textDecorationLine).toBe('none')
    await expect(resolveColor(rest.backgroundColor).a).toBe(0)

    await userEvent.tab()
    await expect(who).toHaveFocus()
    await expect(getComputedStyle(who).textDecorationLine).toContain('underline')
    await waitFor(() => expect(resolveColor(getComputedStyle(who).backgroundColor).a).toBe(1))
  },
}

// ─── 1.4.3 / 1.4.11 — Contrast ────────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Contrast (Minimum) — 1.4.3 / 1.4.11',
  parameters: {
    wcag: ['1.4.3', '1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['1.4.3', '1.4.11'],
          why: 'The trigger text is the question a reader scans for, and the chevron is the only cue that an item opens. The text needs 4.5:1 and the chevron 3:1 against the surface they sit on — including the grey band.',
          how: 'All three variants are rendered with their first item open. The play() measures every trigger’s text and every visible chevron against the colour actually painted behind it.',
          caveat:
            'The band variant’s grey is a translucent tint, so it is composited over the page before measuring rather than read on its own. Light mode only: in dark mode the band trigger text measures 4.34:1, below 4.5:1.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-8'>
      <LicenceQuestions />
      <LicenceQuestions variant='accent' />
      <LicenceQuestions variant='band' />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const trigger of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="accordion-trigger"]',
    )) {
      const variant = trigger.closest('[data-slot="accordion"]')!.getAttribute('data-variant')
      const background = paintedBackground(trigger)
      expectContrast(getComputedStyle(trigger).color, background, {
        label: `${variant}: “${trigger.textContent}”`,
      })
      for (const icon of trigger.querySelectorAll<SVGElement>(
        '[data-slot="accordion-trigger-icon"]',
      )) {
        if (getComputedStyle(icon).display === 'none') continue
        expectContrast(getComputedStyle(icon).color, background, {
          minimum: 3,
          label: `${variant}: chevron on “${trigger.textContent}”`,
        })
      }
    }
  },
}

export const ContrastMinimum: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 / 1.4.11',
}

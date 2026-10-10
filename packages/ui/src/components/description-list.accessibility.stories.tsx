/**
 * DescriptionList — Accessibility
 *
 * One story per WCAG 2.2 criterion a description list has to meet, each
 * asserting it in play(). It is native <dl>/<dt>/<dd> markup, so the pairing
 * of each term with its detail comes from the platform; these pin that it
 * survives every layout and that both inks read on the page.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { DescriptionDetails, DescriptionList, DescriptionTerm } from './description-list.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/DescriptionList/Accessibility',
  component: DescriptionList,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DescriptionList>

export default meta

type Story = StoryObj<typeof meta>

const FACTS = [
  { term: 'Reference number', detail: 'WWC-2210-4471' },
  { term: 'Submitted', detail: '12 September 2026' },
  { term: 'Status', detail: 'In review' },
] as const

const layouts = ['stacked', 'columns', 'inline'] as const

function EveryLayout() {
  return (
    <div className='space-y-8 bg-background p-6'>
      {layouts.map((layout) => (
        <DescriptionList key={layout} layout={layout} aria-label={`Application (${layout})`}>
          {FACTS.map(({ term, detail }) => (
            <div key={term}>
              <DescriptionTerm>{term}</DescriptionTerm>
              <DescriptionDetails>{detail}</DescriptionDetails>
            </div>
          ))}
        </DescriptionList>
      ))}
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
          why: 'Laid out side by side, a term and its detail look paired; a screen reader only knows they are if the markup says so. A list of styled divs reads as unrelated lines.',
          how: 'The same facts in each layout, each pair wrapped in a div. The play() reads every list through the accessibility tree: one term and one definition per fact, in order, each definition straight after its own term.',
          caveat:
            'The div wrapper around each pair is valid inside a dl and keeps these roles; leaving it out keeps them too, but lets columns and inline split pairs visually where a row wraps.',
        }),
      },
    },
  },
  render: () => <EveryLayout />,
  play: async ({ canvasElement }) => {
    for (const layout of layouts) {
      const list = canvasElement.querySelector<HTMLElement>(
        `[aria-label="Application (${layout})"]`,
      )!
      await expect(list.tagName).toBe('DL')
      const terms = within(list).getAllByRole('term')
      const definitions = within(list).getAllByRole('definition')
      await expect(terms.map((term) => term.textContent)).toEqual(FACTS.map((fact) => fact.term))
      await expect(definitions.map((detail) => detail.textContent)).toEqual(
        FACTS.map((fact) => fact.detail),
      )
      for (const [index, term] of terms.entries()) {
        await expect(term.nextElementSibling).toBe(definitions[index])
      }
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'Terms are set in the muted ink so the details lead. Muted is still body text, and must clear 4.5:1 like the details.',
          how: 'The facts in every layout on the page. The play() measures each term and each detail against the page background.',
          caveat:
            'Measured on the page surface. Inside a Card the surface is the card’s, which is the same white in light mode.',
        }),
      },
    },
  },
  render: () => <EveryLayout />,
  play: async ({ canvasElement }) => {
    const page = getComputedStyle(canvasElement.firstElementChild!).backgroundColor
    const parts = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="description-term"], [data-slot="description-details"]',
    )
    await expect(parts).toHaveLength(layouts.length * FACTS.length * 2)
    for (const part of parts) {
      expectContrast(getComputedStyle(part).color, page, { label: `"${part.textContent}"` })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

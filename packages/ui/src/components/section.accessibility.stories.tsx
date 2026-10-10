/**
 * Section — Accessibility
 *
 * One story per WCAG 2.2 criterion a page band has to meet, each asserting it
 * in play(). Section renders a `<section>`, which is only a `region` landmark
 * once it has an accessible name — and it never invents one. These pin both
 * halves of that contract.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Container } from './container.js'
import { Section } from './section.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Section/Accessibility',
  component: Section,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Section>

export default meta

type Story = StoryObj<typeof meta>

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A band people can jump to has to tell them what it is. A named section is exposed as a region with that name, so it appears in a screen reader’s landmark list as “Who can apply, region”.',
          how: 'One section is named by its heading with labelledBy, the other by aria-label. The play() finds each as a region by its name, and asserts the heading-named one points at a heading that exists.',
          caveat:
            'Prefer labelledBy pointing at a visible heading, so sighted and screen reader users get the same name. Use aria-label only for a band with no heading.',
        }),
      },
    },
  },
  render: () => (
    <>
      <Section spacing='tight' divider labelledBy='a11y-eligibility-heading'>
        <Container>
          <h2 id='a11y-eligibility-heading' className='text-xl font-bold'>
            Who can apply
          </h2>
          <p className='mt-2 text-muted-foreground'>You must be 18 or older and live in NSW.</p>
        </Container>
      </Section>
      <Section spacing='tight' aria-label='Related services'>
        <Container>
          <p className='text-muted-foreground'>Working with Children Check renewals.</p>
        </Container>
      </Section>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const eligibility = canvas.getByRole('region', { name: 'Who can apply' })
    await expect(eligibility).toHaveAttribute('aria-labelledby', 'a11y-eligibility-heading')
    await expect(canvas.getByRole('heading', { level: 2, name: 'Who can apply' })).toHaveAttribute(
      'id',
      'a11y-eligibility-heading',
    )
    await expect(canvas.getByRole('region', { name: 'Related services' })).toBeVisible()
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
          why: 'Landmarks only help when each one means something. A page of bands that all became unnamed regions would fill the landmark list with entries nobody can tell apart, so an unnamed Section must stay a plain grouping.',
          how: 'Two sections sit side by side: one named, one not. The play() asserts only the named one is a region, and that the unnamed one is still a <section> element in the DOM, carrying no name.',
          caveat:
            'Section never generates a name from its content. A band that should be a landmark needs labelledBy or aria-label; one that should not needs neither.',
        }),
      },
    },
  },
  render: () => (
    <>
      <Section spacing='tight' divider labelledBy='a11y-fees-heading'>
        <Container>
          <h2 id='a11y-fees-heading' className='text-xl font-bold'>
            Fees
          </h2>
        </Container>
      </Section>
      <Section spacing='tight' data-testid='unnamed'>
        <Container>
          <p className='text-muted-foreground'>Last updated 2 October.</p>
        </Container>
      </Section>
    </>
  ),
  play: async ({ canvasElement }) => {
    const regions = within(canvasElement).getAllByRole('region')
    await expect(regions).toHaveLength(1)
    await expect(regions[0]).toHaveAccessibleName('Fees')

    const unnamed = canvasElement.querySelector<HTMLElement>('[data-testid="unnamed"]')!
    await expect(unnamed.tagName).toBe('SECTION')
    await expect(unnamed).not.toHaveAttribute('aria-labelledby')
    await expect(unnamed).not.toHaveAttribute('aria-label')
  },
}

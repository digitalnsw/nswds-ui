/**
 * Container — Accessibility
 *
 * One story per WCAG 2.2 criterion a page column has to meet, each asserting
 * it in play(). Container is a presentational `<div>` that sets a maximum
 * width and side padding: it must add nothing to the accessibility tree and
 * must not change the order content is read or tabbed in.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Container } from './container.js'
import { Link } from './link.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Container/Accessibility',
  component: Container,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'Landmarks and headings are how screen reader users move around a page. A layout column that added a landmark of its own would put an unnamed region in that list for every band of the page.',
          how: 'A main landmark holds a Container with a heading and a paragraph. The play() asserts the only landmark is the main, the heading is still a level-2 heading inside it, and the Container is a plain div with no role.',
          caveat:
            'Container never names or exposes anything. Put the landmark — main, a named Section — around it, and the headings inside it.',
        }),
      },
    },
  },
  render: () => (
    <main className='py-6'>
      <Container size='narrow'>
        <h2 className='text-2xl font-bold'>Seniors Energy Rebate</h2>
        <p className='mt-3 text-muted-foreground'>
          Eligible seniors can get help with the cost of their electricity bill.
        </p>
      </Container>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const main = canvas.getByRole('main')
    await expect(canvas.queryAllByRole('region')).toHaveLength(0)

    const container = main.querySelector<HTMLElement>('[data-slot="container"]')!
    await expect(container.tagName).toBe('DIV')
    await expect(container).not.toHaveAttribute('role')
    await expect(
      within(container).getByRole('heading', { level: 2, name: 'Seniors Energy Rebate' }),
    ).toBeVisible()
  },
}

// ─── 2.4.3 — Focus Order ──────────────────────────────────────────────────────

export const FocusOrder: Story = {
  name: 'Focus Order — 2.4.3',
  parameters: {
    wcag: ['2.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.3',
          why: 'Focus has to move through a page in an order that matches what people see. Centring a column with margins and padding must not move anything visually away from where it sits in the source.',
          how: 'A centred Container holds three links in a row. The play() tabs through them and asserts each one receives focus in source order and sits to the right of the one before.',
          caveat:
            'Container only pads and centres; it never reorders. Layout inside it — flex-row-reverse, order-*, grid placement — can, and is the consumer’s to check.',
        }),
      },
    },
  },
  render: () => (
    <Container size='contained' className='py-6'>
      <nav aria-label='Popular services' className='flex gap-6'>
        <Link href='#licences'>Licences</Link>
        <Link href='#rebates'>Rebates</Link>
        <Link href='#transport'>Transport</Link>
      </nav>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    let previousLeft = -Infinity
    for (const link of links) {
      await userEvent.tab()
      await expect(link).toHaveFocus()
      const { left } = link.getBoundingClientRect()
      await expect(left).toBeGreaterThan(previousLeft)
      previousLeft = left
    }
  },
}

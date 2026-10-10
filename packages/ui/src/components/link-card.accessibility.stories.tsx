/**
 * LinkCard — Accessibility
 *
 * One story per WCAG 2.2 criterion a link card has to meet, each asserting it
 * in play(). The card is one anchor stretched over a Card with an ::after
 * overlay: one tab stop, named by the title, with the focus ring drawn on the
 * card because the anchor itself is only a line of text.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { LinkCard } from './link-card.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/LinkCard/Accessibility',
  component: LinkCard,
  parameters: { layout: 'padded' },
  args: { href: '#fishing-licence', title: 'Get a fishing licence' },
} satisfies Meta<typeof LinkCard>

export default meta

type Story = StoryObj<typeof meta>

function FishingCards() {
  return (
    <div className='grid max-w-3xl gap-6 bg-background p-6 sm:grid-cols-2'>
      <LinkCard
        href='#fishing-licence'
        label='Licences'
        title='Get a fishing licence'
        description='Buy a recreational fishing licence online.'
      />
      <LinkCard
        href='https://www.service.nsw.gov.au'
        external
        label='Services'
        title='Service NSW'
        description='Transactions and services across NSW Government.'
      />
    </div>
  )
}

const cards = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="link-card"]'))

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A card that is a link must be announced as one link, named for where it goes — not as a heading, a paragraph and an arrow, and not as several links to the same place.',
          how: 'An internal and an external card. The play() asserts each card holds exactly one link, named by its title, and that the external one says it opens in a new tab and has target="_blank".',
          caveat:
            'The label and description are not part of the link’s name; they are read as the surrounding text. Keep the title enough on its own to say where the link goes.',
        }),
      },
    },
  },
  render: () => <FishingCards />,
  play: async ({ canvasElement }) => {
    const [internal, external] = cards(canvasElement)

    const internalLinks = within(internal!).getAllByRole('link')
    await expect(internalLinks).toHaveLength(1)
    await expect(internalLinks[0]).toHaveAccessibleName('Get a fishing licence')

    const externalLinks = within(external!).getAllByRole('link')
    await expect(externalLinks).toHaveLength(1)
    await expect(externalLinks[0]).toHaveAccessibleName(/^Service NSW.*opens in a new tab/i)
    await expect(externalLinks[0]).toHaveAttribute('target', '_blank')
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
          why: 'A keyboard user reaches the card the way a mouse user clicks it: one Tab, one Enter.',
          how: 'Tab once: focus lands on the internal card’s link. Press Enter: the link is activated (the play() catches the click and cancels the navigation). Tab again: focus moves straight to the next card — the card adds no other stops.',
          caveat:
            'Anything interactive placed inside the card as children would add a stop under the stretched anchor; the docs say not to.',
        }),
      },
    },
  },
  render: () => <FishingCards />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const internal = canvas.getByRole('link', { name: 'Get a fishing licence' })
    await expect(internal).toHaveFocus()

    // Enter fires the link's activation; the navigation itself is cancelled so
    // the test page stays put.
    const followed = new Promise<string>((resolve) =>
      internal.addEventListener(
        'click',
        (event) => {
          event.preventDefault()
          resolve(internal.getAttribute('href') ?? '')
        },
        { once: true },
      ),
    )
    await userEvent.keyboard('{Enter}')
    await expect(await followed).toBe('#fishing-licence')

    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: /^Service NSW/ })).toHaveFocus()
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
          why: 'The focused element is a line of title text, but the target is the whole card; the indicator has to show the card.',
          how: 'Tab to the first card. The play() asserts the anchor draws no outline of its own and the card draws a 2px ring instead (focus-within), and that the ring goes when focus moves on.',
          caveat:
            'The ring is a box-shadow in the ring token. In forced-colours mode box-shadows are dropped; the card relies on the system focus treatment there.',
        }),
      },
    },
  },
  render: () => <FishingCards />,
  play: async ({ canvasElement }) => {
    const [first] = cards(canvasElement)
    const resting = getComputedStyle(first!).boxShadow

    await userEvent.tab()
    const anchor = within(first!).getByRole('link')
    await expect(anchor).toHaveFocus()
    await expect(getComputedStyle(anchor).outlineStyle).toBe('none')

    // The card transitions all properties, so the ring is read once it has settled.
    await waitFor(() => expect(getComputedStyle(first!).boxShadow).toMatch(/ 0px 0px 0px 2px/))

    await userEvent.tab()
    await waitFor(() => expect(getComputedStyle(first!).boxShadow).toBe(resting))
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSize: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'The visible link is a single line of text, but a reader will tap anywhere on the card. The whole surface has to be the target.',
          how: 'The play() hit-tests points near each corner of the card and at its centre, and asserts every one lands on the card’s link — the stretched ::after overlay covers the card.',
          caveat:
            'Text inside the card sits under the overlay, which is why it is not drag-selectable.',
        }),
      },
    },
  },
  render: () => <FishingCards />,
  play: async ({ canvasElement }) => {
    for (const card of cards(canvasElement)) {
      const anchor = within(card).getByRole('link')
      const { left, top, right, bottom, width, height } = card.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(24)
      await expect(height).toBeGreaterThanOrEqual(24)
      const points = [
        [left + 4, top + 4],
        [right - 4, top + 4],
        [left + 4, bottom - 4],
        [right - 4, bottom - 4],
        [left + width / 2, top + height / 2],
      ] as const
      for (const [x, y] of points) {
        await expect(document.elementFromPoint(x, y)).toBe(anchor)
      }
    }
  },
}

// ─── 1.1.1 — Non-text Content ─────────────────────────────────────────────────

export const NonTextContent: Story = {
  name: 'Non-text Content — 1.1.1',
  parameters: {
    wcag: ['1.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.1.1',
          why: 'The corner arrow repeats what the link already says. Exposed, it would add an unnamed image to every card.',
          how: 'An internal and an external card. The play() asserts the arrow is aria-hidden in both, and that the external card says “opens in a new tab” in text rather than through its outward arrow.',
          caveat:
            'The arrow’s direction is the only visual cue that a link leaves the site; the spoken cue comes from ExternalLink.',
        }),
      },
    },
  },
  render: () => <FishingCards />,
  play: async ({ canvasElement }) => {
    for (const card of cards(canvasElement)) {
      await expect(card.querySelector('[data-slot="link-card-icon"]')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
      await expect(within(card).queryAllByRole('img')).toHaveLength(0)
    }
    const external = cards(canvasElement)[1]!
    await expect(within(external).getByRole('link')).toHaveTextContent(/opens in a new tab/i)
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
          why: 'The label and description are set in the muted ink; with the title they must all clear 4.5:1 on the card.',
          how: 'An internal and an external card. The play() measures the label, title and description of each against the card’s own surface.',
          caveat:
            'On hover the title turns primary; that pair is the same as Link’s and is measured there.',
        }),
      },
    },
  },
  render: () => <FishingCards />,
  play: async ({ canvasElement }) => {
    for (const card of cards(canvasElement)) {
      const surface = getComputedStyle(card).backgroundColor
      for (const slot of ['link-card-label', 'link-card-title', 'link-card-description']) {
        const part = card.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!
        expectContrast(getComputedStyle(part).color, surface, { label: slot })
      }
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

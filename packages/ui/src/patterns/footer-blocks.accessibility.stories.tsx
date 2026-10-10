/**
 * FooterBlocks — Accessibility
 *
 * One story per WCAG 2.2 criterion the footer blocks have to meet, each
 * asserting it in play(). Every block is built on the published Footer, so
 * the landmark, the ink-derived link colours and the focus ring come from it;
 * these pin what a consumer relies on when they install a block — the
 * structure of the site map, the names of the icon-only links, readable text
 * on every surface, and the newsletter form's label and status message.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import type { FooterColor } from '../components/footer.js'

import { expectContrast, wcagStoryMeta } from '../components/story-helpers.js'
import { IconLinkedIn, IconX, IconYouTube } from '../icons/brands/index.js'
import { FooterCompact } from './footer-compact.js'
import { FooterNewsletter } from './footer-newsletter.js'
import { FooterSimpleCentred } from './footer-simple-centred.js'
import { FooterSitemap } from './footer-sitemap.js'

const socialLinks = [
  { name: 'LinkedIn', href: '#linkedin', icon: IconLinkedIn },
  { name: 'X', href: '#x', icon: IconX },
  { name: 'YouTube', href: '#youtube', icon: IconYouTube },
]

// Pinned so Chromatic snapshots don't churn every new year.
const shared = { socialLinks, year: 2026 }

const allColors: FooterColor[] = [
  'white',
  'grey-200',
  'grey-400',
  'grey-600',
  'grey-800',
  'primary-200',
  'primary-400',
  'primary-600',
  'primary-800',
  'accent-200',
  'accent-400',
  'accent-600',
  'accent-800',
]

const meta = {
  title: 'Patterns/FooterBlocks/Accessibility',
  component: FooterSitemap,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FooterSitemap>

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
          why: 'A screen reader user moves through a footer by landmark, heading and list. The structure a sighted reader sees — a site map of headed columns, then a row of legal links — has to be in the markup too.',
          how: 'Inspect the site-map block: a footer landmark holding one "Site map" navigation, each column a level-2 heading over a list of links, and the legal links in a second navigation named "Footer". The play() asserts each.',
          caveat:
            'Column headings default to level 2, right when the footer sits at the top of the outline; FooterNavColumn takes a headingLevel when the page nests it deeper. One landmark for the whole site map, not one per column, keeps the landmark list short.',
        }),
      },
    },
  },
  render: () => <FooterSitemap {...shared} />,
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    const siteMap = within(footer).getByRole('navigation', { name: 'Site map' })
    const headings = within(siteMap).getAllByRole('heading', { level: 2 })
    const lists = within(siteMap).getAllByRole('list')
    await expect(headings).toHaveLength(4)
    await expect(lists).toHaveLength(headings.length)
    for (const list of lists) {
      await expect(within(list).getAllByRole('link').length).toBeGreaterThan(0)
    }
    const legal = within(footer).getByRole('navigation', { name: 'Footer' })
    await expect(within(legal).getByRole('link', { name: 'Privacy' })).toBeInTheDocument()
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
          why: 'The social links are icons with no visible text, and the logo is a picture of words. Without text alternatives a screen reader announces three unnamed links and skips who owns the site.',
          how: 'Inspect the simple-centred block: each social link is named "Follow us on …", the logo carries the hidden text "NSW Government", and every icon is either hidden from assistive technology or inside a link whose name replaces it, so nothing is announced twice. The play() asserts all three.',
          caveat:
            'The names come from each socialLinks item: "Follow us on" plus its name, or its own label when you pass one. Name channels the way people know them.',
        }),
      },
    },
  },
  render: () => <FooterSimpleCentred {...shared} />,
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    for (const { name } of socialLinks) {
      await expect(
        within(footer).getByRole('link', { name: `Follow us on ${name}` }),
      ).toBeInTheDocument()
    }
    await expect(within(footer).getByText('NSW Government')).toBeInTheDocument()
    // Every glyph is either hidden or inside a control whose aria-label names
    // it (which replaces the glyph's content in the name), so none is read out.
    for (const svg of footer.querySelectorAll('svg:not([aria-hidden="true"])')) {
      await expect(svg.closest('[aria-label]')).not.toBeNull()
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  name: 'Contrast (Minimum) — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'Footer text is small — the copyright line and legal links — and every block can sit on any of thirteen surfaces, so each pair has to clear 4.5:1 on its own.',
          how: 'The compact bar is rendered on all thirteen surfaces. The play() measures the copyright text and the first link against each footer’s background with the same contrast maths axe uses.',
          caveat:
            'Text and links take the surface’s ink, so a block inherits the result. The 600 steps of primary and accent clear AA but not AAA; prefer the 800 steps where a service is held to AAA.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      {allColors.map((color) => (
        <FooterCompact key={color} {...shared} color={color} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const footers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="footer"]')
    await expect(footers).toHaveLength(allColors.length)
    for (const footer of footers) {
      const surface = getComputedStyle(footer).backgroundColor
      const colour = footer.dataset.color
      const text = footer.querySelector<HTMLElement>('[data-slot="footer-small-print"] p')
      const link = footer.querySelector<HTMLElement>('nav a')
      if (!text || !link) throw new Error(`Expected small print and a link on ${colour}.`)
      expectContrast(getComputedStyle(text).color, surface, {
        label: `Copyright text on ${colour}`,
      })
      expectContrast(getComputedStyle(link).color, surface, { label: `Link on ${colour}` })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
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
          why: 'A footer is a long run of links; a keyboard user tabbing through it has to see which one has focus.',
          how: 'Tab into the site map: the first link takes a 2px outline in the surface’s ink. The play() asserts a solid outline of non-zero width, and that its colour clears 3:1 against the footer.',
          caveat:
            'The ring is drawn in the footer ink, so it follows the surface — it is measured here on primary-800, where a ring in the page’s usual colour would vanish.',
        }),
      },
    },
  },
  render: () => <FooterSitemap {...shared} color='primary-800' />,
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    const first = within(footer).getAllByRole('link')[0]!
    while (document.activeElement !== first) {
      await userEvent.tab()
      if (!canvasElement.contains(document.activeElement)) {
        throw new Error('Tabbing left the canvas without reaching the first footer link.')
      }
    }
    const style = getComputedStyle(first)
    await expect(style.outlineStyle).not.toBe('none')
    await expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0)
    // The link's colour transition also runs on outline-color, so the ring is
    // measured once it has settled rather than mid-fade.
    const surface = getComputedStyle(footer).backgroundColor
    await waitFor(() =>
      expectContrast(getComputedStyle(first).outlineColor, surface, {
        minimum: 3,
        label: 'Focus ring on primary-800',
      }),
    )
  },
}

// ─── 3.3.2 — Labels or Instructions ───────────────────────────────────────────

export const LabelsOrInstructions: Story = {
  name: 'Labels or Instructions — 3.3.2',
  parameters: {
    wcag: ['3.3.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '3.3.2',
          why: 'The newsletter field asks for an email address in a footer full of links; its visible label and the line under it say what it is for and what the reader is signing up to.',
          how: 'Inspect the field: its accessible name is the visible label "Subscribe to updates", and the note underneath is its accessible description. The play() asserts both.',
          caveat:
            'Field links the label and description to the input itself. Put your privacy collection notice in the description too — collecting an email makes this a collection point under the PPIP Act.',
        }),
      },
    },
  },
  render: () => <FooterNewsletter {...shared} onSubscribe={() => Promise.resolve()} />,
  play: async ({ canvasElement }) => {
    const email = within(canvasElement).getByRole('textbox', { name: 'Subscribe to updates' })
    await expect(email).toHaveAttribute('type', 'email')
    await expect(email).toHaveAccessibleDescription(
      expect.stringContaining('Occasional updates about this service.'),
    )
  },
}

// ─── 4.1.3 — Status Messages ──────────────────────────────────────────────────

export const StatusMessages: Story = {
  name: 'Status Messages — 4.1.3',
  parameters: {
    wcag: ['4.1.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.3',
          why: 'After subscribing, the outcome is a line of text near the button; a screen reader user has to hear it without focus being moved to it.',
          how: 'Enter an address and choose Subscribe. The message lands in a polite status region that was on the page, empty, before the submit. The play() asserts the empty region first, then the message.',
          caveat:
            'The region is persistent rather than mounted with its text, because a live region that appears together with its message is not reliably announced. Success and failure share it, so a failed sign-up does not interrupt the reader.',
        }),
      },
    },
  },
  render: () => <FooterNewsletter {...shared} onSubscribe={() => Promise.resolve()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByRole('status')
    await expect(status).toHaveAttribute('aria-live', 'polite')
    await expect(status).toBeEmptyDOMElement()

    await userEvent.type(canvas.getByRole('textbox', { name: 'Subscribe to updates' }), 'a@b.au')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
    await waitFor(() => expect(status).toHaveTextContent('check your inbox'))
  },
}

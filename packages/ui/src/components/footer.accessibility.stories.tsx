/**
 * Footer — Accessibility
 *
 * One story per WCAG 2.2 criterion the footer has to meet, each asserting it
 * in play(). People reach the footer looking for something specific — privacy,
 * accessibility, contact — so these pin the structure they navigate by, the
 * names of the icon-only links, a keyboard path through every link, a visible
 * focus ring and readable text on every one of the thirteen surfaces.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { IconFacebook, IconLinkedIn, IconYouTube } from '../icons/brands/index.js'
import { Footer, footerColors, FooterNav, FooterNavColumn } from './footer.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Footer/Accessibility',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

const legalLinks = [
  { name: 'Accessibility statement', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Contact us', href: '#contact' },
]

const socialLinks = [
  { name: 'Facebook', href: '#facebook', icon: IconFacebook },
  { name: 'LinkedIn', href: '#linkedin', icon: IconLinkedIn },
  { name: 'YouTube', href: '#youtube', icon: IconYouTube },
]

const siteMap = [
  {
    heading: 'Fishing',
    links: [
      { name: 'Recreational fishing licence', href: '#licence' },
      { name: 'Size and bag limits', href: '#limits' },
    ],
  },
  {
    heading: 'Farming',
    links: [
      { name: 'Drought support', href: '#drought' },
      { name: 'Grants and funding', href: '#grants' },
    ],
  },
]

const department = 'Department of Primary Industries'

/** A full footer: site map, acknowledgement, legal links, small print, social links. */
function SiteFooter({ color = 'white' }: { color?: (typeof footerColors)[number] }) {
  return (
    <Footer
      color={color}
      department={department}
      legalLinks={legalLinks}
      socialLinks={socialLinks}
      year={2026}
    >
      <FooterNav>
        {siteMap.map((column) => (
          <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
        ))}
      </FooterNav>
    </Footer>
  )
}

const allLinks = (footer: HTMLElement) => within(footer).getAllByRole('link')

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: "A screen reader user jumps to the footer by landmark and then has to find one link among many. The site map's columns and the legal row only help if their grouping is in the markup, not just the layout.",
          how: 'List landmarks: "contentinfo", and inside it two navigation landmarks, "Site map" and "Footer". Move by heading inside the site map: each column is a heading followed by its list of links. The social links are a list. The play() asserts every one of those.',
          caveat:
            'Column headings are h2. When the footer sits under another heading, step them down with headingLevel so the outline stays in order.',
        }),
      },
    },
  },
  render: () => <SiteFooter />,
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    const siteMapNav = within(footer).getByRole('navigation', { name: 'Site map' })
    await expect(within(footer).getByRole('navigation', { name: 'Footer' })).toBeInTheDocument()
    const headings = within(siteMapNav).getAllByRole('heading', { level: 2 })
    await expect(headings.map((h) => h.textContent)).toEqual(siteMap.map((c) => c.heading))
    for (const [index, heading] of headings.entries()) {
      const list = heading.nextElementSibling as HTMLElement
      await expect(list).toHaveRole('list')
      await expect(within(list).getAllByRole('listitem')).toHaveLength(siteMap[index]!.links.length)
    }
    const social = footer.querySelector('[data-slot="footer-social-link"]')!
    await expect(social.closest('ul')).toHaveRole('list')
  },
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'The social links are icons with no visible text, so their whole meaning to a screen reader is the name they are given.',
          how: 'Read the small print row: links named "Follow us on Facebook", "Follow us on LinkedIn" and "Follow us on YouTube". The play() asserts each is a link with exactly that name, and that it holds the brand mark and no text — so the aria-label is the only name it has.',
          caveat:
            "The name is built from each item's name. Pass label on an item when a channel needs different wording.",
        }),
      },
    },
  },
  render: () => <SiteFooter />,
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    for (const { name } of socialLinks) {
      const link = within(footer).getByRole('link', { name: `Follow us on ${name}` })
      // The name is all there is: the link holds a mark and no text.
      await expect(link).toHaveAccessibleName(`Follow us on ${name}`)
      await expect(link.textContent?.trim()).toBe('')
      await expect(link.querySelector('svg')).toBeInTheDocument()
    }
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Every link in the footer has to be reachable without a pointer, in the order it reads.',
          how: 'Tab from the top of the footer: the site map, column by column, then the legal links, then the social links. The play() tabs through every link and asserts each stop in turn.',
          caveat: 'Nothing in the footer is focusable except its links.',
        }),
      },
    },
  },
  render: () => <SiteFooter />,
  play: async ({ canvasElement }) => {
    const links = allLinks(within(canvasElement).getByRole('contentinfo'))
    await expect(links).toHaveLength(
      siteMap.flatMap((c) => c.links).length + legalLinks.length + socialLinks.length,
    )
    for (const link of links) {
      await userEvent.tab()
      await expect(link).toHaveFocus()
    }
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'A dense footer puts many links side by side, so a keyboard user needs a clear mark on the focused one — on whatever surface the service chose.',
          how: "Tab through a white footer and a primary-800 one: every link draws a 2px ring in the footer's ink. The play() asserts the ring on every link and measures it against the footer at 3:1.",
          caveat:
            'The ring is drawn in --footer-ink, the same colour the text uses, so it contrasts on every one of the thirteen surfaces by construction.',
        }),
      },
    },
  },
  render: () => (
    <>
      <SiteFooter color='white' />
      <SiteFooter color='primary-800' />
    </>
  ),
  play: async ({ canvasElement }) => {
    for (const footer of canvasElement.querySelectorAll<HTMLElement>('[data-slot="footer"]')) {
      const surface = getComputedStyle(footer).backgroundColor
      for (const link of allLinks(footer)) {
        await userEvent.tab()
        await expect(link).toHaveFocus()
        await waitFor(() => expect(getComputedStyle(link).outlineStyle).not.toBe('none'))
        await expect(parseFloat(getComputedStyle(link).outlineWidth)).toBeGreaterThanOrEqual(2)
        // The links transition their colours, the ring's included, so the
        // ring is measured once it has settled rather than mid-fade.
        await waitFor(() =>
          expectContrast(getComputedStyle(link).outlineColor, surface, {
            minimum: 3,
            label: `Focus ring on "${link.getAttribute('aria-label') ?? link.textContent}" (${footer.dataset.color})`,
          }),
        )
      }
    }
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSize: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Footer links are small and close together, which is where a mistap lands on the wrong page.',
          how: "Every link's own box is measured: text links are 28px tall, the social links a 40px square, all past the 24×24 minimum. The play() asserts every link.",
          caveat:
            'On a coarse pointer each link also gets a 44px touch layer, text and icon alike (The Same-Floor Rule), without the footer growing.',
        }),
      },
    },
  },
  render: () => <SiteFooter />,
  play: async ({ canvasElement }) => {
    for (const link of allLinks(within(canvasElement).getByRole('contentinfo'))) {
      const box = link.getBoundingClientRect()
      await expect(box.height).toBeGreaterThanOrEqual(24)
      await expect(box.width).toBeGreaterThanOrEqual(24)
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: "The footer's text is its smallest, and it comes in thirteen surfaces. Every one has to stay readable.",
          how: 'All thirteen surfaces are shown. The play() measures the acknowledgement, every link and the copyright line on each against its footer, with the same contrast maths axe uses, at 4.5:1.',
          caveat:
            'primary-600 and accent-600 clear AA only (4.57:1 and 5.18:1); the rest clear AAA. The (dark) story measures the dark-mode surfaces, where all thirteen clear AAA.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-2'>
      {footerColors.map((color) => (
        <Footer
          key={color}
          id={`footer-contrast-${color}`}
          color={color}
          department={department}
          legalLinks={legalLinks}
          year={2026}
          topBorder={false}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const footers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="footer"]')
    await expect(footers).toHaveLength(footerColors.length)
    for (const footer of footers) {
      const surface = getComputedStyle(footer).backgroundColor
      const text = footer.querySelectorAll<HTMLElement>(
        '[data-slot="footer-acknowledgement"] p, [data-slot="footer-legal-links"] a, [data-slot="footer-small-print"] p',
      )
      await expect(text.length).toBe(legalLinks.length + 2)
      for (const el of text) {
        expectContrast(getComputedStyle(el).color, surface, {
          label: `"${el.textContent?.slice(0, 30)}" on ${footer.dataset.color}`,
        })
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

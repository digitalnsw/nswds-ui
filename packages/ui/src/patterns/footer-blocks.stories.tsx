/**
 * Footer blocks — a range of eight ready-made footers to choose from.
 *
 * Each block is a composed pattern built on the published `Footer` component,
 * so all eight inherit its thirteen surface colours, dark-mode mapping,
 * ink-derived link/border/hover treatment and acknowledgement of Country. They
 * are worked examples: copy the source and adapt it, rather than treating them
 * as black-box components.
 *
 * Start at the `Chooser` story for a side-by-side comparison.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'

import type { FooterColor } from '../components/footer.js'

import { FooterAccordion } from './footer-accordion.js'
import { FooterCompact } from './footer-compact.js'
import { FooterContact } from './footer-contact.js'
import { FooterCta } from './footer-cta.js'
import { FooterNewsletter } from './footer-newsletter.js'
import { FooterSimpleCentred } from './footer-simple-centred.js'
import { FooterSitemapBrand } from './footer-sitemap-brand.js'
import { FooterSitemap } from './footer-sitemap.js'

// Brand marks are not part of the NSWDS icon set (Material Symbols), so social
// icons are supplied by the consuming app — the blocks take them as data.
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill='currentColor' viewBox='0 0 24 24' aria-hidden='true' {...props}>
      <path d='M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z' />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill='currentColor' viewBox='0 0 24 24' aria-hidden='true' {...props}>
      <path d='M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z' />
    </svg>
  )
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill='currentColor' viewBox='0 0 24 24' aria-hidden='true' {...props}>
      <path
        fillRule='evenodd'
        d='M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z'
        clipRule='evenodd'
      />
    </svg>
  )
}

const socialLinks = [
  { name: 'LinkedIn', href: '#linkedin', icon: LinkedInIcon },
  { name: 'X', href: '#x', icon: XIcon },
  { name: 'YouTube', href: '#youtube', icon: YouTubeIcon },
]

// Pinned so Chromatic snapshots don't churn every new year.
const year = 2026

const shared = { socialLinks, year }

type Block = {
  id: string
  name: string
  blurb: string
  /** The surface this block is shown on in the Chooser. */
  colour: FooterColor
  render: (props: { color?: FooterColor }) => React.ReactElement
}

const BLOCKS: Block[] = [
  {
    id: 'simple-centred',
    name: 'Simple centred',
    blurb: 'Logo, acknowledgement, links and ownership — all centred. Smallest complete footer.',
    colour: 'white',
    render: (p) => <FooterSimpleCentred {...shared} {...p} />,
  },
  {
    id: 'compact',
    name: 'Compact bar',
    blurb: 'One horizontal row. For embedded tools and admin screens. No acknowledgement.',
    colour: 'grey-200',
    render: (p) => <FooterCompact {...shared} {...p} />,
  },
  {
    id: 'sitemap',
    name: 'Site map',
    blurb: 'Four link columns above the standard footer. The default for a department site.',
    colour: 'white',
    render: (p) => <FooterSitemap {...shared} {...p} />,
  },
  {
    id: 'sitemap-brand',
    name: 'Site map with brand',
    blurb: 'Logo and a one-paragraph mission beside three link columns.',
    colour: 'grey-200',
    render: (p) => <FooterSitemapBrand {...shared} {...p} />,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    blurb: 'Link columns beside an email subscription form.',
    colour: 'white',
    render: (p) => <FooterNewsletter {...shared} {...p} />,
  },
  {
    id: 'contact',
    name: 'Contact details',
    blurb: 'Phone, email, address and hours in an <address>, beside the site map.',
    colour: 'grey-200',
    render: (p) => <FooterContact {...shared} {...p} />,
  },
  {
    id: 'cta',
    name: 'Call to action',
    blurb: 'A prominent action band above the site map.',
    colour: 'primary-800',
    render: (p) => <FooterCta {...shared} {...p} />,
  },
  {
    id: 'accordion',
    name: 'Collapsible site map',
    blurb: 'A long site map that collapses to accordions below lg and lays out as columns above.',
    colour: 'white',
    render: (p) => <FooterAccordion {...shared} {...p} />,
  },
]

const meta = {
  title: 'Patterns/Footer blocks',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Eight ready-made footers built on the published Footer component. Copy-and-adapt blocks — not published components.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function BlockCard({ block }: { block: Block }) {
  return (
    <section className='overflow-hidden rounded-sm border border-border'>
      <header className='space-y-1 border-b border-border bg-muted px-4 py-3'>
        <h2 className='text-sm font-bold text-foreground'>{block.name}</h2>
        <p className='text-sm text-muted-foreground'>{block.blurb}</p>
      </header>
      {block.render({ color: block.colour })}
    </section>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** All eight side by side — the story to open when picking one. */
export const Chooser: Story = {
  render: () => (
    <div className='space-y-6 p-4'>
      {BLOCKS.map((block) => (
        <BlockCard key={block.id} block={block} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const footers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="footer"]')
    if (footers.length !== BLOCKS.length) {
      throw new Error(`Expected ${BLOCKS.length} footer blocks, got ${footers.length}.`)
    }

    for (const footer of footers) {
      if (footer.tagName !== 'FOOTER') {
        throw new Error(`Every block must render a <footer> landmark, got <${footer.tagName}>.`)
      }
      // The whole point of building on Footer: the ink token must resolve, or
      // every derived colour in the block silently falls back to unset.
      const ink = getComputedStyle(footer).getPropertyValue('--footer-ink').trim()
      if (!ink) {
        throw new Error('Expected every block to inherit a resolved --footer-ink from Footer.')
      }
    }

    // Compact is the one block that deliberately omits acknowledgement of
    // Country; every other block must carry it. This guards against a future
    // edit quietly dropping it from one of them.
    const withAcknowledgement = [...footers].filter((f) =>
      f.textContent?.includes('Traditional Custodians'),
    )
    if (withAcknowledgement.length !== BLOCKS.length - 1) {
      throw new Error(
        `Expected ${BLOCKS.length - 1} blocks to carry acknowledgement of Country, got ${withAcknowledgement.length}.`,
      )
    }
  },
}

export const SimpleCentred: Story = {
  name: 'Simple centred',
  render: () => <FooterSimpleCentred {...shared} />,
}

export const Compact: Story = {
  name: 'Compact bar',
  render: () => <FooterCompact {...shared} color='grey-200' />,
}

export const Sitemap: Story = {
  name: 'Site map',
  render: () => <FooterSitemap {...shared} />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-slot="footer-nav"]')
    if (!nav) {
      throw new Error('Expected a [data-slot="footer-nav"] landmark.')
    }
    if (nav.querySelectorAll('[data-slot="footer-nav-column"]').length !== 4) {
      throw new Error('Expected four site-map columns.')
    }
    // One landmark for the whole site map, not one per column.
    if (nav.querySelectorAll('nav').length !== 0) {
      throw new Error('Expected columns to be headed lists, not nested nav landmarks.')
    }
  },
}

export const SitemapBrand: Story = {
  name: 'Site map with brand',
  render: () => <FooterSitemapBrand {...shared} color='grey-200' />,
}

export const Newsletter: Story = {
  name: 'Newsletter',
  render: () => <FooterNewsletter {...shared} />,
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="email"]')
    if (!input) {
      throw new Error('Expected an email input.')
    }
    // A placeholder is not an accessible name — the Field must supply a label.
    const id = input.getAttribute('id')
    const label = id ? canvasElement.querySelector(`label[for="${id}"]`) : null
    if (!label?.textContent?.trim()) {
      throw new Error('Expected the email input to have an associated, non-empty <label>.')
    }
    if (!input.getAttribute('aria-describedby')) {
      throw new Error('Expected the FieldDescription to be wired via aria-describedby.')
    }
  },
}

export const Contact: Story = {
  name: 'Contact details',
  render: () => <FooterContact {...shared} color='grey-200' />,
  play: async ({ canvasElement }) => {
    const address = canvasElement.querySelector('address')
    if (!address) {
      throw new Error('Expected contact details to sit in an <address> element.')
    }
    if (!address.querySelector('a[href^="tel:"]')) {
      throw new Error('Expected the phone number to be a tel: link.')
    }
    if (!address.querySelector('a[href^="mailto:"]')) {
      throw new Error('Expected the email address to be a mailto: link.')
    }
  },
}

export const Cta: Story = {
  name: 'Call to action',
  render: () => <FooterCta {...shared} color='primary-800' />,
}

export const Accordion: Story = {
  name: 'Collapsible site map',
  render: () => <FooterAccordion {...shared} />,
  play: async ({ canvasElement }) => {
    // The Storybook viewport is desktop-width, so the columns render open and
    // the disclosure buttons are hidden — nothing extra in the tab order.
    const triggers = canvasElement.querySelectorAll<HTMLElement>('button[aria-expanded]')
    if (triggers.length !== 4) {
      throw new Error(`Expected four disclosure buttons in the DOM, got ${triggers.length}.`)
    }
    for (const trigger of triggers) {
      // checkVisibility(), not computed display: `lg:hidden` sits on the
      // wrapping <h2>, so the button's OWN display is still `flex` while the
      // ancestor is what removes it from the page (and the a11y tree).
      if (trigger.checkVisibility()) {
        throw new Error('Expected the disclosure buttons to be hidden at desktop width.')
      }
      // WAI-ARIA accordion pattern: the button sits INSIDE the heading.
      if (trigger.parentElement?.tagName !== 'H2') {
        throw new Error('Expected each disclosure button to be wrapped in an <h2>.')
      }
    }

    // Exactly one heading per column is exposed — the plain desktop <h2>.
    const visibleHeadings = [...canvasElement.querySelectorAll<HTMLElement>('h2')].filter((h) =>
      h.checkVisibility(),
    )
    if (visibleHeadings.length !== 4) {
      throw new Error(
        `Expected four visible column headings at desktop width, got ${visibleHeadings.length}.`,
      )
    }

    // Every link must be present and reachable on desktop — this is what the
    // "render open, collapse in an effect" approach buys, and what a no-JS
    // visitor gets.
    const links = canvasElement.querySelectorAll('[data-slot="footer-nav-link"]')
    if (links.length !== 20) {
      throw new Error(`Expected all 20 site-map links to be rendered, got ${links.length}.`)
    }
  },
}

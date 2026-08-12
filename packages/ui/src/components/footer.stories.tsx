/**
 * Footer — Default + Colours + Sections + Composition + Playground
 *
 * The end-of-page contentinfo landmark: acknowledgement of Country, legal
 * links, ownership and social channels. Every colour variant derives its link,
 * border and hover colours from a single --footer-ink token.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'

import {
  Footer,
  FooterAcknowledgement,
  footerColors,
  FooterLegalLinks,
  FooterNav,
  FooterNavColumn,
  FooterSmallPrint,
  FooterSocialLink,
} from './footer.js'

// Brand marks are not part of the NSWDS icon set (Material Symbols), so social
// icons are supplied by the consuming app. These stand-ins mirror the shape
// consumers pass: a component taking `className` + `data-slot="icon"`.
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

const legalLinks = [
  { name: 'Accessibility statement', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Copyright', href: '#copyright' },
  { name: 'Contact us', href: '#contact' },
]

const socialLinks = [
  { name: 'LinkedIn', href: '#linkedin', icon: LinkedInIcon },
  { name: 'X', href: '#x', icon: XIcon },
  { name: 'YouTube', href: '#youtube', icon: YouTubeIcon },
]

const department = 'Digital NSW, Department of Customer Service'

// The copyright year is pinned so Chromatic snapshots don't churn every new
// year — the same escape hatch consumers use to avoid SSR hydration skew.
const year = 2026

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Footer</h1>
            <p className='text-base text-muted-foreground'>
              The footer closes every page with acknowledgement of Country, supporting links,
              service ownership and any social channels the team actively maintains. Render it once
              in a shared layout, not per page. It is a <code>contentinfo</code> landmark, so there
              should be exactly one per page.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Colours</h2>
            <p className='text-base text-muted-foreground'>
              All thirteen surfaces clear WCAG 2.2 AA (4.5:1) for the footer&rsquo;s smallest text;
              eleven also clear AAA (7:1). The two AA-only pairs are <code>primary-600</code>{' '}
              (4.57:1) and <code>accent-600</code> (5.18:1) — prefer the <code>-800</code> steps for
              a service held to AAA. Link, border and hover colours all derive from the
              surface&rsquo;s <code>--footer-ink</code>, so a new surface only needs that one token.
            </p>
            <div className='space-y-4'>
              {footerColors.map((color) => (
                <div key={color} className='overflow-hidden rounded-sm border border-border'>
                  <div className='border-b border-border bg-muted px-4 py-2 text-sm font-medium'>
                    {color}
                    {color === 'white' ? ' (default)' : ''}
                  </div>
                  <Footer
                    color={color}
                    department={department}
                    legalLinks={legalLinks}
                    socialLinks={socialLinks}
                    year={year}
                    topBorder={false}
                    acknowledgement={false}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Composition</h2>
            <p className='text-base text-muted-foreground'>
              For a layout the props do not cover, compose <code>FooterAcknowledgement</code>,{' '}
              <code>FooterLegalLinks</code>, <code>FooterSmallPrint</code> and{' '}
              <code>FooterSocialLink</code> directly — they all read the same{' '}
              <code>--footer-*</code> tokens, so pass a colour to the wrapping <code>Footer</code>{' '}
              (or set <code>--footer-ink</code> yourself) and the parts follow.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'End-of-page contentinfo landmark with acknowledgement of Country, legal links, ownership and social channels, themeable across 13 token-based surface colours.',
      },
    },
  },
  args: {
    color: 'white',
    container: 'fluid',
    department,
    legalLinks,
    socialLinks,
    year,
    acknowledgement: true,
    smallPrint: true,
    topBorder: true,
  },
  argTypes: {
    color: {
      control: 'select',
      options: footerColors,
      description:
        'Surface colour. Every option meets WCAG 2.2 AA; all but primary-600 and accent-600 also meet AAA.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper layout — fluid is full-bleed (nswds-app), contained centres a 1200px column (legacy nsw-container).',
      table: { category: 'Layout' },
    },
    topBorder: {
      control: 'boolean',
      description: 'Rule along the top edge of the footer content.',
      table: { category: 'Layout' },
    },
    acknowledgement: {
      control: 'boolean',
      description:
        'true renders the standard acknowledgement of Country, false omits it, a node replaces the wording.',
      table: { category: 'Content' },
    },
    smallPrint: {
      control: 'boolean',
      description:
        'Copyright line and social channels. The copyright line renders even with no department to name.',
      table: { category: 'Content' },
    },
    department: {
      control: 'text',
      description: 'Owning agency, named in the copyright line.',
      table: { category: 'Content' },
    },
    year: {
      control: 'number',
      description:
        'Copyright year. Defaults to the current year at render time — pass explicitly to avoid SSR hydration skew.',
      table: { category: 'Content' },
    },
    legalLinks: { table: { category: 'Content' } },
    socialLinks: { table: { category: 'Content' } },
    children: {
      control: false,
      description: 'Extra content rendered above the acknowledgement — a logo or link columns.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true, category: 'Advanced' } },
    containerClassName: { table: { disable: true, category: 'Advanced' } },
  },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFooter(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="footer"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="footer"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const footer = getFooter(canvasElement)

    if (footer.tagName !== 'FOOTER') {
      throw new Error(`Expected the Footer to render a <footer> landmark, got <${footer.tagName}>.`)
    }

    if (!footer.textContent?.includes('Traditional Custodians')) {
      throw new Error('Expected the default acknowledgement of Country to render.')
    }

    const nav = footer.querySelector('[data-slot="footer-legal-links"]')
    if (!nav) {
      throw new Error('Expected a [data-slot="footer-legal-links"] navigation landmark.')
    }
    if (nav.querySelectorAll('a').length !== legalLinks.length) {
      throw new Error(`Expected ${legalLinks.length} legal links.`)
    }

    if (!footer.textContent?.includes(`Copyright ${year} ${department}`)) {
      throw new Error('Expected the copyright line to name the year and department.')
    }

    // Icon-only links carry no visible text, so the accessible name has to come
    // from aria-label — this is what makes them usable at all.
    const social = footer.querySelectorAll<HTMLElement>('[data-slot="footer-social-link"]')
    if (social.length !== socialLinks.length) {
      throw new Error(`Expected ${socialLinks.length} social links.`)
    }
    for (const link of social) {
      if (!link.getAttribute('aria-label')) {
        throw new Error('Expected every social link to have an aria-label.')
      }
      if (!link.querySelector('svg')) {
        throw new Error('Expected every social link to render its icon.')
      }
    }
  },
}

export const Colours: Story = {
  render: (args) => (
    <div className='space-y-4'>
      {footerColors.map((color) => (
        <div key={color} className='overflow-hidden rounded-sm border border-border'>
          <div className='border-b border-border bg-muted px-4 py-2 text-sm font-medium'>
            {color}
            {color === 'white' ? ' (default)' : ''}
          </div>
          <Footer {...args} color={color} topBorder={false} acknowledgement={false} />
        </div>
      ))}
    </div>
  ),
}

export const DarkMode: Story = {
  name: 'Dark Mode',
  // Scopes `.dark` locally rather than relying on the toolbar toggle, so the
  // light and dark rendering of the same variant sit side by side.
  render: (args) => (
    <div className='space-y-4'>
      {footerColors.map((color) => (
        <div key={color} className='overflow-hidden rounded-sm border border-border'>
          <div className='border-b border-border bg-muted px-4 py-2 text-sm font-medium'>
            {color}
          </div>
          <Footer {...args} color={color} topBorder={false} acknowledgement={false} />
          <div className='dark'>
            <Footer {...args} color={color} topBorder={false} acknowledgement={false} />
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const parse = (c: string) => c.match(/[\d.]+/g)?.map(Number) ?? []
    // WCAG relative luminance from the oklch L channel is not linear, but for
    // ordering within one hue family the L channel is monotonic — enough to
    // prove the surface actually deepened.
    const lightness = (el: HTMLElement) => parse(getComputedStyle(el).backgroundColor)[0] ?? NaN

    // Custom properties are substituted as the text the stylesheet authored,
    // not as a computed colour, and the two builds spell white differently:
    // the dev entry emits `oklch(1 0 0)` while the production build's CSS
    // minifier rewrites it to `oklch(100% 0 0)`. Comparing that text directly
    // passed in dev and failed in the built Storybook that Chromatic
    // snapshots. Painting the value onto a canvas is the one normalisation
    // that crosses colour spaces — `getComputedStyle` and `fillStyle` both
    // keep oklch as oklch and hex as rgb, so neither can compare the two.
    const WHITE_RGBA = '255,255,255,255'
    const toRgba = (value: string) => {
      const context = document.createElement('canvas').getContext('2d')
      if (!context) {
        throw new Error('Could not get a 2D canvas context to resolve colours.')
      }
      // An unparseable value leaves fillStyle untouched, so seed it with black:
      // a colour no check here expects, rather than a stale one that might pass.
      context.fillStyle = '#000000'
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      return Array.from(context.getImageData(0, 0, 1, 1).data).join(',')
    }

    const cards = canvasElement.querySelectorAll<HTMLElement>('.overflow-hidden')
    if (cards.length !== footerColors.length) {
      throw new Error(`Expected ${footerColors.length} colour cards, got ${cards.length}.`)
    }

    for (const card of cards) {
      const [light, dark] = card.querySelectorAll<HTMLElement>('[data-slot="footer"]')
      const name = light!.dataset.color
      const lightL = lightness(light!)
      const darkL = lightness(dark!)

      if (!(darkL < lightL)) {
        throw new Error(
          `Expected the dark-mode surface for "${name}" to be darker than the light one (L ${darkL} vs ${lightL}). Did the dark: variant resolve?`,
        )
      }

      // Ink must go white in dark mode on every variant, including the ones
      // that carry dark ink in light mode.
      const ink = getComputedStyle(dark!).getPropertyValue('--footer-ink').trim()
      if (!ink) {
        throw new Error(`The dark "${name}" surface declares no --footer-ink.`)
      }
      if (toRgba(ink) !== WHITE_RGBA) {
        throw new Error(`Expected white ink on the dark "${name}" surface, got "${ink}".`)
      }

      // The links have to follow the ink, not just the container.
      const link = dark!.querySelector<HTMLElement>('[data-slot="footer-legal-links"] a')
      const linkL = parse(getComputedStyle(link!).color)[0]
      if (linkL !== 1) {
        throw new Error(`Expected the dark "${name}" legal links to inherit white ink.`)
      }
    }
  },
}

export const Sections: Story = {
  name: 'Sections',
  render: (args) => (
    <div className='space-y-6'>
      <Footer {...args} color='grey-200' />
      {/* No department and no social links — the copyright line still renders,
          since it is the footer's core content. */}
      <Footer {...args} color='grey-200' department={undefined} socialLinks={undefined} />
      {/* No acknowledgement — the middle rule has nothing to divide, so it goes. */}
      <Footer {...args} color='grey-200' acknowledgement={false} />
      {/* No legal links and no small print — acknowledgement only, so both the
          middle rule and the link nav drop out. */}
      <Footer {...args} color='grey-200' legalLinks={[]} smallPrint={false} />
      {/* Custom acknowledgement wording. */}
      <Footer
        {...args}
        color='grey-200'
        acknowledgement='We acknowledge the Gadigal people of the Eora Nation, the Traditional Custodians of the land on which this service was built.'
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const footers = canvasElement.querySelectorAll<HTMLElement>('[data-slot="footer"]')
    if (footers.length !== 5) {
      throw new Error(`Expected 5 footers, got ${footers.length}.`)
    }

    const [full, noOwner, noAcknowledgement, acknowledgementOnly, customAcknowledgement] = footers

    // The copyright line survives with nothing to name — dropping it silently
    // would strip the footer of its only ownership statement.
    const smallPrint = (el: HTMLElement) => el.querySelector('[data-slot="footer-small-print"]')
    if (!smallPrint(full!) || !smallPrint(noOwner!)) {
      throw new Error('Expected the copyright line to render with or without a department.')
    }
    if (!noOwner!.textContent?.includes('All rights reserved')) {
      throw new Error('Expected the copyright line to read sensibly with no department.')
    }
    if (smallPrint(acknowledgementOnly!)) {
      throw new Error('Expected smallPrint={false} to omit the copyright line.')
    }

    // An empty nav landmark is never exposed to assistive tech.
    if (acknowledgementOnly!.querySelector('[data-slot="footer-legal-links"]')) {
      throw new Error('Expected no nav landmark when there are no legal links.')
    }

    // Rules: the full footer has the top border + the divider under the
    // acknowledgement. The divider only appears with content on both sides.
    const rules = (el: HTMLElement) => el.querySelectorAll('[data-slot="separator"]').length
    if (rules(full!) !== 2) {
      throw new Error(`Expected 2 rules on the full footer, got ${rules(full!)}.`)
    }
    if (rules(noAcknowledgement!) !== 1) {
      throw new Error(
        `Expected only the top border when the acknowledgement is omitted, got ${rules(noAcknowledgement!)}.`,
      )
    }
    if (rules(acknowledgementOnly!) !== 1) {
      throw new Error(
        `Expected no divider when the acknowledgement is the only content, got ${rules(acknowledgementOnly!)}.`,
      )
    }

    if (noAcknowledgement!.textContent?.includes('Traditional Custodians')) {
      throw new Error('Expected acknowledgement={false} to omit the acknowledgement.')
    }
    if (!customAcknowledgement!.textContent?.includes('Gadigal people')) {
      throw new Error('Expected a node acknowledgement to replace the default wording.')
    }
  },
}

export const Contained: Story = {
  name: 'Contained',
  args: { container: 'contained', color: 'primary-800' },
}

export const Composed: Story = {
  name: 'Composed (sub-components)',
  render: () => (
    // The parts read --footer-* tokens, so an app can lay them out itself as
    // long as something upstream supplies the ink. Here that's the Footer
    // wrapper's own colour variant.
    <Footer color='primary-800' acknowledgement={false} container='contained'>
      <div className='grid gap-8 py-4 sm:grid-cols-3'>
        <div>
          <h2 className='text-base font-bold'>About</h2>
          <p className='mt-2 text-sm'>A slot above the acknowledgement for link columns.</p>
        </div>
        <div>
          <h2 className='text-base font-bold'>Contact</h2>
          <p className='mt-2 text-sm'>13 77 88</p>
        </div>
        <div>
          <h2 className='text-base font-bold'>Follow</h2>
          <ul className='mt-2 flex list-none gap-2'>
            {socialLinks.map((item) => (
              <li key={item.name}>
                <FooterSocialLink
                  href={item.href}
                  icon={item.icon}
                  label={`Follow us on ${item.name}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FooterAcknowledgement />
      <FooterLegalLinks legalLinks={legalLinks} />
      <FooterSmallPrint department={department} year={year} />
    </Footer>
  ),
}

const HEADING_LEVELS = [2, 3, 4, 5, 6] as const

export const HeadingLevels: Story = {
  name: 'Heading levels',
  // A site map's column titles have to slot into whatever outline the host page
  // already has, so FooterNavColumn renders h2–h6. h1 is deliberately not
  // offered: a column title is never the page's own title.
  render: () => (
    <Footer color='grey-200' acknowledgement={false} smallPrint={false}>
      <FooterNav className='lg:grid-cols-6'>
        {/* First column omits the prop, so the default is covered too. */}
        <FooterNavColumn heading='Default' links={[{ name: 'Example link', href: '#example' }]} />
        {HEADING_LEVELS.map((level) => (
          <FooterNavColumn
            key={level}
            heading={`Level ${level}`}
            headingLevel={level}
            links={[{ name: 'Example link', href: '#example' }]}
          />
        ))}
      </FooterNav>
    </Footer>
  ),
  play: async ({ canvasElement }) => {
    const columns = canvasElement.querySelectorAll<HTMLElement>('[data-slot="footer-nav-column"]')
    // The defaulted column plus one per level.
    const expected = ['H2', ...HEADING_LEVELS.map((level) => `H${level}`)]
    if (columns.length !== expected.length) {
      throw new Error(`Expected ${expected.length} columns, got ${columns.length}.`)
    }

    expected.forEach((tag, index) => {
      const actual = columns[index]!.firstElementChild?.tagName
      if (actual !== tag) {
        throw new Error(
          `Expected column ${index} to render <${tag.toLowerCase()}>, got <${actual?.toLowerCase()}>.`,
        )
      }
    })
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  args: { color: 'primary-800' },
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: bg-primary-800 resolves to a real colour,
    // and the color-mix derivation off --footer-ink produces a real border.
    const footer = getFooter(canvasElement)
    const bg = getComputedStyle(footer).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${bg}". Is globals.css loaded?`,
      )
    }

    const rule = footer.querySelector<HTMLElement>('[data-slot="separator"]')
    if (!rule) {
      throw new Error('Expected a separator rule in the footer.')
    }
    const ruleBg = getComputedStyle(rule).backgroundColor
    if (ruleBg === '' || ruleBg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected --footer-border to resolve via color-mix off --footer-ink, got "${ruleBg}".`,
      )
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

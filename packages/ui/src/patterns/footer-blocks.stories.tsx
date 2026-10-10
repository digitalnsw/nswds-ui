/**
 * FooterBlocks — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/FooterBlocks                → this file: Docs, Default, Playground
 *   Patterns/FooterBlocks/Features       → footer-blocks.features.stories.tsx
 *   Patterns/FooterBlocks/Accessibility  → footer-blocks.accessibility.stories.tsx
 *   Patterns/FooterBlocks/Tests          → footer-blocks.tests.stories.tsx (hidden)
 *
 * A recorded GROUP (see scripts/check-stories.mjs): the eight footer-*.tsx
 * blocks are one family chosen between side by side, so they share one page
 * with a chooser rather than eight near-identical pages. Each block is a
 * registry item of its own, built on the published `Footer`, so all eight
 * inherit its thirteen surface colours, dark-mode mapping, ink-derived link
 * treatment and acknowledgement of Country. They are worked examples: copy the
 * source and adapt it.
 *
 * Default and Playground render FooterSitemap, the default choice for a
 * department site; every block takes the same Footer props.
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import type { FooterColor } from '../components/footer.js'

import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { IconLinkedIn, IconX, IconYouTube } from '../icons/brands/index.js'
import { FooterAccordion } from './footer-accordion.js'
import { FooterCompact } from './footer-compact.js'
import { FooterContact } from './footer-contact.js'
import { FooterCta } from './footer-cta.js'
import { FooterNewsletter } from './footer-newsletter.js'
import { FooterSimpleCentred } from './footer-simple-centred.js'
import { FooterSitemapBrand } from './footer-sitemap-brand.js'
import { FooterSitemap } from './footer-sitemap.js'

// Brand marks are not part of the Material Symbols set, so the blocks take
// social icons as data; these come from the package's brand entry point.
const socialLinks = [
  { name: 'LinkedIn', href: '#linkedin', icon: IconLinkedIn },
  { name: 'X', href: '#x', icon: IconX },
  { name: 'YouTube', href: '#youtube', icon: IconYouTube },
]

// Pinned so Chromatic snapshots don't churn every new year.
const year = 2026

const shared = { socialLinks, year }

const footerColors: FooterColor[] = [
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

/**
 * The surfaces grouped by the logo colourway each one takes (see
 * `footerLogoType` in footer.tsx): the masterbrand's order of preference.
 */
const colourGroups: ReadonlyArray<{
  title: string
  description: React.ReactNode
  colors: FooterColor[]
}> = [
  {
    title: 'Light surfaces — full-colour logo',
    description:
      'White and the 200 and 400 steps. The full-colour mark, which the masterbrand prefers over every other version. White suits most services; a tint marks the footer off from a white page.',
    colors: [
      'white',
      'grey-200',
      'grey-400',
      'primary-200',
      'primary-400',
      'accent-200',
      'accent-400',
    ],
  },
  {
    title: 'Dark surfaces — reversed logo',
    description:
      'The 800 steps. The full-colour reversed mark — white wordmark, red waratah — the sanctioned alternative where the primary mark would not read. Prefer these for a coloured footer.',
    colors: ['primary-800', 'grey-800', 'accent-800'],
  },
  {
    title: 'Mid-tone surfaces — restricted mono logo',
    description:
      'The 600 steps. Neither full-colour version reads on them, so the logo falls back to the white mono mark — restricted use, which needs NSW Government Brand Team approval. Use an 800 step instead unless you have it.',
    colors: ['primary-600', 'grey-600', 'accent-600'],
  },
]

/** The chooser's rows: what each block adds, and how to install it. */
const blocks = [
  {
    name: 'Simple centred',
    component: 'FooterSimpleCentred',
    item: 'footer-simple-centred',
    adds: 'Logo, acknowledgement, links and ownership, all centred. The smallest complete footer.',
  },
  {
    name: 'Compact bar',
    component: 'FooterCompact',
    item: 'footer-compact',
    adds: 'One horizontal row for embedded tools and admin screens. No acknowledgement of Country.',
  },
  {
    name: 'Site map',
    component: 'FooterSitemap',
    item: 'footer-sitemap',
    adds: 'Four link columns above the standard rows. The default for a department site.',
  },
  {
    name: 'Site map with brand',
    component: 'FooterSitemapBrand',
    item: 'footer-sitemap-brand',
    adds: 'Logo and a one-paragraph mission beside three link columns.',
  },
  {
    name: 'Newsletter',
    component: 'FooterNewsletter',
    item: 'footer-newsletter',
    adds: 'Link columns beside an email subscription form.',
  },
  {
    name: 'Contact details',
    component: 'FooterContact',
    item: 'footer-contact',
    adds: 'Phone, email, address and hours in an address element, beside the site map.',
  },
  {
    name: 'Call to action',
    component: 'FooterCta',
    item: 'footer-cta',
    adds: 'A prominent action band above the site map.',
  },
  {
    name: 'Collapsible site map',
    component: 'FooterAccordion',
    item: 'footer-accordion',
    adds: 'A long site map that collapses to accordions below lg and lays out as columns above.',
  },
] as const

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function ChooserSection() {
  return (
    <ExampleSection
      title='Chooser'
      description={
        <>
          The blocks differ only in what sits above the standard rows. Pick the one whose extra
          content your service actually has. Each block is a registry item of its own — install it
          with <code>npx shadcn@latest add</code> and the item name — and each is shown below.
        </>
      }
    >
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-base'>
          <thead>
            <tr className='border-b border-foreground/10'>
              <th scope='col' className='py-3 pe-6 font-semibold'>
                Block
              </th>
              <th scope='col' className='py-3 pe-6 font-semibold'>
                What it adds
              </th>
              <th scope='col' className='py-3 font-semibold'>
                Registry item
              </th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.item} className='border-b border-foreground/10 align-top'>
                <th scope='row' className='py-3 pe-6 font-semibold'>
                  {block.name}
                  <code className='block font-normal text-muted-foreground'>{block.component}</code>
                </th>
                <td className='py-3 pe-6 text-muted-foreground'>{block.adds}</td>
                <td className='py-3'>
                  <code className='whitespace-nowrap'>@nswds/{block.item}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExampleSection>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Every block takes Footer&apos;s <code>color</code>: white, and the <code>200</code> to{' '}
          <code>800</code> steps of the grey, primary and accent ramps. Links, borders and focus
          rings derive from the surface, and the logo picks its own colourway, so the surfaces fall
          into three groups by the logo they take. Each is shown on the compact bar, the shortest
          block.
        </>
      }
    >
      {colourGroups.map((group) => (
        <div key={group.title} className='space-y-3 pt-4'>
          <h3 className='text-lg font-semibold'>{group.title}</h3>
          <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
            {group.description}
          </p>
          <Example code={`<FooterCompact color="${group.colors[0]}" />`} layout='fill'>
            <div className='grid gap-6 md:grid-cols-2'>
              {group.colors.map((color) => (
                <div key={color} className='space-y-2'>
                  <p className='text-base font-medium text-muted-foreground'>{color}</p>
                  <FooterCompact {...shared} color={color} />
                </div>
              ))}
            </div>
          </Example>
        </div>
      ))}
    </ExampleSection>
  )
}

export function SimpleCentredSection() {
  return (
    <ExampleSection
      title='Simple centred'
      description='Logo, acknowledgement of Country, legal links and ownership, centred. The smallest footer that is still complete — for a single-purpose service with few pages.'
    >
      <Example code={`<FooterSimpleCentred socialLinks={socialLinks} />`} layout='fill'>
        <FooterSimpleCentred {...shared} />
      </Example>
    </ExampleSection>
  )
}

export function CompactBarSection() {
  return (
    <ExampleSection
      title='Compact bar'
      description='One row, for embedded tools and admin screens where a full footer would crowd the work. It is the one block without acknowledgement of Country — a service using it owes the acknowledgement somewhere else on the page.'
    >
      <Example code={`<FooterCompact color="grey-200" socialLinks={socialLinks} />`} layout='fill'>
        <FooterCompact {...shared} color='grey-200' />
      </Example>
    </ExampleSection>
  )
}

export function SiteMapSection() {
  return (
    <ExampleSection
      title='Site map'
      description={
        <>
          Four columns of links above the standard rows, in one navigation landmark. The default for
          a department or agency site. Replace the sample <code>columns</code> with your own.
        </>
      }
    >
      <Example code={`<FooterSitemap columns={columns} socialLinks={socialLinks} />`} layout='fill'>
        <FooterSitemap {...shared} />
      </Example>
    </ExampleSection>
  )
}

export function SiteMapWithBrandSection() {
  return (
    <ExampleSection
      title='Site map with brand'
      description={
        <>
          The logo and a one-paragraph <code>mission</code> beside three link columns, for a service
          that needs to say what it is as well as where things are.
        </>
      }
    >
      <Example
        code={`<FooterSitemapBrand color="grey-200" mission="…" socialLinks={socialLinks} />`}
        layout='fill'
      >
        <FooterSitemapBrand {...shared} color='grey-200' />
      </Example>
    </ExampleSection>
  )
}

export function NewsletterSection() {
  return (
    <ExampleSection
      title='Newsletter'
      description={
        <>
          Link columns beside an email subscription form, for services people opt into updates from
          — grant rounds, policy changes, alerts. <code>onSubscribe</code> receives the address and
          may return a promise: the form disables while it is pending, then reports success or
          failure in a polite live region. Collecting an email makes this a collection point under
          the PPIP Act, so put your privacy notice beside the field.
        </>
      }
    >
      <Example
        code={`<FooterNewsletter onSubscribe={(email) => subscribe(email)} socialLinks={socialLinks} />`}
        layout='fill'
      >
        <FooterNewsletter {...shared} onSubscribe={() => Promise.resolve()} />
      </Example>
    </ExampleSection>
  )
}

export function ContactDetailsSection() {
  return (
    <ExampleSection
      title='Contact details'
      description={
        <>
          Phone, email, address and opening hours in an <code>&lt;address&gt;</code> beside the site
          map. The phone number and email are <code>tel:</code> and <code>mailto:</code> links, so
          they work on a phone with one tap.
        </>
      }
    >
      <Example
        code={`<FooterContact color="grey-200" contact={contact} socialLinks={socialLinks} />`}
        layout='fill'
      >
        <FooterContact {...shared} color='grey-200' />
      </Example>
    </ExampleSection>
  )
}

export function CallToActionSection() {
  return (
    <ExampleSection
      title='Call to action'
      description={
        <>
          A prominent action band above the site map, for the one next step most people reaching the
          end of a page need — usually getting help. Pass it as <code>cta</code>.
        </>
      }
    >
      <Example
        code={`<FooterCta color="primary-800" cta={cta} socialLinks={socialLinks} />`}
        layout='fill'
      >
        <FooterCta {...shared} color='primary-800' />
      </Example>
    </ExampleSection>
  )
}

export function CollapsibleSiteMapSection() {
  return (
    <ExampleSection
      title='Collapsible site map'
      description={
        <>
          A long site map that lays out as columns from <code>lg</code> up and collapses to
          accordions below it, so a phone reader is not scrolling past twenty links. The columns
          render open first, so every link is reachable without JavaScript. Narrow the window to see
          it collapse.
        </>
      }
    >
      <Example
        code={`<FooterAccordion columns={columns} socialLinks={socialLinks} />`}
        layout='fill'
      >
        <FooterAccordion {...shared} />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function FooterBlocksDocs() {
  return (
    <DocsPage
      eyebrow='Pattern'
      title='FooterBlocks'
      summary={
        <>
          Eight ready-made footers built on the published Footer, differing only in what sits above
          its standard rows — a site map, a mission, contact details, a subscription form, a call to
          action. They ship with sample links so they render complete on arrival: install the one
          you need from the chooser below, then replace the samples with your own.
        </>
      }
    >
      <DocsUsage
        use={[
          'Starting the footer of a new service from a complete, accessible layout.',
          'A site map, contact details or newsletter sign-up at the end of every page.',
          'Seeing which footer layout fits before committing to one.',
        ]}
        avoid={[
          'Only the standard rows — acknowledgement, legal links, ownership — use Footer.',
          'Navigation people need before they reach the end of the page — use MainNav or SideNav.',
          'A one-off message at the end of a single page — use Callout.',
        ]}
      />
      <ChooserSection />
      <ColoursSection />
      <SimpleCentredSection />
      <CompactBarSection />
      <SiteMapSection />
      <SiteMapWithBrandSection />
      <NewsletterSection />
      <ContactDetailsSection />
      <CallToActionSection />
      <CollapsibleSiteMapSection />
      <DocsApi description='Props of FooterSitemap. Every block takes the same Footer props — color, socialLinks, legalLinks, department, year and the rest — plus the block’s own sample data (columns, contact, cta, mission, onSubscribe).' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Patterns/FooterBlocks',
  component: FooterSitemap,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: FooterBlocksDocs },
  },
  args: {
    ...shared,
    color: 'white',
  },
  argTypes: {
    columns: {
      control: false,
      description: 'Link columns of the site map. Defaults to sample links — replace them.',
      table: { category: 'Content' },
    },
    legalLinks: {
      control: false,
      description: 'Supporting and legal links — privacy, accessibility, copyright.',
      table: { category: 'Content' },
    },
    socialLinks: {
      control: false,
      description: 'Social channels, rendered as icon-only links beside the copyright line.',
      table: { category: 'Content' },
    },
    department: {
      control: 'text',
      description: 'Owning agency, named in the copyright line.',
      table: { category: 'Content' },
    },
    year: {
      control: 'number',
      description: 'Copyright year.',
      table: { category: 'Content' },
    },
    acknowledgement: {
      control: 'boolean',
      description: 'Acknowledgement of Country: on by default, false omits it, a node replaces it.',
      table: { category: 'Content' },
    },
    smallPrint: {
      control: 'boolean',
      description: 'The copyright line and social channels.',
      table: { category: 'Content' },
    },
    color: {
      control: 'select',
      options: footerColors,
      description: 'Surface colour. Links, borders and the logo colourway follow it.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description: 'Whether the inner content is constrained to the contained page width.',
      table: { category: 'Appearance' },
    },
    topBorder: {
      control: 'boolean',
      description: 'Rule along the top edge of the footer content.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
    containerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof FooterSitemap>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector<HTMLElement>('[data-slot="footer"]')
    if (footer?.tagName !== 'FOOTER') {
      throw new Error('Expected FooterSitemap to render a <footer> landmark.')
    }
    if (!footer.querySelector('[data-slot="footer-nav"]')) {
      throw new Error('Expected the site map above the standard footer rows.')
    }
  },
}

export const Playground: Story = {}

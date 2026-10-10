/**
 * Footer — the end-of-page contentinfo landmark.
 *
 *   Components/Footer                → this file: Docs, Default, Playground
 *   Components/Footer/Features       → footer.features.stories.tsx
 *   Components/Footer/Accessibility  → footer.accessibility.stories.tsx
 *   Components/Footer/Tests          → footer.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples. Every
 * Footer on the docs page takes its own id, so each specimen is addressable.
 *
 * The eight composed footer blocks (FooterSitemap, FooterNewsletter, …) are a
 * separate pattern group: Patterns/FooterBlocks.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import { IconFacebook, IconInstagram, IconLinkedIn, IconYouTube } from '../icons/brands/index.js'
import {
  Footer,
  FooterAcknowledgement,
  footerColors,
  FooterLegalLinks,
  footerLogoType,
  FooterNav,
  FooterNavColumn,
  FooterSmallPrint,
  FooterSocialLink,
} from './footer.js'
import { Logo } from './logo.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

const legalLinks = [
  { name: 'Accessibility statement', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Copyright', href: '#copyright' },
  { name: 'Contact us', href: '#contact' },
]

const socialLinks = [
  { name: 'Facebook', href: '#facebook', icon: IconFacebook },
  { name: 'Instagram', href: '#instagram', icon: IconInstagram },
  { name: 'LinkedIn', href: '#linkedin', icon: IconLinkedIn },
  { name: 'YouTube', href: '#youtube', icon: IconYouTube },
]

const department = 'Department of Primary Industries'

// The copyright year is pinned so Chromatic snapshots don't churn every new
// year — the same escape hatch consumers use to avoid SSR hydration skew.
const year = 2026

const siteMap = [
  {
    heading: 'Fishing',
    links: [
      { name: 'Recreational fishing licence', href: '#licence' },
      { name: 'Size and bag limits', href: '#limits' },
      { name: 'Report illegal fishing', href: '#report' },
    ],
  },
  {
    heading: 'Farming',
    links: [
      { name: 'Drought support', href: '#drought' },
      { name: 'Animal welfare', href: '#welfare' },
      { name: 'Grants and funding', href: '#grants' },
    ],
  },
  {
    heading: 'Biosecurity',
    links: [
      { name: 'Report a pest or disease', href: '#pest' },
      { name: 'Moving livestock', href: '#livestock' },
    ],
  },
  {
    heading: 'About us',
    links: [
      { name: 'Our structure', href: '#structure' },
      { name: 'Media releases', href: '#media' },
      { name: 'Careers', href: '#careers' },
    ],
  },
]

function getFooter(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="footer"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="footer"].')
  }
  return el
}

/**
 * A labelled full-width specimen. ExampleCell sizes its child to its content,
 * which would shrink a full-bleed footer to the width of its links.
 */
function Strip({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className='space-y-2'>
      <p className='text-base text-muted-foreground'>{label}</p>
      <div className='ring-1 ring-foreground/10'>{children}</div>
    </div>
  )
}

type FooterColor = (typeof footerColors)[number]

/** One surface, trimmed to the rows that carry its colours. */
function ColourSpecimen({ color, dark = false }: { color: FooterColor; dark?: boolean }) {
  const name = color === 'white' ? 'white (default)' : color
  return (
    <Strip label={dark ? `${name} — dark mode` : name}>
      <Footer
        id={`footer-colour-${dark ? 'dark-' : ''}${color}`}
        color={color}
        department={department}
        legalLinks={legalLinks}
        socialLinks={socialLinks}
        year={year}
        topBorder={false}
        acknowledgement={false}
      />
    </Strip>
  )
}

const colourFamilies: ReadonlyArray<{
  title: string
  description: React.ReactNode
  colors: ReadonlyArray<FooterColor>
}> = [
  {
    title: 'Blue',
    description: (
      <>
        The masterbrand blue. <code>primary-800</code> is the deepest and takes the reversed logo;{' '}
        <code>primary-600</code> is AA-only; the lighter two carry blue ink instead of white.
      </>
    ),
    colors: ['primary-800', 'primary-600', 'primary-400', 'primary-200'],
  },
  {
    title: 'Grey',
    description: (
      <>
        Neutral surfaces, for a footer that should recede. <code>grey-800</code> takes the reversed
        logo; the lighter two carry grey ink.
      </>
    ),
    colors: ['grey-800', 'grey-600', 'grey-400', 'grey-200'],
  },
  {
    title: 'Red',
    description: (
      <>
        The masterbrand red, for a service whose brand leads with it. <code>accent-600</code> is
        AA-only; prefer <code>accent-800</code> for a service held to AAA.
      </>
    ),
    colors: ['accent-800', 'accent-600', 'accent-400', 'accent-200'],
  },
  {
    title: 'White',
    description: (
      <>
        The default: a plain page-coloured footer. Keep its top rule (<code>topBorder</code>, on by
        default) so it still reads as the end of the page; the specimens here leave it off. It
        deepens to <code>grey-900</code> in dark mode.
      </>
    ),
    colors: ['white'],
  },
]

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          All thirteen surfaces clear WCAG 2.2 AA (4.5:1) for the footer&rsquo;s smallest text;
          eleven also clear AAA (7:1). The two AA-only pairs are <code>primary-600</code> (4.57:1)
          and <code>accent-600</code> (5.18:1) — prefer the <code>-800</code> steps for a service
          held to AAA. Link, border and hover colours all derive from the surface&rsquo;s{' '}
          <code>--footer-ink</code>, so a new surface only needs that one token. Each colour is
          named for its light-mode tone and deepens in dark mode, where all thirteen clear AAA.
        </>
      }
    >
      <div className='space-y-10'>
        {colourFamilies.map((family, index) => (
          <div key={family.title} className='space-y-4'>
            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>{family.title}</h3>
              <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>
                {family.description}
              </p>
            </div>
            <Example
              layout='fill'
              code={index === 0 ? `<Footer color="primary-800" … />` : undefined}
            >
              <div className='space-y-6'>
                {family.colors.map((color) => (
                  <ColourSpecimen key={color} color={color} />
                ))}
              </div>
            </Example>
            <Example layout='fill' surface='dark'>
              <div className='space-y-6'>
                {family.colors.map((color) => (
                  <ColourSpecimen key={color} color={color} dark />
                ))}
              </div>
            </Example>
          </div>
        ))}
      </div>
    </ExampleSection>
  )
}

export function AcknowledgementSection() {
  return (
    <ExampleSection
      title='Acknowledgement of Country'
      description={
        <>
          On by default, in the standard NSW Government wording. Pass your own wording when your
          agency has agreed it with the relevant Traditional Custodians. Set{' '}
          <code>acknowledgement=&#123;false&#125;</code> only when the page carries the
          acknowledgement somewhere else.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Footer acknowledgement="We acknowledge the Gadigal people of the Eora Nation…" />`}
      >
        <div className='space-y-6'>
          <Strip label='default wording'>
            <Footer id='footer-ack-default' color='grey-200' legalLinks={[]} smallPrint={false} />
          </Strip>
          <Strip label='agreed wording'>
            <Footer
              id='footer-ack-agreed'
              color='grey-200'
              legalLinks={[]}
              smallPrint={false}
              acknowledgement='We acknowledge the Gadigal people of the Eora Nation, the Traditional Custodians of the land on which this service was built, and pay our respects to Elders past and present.'
            />
          </Strip>
        </div>
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
          Put <code>FooterNav</code> in <code>children</code> to add a site map above the standard
          rows. It is one navigation landmark for the whole map; each <code>FooterNavColumn</code>{' '}
          is a headed list. Column headings are <code>h2</code> — step them down with{' '}
          <code>headingLevel</code> when the footer sits under another heading.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Footer legalLinks={legalLinks} department="Department of Primary Industries">
  <FooterNav>
    <FooterNavColumn heading="Fishing" links={fishingLinks} />
    <FooterNavColumn heading="Farming" links={farmingLinks} />
  </FooterNav>
</Footer>`}
      >
        <Footer
          id='footer-site-map'
          color='grey-200'
          department={department}
          legalLinks={legalLinks}
          year={year}
          acknowledgement={false}
        >
          <FooterNav>
            {siteMap.map((column) => (
              <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
            ))}
          </FooterNav>
        </Footer>
      </Example>
    </ExampleSection>
  )
}

export function SocialLinksSection() {
  return (
    <ExampleSection
      title='Social links'
      description={
        <>
          List only the channels your team actively runs. Each renders as an icon-only link named
          “Follow us on …” with a 44px touch target. The six brand marks the NSW Government uses
          ship in <code>@nswds/ui/icons/brands</code>. A React Server Component building this list
          from its own icon modules passes elements (<code>icon: &lt;MyIcon /&gt;</code>), not
          components.
        </>
      }
    >
      <Example
        layout='fill'
        code={`import { IconFacebook, IconLinkedIn } from '@nswds/ui/icons/brands'

<Footer
  socialLinks={[
    { name: 'Facebook', href: 'https://www.facebook.com/…', icon: IconFacebook },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/…', icon: IconLinkedIn },
  ]}
/>`}
      >
        <Footer
          id='footer-social'
          color='white'
          department={department}
          socialLinks={socialLinks}
          year={year}
          acknowledgement={false}
          topBorder={false}
        />
      </Example>
    </ExampleSection>
  )
}

export function WithTheLogoSection() {
  return (
    <ExampleSection
      title='With the logo'
      description={
        <>
          The NSW Government logo never inherits a colour, so choose its treatment against the
          surface: pass <code>footerLogoType(color)</code>. Light surfaces take full colour; the{' '}
          <code>-800</code> steps take full colour reversed. The <code>-600</code> steps can only
          take the mono logo, which needs NSW Government Brand Team approval — choose an{' '}
          <code>-800</code> step instead.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Footer color="primary-800">
  <Logo logoType={footerLogoType('primary-800')} className="h-16 w-auto" />
</Footer>`}
      >
        <div className='space-y-6'>
          {(['white', 'primary-800', 'grey-800'] as const).map((color) => (
            <Strip key={color} label={`${color} → ${footerLogoType(color)}`}>
              <Footer
                id={`footer-logo-${color}`}
                color={color}
                department={department}
                year={year}
                acknowledgement={false}
                topBorder={false}
              >
                <Logo logoType={footerLogoType(color)} className='mb-4 h-16 w-auto' />
              </Footer>
            </Strip>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

export function CompositionSection() {
  return (
    <ExampleSection
      title='Composition'
      description={
        <>
          For a layout the props do not cover, compose <code>FooterAcknowledgement</code>,{' '}
          <code>FooterLegalLinks</code>, <code>FooterSmallPrint</code> and{' '}
          <code>FooterSocialLink</code> directly — they all read the same <code>--footer-*</code>{' '}
          tokens, so pass a colour to the wrapping <code>Footer</code> (or set{' '}
          <code>--footer-ink</code> yourself) and the parts follow. Switch the wrapping
          Footer&apos;s own rows off with <code>acknowledgement=&#123;false&#125;</code> and{' '}
          <code>smallPrint=&#123;false&#125;</code>.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Footer color="primary-800" acknowledgement={false} smallPrint={false}>
  …your layout…
  <FooterAcknowledgement />
  <FooterLegalLinks legalLinks={legalLinks} />
  <FooterSmallPrint department="Department of Primary Industries" />
</Footer>`}
      >
        <Footer
          id='footer-composition'
          color='primary-800'
          acknowledgement={false}
          smallPrint={false}
        >
          <div className='grid gap-8 py-4 sm:grid-cols-3'>
            <div>
              <h2 className='text-base font-bold'>Contact us</h2>
              <p className='mt-2 text-base'>Monday to Friday, 8:30am to 5pm</p>
            </div>
            <div>
              <h2 className='text-base font-bold'>Visit us</h2>
              <p className='mt-2 text-base'>Offices across regional NSW</p>
            </div>
            <div>
              <h2 className='text-base font-bold'>Follow us</h2>
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
      </Example>
    </ExampleSection>
  )
}

export function ContainersSection() {
  return (
    <ExampleSection
      title='Containers'
      description={
        <>
          <code>fluid</code> (the default) runs the content from the page edge;{' '}
          <code>contained</code> centres it in a 1200px column, to line up with a contained{' '}
          <code>Header</code>. Retune either with <code>--footer-max-width</code> and{' '}
          <code>--footer-padding-x</code>.
        </>
      }
    >
      <Example layout='fill' code={`<Footer container="contained" />`}>
        <div className='space-y-6'>
          {(['fluid', 'contained'] as const).map((container) => (
            <Strip key={container} label={container}>
              <Footer
                id={`footer-container-${container}`}
                color='grey-200'
                container={container}
                department={department}
                legalLinks={legalLinks}
                year={year}
                acknowledgement={false}
                topBorder={false}
              />
            </Strip>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The last thing on every page, rendered once in a shared layout: the logo and site map above the acknowledgement, legal links and small print.'
    >
      <Example
        layout='fill'
        code={`<Footer color="primary-800" department="…" legalLinks={legalLinks} socialLinks={socialLinks}>
  <Logo logoType={footerLogoType('primary-800')} />
  <FooterNav>…</FooterNav>
</Footer>`}
      >
        <div className='overflow-hidden ring-1 ring-foreground/10'>
          <div className='space-y-2 bg-background px-6 py-8 text-foreground'>
            <p className='text-2xl font-bold'>Apply for a recreational fishing licence</p>
            <p className='text-base'>
              You need a licence to fish in NSW waters, including from the shore.
            </p>
          </div>
          <Footer
            id='footer-in-context'
            color='primary-800'
            department={department}
            legalLinks={legalLinks}
            socialLinks={socialLinks}
            year={year}
          >
            <Logo logoType={footerLogoType('primary-800')} className='mb-6 h-16 w-auto' />
            <FooterNav>
              {siteMap.map((column) => (
                <FooterNavColumn
                  key={column.heading}
                  heading={column.heading}
                  links={column.links}
                />
              ))}
            </FooterNav>
          </Footer>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function FooterDocs() {
  return (
    <DocsPage
      title='Footer'
      npm={[
        'Footer',
        'FooterNav',
        'FooterNavColumn',
        'FooterNavLink',
        'FooterAcknowledgement',
        'FooterLegalLinks',
        'FooterSmallPrint',
        'FooterSocialLink',
        'footerLogoType',
      ]}
      registry='footer'
      summary={
        <>
          The footer closes every page with acknowledgement of Country, supporting links, service
          ownership and any social channels the team actively maintains. Render it once in a shared
          layout, not per page. It is a <code>contentinfo</code> landmark, so there should be
          exactly one per page. It is the one region allowed to be dense — people come here looking
          for something specific.
        </>
      }
    >
      <DocsUsage
        use={[
          'The end of every page, rendered once in a shared layout.',
          'Privacy, accessibility, copyright and contact links, and the owning agency.',
          'A site map of the main sections, with FooterNav in children.',
        ]}
        avoid={[
          'A ready-made footer with contact details, a newsletter form or a call to action — copy a footer block such as FooterContact or FooterNewsletter.',
          'Navigating within the current section — use SideNav.',
          'Links to related pages at the end of an article — use LinkCard.',
        ]}
      />
      <ColoursSection />
      <AcknowledgementSection />
      <SiteMapSection />
      <SocialLinksSection />
      <WithTheLogoSection />
      <CompositionSection />
      <ContainersSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: FooterDocs },
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
        'Surface colour, named for its light-mode tone. Every option meets WCAG 2.2 AA; all but primary-600 and accent-600 also meet AAA.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper layout — fluid is full-bleed, contained centres a 1200px column. Retune with --footer-max-width and --footer-padding-x.',
      table: { category: 'Appearance' },
    },
    topBorder: {
      control: 'boolean',
      description: 'Rule along the top edge of the footer content.',
      table: { category: 'Appearance' },
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
    legalLinks: {
      control: false,
      description: 'Supporting links — privacy, accessibility, copyright, contact.',
      table: { category: 'Content' },
    },
    socialLinks: {
      control: false,
      description: 'Social channels, rendered as icon-only links beside the copyright line.',
      table: { category: 'Content' },
    },
    children: {
      control: false,
      description: 'Extra content above the acknowledgement — a logo, contact details, FooterNav.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
    containerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

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

export const Playground: Story = {}

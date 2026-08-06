import type * as React from 'react'

import { ButtonLink } from '../components/button.js'
import { Footer, FooterNav, FooterNavColumn } from '../components/footer.js'
import { IconArrowForward } from '../icons/arrow-forward.js'

// ── Sample content — replace with your service's own ────────────────────────
const ctaSample = {
  heading: 'Need help with your application?',
  description: 'Our team can talk you through the steps and check what you need before you start.',
  action: { label: 'Contact us', href: '#contact' },
}

const columnsSample = [
  {
    heading: 'Services',
    links: [
      { name: 'Apply for a licence', href: '#licence' },
      { name: 'Pay a fine', href: '#fine' },
      { name: 'Book an appointment', href: '#appointment' },
    ],
  },
  {
    heading: 'About',
    links: [
      { name: 'Who we are', href: '#about' },
      { name: 'Our strategy', href: '#strategy' },
      { name: 'Careers', href: '#careers' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { name: 'Accessibility help', href: '#accessibility-help' },
      { name: 'Give feedback', href: '#feedback' },
      { name: 'Report a problem', href: '#report' },
    ],
  },
]

const legalLinksSample = [
  { name: 'Accessibility', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Copyright', href: '#copyright' },
]

const departmentSample = 'Digital NSW, Department of Customer Service'

/**
 * Repoints the button's colour tokens at the footer's ink, so the action reads
 * correctly on all thirteen surfaces and in both themes. `outline` rather than
 * `solid` because a solid button needs an inverse text colour, and the footer
 * exposes its ink but not its surface — outline needs only the one token. It is
 * also the right emphasis: the page's primary action belongs above the footer,
 * not in it.
 */
const ctaActionClassName = [
  '[--btn-bg:var(--footer-ink)]',
  '[--btn-icon:var(--footer-ink)]',
  '[--btn-hover-overlay:var(--footer-halo)]',
  '[--btn-active-overlay:var(--footer-halo-active)]',
].join(' ')

type FooterCtaProps = Omit<React.ComponentProps<typeof Footer>, 'children'> & {
  columns?: typeof columnsSample
  cta?: typeof ctaSample
}

/**
 * A call-to-action band above the site map, for the one thing you most want
 * people to do when they reach the bottom of the page without converting —
 * usually "contact us" or "start your application".
 *
 * The band's panel is `--footer-halo` (the ink at 10%), so it lifts off the
 * surface by the same amount on every colour rather than being pinned to one
 * brand value.
 */
export function FooterCta({
  columns = columnsSample,
  cta = ctaSample,
  legalLinks = legalLinksSample,
  department = departmentSample,
  ...props
}: FooterCtaProps) {
  return (
    <Footer legalLinks={legalLinks} department={department} {...props}>
      <div className='my-4 flex flex-col gap-4 rounded-sm border border-(--footer-border) bg-(--footer-halo) p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-lg font-bold text-pretty text-(--footer-ink)'>{cta.heading}</h2>
          <p className='text-sm text-pretty text-(--footer-ink)'>{cta.description}</p>
        </div>
        <ButtonLink
          href={cta.action.href}
          variant='outline'
          trailingVisual={IconArrowForward}
          className={`shrink-0 ${ctaActionClassName}`}
        >
          {cta.action.label}
        </ButtonLink>
      </div>
      <FooterNav className='lg:grid-cols-3'>
        {columns.map((column) => (
          <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
        ))}
      </FooterNav>
    </Footer>
  )
}

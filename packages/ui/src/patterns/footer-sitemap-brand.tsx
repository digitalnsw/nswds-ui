import type * as React from 'react'

import { Footer, FooterNav, FooterNavColumn } from '../components/footer.js'
import { Logo } from '../components/logo.js'

// ── Sample content — replace with your service's own ────────────────────────
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
      { name: 'Contact us', href: '#contact' },
      { name: 'Accessibility help', href: '#accessibility-help' },
      { name: 'Give feedback', href: '#feedback' },
    ],
  },
]

const legalLinksSample = [
  { name: 'Accessibility', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Copyright', href: '#copyright' },
  { name: 'Disclaimer', href: '#disclaimer' },
]

const departmentSample = 'Digital NSW, Department of Customer Service'

const missionSample =
  'We help NSW Government teams design and build digital services that are simple, inclusive and trusted by the people who use them.'

type FooterSitemapBrandProps = Omit<React.ComponentProps<typeof Footer>, 'children'> & {
  columns?: typeof columnsSample
  /** Short statement of what the agency or service does. Two lines at most. */
  mission?: string
}

/**
 * The NSW Government mark and a one-paragraph mission beside three link
 * columns. Use when the footer is the first place a visitor learns who runs
 * the service — a standalone product site, or an agency's front door.
 *
 * See `FooterSimpleCentred` for the note on choosing `logoType` per surface:
 * `default` here, because it inverts correctly with the theme.
 */
export function FooterSitemapBrand({
  columns = columnsSample,
  mission = missionSample,
  legalLinks = legalLinksSample,
  department = departmentSample,
  ...props
}: FooterSitemapBrandProps) {
  return (
    <Footer legalLinks={legalLinks} department={department} {...props}>
      <div className='grid py-4 max-lg:gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16'>
        <div className='flex flex-col gap-4'>
          <Logo className='h-14 w-auto self-start' />
          <p className='text-sm text-pretty text-(--footer-ink)'>{mission}</p>
        </div>
        <FooterNav className='py-0 lg:grid-cols-3'>
          {columns.map((column) => (
            <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
          ))}
        </FooterNav>
      </div>
    </Footer>
  )
}

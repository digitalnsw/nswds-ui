// Copied from packages/ui/src/patterns/footer-sitemap.tsx for the docs live preview,
// with imports rewritten to the published @nswds/ui surface — the same
// copy-and-adapt flow registry consumers use. Regenerate by re-copying the
// source if the upstream pattern changes.
import type * as React from 'react'

import { Footer, FooterNav, FooterNavColumn } from '@nswds/ui'

// ── Sample content — replace with your service's own ────────────────────────
const columnsSample = [
  {
    heading: 'Services',
    links: [
      { name: 'Apply for a licence', href: '#licence' },
      { name: 'Pay a fine', href: '#fine' },
      { name: 'Book an appointment', href: '#appointment' },
      { name: 'Check an application', href: '#application' },
    ],
  },
  {
    heading: 'About',
    links: [
      { name: 'Who we are', href: '#about' },
      { name: 'Our strategy', href: '#strategy' },
      { name: 'Careers', href: '#careers' },
      { name: 'News', href: '#news' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { name: 'Contact us', href: '#contact' },
      { name: 'Accessibility help', href: '#accessibility-help' },
      { name: 'Give feedback', href: '#feedback' },
      { name: 'Report a problem', href: '#report' },
    ],
  },
  {
    heading: 'Popular',
    links: [
      { name: 'Service NSW', href: '#service-nsw' },
      { name: 'Digital NSW', href: '#digital-nsw' },
      { name: 'Data.NSW', href: '#data-nsw' },
      { name: 'Have your say', href: '#have-your-say' },
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

type FooterSitemapProps = Omit<React.ComponentProps<typeof Footer>, 'children'> & {
  columns?: typeof columnsSample
}

/**
 * Four columns of links above the standard footer. The default choice for a
 * department or agency site with more than a handful of pages.
 *
 * The columns slot into `Footer`'s `children`, so acknowledgement of Country,
 * the legal link row and the copyright line are all still supplied by `Footer`
 * itself — this block only adds the site map.
 *
 * Headings are `h2`, which is correct when the footer sits at the top level of
 * the page outline. If your layout nests it deeper, set `headingLevel` on the
 * `FooterNavColumn` below to keep the outline in order (WCAG 1.3.1) — this is
 * a copy-and-adapt block, so you own this file after `shadcn add`.
 */
export function FooterSitemap({
  columns = columnsSample,
  legalLinks = legalLinksSample,
  department = departmentSample,
  ...props
}: FooterSitemapProps) {
  return (
    <Footer legalLinks={legalLinks} department={department} {...props}>
      <FooterNav>
        {columns.map((column) => (
          <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
        ))}
      </FooterNav>
    </Footer>
  )
}

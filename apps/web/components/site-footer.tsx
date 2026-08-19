import { Footer, FooterNav, FooterNavColumn } from '@nswds/ui'

import { githubUrl } from '@/lib/site-nav'

const columns = [
  {
    heading: 'Get started',
    links: [
      { name: 'Components', href: '/components' },
      { name: 'Patterns', href: '/patterns' },
      { name: 'Design tokens', href: '/tokens' },
      { name: 'Icons', href: '/icons' },
    ],
  },
  {
    heading: 'Consume',
    links: [
      { name: 'npm — @nswds/ui', href: 'https://www.npmjs.com/package/@nswds/ui' },
      { name: 'shadcn registry', href: '/components' },
      { name: 'Source on GitHub', href: githubUrl },
    ],
  },
  {
    heading: 'NSW Government',
    links: [
      { name: 'digital.nsw.gov.au', href: 'https://www.digital.nsw.gov.au' },
      { name: 'nsw.gov.au', href: 'https://www.nsw.gov.au' },
      {
        name: 'Accessibility statement',
        href: 'https://www.nsw.gov.au/nsw-government/accessibility-statement',
      },
    ],
  },
]

const legalLinks = [
  { name: 'Accessibility', href: 'https://www.nsw.gov.au/nsw-government/accessibility-statement' },
  { name: 'Copyright', href: 'https://www.nsw.gov.au/nsw-government/copyright' },
  { name: 'Privacy', href: 'https://www.nsw.gov.au/nsw-government/privacy' },
]

function SiteFooter() {
  return (
    <Footer color='grey-200' legalLinks={legalLinks} department='State of New South Wales'>
      <FooterNav>
        {columns.map((column) => (
          <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
        ))}
      </FooterNav>
    </Footer>
  )
}

export { SiteFooter }

import {
  Footer,
  Header,
  HeaderActions,
  HeaderBrand,
  Masthead,
  SkipLink,
  SkipLinks,
} from '@nswds/ui'
import { AuthMenu } from '@workspace/auth/components'
import type * as React from 'react'

import { siteName } from '@/lib/site_name'

const legalLinks = [
  { name: 'Accessibility', href: 'https://www.nsw.gov.au/accessibility' },
  { name: 'Privacy', href: 'https://www.nsw.gov.au/privacy' },
  { name: 'Copyright', href: 'https://www.nsw.gov.au/copyright' },
]

/**
 * The page chrome the root layout renders once: skip links, masthead, header
 * (brand and the pre-launch sign-out), the main landmark and the footer. The
 * same shell as apps/infographics, and as nswds-email-design's site-chrome.
 */
function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col'>
      <SkipLinks>
        <SkipLink href='#main-content'>Skip to content</SkipLink>
      </SkipLinks>
      <Masthead />
      <Header>
        <HeaderBrand sitename={siteName} href='/' />
        <HeaderActions>
          <AuthMenu />
        </HeaderActions>
      </Header>
      <main id='main-content' className='flex-1'>
        {children}
      </main>
      <Footer department='Digital NSW, Department of Customer Service' legalLinks={legalLinks} />
    </div>
  )
}

export { SiteShell }

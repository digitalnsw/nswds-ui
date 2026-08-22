import type * as React from 'react'

import { Footer, footerLogoType, FooterNavLink, FooterSmallPrint } from '../components/footer.js'
import { Logo } from '../components/logo.js'

// ── Sample content — replace with your service's own ────────────────────────
const legalLinksSample = [
  { name: 'Accessibility', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Copyright', href: '#copyright' },
]

const departmentSample = 'Digital NSW'

type FooterCompactProps = Omit<
  React.ComponentProps<typeof Footer>,
  'acknowledgement' | 'children' | 'smallPrint'
> & {
  /**
   * `Logo` treatment. Defaults to the colourway the masterbrand guidelines
   * call for on the chosen `color` (see `footerLogoType`): full colour on a
   * light surface, reversed on a `-800`, and the restricted mono only where
   * neither reads. Override only for a surface this block does not own.
   */
  logoType?: React.ComponentProps<typeof Logo>['logoType']
}

/**
 * A single horizontal bar: logo, inline links, then ownership and social. The
 * shortest footer in the set, for embedded tools, dashboards and admin screens
 * where the footer should take almost no vertical space.
 *
 * The logo tracks `color` automatically (see `footerLogoType`), following the
 * masterbrand's order of preference: full colour on a light surface, reversed
 * on a `-800`. The default treatment would paint the wordmark in nsw-blue-800
 * — invisible on `primary-800`, which is that exact colour.
 *
 * NOTE — this is the one block that omits acknowledgement of Country: it
 * cannot be shown respectfully in a one-line bar. A service using this footer
 * must carry the acknowledgement elsewhere on the page. If there is nowhere
 * else for it, use `FooterSimpleCentred` instead.
 */
export function FooterCompact({
  legalLinks = legalLinksSample,
  socialLinks,
  department = departmentSample,
  year,
  color,
  logoType,
  ...props
}: FooterCompactProps) {
  return (
    <Footer {...props} color={color} acknowledgement={false} smallPrint={false}>
      <div className='flex items-center py-2 max-lg:flex-col max-lg:gap-4 lg:flex-row lg:gap-8'>
        <Logo logoType={logoType ?? footerLogoType(color)} className='h-8 w-auto shrink-0' />
        {/* Labelled because this nav sits alongside the site's other landmarks;
            "Footer" distinguishes it in a screen reader's landmark list. */}
        <nav
          aria-label='Footer'
          className='flex flex-wrap gap-x-4 gap-y-2 text-sm max-lg:justify-center lg:justify-start'
        >
          {legalLinks.map((item) => (
            <FooterNavLink key={item.name} href={item.href}>
              {item.name}
            </FooterNavLink>
          ))}
        </nav>
        <FooterSmallPrint
          department={department}
          socialLinks={socialLinks}
          year={year}
          // pt-0 removes the stacked-layout spacing: in this bar the row is the
          // layout, not a section below one.
          className='gap-4 pt-0 lg:ml-auto'
        />
      </div>
    </Footer>
  )
}

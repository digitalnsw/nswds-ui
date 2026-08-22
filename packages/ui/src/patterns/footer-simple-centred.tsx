import type * as React from 'react'

import {
  Footer,
  FooterAcknowledgement,
  FooterLegalLinks,
  footerLogoType,
  FooterSmallPrint,
} from '../components/footer.js'
import { Logo } from '../components/logo.js'
import { Separator } from '../components/separator.js'

// ── Sample content — replace with your service's own ────────────────────────
const legalLinksSample = [
  { name: 'Accessibility', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Copyright', href: '#copyright' },
  { name: 'Contact us', href: '#contact' },
]

const departmentSample = 'Digital NSW, Department of Customer Service'

type FooterSimpleCentredProps = Omit<
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
 * Everything centred under the NSW Government logo — the smallest footer that
 * still carries acknowledgement of Country, legal links and ownership. Suits a
 * single-purpose service or campaign site with no site map to show.
 *
 * Composes the parts directly inside a bare `Footer` (rather than using its
 * `legalLinks` prop) because the built-in link row left-aligns from `lg` up,
 * and this layout stays centred at every width.
 *
 * The logo treatment is DERIVED from `color` (see `footerLogoType`) rather than
 * left to the caller: `default` is blue-800 on light and white on dark, which
 * is right for a surface that is light in light mode, but on one that is dark
 * in BOTH themes (`-600`/`-800`) it paints the wordmark in nsw-blue-800 — the
 * same value as `primary-800`, so the mark vanished at 1:1 contrast. Pass
 * `logoType` explicitly only for a surface this block does not own.
 */
export function FooterSimpleCentred({
  legalLinks = legalLinksSample,
  socialLinks,
  department = departmentSample,
  year,
  color,
  logoType,
  ...props
}: FooterSimpleCentredProps) {
  return (
    <Footer {...props} color={color} acknowledgement={false} smallPrint={false}>
      <div className='flex justify-center py-4'>
        <Logo logoType={logoType ?? footerLogoType(color)} className='h-14 w-auto' />
      </div>
      <FooterAcknowledgement className='justify-center'>
        <span className='mx-auto block max-w-2xl text-center'>
          We acknowledge the Traditional Custodians of the land on which we work and live, and pay
          our respects to Elders past, present and emerging.
        </span>
      </FooterAcknowledgement>
      <Separator decorative className='my-4 bg-(--footer-border)' />
      <FooterLegalLinks legalLinks={legalLinks} className='lg:justify-center' />
      <FooterSmallPrint
        department={department}
        socialLinks={socialLinks}
        year={year}
        className='sm:flex-col lg:[&>p]:text-center'
      />
    </Footer>
  )
}

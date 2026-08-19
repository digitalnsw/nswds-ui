// Copied from packages/ui/src/patterns/footer-simple-centred.tsx for the docs live preview,
// with imports rewritten to the published @nswds/ui surface — the same
// copy-and-adapt flow registry consumers use. Regenerate by re-copying the
// source if the upstream pattern changes.
import type * as React from 'react'

import {
  Footer,
  FooterAcknowledgement,
  FooterLegalLinks,
  FooterSmallPrint,
  Logo,
  Separator,
} from '@nswds/ui'

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
>

/**
 * Everything centred under the NSW Government logo — the smallest footer that
 * still carries acknowledgement of Country, legal links and ownership. Suits a
 * single-purpose service or campaign site with no site map to show.
 *
 * Composes the parts directly inside a bare `Footer` (rather than using its
 * `legalLinks` prop) because the built-in link row left-aligns from `lg` up,
 * and this layout stays centred at every width.
 *
 * `logoType='default'` is correct for any surface that is light in light mode
 * and dark in dark mode — the logo is blue-800 on light, white on dark. On a
 * surface that is dark in BOTH themes (`-600`/`-800` colours) switch to
 * `logoType='mono-white'`, or the mark disappears into the background.
 */
export function FooterSimpleCentred({
  legalLinks = legalLinksSample,
  socialLinks,
  department = departmentSample,
  year,
  ...props
}: FooterSimpleCentredProps) {
  return (
    <Footer {...props} acknowledgement={false} smallPrint={false}>
      <div className='flex justify-center py-4'>
        <Logo className='h-14 w-auto' />
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

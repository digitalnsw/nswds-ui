import type * as React from 'react'

import { Footer, FooterNav, FooterNavColumn, FooterNavLink } from '../components/footer.js'
import { IconCall } from '../icons/call.js'
import { IconLocationOn } from '../icons/location-on.js'
import { IconMail } from '../icons/mail.js'

// ── Sample content — replace with your service's own ────────────────────────
const contactSample = {
  phone: { label: '13 77 88', href: 'tel:+61137788' },
  email: { label: 'info@service.nsw.gov.au', href: 'mailto:info@service.nsw.gov.au' },
  address: ['McKell Building, 2-24 Rawson Place', 'Sydney NSW 2000'],
  hours: 'Monday to Friday, 7am – 7pm',
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

type FooterContactProps = Omit<React.ComponentProps<typeof Footer>, 'children'> & {
  columns?: typeof columnsSample
  contact?: typeof contactSample
}

/**
 * Contact details beside the site map — phone, email, street address and
 * opening hours. The right choice for a service people need to reach a human
 * about, where burying "Contact us" in a link column would be a disservice.
 *
 * The details sit in an `<address>` element, which is the correct semantic for
 * contact information about the enclosing document. Phone and email are real
 * `tel:` / `mailto:` links so they are actionable on a phone.
 */
export function FooterContact({
  columns = columnsSample,
  contact = contactSample,
  legalLinks = legalLinksSample,
  department = departmentSample,
  ...props
}: FooterContactProps) {
  return (
    <Footer legalLinks={legalLinks} department={department} {...props}>
      <div className='grid gap-8 py-4 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16'>
        <div className='flex flex-col gap-3'>
          <h2 className='text-sm font-bold text-(--footer-ink)'>Contact us</h2>
          {/* not-italic: browsers italicise <address> by default. */}
          <address className='flex flex-col gap-3 text-sm text-(--footer-ink) not-italic'>
            <span className='flex items-start gap-2'>
              <IconCall className='mt-0.5 size-4 shrink-0 fill-current' aria-hidden='true' />
              <FooterNavLink href={contact.phone.href}>{contact.phone.label}</FooterNavLink>
            </span>
            <span className='flex items-start gap-2'>
              <IconMail className='mt-0.5 size-4 shrink-0 fill-current' aria-hidden='true' />
              <FooterNavLink href={contact.email.href}>{contact.email.label}</FooterNavLink>
            </span>
            <span className='flex items-start gap-2'>
              <IconLocationOn className='mt-0.5 size-4 shrink-0 fill-current' aria-hidden='true' />
              <span className='flex flex-col'>
                {contact.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </span>
          </address>
          <p className='text-sm text-(--footer-ink)'>{contact.hours}</p>
        </div>
        <FooterNav className='py-0 lg:grid-cols-2'>
          {columns.map((column) => (
            <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
          ))}
        </FooterNav>
      </div>
    </Footer>
  )
}

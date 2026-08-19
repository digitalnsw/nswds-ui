'use client'

// Copied from packages/ui/src/patterns/footer-newsletter.tsx for the docs live preview,
// with imports rewritten to the published @nswds/ui surface — the same
// copy-and-adapt flow registry consumers use. Regenerate by re-copying the
// source if the upstream pattern changes.

import type * as React from 'react'

import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Footer,
  FooterNav,
  FooterNavColumn,
  Input,
} from '@nswds/ui'
import { IconMail } from '@nswds/ui/icons/mail'

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
]

const legalLinksSample = [
  { name: 'Accessibility', href: '#accessibility' },
  { name: 'Privacy', href: '#privacy' },
  { name: 'Copyright', href: '#copyright' },
]

const departmentSample = 'Digital NSW, Department of Customer Service'

type FooterNewsletterProps = Omit<React.ComponentProps<typeof Footer>, 'children'> & {
  columns?: typeof columnsSample
  /** Called with the submitted email. Wire this to your subscription service. */
  onSubscribe?: (email: string) => void
}

/**
 * Link columns beside an email subscription form. Use for services that
 * publish updates people opt into — grant rounds, policy changes, alerts.
 *
 * The form is a worked example: it prevents the default submit and hands the
 * address to `onSubscribe`. Replace that with your own submission, and note
 * that collecting an email address makes this a collection point under the
 * PPIP Act — your privacy collection notice belongs next to the field.
 *
 * The label is a real `FieldLabel` inside a `Field`, so Base UI associates it
 * with the input and generates per-instance ids; two of these on one page will
 * not collide. Do not swap it for a placeholder — placeholders disappear on
 * input and are not an accessible name.
 */
export function FooterNewsletter({
  columns = columnsSample,
  legalLinks = legalLinksSample,
  department = departmentSample,
  onSubscribe,
  ...props
}: FooterNewsletterProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email')
    if (typeof email === 'string') {
      onSubscribe?.(email)
    }
  }

  return (
    <Footer legalLinks={legalLinks} department={department} {...props}>
      <div className='grid py-4 max-lg:gap-8 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-16'>
        <FooterNav className='py-0 lg:grid-cols-2'>
          {columns.map((column) => (
            <FooterNavColumn key={column.heading} heading={column.heading} links={column.links} />
          ))}
        </FooterNav>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <Field>
            {/* Inherits the footer's ink from the root — Label sets no colour
                of its own, so it tracks the surface automatically. */}
            <FieldLabel className='text-sm font-bold'>Subscribe to updates</FieldLabel>
            <div className='flex gap-3 max-sm:flex-col sm:flex-row'>
              <Input
                type='email'
                name='email'
                autoComplete='email'
                placeholder='you@example.com'
                required
              />
              <Button type='submit' leadingVisual={IconMail} className='shrink-0'>
                Subscribe
              </Button>
            </div>
            {/* text-muted-foreground is theme-driven, not surface-driven, so it
                can wash out on a coloured footer — pin it to the ink instead. */}
            <FieldDescription className='text-(--footer-ink)'>
              Occasional updates about this service. Unsubscribe at any time.
            </FieldDescription>
          </Field>
        </form>
      </div>
    </Footer>
  )
}

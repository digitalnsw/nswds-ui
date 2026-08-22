'use client'

import * as React from 'react'

import { Button } from '../components/button.js'
import { Field, FieldDescription, FieldLabel } from '../components/field.js'
import { Footer, FooterNav, FooterNavColumn } from '../components/footer.js'
import { Input } from '../components/input.js'
import { IconMail } from '../icons/mail.js'

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

type SubscribeStatus = 'idle' | 'pending' | 'success' | 'error'

type FooterNewsletterProps = Omit<React.ComponentProps<typeof Footer>, 'children'> & {
  columns?: typeof columnsSample
  /**
   * Called with the submitted email. Wire this to your subscription service.
   *
   * May return a promise: the form awaits it, disables the button while it is
   * pending, and reports success or failure. A rejection is caught and shown
   * to the reader, so the handler should reject on failure rather than
   * swallowing it — otherwise every submission reports success.
   */
  onSubscribe?: (email: string) => void | Promise<void>
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
  const [status, setStatus] = React.useState<SubscribeStatus>('idle')

  // Re-entrancy guard. A ref rather than a `status` check because it is written
  // and read synchronously: two submits dispatched in the same tick both close
  // over the status from the render that attached the handler, so a state read
  // cannot see the first one land.
  //
  // The disabled submit button already blocks the keyboard route — measured,
  // Enter while pending fires no second call, because implicit submission runs
  // the default button's activation behaviour and a disabled button has none.
  // `form.requestSubmit()` ignores the button entirely and did start a second
  // overlapping call. That route matters here: this is a registry block that
  // consumers copy and add their own controls to, so the invariant belongs in
  // the handler rather than in one particular button's disabled state.
  const pendingRef = React.useRef(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pendingRef.current) {
      return
    }
    // Captured BEFORE the await. React's dispatch loop assigns
    // `event.currentTarget` for the listener and clears it the moment the
    // listener returns — and an async function returns at its first `await`,
    // so by the time the promise settles it is already null. This is that
    // per-dispatch cleanup, not the SyntheticEvent pooling React removed in
    // v17; pooling is gone, but the currentTarget reset is not.
    const form = event.currentTarget
    const email = new FormData(form).get('email')
    if (typeof email !== 'string') {
      return
    }
    if (process.env.NODE_ENV !== 'production' && !onSubscribe) {
      // Without a handler nothing is sent anywhere, yet `await undefined`
      // resolves and the form would confirm a subscription that never
      // happened. The block still shows the success state — it is a template,
      // and seeing the flow is the point — but the developer is told. Same
      // dev-only convention as the guards in button.tsx and push-menu.tsx;
      // compiled out in production.
      console.warn(
        '[nswds/ui] FooterNewsletter has no `onSubscribe` handler — the form reports success without sending anything. Wire it to your subscription service.',
      )
    }
    pendingRef.current = true
    setStatus('pending')
    try {
      await onSubscribe?.(email)
      setStatus('success')
      // Clear the field so the confirmation is not sitting under the address
      // that produced it, which reads as "not sent yet".
      form.reset()
    } catch {
      // The address is deliberately left in the field — making someone retype
      // it after a failure they did not cause is the wrong side of the
      // goodwill ledger.
      setStatus('error')
    } finally {
      // Both paths: a rejection that left this set would wedge the form for
      // the rest of the session.
      pendingRef.current = false
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
              <Button
                type='submit'
                leadingVisual={IconMail}
                loading={status === 'pending'}
                disabled={status === 'pending'}
                className='shrink-0'
              >
                Subscribe
              </Button>
            </div>
            {/* text-muted-foreground is theme-driven, not surface-driven, so it
                can wash out on a coloured footer — pin it to the ink instead. */}
            <FieldDescription className='text-(--footer-ink)'>
              Occasional updates about this service. Unsubscribe at any time.
            </FieldDescription>
            {/* A PERSISTENT live region, empty until there is something to
                say. A region mounted at the same moment as its text is not
                reliably announced — the same constraint PushMenu documents for
                its level announcements — so the element has to already be in
                the tree when the message arrives.

                One polite region for both outcomes rather than status/alert
                swapped by state: the role of a live region is read when it is
                created, so switching it per render is unreliable, and a failed
                newsletter signup does not warrant interrupting whatever the
                reader is doing.

                Both messages are ink-coloured rather than using the danger
                ramp. The ramp is theme-driven, not surface-driven, so a red on
                `primary-800` or `accent-800` would be the low-contrast trap the
                FieldDescription note above avoids. Weight and wording carry the
                distinction visually; the live region carries it for AT. */}
            <p role='status' aria-live='polite' className='text-sm font-bold text-(--footer-ink)'>
              {status === 'success'
                ? 'Thanks — check your inbox to confirm your subscription.'
                : status === 'error'
                  ? 'Sorry, that did not go through. Please try again.'
                  : null}
            </p>
          </Field>
        </form>
      </div>
    </Footer>
  )
}

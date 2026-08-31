'use client'

import * as React from 'react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/collapsible.js'
import { Footer, FooterNavLink } from '../components/footer.js'
import { IconExpandMore } from '../icons/expand-more.js'

// ── Sample content — replace with your service's own ────────────────────────
const columnsSample = [
  {
    heading: 'Services',
    links: [
      { name: 'Apply for a licence', href: '#licence' },
      { name: 'Renew a registration', href: '#renew' },
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
      { name: 'Annual reports', href: '#reports' },
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
      { name: 'Interpreting services', href: '#interpreting' },
    ],
  },
  {
    heading: 'Popular',
    links: [
      { name: 'Service NSW', href: '#service-nsw' },
      { name: 'Digital NSW', href: '#digital-nsw' },
      { name: 'Data.NSW', href: '#data-nsw' },
      { name: 'Have your say', href: '#have-your-say' },
      { name: 'NSW Government jobs', href: '#jobs' },
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

type FooterAccordionProps = Omit<React.ComponentProps<typeof Footer>, 'children'> & {
  columns?: typeof columnsSample
}

/**
 * A long site map that collapses into accordions on small screens and lays out
 * as plain columns from `lg` up. Use when there are more links than a mobile
 * footer can show without burying the legal row and copyright below a wall of
 * text.
 *
 * How the breakpoint behaviour works, and why it is safe:
 *
 * - Columns render OPEN on the server and on first paint, so the markup is
 *   identical on both sides of hydration — no mismatch — and a visitor with
 *   JavaScript disabled gets every link, because the collapse only ever
 *   happens in an effect.
 * - After mount, the block collapses them below `lg` and forces them open at
 *   or above it. The disclosure buttons are hidden from `lg` up, so on desktop
 *   there is nothing to toggle and nothing extra in the tab order.
 * - Which layout is active is read from a zero-size PROBE element carrying the
 *   same `lg:hidden` utility as the disclosure buttons, not from a `matchMedia`
 *   query restating the breakpoint in JS. Tailwind v4 lets a consumer retheme
 *   `--breakpoint-lg`, and a hardcoded `(min-width: 64rem)` would then disagree
 *   with the layout it is supposed to describe — collapsing columns whose
 *   triggers are hidden, leaving links unreachable. Reading the probe makes
 *   that impossible by construction: the CSS is the only definition.
 *
 * Known trade-off: because the server render is open, a mobile visitor sees the
 * expanded site map for one frame before the collapse lands. That is accepted
 * deliberately — the alternative is a collapsed server render, which would put
 * every footer link behind a button that does not work without JavaScript. The
 * flash costs a moment of layout shift; the alternative costs the links.
 *
 * Base UI's Collapsible owns the `aria-expanded` / `aria-controls` wiring and
 * the keyboard behaviour — the block only decides which columns are open.
 */
export function FooterAccordion({
  columns = columnsSample,
  legalLinks = legalLinksSample,
  department = departmentSample,
  ...props
}: FooterAccordionProps) {
  // Starts `true` so the server render, the pre-hydration paint and the no-JS
  // experience all show the full site map. Never initialise this from
  // `window` — that is what would desync hydration.
  const [isDesktop, setIsDesktop] = React.useState(true)
  const [openColumns, setOpenColumns] = React.useState<string[]>([])
  const probeRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const probe = probeRef.current
    const view = probe?.ownerDocument.defaultView
    if (!probe || !view) {
      return
    }
    // The probe carries `lg:hidden`, the same utility that hides the
    // disclosure buttons, so "the probe computes to display:none" IS "the
    // desktop layout is active" — by construction, with the breakpoint stated
    // once, in CSS. `resize` covers viewport changes and browser zoom, which
    // is every way this can flip.
    const sync = () => setIsDesktop(view.getComputedStyle(probe).display === 'none')

    sync()
    view.addEventListener('resize', sync)
    return () => view.removeEventListener('resize', sync)
  }, [])

  return (
    <Footer legalLinks={legalLinks} department={department} {...props}>
      {/* Layout probe — see the effect above. Out of flow and zero-size, so it
          cannot affect layout, and aria-hidden so it cannot reach AT. Not
          `sr-only`: that utility exists to EXPOSE content to screen readers,
          which is the opposite of this element's job. */}
      <span ref={probeRef} aria-hidden='true' className='absolute size-0 lg:hidden' />
      <nav aria-label='Site map' className='grid py-4 max-lg:gap-0 lg:grid-cols-4 lg:gap-8'>
        {columns.map((column) => (
          <Collapsible
            key={column.heading}
            open={isDesktop || openColumns.includes(column.heading)}
            onOpenChange={(open) =>
              setOpenColumns((current) =>
                open
                  ? [...current, column.heading]
                  : current.filter((heading) => heading !== column.heading),
              )
            }
            // Rules separate the stacked accordions on mobile; from lg the
            // columns sit side by side and the rules would be noise.
            className='border-(--footer-border) max-lg:border-b lg:border-b-0'
          >
            {/* Two headings, exactly one displayed at a time — the hidden one
                is display:none, so it is absent from the accessibility tree
                rather than duplicated in it. Mobile follows the WAI-ARIA
                accordion pattern (a button INSIDE the heading, never instead
                of it: rendering the trigger AS an h2 would strip the button
                role and its keyboard behaviour). Desktop has nothing to
                disclose, so a plain heading takes over. */}
            <h2 className='py-3 text-sm font-bold text-(--footer-ink) max-lg:hidden lg:block'>
              {column.heading}
            </h2>
            <h2 className='lg:hidden'>
              <CollapsibleTrigger className='group flex w-full cursor-pointer items-center justify-between gap-2 py-4 text-left text-sm font-bold text-(--footer-ink) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--footer-ink)'>
                {column.heading}
                <IconExpandMore
                  aria-hidden='true'
                  className='size-5 shrink-0 fill-current group-aria-expanded:rotate-180 motion-safe:transition-transform'
                />
              </CollapsibleTrigger>
            </h2>
            <CollapsibleContent>
              <ul className='flex list-none flex-col gap-2 text-sm max-lg:pb-4 lg:pb-0'>
                {column.links.map((link) => (
                  <li key={link.name}>
                    <FooterNavLink href={link.href}>{link.name}</FooterNavLink>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>
    </Footer>
  )
}

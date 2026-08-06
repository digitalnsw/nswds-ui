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

/** Matches Tailwind's `lg` breakpoint (64rem). Keep the two in step. */
const DESKTOP_QUERY = '(min-width: 64rem)'

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
 * - After mount, a `matchMedia` listener collapses them below `lg` and forces
 *   them open at or above it. The disclosure buttons are hidden from `lg` up,
 *   so on desktop there is nothing to toggle and nothing extra in the tab
 *   order.
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

  React.useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const sync = () => setIsDesktop(query.matches)

    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <Footer legalLinks={legalLinks} department={department} {...props}>
      <nav aria-label='Site map' className='grid gap-0 py-4 lg:grid-cols-4 lg:gap-8'>
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
            className='border-b border-(--footer-border) lg:border-b-0'
          >
            {/* Two headings, exactly one displayed at a time — the hidden one
                is display:none, so it is absent from the accessibility tree
                rather than duplicated in it. Mobile follows the WAI-ARIA
                accordion pattern (a button INSIDE the heading, never instead
                of it: rendering the trigger AS an h2 would strip the button
                role and its keyboard behaviour). Desktop has nothing to
                disclose, so a plain heading takes over. */}
            <h2 className='hidden py-3 text-sm font-bold text-(--footer-ink) lg:block'>
              {column.heading}
            </h2>
            <h2 className='lg:hidden'>
              <CollapsibleTrigger className='group flex w-full cursor-pointer items-center justify-between gap-2 py-4 text-left text-sm font-bold text-(--footer-ink) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--footer-ink)'>
                {column.heading}
                <IconExpandMore
                  aria-hidden='true'
                  className='size-5 shrink-0 fill-current transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none'
                />
              </CollapsibleTrigger>
            </h2>
            <CollapsibleContent>
              <ul className='flex list-none flex-col gap-2 pb-4 text-sm lg:pb-0'>
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

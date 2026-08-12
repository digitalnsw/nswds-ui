import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils.js'

import { ButtonLink } from '../components/button.js'
import { Link } from '../components/link.js'
import { Separator } from '../components/separator.js'

/**
 * Surface colours the footer can be themed with. Each one names its LIGHT-mode
 * surface; dark mode deepens it onto the same family's dark steps (see the
 * `color` variants below), so `color` expresses tonal weight rather than a
 * literal colour.
 *
 * Every light pair clears WCAG 2.2 AA (1.4.3, 4.5:1) for the footer's smallest
 * text and 11 of the 13 also clear AAA (1.4.6, 7:1). The two AA-only pairs are
 * `primary-600` (4.57:1) and `accent-600` (5.18:1), both with white ink; prefer
 * the `-800` steps when a service is held to AAA. In dark mode all thirteen
 * clear AAA (worst 13.6:1).
 *
 * Unlike `Masthead` — which is restricted to verified AAA pairs because it is
 * legally-mandated identification — the footer carries supporting content, so
 * the full tonal range is offered here.
 */
const footerColors = [
  'primary-800',
  'primary-600',
  'primary-400',
  'primary-200',
  'grey-800',
  'grey-600',
  'grey-400',
  'grey-200',
  'accent-800',
  'accent-600',
  'accent-400',
  'accent-200',
  'white',
] as const

type FooterColor = (typeof footerColors)[number]

// Shared by cva's defaultVariants and the data-color attribute, so the two
// can't drift apart.
const DEFAULT_FOOTER_COLOR: FooterColor = 'white'

const footerVariants = cva(
  [
    'w-full',
    // Every derived colour in the footer resolves from a single --footer-ink
    // token, so a colour variant only has to declare the surface utilities and
    // that one value. The derivations are written literally here (once) rather
    // than per-variant: Tailwind scans source text for class names, so a
    // template-built arbitrary property would never be emitted.
    //
    // Mirrors the color-mix derivation in link.tsx (--link-halo).
    '[--footer-border:color-mix(in_oklch,var(--footer-ink)_15%,transparent)]',
    '[--footer-halo:color-mix(in_oklch,var(--footer-ink)_10%,transparent)]',
    '[--footer-halo-active:color-mix(in_oklch,var(--footer-ink)_18%,transparent)]',
  ],
  {
    variants: {
      // Ink values use the RAW masterbrand tokens (--primary-800, --grey-800,
      // --accent-800) rather than Tailwind's --color-* bridge aliases. Tailwind
      // v4 tree-shakes an unreferenced @theme key, and referencing one from
      // inside an arbitrary property is not a usage signal — the raw tokens are
      // plain :root declarations from @nswds/tokens and always resolve.
      // (--color-white is safe: `text-white` / `bg-white` below are real
      // utilities, so that key is always emitted.)
      //
      // Note: a bracketed example in a comment here would itself be scanned by
      // Tailwind and emitted as a dead rule — keep such examples out of prose.
      // Dark mode deepens every surface onto the same family's dark steps —
      // -800→-950, -600→-900, -400→-850, -200→-800, white→grey-900 — so the
      // luminance ORDER within a family is preserved: the variant named for the
      // heaviest tone stays the heaviest. Ink goes white on all thirteen, and
      // every dark pair is WCAG 2.2 AAA (worst 13.6:1) — better than light
      // mode, where primary-600 and accent-600 are AA-only.
      color: {
        'primary-800':
          'bg-primary-800 text-white [--footer-ink:var(--color-white)] dark:bg-primary-950',
        'primary-600':
          'bg-primary-600 text-white [--footer-ink:var(--color-white)] dark:bg-primary-900',
        'primary-400':
          'bg-primary-400 text-primary-800 [--footer-ink:var(--primary-800)] dark:bg-primary-850 dark:text-white dark:[--footer-ink:var(--color-white)]',
        'primary-200':
          'bg-primary-200 text-primary-800 [--footer-ink:var(--primary-800)] dark:bg-primary-800 dark:text-white dark:[--footer-ink:var(--color-white)]',
        'grey-800': 'bg-grey-800 text-white [--footer-ink:var(--color-white)] dark:bg-grey-950',
        'grey-600': 'bg-grey-600 text-white [--footer-ink:var(--color-white)] dark:bg-grey-900',
        'grey-400':
          'bg-grey-400 text-grey-800 [--footer-ink:var(--grey-800)] dark:bg-grey-850 dark:text-white dark:[--footer-ink:var(--color-white)]',
        'grey-200':
          'bg-grey-200 text-grey-800 [--footer-ink:var(--grey-800)] dark:bg-grey-800 dark:text-white dark:[--footer-ink:var(--color-white)]',
        'accent-800':
          'bg-accent-800 text-white [--footer-ink:var(--color-white)] dark:bg-accent-950',
        'accent-600':
          'bg-accent-600 text-white [--footer-ink:var(--color-white)] dark:bg-accent-900',
        'accent-400':
          'bg-accent-400 text-accent-800 [--footer-ink:var(--accent-800)] dark:bg-accent-850 dark:text-white dark:[--footer-ink:var(--color-white)]',
        'accent-200':
          'bg-accent-200 text-accent-800 [--footer-ink:var(--accent-800)] dark:bg-accent-800 dark:text-white dark:[--footer-ink:var(--color-white)]',
        white:
          'bg-white text-grey-800 [--footer-ink:var(--grey-800)] dark:bg-grey-900 dark:text-white dark:[--footer-ink:var(--color-white)]',
      },
    },
    defaultVariants: {
      color: DEFAULT_FOOTER_COLOR,
    },
  },
)

const footerContainerVariants = cva(
  [
    'mx-auto flex w-full flex-col max-sm:py-6 sm:py-8',
    // Lateral padding funnels through --footer-padding-x so an app can retune
    // it once (via the `style` prop or a utility class) without a new variant.
    // Same mechanism, and the same 16px → 24px → 48px rhythm, as the Masthead.
    'px-(--footer-padding-x)',
    '[--footer-padding-x:--spacing(4)] sm:[--footer-padding-x:--spacing(6)] lg:[--footer-padding-x:--spacing(12)]',
  ],
  {
    variants: {
      container: {
        // Full-bleed (nswds-app parity). --footer-max-width is still read so a
        // shell app can constrain the inner wrapper without switching variants.
        fluid: 'max-w-[var(--footer-max-width,none)]',
        // Centred content column, legacy nsw-container parity (1200px).
        contained: 'max-w-[var(--footer-max-width,75rem)]',
      },
    },
    defaultVariants: {
      container: 'fluid',
    },
  },
)

/** A link rendered anywhere in the footer — legal row or site-map column. */
type FooterLinkItem = {
  /** Visible link text, e.g. "Privacy". */
  name: string
  href: string
}

/** Alias kept for the legal-links context, where the name reads better. */
type FooterLegalLinkItem = FooterLinkItem

/** A social channel rendered as an icon-only link in the small print row. */
type FooterSocialLinkItem = {
  /** Channel name, e.g. "LinkedIn". Used to build the accessible name. */
  name: string
  href: string
  /**
   * Icon component for the channel. Brand marks (LinkedIn, X, Facebook…) are
   * not part of the NSWDS icon set — which is Material Symbols — so the mark is
   * supplied by the consuming app. It is rendered through `ButtonLink`'s
   * `leadingVisual` slot, which sizes and colours it.
   */
  icon: React.ElementType
  /**
   * Accessible name for the link. Defaults to `Follow us on {name}`.
   */
  label?: string
}

// One link treatment for the whole footer — legal row and site-map columns
// alike — so a consumer never has to reason about which kind they are styling.
const footerLinkClassName = [
  // Negative margin + padding keeps the hover/focus halo from shifting layout.
  '-m-1 rounded-sm p-1 text-(--footer-ink)',
  'underline decoration-current underline-offset-4',
  'motion-safe:transition-colors',
  'hover:bg-(--footer-halo) hover:decoration-2',
  'active:bg-(--footer-halo-active) active:decoration-2',
  // outline-(--footer-ink) guarantees the indicator contrasts with the surface
  // on every colour variant (2.4.13 Focus Appearance).
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--footer-ink)',
].join(' ')

// Repoints ButtonLink's ghost-variant tokens at the footer's ink and halos so
// the social buttons follow the surface colour instead of the button palette.
const footerSocialLinkClassName = [
  '[--btn-bg:var(--footer-ink)]',
  '[--btn-icon:var(--footer-ink)]',
  '[--btn-transparent:transparent]',
  '[--btn-hover-overlay:var(--footer-halo)]',
  '[--btn-active-overlay:var(--footer-halo-active)]',
].join(' ')

type FooterSocialLinkProps = Omit<
  React.ComponentPropsWithoutRef<typeof ButtonLink>,
  'children' | 'color' | 'leadingVisual' | 'size' | 'variant'
> & {
  icon: React.ElementType
  /** Accessible name, e.g. "Follow us on LinkedIn". */
  label: string
}

/**
 * Icon-only link to a social channel. Renders through `ButtonLink`, so it
 * picks up the framework link component from `LinkProvider` and the 44px touch
 * target. The label is supplied as `aria-label` — there is no visible text.
 */
function FooterSocialLink({ className, icon, label, ...props }: FooterSocialLinkProps) {
  return (
    <ButtonLink
      data-slot='footer-social-link'
      {...props}
      aria-label={label}
      variant='ghost'
      size='icon'
      leadingVisual={icon}
      className={cn(footerSocialLinkClassName, className)}
    />
  )
}

type FooterAcknowledgementProps = React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Acknowledgement of Country. Renders the standard NSW Government wording
 * unless `children` are supplied — pass your own text when an agency has
 * agreed different wording with the relevant Traditional Custodians.
 */
function FooterAcknowledgement({ className, children, ref, ...props }: FooterAcknowledgementProps) {
  return (
    <div
      data-slot='footer-acknowledgement'
      {...props}
      className={cn('flex flex-row items-center gap-5 py-4', className)}
      ref={ref}
    >
      <p className='text-base text-pretty text-(--footer-ink) max-lg:text-center lg:text-left'>
        {children ??
          'We acknowledge the Traditional Custodians of the land on which we work and live, and pay our respects to Elders past, present and emerging.'}
      </p>
    </div>
  )
}

type FooterLegalLinksProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> & {
  legalLinks: FooterLegalLinkItem[]
  ref?: React.Ref<HTMLElement>
}

/**
 * Navigation landmark holding the footer's supporting/legal links. Renders
 * nothing when `legalLinks` is empty, so an empty landmark is never exposed to
 * assistive tech.
 */
function FooterLegalLinks({
  className,
  legalLinks,
  'aria-label': ariaLabel = 'Footer',
  ref,
  ...props
}: FooterLegalLinksProps) {
  if (legalLinks.length === 0) {
    return null
  }

  return (
    <nav
      data-slot='footer-legal-links'
      {...props}
      aria-label={ariaLabel}
      className={cn(
        'flex flex-wrap gap-x-4 gap-y-3 py-4 text-sm max-lg:justify-center lg:justify-start',
        className,
      )}
      ref={ref}
    >
      {legalLinks.map((item) => (
        // variant='unstyled' — the footer supplies its own link treatment,
        // derived from --footer-ink so it tracks the surface colour. Link's own
        // variants are pinned to the primary palette (and flip in dark mode),
        // which would break on a coloured footer.
        <Link key={item.name} variant='unstyled' href={item.href} className={footerLinkClassName}>
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

type FooterNavLinkProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, 'variant'>

/**
 * A single site-map link, carrying the same ink-derived treatment as the legal
 * row. Exposed so a bespoke column layout (a mobile accordion, say) can match
 * the built-in columns without copying class strings.
 */
function FooterNavLink({ className, ...props }: FooterNavLinkProps) {
  return (
    <Link
      data-slot='footer-nav-link'
      variant='unstyled'
      {...props}
      className={cn(footerLinkClassName, className)}
    />
  )
}

type FooterNavProps = React.ComponentPropsWithoutRef<'nav'> & {
  ref?: React.Ref<HTMLElement>
}

/**
 * Navigation landmark wrapping the footer's site-map columns.
 *
 * One landmark for the whole site map rather than one per column: a large
 * footer would otherwise add five nav landmarks to the page, burying the ones
 * that matter when a screen-reader user lists them. Columns are headed lists
 * inside it. The default four-column grid is overridable — `cn` lets a
 * `lg:grid-cols-3` on `className` win.
 */
function FooterNav({
  className,
  'aria-label': ariaLabel = 'Site map',
  ref,
  ...props
}: FooterNavProps) {
  return (
    <nav
      data-slot='footer-nav'
      {...props}
      aria-label={ariaLabel}
      className={cn('grid gap-8 py-4 sm:max-lg:grid-cols-2 lg:grid-cols-4', className)}
      ref={ref}
    />
  )
}

type FooterNavColumnProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  heading: React.ReactNode
  links: FooterLinkItem[]
  /**
   * Heading level for the column title. Defaults to `2` — correct when the
   * footer sits at the top level of the document outline. Step it down if the
   * surrounding page nests the footer under another heading, so the outline
   * stays in order (WCAG 1.3.1).
   *
   * The two bounds are not symmetric. `6` is simply the deepest heading HTML
   * defines. `1` is excluded on purpose: a site-map column title is never the
   * page's own title, so an `h1` here would be the very outline error the prop
   * exists to avoid.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  ref?: React.Ref<HTMLDivElement>
}

/** A headed column of site-map links. Sits inside `FooterNav`. */
function FooterNavColumn({
  className,
  heading,
  links,
  headingLevel = 2,
  ref,
  ...props
}: FooterNavColumnProps) {
  const Heading = `h${headingLevel}` as const

  return (
    <div
      data-slot='footer-nav-column'
      {...props}
      className={cn('flex flex-col gap-3', className)}
      ref={ref}
    >
      <Heading className='text-sm font-bold text-(--footer-ink)'>{heading}</Heading>
      <ul className='flex list-none flex-col gap-2 text-sm'>
        {links.map((item) => (
          <li key={item.name}>
            <FooterNavLink href={item.href}>{item.name}</FooterNavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

type FooterSmallPrintProps = React.ComponentPropsWithoutRef<'div'> & {
  /** Owning agency, e.g. "Digital NSW, Department of Customer Service". */
  department?: string
  socialLinks?: FooterSocialLinkItem[]
  /**
   * Copyright year. Defaults to the current year read at render time — which
   * on a server-rendered page is the *server's* year, so a request that
   * straddles new year (or a server in a different timezone to the audience)
   * can hydrate with a mismatch. Pass an explicit year to pin it.
   */
  year?: number
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Copyright line and social channels. `children` replace the generated
 * copyright sentence when an agency needs different wording.
 */
function FooterSmallPrint({
  className,
  department,
  socialLinks,
  year = new Date().getFullYear(),
  children,
  ref,
  ...props
}: FooterSmallPrintProps) {
  return (
    <div
      data-slot='footer-small-print'
      {...props}
      className={cn(
        'flex items-center justify-between gap-5 pt-4 max-sm:flex-col sm:flex-row',
        className,
      )}
      ref={ref}
    >
      <p className='text-sm text-(--footer-ink) max-lg:text-center lg:text-left'>
        {children ?? (
          <>
            &copy; Copyright {year}
            {department ? ` ${department}` : ''}. All rights reserved.
          </>
        )}
      </p>
      {socialLinks && socialLinks.length > 0 && (
        <ul className='flex list-none gap-4 max-lg:justify-center lg:justify-end'>
          {socialLinks.map((item) => (
            <li key={item.name}>
              <FooterSocialLink
                href={item.href}
                icon={item.icon}
                label={item.label ?? `Follow us on ${item.name}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type FooterProps = React.ComponentPropsWithoutRef<'footer'> &
  VariantProps<typeof footerVariants> &
  VariantProps<typeof footerContainerVariants> & {
    /** Supporting/legal links — privacy, accessibility, copyright, etc. */
    legalLinks?: FooterLegalLinkItem[]
    /** Social channels rendered as icon-only links beside the copyright line. */
    socialLinks?: FooterSocialLinkItem[]
    /** Owning agency, named in the copyright line. */
    department?: string
    /**
     * Acknowledgement of Country. `true` (default) renders the standard
     * wording, `false` omits it, and a node replaces the wording.
     */
    acknowledgement?: boolean | React.ReactNode
    /**
     * Copyright line and social channels. Defaults to `true` — the copyright
     * line renders even with no `department` to name, since it is the footer's
     * core content.
     */
    smallPrint?: boolean
    /** Rule along the top edge of the footer content. Defaults to `true`. */
    topBorder?: boolean
    /** Copyright year. See `FooterSmallPrint` for the SSR caveat. */
    year?: number
    /** Classes applied to the inner width-constraining wrapper. */
    containerClassName?: string
    /**
     * Extra content rendered above the acknowledgement — a logo, contact
     * details, or link columns.
     */
    children?: React.ReactNode
    ref?: React.Ref<HTMLElement>
  }

/**
 * End-of-page `contentinfo` landmark: acknowledgement of Country, supporting
 * links, ownership and social channels. Render it once in a shared layout so
 * the same content appears on every page.
 *
 * - `color` themes the surface and names its light-mode tone; dark mode deepens
 *   it onto the same family's dark steps. Every option meets WCAG 2.2 AA in
 *   light mode and AAA in dark (see `footerColors`). All link, border and hover
 *   colours derive from the surface's ink, so they follow automatically in both
 *   themes.
 * - `container` selects the inner wrapper layout: `fluid` (full-bleed,
 *   nswds-app parity) or `contained` (centred 1200px column, legacy
 *   `nsw-container` parity). Fine-tune either with the `--footer-max-width`
 *   and `--footer-padding-x` custom properties.
 * - Each section is independently omissible: `acknowledgement={false}`,
 *   `smallPrint={false}`, or simply pass no `legalLinks` (an empty nav
 *   landmark is never rendered). The rule between the acknowledgement and the
 *   link row appears only when there is content on both sides of it.
 *
 * For a layout this does not cover, compose `FooterAcknowledgement`,
 * `FooterLegalLinks`, `FooterSmallPrint` and `FooterSocialLink` directly
 * inside your own `<footer>` — they all read the same `--footer-*` tokens.
 */
function Footer({
  className,
  color,
  container,
  containerClassName,
  legalLinks = [],
  socialLinks,
  department,
  acknowledgement = true,
  smallPrint = true,
  topBorder = true,
  year,
  children,
  ref,
  ...props
}: FooterProps) {
  // Boolean() rather than `!== false`: an empty string or 0 reaching this prop
  // would otherwise render an empty acknowledgement block.
  const showAcknowledgement = Boolean(acknowledgement)
  const showLegalLinks = legalLinks.length > 0

  return (
    <footer
      data-slot='footer'
      data-color={color ?? DEFAULT_FOOTER_COLOR}
      {...props}
      className={cn(footerVariants({ color }), className)}
      ref={ref}
    >
      <div
        data-slot='footer-container'
        className={cn(footerContainerVariants({ container }), containerClassName)}
      >
        {topBorder && <Separator decorative className='mb-4 bg-(--footer-border)' />}
        {children}
        {showAcknowledgement && (
          <FooterAcknowledgement>
            {acknowledgement === true ? undefined : acknowledgement}
          </FooterAcknowledgement>
        )}
        {/* Only a divider — never a boundary between two empty regions. */}
        {showAcknowledgement && (showLegalLinks || smallPrint) && (
          <Separator decorative className='my-4 bg-(--footer-border)' />
        )}
        {showLegalLinks && <FooterLegalLinks legalLinks={legalLinks} />}
        {smallPrint && (
          <FooterSmallPrint department={department} socialLinks={socialLinks} year={year} />
        )}
      </div>
    </footer>
  )
}

export {
  Footer,
  FooterAcknowledgement,
  footerColors,
  footerContainerVariants,
  FooterLegalLinks,
  FooterNav,
  FooterNavColumn,
  FooterNavLink,
  FooterSmallPrint,
  FooterSocialLink,
  footerVariants,
}
export type {
  FooterAcknowledgementProps,
  FooterColor,
  FooterLegalLinkItem,
  FooterLegalLinksProps,
  FooterLinkItem,
  FooterNavColumnProps,
  FooterNavLinkProps,
  FooterNavProps,
  FooterProps,
  FooterSmallPrintProps,
  FooterSocialLinkItem,
  FooterSocialLinkProps,
}

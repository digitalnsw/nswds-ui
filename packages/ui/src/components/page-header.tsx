import type * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { overlayInk } from '../lib/overlay.js'
import { resolveVariant } from '../lib/resolve-variant.js'
import { cn } from '../lib/utils.js'

/**
 * The colourways a page header's title box can wear. Each sets two custom
 * properties the slots read: `--page-header-box`, the flat band the title is
 * painted on, and `--page-header-rule`, the colour of the short rule under
 * the standfirst. A third, `--page-header-ink`, is the interactive ink
 * (`primary-800` light / `primary-200` dark, the Role-Flip Rule) and is the
 * same in every colourway: the meta row's hairline is drawn in it, and so is
 * the rule everywhere except `red`, where the rule follows the box. The ink
 * is not declared here: it aliases `--overlay-ink` from `overlayInk`
 * (`src/lib/overlay.ts`), the one declaration Breadcrumb and the overlays
 * share, so a retune of the ink stays one edit (AGENTS.md §3).
 *
 * The box fills are palette steps, not role tokens (AGENTS.md §3, recorded
 * exception): `blue` is `primary-600`, the masterbrand's Blue 02 and the
 * colour the Transport for NSW reference uses, which no semantic role
 * carries — `--primary` is the interactive fill and flips to a brighter
 * blue in dark mode, where a brand band should hold still. White on it
 * measures 4.57:1 (the same step Footer and MainNav record), which clears
 * the 4.5:1 normal-text bar of WCAG 2.2 AA 1.4.3 with almost no headroom;
 * the title being large text (32px and up, semibold), where the bar is 3:1,
 * is the safety net under a retuned palette, not what makes it pass. It is
 * theme-invariant, as `red` (`accent-600`, the waratah red) is; `navy`
 * (`primary-800`, the brand band) lifts one step in dark mode, to
 * `primary-700`, so the box stays distinct from a Header `dark` band above
 * it, which deepens to `primary-950`. That partial flip is deliberate and
 * recorded against DESIGN.md's Whole-Set Flip Rule.
 */
const pageHeaderColors = {
  blue: '[--page-header-box:var(--primary-600)] [--page-header-rule:var(--page-header-ink)]',
  navy: [
    '[--page-header-box:var(--primary-800)] dark:[--page-header-box:var(--primary-700)]',
    '[--page-header-rule:var(--page-header-ink)]',
  ].join(' '),
  red: '[--page-header-box:var(--accent-600)] [--page-header-rule:var(--accent-600)]',
}

type PageHeaderColor = keyof typeof pageHeaderColors

const DEFAULT_PAGE_HEADER_COLOR: PageHeaderColor = 'blue'
// Shared by cva's defaultVariants and the `resolveVariant` call in `PageHeader`.
const DEFAULT_PAGE_HEADER_CONTAINER = 'fluid'

const pageHeaderVariants = cva(
  [
    'w-full text-foreground',
    // The interactive ink, flipping for dark mode (DESIGN.md, The Role-Flip
    // Rule), read from the shared declaration rather than restated. The
    // hairline and, outside `red`, the rule read the alias.
    overlayInk,
    '[--page-header-ink:var(--overlay-ink)]',
  ],
  {
    variants: {
      color: pageHeaderColors,
    },
    defaultVariants: {
      color: DEFAULT_PAGE_HEADER_COLOR,
    },
  },
)

/**
 * The inner column, carrying the same lateral rhythm as `Container`, `Hero`
 * and the chrome components (16px → 24px → 48px, funnelled through
 * `--page-header-padding-x`), so the title's text lines up with the Header
 * and Breadcrumb above it. The title box hangs back into that padding by its
 * own horizontal padding, which is why the inset is a property and not a bare
 * utility: a consumer who retunes the column keeps the box on the margin.
 */
const pageHeaderInnerVariants = cva(
  [
    'mx-auto w-full',
    'px-(--page-header-padding-x)',
    '[--page-header-padding-x:--spacing(4)] sm:[--page-header-padding-x:--spacing(6)] lg:[--page-header-padding-x:--spacing(12)]',
    // Vertical rhythm, on the 4px grid: a little air under the breadcrumb,
    // and a full step before the page's first body heading.
    'pt-2 pb-10',
  ],
  {
    variants: {
      container: {
        // Full-bleed, matching the chrome's default. `--page-header-max-width`
        // is still read so a shell app can constrain the column without
        // switching variants.
        fluid: 'max-w-[var(--page-header-max-width,none)]',
        // Centred content column, legacy nsw-container parity (1200px).
        contained: 'max-w-[var(--page-header-max-width,75rem)]',
      },
    },
    defaultVariants: {
      container: DEFAULT_PAGE_HEADER_CONTAINER,
    },
  },
)

// The native `color` attribute is omitted so the prop type admits the `null`
// cva's `VariantProps` allows and the component resolves.
type PageHeaderProps = Omit<React.ComponentPropsWithoutRef<'section'>, 'color'> &
  VariantProps<typeof pageHeaderVariants> &
  VariantProps<typeof pageHeaderInnerVariants> & {
    /**
     * `id` of the `PageHeaderTitle`. Names the section so it is exposed as a
     * `region` landmark; as with `Section` and `Hero`, no fallback name is
     * invented.
     */
    labelledBy?: string
    /** Classes applied to the inner column. */
    innerClassName?: string
    ref?: React.Ref<HTMLElement>
  }

/**
 * The opening of a content page: the page title wearing its own flat colour
 * band, one box per wrapped line, then a standfirst and optionally a short
 * rule or a meta row. It sits under the site's Header and Breadcrumb, which
 * are separate components — a page header renders no breadcrumb of its own.
 * For the opening band of a landing page, with actions and an illustration,
 * use `Hero`.
 *
 * Compose it from its slots:
 *
 * ```tsx
 * <PageHeader labelledBy='page-title'>
 *   <PageHeaderTitle id='page-title'>Discovery Pass</PageHeaderTitle>
 *   <PageHeaderDescription>
 *     Get unlimited travel on NSW TrainLink Regional trains and coaches.
 *   </PageHeaderDescription>
 *   <PageHeaderRule />
 * </PageHeader>
 * ```
 */
function PageHeader({
  className,
  innerClassName,
  color,
  container,
  labelledBy,
  ref,
  children,
  ...props
}: PageHeaderProps) {
  // Resolved once (see `resolveVariant`), so cva and `data-color` agree for
  // `null` and `''` as well as the default spelling, and
  // `container={null}` keeps the inner wrapper's `max-w-[var(--page-header-max-width,…)]`
  // class instead of dropping it.
  const colorway = resolveVariant(color, DEFAULT_PAGE_HEADER_COLOR)
  const containerway = resolveVariant(container, DEFAULT_PAGE_HEADER_CONTAINER)
  return (
    <section
      ref={ref}
      data-slot='page-header'
      aria-labelledby={labelledBy}
      {...props}
      // After the spread, so a consumer's own `data-*` cannot desync the
      // attribute from the classes both derive from the resolved value.
      data-color={colorway}
      className={cn(pageHeaderVariants({ color: colorway, className }))}
    >
      <div
        data-slot='page-header-inner'
        className={cn(pageHeaderInnerVariants({ container: containerway }), innerClassName)}
      >
        {children}
      </div>
    </section>
  )
}

type PageHeaderTitleProps = React.ComponentPropsWithoutRef<'h1'> & {
  /**
   * The heading element. `1` by default, because a page header opens the
   * page and its title is the page's title; `2` for a header that opens a
   * section of a page whose `h1` sits elsewhere, so the outline stays in
   * order (WCAG 1.3.1).
   */
  headingLevel?: 1 | 2
  ref?: React.Ref<HTMLHeadingElement>
}

/**
 * The page title on its band. The heading is inline, so the band is drawn
 * per line (`box-decoration-break: clone`) and each box fits its own line's
 * words: a short title is one box, a long one a stack of boxes that touch.
 * Semibold at 48px from `sm:` and 32px below, with the tracking the
 * masterbrand's display setting asks for, and sentence case — the brand sets
 * nothing in uppercase.
 *
 * The box hangs back into the margin by its own horizontal padding, so the
 * TEXT sits on the column, lined up with the breadcrumb above and the body
 * below, and the colour reaches out past it. A block wrapper gives the title
 * its measure (40rem, retuned through `--page-header-title-max-width` like
 * the column's own `--page-header-max-width`), holds the air between it and
 * the breadcrumb above (24px, 16px on a phone), and puts the slots after it
 * on a new line.
 */
function PageHeaderTitle({ className, headingLevel = 1, ref, ...props }: PageHeaderTitleProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <div
      data-slot='page-header-title-row'
      // wrap-break-word so one unbreakable token (a URL, an acronym) wraps
      // inside a 320px viewport instead of pushing past it (WCAG 1.4.10).
      // text-balance lives here, not on the heading: balancing is a property
      // of the block container, and on the inline heading it does nothing.
      className='max-w-[var(--page-header-title-max-width,40rem)] text-balance wrap-break-word max-sm:mt-4 sm:mt-6'
    >
      <Heading
        ref={ref}
        data-slot='page-header-title'
        className={cn(
          // The box colour falls back to `blue`'s step so a title rendered
          // outside a PageHeader (or copied without it) still paints. It is a
          // literal because Tailwind only emits complete class strings; keep
          // it in step with `pageHeaderColors.blue`.
          'inline bg-[var(--page-header-box,var(--primary-600))] box-decoration-clone font-semibold tracking-tight text-white',
          // 1.46 is the line-height at which the boxes of a wrapped title
          // touch with neither a gap nor an overlap — the box is the line box
          // plus the vertical padding, so the two are tuned together for
          // Public Sans' ascent and descent; another `--font-sans` shows a
          // seam or an overlap of a pixel or two between lines.
          'max-sm:text-[2rem]/[1.46] sm:text-5xl/[1.46]',
          'max-sm:px-3 max-sm:py-1 sm:px-4 sm:py-1.5',
          // The hang is capped at the column inset, so a shell app that
          // retunes --page-header-padding-x to 0 gets a box on the column
          // rather than one poking out of the section.
          'max-sm:-ms-[min(--spacing(3),var(--page-header-padding-x))] sm:-ms-[min(--spacing(4),var(--page-header-padding-x))]',
          className,
        )}
        {...props}
      />
    </div>
  )
}

type PageHeaderDescriptionProps = React.ComponentPropsWithoutRef<'p'> & {
  ref?: React.Ref<HTMLParagraphElement>
}

/**
 * The standfirst: one or two light sentences under the title, 20/30 at a
 * 62ch measure, stepping to 18px on a phone.
 */
function PageHeaderDescription({ className, ref, ...props }: PageHeaderDescriptionProps) {
  return (
    <p
      ref={ref}
      data-slot='page-header-description'
      className={cn(
        'max-w-[62ch] font-light text-pretty',
        'max-sm:mt-4 max-sm:text-lg/[1.5] sm:mt-5 sm:text-xl/[1.5]',
        className,
      )}
      {...props}
    />
  )
}

type PageHeaderRuleProps = React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * A short rule closing the header, 48×4px in the ink — or, in the `red`
 * colourway, in the box's red. Square-cornered: the brand is flat. Decorative,
 * so it is hidden from assistive technology.
 */
function PageHeaderRule({ className, ref, ...props }: PageHeaderRuleProps) {
  return (
    <div
      ref={ref}
      aria-hidden='true'
      data-slot='page-header-rule'
      className={cn(
        // Outside a PageHeader the rule takes the text colour, which is
        // theme-correct on its own, rather than a restated ink.
        'h-1 w-12 bg-[var(--page-header-rule,currentColor)] max-sm:mt-6 sm:mt-7',
        className,
      )}
      {...props}
    />
  )
}

type PageHeaderMetaProps = React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * An optional row of facts about the page under a hairline in the ink — when
 * it was last updated, which site it belongs to. Its children are the
 * consumer's `span`s, spread to the row's two ends and stacked on a phone.
 */
function PageHeaderMeta({ className, ref, ...props }: PageHeaderMetaProps) {
  return (
    <div
      ref={ref}
      data-slot='page-header-meta'
      className={cn(
        // The hairline falls back to the row's own (muted) text colour when
        // there is no PageHeader ink above it.
        'flex border-t border-[var(--page-header-ink,currentColor)] pt-3 text-muted-foreground',
        'max-sm:mt-6 max-sm:flex-col max-sm:gap-1 sm:mt-9 sm:flex-wrap sm:justify-between sm:gap-4',
        className,
      )}
      {...props}
    />
  )
}

export {
  PageHeader,
  pageHeaderColors,
  PageHeaderDescription,
  pageHeaderInnerVariants,
  PageHeaderMeta,
  PageHeaderRule,
  PageHeaderTitle,
  pageHeaderVariants,
}
export type {
  PageHeaderColor,
  PageHeaderDescriptionProps,
  PageHeaderMetaProps,
  PageHeaderProps,
  PageHeaderRuleProps,
  PageHeaderTitleProps,
}

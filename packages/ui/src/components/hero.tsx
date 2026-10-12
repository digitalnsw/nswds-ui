import type * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils.js'

/**
 * Surface colours a hero can be drawn on, in the Header's and Masthead's
 * four-name vocabulary plus `tint`, the pale brand panel a landing page uses
 * to mark its opening off from a white body.
 *
 * Each surface sets three inks the slots read: `--hero-heading` (the title),
 * `--hero-ink` (body text and anything a consumer adds) and `--hero-muted`
 * (the description). On the light surfaces the heading is the brand navy and
 * the description the muted role token, both of which flip for dark mode on
 * their own; on `dark` everything is white, because white on `primary-800` is
 * the one pairing that clears WCAG 2.2 AAA (14.4:1) and a muted white would
 * not. Dark mode deepens each surface onto its family's dark step, on the
 * same ramp Header uses (`-800 → -950`, white → `grey-900`, `-100 → -850`), so
 * a hero under a themed header never draws a seam.
 */
const heroColors = {
  // The brand band, as Header's `dark`: primary-800 with white text,
  // deepening to primary-950 in dark mode (AGENTS.md §3, recorded exception).
  dark: [
    'bg-primary-800 text-white dark:bg-primary-950',
    '[--hero-ink:var(--color-white)] [--hero-heading:var(--color-white)] [--hero-muted:var(--color-white)]',
  ].join(' '),
  light: [
    'bg-grey-100 text-grey-800 dark:bg-grey-850 dark:text-white',
    '[--hero-ink:var(--grey-800)] [--hero-heading:var(--primary-800)] [--hero-muted:var(--text-muted)]',
    'dark:[--hero-ink:var(--color-white)] dark:[--hero-heading:var(--color-white)] dark:[--hero-muted:var(--color-white)]',
  ].join(' '),
  white: [
    'bg-white text-grey-800 dark:bg-grey-900 dark:text-white',
    '[--hero-ink:var(--grey-800)] [--hero-heading:var(--primary-800)] [--hero-muted:var(--text-muted)]',
    'dark:[--hero-ink:var(--color-white)] dark:[--hero-heading:var(--color-white)] dark:[--hero-muted:var(--color-white)]',
  ].join(' '),
  // The pale brand panel. primary-200 is the masterbrand's light blue; in dark
  // mode it deepens to primary-900, one step short of the `dark` surface's
  // dark step so the two stay distinguishable when stacked.
  tint: [
    'bg-primary-200 text-grey-800 dark:bg-primary-900 dark:text-white',
    '[--hero-ink:var(--grey-800)] [--hero-heading:var(--primary-800)] [--hero-muted:var(--grey-800)]',
    'dark:[--hero-ink:var(--color-white)] dark:[--hero-heading:var(--color-white)] dark:[--hero-muted:var(--color-white)]',
  ].join(' '),
}

type HeroColor = keyof typeof heroColors

const DEFAULT_HERO_COLOR: HeroColor = 'white'
// Shared by cva's defaultVariants and the `??` normalisers (and, for layout
// and fit, the data-* attributes), so they can't drift apart — the arrangement
// Header and Masthead use for their colour.
const DEFAULT_HERO_LAYOUT = 'split'
const DEFAULT_HERO_CONTAINER = 'fluid'
const DEFAULT_HERO_FIT = 'framed'

const heroVariants = cva('group/hero w-full text-(--hero-ink)', {
  variants: {
    color: heroColors,
  },
  defaultVariants: {
    color: DEFAULT_HERO_COLOR,
  },
})

/**
 * The inner column, carrying the same lateral rhythm as `Container` and the
 * chrome components (16px → 24px → 48px, funnelled through
 * `--hero-padding-x`), so a hero's text lines up with the header above it.
 * The media slots read the same custom property to bleed back out to the
 * edge, which is why it is a property and not a bare padding utility.
 *
 * Vertical rhythm lives on `HeroContent`, not here: a `bleed` image fills the
 * full height of the band, so the band itself cannot carry padding.
 */
const heroInnerVariants = cva(
  [
    'mx-auto w-full',
    'px-(--hero-padding-x)',
    '[--hero-padding-x:--spacing(4)] sm:[--hero-padding-x:--spacing(6)] lg:[--hero-padding-x:--spacing(12)]',
  ],
  {
    variants: {
      layout: {
        // Content beside media from `lg:`, stacked (content first) below it.
        split: 'grid max-lg:grid-cols-1 lg:grid-cols-2 lg:items-stretch lg:gap-x-16',
        // Content over media, each full width. Also the layout for a hero
        // with no media at all.
        stack: 'flex flex-col',
      },
      container: {
        // Full-bleed, matching the chrome's default. `--hero-max-width` is
        // still read so a shell app can constrain the column without
        // switching variants.
        fluid: 'max-w-[var(--hero-max-width,none)]',
        // Centred content column, legacy nsw-container parity (1200px).
        contained: 'max-w-[var(--hero-max-width,75rem)]',
      },
    },
    defaultVariants: {
      layout: DEFAULT_HERO_LAYOUT,
      container: DEFAULT_HERO_CONTAINER,
    },
  },
)

type HeroProps = React.ComponentPropsWithoutRef<'section'> &
  VariantProps<typeof heroVariants> &
  VariantProps<typeof heroInnerVariants> & {
    /**
     * Where the text sits. `centre` centres the content column and its
     * title, description and actions — the opener of a landing page.
     * `start` is the default, for a hero that reads on from the header.
     */
    align?: 'start' | 'centre'
    /**
     * `id` of the `HeroTitle`. Names the section so it is exposed as a
     * `region` landmark; as with `Section`, no fallback name is invented.
     */
    labelledBy?: string
    /** Classes applied to the inner column. */
    innerClassName?: string
    ref?: React.Ref<HTMLElement>
  }

/**
 * The opening band of a page: a title, a short description, up to two
 * actions, and optionally one illustration.
 *
 * Compose it from its slots — `HeroContent` holding `HeroTitle`,
 * `HeroDescription` and `HeroActions`, with an optional `HeroRule` above the
 * title and an optional `HeroMedia` beside or beneath the content:
 *
 * ```tsx
 * <Hero color='dark' layout='split' labelledBy='hero-title'>
 *   <HeroContent>
 *     <HeroTitle id='hero-title'>Made to send.</HeroTitle>
 *     <HeroDescription>Reusable components for NSW Government email.</HeroDescription>
 *     <HeroActions>
 *       <ButtonLink href='/start' color='white'>Get started</ButtonLink>
 *     </HeroActions>
 *   </HeroContent>
 *   <HeroMedia fit='bleed'>
 *     <img src='/illustration.png' alt='' />
 *   </HeroMedia>
 * </Hero>
 * ```
 *
 * The five registry blocks (`hero-split`, `hero-framed`, `hero-panel`,
 * `hero-centred`, `hero-statement`) are worked examples of the combinations
 * the NSW Design System recommends; copy one and adapt it.
 */
function Hero({
  className,
  innerClassName,
  color,
  layout,
  container,
  align = 'start',
  labelledBy,
  ref,
  children,
  ...props
}: HeroProps) {
  // Normalised once: cva treats an explicit `null` as "no variant" where
  // `undefined` takes the default, so the classes and the data attributes
  // would otherwise disagree for `color={null}` or `layout={null}`.
  const colorway = color ?? DEFAULT_HERO_COLOR
  const layoutway = layout ?? DEFAULT_HERO_LAYOUT
  const containerway = container ?? DEFAULT_HERO_CONTAINER
  return (
    <section
      ref={ref}
      data-slot='hero'
      data-color={colorway}
      data-layout={layoutway}
      data-align={align}
      aria-labelledby={labelledBy}
      className={cn(heroVariants({ color: colorway, className }))}
      {...props}
    >
      <div
        data-slot='hero-inner'
        className={cn(
          heroInnerVariants({ layout: layoutway, container: containerway }),
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}

type HeroContentProps = React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * The text column: title, description and actions, vertically centred
 * against the media beside it and carrying the hero's vertical rhythm.
 */
function HeroContent({ className, ref, ...props }: HeroContentProps) {
  return (
    <div
      ref={ref}
      data-slot='hero-content'
      className={cn(
        'flex flex-col justify-center gap-6',
        // The band's vertical rhythm, one step tighter than Section's so a
        // hero does not push the page's first content below the fold.
        'max-sm:py-14 sm:max-lg:py-16 lg:py-24',
        // Centred alignment, driven by the hero's data-align so a consumer
        // sets it once.
        'group-data-[align=centre]/hero:mx-auto group-data-[align=centre]/hero:max-w-4xl group-data-[align=centre]/hero:items-center group-data-[align=centre]/hero:text-center',
        className,
      )}
      {...props}
    />
  )
}

type HeroTitleProps = React.ComponentPropsWithoutRef<'h1'> & {
  /**
   * The heading element. `1` by default, because a hero opens the page and
   * its title is the page's title; `2` for a hero that opens a section of a
   * page whose `h1` sits elsewhere, so the outline stays in order (WCAG
   * 1.3.1).
   */
  headingLevel?: 1 | 2
  ref?: React.Ref<HTMLHeadingElement>
}

/**
 * The headline. Semibold rather than bold, at 60px from `lg:`, with the
 * tracking the masterbrand's display setting asks for. Sentence case — the
 * brand sets nothing in uppercase.
 */
function HeroTitle({ className, headingLevel = 1, ref, ...props }: HeroTitleProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <Heading
      ref={ref}
      data-slot='hero-title'
      className={cn(
        'max-w-[20ch] font-semibold tracking-tight text-balance text-(--hero-heading)',
        'max-sm:text-4xl sm:max-lg:text-5xl lg:text-6xl',
        'max-sm:leading-tight sm:leading-none',
        className,
      )}
      {...props}
    />
  )
}

type HeroDescriptionProps = React.ComponentPropsWithoutRef<'p'> & {
  ref?: React.Ref<HTMLParagraphElement>
}

/** One or two sentences under the title, at the reading measure. */
function HeroDescription({ className, ref, ...props }: HeroDescriptionProps) {
  return (
    <p
      ref={ref}
      data-slot='hero-description'
      className={cn('max-w-prose text-lg leading-8 text-pretty text-(--hero-muted)', className)}
      {...props}
    />
  )
}

type HeroActionsProps = React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * The row of actions. One or two `ButtonLink`s: the first solid, the second
 * outline. On the `dark` surface give them `color='white'`; elsewhere
 * `primary` (see the note on Button's `color`).
 */
function HeroActions({ className, ref, ...props }: HeroActionsProps) {
  return (
    <div
      ref={ref}
      data-slot='hero-actions'
      className={cn(
        'flex flex-wrap gap-3 pt-3',
        'group-data-[align=centre]/hero:justify-center',
        className,
      )}
      {...props}
    />
  )
}

type HeroRuleProps = React.ComponentPropsWithoutRef<'div'> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * A short accent rule above the title, for a hero that carries no
 * illustration and wants one mark of the brand colour. Decorative, so it is
 * hidden from assistive technology.
 */
function HeroRule({ className, ref, ...props }: HeroRuleProps) {
  return (
    <div
      ref={ref}
      aria-hidden='true'
      data-slot='hero-rule'
      className={cn('h-1.5 w-16 rounded-sm bg-primary', className)}
      {...props}
    />
  )
}

/**
 * How the illustration sits against the content. Every fit sizes the image
 * it wraps to fill the slot and crop (`object-cover`), so a consumer passes a
 * plain `<img>` or their framework's image component.
 */
const heroMediaVariants = cva(
  'relative overflow-hidden *:size-full *:object-cover [&_img]:size-full [&_img]:object-cover',
  {
    variants: {
      fit: {
        /**
         * Flush to the band's edge, filling its full height — the opener of
         * email.digital.nsw.gov.au. Reads `--hero-padding-x` back out to the
         * edge on the media side (and both sides when stacked on a phone).
         * With `container='contained'` it reaches the column's edge, not the
         * viewport's.
         */
        bleed:
          'max-lg:-mx-(--hero-padding-x) max-lg:aspect-3/2 lg:-mr-(--hero-padding-x) lg:h-full',
        /** A rounded picture beside the content, vertically centred. */
        framed: 'aspect-3/2 self-center rounded-md max-sm:mb-14 sm:max-lg:mb-16 lg:mb-0',
        /**
         * Rising from the bottom edge of the band with its top corners
         * rounded, as though the page's first card had been pulled up into
         * the hero. Pair with `color='tint'`.
         */
        rise: 'aspect-4/3 self-end rounded-t-md',
        /**
         * A shallow full-width strip beneath the content, for `layout='stack'`.
         * Reads `--hero-padding-x` back out to the edge on both sides.
         */
        band: '-mx-(--hero-padding-x) max-sm:h-48 sm:max-lg:h-64 lg:h-80',
      },
    },
    defaultVariants: {
      fit: DEFAULT_HERO_FIT,
    },
  },
)

type HeroMediaProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof heroMediaVariants> & {
    ref?: React.Ref<HTMLDivElement>
  }

/**
 * The illustration slot. Wraps one image; the `fit` decides how it sits.
 * The image's `alt` is the consumer's: empty when the picture decorates the
 * title, descriptive when it carries meaning the text does not.
 */
function HeroMedia({ className, fit, ref, ...props }: HeroMediaProps) {
  // Normalised once, as `Hero` does for `color` and `layout`.
  const fitway = fit ?? DEFAULT_HERO_FIT
  return (
    <div
      ref={ref}
      data-slot='hero-media'
      data-fit={fitway}
      className={cn(heroMediaVariants({ fit: fitway, className }))}
      {...props}
    />
  )
}

export {
  Hero,
  HeroActions,
  heroColors,
  HeroContent,
  HeroDescription,
  heroInnerVariants,
  HeroMedia,
  heroMediaVariants,
  HeroRule,
  HeroTitle,
  heroVariants,
}
export type {
  HeroActionsProps,
  HeroColor,
  HeroContentProps,
  HeroDescriptionProps,
  HeroMediaProps,
  HeroProps,
  HeroRuleProps,
  HeroTitleProps,
}

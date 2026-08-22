import type * as React from 'react'

import { cn } from '../lib/utils.js'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card.js'
import { ExternalLink, Link } from '../components/link.js'
import { IconArrowForward } from '../icons/arrow-forward.js'
import { IconArrowOutward } from '../icons/arrow-outward.js'

type LinkCardProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** Destination. Routed through `Link`, so `LinkProvider` applies. */
  href: React.ComponentPropsWithoutRef<typeof Link>['href']
  /** The card's heading, and its accessible name. */
  title: React.ReactNode
  /** Optional short kicker above the title — a category, date or type. */
  label?: React.ReactNode
  /** Supporting copy under the title. */
  description?: React.ReactNode
  /**
   * Render the link as an `ExternalLink` — adds the "opens in a new tab"
   * treatment and its accessible-name suffix, and swaps the corner glyph for
   * the outward arrow.
   */
  external?: boolean
  ref?: React.Ref<HTMLDivElement>
}

/**
 * A card whose entire surface is one link.
 *
 * **Why this exists as a component rather than a documented recipe.** The
 * obvious way to build a linked card — an anchor on the title, another on the
 * description, a third on the arrow — gives one destination three tab stops
 * and three competing accessible names, and it is what people reach for every
 * time. This composes `Card` with a single anchor stretched over the card via
 * `after:absolute after:inset-0`, so the whole surface is clickable while the
 * accessibility tree sees exactly one link named by the title.
 *
 * Consequences of the stretched-link technique, all deliberate:
 *
 * - **The card is `relative` and the anchor's `::after` is its hit area.** Any
 *   other interactive element inside the card would be covered by it. A card
 *   with a second action is the wrong component — compose `Card` by hand.
 * - **Text inside the card is no longer selectable by dragging**, because the
 *   overlay swallows the drag. That is inherent to the pattern and is why it
 *   suits short promo cards rather than cards containing copy worth quoting.
 * - **Focus is styled on the card, not the anchor.** The anchor's own outline
 *   would draw around its text box, not the surface the user is actually
 *   targeting, so the anchor drops its outline and the card takes a
 *   `focus-within` ring instead. Removing a focus indicator is only safe
 *   because an equivalent one is restored on the ancestor (WCAG 2.2, 2.4.7).
 *
 * The corner glyph and the hover lift are `motion-safe:` only, so a reader who
 * has asked for reduced motion gets the colour change without the movement
 * (WCAG 2.2, 2.3.3).
 */
function LinkCard({
  className,
  href,
  title,
  label,
  description,
  external = false,
  children,
  ref,
  ...props
}: LinkCardProps) {
  const CornerIcon = external ? IconArrowOutward : IconArrowForward

  const anchorClassName = cn(
    // The hit area: covers the whole card, sits above the content.
    'after:absolute after:inset-0',
    // See the component note — the ring moves to the card.
    'focus-visible:outline-none',
    'group-hover/link-card:text-primary motion-safe:transition-colors',
  )

  // Branched rather than `const Anchor = external ? ExternalLink : Link`: the
  // two components have different props (`icon` exists only on ExternalLink),
  // so a shared alias would type as their union and reject it.
  const anchor = external ? (
    <ExternalLink
      href={href}
      variant='unstyled'
      // `ExternalLink` renders its own trailing "opens in a new tab" glyph
      // inline after the title. The card already carries a corner glyph for
      // that job, and two marks for one link reads as two affordances — so the
      // inline one is suppressed and the corner icon changes shape instead.
      // The visually-hidden "(opens in a new tab)" suffix is untouched: the
      // announcement is the part a screen-reader user actually needs.
      icon={null}
      className={anchorClassName}
    >
      {title}
    </ExternalLink>
  ) : (
    <Link href={href} variant='unstyled' className={anchorClassName}>
      {title}
    </Link>
  )

  return (
    <Card
      ref={ref}
      // Deliberately replaces Card's own `data-slot="card"` (props spread last
      // in card.tsx). `data-slot` names what a node IS, not what it is built
      // from, and nothing in the package selects `[data-slot=card]` — only
      // Card's own stories do. Card's `data-size` and `group/card` hooks are
      // untouched, so its internal padding selectors keep working.
      data-slot='link-card'
      className={cn(
        'group/link-card relative h-full gap-3',
        // The focus ring the stretched anchor gives up. `Card`'s own resting
        // treatment is `ring-1 ring-foreground/10`, so this thickens and
        // recolours the same ring rather than adding a second one.
        'focus-within:ring-2 focus-within:ring-ring',
        'hover:ring-2 hover:ring-primary',
        'motion-safe:transition-all motion-safe:hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      <CardHeader>
        {label ? (
          <p data-slot='link-card-label' className='text-base/relaxed text-muted-foreground'>
            {label}
          </p>
        ) : null}
        <CardTitle data-slot='link-card-title' className='text-xl font-bold'>
          {anchor}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col justify-between gap-6'>
        {description ? (
          <CardDescription data-slot='link-card-description'>{description}</CardDescription>
        ) : null}
        {children}
        <CornerIcon
          aria-hidden='true'
          data-slot='link-card-icon'
          className={cn(
            'size-6 text-muted-foreground',
            'group-hover/link-card:text-primary',
            'motion-safe:transition-transform motion-safe:group-hover/link-card:translate-x-0.5',
            external && 'motion-safe:group-hover/link-card:-translate-y-0.5',
          )}
        />
      </CardContent>
    </Card>
  )
}

export { LinkCard }
export type { LinkCardProps }

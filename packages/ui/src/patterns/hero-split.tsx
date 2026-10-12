import type * as React from 'react'

import { ButtonLink } from '../components/button.js'
import {
  Hero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroMedia,
  HeroTitle,
} from '../components/hero.js'
import { IconArrowForward } from '../icons/arrow-forward.js'

// ── Sample content — replace with your service's own ────────────────────────
const contentSample = {
  title: 'Made to send.',
  description:
    'Reusable components, layouts and tools for NSW Government email: accessible, on-brand and proven in every major client, Outlook included.',
  actions: [
    { label: 'Get started', href: '#start' },
    { label: 'View components', href: '#components' },
  ],
}

type HeroAction = { label: string; href: string }

type HeroSplitProps = Omit<React.ComponentProps<typeof Hero>, 'children' | 'content' | 'layout'> & {
  /** Title, description and up to two actions; the first action is the primary one. */
  content?: { title: string; description: string; actions: readonly HeroAction[] }
  /**
   * The illustration, flush to the band's right edge. `alt` is empty when the
   * picture decorates the title (the usual case); describe it when it carries
   * meaning the text does not.
   */
  media: { src: string; alt: string }
}

/**
 * The brand band: white text on `primary-800` with the illustration flush to
 * the right edge and filling the band's full height — the opener of
 * email.digital.nsw.gov.au. The actions take `color='white'`, the one Button
 * colour designed for this surface.
 */
export function HeroSplit({
  content = contentSample,
  media,
  color = 'dark',
  labelledBy = 'hero-split-title',
  ...props
}: HeroSplitProps) {
  const [primary, secondary] = content.actions
  return (
    <Hero color={color} layout='split' labelledBy={labelledBy} {...props}>
      <HeroContent>
        <HeroTitle id={labelledBy}>{content.title}</HeroTitle>
        <HeroDescription>{content.description}</HeroDescription>
        {primary ? (
          <HeroActions>
            <ButtonLink
              href={primary.href}
              color={color === 'dark' ? 'white' : 'primary'}
              trailingVisual={IconArrowForward}
            >
              {primary.label}
            </ButtonLink>
            {secondary ? (
              <ButtonLink
                href={secondary.href}
                variant='outline'
                color={color === 'dark' ? 'white' : 'primary'}
              >
                {secondary.label}
              </ButtonLink>
            ) : null}
          </HeroActions>
        ) : null}
      </HeroContent>
      <HeroMedia fit='bleed'>
        <img src={media.src} alt={media.alt} />
      </HeroMedia>
    </Hero>
  )
}

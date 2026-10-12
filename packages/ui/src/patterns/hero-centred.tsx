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
  title: 'Consistent, accessible email for NSW Government.',
  description:
    'Reusable components, layouts and tools for NSW Government email: accessible, on-brand and proven in every major client, Outlook included.',
  actions: [
    { label: 'Get started', href: '#start' },
    { label: 'View components', href: '#components' },
  ] as const,
}

type HeroAction = { label: string; href: string }

/** Up to two actions; the first is the primary one. More would be silently dropped, so the type refuses them. */
type HeroActions = readonly [] | readonly [HeroAction, HeroAction?]

type HeroCentredProps = Omit<
  React.ComponentProps<typeof Hero>,
  'children' | 'content' | 'layout' | 'align'
> & {
  /** Title, description and up to two actions; the first action is the primary one. */
  content?: { title: string; description: string; actions: HeroActions }
  /** The illustration, as a shallow full-width strip beneath the text. */
  media: { src: string; alt: string }
}

/**
 * Centred text over a shallow full-width strip of the illustration. The
 * most symmetrical of the five, for a landing page whose title is a
 * statement rather than a lead-in, and the one that gives a longer title
 * the most room.
 */
export function HeroCentred({
  content = contentSample,
  media,
  color = 'white',
  labelledBy = 'hero-centred-title',
  ...props
}: HeroCentredProps) {
  const [primary, secondary] = content.actions
  const buttonColor = color === 'dark' ? 'white' : 'primary'
  return (
    <Hero color={color} layout='stack' align='centre' labelledBy={labelledBy} {...props}>
      <HeroContent>
        <HeroTitle id={labelledBy}>{content.title}</HeroTitle>
        <HeroDescription>{content.description}</HeroDescription>
        {primary ? (
          <HeroActions>
            <ButtonLink href={primary.href} color={buttonColor} trailingVisual={IconArrowForward}>
              {primary.label}
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant='outline' color={buttonColor}>
                {secondary.label}
              </ButtonLink>
            ) : null}
          </HeroActions>
        ) : null}
      </HeroContent>
      <HeroMedia fit='band'>
        <img src={media.src} alt={media.alt} />
      </HeroMedia>
    </Hero>
  )
}

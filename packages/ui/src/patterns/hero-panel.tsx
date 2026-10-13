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
import { resolveVariant } from '../lib/resolve-variant.js'

// ── Sample content — replace with your service's own ────────────────────────
const contentSample = {
  title: 'Design once, send anywhere.',
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

type HeroPanelProps = Omit<React.ComponentProps<typeof Hero>, 'children' | 'content' | 'layout'> & {
  /** Title, description and up to two actions; the first action is the primary one. */
  content?: { title: string; description: string; actions: HeroActions }
  /** The illustration, rising from the bottom edge of the panel. */
  media: { src: string; alt: string }
}

/**
 * The pale brand panel: a `primary-200` band with the illustration rising
 * from its bottom edge, top corners rounded, as though the page's first card
 * had been pulled up into the hero. Marks a landing page's opening off from
 * a white body without going to the full brand band.
 */
export function HeroPanel({
  content = contentSample,
  media,
  color: colorProp,
  labelledBy = 'hero-panel-title',
  ...props
}: HeroPanelProps) {
  // Resolved once, so a `null` from an untyped consumer lands on this block's
  // own default rather than falling through to Hero's.
  const color = resolveVariant(colorProp, 'tint')
  const [primary, secondary] = content.actions
  const buttonColor = color === 'dark' ? 'white' : 'primary'
  return (
    <Hero color={color} layout='split' labelledBy={labelledBy} {...props}>
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
      <HeroMedia fit='rise'>
        <img src={media.src} alt={media.alt} />
      </HeroMedia>
    </Hero>
  )
}

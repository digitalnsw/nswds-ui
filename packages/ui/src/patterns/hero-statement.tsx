import type * as React from 'react'

import { ButtonLink } from '../components/button.js'
import {
  Hero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroRule,
  HeroTitle,
} from '../components/hero.js'
import { IconArrowForward } from '../icons/arrow-forward.js'

// ── Sample content — replace with your service's own ────────────────────────
const contentSample = {
  title: 'On-brand in every inbox.',
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

type HeroStatementProps = Omit<
  React.ComponentProps<typeof Hero>,
  'children' | 'content' | 'layout'
> & {
  /** Title, description and up to two actions; the first action is the primary one. */
  content?: { title: string; description: string; actions: HeroActions }
}

/**
 * Type only: a short accent rule, the title, the description and the
 * actions, with no illustration. For a service that has no artwork, or a
 * page where the text is the point. The rule is the one mark of brand colour
 * and is hidden from assistive technology.
 */
export function HeroStatement({
  content = contentSample,
  color = 'white',
  labelledBy = 'hero-statement-title',
  ...props
}: HeroStatementProps) {
  const [primary, secondary] = content.actions
  const buttonColor = color === 'dark' ? 'white' : 'primary'
  return (
    <Hero color={color} layout='stack' labelledBy={labelledBy} {...props}>
      <HeroContent className='max-lg:pb-14 lg:pb-24'>
        <HeroRule />
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
    </Hero>
  )
}

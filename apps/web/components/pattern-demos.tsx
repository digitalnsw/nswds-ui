'use client'

import type { PushMenuItem } from '@nswds/ui'
import type * as React from 'react'

import { FooterAccordion } from '@/components/patterns/footer-accordion'
import { FooterCompact } from '@/components/patterns/footer-compact'
import { FooterContact } from '@/components/patterns/footer-contact'
import { FooterCta } from '@/components/patterns/footer-cta'
import { FooterNewsletter } from '@/components/patterns/footer-newsletter'
import { FooterSimpleCentred } from '@/components/patterns/footer-simple-centred'
import { FooterSitemap } from '@/components/patterns/footer-sitemap'
import { FooterSitemapBrand } from '@/components/patterns/footer-sitemap-brand'
import { ForgotPasswordForm } from '@/components/patterns/forgot-password-form'
import { LoginForm } from '@/components/patterns/login-form'
import { MobileNav } from '@/components/patterns/mobile-nav'
import { SignUpForm } from '@/components/patterns/sign-up-form'

const mobileNavSample: PushMenuItem[] = [
  {
    id: 'services',
    title: 'Services',
    links: [
      {
        id: 'transport',
        title: 'Transport',
        links: [
          { id: 'opal', title: 'Opal cards', href: '#opal' },
          { id: 'rego', title: 'Vehicle registration', href: '#rego' },
        ],
      },
      { id: 'housing', title: 'Housing and property', href: '#housing' },
    ],
  },
  { id: 'about', title: 'About us', href: '#about' },
  { id: 'contact', title: 'Contact', href: '#contact' },
]

const patternDemos: Record<string, React.ReactNode> = {
  'login-form': <LoginForm className='w-full max-w-sm' />,
  'sign-up-form': <SignUpForm className='w-full max-w-sm' />,
  'forgot-password-form': <ForgotPasswordForm className='w-full max-w-sm' />,
  'footer-simple-centred': <FooterSimpleCentred />,
  'footer-compact': <FooterCompact />,
  'footer-sitemap': <FooterSitemap />,
  'footer-sitemap-brand': <FooterSitemapBrand />,
  'footer-newsletter': <FooterNewsletter />,
  'footer-contact': <FooterContact />,
  'footer-cta': <FooterCta />,
  'footer-accordion': <FooterAccordion />,
  'mobile-nav': <MobileNav navigation={mobileNavSample} title='Menu' />,
}

/** Renders the live demo for a registry block, or nothing when none exists. */
export function PatternDemo({ slug }: { slug: string }) {
  return patternDemos[slug] ?? null
}

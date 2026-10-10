/**
 * IconBrands — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/IconBrands        → this file: Docs, Default, Playground and
 *                                  one story per docs section
 *   Components/IconBrands/Tests  → icon-brands.tests.stories.tsx
 *
 * The six third-party brand marks, which the generated Material Symbols set
 * does not contain (a GROUP in check-stories.mjs: they live in
 * src/icons/brands/, not in a same-named component file). They are documented
 * apart from Icons because `icons.stories.tsx` builds its gallery from the
 * generated barrel, and these are deliberately not in it — see
 * `../icons/brands/index.tsx`.
 *
 * The npm import line is written out in the docs page rather than via
 * DocsPage's `npm` prop, which always prints `from '@nswds/ui'`; the marks
 * ship from the `@nswds/ui/icons/brands` subpath.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'

import * as BrandIcons from '../icons/brands/index.js'
import { FooterSocialLink } from './footer.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const brandEntries = Object.entries(BrandIcons) as Array<
  [string, (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element]
>

/** The channels a NSW Government footer actually links to. */
const CHANNELS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/NSWGovernment',
    icon: BrandIcons.IconFacebook,
  },
  { name: 'X', href: 'https://x.com/NSWGovernment', icon: BrandIcons.IconX },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/user/nswgovernment',
    icon: BrandIcons.IconYouTube,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/nswgovernment',
    icon: BrandIcons.IconLinkedIn,
  },
  { name: 'Instagram', href: 'https://www.instagram.com/nswgov/', icon: BrandIcons.IconInstagram },
  { name: 'GitHub', href: 'https://github.com/digitalnsw', icon: BrandIcons.IconGitHub },
]

function SocialRow() {
  return (
    <ul className='flex flex-wrap items-center gap-1'>
      {CHANNELS.map(({ name, href, icon }) => (
        <li key={name}>
          <FooterSocialLink href={href} label={`Follow us on ${name}`} icon={icon} />
        </li>
      ))}
    </ul>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          The marks paint with <code>currentColor</code>, so they take the ink of whatever holds
          them — foreground on the page, white on the brand band. Do not restyle them beyond colour:
          they are the trademarks of their owners.
        </>
      }
    >
      <Example code={`<IconLinkedIn className="size-8" aria-hidden="true" />`}>
        <ExampleCell label='on the page'>
          <BrandIcons.IconLinkedIn aria-hidden='true' className='size-8 text-foreground' />
        </ExampleCell>
      </Example>
      <Example surface='brand'>
        <ExampleCell label={<span className='text-white'>on the brand band</span>}>
          <BrandIcons.IconLinkedIn aria-hidden='true' className='size-8' />
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function MarksSection() {
  return (
    <ExampleSection
      title='Marks'
      description='Six marks, for the channels NSW Government services link to. X replaced Twitter; there is no Twitter bird.'
    >
      <Example
        code={`import {
  IconFacebook,
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconX,
  IconYouTube,
} from '@nswds/ui/icons/brands'`}
      >
        {brandEntries.map(([name, Icon]) => (
          <ExampleCell key={name} label={<code>{name}</code>}>
            <Icon aria-hidden='true' className='size-8 text-foreground' />
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          The footer’s social row. Each mark sits in a <code>FooterSocialLink</code>, which names
          the link — the mark itself stays decorative.
        </>
      }
    >
      <Example
        code={`<FooterSocialLink
  href="https://www.linkedin.com/company/nswgovernment"
  label="Follow us on LinkedIn"
  icon={IconLinkedIn}
/>`}
      >
        <SocialRow />
      </Example>
      <Example surface='brand'>
        <SocialRow />
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function IconBrandsDocs() {
  return (
    <DocsPage
      title='IconBrands'
      npm={['IconFacebook', 'IconX', 'IconYouTube']}
      from='@nswds/ui/icons/brands'
      registry='icon-brands'
      summary={
        <>
          The six third-party brand marks a footer’s social row needs — Facebook, X, YouTube,
          LinkedIn, Instagram and GitHub — imported from <code>@nswds/ui/icons/brands</code>. The
          main icon set contains no brand marks.
        </>
      }
    >
      <DocsUsage
        use={[
          'The social links in a Footer.',
          'Linking to an agency’s channel on one of these platforms.',
          'A “Follow us” row at the end of a news article.',
        ]}
        avoid={[
          'Any icon that is not a brand mark — use Icons.',
          'Sharing a page to a platform — link to the platform’s own share URL with a text label.',
          'The NSW Government mark — use Logo.',
        ]}
      />
      <ColoursSection />
      <MarksSection />
      <InContextSection />
      <DocsApi description='The marks take every SVG attribute. These are the ones you will set.' />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/IconBrands',
  component: BrandIcons.IconLinkedIn,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: IconBrandsDocs },
  },
  args: {
    className: 'size-8 text-foreground',
    'aria-hidden': true,
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Size and colour, e.g. `size-6 text-primary`.',
      table: { category: 'Appearance' },
    },
    'aria-hidden': {
      control: 'boolean',
      description: 'Hide the mark from assistive technology when its link is named.',
      table: { category: 'Accessibility' },
    },
    'aria-label': {
      control: 'text',
      description: 'Name for a mark that stands alone. Pair with `role="img"`.',
      table: { category: 'Accessibility' },
    },
  },
} satisfies Meta<typeof BrandIcons.IconLinkedIn>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    if (!svg) throw new Error('Could not find the rendered mark.')
    if (svg.getAttribute('fill') !== 'currentColor') {
      throw new Error(`Expected fill="currentColor", received "${svg.getAttribute('fill')}".`)
    }
  },
}

export const Playground: Story = {}

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const Marks: Story = { name: 'Marks', render: () => <MarksSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

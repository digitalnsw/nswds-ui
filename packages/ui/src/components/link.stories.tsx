/**
 * Link — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Link                → this file: Docs, Default, Playground and
 *                                    one story per docs section
 *   Components/Link/Tests          → link.tests.stories.tsx
 *   Components/Link/Accessibility  → link.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'

import { ExternalLink, Link, LinkProvider } from './link.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

// Forced-state classes: the same --link-halo / --link-color utilities the real
// :hover, :focus-visible and :active rules apply, so a state can be shown at rest.
const forcedHover =
  'bg-(--link-halo) decoration-2 shadow-[0_-2px_0_var(--link-halo),0_4px_0_var(--link-halo)]'
const forcedFocus = 'outline outline-2 outline-offset-2 outline-(--link-color)'
const forcedActive =
  'bg-(--link-halo-active) decoration-2 shadow-[0_-2px_0_var(--link-halo-active),0_4px_0_var(--link-halo-active)]'

// A stand-in for a framework link (next/link, React Router). It tags itself so
// the rendered anchor shows which component produced it.
const FrameworkLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(
  function FrameworkLink(props, ref) {
    return <a ref={ref} data-framework-link='' {...props} />
  },
)

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          The variant sets the link ink for the surface behind it. <code>primary</code> is for every
          light surface; <code>secondary</code> and <code>white</code> are for the solid brand band
          and other dark surfaces, where the primary ink would lose contrast. <code>unstyled</code>{' '}
          drops every treatment, for components such as Button that supply their own.
        </>
      }
    >
      <Example code={`<Link href="/about">About NSW Government</Link>`}>
        <ExampleCell label='primary'>
          <Link href='#about'>About NSW Government</Link>
        </ExampleCell>
      </Example>
      <Example surface='brand' code={`<Link href="/about" variant="white">…</Link>`}>
        <ExampleCell label={<span className='text-white'>secondary</span>}>
          <Link href='#about' variant='secondary'>
            About NSW Government
          </Link>
        </ExampleCell>
        <ExampleCell label={<span className='text-white'>white</span>}>
          <Link href='#about' variant='white'>
            About NSW Government
          </Link>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description='Every link is underlined at rest. Hover thickens the underline and paints a soft halo behind the text; pressing deepens the halo; keyboard focus draws an outline in the link ink. The browser applies these on its own — the specimens below hold each state at rest so they can be compared.'
    >
      <Example code={`<Link href="/about">About NSW Government</Link>`}>
        <ExampleCell label='default'>
          <Link href='#default'>About NSW Government</Link>
        </ExampleCell>
        <ExampleCell label='hover'>
          <Link href='#hover' className={forcedHover}>
            About NSW Government
          </Link>
        </ExampleCell>
        <ExampleCell label='focus-visible'>
          <Link href='#focus' className={forcedFocus}>
            About NSW Government
          </Link>
        </ExampleCell>
        <ExampleCell label='active'>
          <Link href='#active' className={forcedActive}>
            About NSW Government
          </Link>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function ExternalLinksSection() {
  return (
    <ExampleSection
      title='External links'
      description={
        <>
          <code>ExternalLink</code> opens in a new tab with{' '}
          <code>rel=&quot;noopener noreferrer&quot;</code>, adds a trailing open-in-new icon, and
          tells screen reader users “(opens in a new tab)”. Pass <code>icon={'{null}'}</code> to
          hide the icon, or <code>newTabLabel=&quot;&quot;</code> when the link text already says
          so.
        </>
      }
    >
      <Example code={`<ExternalLink href="https://www.nsw.gov.au">nsw.gov.au</ExternalLink>`}>
        <ExampleCell label='ExternalLink'>
          <ExternalLink href='https://www.nsw.gov.au'>nsw.gov.au</ExternalLink>
        </ExampleCell>
        <ExampleCell label='icon={null}'>
          <ExternalLink href='https://www.service.nsw.gov.au' icon={null}>
            Service NSW
          </ExternalLink>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function AsAButtonSection() {
  return (
    <ExampleSection
      title='As a button'
      description={
        <>
          <code>as</code> swaps the rendered element and keeps the styling. Use it for an action
          that reads as a link inline but does something on the page, such as opening a dialog.
          Anchor-only props like <code>href</code> are dropped, so attach an <code>onClick</code>.
        </>
      }
    >
      <Example code={`<Link as="button" onClick={openContactDialog}>Contact us</Link>`}>
        <Link as='button' href='#contact'>
          Contact us
        </Link>
      </Example>
    </ExampleSection>
  )
}

function WithLinkProviderSection() {
  return (
    <ExampleSection
      title='With LinkProvider'
      description={
        <>
          Wrap the app once in <code>LinkProvider</code> to route every <code>Link</code> through a
          framework link such as <code>next/link</code>, without touching each call site. Passing{' '}
          <code>as</code> on one link still overrides the provider.
        </>
      }
    >
      <Example
        layout='stack'
        // The quoted specifier is interpolated, not written inline:
        // check:optimize-deps reads any quoted specifier after "from" as an import.
        code={`import NextLink from ${"'next/link'"}

<LinkProvider component={NextLink}>
  <Link href="/services">Browse services</Link>
</LinkProvider>`}
      >
        <ExampleCell label='inside LinkProvider'>
          <LinkProvider component={FrameworkLink}>
            <Link href='#services'>Browse services</Link>
          </LinkProvider>
        </ExampleCell>
        <ExampleCell label='outside — a plain <a>'>
          <Link href='#news'>Latest news</Link>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Links sit flush in running text. The halo extends past the line box without shifting the words around it, and a link that wraps gets a halo on each line.'
    >
      <Example layout='fill'>
        <div className='max-w-prose space-y-4 text-base/7 text-foreground'>
          <p>
            Find your nearest <Link href='#centres'>service centre</Link> or browse the full{' '}
            <Link href='#a-z'>A to Z of NSW Government services</Link>. Both pages are kept up to
            date by the agency responsible.
          </p>
          <p>
            For general enquiries, visit{' '}
            <ExternalLink href='https://www.nsw.gov.au'>nsw.gov.au</ExternalLink> or call Service
            NSW on 13 77 88.
          </p>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function LinkDocs() {
  return (
    <DocsPage
      title='Link'
      npm={['Link', 'ExternalLink', 'LinkProvider']}
      registry='link'
      summary={
        <>
          Links take people to another page or resource. They are always underlined, carry the
          system’s halo on hover, and render a plain anchor unless a framework link is supplied
          through <strong>LinkProvider</strong>.
        </>
      }
    >
      <DocsUsage
        use={[
          'Moving to another page, inline in running text.',
          'Pointing to a resource on another website — as an ExternalLink.',
          'A list of related pages, such as a footer or an “On this page” list.',
        ]}
        avoid={[
          'Starting a task or submitting a form — use Button.',
          'A call to action that should look like one — use ButtonLink.',
          'Promoting a destination with a title and summary — use LinkCard.',
        ]}
      />
      <VariantsSection />
      <StatesSection />
      <ExternalLinksSection />
      <AsAButtonSection />
      <WithLinkProviderSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: LinkDocs },
  },
  args: {
    href: '/about',
    children: 'About NSW Government',
    variant: 'primary',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Visible link text.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'white', 'unstyled'],
      description:
        'Link ink. `secondary` and `white` are for dark surfaces; `unstyled` drops all styling.',
      table: { category: 'Appearance' },
    },
    href: {
      control: 'text',
      description: 'Destination URL or path. A framework link may also take a URL object.',
      table: { category: 'Behavior' },
    },
    as: {
      control: false,
      description: 'Render a different element or component in place of the anchor.',
      table: { category: 'Behavior' },
    },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
      description: 'Browsing context for the link. Prefer ExternalLink for new tabs.',
      table: { category: 'Behavior' },
    },
    rel: {
      control: 'text',
      description: 'Relationship of the linked resource, e.g. `noopener noreferrer`.',
      table: { category: 'Behavior' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when the visible content is not text, e.g. an icon.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const anchor = Array.from(canvasElement.querySelectorAll('a')).find(
      (el) => el.getAttribute('href') === String(args.href),
    )
    if (!anchor) {
      throw new Error(`Could not find <a> with href="${String(args.href)}".`)
    }

    const text = anchor.textContent?.trim() ?? ''
    if (text !== String(args.children)) {
      throw new Error(`Expected link text "${String(args.children)}", received "${text}".`)
    }
  },
}

export const Playground: Story = {}

export const Variants: Story = { name: 'Variants', render: () => <VariantsSection /> }

export const States: Story = { name: 'States', render: () => <StatesSection /> }

export const ExternalLinks: Story = {
  name: 'External links',
  render: () => <ExternalLinksSection />,
}

export const AsAButton: Story = { name: 'As a button', render: () => <AsAButtonSection /> }

export const WithLinkProvider: Story = {
  name: 'With LinkProvider',
  render: () => <WithLinkProviderSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

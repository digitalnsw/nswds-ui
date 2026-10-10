/**
 * Link — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Link                → this file: Docs, Default, Playground
 *   Components/Link/Features       → link.features.stories.tsx
 *   Components/Link/Accessibility  → link.accessibility.stories.tsx
 *   Components/Link/Tests          → link.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
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
// Each section is one part of the docs page AND one Features story. The first
// five are the sections this page has always had, in their original order.

const variantDocs = [
  ['primary', 'The default. Every light surface — body copy, cards, lists.'],
  ['secondary', 'A softer ink for dark surfaces, where primary would lose contrast.'],
  ['white', 'Full-strength ink for coloured and image backgrounds.'],
  ['unstyled', 'No treatment at all, for components such as Button that bring their own.'],
] as const

export function DefaultSection() {
  return (
    <ExampleSection
      title='Default'
      description='A primary link — the out-of-the-box configuration. Underlined at rest, with the halo on hover.'
    >
      <Example code={`<Link href="/about">About NSW Government</Link>`}>
        <Link href='#about'>About NSW Government</Link>
      </Example>
    </ExampleSection>
  )
}

export function VariantsSection() {
  return (
    <ExampleSection
      title='Variants'
      description={
        <>
          Three built-in colour variants. Defaults to <code>primary</code>. Use{' '}
          <code>secondary</code> on dark surfaces where <code>primary</code> would lose contrast,
          and <code>white</code> on coloured / image backgrounds.
        </>
      }
    >
      <Example code={`<Link href="/about">Primary</Link>`}>
        <ExampleCell label='primary'>
          <Link href='#primary' variant='primary'>
            Primary
          </Link>
        </ExampleCell>
      </Example>
      <Example
        surface='brand'
        code={`<Link href="/about" variant="secondary">Secondary</Link>
<Link href="/about" variant="white">White</Link>`}
      >
        <ExampleCell label='secondary'>
          <Link href='#secondary' variant='secondary'>
            Secondary
          </Link>
        </ExampleCell>
        <ExampleCell label='white'>
          <Link href='#white' variant='white'>
            White
          </Link>
        </ExampleCell>
      </Example>
      <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-2'>
        {variantDocs.map(([name, description]) => (
          <div key={name} className='flex gap-3 text-base'>
            <dt className='w-24 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{description}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function ExternalSection() {
  return (
    <ExampleSection
      title='External'
      description={
        <>
          A link to another website opens in a new tab and says so. <code>ExternalLink</code> does
          all of it for you: <code>target=&quot;_blank&quot;</code>,{' '}
          <code>rel=&quot;noopener noreferrer&quot;</code>, a trailing open-in-new icon, and “(opens
          in a new tab)” for screen reader users. Pass <code>icon={'{null}'}</code> to hide the
          icon, or <code>newTabLabel=&quot;&quot;</code> when the link text already says so — as the
          hand-written link on the right does.
        </>
      }
    >
      <Example
        code={`<ExternalLink href="https://www.nsw.gov.au">nsw.gov.au</ExternalLink>

<Link href="https://www.nsw.gov.au" target="_blank" rel="noopener noreferrer">
  nsw.gov.au (opens in a new tab)
</Link>`}
      >
        <ExampleCell label='ExternalLink'>
          <ExternalLink href='https://www.nsw.gov.au'>nsw.gov.au</ExternalLink>
        </ExampleCell>
        <ExampleCell label='icon={null}'>
          <ExternalLink href='https://www.service.nsw.gov.au' icon={null}>
            Service NSW
          </ExternalLink>
        </ExampleCell>
        <ExampleCell label='Link with target="_blank"'>
          <Link href='https://www.nsw.gov.au' target='_blank' rel='noopener noreferrer'>
            nsw.gov.au (opens in a new tab)
          </Link>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function RenderedAsAButtonSection() {
  return (
    <ExampleSection
      title='Rendered as a button'
      description={
        <>
          Use <code>as</code> to render Link as a different element while keeping the same props
          pipeline. Reach for it when an action reads as a link inline but acts on the page, such as
          opening a dialog. Anchor-only props like <code>href</code> are dropped, so attach an{' '}
          <code>onClick</code>.
        </>
      }
    >
      <Example code={`<Link as="button" onClick={openContactDialog}>Contact us</Link>`}>
        <ExampleCell label='as="button"'>
          <Link as='button' href='#contact'>
            Contact us
          </Link>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function WithLinkProviderSection() {
  return (
    <ExampleSection
      title='With LinkProvider'
      description={
        <>
          Wrap a subtree with <code>LinkProvider</code> to inject a framework Link (e.g.{' '}
          <code>next/link</code>) without changing consumer call sites. Passing <code>as</code> on
          one link still overrides the provider.
        </>
      }
    >
      <Example
        // The quoted specifier is interpolated, not written inline:
        // check:optimize-deps reads any quoted specifier after "from" as an import.
        code={`import NextLink from ${"'next/link'"}

<LinkProvider component={NextLink}>
  <Link href="/services">Services</Link>
</LinkProvider>`}
      >
        <ExampleCell label='inside LinkProvider'>
          <LinkProvider component={FrameworkLink}>
            <Link href='#services'>Services</Link>
          </LinkProvider>
        </ExampleCell>
        <ExampleCell label='outside — a plain <a>'>
          <Link href='#news'>Latest news</Link>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function StatesSection() {
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

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='Links sit flush in running text. The halo extends past the line box without shifting the words around it, and a link that wraps gets a halo on each line.'
    >
      <Example
        layout='fill'
        code={`<p>
  Find your nearest <Link href="/centres">service centre</Link> or browse the full{' '}
  <Link href="/a-z">A to Z of NSW Government services</Link>.
</p>`}
      >
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
          Link is a polymorphic anchor wrapper. It renders an <code>{'<a>'}</code> by default, or
          any element you pass via <code>as</code>, or a framework link supplied through{' '}
          <code>LinkProvider</code>. Built-in styling is applied automatically — underline, hover
          halo, focus ring, and one of three colour variants via the <code>variant</code> prop
          (defaults to <code>primary</code>; <code>secondary</code> and <code>white</code> are
          intended for dark surfaces). Pass <code>className</code> to layer one-off overrides on
          top.
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
      <DefaultSection />
      <VariantsSection />
      <ExternalSection />
      <RenderedAsAButtonSection />
      <WithLinkProviderSection />
      <StatesSection />
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
  excludeStories: /Section$/,
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

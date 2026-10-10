/**
 * MobileNav — the story set, per docs/reference-storybook-standard.md.
 *
 *   Patterns/MobileNav        → this file: Docs, Default, Playground and one
 *                               story per docs section
 *   Patterns/MobileNav/Tests  → mobile-nav.tests.stories.tsx
 *
 * A registry block: a hamburger trigger opening a left-side sheet that holds
 * the multi-level PushMenu. Copy-and-adapt source, not a published component.
 *
 * The examples render the closed trigger only. The drawer is a modal that
 * portals to document.body, so an open one would cover the docs page — open
 * each example to see it.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'

import type { PushMenuItem } from '../components/push-menu.js'

import { Button, ButtonLink } from '../components/button.js'
import { Header, HeaderActions, HeaderBrand } from '../components/header.js'
import { Masthead } from '../components/masthead.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleSection,
} from '../components/story-helpers.js'
import { MobileNav } from './mobile-nav.js'

// ── Sample content — replace with your service's own ────────────────────────
const navigation: PushMenuItem[] = [
  { id: 'home', title: 'Home', href: '#home' },
  {
    id: 'about',
    title: 'About us',
    links: [
      { id: 'about-overview', title: 'Overview', href: '#about-overview' },
      { id: 'about-people', title: 'Our people', href: '#about-people' },
      {
        id: 'about-structure',
        title: 'Our structure',
        links: [
          { id: 'structure-divisions', title: 'Divisions', href: '#divisions' },
          { id: 'structure-agencies', title: 'Agencies', href: '#agencies' },
        ],
      },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    links: [
      { id: 'services-payments', title: 'Payments', href: '#payments' },
      { id: 'services-licences', title: 'Licences', href: '#licences' },
    ],
  },
  { id: 'contact', title: 'Contact', href: '#contact' },
]

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

function MenuTreeSection() {
  return (
    <ExampleSection
      title='Menu tree'
      description={
        <>
          Pass the whole tree as <code>navigation</code>: an item with <code>href</code> is a link,
          one with <code>links</code> drills into a level of its own, to any depth. Give every item
          a unique <code>id</code>. Pass the current pathname as <code>currentHref</code> and the
          matching link is marked as the current page. Open the menu and drill into &ldquo;About
          us&rdquo; to see it.
        </>
      }
    >
      <Example
        code={`const navigation = [
  { id: 'home', title: 'Home', href: '/' },
  {
    id: 'about',
    title: 'About us',
    links: [{ id: 'about-overview', title: 'Overview', href: '/about' }],
  },
]

<MobileNav navigation={navigation} currentHref="/about" />`}
      >
        <MobileNav navigation={navigation} currentHref='#about-overview' />
      </Example>
    </ExampleSection>
  )
}

function WithExtraContentSection() {
  return (
    <ExampleSection
      title='With extra content'
      description={
        <>
          Children render below the menu, inside the drawer, on a hairline of their own. Use it for
          the one action that belongs with navigation on a phone — signing in, say — not for a
          second menu.
        </>
      }
    >
      <Example
        code={`<MobileNav navigation={navigation}>
  <ButtonLink href="/sign-in" variant="outline" color="primary" block>
    Sign in
  </ButtonLink>
</MobileNav>`}
      >
        <MobileNav navigation={navigation}>
          <ButtonLink href='#sign-in' variant='outline' color='primary' block>
            Sign in
          </ButtonLink>
        </MobileNav>
      </Example>
    </ExampleSection>
  )
}

/** Controlled open state: an external control drives `open` + `onOpenChange`. */
function ControlledExample() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className='flex flex-col items-start gap-4'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' color='primary' onClick={() => setOpen(true)}>
          Browse services
        </Button>
        <MobileNav navigation={navigation} title='Menu' open={open} onOpenChange={setOpen} />
      </div>
      <p className='text-base text-muted-foreground'>The menu is {open ? 'open' : 'closed'}.</p>
    </div>
  )
}

function ControlledSection() {
  return (
    <ExampleSection
      title='Controlled'
      description={
        <>
          Pass <code>open</code> and <code>onOpenChange</code> to open the drawer from somewhere
          else on the page. Every way it closes — Escape, the backdrop, the menu&rsquo;s close
          button, choosing a link — reports through <code>onOpenChange</code>, so your state never
          drifts from what is on screen.
        </>
      }
    >
      <Example
        code={`const [open, setOpen] = React.useState(false)

<Button onClick={() => setOpen(true)}>Browse services</Button>
<MobileNav navigation={navigation} open={open} onOpenChange={setOpen} />`}
      >
        <ControlledExample />
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
          The trigger sits in <code>HeaderActions</code>; the <code>Header</code> already carries
          the brand lockup, so this block is only the drawer. Hide it from the outside with a{' '}
          <code>lg:hidden</code> wrapper where the service switches to <code>MainNav</code> at
          desktop widths.
        </>
      }
    >
      <Example layout='fill'>
        <Masthead color='dark' />
        <Header color='white' sticky={false}>
          <HeaderBrand sitename='Service NSW' />
          <HeaderActions>
            <MobileNav navigation={navigation} currentHref='#about-overview' />
          </HeaderActions>
        </Header>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function MobileNavDocs() {
  return (
    <DocsPage
      eyebrow='Pattern'
      title='MobileNav'
      registry='mobile-nav'
      summary={
        <>
          A menu button that opens a left-side drawer holding the multi-level PushMenu. It is
          composed from published components — Button, Sheet and PushMenu — so Base UI owns the
          focus trap, scroll lock, dismissal and focus return. Copy the source and adapt it.
        </>
      }
    >
      <DocsUsage
        use={[
          'Site navigation on phones and tablets, below the width where MainNav fits.',
          'A deep menu tree that people drill into one level at a time.',
          'A header that needs navigation, the brand and little else at narrow widths.',
        ]}
        avoid={[
          'Navigation at desktop widths — use MainNav.',
          'Moving between pages within one section — use SideNav.',
          'A short list of actions on one control — use DropdownMenu.',
        ]}
      />
      <MenuTreeSection />
      <WithExtraContentSection />
      <ControlledSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Patterns/MobileNav',
  component: MobileNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: MobileNavDocs },
  },
  args: {
    navigation,
    title: 'Menu',
    currentHref: '#about-overview',
  },
  argTypes: {
    navigation: {
      control: false,
      description: 'The menu tree, passed straight to PushMenu. Item ids must be unique.',
      table: { category: 'Content' },
    },
    currentHref: {
      control: 'text',
      description: 'Current pathname — the matching leaf link gets aria-current="page".',
      table: { category: 'Content' },
    },
    title: {
      control: 'text',
      description: 'Names the dialog (sr-only SheetTitle) and heads the menu root level.',
      table: { category: 'Content' },
    },
    children: {
      control: false,
      description: 'Extra drawer content rendered below the menu — a sign-in link, say.',
      table: { category: 'Content' },
    },
    open: {
      control: false,
      description: 'Controlled open state. Leave unset for uncontrolled.',
      table: { category: 'Behavior' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { category: 'Behavior' },
    },
    onOpenChange: {
      control: false,
      description: 'Fired on every open/close transition, whatever caused it.',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof MobileNav>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>('[data-slot="mobile-nav-trigger"]')
    if (!trigger) {
      throw new Error('Could not find an element with [data-slot="mobile-nav-trigger"].')
    }
    if (trigger.getAttribute('aria-label') !== 'Open navigation menu') {
      throw new Error(
        `Expected the trigger to be named "Open navigation menu", got "${trigger.getAttribute('aria-label')}".`,
      )
    }
  },
}

export const Playground: Story = {}

export const MenuTree: Story = { name: 'Menu tree', render: () => <MenuTreeSection /> }

export const WithExtraContent: Story = {
  name: 'With extra content',
  render: () => <WithExtraContentSection />,
}

export const Controlled: Story = { name: 'Controlled', render: () => <ControlledSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

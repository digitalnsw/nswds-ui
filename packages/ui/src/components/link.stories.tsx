/**
 * Link — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Link/Features        → link.features.stories.tsx
 *   Components/Link/Accessibility   → link.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { forwardRef } from 'react'

import { Link, LinkProvider } from './link.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Link</h1>
            <p className='text-base text-muted-foreground'>
              Link is a polymorphic anchor wrapper. It renders an <code>{'<a>'}</code> by default,
              or any element you pass via <code>as</code>, or a framework link supplied through{' '}
              <code>LinkProvider</code>. Built-in styling is applied automatically — underline,
              hover halo, focus ring, and one of three colour variants via the <code>variant</code>{' '}
              prop (defaults to <code>primary</code>; <code>secondary</code> and <code>white</code>{' '}
              are intended for dark surfaces). Pass <code>className</code> to layer one-off
              overrides on top.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
            <Link href='/about'>About NSW Government</Link>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Variants</h2>
            <p className='text-sm text-muted-foreground'>
              Three built-in colour variants. Defaults to <code>primary</code>. Use{' '}
              <code>secondary</code> on dark surfaces where <code>primary</code> would lose
              contrast, and <code>white</code> on coloured / image backgrounds.
            </p>
            <div className='flex flex-wrap gap-6'>
              <Link href='/primary' variant='primary'>
                Primary
              </Link>
              <div className='rounded-sm bg-primary-800 px-3 py-2'>
                <Link href='/secondary' variant='secondary'>
                  Secondary
                </Link>
              </div>
              <div className='rounded-sm bg-primary-800 px-3 py-2'>
                <Link href='/white' variant='white'>
                  White
                </Link>
              </div>
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>External</h2>
            <Link href='https://www.nsw.gov.au' target='_blank' rel='noopener noreferrer'>
              nsw.gov.au (opens in a new tab)
            </Link>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Rendered as a button</h2>
            <p className='text-sm text-muted-foreground'>
              Use <code>as</code> to render Link as a different element while keeping the same props
              pipeline.
            </p>
            <Link as='button' href='/contact'>
              Contact us
            </Link>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>With LinkProvider</h2>
            <p className='text-sm text-muted-foreground'>
              Wrap a subtree with <code>LinkProvider</code> to inject a framework Link (e.g.{' '}
              <code>next/link</code>) without changing consumer call sites.
            </p>
            <LinkProvider
              component={forwardRef<HTMLAnchorElement, { href: string }>(
                function FrameworkLink(props, ref) {
                  return <a ref={ref} data-framework-link='' {...props} />
                },
              )}
            >
              <Link href='/services'>Services</Link>
            </LinkProvider>
          </section>
        </div>
      ),
      description: {
        component:
          'Polymorphic anchor wrapper that renders an `<a>` by default, accepts any element through the `as` prop, or inherits a framework Link from a surrounding `LinkProvider` context. Ships with built-in styling driven by the `variant` prop (`primary` default, `secondary` and `white` for dark surfaces) — underline, hover halo, and focus ring all derive from a single `--link-color` token. Pass `className` to layer one-off overrides.',
      },
    },
  },
  args: {
    href: '/about',
    children: 'About NSW Government',
    variant: 'primary',
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'Destination URL or path the link points to.',
      table: { category: 'Behavior' },
    },
    children: {
      control: 'text',
      description: 'Visible link content rendered inside the anchor.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'white'],
      description: 'Colour variant. Defaults to `primary`. Use `white` on dark surfaces.',
      table: { category: 'Appearance' },
    },
    as: {
      control: false,
      description: 'Override the rendered element (string tag or component).',
      table: { category: 'Behavior' },
    },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
      description: 'Browsing context for the link target (use _blank for external).',
      table: { category: 'Behavior' },
    },
    rel: {
      control: 'text',
      description: 'Relationship of the linked resource (e.g. noopener noreferrer).',
      table: { category: 'Behavior' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when visible text is not sufficient (e.g. icon-only).',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
  },
  render: (args) => <Link {...args} />,
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAnchor(canvasElement: HTMLElement, href: string) {
  const anchor = Array.from(canvasElement.querySelectorAll('a')).find(
    (el) => el.getAttribute('href') === href,
  )

  if (!anchor) {
    throw new Error(`Could not find <a> with href="${href}".`)
  }

  return anchor
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    href: '/about',
    children: 'About NSW Government',
  },
  play: async ({ canvasElement, args }) => {
    const anchor = getAnchor(canvasElement, String(args.href))

    const text = anchor.textContent?.trim() ?? ''
    if (text !== String(args.children)) {
      throw new Error(`Expected link text "${String(args.children)}", received "${text}".`)
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      // Compact view: Name + Control only, no description/type/default columns
      expanded: false,
      sort: 'requiredFirst',
    },
  },
  render: (args) => (
    <div className='w-full max-w-xl rounded-sm border border-border bg-background p-6'>
      <Link {...args} />
    </div>
  ),
}

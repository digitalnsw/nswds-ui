import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { forwardRef } from 'react'

import { Link, LinkProvider, type LinkProps } from './link.js'

const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(function RouterLink(
  { href, ...props },
  ref
) {
  const resolvedHref =
    typeof href === 'string'
      ? href
      : href && 'pathname' in href && typeof href.pathname === 'string'
        ? href.pathname
        : '#'

  return <a {...props} data-router-link="true" href={resolvedHref} ref={ref} />
})

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

function getLink(canvasElement: HTMLElement, name: string) {
  const link = Array.from(canvasElement.querySelectorAll('a')).find(
    (element) => element.textContent === name
  )

  if (!link) {
    throw new Error(`Could not find link named "${name}".`)
  }

  return link
}

function expectAttribute(
  element: Element,
  name: string,
  expectedValue: string
) {
  const receivedValue = element.getAttribute(name)

  if (receivedValue !== expectedValue) {
    throw new Error(
      `Expected ${name}="${expectedValue}", received "${receivedValue}".`
    )
  }
}

export const Default: Story = {
  args: {
    href: '/services',
    children: 'Services',
  },
  play: async ({ canvasElement }) => {
    expectAttribute(getLink(canvasElement, 'Services'), 'href', '/services')
  },
}

export const Variants: Story = {
  args: {
    href: '#',
    children: 'Variants',
  },
  render: () => (
    <div className="flex flex-col gap-4 text-base">
      <Link href="/plain">Plain anchor</Link>
      <Link as={RouterLink} href="/adapter">
        Per-link adapter
      </Link>
      <LinkProvider component={RouterLink}>
        <Link href={{ pathname: '/provider' }}>Provider adapter</Link>
      </LinkProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    expectAttribute(getLink(canvasElement, 'Plain anchor'), 'href', '/plain')
    expectAttribute(
      getLink(canvasElement, 'Per-link adapter'),
      'data-router-link',
      'true'
    )
    expectAttribute(
      getLink(canvasElement, 'Provider adapter'),
      'href',
      '/provider'
    )
  },
}

export const RouterAdapter: Story = {
  args: {
    href: '#',
    children: 'Router adapter',
  },
  render: () => (
    <LinkProvider component={RouterLink}>
      <Link href="/dashboard">Dashboard</Link>
    </LinkProvider>
  ),
  play: async ({ canvasElement }) => {
    const link = getLink(canvasElement, 'Dashboard')

    expectAttribute(link, 'data-router-link', 'true')
    expectAttribute(link, 'href', '/dashboard')
  },
}

export const CssCheck: Story = {
  args: {
    href: '#',
    children: 'CSS check',
  },
  render: () => (
    <Link
      className="rounded-sm bg-primary px-4 py-2 text-primary-foreground"
      href="/token-check"
    >
      Token styled link
    </Link>
  ),
  play: async ({ canvasElement }) => {
    const link = getLink(canvasElement, 'Token styled link')
    const styles = getComputedStyle(link)

    if (styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error('Expected token styling to apply a background color.')
    }
  },
}

/**
 * Button — Tests
 *
 * Automated play-function tests for disabled state, CSS token application,
 * and boundary/edge-case rendering.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { forwardRef } from 'react'

import { Button } from './button.js'
import { Icons } from './icons.js'
import { LinkProvider, type LinkProps } from './link.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Button/Tests',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function IconLabel({ text }: { text: string }) {
  return (
    <>
      {text}
      <Icons.arrow_forward data-slot="icon" />
    </>
  )
}

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

function getButton(canvasElement: HTMLElement, name: string) {
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name
  )

  if (!button) throw new Error(`Could not find button named "${name}".`)

  return button
}

function getLink(canvasElement: HTMLElement, name: string) {
  const link = Array.from(canvasElement.querySelectorAll('a')).find((el) =>
    el.textContent?.includes(name)
  )

  if (!link) throw new Error(`Could not find link named "${name}".`)

  return link
}

function expectAttribute(element: Element, name: string, expectedValue: string) {
  const receivedValue = element.getAttribute(name)

  if (receivedValue !== expectedValue) {
    throw new Error(`Expected ${name}="${expectedValue}", received "${receivedValue}".`)
  }
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    children: 'Unavailable',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Unavailable')

    if (!button.hasAttribute('disabled')) {
      throw new Error('Expected disabled button to render disabled attribute.')
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Tokens',
  args: {
    children: 'Token styled button',
  },
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Token styled button')
    const styles = getComputedStyle(button)

    if (styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error('Expected token styling to apply a background color.')
    }
  },
}

export const PrimaryActiveState: Story = {
  name: 'Primary Active State',
  render: () => (
    <Button data-active="" color="primary" variant="solid">
      Pressed primary
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const button = getButton(canvasElement, 'Pressed primary')
    const styles = getComputedStyle(button)
    const hoverOverlay = styles.getPropertyValue('--btn-hover-overlay').trim()
    const activeOverlay = styles.getPropertyValue('--btn-active-overlay').trim()

    if (!activeOverlay) {
      throw new Error('Expected primary button active state to define an active overlay.')
    }

    if (activeOverlay === hoverOverlay) {
      throw new Error('Expected primary button active state to differ from hover state.')
    }
  },
}

export const EdgeCases: Story = {
  name: 'Edge Cases',
  render: () => (
    <div className="space-y-2 rounded-sm border border-border bg-background p-4">
      <div className="flex flex-wrap gap-2">
        <Button size="icon" aria-label="Only icon">
          <Icons.add data-slot="icon" />
        </Button>
        <Button variant="outline" color="accent">
          {' '}
        </Button>
        <Button size="sm" color="grey">
          ---
        </Button>
        <Button size="lg" color="accent">
          <IconLabel text="A very very very long call to action label" />
        </Button>
      </div>
    </div>
  ),
}

export const ContentStress: Story = {
  name: 'Long Labels',
  render: () => (
    <div className="w-full max-w-3xl space-y-2 rounded-sm border border-border bg-background p-4">
      <Button className="w-full justify-center" color="primary">
        <IconLabel text="Continue to the final approval and release workflow" />
      </Button>
      <Button className="w-full justify-center" color="tertiary" variant="soft">
        <IconLabel text="Nächster Schritt: Überprüfung und Veröffentlichung" />
      </Button>
      <Button className="w-full justify-center" color="accent" variant="outline">
        <IconLabel text="مرحلہ اگلا: توثیق اور اجراء" />
      </Button>
    </div>
  ),
}

export const LayoutStress: Story = {
  name: 'Narrow Containers',
  render: () => (
    <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2">
      <div className="space-y-2 rounded-sm border border-border bg-background p-4">
        <p className="text-sm font-medium text-foreground">Narrow card</p>
        <Button className="w-full justify-center" color="primary">
          <IconLabel text="Primary action" />
        </Button>
      </div>

      <div className="dark space-y-2 rounded-sm border border-grey-700 bg-grey-900 p-4">
        <p className="text-sm font-medium text-grey-100">Narrow card (light token)</p>
        <Button className="w-full justify-center" color="secondary" variant="outline">
          <IconLabel text="Secondary outline" />
        </Button>
      </div>
    </div>
  ),
}

export const LinkButton: Story = {
  name: 'Link Button',
  args: {
    children: 'View services',
    href: '#',
    variant: 'solid',
  },
  play: async ({ canvasElement }) => {
    const link = getLink(canvasElement, 'View services')

    expectAttribute(link, 'href', '#')
    expectAttribute(link, 'data-variant', 'solid')
  },
}

export const RouterAdapter: Story = {
  name: 'Router Adapter',
  render: () => (
    <LinkProvider component={RouterLink}>
      <Button href={{ pathname: '#' }}>Open dashboard</Button>
    </LinkProvider>
  ),
  play: async ({ canvasElement }) => {
    const link = getLink(canvasElement, 'Open dashboard')

    expectAttribute(link, 'href', '#')
    expectAttribute(link, 'data-router-link', 'true')
  },
}

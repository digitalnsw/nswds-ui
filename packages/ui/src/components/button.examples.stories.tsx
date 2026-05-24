/**
 * Button — Examples
 *
 * Real-world usage patterns: long copy, narrow containers, link rendering,
 * router adapter integration, and edge cases.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { forwardRef } from 'react'

import { Button } from './button.js'
import { Icons } from './icons.js'
import { LinkProvider, type LinkProps } from './link.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const docsTemplate = ({
  what,
  why,
  how,
  caveat,
}: {
  what: string
  why: string
  how: string
  caveat: string
}) => `${what}\n\nWhy it matters: ${why}\n\nHow to test: ${how}\n\nCaveats: ${caveat}`

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

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Button/Examples',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Next',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ContentStress: Story = {
  name: 'Long Labels',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Long copy, punctuation, and multilingual samples.',
          why: 'Protects against overflow and spacing regressions in real content scenarios.',
          how: 'Resize viewport and ensure text wraps or truncates without clipping icons.',
          caveat: 'Text is intentionally fixed to keep visual snapshots stable.',
        }),
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Buttons inside narrow cards and full-width parent layouts.',
          why: 'Prevents clipping/wrapping regressions in responsive compositions.',
          how: 'Switch to mobile viewport and verify spacing, wrapping, and hit areas.',
          caveat: 'Container widths are fixed for diff stability.',
        }),
      },
    },
  },
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


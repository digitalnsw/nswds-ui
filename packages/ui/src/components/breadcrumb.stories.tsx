/**
 * Breadcrumb — Default, Variants, CssCheck
 *
 * A navigation trail of links ending in the current page. Composed from plain
 * semantic elements (`nav > ol > li`); the separator and ellipsis carry their
 * own decorative icons.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js'

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A breadcrumb navigation trail. The wrapper is a `nav[aria-label="breadcrumb"]`; the final crumb uses BreadcrumbPage to mark the current page with `aria-current="page"`.',
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='#services'>Services</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Apply online</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The landmark and its accessible name come from the component, not the
    // consumer — assert both are present.
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb"]')
    await expect(nav).toBeInTheDocument()
    await expect(nav).toHaveAttribute('aria-label', 'breadcrumb')

    // The trail must expose real anchors and mark the current page.
    const links = canvasElement.querySelectorAll('[data-slot="breadcrumb"] a[href]')
    await expect(links.length).toBeGreaterThanOrEqual(2)

    const current = canvasElement.querySelector('[data-slot="breadcrumb-page"]')
    await expect(current).toHaveAttribute('aria-current', 'page')
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='#services'>Services</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Renew a licence</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the list's `text-muted-foreground` utility
    // resolves to a real colour rather than staying unset.
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="breadcrumb-list"]')
    if (!list) {
      throw new Error('Could not find [data-slot="breadcrumb-list"].')
    }
    const color = getComputedStyle(list).color
    if (color === '' || color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
      throw new Error(`Expected the --muted-foreground token to resolve, received "${color}".`)
    }
  },
}

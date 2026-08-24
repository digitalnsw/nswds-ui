/**
 * Pagination — Default, Variants, CssCheck
 *
 * A navigation control for moving between pages of results. Links are rendered
 * as Buttons; the active page carries `aria-current="page"` and the outline
 * variant.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination.js'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A pagination control. The wrapper is a `nav[aria-label="pagination"]`; each PaginationLink is an anchor styled as a Button, and `isActive` marks the current page with `aria-current="page"`.',
      },
    },
  },
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='#prev' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#1'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#2' isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#3'>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='#next' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The landmark and its accessible name come from the component.
    const nav = canvasElement.querySelector<HTMLElement>('[data-slot="pagination"]')
    await expect(nav).toBeInTheDocument()
    await expect(nav).toHaveAttribute('aria-label', 'pagination')

    // Real anchors are rendered for each page.
    const links = canvasElement.querySelectorAll('[data-slot="pagination-link"]')
    await expect(links.length).toBeGreaterThanOrEqual(3)

    // The active page must be marked for assistive technology.
    const active = canvasElement.querySelector('[data-slot="pagination-link"][data-active="true"]')
    await expect(active).toHaveAttribute('aria-current', 'page')
  },
}

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='#prev' />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#1'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#4'>4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#5' isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#6'>6</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#10'>10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href='#next' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const CssCheck: Story = {
  name: 'CssCheck',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the active link uses the outline Button variant,
    // whose `border` resolves to a real --border colour.
    const active = canvasElement.querySelector<HTMLElement>(
      '[data-slot="pagination-link"][data-active="true"]',
    )
    if (!active) {
      throw new Error('Could not find the active [data-slot="pagination-link"].')
    }
    const borderColor = getComputedStyle(active).borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected the --border token to resolve, received "${borderColor}".`)
    }
  },
}

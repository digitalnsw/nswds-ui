/**
 * Pagination — Tests
 *
 * Stories that prove something rather than show something. Hidden from the
 * sidebar; run in the Vitest suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination.js'

const meta = {
  title: 'Components/Pagination/Tests',
  component: Pagination,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
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

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the active link uses the outline Button variant,
    // whose `border` resolves to a real --border colour.
    const active = canvasElement.querySelector<HTMLElement>(
      '[data-slot="pagination-link"][data-active="true"]',
    )
    if (!active) {
      throw new Error('Could not find the active [data-slot="pagination-link"].')
    }
    // An unstyled anchor has no border (0px, none) yet still computes a visible
    // currentColor, so the colour alone proves nothing — the outline variant's
    // 2px solid border is what only the stylesheet draws.
    const style = getComputedStyle(active)
    if (style.borderTopWidth !== '2px' || style.borderTopStyle !== 'solid') {
      throw new Error(
        `Expected the outline variant's 2px solid border, received ${style.borderTopWidth} ${style.borderTopStyle}.`,
      )
    }
    const borderColor = style.borderColor
    if (borderColor === '' || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
      throw new Error(`Expected the --border token to resolve, received "${borderColor}".`)
    }
  },
}

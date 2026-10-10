/**
 * Pagination — Accessibility
 *
 * One story per WCAG 2.2 criterion pagination has to meet, each asserting it
 * in play(). Every page is an anchor rendered through Button, so focus, target
 * size and colour come from Button; these pin what the composition adds — a
 * named landmark, a list, names that contain the words on screen, and a
 * keyboard path through it all.
 *
 * There is no Name, Role, Value (4.1.2) story: Button exposes each anchor as
 * role="button", so a page link is announced as a button. That is a finding
 * against the component, not something to assert around.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Pagination/Accessibility',
  component: Pagination,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

/** Results pages 1 … 4 5 6 … 10, on page 5. Clicks are captured, not followed. */
function ResultsPagination({ onClick }: { onClick?: (event: React.MouseEvent) => void }) {
  const page = (n: number) => (
    <PaginationItem>
      <PaginationLink href={`?page=${n}`} isActive={n === 5} onClick={onClick}>
        {n}
      </PaginationLink>
    </PaginationItem>
  )
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='?page=4' onClick={onClick} />
        </PaginationItem>
        {page(1)}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {page(4)}
        {page(5)}
        {page(6)}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {page(10)}
        <PaginationItem>
          <PaginationNext href='?page=6' onClick={onClick} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const links = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="pagination-link"]'))

/**
 * A page link by its aria-label or its text. Found by slot rather than by
 * role: PaginationLink renders Button over an anchor, which Base UI exposes as
 * role="button" — a 4.1.2 finding recorded outside these stories — and the
 * criteria below are about focus, keys and names, not that role.
 */
function pageLink(canvasElement: HTMLElement, name: string) {
  const link = links(canvasElement).find(
    (el) => (el.getAttribute('aria-label') ?? el.textContent) === name,
  )
  if (!link) throw new Error(`No pagination link named "${name}".`)
  return link
}

/**
 * The opaque colour an element's text actually sits on: its own and its
 * ancestors' backgrounds composited from the first opaque one up. The idle
 * page links are ghost buttons with no fill of their own.
 */
function effectiveBackground(element: Element): string {
  const layers: string[] = []
  for (let el: Element | null = element; el; el = el.parentElement) {
    const bg = getComputedStyle(el).backgroundColor
    if (resolveColor(bg).a === 0) continue
    layers.push(bg)
    if (resolveColor(bg).a >= 1) break
  }
  const base = layers.length && resolveColor(layers.at(-1)!).a >= 1 ? layers.pop()! : 'white'
  let backdrop = resolveColor(base)
  for (const layer of layers.reverse())
    backdrop = { ...compositeOver(resolveColor(layer), backdrop), a: 1 }
  return `rgb(${Math.round(backdrop.r)}, ${Math.round(backdrop.g)}, ${Math.round(backdrop.b)})`
}

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'The links are a set, and a screen reader tells a reader how big the set is. The gaps between page numbers are visual shorthand and say nothing in speech.',
          how: 'With a screen reader, enter the control: a list of nine items — seven links and the two gaps, which are announced as empty items rather than read out. The play() asserts the list and its items, and that each ellipsis is hidden from assistive technology.',
          caveat:
            'The ellipsis is hidden, not its list item, so the item count includes the gaps. Put each ellipsis in its own PaginationItem, as here, so it never sits inside an item that holds a link.',
        }),
      },
    },
  },
  render: () => <ResultsPagination />,
  play: async ({ canvasElement }) => {
    const landmark = within(canvasElement).getByRole('navigation', { name: 'pagination' })
    const list = within(landmark).getByRole('list')
    await expect(within(list).getAllByRole('listitem')[0]).toContainElement(
      pageLink(canvasElement, 'Go to previous page'),
    )
    await expect(within(list).getAllByRole('listitem')).toHaveLength(9)
    const ellipses = landmark.querySelectorAll('[data-slot="pagination-ellipsis"]')
    await expect(ellipses).toHaveLength(2)
    for (const ellipsis of ellipses) {
      await expect(ellipsis).toHaveAttribute('aria-hidden', 'true')
    }
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const followed = fn((event: React.MouseEvent) => event.preventDefault())

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Every page has to be reachable and followable without a pointer.',
          how: 'Tab from the top: previous, then each page number in order, then next — the ellipses take no focus. Press Enter on a page: the link is followed. The play() walks the whole row and asserts the order, then that Enter follows page 6.',
          caveat:
            'The current page stays focusable, so a keyboard user can land on it and hear where they are.',
        }),
      },
    },
  },
  render: () => <ResultsPagination onClick={followed} />,
  play: async ({ canvasElement }) => {
    followed.mockClear()
    for (const link of links(canvasElement)) {
      await userEvent.tab()
      await expect(link).toHaveFocus()
    }
    pageLink(canvasElement, '6').focus()
    await userEvent.keyboard('{Enter}')
    await expect(followed).toHaveBeenCalledTimes(1)
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'The page numbers sit tight together, so a keyboard user needs a clear mark on the one that has focus.',
          how: 'Tab to a page number: a 2px ring is drawn around it, offset from the link. The play() asserts the ring on an idle page and on the current page, and measures it against the page behind it at 3:1.',
          caveat: "The ring is Button's, drawn in the link's own ink.",
        }),
      },
    },
  },
  render: () => <ResultsPagination />,
  play: async ({ canvasElement }) => {
    for (const name of ['4', '5']) {
      const link = pageLink(canvasElement, name)
      link.focus()
      await expect(link).toHaveFocus()
      await waitFor(() => expect(parseFloat(getComputedStyle(link).outlineWidth)).toBe(2))
      const style = getComputedStyle(link)
      await expect(style.outlineStyle).not.toBe('none')
      expectContrast(style.outlineColor, effectiveBackground(link.parentElement!), {
        minimum: 3,
        label: `Focus ring on page ${name}`,
      })
    }
  },
}

// ─── 2.5.3 — Label in Name ────────────────────────────────────────────────────

export const LabelInName: Story = {
  name: 'Label in Name — 2.5.3',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.3',
          why: 'Previous and next carry an accessible name longer than the word on screen. A speech-input user says what they see — "click Next" — so the name has to contain it.',
          how: 'Read the two links: "Previous" is named "Go to previous page" and "Next" is named "Go to next page". The play() asserts each name contains the visible word.',
          caveat:
            'Changing the word with `text` does not change the name. Pass an aria-label that contains the new word as well — see "Previous and next labels" on the docs page.',
        }),
      },
    },
  },
  render: () => <ResultsPagination />,
  play: async ({ canvasElement }) => {
    for (const [name, visible] of [
      ['Go to previous page', 'Previous'],
      ['Go to next page', 'Next'],
    ] as const) {
      const link = pageLink(canvasElement, name)
      await expect(link).toHaveAccessibleName(name)
      await expect(link.innerText.trim()).toBe(visible)
      await expect(name.toLowerCase()).toContain(visible.toLowerCase())
    }
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSize: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Page numbers are small, adjacent targets, which is exactly where a mistap lands on the wrong page.',
          how: 'Every link is measured: each page number is the 40×40 chrome square and previous and next are a full button height, all past the 24×24 minimum. The play() asserts every link.',
          caveat:
            'On a coarse pointer Button adds a 44px touch layer on top, so the targets grow without the row growing.',
        }),
      },
    },
  },
  render: () => <ResultsPagination />,
  play: async ({ canvasElement }) => {
    for (const link of links(canvasElement)) {
      const box = link.getBoundingClientRect()
      await expect(box.width).toBeGreaterThanOrEqual(24)
      await expect(box.height).toBeGreaterThanOrEqual(24)
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The page numbers are text, read at a glance, and the current page differs from the rest only in its frame — every number has to read on its own.',
          how: 'The play() measures the text of every link, idle and current, against the surface it actually sits on (the ghost links have no fill of their own) with the same contrast maths axe uses.',
          caveat: 'The (dark) story measures the dark theme.',
        }),
      },
    },
  },
  render: () => <ResultsPagination />,
  play: async ({ canvasElement }) => {
    for (const link of links(canvasElement)) {
      expectContrast(getComputedStyle(link).color, effectiveBackground(link), {
        label: `"${link.getAttribute('aria-label') ?? link.textContent}" link`,
      })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

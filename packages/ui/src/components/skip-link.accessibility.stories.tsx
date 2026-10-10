/**
 * SkipLink — Accessibility
 *
 * One story per WCAG 2.2 criterion the skip links have to meet, each asserting
 * it in play(). The links ARE the page's bypass mechanism (2.4.1), so these
 * pin what makes them work for the people who need them: they are first in the
 * tab order, they appear where focus is, nothing paints over them, activating
 * one really moves focus, and the revealed bar is big and readable.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Header, HeaderBrand } from './header.js'
import { Masthead } from './masthead.js'
import { SkipLink, SkipLinks } from './skip-link.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const SKIP_LINK_COLORS = ['dark', 'light', 'white', 'grey'] as const

const meta = {
  title: 'Components/SkipLink/Accessibility',
  component: SkipLinks,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SkipLinks>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The top of a real page: skip links first, then the masthead, a sticky
 * header with its home link, and the two targets the default pair jumps to.
 */
function PageStub() {
  return (
    <div className='min-h-96'>
      <SkipLinks />
      <Masthead />
      <Header>
        <HeaderBrand sitename='Department of Primary Industries' />
      </Header>
      <nav id='nav' aria-label='Main navigation' className='px-6 py-3 text-base'>
        Fishing · Farming · Biosecurity
      </nav>
      <main id='content' className='space-y-2 px-6 py-6'>
        <h1 className='text-2xl font-bold'>Apply for a recreational fishing licence</h1>
        <p className='text-base'>You need a licence to fish in NSW waters.</p>
      </main>
    </div>
  )
}

/**
 * Activating a hash link would navigate the test page. The component's focus
 * handling runs in its own onClick, before this document-level listener, so
 * suppressing the default here leaves the behaviour under test intact.
 */
async function withoutNavigation(run: () => Promise<void>) {
  const suppress = (event: Event) => event.preventDefault()
  document.addEventListener('click', suppress)
  try {
    await run()
  } finally {
    document.removeEventListener('click', suppress)
  }
}

async function waitForReveal(link: HTMLElement) {
  await waitFor(() => expect(link.getBoundingClientRect().top).toBe(0))
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'A screen reader user meets the skip links first and has to know what they are and where each one goes before choosing one.',
          how: 'List the landmarks: a navigation landmark named "Skip links". Read it: two links, "Skip to navigation" and "Skip to content", each pointing at an element that exists on the page. The play() asserts the landmark, both names and both targets.',
          caveat:
            'The default pair targets #nav and #content. Give those ids to your navigation and main content, or pass SkipLink children with your own.',
        }),
      },
    },
  },
  render: () => <PageStub />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const landmark = canvas.getByRole('navigation', { name: 'Skip links' })
    const links = within(landmark).getAllByRole('link')
    await expect(links.map((link) => link.textContent)).toEqual([
      'Skip to navigation',
      'Skip to content',
    ])
    for (const link of links) {
      const id = link.getAttribute('href')!.slice(1)
      await expect(document.getElementById(id)).toBeInTheDocument()
    }
  },
}

// ─── 2.4.3 — Focus Order ──────────────────────────────────────────────────────

export const FocusOrder: Story = {
  name: 'Focus Order — 2.4.3',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.3',
          why: 'A bypass link only saves keystrokes if it comes before the blocks it bypasses. Anywhere later and the reader has already tabbed through them.',
          how: 'Load the page and press Tab: "Skip to navigation" is the first stop, "Skip to content" the second, and only then the header\'s home link. The play() asserts that order.',
          caveat:
            'The order is the DOM order, so it holds only if SkipLinks is rendered first in the body, before the Masthead — the component cannot enforce that itself.',
        }),
      },
    },
  },
  render: () => <PageStub />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Skip to navigation' })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Skip to content' })).toHaveFocus()
    await userEvent.tab()
    await expect(
      canvas.getByRole('link', { name: /Department of Primary Industries/ }),
    ).toHaveFocus()
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'The skip links exist for keyboard users, so activating one from the keyboard has to move keyboard focus, not just scroll the page.',
          how: 'Tab twice to "Skip to content" and press Enter: focus lands on the main content, so the next Tab continues from there. The play() asserts focus moved to #content.',
          caveat:
            'The target is not natively focusable, so the link gives it tabindex="-1" for the move and removes it again on blur — the target never joins the tab order.',
        }),
      },
    },
  },
  render: () => <PageStub />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await userEvent.tab()
    const link = canvas.getByRole('link', { name: 'Skip to content' })
    await expect(link).toHaveFocus()
    await withoutNavigation(async () => {
      await userEvent.keyboard('{Enter}')
      await waitFor(() => expect(document.getElementById('content')).toHaveFocus())
    })
    await expect(document.getElementById('content')).toHaveAttribute('tabindex', '-1')
    document.getElementById('content')!.blur()
    await expect(document.getElementById('content')).not.toHaveAttribute('tabindex')
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
          why: 'A skip link is invisible until it takes focus, so focus has to make it visible — and show which of the links is focused.',
          how: "Press Tab: the bar slides in at the top of the viewport with a 2px ring in the bar's own text colour around the label. The play() asserts the bar is on screen and the ring is drawn, and measures the ring against the bar at 3:1.",
          caveat:
            'The ring is outline-current, so it always takes the text colour of the bar it sits on, in every colour and both themes.',
        }),
      },
    },
  },
  render: () => <PageStub />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Skip to navigation' })
    await expect(link.getBoundingClientRect().bottom).toBeLessThanOrEqual(0)
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await waitForReveal(link)
    const ring = getComputedStyle(link.firstElementChild!)
    await expect(ring.outlineStyle).not.toBe('none')
    await expect(parseFloat(ring.outlineWidth)).toBeGreaterThanOrEqual(2)
    expectContrast(ring.outlineColor, getComputedStyle(link).backgroundColor, {
      minimum: 3,
      label: 'Skip link focus ring',
    })
  },
}

// ─── 2.4.11 — Focus Not Obscured (Minimum) ────────────────────────────────────

export const FocusNotObscured: Story = {
  name: 'Focus Not Obscured (Minimum) — 2.4.11',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.11',
          why: 'The revealed bar slides in over the masthead and the sticky header. If either painted over it, a keyboard user would focus a link they cannot see.',
          how: 'Press Tab with a sticky Header on the page: the bar is drawn on top. The play() asks the browser which element is painted at the centre of the focused bar and asserts it is the skip link.',
          caveat:
            'SkipLinks sits at z-50 and a sticky Header at z-40 for this reason. A consumer layer above z-50 at the top of the page would hide it again.',
        }),
      },
    },
  },
  render: () => <PageStub />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Skip to navigation' })
    await userEvent.tab()
    await waitForReveal(link)
    const box = link.getBoundingClientRect()
    const painted = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
    await expect(link.contains(painted)).toBe(true)
  },
}

// ─── 2.5.5 — Target Size (Enhanced) ───────────────────────────────────────────

export const TargetSize: Story = {
  name: 'Target Size (Enhanced) — 2.5.5',
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.5',
          why: 'The revealed bar is also the thing a touch or switch user activates. It clears the AAA 44px target, not just the AA 24px minimum.',
          how: 'Press Tab: the bar runs the full width of the viewport and is at least 44px tall. The play() measures it.',
          caveat:
            'The 44px is a min-height, so a longer label that wraps makes the bar taller, never shorter.',
        }),
      },
    },
  },
  render: () => <PageStub />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Skip to navigation' })
    await userEvent.tab()
    await waitForReveal(link)
    const box = link.getBoundingClientRect()
    await expect(box.height).toBeGreaterThanOrEqual(44)
    await expect(box.width).toBeGreaterThanOrEqual(44)
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

const contrastStory: Story = {
  parameters: {
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The bar appears the moment a keyboard user takes focus and has to be read at once, in whichever of the four colours the page uses.',
          how: 'All four bars are shown revealed. The play() measures each label against its bar with the same contrast maths axe uses. The pairs are designed to AAA (7:1); the assertion holds them to that.',
          caveat:
            "The four colours deepen in dark mode onto the Masthead's steps; the (dark) story measures those.",
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4 p-6'>
      {SKIP_LINK_COLORS.map((color) => (
        <div key={color} className='relative min-h-11'>
          <SkipLink color={color} href='#content' className='translate-y-0'>
            Skip to content — {color}
          </SkipLink>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const links = canvasElement.querySelectorAll<HTMLElement>('[data-slot="skip-link"]')
    await expect(links).toHaveLength(SKIP_LINK_COLORS.length)
    for (const link of links) {
      const style = getComputedStyle(link)
      expectContrast(style.color, style.backgroundColor, {
        minimum: 7,
        label: `"${link.textContent}" skip link`,
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

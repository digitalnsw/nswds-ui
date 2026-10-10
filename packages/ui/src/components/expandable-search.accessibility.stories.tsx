/**
 * ExpandableSearch — Accessibility
 *
 * One story per WCAG 2.2 criterion the search chip has to meet, each asserting
 * it in play(). The collapsed chip is the search input itself, so the field
 * has to be named, reachable and visibly focused while it still looks like an
 * icon button — and every surface variant has to keep its ink readable.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import {
  ExpandableSearch,
  ExpandableSearchField,
  type ExpandableSearchVariant,
} from './expandable-search.js'
import { expectContrast, wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/ExpandableSearch/Accessibility',
  component: ExpandableSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ExpandableSearch>

export default meta

type Story = StoryObj<typeof meta>

const variants: ExpandableSearchVariant[] = [
  'default',
  'white',
  'primary-800',
  'primary-600',
  'primary-400',
  'primary-200',
  'grey-800',
  'grey-600',
  'grey-400',
  'grey-200',
  'accent-800',
  'accent-600',
  'accent-400',
  'accent-200',
]

const roots = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="expandable-search"]'),
]

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Collapsed, the chip looks like an icon button but is a text field. A screen reader user has to hear it as a search field, with a name, from the first moment — and the submit button needs a name too.',
          how: 'Inspect the chip before touching it: it is a searchbox named “Search NSW Health”, and the submit button is named “Submit search”. Type a query: the field’s value is announced. The play() asserts each.',
          caveat:
            'The names default to “Search”. Set label and buttonLabel to say what is searched and to translate them.',
        }),
      },
    },
  },
  render: () => (
    <ExpandableSearch>
      <ExpandableSearchField label='Search NSW Health' buttonLabel='Submit search' />
    </ExpandableSearch>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('searchbox', { name: 'Search NSW Health' })
    await expect(canvas.getByRole('button', { name: 'Submit search' })).toBeInTheDocument()
    await userEvent.click(field)
    await userEvent.keyboard('flu vaccine')
    await expect(field).toHaveValue('flu vaccine')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const searched = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Opening, typing, submitting and clearing must all work from the keyboard, with no step that needs a pointer.',
          how: 'Tab to the chip: it opens. Type a query and press Enter: the search runs. Tab to the search button and press Enter: it runs again. The play() asserts each step, and that the field closes once emptied and left.',
          caveat:
            'Enter submits because the root is a form and the input type="search"; Escape clearing the field is the browser’s own behaviour for a search input.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex items-center gap-4'>
      <ExpandableSearch onAction={searched}>
        <ExpandableSearchField placeholder='Search' />
      </ExpandableSearch>
      <button type='button' className='rounded-sm px-2 underline'>
        After the search
      </button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    searched.mockClear()
    const canvas = within(canvasElement)
    const root = roots(canvasElement)[0]!
    const field = canvas.getByRole('searchbox', { name: 'Search' })
    await userEvent.tab()
    await expect(field).toHaveFocus()
    await waitFor(() => expect(root).toHaveAttribute('data-expanded'))
    await userEvent.keyboard('planning permits{Enter}')
    await expect(searched).toHaveBeenLastCalledWith('planning permits')
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Search' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(searched).toHaveBeenCalledTimes(2)

    // Emptied and left, the chip closes again.
    await userEvent.clear(field)
    await userEvent.click(canvas.getByRole('button', { name: 'After the search' }))
    await waitFor(() => expect(root).not.toHaveAttribute('data-expanded'))
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'The chip opens on focus, but the focus itself must still be visible — on the field, and on the search button after it.',
          how: 'Tab to the chip: a 2px outline in the surface’s ink is drawn inside it. Tab again: the outline moves to the search button. The play() asserts both on a light and a dark surface.',
          caveat:
            'The outline is drawn inset, inside the chip, so a header’s edge or a neighbouring control cannot clip it.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-col items-start gap-4'>
      {(['default', 'primary-800'] as const).map((variant) => (
        <ExpandableSearch key={variant} variant={variant}>
          <ExpandableSearchField placeholder='Search' label={`Search (${variant})`} />
        </ExpandableSearch>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const root of roots(canvasElement)) {
      const field = root.querySelector<HTMLElement>('input')!
      const button = root.querySelector<HTMLElement>('button')!
      await userEvent.tab()
      await expect(field).toHaveFocus()
      await expect(getComputedStyle(field).outlineStyle).toBe('solid')
      await expect(getComputedStyle(field).outlineWidth).toBe('2px')
      await userEvent.tab()
      await expect(button).toHaveFocus()
      await expect(getComputedStyle(button).outlineStyle).toBe('solid')
      await expect(getComputedStyle(button).outlineWidth).toBe('2px')
    }
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

/** The colour a custom property resolves to, read by painting it on a probe. */
function resolveVar(root: HTMLElement, property: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${property})`
  root.append(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
}

const contrastMinimum: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'The query and the placeholder are text on a coloured chip, on fourteen different surfaces. Each pair has to clear 4.5:1.',
          how: 'Every variant is rendered open with a query. The play() measures the query text and the placeholder colour against each chip.',
          caveat:
            'axe cannot see ::placeholder, so the placeholder colour is resolved by painting --search-placeholder on a probe and measured directly. Three light surfaces raise it from 70% to full ink to pass.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {variants.map((variant) => (
        <ExpandableSearch key={variant} variant={variant} defaultValue='permits'>
          <ExpandableSearchField placeholder='Search' label={`Search (${variant})`} />
        </ExpandableSearch>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const root of roots(canvasElement)) {
      const surface = getComputedStyle(root).backgroundColor
      const field = root.querySelector<HTMLElement>('input')!
      expectContrast(getComputedStyle(field).color, surface, {
        label: `${root.dataset.variant} query text`,
      })
      expectContrast(resolveVar(root, '--search-placeholder'), surface, {
        label: `${root.dataset.variant} placeholder`,
      })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastMinimum, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastMinimum,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextContrast: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'Collapsed, the magnifier is the only thing that says what the chip is, and the focus outline is drawn in the same ink — both need 3:1 against the chip.',
          how: 'Every variant is rendered collapsed. The play() measures the search icon’s colour (which is also the focus outline’s) against each chip.',
          caveat: 'Both derive from --search-ink, so one measurement covers icon and outline.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap gap-4'>
      {variants.map((variant) => (
        <ExpandableSearch key={variant} variant={variant}>
          <ExpandableSearchField placeholder='Search' label={`Search (${variant})`} />
        </ExpandableSearch>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const root of roots(canvasElement)) {
      const button = root.querySelector<HTMLElement>('button')!
      expectContrast(getComputedStyle(button).color, getComputedStyle(root).backgroundColor, {
        minimum: 3,
        label: `${root.dataset.variant} icon and focus ink`,
      })
    }
  },
}

export const NonTextContrast: Story = { ...nonTextContrast, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextContrast,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSizeMinimum: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Collapsed, the chip is a single small target in a crowded header; it has to be easy to hit.',
          how: 'The play() measures the collapsed chip and asserts it is at least 24 by 24 CSS pixels — it is 48 by 48.',
          caveat: 'Expanded, the field only grows, so the collapsed size is the one that matters.',
        }),
      },
    },
  },
  render: () => (
    <ExpandableSearch>
      <ExpandableSearchField placeholder='Search' />
    </ExpandableSearch>
  ),
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('searchbox', { name: 'Search' })
    const { width, height } = field.getBoundingClientRect()
    await expect(width).toBeGreaterThanOrEqual(24)
    await expect(height).toBeGreaterThanOrEqual(24)
  },
}

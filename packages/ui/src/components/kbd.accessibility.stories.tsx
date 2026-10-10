/**
 * Kbd — Accessibility
 *
 * One story per WCAG 2.2 criterion a key badge has to meet, each asserting it
 * in play(). Kbd is presentational — no role, no focus, no ARIA — so what it
 * owes a reader is the right HTML element and readable text, on the page and
 * inside a tooltip.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'

import { IconKeyboardArrowUp, IconSearch } from '../icons/index.js'
import { Button } from './button.js'
import { Kbd, KbdGroup } from './kbd.js'
import {
  closeOverlay,
  compositeOver,
  expectContrast,
  resolveColor,
  wcagStoryMeta,
} from './story-helpers.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js'

const meta = {
  title: 'Components/Kbd/Accessibility',
  component: Kbd,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

// ─── 1.3.1 — Info and Relationships ───────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'A key shown as a styled badge has to be marked up as keyboard input too, so the meaning the styling carries is in the HTML for assistive technology, reader modes and anything that restyles the page.',
          how: 'Inspect the markup: each key is a <kbd>, and a combination is a <kbd> wrapping one <kbd> per key — the HTML for a single input made of several keys. A glyph key keeps its name in text. The play() asserts all three.',
          caveat:
            'Screen readers rarely announce <kbd> as such; the element is still the right one, and the key names themselves have to be written out in text.',
        }),
      },
    },
  },
  render: () => (
    <p className='max-w-prose text-base text-foreground'>
      Press{' '}
      <KbdGroup data-testid='combo'>
        <Kbd>Ctrl</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>{' '}
      to save, or{' '}
      <Kbd data-testid='glyph'>
        <IconKeyboardArrowUp aria-hidden='true' />
        <span className='sr-only'>Up arrow</span>
      </Kbd>{' '}
      to go back to the last field.
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const combo = canvas.getByTestId('combo')
    await expect(combo.tagName).toBe('KBD')
    const keys = [...combo.children]
    await expect(keys.map((key) => key.tagName)).toEqual(['KBD', 'KBD'])
    await expect(keys.map((key) => key.textContent)).toEqual(['Ctrl', 'S'])

    // A glyph key still carries its name as text; the icon itself is hidden.
    const glyph = canvas.getByTestId('glyph')
    await expect(glyph.tagName).toBe('KBD')
    await expect(glyph).toHaveTextContent('Up arrow')
    await expect(glyph.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

/** A colour flattened onto an opaque backdrop, as an rgb() string. */
function flatten(colour: string, backdrop: string) {
  const { r, g, b } = compositeOver(resolveColor(colour), resolveColor(backdrop))
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

const contrastStory: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'A key name is text, and small text at that: it has to clear 4.5:1 against its chip wherever the chip sits.',
          how: 'The play() measures the key text against its chip on the page, then opens a tooltip and measures the key there — where the chip is translucent, so it is flattened onto the tooltip surface first.',
          caveat:
            'Measured with the same contrast maths axe uses. The tooltip chip is the tooltip text colour at low opacity, so its contrast follows the tooltip pair in both modes.',
        }),
      },
    },
  },
  render: () => (
    <TooltipProvider>
      <div className='flex flex-wrap items-center gap-8'>
        <Kbd data-testid='page-key'>Esc</Kbd>
        <Tooltip defaultOpen>
          <TooltipTrigger
            render={
              <Button variant='outline' iconOnly aria-label='Search' leadingVisual={IconSearch} />
            }
          />
          <TooltipContent>
            Search <Kbd>K</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const pageKey = within(canvasElement).getByTestId('page-key')
    const page = getComputedStyle(pageKey)
    expectContrast(page.color, page.backgroundColor, { label: 'Key on the page' })

    const tooltip = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-slot="tooltip-content"]')
      expect(el).toBeVisible()
      return el!
    })
    const key = tooltip.querySelector<HTMLElement>('[data-slot="kbd"]')!
    const surface = getComputedStyle(tooltip).backgroundColor
    const chip = flatten(getComputedStyle(key).backgroundColor, surface)
    expectContrast(getComputedStyle(key).color, chip, { label: 'Key in a tooltip' })
    await closeOverlay('tooltip-content')
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

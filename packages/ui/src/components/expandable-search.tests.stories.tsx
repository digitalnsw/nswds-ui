/**
 * ExpandableSearch — Tests
 *
 * Stories that prove something rather than show something: surface variants,
 * the collapsed chip's focus outline, placeholder contrast on every tuned
 * surface, and the CSS check. Hidden from the sidebar; run in the Vitest
 * suite and Chromatic.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ExpandableSearch, ExpandableSearchField } from './expandable-search.js'
import { expectContrast } from './story-helpers.js'

const meta = {
  title: 'Components/ExpandableSearch/Tests',
  component: ExpandableSearch,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof ExpandableSearch>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoot(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLFormElement>('form[data-slot="expandable-search"]')
  if (!el) {
    throw new Error('Could not find a <form> with [data-slot="expandable-search"].')
  }
  return el
}

function getInput(root: HTMLElement) {
  const el = root.querySelector<HTMLInputElement>('[data-slot="expandable-search-input"]')
  if (!el) {
    throw new Error('Could not find the [data-slot="expandable-search-input"] input.')
  }
  return el
}

/** Poll until `predicate` holds, so the 300ms expansion has time to settle. */
async function waitFor(predicate: () => boolean, message: string, timeout = 2000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (predicate()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 16))
  }
  throw new Error(message)
}

// ─── Stories ──────────────────────────────────────────────────────────────────

// Unique forms per instance — ids are generated with useId, so nothing
// collides. Each variant sits on a backdrop it is designed for.
export const Variants: Story = {
  name: 'Surface variants paint distinct backgrounds',
  render: () => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4 rounded-sm bg-background p-4'>
        <ExpandableSearch variant='default'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-base text-muted-foreground'>
          default — grey-100 chip for white headers
        </span>
      </div>
      <div className='flex items-center gap-4 rounded-sm bg-muted p-4'>
        <ExpandableSearch variant='white'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-base text-muted-foreground'>white — on light-grey chrome</span>
      </div>
      <div className='flex items-center gap-4 rounded-sm bg-background p-4'>
        <ExpandableSearch variant='primary-800'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-base text-muted-foreground'>
          primary-800 — brand-blue surface, white ink
        </span>
      </div>
      <div className='flex items-center gap-4 rounded-sm bg-background p-4'>
        <ExpandableSearch variant='grey-800'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-base text-muted-foreground'>
          grey-800 — dark-grey surface, white ink
        </span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const roots = canvasElement.querySelectorAll<HTMLElement>('[data-slot="expandable-search"]')
    if (roots.length !== 4) {
      throw new Error(`Expected 4 search forms, got ${roots.length}.`)
    }

    const expectedVariants = ['default', 'white', 'primary-800', 'grey-800']
    roots.forEach((root, i) => {
      if (root.dataset.variant !== expectedVariants[i]) {
        throw new Error(
          `Expected form ${i} to carry data-variant="${expectedVariants[i]}", got "${root.dataset.variant}".`,
        )
      }
      const bg = getComputedStyle(root).backgroundColor
      if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
        throw new Error(`Expected the ${root.dataset.variant} surface to paint a background.`)
      }
    })

    // The two ink families must actually differ: the primary-800 surface is
    // not the default chip's grey.
    const defaultBg = getComputedStyle(roots[0]!).backgroundColor
    const primaryBg = getComputedStyle(roots[2]!).backgroundColor
    if (defaultBg === primaryBg) {
      throw new Error('Expected the default and primary-800 variants to paint different surfaces.')
    }
  },
}

export const CollapsedFocus: Story = {
  name: 'Collapsed focus',
  args: {
    children: <ExpandableSearchField placeholder='Search' />,
  },
  play: async ({ canvasElement }) => {
    const root = getRoot(canvasElement)
    const input = getInput(root)

    // Text inputs match :focus-visible whenever focused (they accept keyboard
    // input), so programmatic focus() is a deterministic headless stand-in
    // for tabbing to the chip.
    input.focus()
    await waitFor(
      () => document.activeElement === input,
      'Expected the collapsed chip (the input) to take focus.',
    )
    await waitFor(
      () => getComputedStyle(input).outlineStyle === 'solid',
      `Expected a solid focus outline on keyboard focus, got outline-style "${getComputedStyle(input).outlineStyle}".`,
    )

    const styles = getComputedStyle(input)
    if (styles.outlineWidth !== '2px') {
      throw new Error(`Expected a 2px focus outline, got "${styles.outlineWidth}".`)
    }
    // The outline is the surface's ink — the one colour guaranteed to
    // contrast with the chip — so it must resolve to something visible.
    if (styles.outlineColor === '' || styles.outlineColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the focus outline to resolve --search-ink to a visible colour, got "${styles.outlineColor}".`,
      )
    }
  },
}

export const PlaceholderContrast: Story = {
  name: 'Placeholder contrast',
  render: () => (
    // defaultValue keeps every field expanded, so the real placeholder
    // styling (not the collapsed transparent one) is what computes.
    <div className='flex flex-wrap items-center gap-4 rounded-sm bg-background p-4'>
      <ExpandableSearch variant='primary-600' defaultValue='q'>
        <ExpandableSearchField placeholder='Search' />
      </ExpandableSearch>
      <ExpandableSearch variant='accent-600' defaultValue='q'>
        <ExpandableSearchField placeholder='Search' />
      </ExpandableSearch>
      <ExpandableSearch variant='accent-400' defaultValue='q'>
        <ExpandableSearchField placeholder='Search' />
      </ExpandableSearch>
      <ExpandableSearch variant='grey-800' defaultValue='q'>
        <ExpandableSearchField placeholder='Search' />
      </ExpandableSearch>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const roots = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="expandable-search"]'),
    )
    if (roots.length !== 4) {
      throw new Error(`Expected 4 search forms, got ${roots.length}.`)
    }

    // The three surfaces whose 70% placeholder composite fails WCAG 1.4.3
    // (primary-600 3.0:1, accent-600 3.1:1, accent-400 4.48:1) must raise
    // the mix to full ink…
    for (const root of roots.slice(0, 3)) {
      const pct = getComputedStyle(root).getPropertyValue('--search-placeholder-pct').trim()
      if (pct !== '100%') {
        throw new Error(
          `Expected the ${root.dataset.variant} variant to raise --search-placeholder-pct to 100%, got "${pct || '(unset)'}".`,
        )
      }
    }

    // …while a comfortably-passing surface leaves the token unset, so the
    // color-mix falls back to the default 70%.
    const greyPct = getComputedStyle(roots[3]!).getPropertyValue('--search-placeholder-pct').trim()
    if (greyPct !== '') {
      throw new Error(
        `Expected the grey-800 variant to keep the 70% fallback (token unset), got "${greyPct}".`,
      )
    }

    // The derived placeholder token actually consumes the percentage: the
    // computed custom property carries the substituted 100% on an overridden
    // variant and the 70% fallback elsewhere.
    const overridden = getComputedStyle(roots[0]!).getPropertyValue('--search-placeholder')
    if (!overridden.includes('100%')) {
      throw new Error(
        `Expected primary-600's --search-placeholder to mix at 100%, got "${overridden}".`,
      )
    }
    const fallback = getComputedStyle(roots[3]!).getPropertyValue('--search-placeholder')
    if (!fallback.includes('70%')) {
      throw new Error(`Expected grey-800's --search-placeholder to mix at 70%, got "${fallback}".`)
    }

    // ── The ratio itself ─────────────────────────────────────────────────────
    //
    // Everything above checks the PLUMBING — that the percentage token is set,
    // and that the color-mix consumes it. None of it checks the thing the
    // percentages exist for: that the resulting placeholder actually clears
    // WCAG 1.4.3 against its chip.
    //
    // Nothing else can. axe-core does not evaluate ::placeholder, so this
    // colour sits outside the a11y gate entirely, and before this block the
    // ratios lived only as arithmetic in a source comment — a token retune
    // that broke one was undetectable. Measuring here closes that.
    //
    // A custom property does not compute to rgb() on its own (it is not
    // registered via @property), so the value is resolved by painting it: a
    // probe element taking `color: var(--search-placeholder)` computes to the
    // real, substituted colour.
    for (const root of roots) {
      const probe = root.ownerDocument.createElement('span')
      probe.style.color = 'var(--search-placeholder)'
      root.append(probe)
      const placeholder = getComputedStyle(probe).color
      probe.remove()

      expectContrast(placeholder, getComputedStyle(root).backgroundColor, {
        minimum: 4.5,
        label: `${root.dataset.variant ?? 'unknown'} placeholder`,
      })
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS Check',
  args: {
    variant: 'primary-800',
    children: <ExpandableSearchField placeholder='Search' />,
  },
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the primary-800 variant resolves
    // bg-primary-800 to a real colour, declares --search-ink, and the halo
    // mixes down from it.
    const root = getRoot(canvasElement)
    const styles = getComputedStyle(root)

    if (styles.backgroundColor === '' || styles.backgroundColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${styles.backgroundColor}". Is globals.css loaded?`,
      )
    }

    const ink = styles.getPropertyValue('--search-ink').trim()
    if (ink === '') {
      throw new Error('Expected the colour variant to declare --search-ink.')
    }

    const halo = styles.getPropertyValue('--search-halo').trim()
    if (halo === '') {
      throw new Error('Expected --search-halo to mix down from --search-ink.')
    }

    // The submit button's icon paints in the ink, not the surface colour.
    const button = root.querySelector<HTMLElement>('[data-slot="expandable-search-button"]')
    if (!button) {
      throw new Error('Expected a [data-slot="expandable-search-button"] submit button.')
    }
    const buttonColor = getComputedStyle(button).color
    if (buttonColor === '' || buttonColor === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected the button ink to resolve to a visible colour, got "${buttonColor}".`,
      )
    }
    if (buttonColor === styles.backgroundColor) {
      throw new Error('The button icon paints its own surface colour — the ink failed to apply.')
    }
  },
}

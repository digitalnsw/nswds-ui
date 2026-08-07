/**
 * ExpandableSearch — Default + Variants + CollapsedFocus + PlaceholderContrast
 * + CssCheck + Playground
 *
 * A 48px search chip that expands into a text field on focus or while it
 * holds a value, and submits the query to `onAction`. Every variant's icon,
 * halos, placeholder and focus outline derive from a single --search-ink
 * token.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ExpandableSearch, ExpandableSearchField } from './expandable-search.js'

const meta = {
  title: 'Components/ExpandableSearch',
  component: ExpandableSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 p-6 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Expandable search</h1>
            <p className='text-base text-muted-foreground'>
              A site-search disclosure for page chrome: a 48px chip that expands into a text field
              the moment it takes focus, and stays open while it holds a value. Enter (or the search
              button) submits the query to <code>onAction</code>; Escape clears; an empty, blurred
              field collapses back to the chip. Compose <code>ExpandableSearchField</code> inside{' '}
              <code>ExpandableSearch</code>, typically within <code>HeaderActions</code>.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Variants</h2>
            <p className='text-base text-muted-foreground'>
              The footer&rsquo;s thirteen surface names plus <code>default</code> — the nswds-app
              grey chip with a primary-blue icon, for headers on white. Icon, hover halos,
              placeholder and the focus outline all derive from each surface&rsquo;s{' '}
              <code>--search-ink</code>, so a variant is one declaration, and every pair meets WCAG
              2.2 AA in light mode and AAA in dark.
            </p>
            <div className='flex flex-wrap items-center gap-4 rounded-sm bg-white p-4'>
              <ExpandableSearch variant='default'>
                <ExpandableSearchField placeholder='Search' />
              </ExpandableSearch>
              <ExpandableSearch variant='primary-800'>
                <ExpandableSearchField placeholder='Search' />
              </ExpandableSearch>
              <ExpandableSearch variant='grey-800'>
                <ExpandableSearchField placeholder='Search' />
              </ExpandableSearch>
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Accessibility</h2>
            <p className='text-base text-muted-foreground'>
              The collapsed control is the text input itself, styled as a chip — so the first focus
              or tap both reveals and focuses the field. It carries a visually-hidden label and{' '}
              <code>aria-label</code> (&ldquo;Search&rdquo;, overridable), is{' '}
              <code>type=&quot;search&quot;</code> with <code>enterKeyHint=&quot;search&quot;</code>
              , and keyboard focus draws a 2px ink outline inside the chip, where contrast with the
              surface is guaranteed on every variant. Transitions honour{' '}
              <code>prefers-reduced-motion</code>.
            </p>
          </section>
        </div>
      ),
      description: {
        component:
          'A 48px search chip that expands into a text field on focus or while it holds a value, submitting the query to onAction. Fourteen ink-driven surface variants.',
      },
    },
  },
  args: {
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
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
        'white',
      ],
      description:
        'Surface colour — the footer vocabulary plus default (grey chip, primary icon). Icon, halos, placeholder and focus outline derive from the surface ink.',
      table: { category: 'Appearance' },
    },
    onAction: {
      description:
        'Called with the current query when the form submits (Enter or the search button).',
      table: { category: 'Behaviour' },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial query. A non-empty value renders the field expanded.',
      table: { category: 'Behaviour' },
    },
    onSubmit: {
      table: { disable: true, category: 'Behaviour' },
    },
    children: {
      table: { disable: true, category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
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

/**
 * Set a React-controlled input's value the way a user would: through the
 * native setter (so React's value tracking notices the change) followed by a
 * bubbling input event.
 */
function typeIntoInput(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
  if (!setter) {
    throw new Error('Could not access the native HTMLInputElement value setter.')
  }
  setter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

// Module-level capture for the Default story's onAction — reset at the top of
// its play() so replays stay deterministic.
const captured: { value: string | null } = { value: null }

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    onAction: (value: string) => {
      captured.value = value
    },
    children: <ExpandableSearchField placeholder='Search this site' />,
  },
  play: async ({ canvasElement }) => {
    captured.value = null
    const root = getRoot(canvasElement)
    const input = getInput(root)

    // Collapsed: a 48px chip whose purpose is still machine-readable.
    if (root.hasAttribute('data-expanded')) {
      throw new Error('Expected the field to render collapsed before any interaction.')
    }
    if (input.type !== 'search') {
      throw new Error(`Expected the input to be type="search", got type="${input.type}".`)
    }
    if (input.getAttribute('aria-label') !== 'Search') {
      throw new Error(
        `Expected the collapsed input to carry aria-label "Search", got "${input.getAttribute('aria-label')}".`,
      )
    }
    const collapsedWidth = input.getBoundingClientRect().width
    if (Math.round(collapsedWidth) !== 48) {
      throw new Error(`Expected the collapsed input to be 48px wide, got ${collapsedWidth}px.`)
    }

    // Focus expands: data-expanded appears and the width transition runs.
    input.focus()
    await waitFor(
      () => root.hasAttribute('data-expanded'),
      'Expected data-expanded on the root once the input took focus.',
    )
    await waitFor(
      () => input.getBoundingClientRect().width > collapsedWidth * 3,
      'Expected the input to expand well beyond its 48px chip once focused.',
    )

    // Type a query and submit the form; onAction receives the value.
    typeIntoInput(input, 'planning permits')
    await waitFor(
      () => input.value === 'planning permits',
      'Expected typing to update the controlled value.',
    )
    root.requestSubmit()
    await waitFor(
      () => captured.value === 'planning permits',
      'Expected onAction to receive the submitted query "planning permits".',
    )

    // Cleared and blurred, the field collapses back to the chip.
    typeIntoInput(input, '')
    input.blur()
    await waitFor(
      () => !root.hasAttribute('data-expanded'),
      'Expected the field to collapse once empty and blurred.',
    )
  },
}

// Unique forms per instance — ids are generated with useId, so nothing
// collides. Each variant sits on a backdrop it is designed for.
export const Variants: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4 rounded-sm bg-white p-4'>
        <ExpandableSearch variant='default'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-sm text-grey-800'>default — grey-100 chip for white headers</span>
      </div>
      <div className='flex items-center gap-4 rounded-sm bg-grey-100 p-4'>
        <ExpandableSearch variant='white'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-sm text-grey-800'>white — on light-grey chrome</span>
      </div>
      <div className='flex items-center gap-4 rounded-sm bg-white p-4'>
        <ExpandableSearch variant='primary-800'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-sm text-grey-800'>primary-800 — brand-blue surface, white ink</span>
      </div>
      <div className='flex items-center gap-4 rounded-sm bg-white p-4'>
        <ExpandableSearch variant='grey-800'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
        <span className='text-sm text-grey-800'>grey-800 — dark-grey surface, white ink</span>
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
    <div className='flex flex-wrap items-center gap-4 rounded-sm bg-white p-4'>
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

export const Playground: Story = {
  args: {
    children: <ExpandableSearchField placeholder='Search this site' />,
  },
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

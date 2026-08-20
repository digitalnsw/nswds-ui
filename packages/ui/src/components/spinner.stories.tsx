/**
 * Spinner — Default + Playground
 *
 * Sub-groups live in separate story files so Storybook renders them as
 * collapsible sidebar folders:
 *   Components/Spinner/Features        → spinner.features.stories.tsx
 *   Components/Spinner/Accessibility   → spinner.accessibility.stories.tsx
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './spinner.js'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const colors = ['primary', 'accent', 'white'] as const

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className='max-w-3xl space-y-8 text-foreground'>
          <section className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-normal'>Spinner</h1>
            <p className='text-base text-muted-foreground'>
              Spinner is a busy-state indicator for in-flight asynchronous work. Use it to
              communicate that the page or a region is loading content, submitting a form, or
              otherwise waiting on a response before the result can be shown.
            </p>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
            <Spinner />
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Sizes</h2>
            <div className='flex flex-wrap items-end gap-6'>
              {sizes.map((size) => (
                <div key={size} className='flex flex-col items-center gap-2'>
                  <Spinner size={size} label={`Loading (${size})`} />
                  <span className='text-xs text-muted-foreground'>{size}</span>
                </div>
              ))}
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-2xl font-bold tracking-normal'>Usage</h2>
            <p className='text-base text-muted-foreground'>
              A Spinner is named out of the box: <code>label</code> defaults to &quot;Loading&quot;
              and renders as visually-hidden text inside a <code>role=&quot;status&quot;</code>{' '}
              region, so assistive tech announces it politely when the spinner appears. Set{' '}
              <code>label</code> to describe what is loading, or to an empty string when the
              surroundings already convey the busy state — that drops the live region rather than
              leaving an empty one.
            </p>
            <div className='flex items-center gap-3'>
              <Spinner label='Loading results' />
              <span className='text-sm text-foreground'>Loading results…</span>
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'Spinner is a compact busy-state indicator for in-flight asynchronous work. It announces loading politely via role="status", naming itself from the `label` prop (default "Loading") rendered as visually-hidden text — no consumer wiring required.',
      },
    },
  },
  // No `aria-label` here. It used to be a meta-level arg, which made every
  // story — including the docs examples — look as though a consumer must supply
  // one. The component names itself from `label` (default "Loading"), so the
  // default story now exercises that path instead. It also removed a real axe
  // violation: with `label=""` the root drops role="status", and an inherited
  // aria-label on the resulting role-less <span> is aria-prohibited-attr.
  args: {
    size: 'md',
    color: 'primary',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes,
      description:
        'Diameter preset for the spinner. Maps to fixed Tailwind size utilities (xs=12px through xl=40px).',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'inline-radio',
      options: colors,
      description:
        'Colour token for the spinning arc. `primary` and `accent` use the masterbrand theme; `white` is for use on dark or coloured surfaces.',
      table: { category: 'Appearance' },
    },
    label: {
      control: 'text',
      description:
        'Accessible name for the role="status" live region, rendered as visually-hidden text. Defaults to "Loading" — a Spinner is named out of the box and needs no consumer wiring. Set it to describe what is loading (e.g. "Loading results"), or to an empty string to suppress the live region entirely when the surroundings already convey the busy state (inside a Button, whose aria-busy says it).',
      table: { category: 'Accessibility', defaultValue: { summary: 'Loading' } },
    },
    'aria-label': {
      control: 'text',
      description:
        'Optional override. Passed straight through to the root element, where it wins over the `label` text for the accessible name. Prefer `label` — it is the supported API and keeps the name in the live region contents.',
      table: { category: 'Accessibility' },
    },
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
  // Exercises the component's OWN naming path, with no `aria-label` in args.
  // The previous version passed `aria-label` in args and then asserted the DOM
  // carried it back — `aria-label` is a pass-through prop that the component
  // never reads or transforms, so that assertion only proved object spread
  // works. It could not fail, and it left `label` (the real API, which has a
  // default and renders the sr-only text) with no coverage at all.
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')

    if (!status) {
      throw new Error('Could not find element with role="status".')
    }

    if (status.hasAttribute('aria-label')) {
      throw new Error(
        `A default Spinner must not set aria-label — it names itself with sr-only text. Received "${status.getAttribute('aria-label')}".`,
      )
    }

    // With no aria-label, role="status" takes its accessible name from its
    // contents, which is the sr-only span carrying the default label.
    if (status.textContent?.trim() !== 'Loading') {
      throw new Error(
        `Expected the default label "Loading" as the accessible name, received "${status.textContent?.trim()}".`,
      )
    }
  },
}

export const CustomLabel: Story = {
  name: 'Custom label',
  args: { label: 'Loading results' },
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')
    if (!status) {
      throw new Error('Could not find element with role="status".')
    }
    if (status.textContent?.trim() !== 'Loading results') {
      throw new Error(
        `Expected the label prop to drive the accessible name, received "${status.textContent?.trim()}".`,
      )
    }
  },
}

export const SuppressedLabel: Story = {
  name: 'Suppressed label',
  // `label=""` is the documented escape hatch for a Spinner whose busy state is
  // already conveyed by its surroundings (a Button's aria-busy, a toast). It
  // must drop role="status" entirely — an empty live region is redundant noise,
  // not a silent one.
  args: { label: '' },
  play: async ({ canvasElement }) => {
    if (canvasElement.querySelector('[role="status"]')) {
      throw new Error(
        'label="" must suppress role="status" rather than leave an empty live region.',
      )
    }
    if (canvasElement.querySelector('.sr-only')) {
      throw new Error('label="" must render no sr-only text.')
    }
  },
}

export const AriaLabelOverride: Story = {
  name: 'aria-label override',
  // Supplying aria-label is still supported — it wins over the contents for the
  // accessible name. Asserted as an OVERRIDE of the default path above, not as
  // the component's naming requirement.
  args: { 'aria-label': 'Loading search results' },
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[role="status"]')
    if (!status) {
      throw new Error('Could not find element with role="status".')
    }
    if (status.getAttribute('aria-label') !== 'Loading search results') {
      throw new Error(
        `Expected the aria-label override to reach the DOM, received "${status.getAttribute('aria-label')}".`,
      )
    }
  },
}

export const CssCheck: Story = {
  name: 'CSS check — two-tone fill',
  args: { size: 'xl', color: 'primary' },
  /**
   * Pins the two-tone rendering, which nothing previously asserted.
   *
   * The track and the arc take their colour by different routes: the track's
   * `fill="currentColor"` resolves against the `text-*` utility, while the arc
   * carries no `fill` of its own and inherits the `fill-*` utility set on the
   * <svg>. Both are checked against their source property here, so the two
   * tones cannot silently collapse into one.
   */
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    if (!svg) {
      throw new Error('Could not find the spinner svg.')
    }
    const paths = svg.querySelectorAll('path')
    if (paths.length !== 2) {
      throw new Error(`Expected 2 paths (track + arc), found ${paths.length}.`)
    }

    const svgStyles = getComputedStyle(svg)
    const track = getComputedStyle(paths[0]!).fill
    const arc = getComputedStyle(paths[1]!).fill

    for (const [name, value] of [
      ['track', track],
      ['arc', arc],
    ] as const) {
      if (!value || value === 'none' || value === 'rgba(0, 0, 0, 0)') {
        throw new Error(`Expected the ${name} to paint a colour, got "${value}".`)
      }
    }

    if (track === arc) {
      throw new Error(
        `Expected a two-tone spinner, but the track and arc resolved to the same colour ("${track}").`,
      )
    }

    // The track follows `color` (via currentColor)…
    if (track !== svgStyles.color) {
      throw new Error(
        `Expected the track to resolve from the text-* utility (${svgStyles.color}), got "${track}".`,
      )
    }
    // …and the arc follows the fill-* utility set on the svg.
    if (arc !== svgStyles.fill) {
      throw new Error(
        `Expected the arc to inherit the fill-* utility (${svgStyles.fill}), got "${arc}".`,
      )
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      // Compact view: Name + Control only, no description/type/default columns
      expanded: false,
      sort: 'requiredFirst',
    },
  },
  render: (args) => (
    <div className='flex w-full max-w-xl items-center justify-center rounded-sm border border-border bg-background p-6'>
      <Spinner {...args} />
    </div>
  ),
}

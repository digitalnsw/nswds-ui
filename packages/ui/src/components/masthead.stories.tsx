/**
 * Masthead — Default + Colours + Containers + Playground
 *
 * The "A NSW Government website" strip. Colour variants are curated WCAG 2.2
 * AAA pairs; container variants reproduce the nswds-app (fluid) and legacy
 * nsw-container (contained) layouts.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Masthead } from './masthead.js'

const meta = {
  title: 'Components/Masthead',
  component: Masthead,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      page: () => (
        <div className="max-w-3xl space-y-8 p-6 text-foreground">
          <section className="space-y-3">
            <h1 className="text-4xl font-bold tracking-normal">Masthead</h1>
            <p className="text-base text-muted-foreground">
              The masthead tells people they are on an official NSW Government
              website. It sits above the site header on every page, paired with
              SkipLinks rendered immediately before it. Every colour variant is
              a verified WCAG 2.2 AAA (7:1) text/background pair.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Colours</h2>
            {/* Unique ids: the component defaults to id="nsw-masthead", which
                is only valid once per page. */}
            <div className="space-y-2">
              <Masthead id="docs-masthead-dark" color="dark" />
              <Masthead id="docs-masthead-light" color="light" />
              <Masthead
                id="docs-masthead-white"
                color="white"
                className="border border-border"
              />
              <Masthead id="docs-masthead-grey" color="grey" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-normal">Containers</h2>
            <p className="text-base text-muted-foreground">
              <code>fluid</code> spans the full width (nswds-app parity);
              <code> contained</code> centres the content in a 1200px column
              (legacy nsw-container parity). Fine-tune either with the
              <code> --masthead-max-width</code> and
              <code> --masthead-padding-x</code> custom properties.
            </p>
            <div className="space-y-2">
              <Masthead id="docs-masthead-fluid" container="fluid">
                fluid (default)
              </Masthead>
              <Masthead id="docs-masthead-contained" container="contained">
                contained
              </Masthead>
            </div>
          </section>
        </div>
      ),
      description: {
        component:
          'The "A NSW Government website" strip shown above the site header, with WCAG 2.2 AAA colour variants and fluid/contained width presets.',
      },
    },
  },
  args: {
    color: 'dark',
    container: 'fluid',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['dark', 'light', 'white', 'grey'],
      description:
        'WCAG 2.2 AAA text/background pair — dark and light match the legacy .nsw-masthead and --light themes.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description:
        'Inner wrapper layout — fluid is full-bleed (nswds-app), contained centres a 1200px column (legacy nsw-container).',
      table: { category: 'Layout' },
    },
    children: {
      control: 'text',
      description: 'Replaces the default "A NSW Government website" message.',
      table: { category: 'Content' },
    },
    className: {
      table: { disable: true, category: 'Advanced' },
    },
    containerClassName: {
      table: { disable: true, category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Masthead>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMasthead(canvasElement: HTMLElement) {
  const el = canvasElement.querySelector<HTMLElement>('[data-slot="masthead"]')
  if (!el) {
    throw new Error('Could not find an element with [data-slot="masthead"].')
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const masthead = getMasthead(canvasElement)

    if (!masthead.textContent?.includes('A NSW Government website')) {
      throw new Error(
        'Expected the Masthead to render its default "A NSW Government website" message.'
      )
    }

    const container = masthead.querySelector('[data-slot="masthead-container"]')
    if (!container) {
      throw new Error(
        'Expected an inner [data-slot="masthead-container"] wrapper.'
      )
    }
  },
}

// Multi-instance stories pass unique ids: the component defaults to
// id="nsw-masthead", which is only valid once per page.
export const Colours: Story = {
  render: () => (
    <div className="space-y-2">
      <Masthead id="masthead-dark" color="dark" />
      <Masthead id="masthead-light" color="light" />
      <Masthead
        id="masthead-white"
        color="white"
        className="border border-border"
      />
      <Masthead id="masthead-grey" color="grey" />
    </div>
  ),
}

export const Containers: Story = {
  render: () => (
    <div className="space-y-2">
      <Masthead id="masthead-fluid" container="fluid">
        fluid — full-bleed (nswds-app parity)
      </Masthead>
      <Masthead id="masthead-contained" container="contained">
        contained — centred 1200px column (legacy nsw-container parity)
      </Masthead>
      <Masthead
        id="masthead-contained-custom"
        container="contained"
        style={{ '--masthead-max-width': '40rem' } as React.CSSProperties}
      >
        contained — custom --masthead-max-width: 40rem
      </Masthead>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css is loaded: the dark colour variant resolves
    // bg-primary-800 to a real, non-transparent colour.
    const masthead = getMasthead(canvasElement)
    const bg = getComputedStyle(masthead).backgroundColor
    if (bg === '' || bg === 'rgba(0, 0, 0, 0)') {
      throw new Error(
        `Expected bg-primary-800 to resolve to a visible colour, got "${bg}". Is globals.css loaded?`
      )
    }
  },
}

export const Playground: Story = {
  name: 'Playground',
  parameters: {
    controls: {
      expanded: false,
      sort: 'requiredFirst',
    },
  },
}

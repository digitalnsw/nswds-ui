/**
 * Spinner — Features
 *
 * Size scale, colour variants, and common composition patterns (inside
 * Button, centered in a content area, paired with visible text, rendered
 * on a dark surface).
 *
 * These stories are intended for design QA across the full Spinner surface
 * and as composition reference for consumers. Spinner has two visual axes:
 * `size` (xs / sm / md / lg / xl) and `color` (primary / accent / white) —
 * see the Sizes and Colours stories for the matrices.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button.js'
import { Spinner } from './spinner.js'
import { ThemeSurface, docsTemplate } from './story-helpers.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Spinner/Features',
  component: Spinner,
  parameters: {
    layout: 'padded',
  },
  args: {
    'aria-label': 'Loading',
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'All five size presets rendered side by side (xs, sm, md, lg, xl) with a size label beneath each spinner.',
          why: 'Confirms the size token scale is monotonic and that each preset maps to the documented pixel dimension without overlap or clipping.',
          how: 'Visually compare the diameter of each spinner against the label below it. Each step should be visibly larger than the previous.',
          caveat:
            'Sizes are fixed Tailwind h/w utilities; they do not scale with the surrounding font size. Components needing inline em-sized spinners must override className.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-3xl rounded-sm border border-border bg-background p-6">
      <div className="flex flex-wrap items-end gap-8">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Spinner size={size} aria-label={`Loading (${size})`} />
            <span className="text-xs text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const InButton: Story = {
  name: 'In Button',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Spinner nested inside a Button at the sm and default button sizes, plus a disabled loading button for comparison.',
          why: 'Verifies that the spinner aligns with the button text baseline, does not push the button height, and reads correctly when paired with a label.',
          how: 'Check that the spinner is vertically centered, sized proportionally to the button, and that the surrounding label remains readable.',
          caveat:
            "When using Spinner inside Button, prefer Button's built-in `loading` prop where possible — it handles the swap and disables the button automatically.",
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-3xl rounded-sm border border-border bg-background p-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">
          <Spinner size="xs" aria-label="Saving" />
          Saving
        </Button>
        <Button>
          <Spinner size="sm" aria-label="Saving" />
          Saving
        </Button>
        <Button variant="outline">
          <Spinner size="sm" aria-label="Refreshing" />
          Refreshing
        </Button>
        <Button disabled>
          <Spinner size="sm" aria-label="Submitting" />
          Submitting
        </Button>
      </div>
    </div>
  ),
}

export const InCenter: Story = {
  name: 'In Center',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'A card-like container with a centered Spinner — the typical loading state for a content region while data is in flight.',
          why: 'Most consumers use Spinner inside a placeholder block (table, card, panel) rather than inline. This story documents that recipe so consumers do not have to reinvent the layout.',
          how: 'Confirm the spinner is both horizontally and vertically centered inside the container, with adequate padding around it.',
          caveat:
            'The fixed container height (h-48) is illustrative — real consumers should size the placeholder to roughly match the eventual content to avoid layout shift when the content arrives.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-3xl rounded-sm border border-border bg-background p-6">
      <div className="flex h-48 items-center justify-center rounded-sm border border-dashed border-border bg-muted/30">
        <Spinner size="lg" aria-label="Loading content" />
      </div>
    </div>
  ),
}

export const WithText: Story = {
  name: 'With Text',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Spinner paired with a visible "Loading…" text label. When visible text describes the busy state, the spinner becomes decorative reinforcement of the message.',
          why: 'A visible label is the most accessible loading pattern — it communicates progress to sighted users and to assistive tech without relying on aria-label alone.',
          how: 'Confirm the spinner and the text are aligned on the same baseline and that the gap between them is comfortable but tight enough to read as a single unit.',
          caveat:
            'When visible text is present, the aria-label on Spinner can be redundant. Either remove it or set it to match the visible text so screen-reader users do not hear it twice in different wording.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-3xl space-y-4 rounded-sm border border-border bg-background p-6">
      <div className="flex items-center gap-3">
        <Spinner size="sm" aria-label="Loading" />
        <span className="text-sm text-foreground">Loading…</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="md" aria-label="Loading results" />
        <span className="text-base text-foreground">Loading results…</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="lg" aria-label="Submitting your application" />
        <span className="text-lg text-foreground">
          Submitting your application…
        </span>
      </div>
    </div>
  ),
}

export const Colours: Story = {
  name: 'Colours',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'All three colour variants rendered side by side: `primary` (masterbrand blue), `accent` (waratah red), and `white` (for dark or coloured surfaces).',
          why: 'Most spinners read against the page background using `primary`, but action-emphasis flows (e.g. inside an accent CTA) and dark surfaces need dedicated tokens so the spinner stays visible without consumers overriding `className`.',
          how: 'Confirm each spinner uses the expected fill: blue for primary, red for accent, white for the white variant on the dark panel below.',
          caveat:
            'The `white` variant is intended for placement on a coloured or dark surface — on the default background it will appear nearly invisible by design.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-3xl space-y-4">
      <div className="rounded-sm border border-border bg-background p-6">
        <div className="flex flex-wrap items-end gap-8">
          {(['primary', 'accent'] as const).map((color) => (
            <div key={color} className="flex flex-col items-center gap-2">
              <Spinner color={color} aria-label={`Loading (${color})`} />
              <span className="text-xs text-muted-foreground">{color}</span>
            </div>
          ))}
        </div>
      </div>
      <ThemeSurface color="secondary">
        <div className="flex flex-col items-center gap-2">
          <Spinner color="white" aria-label="Loading (white)" />
          <span className="text-xs text-grey-200">white</span>
        </div>
      </ThemeSurface>
    </div>
  ),
}

export const ColourOnDark: Story = {
  name: 'Colour On Dark',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'The `white` colour variant rendered on a low-contrast (grey-800) surface to verify the `fill-white` arc and `text-white/30` ring remain visible against a dark background.',
          why: 'The default `primary` variant (`fill-primary-800` / `text-grey-400`) is tuned for light surfaces and would lose contrast on a dark panel. This story documents using `color="white"` on dark/branded surfaces and catches regressions in those palette classes.',
          how: 'Confirm both the spinning arc (`fill-white`) and the static ring (`text-white/30`) are clearly distinguishable against the dark surface.',
          caveat:
            'Spinner colours are palette-specific classes (e.g. `fill-primary-800`, not the semantic `fill-primary`) so the exact NSW shade is preserved. Pick the `color` variant to match the surface rather than relying on a single token that adapts to `.dark`.',
        }),
      },
    },
  },
  render: () => (
    <ThemeSurface color="secondary">
      <div className="flex flex-wrap items-end gap-8">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Spinner
              size={size}
              color="white"
              aria-label={`Loading (${size})`}
            />
            <span className="text-xs text-grey-200">{size}</span>
          </div>
        ))}
      </div>
    </ThemeSurface>
  ),
}

/**
 * Spinner — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Spinner component.
 *
 * Spinner is a non-interactive status indicator, so the applicable criteria
 * differ from interactive components:
 *   - 4.1.3 Status Messages    — the role="status" live region
 *   - 1.4.11 Non-text Contrast — spinner arc vs ring vs surrounding surface
 *   - 1.4.1  Use of Colour     — loading state is not conveyed by colour alone
 *   - 1.1.1  Non-text Content  — decorative SVG with a text alternative via aria-label
 *
 * Focus, keyboard, and target-size criteria are not applicable — Spinner is
 * not interactive and has no tab stop.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './spinner.js'
import { ThemeSurface, wcagStoryMeta } from './story-helpers.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Spinner/Accessibility',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatus(canvasElement: HTMLElement): HTMLElement {
  const status = canvasElement.querySelector<HTMLElement>('[role="status"]')

  if (!status) {
    throw new Error('Could not find element with role="status".')
  }

  return status
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const StatusMessage: Story = {
  name: 'Status Message — 4.1.3',
  parameters: {
    wcag: ['4.1.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.3',
          why: 'Loading state is a status message: it is informative but does not interrupt the user. The Spinner uses role="status", which maps to an implicit aria-live="polite" region so the accessible name is announced when the spinner appears.',
          how: 'Inspect the outer element — it should expose role="status" and a non-empty aria-label. Verify with a screen reader that the label is announced politely when the spinner is inserted into the DOM. The play() function below performs the role and label checks programmatically.',
          caveat:
            'The live-region announcement only fires when the element is inserted (or its accessible name changes) while a screen reader is running. Spinners that are already present at page load may not be re-announced.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <Spinner aria-label="Loading results" />
      <p className="text-sm text-muted-foreground">
        Outer element has role=&quot;status&quot; and aria-label=&quot;Loading
        results&quot;.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const status = getStatus(canvasElement)

    if (status.getAttribute('role') !== 'status') {
      throw new Error(
        `Expected role="status", received "${status.getAttribute('role')}".`
      )
    }

    const label = status.getAttribute('aria-label')
    if (!label || label.trim().length === 0) {
      throw new Error(
        'Spinner has no accessible name — aria-label is missing or empty.'
      )
    }
  },
}

export const NonTextContrast: Story = {
  name: 'Non-text Contrast — 1.4.11',
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The spinner is a graphical UI component conveying state. Both the moving arc (fill-primary-800, or fill-white for the white variant) and the static ring (text-grey-400, or text-white/30) must meet 3:1 contrast against the surrounding background, and the arc must be distinguishable from the ring.',
          how: 'Use a colour-contrast checker on the rendered SVG against each surface below. Verify the moving arc is clearly distinguishable from the static ring and that both are visible against the surface colour.',
          caveat:
            'Contrast values depend on the active theme; check both light and dark modes. The grey-800 surface (secondary) below models how the spinner is expected to be used on branded dark panels.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <div className="rounded-sm border border-border bg-background p-6">
        <h4 className="mb-3 text-sm font-semibold text-foreground">
          On default background
        </h4>
        <div className="flex flex-wrap items-end gap-6">
          <Spinner size="md" aria-label="Loading" />
          <Spinner size="lg" aria-label="Loading" />
          <Spinner size="xl" aria-label="Loading" />
        </div>
      </div>

      <ThemeSurface color="secondary">
        <h4 className="mb-3 text-sm font-semibold text-grey-50">
          On grey-800 surface
        </h4>
        <div className="flex flex-wrap items-end gap-6">
          <Spinner size="md" aria-label="Loading" />
          <Spinner size="lg" aria-label="Loading" />
          <Spinner size="xl" aria-label="Loading" />
        </div>
      </ThemeSurface>
    </div>
  ),
}

export const UseOfColour: Story = {
  name: 'Use of Colour — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'Loading state must not be conveyed by colour alone. Users with colour-vision deficiencies or who have disabled CSS need a non-colour cue to know that work is in progress.',
          how: 'Confirm the spinner communicates progress through animation (the rotating arc) AND through an accessible name (aria-label). Either signal alone is sufficient to convey "loading"; together they cover users with reduced colour vision, users with prefers-reduced-motion, and users on screen readers.',
          caveat:
            'Users with prefers-reduced-motion enabled may see a reduced or static animation. In that case the accessible name carries the full burden of communicating the loading state, so the aria-label must accurately describe what is loading.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <section className="space-y-3 rounded-sm border border-border bg-background p-6">
        <h4 className="text-sm font-semibold text-foreground">
          Animation + accessible name (recommended)
        </h4>
        <div className="flex items-center gap-3">
          <Spinner aria-label="Loading results" />
          <span className="text-sm text-muted-foreground">
            Visible animation + role=&quot;status&quot; +
            aria-label=&quot;Loading results&quot;.
          </span>
        </div>
      </section>

      <section className="space-y-3 rounded-sm border border-border bg-background p-6">
        <h4 className="text-sm font-semibold text-foreground">
          Pair with visible text for maximum clarity
        </h4>
        <div className="flex items-center gap-3">
          <Spinner size="sm" aria-label="Loading results" />
          <span className="text-sm text-foreground">Loading results…</span>
        </div>
        <p className="text-xs text-muted-foreground">
          A visible &quot;Loading…&quot; label removes any reliance on the
          spinner&apos;s colour or motion to convey the state.
        </p>
      </section>
    </div>
  ),
}

export const NonTextContent: Story = {
  name: 'Non-text Content — 1.1.1',
  parameters: {
    wcag: ['1.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.1.1',
          why: 'The animated SVG inside Spinner is non-text content. It must either be marked decorative and accompanied by a text alternative, or carry an accessible name itself. The Spinner pattern delegates the text alternative to the outer role="status" element via aria-label.',
          how: 'Inspect the DOM: the SVG should not carry role="img" or its own aria-label. The accessible name is supplied by the outer span via aria-label. The play() function asserts that when aria-label is missing the spinner has no accessible name — surfacing the consumer caveat below.',
          caveat:
            'Spinner does NOT default an aria-label. Consumers MUST supply one (or render visually-hidden text inside the span) — otherwise the role="status" element has no accessible name and screen readers will announce a bare "status" with no context.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <section className="space-y-3 rounded-sm border border-border bg-background p-6">
        <h4 className="text-sm font-semibold text-foreground">
          Correct — aria-label supplied
        </h4>
        <Spinner aria-label="Loading search results" />
        <p className="text-xs text-muted-foreground">
          The outer span exposes the accessible name; the SVG remains
          decorative.
        </p>
      </section>

      <section className="space-y-3 rounded-sm border border-danger/40 bg-danger/5 p-6">
        <h4 className="text-sm font-semibold text-foreground">
          Caveat — no aria-label
        </h4>
        <span data-no-label-spinner>
          <Spinner />
        </span>
        <p className="text-xs text-muted-foreground">
          Without aria-label, the role=&quot;status&quot; element has no
          accessible name. Screen readers will announce only the live region
          with no context — always supply a label.
        </p>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const noLabelWrapper = canvasElement.querySelector(
      '[data-no-label-spinner]'
    )

    if (!noLabelWrapper) {
      throw new Error('Could not find the no-aria-label demonstration wrapper.')
    }

    const status = noLabelWrapper.querySelector('[role="status"]')

    if (!status) {
      throw new Error('Could not find spinner role="status" element.')
    }

    const label = status.getAttribute('aria-label')

    if (label !== null && label.trim().length > 0) {
      throw new Error(
        `Expected the unlabelled spinner to have no aria-label, received "${label}".`
      )
    }
  },
}

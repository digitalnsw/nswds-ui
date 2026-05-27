/**
 * Separator — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Separator component.
 *
 * Separator is a presentational divider — it has no focus management,
 * no keyboard interaction, and no target-size requirement. The applicable
 * criteria are limited to:
 *
 *   1.3.1  Info and Relationships  (A)  — semantic vs decorative role
 *   1.4.11 Non-text Contrast       (AA) — the divider line must be perceivable
 *
 * Each story declares its criteria in `parameters.wcag` and uses
 * `wcagStoryMeta` so the criterion number, level, title, and W3C link
 * appear in the Docs panel automatically.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from './separator.js'
import { wcagStoryMeta } from './story-helpers.js'

const meta = {
  title: 'Components/Separator/Accessibility',
  component: Separator,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSeparatorByTestId(canvasElement: HTMLElement, testId: string) {
  const el = canvasElement.querySelector(
    `[data-slot="separator"][data-testid="${testId}"]`
  )
  if (!el) {
    throw new Error(
      `Could not find an element with [data-slot="separator"][data-testid="${testId}"].`
    )
  }
  return el
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'Visual groupings communicated by a divider line should also be communicated to assistive tech. A semantic separator exposes role="separator" so screen readers can announce the group boundary; a decorative separator is hidden so it does not add noise.',
          how: 'Inspect the accessibility tree (Chrome DevTools → Accessibility) for each example. The semantic separator should appear as role="separator"; the decorative one should be hidden (role="none" or aria-hidden). The play() function below asserts this programmatically.',
          caveat:
            'Default behaviour: Base UI Separator emits role="separator" — pass `decorative` only when the divider is purely visual (e.g. between unrelated marketing sections). Overuse of decorative=true silently drops grouping cues that assistive tech relies on.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <section className="space-y-3 rounded-sm border border-border bg-background p-4">
        <h4 className="text-sm font-semibold text-foreground">
          Semantic (role=&quot;separator&quot;)
        </h4>
        <p className="text-sm text-foreground">Personal details</p>
        <Separator data-testid="semantic-separator" />
        <p className="text-sm text-foreground">Account settings</p>
        <p className="text-xs text-muted-foreground">
          Exposed to assistive tech as a region boundary.
        </p>
      </section>

      <section className="space-y-3 rounded-sm border border-border bg-background p-4">
        <h4 className="text-sm font-semibold text-foreground">
          Decorative (hidden from AT)
        </h4>
        <p className="text-sm text-foreground">Marketing section</p>
        <Separator decorative data-testid="decorative-separator" />
        <p className="text-sm text-foreground">Featured products</p>
        <p className="text-xs text-muted-foreground">
          Pass <code>decorative</code> when the divider is purely visual.
        </p>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const semantic = getSeparatorByTestId(canvasElement, 'semantic-separator')
    const semanticRole = semantic.getAttribute('role')
    if (semanticRole !== 'separator') {
      throw new Error(
        `Expected semantic separator to expose role="separator", received role="${semanticRole}".`
      )
    }

    const decorative = getSeparatorByTestId(
      canvasElement,
      'decorative-separator'
    )
    const decorativeRole = decorative.getAttribute('role')
    if (decorativeRole === 'separator') {
      throw new Error(
        'Expected decorative separator NOT to expose role="separator" — it should be hidden from assistive tech (role="none" or aria-hidden).'
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
          why: 'A separator that users cannot see provides no grouping cue at all. WCAG 1.4.11 requires UI component boundaries to meet at least a 3:1 contrast ratio against the surrounding background so low-vision users can perceive them.',
          how: 'Use a contrast checker (e.g. Chrome DevTools colour picker) on the separator line against both the page background and the surface background it appears on. The `bg-border` token must resolve to a value with at least 3:1 contrast against `bg-background` in both light and dark themes.',
          caveat:
            'The `bg-border` token is the only colour Separator uses — changes to that token in `globals.css` directly affect this story. Verify both light and dark theme values whenever the token is updated.',
        }),
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <section className="space-y-3 rounded-sm border border-border bg-background p-4">
        <h4 className="text-sm font-semibold text-foreground">
          Horizontal on the default background
        </h4>
        <p className="text-sm text-foreground">Content above the line</p>
        <Separator />
        <p className="text-sm text-foreground">Content below the line</p>
        <p className="text-xs text-muted-foreground">
          The horizontal line uses the <code>bg-border</code> token and must
          measure at least 3:1 against the surrounding background.
        </p>
      </section>

      <section className="space-y-3 rounded-sm border border-border bg-background p-4">
        <h4 className="text-sm font-semibold text-foreground">
          Vertical on the default background
        </h4>
        <div className="flex h-12 items-stretch gap-3">
          <span className="flex items-center text-sm text-foreground">
            Left
          </span>
          <Separator orientation="vertical" />
          <span className="flex items-center text-sm text-foreground">
            Right
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Same token, same minimum 3:1 contrast requirement against the
          surface behind it.
        </p>
      </section>
    </div>
  ),
}

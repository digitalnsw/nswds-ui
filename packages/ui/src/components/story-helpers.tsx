/**
 * Shared utilities for Storybook story files in @nswds/ui.
 *
 * This module is intentionally NOT exported from the package barrel
 * (`packages/ui/src/index.ts`) and is excluded from the tsup build —
 * it is a dev-only helper consumed by `*.stories.tsx` files via the
 * relative path `./story-helpers.js`. Storybook compiles from source
 * via Vite, so the `.js` specifier resolves to this `.tsx` file.
 *
 * Canonical reference for the patterns implemented here:
 *   - packages/ui/src/components/button.stories.tsx
 *   - packages/ui/src/components/button.features.stories.tsx
 *   - packages/ui/src/components/button.accessibility.stories.tsx
 */

import type { ReactNode } from 'react'

// ─── docsTemplate ─────────────────────────────────────────────────────────────

export interface StoryDescription {
  what: string
  why: string
  how: string
  caveat: string
}

export function docsTemplate({
  what,
  why,
  how,
  caveat,
}: StoryDescription): string {
  return `${what}\n\nWhy it matters: ${why}\n\nHow to test: ${how}\n\nCaveats: ${caveat}`
}

// ─── ThemeSurface + colour-class helpers ──────────────────────────────────────

export const lowContrastSet = new Set<string>(['white', 'secondary'])

export function needsGreySurface(color: string): boolean {
  return lowContrastSet.has(color)
}

export function surfaceClasses(color: string): string {
  return needsGreySurface(color)
    ? 'rounded-sm border border-grey-700 bg-grey-800 p-4'
    : 'rounded-sm border border-border bg-background p-4'
}

export function titleClasses(color: string): string {
  return needsGreySurface(color) ? 'text-grey-50' : 'text-foreground'
}

export function bodyClasses(color: string): string {
  return needsGreySurface(color) ? 'text-grey-200' : 'text-muted-foreground'
}

export function ThemeSurface({
  color,
  children,
  className,
}: {
  color: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`${surfaceClasses(color)}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

// ─── WCAG 2.2 criteria map ────────────────────────────────────────────────────

export interface WcagCriterion {
  number: string
  level: 'A' | 'AA' | 'AAA'
  title: string
  url: string
}

/**
 * WCAG 2.2 success criteria commonly applicable to design-system components.
 * AAA criteria (e.g. 2.5.5 Target Size Enhanced) are included as informational —
 * level-AAA conformance is not a target, but the criterion is useful to
 * visualise alongside its AA counterpart (2.5.8).
 */
export const WCAG_CRITERIA: Record<string, WcagCriterion> = {
  '1.1.1': {
    number: '1.1.1',
    level: 'A',
    title: 'Non-text Content',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content',
  },
  '1.3.1': {
    number: '1.3.1',
    level: 'A',
    title: 'Info and Relationships',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships',
  },
  '1.3.5': {
    number: '1.3.5',
    level: 'AA',
    title: 'Identify Input Purpose',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose',
  },
  '1.4.1': {
    number: '1.4.1',
    level: 'A',
    title: 'Use of Color',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color',
  },
  '1.4.3': {
    number: '1.4.3',
    level: 'AA',
    title: 'Contrast (Minimum)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum',
  },
  '1.4.11': {
    number: '1.4.11',
    level: 'AA',
    title: 'Non-text Contrast',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast',
  },
  '1.4.13': {
    number: '1.4.13',
    level: 'AA',
    title: 'Content on Hover or Focus',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus',
  },
  '2.1.1': {
    number: '2.1.1',
    level: 'A',
    title: 'Keyboard',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard',
  },
  '2.4.3': {
    number: '2.4.3',
    level: 'A',
    title: 'Focus Order',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order',
  },
  '2.4.7': {
    number: '2.4.7',
    level: 'AA',
    title: 'Focus Visible',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible',
  },
  '2.4.11': {
    number: '2.4.11',
    level: 'AA',
    title: 'Focus Not Obscured (Minimum)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum',
  },
  '2.5.3': {
    number: '2.5.3',
    level: 'A',
    title: 'Label in Name',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/label-in-name',
  },
  '2.5.5': {
    number: '2.5.5',
    level: 'AAA',
    title: 'Target Size (Enhanced)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced',
  },
  '2.5.8': {
    number: '2.5.8',
    level: 'AA',
    title: 'Target Size (Minimum)',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum',
  },
  '3.3.1': {
    number: '3.3.1',
    level: 'A',
    title: 'Error Identification',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification',
  },
  '3.3.2': {
    number: '3.3.2',
    level: 'A',
    title: 'Labels or Instructions',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions',
  },
  '4.1.2': {
    number: '4.1.2',
    level: 'A',
    title: 'Name, Role, Value',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value',
  },
  '4.1.3': {
    number: '4.1.3',
    level: 'AA',
    title: 'Status Messages',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages',
  },
}

// ─── wcagStoryMeta ────────────────────────────────────────────────────────────

/**
 * Generate the `docs.description.story` string for an accessibility story.
 * Embeds the criterion number, level, title, and W3C link into the `what`
 * field, then delegates to `docsTemplate` for the full four-field
 * serialisation.
 *
 * Throws at module-load time if an unknown criterion number is supplied,
 * surfacing authoring errors immediately rather than silently producing a
 * broken description.
 */
export function wcagStoryMeta({
  criteria,
  why,
  how,
  caveat,
}: {
  criteria: string | string[]
  why: string
  how: string
  caveat: string
}): string {
  const numbers = Array.isArray(criteria) ? criteria : [criteria]
  const refs = numbers.map((n) => {
    const c = WCAG_CRITERIA[n]
    if (!c) throw new Error(`Unknown WCAG criterion: ${n}`)
    return `[${c.number} ${c.title} (${c.level})](${c.url})`
  })
  const what = `Demonstrates compliance with WCAG 2.2: ${refs.join(', ')}.`
  return docsTemplate({ what, why, how, caveat })
}

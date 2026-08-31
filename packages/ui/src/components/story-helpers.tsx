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

export function docsTemplate({ what, why, how, caveat }: StoryDescription): string {
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
    <div className={`${surfaceClasses(color)}${className ? ` ${className}` : ''}`}>{children}</div>
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

// ─── Contrast measurement ─────────────────────────────────────────────────────

/**
 * WCAG relative-luminance / contrast utilities for story assertions.
 *
 * Why these exist: axe-core's `color-contrast` rule does NOT evaluate
 * `::placeholder` text, or any colour that is not painted as an element's own
 * foreground. So the most delicate colour decisions in the package — the
 * `--search-placeholder` composite in expandable-search, whose variants set
 * `--search-placeholder-pct` to 100% precisely because the 70% mix fails AA —
 * sit entirely outside the a11y gate. Before this helper those ratios existed
 * only as arithmetic written in a source comment, and a token retune that broke
 * one of them was undetectable.
 */

/**
 * Resolve any CSS colour string to sRGB bytes, by PAINTING it.
 *
 * Not by parsing it. `getComputedStyle` does not normalise modern colours to
 * `rgb()` — CSS Color 4 says a colour computes to a value in its own space, so
 * Chromium hands back the authored `oklch(0.575 0.229 260.756)` verbatim, and
 * this package authors every colour in oklch. A regex scrape of that string
 * reads `0.575 0.229 260` as 8-bit channels and reports a confidently wrong
 * ratio (this helper's first version did exactly that, and "failed" a variant
 * that is fine).
 *
 * Filling a 1×1 canvas delegates the whole problem — oklch, color-mix, custom
 * property substitution, any future colour syntax — to the same engine that
 * paints the real pixels, which is the only thing guaranteed to agree with what
 * a user sees.
 */
export function resolveColor(value: string): { r: number; g: number; b: number; a: number } {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('Could not get a 2D context to resolve a colour.')
  }

  // An unparseable value leaves fillStyle at its previous value rather than
  // throwing, which would silently measure the wrong colour. Assigning over two
  // different sentinels turns that into a real failure: a parsed value lands on
  // the same result both times, an unparsed one keeps whichever sentinel it
  // followed.
  //
  // The two hex literals are canvas PARSER SENTINELS, not styling — they are
  // never painted and never reach a rendered surface — so the no-hardcoded-
  // colour rule (AGENTS.md §3) does not apply. They must be literal, opaque
  // and distinct from each other for the probe to work; a token would defeat
  // the point, because the whole test is whether `value` overwrote them.
  /* eslint-disable no-restricted-syntax */
  ctx.fillStyle = '#000000'
  ctx.fillStyle = value
  const first = ctx.fillStyle
  ctx.fillStyle = '#ffffff'
  ctx.fillStyle = value
  /* eslint-enable no-restricted-syntax */
  if (first !== ctx.fillStyle) {
    throw new Error(`The browser could not parse the colour "${value}".`)
  }

  ctx.clearRect(0, 0, 1, 1)
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
  return { r: r!, g: g!, b: b!, a: a! / 255 }
}

/** WCAG 2.x relative luminance for an 8-bit sRGB triple. */
export function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const linear = (c: number) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

/**
 * Composite a possibly-translucent foreground over an opaque backdrop.
 *
 * Required, not optional: several of these colours are `color-mix(…,
 * transparent)` composites, and measuring one without flattening it against its
 * backdrop first silently overstates the ratio.
 */
export function compositeOver(
  foreground: { r: number; g: number; b: number; a: number },
  backdrop: { r: number; g: number; b: number },
): { r: number; g: number; b: number } {
  const mix = (f: number, b: number) => f * foreground.a + b * (1 - foreground.a)
  return {
    r: mix(foreground.r, backdrop.r),
    g: mix(foreground.g, backdrop.g),
    b: mix(foreground.b, backdrop.b),
  }
}

/** WCAG contrast ratio (1–21) between two CSS colour strings. */
export function contrastRatio(foreground: string, background: string): number {
  const back = resolveColor(background)
  if (back.a < 1) {
    throw new Error(
      `The background "${background}" is translucent; resolve it against an opaque surface before measuring.`,
    )
  }
  const front = compositeOver(resolveColor(foreground), back)
  const lighter = Math.max(relativeLuminance(front), relativeLuminance(back))
  const darker = Math.min(relativeLuminance(front), relativeLuminance(back))
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Assert a WCAG contrast ratio, with a message naming the measured value — a
 * bare boolean failure here is close to undebuggable.
 *
 * `minimum` defaults to 4.5 (AA, normal text). Use 3 for large text and for
 * non-text UI components (1.4.11).
 */
export function expectContrast(
  foreground: string,
  background: string,
  { minimum = 4.5, label }: { minimum?: number; label: string },
): number {
  const ratio = contrastRatio(foreground, background)
  if (ratio < minimum) {
    throw new Error(
      `${label}: contrast ${ratio.toFixed(2)}:1 is below the required ${minimum}:1 ` +
        `(foreground "${foreground}" on background "${background}").`,
    )
  }
  return ratio
}

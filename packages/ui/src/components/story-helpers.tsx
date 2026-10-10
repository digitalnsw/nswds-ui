/**
 * Shared utilities for Storybook story files in @nswds/ui.
 *
 * This module is intentionally NOT exported from the package barrel
 * (`packages/ui/src/index.ts`) and is excluded from the tsup build —
 * it is a dev-only helper consumed by `*.stories.tsx` files via the
 * relative path `./story-helpers.js`. Storybook compiles from source
 * via Vite, so the `.js` specifier resolves to this `.tsx` file.
 *
 * The standard these helpers implement is docs/reference-storybook-standard.md;
 * the canonical example of it is the Button story set:
 *   - packages/ui/src/components/button.stories.tsx
 *   - packages/ui/src/components/button.tests.stories.tsx
 *   - packages/ui/src/components/button.accessibility.stories.tsx
 */

import { ArgTypes } from '@storybook/addon-docs/blocks'
import { Fragment, type ReactNode } from 'react'
import { expect, userEvent, waitFor } from 'storybook/test'

import { IconCheck } from '../icons/check.js'
import { IconClose } from '../icons/close.js'
import { cn } from '../lib/utils.js'
import {
  Breadcrumb,
  BREADCRUMB_MENU_OFFSET,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from './dropdown-menu.js'
import { Header, HeaderBrand } from './header.js'

// ─── Overlay teardown ─────────────────────────────────────────────────────────

/**
 * Resolves once the overlay element carrying `data-slot={slot}` has left the
 * DOM — which is what the end-of-play axe pass cares about, since a removed
 * element takes its focus guards with it (the CI `aria-hidden-focus` race).
 * For the Base UI popups removal lands after the exit transition; for the vaul
 * drawer the portal unmounts synchronously on close, so its removal is all
 * this proves, not a finished animation.
 */
export async function waitForUnmount(slot: string) {
  const selector = `[data-slot="${slot}"]`
  await waitFor(() => expect(document.querySelector(selector)).not.toBeInTheDocument(), {
    timeout: 3000,
    onTimeout: () => new Error(`[data-slot="${slot}"] was still mounted after 3s.`),
  })
}

/**
 * Presses Escape and waits for the overlay to unmount (see `waitForUnmount`).
 * The element must be present to begin with, so a renamed slot fails here
 * rather than turning the wait into a no-op.
 */
export async function closeOverlay(slot: string) {
  await expect(document.querySelector(`[data-slot="${slot}"]`)).toBeInTheDocument()
  await userEvent.keyboard('{Escape}')
  await waitForUnmount(slot)
}

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

// ─── Docs kit ─────────────────────────────────────────────────────────────────
//
// The ONLY building blocks a component's docs page and its example stories
// use, so every page in the catalogue reads the same way. The standard they
// implement — page order, story names, file split — is
// docs/reference-storybook-standard.md, and `check:stories` enforces it.
//
// A docs page is:
//
//   <DocsPage title summary npm registry>      the header and both install lines
//     <DocsUsage use avoid />                  when to reach for it, and when not
//     <VariantsSection /> …                    one ExampleSection per example story
//     <DocsApi />                              the generated props table
//   </DocsPage>
//
// and each example story renders the same section component, so the canvas
// and the docs page can never drift apart.

const docsPageClassName = 'sb-unstyled max-w-4xl space-y-16 py-2 text-foreground'

/** Kept for the Breadcrumb look pages, which compose their own header. */
export const exampleDocsClassName = docsPageClassName

/** One install line in the docs header: a channel name and what to type. */
function InstallLine({ channel, code }: { channel: string; code: string }) {
  return (
    <div className='flex flex-wrap items-baseline gap-x-4 gap-y-1'>
      <dt className='w-20 shrink-0 font-semibold'>{channel}</dt>
      <dd className='min-w-0'>
        <code className='break-all'>{code}</code>
      </dd>
    </div>
  )
}

/**
 * The page frame and header every docs page starts with: what the thing is,
 * one paragraph on what it is for, and how to get it on each distribution
 * channel. `npm` is the export (or exports) to import, from the package root
 * unless `from` names a subpath (`@nswds/ui/icons`); `registry` is the registry
 * item name. Patterns are registry-only, so they pass no `npm`.
 */
export function DocsPage({
  title,
  summary,
  eyebrow = 'Component',
  npm,
  from = '@nswds/ui',
  registry,
  children,
}: {
  title: string
  summary: ReactNode
  eyebrow?: string
  npm?: string | readonly string[]
  from?: string
  registry?: string
  children: ReactNode
}) {
  const imports = typeof npm === 'string' ? [npm] : npm
  return (
    <div className={docsPageClassName}>
      <header className='space-y-8 border-b border-foreground/10 pb-12'>
        <div className='space-y-4'>
          <p className='text-base font-semibold text-muted-foreground'>{eyebrow}</p>
          <h1 className='text-4xl font-bold tracking-tight'>{title}</h1>
          <div className='max-w-[65ch] text-lg leading-relaxed text-muted-foreground'>
            {summary}
          </div>
        </div>
        {imports || registry ? (
          <dl className='space-y-2 text-base'>
            {imports ? (
              // The quoted specifier is interpolated, not written inline:
              // check:optimize-deps reads any quoted specifier after "from" as an import.
              <InstallLine
                channel='npm'
                code={`import { ${imports.join(', ')} } from ${`'${from}'`}`}
              />
            ) : null}
            {registry ? (
              <InstallLine channel='Registry' code={`npx shadcn@latest add @nswds/${registry}`} />
            ) : null}
          </dl>
        ) : null}
      </header>
      {children}
    </div>
  )
}

/**
 * One section of a docs page — and, rendered on its own, one example story.
 * The heading is the story's name, so the sidebar and the page agree.
 */
export function ExampleSection({
  title,
  description,
  children,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <section className='space-y-6'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-semibold tracking-tight'>{title}</h2>
        {description ? (
          <div className='max-w-[65ch] text-base leading-relaxed text-muted-foreground'>
            {description}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  )
}

const exampleSurfaces = {
  /** The page itself. Most examples. */
  default: 'bg-background',
  /** A sunken well, for white surfaces (cards, menus) that need a page to sit on. */
  subtle: 'bg-foreground/5',
  /**
   * The solid brand band (AGENTS.md §3), for colours designed for dark
   * surfaces. Labels on it take the band's white, not the page's muted grey,
   * which is 1.75:1 on the band.
   */
  brand: 'bg-primary-800 text-white [--muted-foreground:var(--color-white)] dark:bg-primary-950',
  /** A dark page inside a light docs page — see darkFrameClassName. */
  dark: '',
} as const

/**
 * A nested `.dark` flips the role tokens and `dark:` utilities, but the shadcn
 * bridge tokens (`--foreground`, `--background`, …) are resolved once on
 * `:root` and inherit their light values — so a dark frame re-declares the
 * ones examples read, resolving them against the dark role tokens it now
 * holds. Canvas stories use the story-level `globals: { theme: 'dark' }`
 * instead, which needs none of this.
 */
const darkFrameClassName =
  'dark bg-(--background) text-(--foreground) [--background:var(--surface-default)] [--border:var(--border-default)] [--foreground:var(--text-default)] [--muted-foreground:var(--text-muted)] [--muted:var(--background-subtle)]'

const exampleLayouts = {
  /** Specimens side by side, wrapping, bottom-aligned so their labels line up. */
  row: 'flex flex-wrap items-end gap-x-10 gap-y-8',
  /** Specimens one under another, at their natural width. */
  stack: 'flex flex-col items-start gap-6',
  /** Two equal columns from `sm` up. */
  grid: 'grid gap-8 sm:grid-cols-2',
  /** No arrangement: the child fills the frame (page chrome, tables, scenes). */
  fill: '',
} as const

/**
 * A live example in a hairline frame, with its code attached underneath.
 * `layout` arranges the specimens; `surface` is what they sit on. Keep one
 * idea per Example — two ideas are two Examples, or two sections.
 */
export function Example({
  children,
  code,
  surface = 'default',
  layout = 'row',
  className,
}: {
  children: ReactNode
  code?: string
  surface?: keyof typeof exampleSurfaces
  layout?: keyof typeof exampleLayouts
  className?: string
}) {
  return (
    <figure className='overflow-hidden rounded-md ring-1 ring-foreground/10'>
      <div
        data-theme={surface === 'dark' ? 'dark' : undefined}
        className={cn(
          'max-sm:p-6 sm:p-8',
          surface === 'dark' ? darkFrameClassName : exampleSurfaces[surface],
          exampleLayouts[layout],
          className,
        )}
      >
        {children}
      </div>
      {code ? (
        // Wraps rather than scrolls: a scrolling <pre> is a scroll region that
        // keyboard users cannot reach, which axe fails (scrollable-region-focusable).
        <pre className='border-t border-foreground/10 bg-foreground/5 px-6 py-4 text-base leading-relaxed break-words whitespace-pre-wrap text-foreground'>
          <code>{code}</code>
        </pre>
      ) : null}
    </figure>
  )
}

/** One labelled specimen inside an Example: the component above its label. */
export function ExampleCell({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='flex min-h-12 items-center'>{children}</div>
      <span className='text-base text-muted-foreground'>{label}</span>
    </div>
  )
}

/** "When to use" — every docs page's first section, so a reader can stop early. */
export function DocsUsage({ use, avoid }: { use: ReactNode[]; avoid: ReactNode[] }) {
  return (
    <ExampleSection title='When to use'>
      <div className='grid gap-x-10 gap-y-8 sm:grid-cols-2'>
        <div className='space-y-3 border-t-4 border-(--success-solid) pt-4'>
          <h3 className='text-lg font-semibold'>Use it for</h3>
          <ul className='list-disc space-y-2 ps-5 text-base leading-relaxed'>
            {use.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className='space-y-3 border-t-4 border-foreground/20 pt-4'>
          <h3 className='text-lg font-semibold'>Use something else when</h3>
          <ul className='list-disc space-y-2 ps-5 text-base leading-relaxed'>
            {avoid.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </ExampleSection>
  )
}

/** The generated props table for the page's component — every page's last section. */
export function DocsApi({ description }: { description?: ReactNode }) {
  return (
    <ExampleSection
      title='API'
      description={
        description ?? 'Props of the main component. Try them live in the Playground story.'
      }
    >
      <div className='docs-api'>
        <ArgTypes />
      </div>
    </ExampleSection>
  )
}

// ─── Breadcrumb fixtures ──────────────────────────────────────────────────────

/**
 * Shared by the Breadcrumb story files (main, Looks/*, Tests,
 * Accessibility). They live here because this is the one non-story
 * module under `src/components/` that the build and the drift check skip.
 */

export const BREADCRUMB_LOOKS = ['default', 'rail', 'band', 'soft'] as const
export type BreadcrumbLook = (typeof BREADCRUMB_LOOKS)[number]

/** A link step for each label, then the current page; default separators between. */
export function BreadcrumbSteps({ labels, current }: { labels: string[]; current?: string }) {
  return (
    <>
      {labels.map((label, i) => (
        <Fragment key={label}>
          {i > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            <BreadcrumbLink href={`#${i}`}>{label}</BreadcrumbLink>
          </BreadcrumbItem>
        </Fragment>
      ))}
      {current && (
        <>
          {labels.length > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            <BreadcrumbPage>{current}</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </>
  )
}

/**
 * The long trail, with two steps collapsed into the ellipsis menu. The menu's
 * rows are underlined like the trail's links, so the same destinations read
 * the same in both places.
 */
export function BreadcrumbTrail({
  variant = 'default',
  collapse,
}: {
  variant?: BreadcrumbLook
  collapse?: boolean
}) {
  return (
    <Breadcrumb variant={variant} collapse={collapse}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='#home'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label='Show 2 more pages'>
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={BREADCRUMB_MENU_OFFSET}>
              <DropdownMenuLinkItem href='#services' className='underline underline-offset-4'>
                Services
              </DropdownMenuLinkItem>
              <DropdownMenuLinkItem href='#licences' className='underline underline-offset-4'>
                Licences and permits
              </DropdownMenuLinkItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href='#fishing'>Recreational fishing</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Apply for a fee exemption</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/** The rendered text of an element, whitespace collapsed (hidden parts excluded). */
export const renderedText = (el: HTMLElement) => el.innerText.replace(/\s+/g, ' ').trim()

/** The text of each breadcrumb item still displayed, its lead glyph excluded. */
export const breadcrumbShownItems = (nav: HTMLElement) =>
  [...nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"]')]
    .filter((li) => getComputedStyle(li).display !== 'none')
    .map((li) =>
      [...li.querySelectorAll<HTMLElement>(':scope > [data-slot="breadcrumb-content"] > *')]
        .filter((el) => el.dataset.slot !== 'breadcrumb-more')
        .map(renderedText)
        .join(' '),
    )

/** The collapsed trail's own "…" trigger, if it is showing. */
export const breadcrumbMoreTrigger = (nav: HTMLElement) => {
  const more = [...nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-more"]')].find(
    (el) => getComputedStyle(el).display !== 'none',
  )
  return more?.querySelector<HTMLButtonElement>('button') ?? null
}

/**
 * A breadcrumb in its place on a service page: an optional Header, the trail
 * (full-bleed under the Header for `band` and `soft`, in the content column
 * for `default` and `rail`), then the page heading and a line of body copy.
 * Its gutters step on the viewport exactly as Header's do, so the trail lines
 * up with the brand at every width.
 *
 * `heading` is `h1` in canvas stories, where the outline is the page's own;
 * docs pages pass `p`, so their examples do not add headings to the docs
 * page's outline.
 */
export function BreadcrumbScene({
  look,
  header,
  heading = 'p',
  labels = ['Home', 'Fishing'],
  current = 'Apply for a recreational fishing licence',
  framed = true,
  surface = 'background',
  placement,
  strip,
}: {
  look: BreadcrumbLook
  header?: 'dark' | 'white' | 'light'
  heading?: 'h1' | 'p'
  labels?: string[]
  current?: string
  /** A bordered card in docs; a bare page in a phone-width story. */
  framed?: boolean
  /** The page behind the trail: plain, or an already-tinted section. */
  surface?: 'background' | 'muted'
  /** Override where the trail sits — for Don't examples that misplace it. */
  placement?: 'chrome' | 'content'
  /** Classes for a strip wrapped round a chrome-placed trail. */
  strip?: string
}) {
  const Heading = heading
  const chrome = placement ? placement === 'chrome' : look === 'band' || look === 'soft'
  const trail = (
    <Breadcrumb variant={look}>
      <BreadcrumbList>
        <BreadcrumbSteps labels={labels} current={current} />
      </BreadcrumbList>
    </Breadcrumb>
  )
  return (
    <div
      className={cn(
        surface === 'muted' ? 'bg-muted' : 'bg-background',
        framed && 'overflow-hidden rounded-md border border-border',
      )}
    >
      {header && (
        <Header color={header} sticky={false} shadow={false} border={header !== 'dark'}>
          <HeaderBrand sitename='Department of Primary Industries' />
        </Header>
      )}
      {chrome && (strip ? <div className={strip}>{trail}</div> : trail)}
      <div className='space-y-4 py-8 max-sm:px-4 sm:max-lg:px-6 lg:px-12'>
        {!chrome && trail}
        <Heading className='text-3xl/tight font-bold text-foreground'>{current}</Heading>
        <p className='max-w-prose text-foreground'>
          You need a licence to fish in NSW waters, including from the shore.
        </p>
      </div>
    </div>
  )
}

/**
 * A story rendered in its own phone-width iframe. An iframe has its own
 * viewport, so the story behaves exactly as it would on a 375px phone — the
 * Header's and the band's insets, the collapse, everything — with nothing
 * overridden to fake it. `storyId` is the story's Storybook id.
 */
export function PhoneFrame({
  storyId,
  title,
  height = 360,
}: {
  storyId: string
  title: string
  height?: number
}) {
  return (
    <iframe
      title={title}
      src={`iframe.html?id=${storyId}&viewMode=story`}
      loading='lazy'
      className='shrink-0 rounded-md bg-background ring-1 ring-border'
      style={{ width: 375, height }}
    />
  )
}

/** A dark-mode frame inside a light docs page; see darkFrameClassName. */
export function DarkFrame({ children }: { children: ReactNode }) {
  return (
    <div data-theme='dark' className={cn(darkFrameClassName, 'rounded-md p-4')}>
      {children}
    </div>
  )
}

/** A Do or Don't example: the scene, then a captioned verdict. */
export function DoDont({
  verdict,
  caption,
  children,
}: {
  verdict: 'do' | 'dont'
  caption: string
  children: ReactNode
}) {
  const Icon = verdict === 'do' ? IconCheck : IconClose
  return (
    <figure className='space-y-3'>
      {children}
      <figcaption
        className={cn(
          'flex gap-2 border-t-4 pt-3 text-base',
          verdict === 'do' ? 'border-(--success-solid)' : 'border-(--danger-solid)',
        )}
      >
        <Icon aria-hidden='true' className='mt-0.5 size-5 shrink-0' />
        <span>
          <strong className='font-semibold'>{verdict === 'do' ? 'Do' : "Don't"}</strong> {caption}
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * The layout every Breadcrumb look page shares: what the look is, when to use
 * it and when not, the Header it pairs with, the look in context in light and
 * dark, on a phone, Do and Don't pairs, and the code.
 */
export function BreadcrumbLookPage({
  name,
  summary,
  pairing,
  useWhen,
  avoidWhen,
  look,
  header,
  doDont,
  code,
  notes,
}: {
  name: string
  summary: ReactNode
  pairing: ReactNode
  useWhen: string[]
  avoidWhen: string[]
  look: BreadcrumbLook
  header?: 'dark' | 'white' | 'light'
  doDont: { do: { caption: string; scene: ReactNode }; dont: { caption: string; scene: ReactNode } }
  code: string
  notes?: ReactNode
}) {
  return (
    <DocsPage eyebrow='Breadcrumb look' title={name} summary={summary}>
      <DocsUsage use={useWhen} avoid={avoidWhen} />
      <ExampleSection title='In context' description={pairing}>
        <Example layout='fill' code={code}>
          <BreadcrumbScene look={look} header={header} />
        </Example>
      </ExampleSection>
      <ExampleSection
        title='In dark mode'
        description='Every look flips with the theme; nothing is restated per mode.'
      >
        <Example layout='fill' surface='dark'>
          <BreadcrumbScene look={look} header={header} />
        </Example>
      </ExampleSection>
      <ExampleSection
        title='On a phone'
        description='Real stories at 375px, each in its own viewport. When the full trail would wrap, it shortens to Home, a “…” menu of the hidden steps, and the parent page; a trail that fits stays whole.'
      >
        <div className='flex flex-wrap gap-6'>
          <PhoneFrame
            storyId={`components-breadcrumb-looks-${look}--phone`}
            title={`${name} look on a phone, long trail`}
          />
          <PhoneFrame
            storyId={`components-breadcrumb-looks-${look}--phone-short`}
            title={`${name} look on a phone, short trail`}
          />
        </div>
      </ExampleSection>
      <ExampleSection title="Do and don't">
        <div className='grid gap-8 sm:grid-cols-2'>
          <DoDont verdict='do' caption={doDont.do.caption}>
            {doDont.do.scene}
          </DoDont>
          <DoDont verdict='dont' caption={doDont.dont.caption}>
            {doDont.dont.scene}
          </DoDont>
        </div>
      </ExampleSection>
      {notes}
    </DocsPage>
  )
}

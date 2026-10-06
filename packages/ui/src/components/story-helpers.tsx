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

/** Consumer documentation layout, shared by the Badge and Tag examples. */
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
    <section className='space-y-5'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
        {description && (
          <p className='max-w-2xl text-base leading-relaxed text-muted-foreground'>{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export function ExamplePreview({ children }: { children: ReactNode }) {
  return <div className='rounded-md border border-border bg-muted/20 p-6'>{children}</div>
}

export function ExampleCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='flex min-h-12 items-center'>{children}</div>
      <span className='text-sm text-muted-foreground'>{label}</span>
    </div>
  )
}

export function ExampleCode({ children }: { children: string }) {
  return (
    <pre className='max-w-full overflow-x-auto rounded-sm border border-border bg-muted/40 p-4 text-sm text-foreground'>
      <code>{children}</code>
    </pre>
  )
}

export const exampleDocsClassName = 'sb-unstyled max-w-4xl space-y-16 py-2 text-foreground'

// ─── Breadcrumb fixtures ──────────────────────────────────────────────────────

/**
 * Shared by the Breadcrumb story files (main, Looks/*, Features,
 * Accessibility, Tests). They live here because this is the one non-story
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
      [...li.children]
        .filter((child) => (child as HTMLElement).dataset.slot !== 'breadcrumb-lead')
        .map((child) => renderedText(child as HTMLElement))
        .join(' '),
    )

/** The display of the back chevron inside the parent step's link. */
export const breadcrumbBackChevron = (nav: HTMLElement) => {
  const items = nav.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-item"]')
  const back = items[items.length - 2]?.querySelector('a > [data-slot="breadcrumb-back"]')
  return back ? getComputedStyle(back).display : 'none'
}

/**
 * A breadcrumb in its place on a service page: an optional Header, the trail
 * (full-bleed under the Header for `band` and `soft`, in the content column
 * for `default` and `rail`), then the page heading and a line of body copy.
 *
 * `heading` is `h1` in canvas stories, where the outline is the page's own;
 * docs pages pass `p`, so their examples do not add headings to the docs
 * page's outline. `phone` renders a 375px frame with phone gutters — the
 * Header and band insets step on the viewport, which a docs page cannot narrow.
 */
export function BreadcrumbScene({
  look,
  header,
  heading = 'p',
  phone = false,
  labels = ['Home', 'Fishing'],
  current = 'Apply for a recreational fishing licence',
}: {
  look: BreadcrumbLook
  header?: 'dark' | 'white' | 'light'
  heading?: 'h1' | 'p'
  phone?: boolean
  labels?: string[]
  current?: string
}) {
  const Heading = heading
  const chrome = look === 'band' || look === 'soft'
  const gutter = phone ? 'px-4' : 'max-sm:px-4 sm:max-lg:px-6 lg:px-12'
  const trail = (
    <Breadcrumb
      variant={look}
      style={phone && chrome ? ({ '--bc-inset': '1rem' } as React.CSSProperties) : undefined}
    >
      <BreadcrumbList>
        <BreadcrumbSteps labels={labels} current={current} />
      </BreadcrumbList>
    </Breadcrumb>
  )
  return (
    <div
      className='overflow-hidden rounded-md border border-border bg-background'
      style={phone ? { width: 375 } : undefined}
    >
      {header && !phone && (
        <Header color={header} sticky={false} shadow={false} border={header !== 'dark'}>
          <HeaderBrand sitename='Department of Primary Industries' />
        </Header>
      )}
      {chrome && trail}
      <div className={cn('space-y-4 py-8', gutter)}>
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
 * A dark-mode frame inside a light docs page. A nested `.dark` flips the role
 * tokens and `dark:` utilities, but the shadcn bridge tokens (`--foreground`,
 * `--background`, …) are resolved once on `:root` and inherit their light
 * values — so this frame re-declares the ones the examples read, resolving
 * them against the dark role tokens it now holds. Canvas stories use the
 * story-level `globals: { theme: 'dark' }` instead, which needs none of this.
 */
export function DarkFrame({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme='dark'
      className='dark rounded-md bg-(--background) p-4 [--background:var(--surface-default)] [--border:var(--border-default)] [--foreground:var(--text-default)] [--muted-foreground:var(--text-muted)] [--muted:var(--background-subtle)]'
    >
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
    <div className={exampleDocsClassName}>
      <section className='space-y-4'>
        <p className='text-base font-semibold text-muted-foreground'>Breadcrumb look</p>
        <h1 className='text-5xl font-bold tracking-tight'>{name}</h1>
        <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground'>{summary}</p>
      </section>
      <ExampleSection title='When to use it'>
        <div className='grid gap-8 sm:grid-cols-2'>
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>Use it when</h3>
            <ul className='list-disc space-y-2 ps-5'>
              {useWhen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>Choose another look when</h3>
            <ul className='list-disc space-y-2 ps-5'>
              {avoidWhen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className='max-w-2xl text-base text-muted-foreground'>{pairing}</p>
      </ExampleSection>
      <ExampleSection title='In context' description='On a service page, above the page heading.'>
        <BreadcrumbScene look={look} header={header} />
      </ExampleSection>
      <ExampleSection
        title='In dark mode'
        description='Every look flips with the theme; nothing is restated per mode.'
      >
        <DarkFrame>
          <BreadcrumbScene look={look} header={header} />
        </DarkFrame>
      </ExampleSection>
      <ExampleSection
        title='On a phone'
        description={
          look === 'rail'
            ? 'The rail never collapses: it is chosen for a quiet page where the whole line is the point, so a long trail wraps, each step leading with its separator.'
            : 'When the full trail would wrap, only the parent shows, as a back link announced "Back to …". A trail that fits stays whole.'
        }
      >
        <div className='flex flex-wrap gap-6'>
          <BreadcrumbScene
            look={look}
            phone
            labels={['Home', 'Services', 'Licences and permits']}
            current='Apply for a recreational fishing licence'
          />
          <BreadcrumbScene look={look} phone labels={['Home']} current='Contact us' />
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
      <ExampleSection title='Code'>
        <ExampleCode>{code}</ExampleCode>
      </ExampleSection>
    </div>
  )
}

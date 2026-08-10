'use client'

import React from 'react'

import { cn } from '../lib/utils.js'

import { Link } from '../components/link.js'
import { IconCheck } from '../icons/check.js'
import { IconError } from '../icons/error.js'
import { IconMoreHoriz } from '../icons/more-horiz.js'
import { IconRemove } from '../icons/remove.js'

/**
 * Progress state of a single step in a multi-step journey.
 *
 * `'default'` is the unannotated baseline (a step with no `status` set) and
 * renders identically to `'not-started'` — both exist because the nswds-app
 * source distinguished them, and consumers may key behaviour off the
 * difference even though the visual is shared.
 */
type StepStatus =
  'default' | 'not-started' | 'in-progress' | 'completed' | 'saved' | 'error' | 'cannot-start'

/** One entry in a {@link StepIndicator} list. */
type Step = {
  /** Visible step name, e.g. "Your details". */
  title: string
  /** Optional second line under the title. */
  description?: string
  /** Navigation target; also the identity compared against `currentHref`. */
  href: string
  /** Progress state. Omitted = `'default'` (renders as not started). */
  status?: StepStatus
}

/**
 * Per-status visual treatment, collapsed from the nswds-app source's seven
 * copy-pasted JSX branches into one map. Every colour funnels through a single
 * `--step-ink` custom property declared on the `<li>`, so the marker,
 * connector, hover fill and focus ring all follow from one declaration per
 * status (the same ink-token pattern as footer.tsx / link.tsx).
 *
 * Ink values use RAW @nswds/tokens custom properties (`--success-600`, not the
 * `--color-success-600` Tailwind bridge alias): Tailwind v4 tree-shakes
 * unreferenced `@theme` keys and an arbitrary-property reference is not a
 * usage signal, but the raw tokens are plain `:root` declarations that always
 * resolve — the same precedent as button.tsx's semantic colours.
 *
 * Token remapping from the nswds-app source (documented per §3 of AGENTS.md):
 * - completed/saved: `success-450`/`-500`/`-550` → `--success-600` (dark:
 *   `--success-500`). 450 (L≈0.63) gives the white check only ≈2.4:1; 600
 *   (L≈0.55) clears the 3:1 non-text minimum (WCAG 2.2 1.4.11) and matches
 *   Button's solid success.
 * - in-progress: `primary-500` → `--primary-600` (dark: `--primary-450`).
 *   Masterbrand primary-500 (L≈0.72) fails 3:1 against white for the marker
 *   border and icon; 600 matches Button's tertiary. The dark override
 *   lightens the ink so it clears 3:1 against dark surfaces.
 * - error: `danger-450`/`-500` → `--danger-600` (dark: `--danger-500`),
 *   matching Button's solid danger.
 * - not-started/default: border `grey-300` → `--grey-500` (dark:
 *   `--grey-450`). grey-300 (L≈0.90) is ≈1.2:1 against white — invisible to
 *   low-vision users; grey-500 clears 3:1 (1.4.11).
 * - cannot-start: `grey-600` kept (white glyph on it is ≈7:1 in both modes).
 * - marker fill `bg-white` → `bg-background` so outlined markers sit on the
 *   page surface in dark mode instead of punching white holes in it.
 */
const stepStatusStyles: Record<
  StepStatus,
  {
    /** `--step-ink` declaration, applied to the `<li>` so descendants inherit. */
    ink: string
    /** Connector line colour (the `aria-hidden` rule between markers). */
    connector: string
    /** Structural marker treatment. */
    marker: 'solid' | 'outline' | 'dot'
    /** Glyph rendered inside the marker (always `aria-hidden`). */
    icon: React.ElementType | null
    /** Default visually-hidden status announcement (see `statusLabels`). */
    label?: string
    /** Steps that must not be reachable yet. */
    disabled?: boolean
  }
> = {
  completed: {
    ink: '[--step-ink:var(--success-600)] dark:[--step-ink:var(--success-500)]',
    connector: 'bg-(--step-ink)',
    marker: 'solid',
    icon: IconCheck,
    label: 'Completed',
  },
  saved: {
    ink: '[--step-ink:var(--success-600)] dark:[--step-ink:var(--success-500)]',
    connector: 'bg-grey-300 dark:bg-grey-700',
    marker: 'outline',
    icon: IconCheck,
    label: 'Saved',
  },
  'in-progress': {
    ink: '[--step-ink:var(--primary-600)] dark:[--step-ink:var(--primary-450)]',
    connector: 'bg-grey-300 dark:bg-grey-700',
    marker: 'outline',
    icon: IconMoreHoriz,
    label: 'In progress',
  },
  error: {
    ink: '[--step-ink:var(--danger-600)] dark:[--step-ink:var(--danger-500)]',
    connector: 'bg-(--step-ink)',
    marker: 'solid',
    icon: IconError,
    label: 'Error',
  },
  'cannot-start': {
    ink: '[--step-ink:var(--grey-600)]',
    connector: 'bg-grey-300 dark:bg-grey-700',
    marker: 'solid',
    icon: IconRemove,
    label: 'Cannot start yet',
    disabled: true,
  },
  'not-started': {
    ink: '[--step-ink:var(--grey-500)] dark:[--step-ink:var(--grey-450)]',
    connector: 'bg-grey-300 dark:bg-grey-700',
    marker: 'dot',
    icon: null,
    label: 'Not started',
  },
  default: {
    ink: '[--step-ink:var(--grey-500)] dark:[--step-ink:var(--grey-450)]',
    connector: 'bg-grey-300 dark:bg-grey-700',
    marker: 'dot',
    icon: null,
  },
}

// Shared marker shell. The hover shade derives from the ink via color-mix and
// is declared here — NOT on the <ol> — because a custom property that
// substitutes var(--step-ink) is resolved on the element it is declared on;
// on the list root the ink is still undefined and the whole property would
// compute to invalid. On the marker the inherited per-status ink has already
// resolved. `--black` is the raw @nswds/tokens value (always on :root), not
// the tree-shakeable --color-black bridge alias.
const markerBase = [
  'relative z-10 flex size-6 items-center justify-center rounded-full',
  'transition-colors motion-reduce:transition-none',
  '[--step-ink-hover:color-mix(in_oklch,var(--step-ink)_85%,var(--black))]',
]

const markerStyles = {
  // Solid disc, white glyph; hover deepens the fill (source: -450 → -500).
  solid: cn(markerBase, 'bg-(--step-ink) text-white group-hover:bg-(--step-ink-hover)'),
  // Outlined disc, ink glyph; hover fills with the ink and inverts the glyph
  // (source: saved/in-progress fill-on-hover). In dark mode the inks are
  // light steps, so the hovered glyph flips to a dark grey instead of white.
  outline: cn(
    markerBase,
    'border-2 border-(--step-ink) bg-background text-(--step-ink)',
    'group-hover:bg-(--step-ink) group-hover:text-white dark:group-hover:text-grey-900',
  ),
  // Outlined disc with a centre dot that appears on hover (or is always
  // filled for the current step).
  dot: cn(markerBase, 'border-2 border-(--step-ink) bg-background'),
}

// One text treatment for title and description. The source coloured
// `dark:text-slate-400` — a raw-palette leak — remapped here onto the grey
// ramp. Hover moved from the text spans to `group-hover` so the whole link
// (marker included) gives feedback, not just the glyph under the pointer.
const stepTextClassName =
  'text-sm text-grey-700 transition-colors group-hover:text-grey-800 motion-reduce:transition-none dark:text-grey-300 dark:group-hover:text-grey-100'

// Emphasised text for the current step. Source used primary-500 /
// dark:slate-400; remapped to primary-800 / primary-200 — the ramp's text
// steps (WCAG 2.2 1.4.3 AA needs 4.5:1 for 14px text; primary-500 on white
// is ≈2.9:1).
const currentTextClassName = 'text-sm font-semibold text-primary-800 dark:text-primary-200'

/** Built-in announcements; override or suppress per status via `statusLabels`. */
const DEFAULT_STATUS_LABELS: Partial<Record<StepStatus, string>> = Object.fromEntries(
  Object.entries(stepStatusStyles).flatMap(([status, style]) =>
    style.label ? [[status, style.label]] : [],
  ),
)

type StepIndicatorProps = Omit<React.ComponentPropsWithoutRef<'ol'>, 'children'> & {
  /** Steps to render, in journey order. `href` must be unique per step. */
  steps: Step[]
  /**
   * The href of the page being viewed. The matching step gets
   * `aria-current="step"` and — when its status carries no stronger visual
   * (default / not-started / in-progress) — the emphasised current treatment.
   * Replaces the source's internal next/navigation `usePathname()` coupling
   * so the component stays framework-free.
   */
  currentHref?: string
  /** Click handler applied to every enabled step link. */
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>
  /**
   * Visually-hidden status announcements appended to each title, merged over
   * the English defaults ("Completed", "Saved", …). Set a status to
   * `undefined` to suppress its announcement; supply strings to localise.
   */
  statusLabels?: Partial<Record<StepStatus, string | undefined>>
  ref?: React.Ref<HTMLOListElement>
}

/**
 * Vertical list of the steps in a multi-step journey — one link per step with
 * a status marker and connector line, as used beside long NSW Government
 * application forms.
 *
 * Accessibility contract:
 * - Renders an `<ol role="list">` — steps are a sequence, so an ordered list
 *   conveys the ordering to assistive tech (the nswds-app source used `<ul>`);
 *   the explicit `role` restores list semantics in Safari/VoiceOver where
 *   `list-style: none` removes them.
 * - The step matching `currentHref` gets `aria-current="step"` whatever its
 *   status (the source only set it on one of its seven branches).
 * - Markers and connectors are purely decorative (`aria-hidden`); status is
 *   announced through a visually-hidden suffix after each title instead,
 *   because colour and iconography alone would leave screen-reader users with
 *   no status at all (WCAG 2.2 1.4.1 Use of Colour). See `statusLabels`.
 * - `cannot-start` steps are `aria-disabled`, removed from the tab order and
 *   click-inert — the source left them fully clickable, which invited
 *   navigation into pages that reject you.
 * - Links get a `focus-visible` outline drawn in the status ink (the source
 *   relied on browser defaults), satisfying 2.4.7 Focus Visible with a 3:1
 *   indicator (2.4.13).
 *
 * All anchors render through `Link` (`variant="unstyled"`), so apps can inject
 * a framework link (e.g. next/link) via `LinkProvider`.
 */
function StepIndicator({
  steps,
  currentHref,
  onNavigate,
  statusLabels,
  className,
  ref,
  ...props
}: StepIndicatorProps) {
  if (process.env.NODE_ENV !== 'production') {
    const seen = new Set<string>()
    for (const step of steps) {
      if (seen.has(step.href)) {
        console.warn(
          `[nswds/ui] StepIndicator: duplicate step href "${step.href}" — hrefs are used as React keys and for currentHref matching, so duplicates will misrender.`,
        )
      }
      seen.add(step.href)
    }
  }

  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels }

  return (
    <ol
      role='list'
      ref={ref}
      data-slot='step-indicator'
      className={cn('w-full', className)}
      {...props}
    >
      {steps.map((step, stepIdx) => {
        const status: StepStatus = step.status ?? 'default'
        const style = stepStatusStyles[status]
        const isCurrent = currentHref !== undefined && step.href === currentHref
        // Statuses with a strong treatment of their own (completed, saved,
        // error, cannot-start) keep it even when current — matching the
        // source's branch order.
        const currentVariant = !isCurrent
          ? null
          : status === 'in-progress'
            ? ('ring' as const)
            : status === 'default' || status === 'not-started'
              ? ('dot' as const)
              : null
        const isLast = stepIdx === steps.length - 1
        const StatusIcon = style.icon
        const label = labels[status]

        return (
          <li
            key={step.href}
            data-slot='step'
            data-status={status}
            data-current={isCurrent || undefined}
            className={cn(
              'relative',
              !isLast && 'pb-3',
              style.ink,
              // A current default/not-started step promotes its ink to the
              // in-progress primary so the filled dot and ring read as "you
              // are here", not "not started".
              currentVariant === 'dot' && stepStatusStyles['in-progress'].ink,
            )}
          >
            {!isLast && (
              <div
                aria-hidden='true'
                data-slot='step-connector'
                className={cn('absolute top-4 left-3 mt-0.5 -ml-px h-full w-0.5', style.connector)}
              />
            )}
            <Link
              variant='unstyled'
              href={step.href}
              data-slot='step-link'
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'group relative flex items-center rounded-sm',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--step-ink)',
                style.disabled && 'pointer-events-none',
              )}
              onClick={
                style.disabled
                  ? (event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault()
                  : onNavigate
              }
              {...(style.disabled ? { 'aria-disabled': true, tabIndex: -1 } : {})}
            >
              {currentVariant === 'ring' ? (
                // Double ring: the source's emphasised in-progress-current
                // marker. The outer 32px ring centres on the 24px grid via
                // -ml-1, so the connector still meets the marker's middle.
                <span aria-hidden='true' className='-ml-1 flex h-9 items-center'>
                  <span data-slot='step-marker' className={cn(markerStyles.dot, 'size-8')}>
                    <span className='flex size-6 items-center justify-center rounded-full border-2 border-(--step-ink) bg-background'>
                      <IconMoreHoriz className='size-4 text-(--step-ink)' aria-hidden='true' />
                    </span>
                  </span>
                </span>
              ) : (
                <span aria-hidden='true' className='flex h-9 items-center'>
                  <span data-slot='step-marker' className={markerStyles[style.marker]}>
                    {style.marker === 'dot' ? (
                      <span
                        className={cn(
                          'size-2 rounded-full transition-colors motion-reduce:transition-none',
                          currentVariant === 'dot'
                            ? 'bg-(--step-ink)'
                            : 'bg-transparent group-hover:bg-(--step-ink)',
                        )}
                      />
                    ) : (
                      StatusIcon && <StatusIcon className='size-4' aria-hidden='true' />
                    )}
                  </span>
                </span>
              )}
              <span
                data-slot='step-content'
                className={cn('flex min-w-0 flex-col', currentVariant === 'ring' ? 'ml-3' : 'ml-4')}
              >
                <span
                  data-slot='step-title'
                  className={currentVariant ? currentTextClassName : stepTextClassName}
                >
                  {step.title}
                  {label && <span className='sr-only'> ({label})</span>}
                </span>
                {step.description && (
                  <span
                    data-slot='step-description'
                    className={currentVariant ? currentTextClassName : stepTextClassName}
                  >
                    {step.description}
                  </span>
                )}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

/** A titled group of steps inside {@link StepNav}. */
type StepNavSection = {
  /** Section heading, e.g. "Before you start". */
  title: string
  steps: Step[]
}

type StepNavProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> & {
  /** Titled groups of steps, rendered as heading + StepIndicator pairs. */
  sections: StepNavSection[]
  /**
   * Heading element for section titles. Defaults to 2; set it so the headings
   * slot into the surrounding page outline (WCAG 2.2 1.3.1).
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Forwarded to every section's {@link StepIndicator}. */
  currentHref?: string
  /** Forwarded to every section's {@link StepIndicator}. */
  onNavigate?: React.MouseEventHandler<HTMLAnchorElement>
  /** Forwarded to every section's {@link StepIndicator}. */
  statusLabels?: Partial<Record<StepStatus, string | undefined>>
  ref?: React.Ref<HTMLElement>
}

/**
 * Sectioned journey navigation: a `<nav>` landmark containing one heading +
 * {@link StepIndicator} per section.
 *
 * Ported from nswds-app's `StepNavigation`, minus the app's form-store
 * coupling — the source read each step's status out of a zustand
 * `useFormStore` hook; the design-system version takes status as data on the
 * `steps` themselves, so any state source (form store, server props, URL) can
 * drive it.
 *
 * Accessibility contract:
 * - The landmark is named (`aria-label="Progress"` by default, overridable)
 *   so it is distinguishable from the site's other navigation landmarks
 *   (WCAG 2.2 2.4.1 / ARIA landmark naming).
 * - Sections are an `<ol role="list">` (they are ordered phases of one
 *   journey; the source used `<ul>`).
 * - Section titles use a real heading element chosen via `headingLevel`
 *   (source hard-coded `<h2>`), and the source's `text-slate-900` leak is
 *   replaced with the theme-aware `text-foreground`.
 */
function StepNav({
  sections,
  headingLevel = 2,
  currentHref,
  onNavigate,
  statusLabels,
  className,
  'aria-label': ariaLabel = 'Progress',
  ref,
  ...props
}: StepNavProps) {
  const Heading = `h${headingLevel}` as `h${2 | 3 | 4 | 5 | 6}`

  return (
    <nav
      ref={ref}
      data-slot='step-nav'
      aria-label={ariaLabel}
      className={cn('text-base lg:text-sm', className)}
      {...props}
    >
      <ol role='list' className='space-y-9'>
        {sections.map((section) => (
          <li key={section.title} data-slot='step-nav-section'>
            <Heading data-slot='step-nav-heading' className='font-medium text-foreground'>
              {section.title}
            </Heading>
            <StepIndicator
              className='mt-2 lg:mt-4'
              steps={section.steps}
              currentHref={currentHref}
              onNavigate={onNavigate}
              statusLabels={statusLabels}
            />
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { StepIndicator, StepNav, stepStatusStyles }
export type { Step, StepIndicatorProps, StepNavProps, StepNavSection, StepStatus }

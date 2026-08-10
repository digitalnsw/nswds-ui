'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../lib/utils.js'

import { IconSearch } from '../icons/search.js'

/**
 * Surface colours the search can be themed with — the footer's thirteen-name
 * vocabulary (see `footerColors` in footer.tsx) plus `default`, the nswds-app
 * grey-100 chip that headers embed on a white surface.
 *
 * Every derived colour resolves from a single `--search-ink` token, so a
 * variant only declares its surface utilities and that one value. This map
 * replaces the FOUR parallel 14-entry cva tables in the nswds-app source
 * (surface / collapsed / button / focus): each of those tables was a manual
 * projection of the same underlying ink, so they are collapsed into the
 * derivations below.
 *
 * The derivations are written literally here (once) rather than per-variant:
 * Tailwind scans source text for class names, so a template-built arbitrary
 * property would never be emitted. Mirrors footer.tsx (`--footer-*`) and
 * link.tsx (`--link-halo`).
 *
 * Expanded text/surface pairs are the ones verified for footer.tsx: every
 * light pair clears WCAG 2.2 AA (1.4.3, 4.5:1) — the worst are `primary-600`
 * (4.57:1) and `accent-600` (5.18:1) — and in dark mode all clear AAA (worst
 * 13.6:1). The collapsed chip renders no text, only the icon, which paints in
 * the same ink.
 */
const expandableSearchVariants = cva(
  [
    // `group/search` is named so the submit button's group-focus-within hook
    // can't collide with an ancestor's bare `group` (e.g. inside a card).
    'group/search relative inline-block rounded-sm select-none',
    // Halo for the submit button's hover / the form's focus-within state, a
    // heavier press halo, and the placeholder colour — all mixed down from
    // the ink. 70% ink keeps the placeholder related to but visibly lighter
    // than the entered text (the source used grey-700 / current at 70%
    // opacity). Dilution costs contrast, though, so the percentage routes
    // through --search-placeholder-pct and the surfaces whose 70% composite
    // fails 1.4.3 raise it to 100% in the variant map below. Verified by
    // alpha-compositing the mix over each surface (light mode): at 70%
    // primary-600 is 3.0:1, accent-600 3.1:1 and accent-400 4.48:1 — all
    // AA failures, cured by full ink (4.57 / 5.18 / 8.34:1). The eleven
    // surfaces that keep 70% all clear 4.5:1, the closest being
    // primary-400 (4.57:1) and grey-400 (4.58:1); dark mode's worst 70%
    // composite is 7.0:1.
    '[--search-halo:color-mix(in_oklch,var(--search-ink)_10%,transparent)]',
    '[--search-halo-active:color-mix(in_oklch,var(--search-ink)_18%,transparent)]',
    '[--search-placeholder:color-mix(in_oklch,var(--search-ink)_var(--search-placeholder-pct,70%),transparent)]',
  ],
  {
    variants: {
      // Ink values use the RAW masterbrand tokens (--primary-800, --grey-800,
      // --accent-800) rather than Tailwind's --color-* bridge aliases. Tailwind
      // v4 tree-shakes an unreferenced @theme key, and referencing one from
      // inside an arbitrary property is not a usage signal — the raw tokens are
      // plain :root declarations from @nswds/tokens and always resolve.
      // (--color-white is safe: `text-white` below is a real utility, so that
      // key is always emitted.) Same reasoning as footer.tsx and header.tsx.
      //
      // Dark mode deepens every surface onto the same family's dark steps —
      // -800→-950, -600→-900, -400→-850, -200→-800, white→grey-900 — per
      // footer.tsx's family mapping, and `default` follows header.tsx's
      // `light` surface: grey-100→grey-850. Ink goes white on all fourteen.
      //
      // primary-600, accent-600 and accent-400 set --search-placeholder-pct
      // to 100%: their 70% placeholder composite fails AA (3.0 / 3.1 /
      // 4.48:1 — see the derivation comment above), so the placeholder
      // renders full ink there. The override is deliberately not
      // dark-scoped: every dark 70% composite clears 7:1, so 100% in dark
      // is merely a slightly stronger placeholder, not worth a second
      // declaration.
      //
      // `default` is the one variant whose ink is NOT its text colour: the
      // nswds-app chip pairs grey-800 entered text with a primary-blue icon
      // and primary-800/10 halos. Declaring ink as primary-800 reproduces the
      // icon and halos exactly; the text colour is a surface utility, so it
      // stays grey-800. (Side effect, documented: the placeholder mixes from
      // primary-800 instead of the source's grey-700 — a subtle blue shift.)
      variant: {
        default:
          'bg-grey-100 text-grey-800 [--search-ink:var(--primary-800)] dark:bg-grey-850 dark:text-white dark:[--search-ink:var(--color-white)]',
        'primary-800':
          'bg-primary-800 text-white [--search-ink:var(--color-white)] dark:bg-primary-950',
        'primary-600':
          'bg-primary-600 text-white [--search-ink:var(--color-white)] [--search-placeholder-pct:100%] dark:bg-primary-900',
        'primary-400':
          'bg-primary-400 text-primary-800 [--search-ink:var(--primary-800)] dark:bg-primary-850 dark:text-white dark:[--search-ink:var(--color-white)]',
        'primary-200':
          'bg-primary-200 text-primary-800 [--search-ink:var(--primary-800)] dark:bg-primary-800 dark:text-white dark:[--search-ink:var(--color-white)]',
        'grey-800': 'bg-grey-800 text-white [--search-ink:var(--color-white)] dark:bg-grey-950',
        'grey-600': 'bg-grey-600 text-white [--search-ink:var(--color-white)] dark:bg-grey-900',
        'grey-400':
          'bg-grey-400 text-grey-800 [--search-ink:var(--grey-800)] dark:bg-grey-850 dark:text-white dark:[--search-ink:var(--color-white)]',
        'grey-200':
          'bg-grey-200 text-grey-800 [--search-ink:var(--grey-800)] dark:bg-grey-800 dark:text-white dark:[--search-ink:var(--color-white)]',
        'accent-800':
          'bg-accent-800 text-white [--search-ink:var(--color-white)] dark:bg-accent-950',
        'accent-600':
          'bg-accent-600 text-white [--search-ink:var(--color-white)] [--search-placeholder-pct:100%] dark:bg-accent-900',
        'accent-400':
          'bg-accent-400 text-accent-800 [--search-ink:var(--accent-800)] [--search-placeholder-pct:100%] dark:bg-accent-850 dark:text-white dark:[--search-ink:var(--color-white)]',
        'accent-200':
          'bg-accent-200 text-accent-800 [--search-ink:var(--accent-800)] dark:bg-accent-800 dark:text-white dark:[--search-ink:var(--color-white)]',
        white:
          'bg-white text-grey-800 [--search-ink:var(--grey-800)] dark:bg-grey-900 dark:text-white dark:[--search-ink:var(--color-white)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type ExpandableSearchVariant = NonNullable<VariantProps<typeof expandableSearchVariants>['variant']>

// One focus treatment for the input and the submit button, INSET rather than
// the source's offset ring. The source ringed each variant in its own surface
// colour with a hardcoded white offset — on the default chip that was
// ring-grey-100 around a grey-100 chip on a white page: effectively invisible
// (a 2.4.7 Focus Visible / 2.4.13 Focus Appearance failure). An outward
// indicator can only guarantee contrast against the page, which this component
// cannot know; the ink is guaranteed to contrast with the surface (that is its
// whole job), so the indicator is drawn 2px INSIDE the chip in ink, where the
// contrast maths always holds.
const searchFocusClassName =
  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--search-ink)'

type ExpandableSearchContextValue = {
  value: string
  setValue: (value: string) => void
  formHasFocusWithin: boolean
  variant: ExpandableSearchVariant
}

const ExpandableSearchContext = React.createContext<ExpandableSearchContextValue | null>(null)

type ExpandableSearchProps = React.ComponentPropsWithoutRef<'form'> &
  VariantProps<typeof expandableSearchVariants> & {
    /**
     * Called with the current query when the form submits (Enter in the field
     * or a click on the search button). Not called if a supplied `onSubmit`
     * prevented the event's default.
     */
    onAction?: (value: string) => void
    /** Initial query. A non-empty value renders the field expanded. */
    defaultValue?: string
    ref?: React.Ref<HTMLFormElement>
  }

type ExpandableSearchButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'type'> & {
  [key: `data-${string}`]: string | number | boolean | undefined
}

type ExpandableSearchFieldProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  // `type` is pinned to `search`; `value`/`defaultValue` are owned by the
  // `ExpandableSearch` context (seed it via the root's `defaultValue` prop).
  'type' | 'value' | 'defaultValue'
> & {
  /**
   * Accessible name for the input, rendered as a visually-hidden `<label>`
   * and mirrored as `aria-label`. Defaults to `'Search'`.
   */
  label?: string
  /** Accessible name for the submit button. Defaults to `'Search'`. */
  buttonLabel?: string
  /** Extra props for the submit button (its `type` is pinned to `submit`). */
  buttonProps?: ExpandableSearchButtonProps
  ref?: React.Ref<HTMLInputElement>
}

/**
 * Dev-only guard, mirroring the icon-only Button check in button.tsx: with
 * `label=''` and no `aria-label` the input reaches assistive tech unnamed
 * (WCAG 2.2, 4.1.2 Name, Role, Value) — and this control leans on its name
 * more than most, since collapsed it looks like a plain icon button. No-op in
 * production.
 */
function warnIfFieldUnlabelled(label: string | undefined, ariaLabel: string | undefined) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  if (!label && !ariaLabel) {
    console.warn(
      '[nswds/ui] ExpandableSearchField has no label — pass `label` or `aria-label` so the search input has an accessible name.',
    )
  }
}

/**
 * Site-search disclosure: a 48px search chip that expands into a text field
 * whenever it holds focus or a value, and submits the query to `onAction`.
 * Compose it as `<ExpandableSearch>` (the form root, owning the value and the
 * focus-within state) around one `<ExpandableSearchField>` (the input and its
 * submit button) — typically inside `HeaderActions`.
 *
 * Ported from nswds-app's `ExpandableSearch`. The mechanic is kept verbatim —
 * the collapsed control IS the text input, styled as a chip, so that the very
 * first focus or tap both reveals and focuses the field with no extra step.
 * Expansion is pure CSS keyed on the active state; no Base UI primitive is
 * used because none models this pattern (it is a styled form, not a popup —
 * focus never moves, nothing is portalled, nothing needs ARIA beyond the
 * label).
 *
 * Accessibility contract:
 * - The input carries a visually-hidden `<label>` and an `aria-label`
 *   (default "Search"), and is `type='search'` with `enterKeyHint='search'`,
 *   so its role and purpose are announced while it still looks like a button
 *   (WCAG 2.2, 4.1.2; the source input was an unlabelled-by-type text input).
 * - Keyboard focus shows a 2px ink outline drawn inside the chip — the
 *   source's ring was its own surface colour against a hardcoded white offset
 *   and could vanish entirely (2.4.7, 2.4.13). See `searchFocusClassName`.
 * - Enter submits; Escape clears (native `type='search'` behaviour); an empty
 *   blurred field collapses back to the chip.
 * - Expansion and halo transitions honour `prefers-reduced-motion` (2.3.3).
 *
 * Departures from the nswds-app source, beyond those above:
 * - React 19 `ref` prop instead of `forwardRef`.
 * - Four parallel 14-entry variant tables replaced by one ink-driven map —
 *   see `expandableSearchVariants`.
 * - Expanded width `w-96` → `w-[min(24rem,80vw)]` so the field can never
 *   overflow a small viewport (1.4.10 Reflow).
 * - The expanded state no longer sets `outline-none` (it would have killed
 *   the new focus indicator; the source could afford it because its
 *   indicator was a box-shadow ring).
 * - Expanded text selection uses `select-text`, not the source's
 *   `select-auto` — `auto` computes from the root's `select-none` parent, so
 *   the source's expanded field was unselectable.
 * - A consumer `onChange` on the field is chained after the context update
 *   instead of replacing it (the source's spread order let it clobber the
 *   controlled handler).
 *
 * The root deliberately does not claim `role='search'`: where the component
 * is the page's site search, add it yourself (one search landmark per page).
 */
function ExpandableSearch({
  className,
  onAction,
  defaultValue = '',
  onSubmit,
  onFocusCapture,
  onBlurCapture,
  variant = 'default',
  ref,
  ...props
}: ExpandableSearchProps) {
  const [value, setValue] = React.useState(defaultValue)
  const [formHasFocusWithin, setFormHasFocusWithin] = React.useState(false)
  const resolvedVariant: ExpandableSearchVariant = variant ?? 'default'
  const isActive = value.length > 0 || formHasFocusWithin

  const contextValue = React.useMemo(
    () => ({ value, setValue, formHasFocusWithin, variant: resolvedVariant }),
    [value, formHasFocusWithin, resolvedVariant],
  )

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    onSubmit?.(e)

    if (e.defaultPrevented) {
      return
    }

    e.preventDefault()
    onAction?.(value)
  }

  const handleFocusCapture = (e: React.FocusEvent<HTMLFormElement>) => {
    setFormHasFocusWithin(true)
    onFocusCapture?.(e)
  }

  const handleBlurCapture = (e: React.FocusEvent<HTMLFormElement>) => {
    const nextFocusedElement = e.relatedTarget as Node | null

    if (!e.currentTarget.contains(nextFocusedElement)) {
      setFormHasFocusWithin(false)
    }

    onBlurCapture?.(e)
  }

  return (
    <ExpandableSearchContext.Provider value={contextValue}>
      <form
        data-slot='expandable-search'
        data-variant={resolvedVariant}
        // Present-or-absent rather than "true"/"false", so it reads like Base
        // UI's data-* attributes and Tailwind's bare `data-expanded:` variant
        // works. Same convention as Header's data-scrolled.
        data-expanded={isActive || undefined}
        {...props}
        // The surface (and its ink) lives on the root so BOTH children — the
        // input and the absolutely-positioned submit button — inherit the
        // custom properties. The root shrink-wraps the input, so painting the
        // background here is visually identical to painting it on the input.
        className={cn(expandableSearchVariants({ variant }), className)}
        onBlurCapture={handleBlurCapture}
        onFocusCapture={handleFocusCapture}
        onSubmit={handleSubmit}
        ref={ref}
      />
    </ExpandableSearchContext.Provider>
  )
}

/**
 * The input and its submit button. Must be rendered inside `ExpandableSearch`,
 * which owns the value and the focus-within state.
 *
 * The submit button is `pointer-events-none` while collapsed — deliberately,
 * per the source: collapsed, the input overlays the exact same 48px square and
 * OWNS the click, so a tap lands on the input, focuses it, and expands the
 * field. Making the button clickable there would submit an empty query
 * instead of opening the field. It also never traps keyboard focus while
 * collapsed: the input precedes it in tab order, and focusing the input
 * expands the field before the button is reached.
 */
function ExpandableSearchField({
  className,
  id,
  label = 'Search',
  'aria-label': ariaLabel,
  autoComplete = 'off',
  enterKeyHint = 'search',
  onChange,
  buttonLabel = 'Search',
  buttonProps,
  ref,
  ...props
}: ExpandableSearchFieldProps) {
  const context = React.useContext(ExpandableSearchContext)
  if (!context) throw new Error('ExpandableSearchField must be used within ExpandableSearch')

  const generatedId = React.useId()
  const {
    className: buttonClassName,
    children: buttonChildren,
    'aria-label': buttonAriaLabel,
    ...restButtonProps
  } = buttonProps ?? {}

  const isActive = context.value.length > 0 || context.formHasFocusWithin
  const inputId = id ?? generatedId

  warnIfFieldUnlabelled(label, ariaLabel)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    context.setValue(e.target.value)
    onChange?.(e)
  }

  return (
    <div data-slot='expandable-search-field' className='relative flex-1'>
      {label ? (
        // aria-label (below) wins for the accessible name where both exist;
        // the label element is kept for source parity and so a click on any
        // future visible rendering of it focuses the input.
        <label className='sr-only' htmlFor={inputId}>
          {label}
        </label>
      ) : null}

      <input
        data-slot='expandable-search-input'
        aria-label={ariaLabel ?? (label || undefined)}
        autoComplete={autoComplete}
        enterKeyHint={enterKeyHint}
        {...props}
        type='search'
        id={inputId}
        value={context.value}
        onChange={handleChange}
        className={cn(
          // Collapsed, the input is a 48px chip: transparent text and
          // placeholder so nothing peeks out, cursor-pointer because it acts
          // as the "open search" affordance. The background comes from the
          // form root, which shrink-wraps this element.
          'flex h-12 w-12 cursor-pointer overflow-hidden rounded-sm border-0 bg-transparent text-transparent',
          'placeholder:text-transparent placeholder:opacity-0',
          'transition-[width,box-shadow,background-color] duration-300 ease-in-out motion-reduce:transition-none',
          // Hide WebKit's native clear affordance: the source field (type
          // text) had none, and Escape already clears a search input.
          '[&::-webkit-search-cancel-button]:appearance-none',
          searchFocusClassName,
          isActive
            ? // Expanded: capped at 80vw so the field cannot overflow small
              // viewports (the source's fixed w-96 could). pr-12 reserves the
              // submit button's square. select-text (not select-auto — see
              // the component JSDoc) re-enables selection under the root's
              // select-none.
              'w-[min(24rem,80vw)] cursor-auto pt-0 pr-12 pb-0 pl-4 text-inherit select-text placeholder:text-(--search-placeholder) placeholder:opacity-100'
            : // Collapsed: the chip halos on hover exactly like the button
              // does — one visual whether the pointer technically rests on
              // the input overlay or not.
              'p-0 hover:bg-(--search-halo)',
          className,
        )}
        ref={ref}
      />

      <button
        data-slot='expandable-search-button'
        aria-label={buttonAriaLabel ?? buttonLabel}
        {...restButtonProps}
        type='submit'
        className={cn(
          'absolute top-0 right-0 z-10 flex h-12 w-12 cursor-pointer rounded-sm',
          'transition-[background-color,box-shadow] duration-200 motion-reduce:transition-none',
          // Icon and halos all derive from the ink; the whole-form
          // focus-within halo marks the button as the pending action while
          // the user types.
          'text-(--search-ink)',
          'group-focus-within/search:bg-(--search-halo) hover:bg-(--search-halo) active:bg-(--search-halo-active)',
          searchFocusClassName,
          // Collapsed, the input overlay owns the click — see the JSDoc.
          isActive ? 'pointer-events-auto' : 'pointer-events-none',
          buttonClassName,
        )}
      >
        {buttonChildren ?? (
          <IconSearch aria-hidden='true' className='m-auto block size-8 shrink-0 fill-current' />
        )}
      </button>
    </div>
  )
}

export { ExpandableSearch, ExpandableSearchField, expandableSearchVariants }
export type {
  ExpandableSearchButtonProps,
  ExpandableSearchFieldProps,
  ExpandableSearchProps,
  ExpandableSearchVariant,
}

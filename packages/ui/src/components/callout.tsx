import type * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils.js'

import { IconCheckCircle } from '../icons/check-circle.js'
import { IconError } from '../icons/error.js'
import { IconInfo } from '../icons/info.js'
import { IconWarning } from '../icons/warning.js'

/** The four message statuses, matching `Toaster`'s vocabulary. */
type CalloutStatus = 'info' | 'success' | 'warning' | 'danger'

/**
 * Status → glyph, deliberately identical to the mapping `sonner.tsx` gives its
 * toasts. A success confirmation should carry the same mark whether it arrives
 * as a toast or sits on the page, and a reader who has learnt one has learnt
 * the other.
 *
 * `danger` maps to `IconError` — the status name follows `Button`'s vocabulary
 * (`danger`, not `error`), while the icon name follows Material Symbols'.
 */
const CALLOUT_ICONS: Record<CalloutStatus, React.ElementType> = {
  info: IconInfo,
  success: IconCheckCircle,
  warning: IconWarning,
  danger: IconError,
}

/**
 * Every colour funnels through a single `--callout-ink` per status, declared on
 * the root so the icon and the border both resolve from one declaration — the
 * same ink-token pattern as `footer.tsx`, `link.tsx` and `step-indicator.tsx`.
 *
 * Values are the RAW `@nswds/tokens` semantic ROLE tokens (`--info-surface`,
 * `--info-text`, …), not the `--color-*` Tailwind bridge aliases. Two reasons,
 * both load-bearing:
 *
 * 1. Tailwind v4 tree-shakes unreferenced `@theme` keys, and an
 *    arbitrary-property reference is not a usage signal — the same trap
 *    documented on `button.tsx`'s semantic colours and `step-indicator.tsx`'s
 *    status inks. The raw tokens are plain `:root` declarations that always
 *    resolve.
 * 2. The role tokens already carry their own dark values, scoped
 *    `[data-theme=dark], .dark` by `@nswds/tokens`' `semantic/oklch.dark.css`
 *    (imported by theme.css). So every status flips with the theme on its own
 *    and this component needs no `dark:` variant at all — nothing here can
 *    drift out of step with the token library.
 */
const calloutVariants = cva(
  [
    'flex gap-4 rounded-md border p-6',
    'border-(--callout-border) bg-(--callout-surface) text-(--callout-text)',
  ],
  {
    variants: {
      status: {
        info: '[--callout-border:var(--info-border)] [--callout-ink:var(--info-solid)] [--callout-surface:var(--info-surface)] [--callout-text:var(--info-text)]',
        success:
          '[--callout-border:var(--success-border)] [--callout-ink:var(--success-solid)] [--callout-surface:var(--success-surface)] [--callout-text:var(--success-text)]',
        warning:
          '[--callout-border:var(--warning-border)] [--callout-ink:var(--warning-solid)] [--callout-surface:var(--warning-surface)] [--callout-text:var(--warning-text)]',
        danger:
          '[--callout-border:var(--danger-border)] [--callout-ink:var(--danger-solid)] [--callout-surface:var(--danger-surface)] [--callout-text:var(--danger-text)]',
      },
    },
    defaultVariants: {
      status: 'info',
    },
  },
)

type CalloutProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> &
  VariantProps<typeof calloutVariants> & {
    /** Optional bold lead line above the body copy. */
    title?: React.ReactNode
    /**
     * Replaces the status glyph. Pass `null` to drop it entirely — the status
     * is still carried by the border and surface, and by `title` where one is
     * supplied.
     */
    icon?: React.ElementType | null
    ref?: React.Ref<HTMLDivElement>
  }

/**
 * A bordered notice that marks a passage of page content as informational,
 * confirming, cautionary or dangerous.
 *
 * **This is for STATIC content, and carries no live-region semantics.** No
 * `role="alert"`, no `aria-live`: those announce on mount, so a callout that is
 * simply part of the page would interrupt a screen-reader user every time they
 * arrived. Use `Toaster` for a message that appears in response to something
 * the user just did, or `FieldError` for inline validation — both already
 * handle announcement. If you render a `Callout` dynamically and it genuinely
 * needs announcing, own that at the call site with your own live region.
 *
 * **Status is never carried by colour alone** (WCAG 2.2, 1.4.1). The glyph
 * distinguishes the four statuses visually; where the distinction also matters
 * to a screen-reader user, say so in the `title` or the body copy rather than
 * relying on the icon, which is decorative here by design.
 */
function Callout({ className, status, title, icon, children, ref, ...props }: CalloutProps) {
  const resolvedStatus = status ?? 'info'
  // `icon` is optional-with-a-default AND nullable-to-disable, so an explicit
  // `null` has to survive: `icon ?? CALLOUT_ICONS[…]` would resurrect the
  // default for exactly the consumer trying to turn it off.
  const Icon = icon === undefined ? CALLOUT_ICONS[resolvedStatus] : icon

  return (
    <div
      ref={ref}
      data-slot='callout'
      data-status={resolvedStatus}
      className={cn(calloutVariants({ status, className }))}
      {...props}
    >
      {Icon ? (
        <Icon
          aria-hidden='true'
          data-slot='callout-icon'
          // The icon modules paint `fill="currentColor"`, so setting the text
          // colour here is what tints the glyph — and it keeps working for a
          // consumer-supplied `icon` drawn with strokes rather than fills.
          className='mt-0.5 size-6 shrink-0 text-(--callout-ink)'
        />
      ) : null}
      <div data-slot='callout-content' className='min-w-0 flex-1'>
        {title ? (
          <p data-slot='callout-title' className='font-semibold'>
            {title}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  )
}

export { Callout, calloutVariants }
export type { CalloutProps, CalloutStatus }

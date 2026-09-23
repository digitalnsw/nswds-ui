'use client'

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import * as React from 'react'

import { Button } from '../components/button.js'
import { ButtonGroupBoundary } from '../lib/button-group-context.js'
import { overlayInk, overlayScrim } from '../lib/overlay.js'
import { cn } from '../lib/utils.js'

/**
 * A modal that interrupts the user to confirm or cancel a consequential
 * action. Unlike `Dialog` it has no close button and does not dismiss on an
 * outside click, and Base UI gives the popup `role="alertdialog"`. Escape
 * still closes it, so treat Escape as Cancel: never make closing the dialog
 * perform the action.
 */
function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot='alert-dialog' {...props} />
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger data-slot='alert-dialog-trigger' {...props} />
}

function AlertDialogPortal({ children, ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot='alert-dialog-portal' {...props}>
      {/* Stops a ButtonGroup's context at the portal — see ButtonGroupBoundary. */}
      <ButtonGroupBoundary>{children}</ButtonGroupBoundary>
    </AlertDialogPrimitive.Portal>
  )
}

/**
 * The same three looks as `DialogVariant` (design-shotgun, overlays-20260923):
 * `default` (Hairline), `band` and `rule`. Under `band` and `rule` the colour
 * follows the decision: a destructive confirm takes the danger ramp (a red
 * band, a red rule), any other takes the action colour — so a "Sign out?"
 * never borrows the alarm of a "Delete?". A confirm counts as destructive when
 * its `AlertDialogAction` is `color='danger'`, which is detected; if the danger
 * button is anything else (a plain `Button`, a `ButtonLink`), say so with
 * `tone='danger'` on `AlertDialogContent`.
 * No shadow, no backdrop blur — depth is drawn (DESIGN.md, The Hairline Rule).
 */
type AlertDialogVariant = 'default' | 'band' | 'rule'

function AlertDialogOverlay({ className, ...props }: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot='alert-dialog-overlay'
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
        overlayScrim,
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = 'default',
  variant = 'default',
  tone,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  /** `sm` narrows the popup and splits the footer into two equal buttons. */
  size?: 'default' | 'sm'
  variant?: AlertDialogVariant
  /**
   * Marks the confirm destructive for the `band` and `rule` looks. Only needed
   * when the danger button is not an `AlertDialogAction color='danger'`,
   * which is detected on its own.
   */
  tone?: 'default' | 'danger'
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot='alert-dialog-content'
        data-size={size}
        data-variant={variant}
        data-tone={tone}
        className={cn(
          'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 overflow-y-auto rounded-md bg-popover p-6 text-base/relaxed text-popover-foreground ring-1 ring-foreground/10 outline-hidden transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[size=default]:max-w-lg data-[size=sm]:max-w-sm',
          // The decision's colour, read by the band and the rule: the action
          // colour, or danger when the confirming action is a danger button.
          // Danger bands use Button's danger pairing — a fixed danger-600 fill
          // with white text, 6.6:1 in both modes and the same red as the
          // action beside it. danger-solid with text-inverse is 4.06:1 in dark.
          '[--alert-dialog-band-text:var(--text-inverse)] [--alert-dialog-band:var(--action-default)] has-[[data-slot=alert-dialog-action][data-color=danger]]:[--alert-dialog-band-text:var(--white)] has-[[data-slot=alert-dialog-action][data-color=danger]]:[--alert-dialog-band:var(--danger-600)] data-[tone=danger]:[--alert-dialog-band-text:var(--white)] data-[tone=danger]:[--alert-dialog-band:var(--danger-600)]',
          overlayInk,
          '[--alert-dialog-ink:var(--overlay-ink)] has-[[data-slot=alert-dialog-action][data-color=danger]]:[--alert-dialog-ink:var(--danger-solid)] data-[tone=danger]:[--alert-dialog-ink:var(--danger-solid)]',
          'data-[variant=rule]:rounded-t-sm data-[variant=rule]:border-t-4 data-[variant=rule]:border-t-(--alert-dialog-ink)',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-header'
      className={cn(
        // default: bleeds to the popup's edges and is divided off by a hairline.
        '-mx-6 -mt-6 flex flex-col items-start gap-2 border-b border-border px-6 pt-6 pb-5',
        // band: the same bleed, painted in the decision's colour.
        'group-data-[variant=band]/alert-dialog-content:border-b-0 group-data-[variant=band]/alert-dialog-content:bg-(--alert-dialog-band) group-data-[variant=band]/alert-dialog-content:pb-6 group-data-[variant=band]/alert-dialog-content:text-(--alert-dialog-band-text)',
        // rule: no bleed; a media glyph sits beside the title, not above it.
        'group-data-[variant=rule]/alert-dialog-content:mx-0 group-data-[variant=rule]/alert-dialog-content:mt-0 group-data-[variant=rule]/alert-dialog-content:grid-cols-[auto_1fr] group-data-[variant=rule]/alert-dialog-content:gap-x-3 group-data-[variant=rule]/alert-dialog-content:border-b-0 group-data-[variant=rule]/alert-dialog-content:px-0 group-data-[variant=rule]/alert-dialog-content:pt-0 group-data-[variant=rule]/alert-dialog-content:pb-0 group-data-[variant=rule]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-footer'
      className={cn(
        // `max-sm:` rather than a bare `flex-col-reverse` keeps the pair
        // cascade-safe (see check:cascade). The `sm` size is always a
        // two-column grid, at every width.
        'flex gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 max-sm:flex-col-reverse sm:flex-row sm:justify-end',
        '-mx-6 -mb-6 border-t border-border px-6 py-4',
        'group-data-[variant=band]/alert-dialog-content:border-t-0 group-data-[variant=band]/alert-dialog-content:bg-muted',
        'group-data-[variant=rule]/alert-dialog-content:mx-0 group-data-[variant=rule]/alert-dialog-content:mb-0 group-data-[variant=rule]/alert-dialog-content:border-t-0 group-data-[variant=rule]/alert-dialog-content:px-0 group-data-[variant=rule]/alert-dialog-content:py-0 group-data-[variant=rule]/alert-dialog-content:sm:justify-start',
        className,
      )}
      {...props}
    />
  )
}

/** An icon tile above the title — for a warning glyph on a destructive confirm, say. */
function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-dialog-media'
      className={cn(
        "mb-2 inline-flex size-12 items-center justify-center rounded-md bg-foreground/10 text-foreground [&_svg:not([class*='size-'])]:size-6",
        // band: the bare glyph in the band's inverse ink.
        'group-data-[variant=band]/alert-dialog-content:mb-0 group-data-[variant=band]/alert-dialog-content:size-auto group-data-[variant=band]/alert-dialog-content:bg-transparent group-data-[variant=band]/alert-dialog-content:text-(--alert-dialog-band-text)',
        // rule: the bare glyph, in the decision's ink, beside the title.
        'group-data-[variant=rule]/alert-dialog-content:mt-1 group-data-[variant=rule]/alert-dialog-content:mb-0 group-data-[variant=rule]/alert-dialog-content:size-auto group-data-[variant=rule]/alert-dialog-content:bg-transparent group-data-[variant=rule]/alert-dialog-content:text-(--alert-dialog-ink)',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot='alert-dialog-title'
      className={cn(
        'font-heading text-2xl font-medium text-foreground',
        'group-data-[variant=band]/alert-dialog-content:in-data-[slot=alert-dialog-header]:text-(--alert-dialog-band-text)',
        // rule: the title's hairline is the text colour, or danger on a
        // destructive confirm — the cap above carries the ink.
        'group-data-[variant=rule]/alert-dialog-content:col-start-2 group-data-[variant=rule]/alert-dialog-content:self-stretch group-data-[variant=rule]/alert-dialog-content:border-b group-data-[variant=rule]/alert-dialog-content:border-foreground group-data-[variant=rule]/alert-dialog-content:pb-3 group-data-[variant=rule]/alert-dialog-content:group-has-[[data-slot=alert-dialog-action][data-color=danger]]/alert-dialog-content:border-destructive group-data-[variant=rule]/alert-dialog-content:group-data-[tone=danger]/alert-dialog-content:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot='alert-dialog-description'
      className={cn(
        'text-base/relaxed text-muted-foreground',
        'group-data-[variant=band]/alert-dialog-content:in-data-[slot=alert-dialog-header]:text-(--alert-dialog-band-text)',
        'group-data-[variant=rule]/alert-dialog-content:col-start-2',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The confirming action. A plain `Button` — it does NOT close the dialog on
 * its own, so the handler can run (and fail) first; close the dialog by
 * controlling `open` once it succeeds.
 *
 * It stamps its `color` as `data-color`, which is how the `band` and `rule`
 * variants know a confirm is destructive.
 */
function AlertDialogAction(props: React.ComponentProps<typeof Button>) {
  return <Button data-slot='alert-dialog-action' data-color={props.color} {...props} />
}

/**
 * Closes the dialog without acting. Takes Button's `variant`, `size` and
 * `color` so it can match `AlertDialogAction`; `variant` defaults to outline.
 */
function AlertDialogCancel({
  variant = 'outline',
  size,
  color,
  ...props
}: Omit<AlertDialogPrimitive.Close.Props, 'color'> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'color'>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot='alert-dialog-cancel'
      render={<Button variant={variant} size={size} color={color} />}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
export type { AlertDialogVariant }

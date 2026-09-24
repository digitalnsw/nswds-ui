'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cva } from 'class-variance-authority'
import * as React from 'react'

import { Button } from '../components/button.js'
import { IconClose } from '../icons/close.js'
import { ButtonGroupBoundary } from '../lib/button-group-context.js'
import { overlayInk, overlayScrim } from '../lib/overlay.js'
import { cn } from '../lib/utils.js'

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />
}

function DialogPortal({ children, ...props }: DialogPrimitive.Portal.Props) {
  return (
    <DialogPrimitive.Portal data-slot='dialog-portal' {...props}>
      {/* Stops a ButtonGroup's context at the portal — see ButtonGroupBoundary. */}
      <ButtonGroupBoundary>{children}</ButtonGroupBoundary>
    </DialogPrimitive.Portal>
  )
}

/**
 * The three approved looks (design-shotgun, overlays-20260923):
 *
 * - `default` (Hairline): a flat raised surface drawn with a 1px ring; the
 *   header and footer bleed to the edges and are divided off by hairlines.
 * - `band`: the header is a solid band in the action colour with an inverse
 *   title; the footer sits on a subtle band.
 * - `rule`: a 4px rule in the ink colour caps the top edge, the title sits on
 *   a hairline in the text colour, and the actions align to the start.
 *
 * None casts a shadow and none blurs the page behind — depth is drawn, per
 * DESIGN.md's Hairline Rule. Parts read the variant from `data-variant` on
 * the popup through `group-data-*`, so there is no context to thread.
 */
type DialogVariant = 'default' | 'band' | 'rule'

/**
 * The popup's own classes and its look. The parts (header, footer, title,
 * description, close button) read the look from `data-variant` through
 * `group-data-*` instead: cva sees only its own props, not an ancestor's.
 * Radius sits in every branch, not the base, so rule's square top never
 * competes with a base `rounded-md` at equal specificity.
 */
const dialogContentVariants = cva(
  // `w-[calc(100%-2rem)]` + `max-w-lg` rather than shadcn's
  // `max-w-[calc(100%-2rem)] sm:max-w-sm`: two different properties, so there
  // is no bare/responsive pair for a consumer's build to reorder (see
  // check:cascade).
  'group/dialog-content fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-6 overflow-y-auto bg-popover p-6 text-base/relaxed text-popover-foreground ring-1 ring-foreground/10 outline-hidden transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
  {
    variants: {
      variant: {
        default: 'rounded-md',
        band: 'rounded-md',
        rule: 'rounded-t-sm rounded-b-md border-t-4 border-t-(--overlay-ink)',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot='dialog-overlay'
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
        overlayScrim,
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  variant = 'default',
  showCloseButton = true,
  closeLabel = 'Close',
  ...props
}: DialogPrimitive.Popup.Props & {
  variant?: DialogVariant
  showCloseButton?: boolean
  /**
   * Screen-reader name for the close button. Override to translate it — the
   * button is icon-only, so this string is the only name AT ever hears.
   */
  closeLabel?: string
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot='dialog-content'
        data-variant={variant}
        className={cn(
          dialogContentVariants({ variant }),
          // The ink rule's cap is drawn in (see overlayInk).
          overlayInk,
          // The header rules below match it at any depth, not only as a direct
          // child: an edit dialog usually wraps its content in a <form>.
          // A header with nothing below it draws no divider over empty space.
          '[&_[data-slot=dialog-header]:last-child]:border-b-0',
          // Keep a long title clear of the absolutely-positioned close button:
          // 72px where the header bleeds to the edge (24px gutter + the 48px
          // the button needs), 48px under `rule`, whose header does not bleed.
          '[&:has(>[data-slot=dialog-close])_[data-slot=dialog-header]]:pe-18 data-[variant=rule]:[&:has(>[data-slot=dialog-close])_[data-slot=dialog-header]]:pe-12',
          // With no header at all, the first content after the close button
          // reserves the button's 48px instead, so its text cannot run under it.
          '[&>[data-slot=dialog-close]+:not([data-slot=dialog-header]):not(:has([data-slot=dialog-header]))]:pe-12',
          className,
        )}
        {...props}
      >
        {/* The close button comes FIRST in the DOM (it is absolutely placed, so
            the visual order is unchanged). Base UI focuses the first tabbable
            element on open; after the content, that is a footer button, and a
            long dialog opens scrolled to the bottom with the reader past
            everything above it. */}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot='dialog-close'
            render={
              <Button
                variant='ghost'
                color='grey'
                size='icon'
                aria-label={closeLabel}
                className={cn(
                  // z-20, as Sheet's: the button comes first in the DOM, and
                  // equal z-indexes paint in DOM order, so any later positioned
                  // child in the corner (a Button is `relative`) would paint
                  // over it and take its clicks. z-20 clears children up to and
                  // including the conventional sticky-header z-10.
                  'absolute end-4 top-4 z-20',
                  // On the band the button takes the band's inverse ink — only
                  // when a header is there to paint the band. The extra
                  // data-slot keeps this above Button's own dark ink at any
                  // emission order.
                  'group-data-[variant=band]/dialog-content:group-has-[[data-slot=dialog-header]]/dialog-content:data-[slot=dialog-close]:[--btn-bg:var(--text-inverse)]',
                )}
              />
            }
          >
            <IconClose />
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-header'
      className={cn(
        // default: bleeds to the popup's edges and is divided off by a hairline.
        '-mx-6 -mt-6 flex flex-col gap-2 border-b border-border px-6 pt-6 pb-5',
        // band: the same bleed, painted as a solid band instead of divided.
        'group-data-[variant=band]/dialog-content:border-b-0 group-data-[variant=band]/dialog-content:bg-primary group-data-[variant=band]/dialog-content:pb-6 group-data-[variant=band]/dialog-content:text-primary-foreground',
        // rule: no bleed — the title carries its own hairline instead.
        'group-data-[variant=rule]/dialog-content:mx-0 group-data-[variant=rule]/dialog-content:mt-0 group-data-[variant=rule]/dialog-content:border-b-0 group-data-[variant=rule]/dialog-content:px-0 group-data-[variant=rule]/dialog-content:pt-0 group-data-[variant=rule]/dialog-content:pb-0',
        className,
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  closeLabel = 'Close',
  children,
  ...props
}: React.ComponentProps<'div'> & {
  /** Appends an outline Close button after the footer's own actions. */
  showCloseButton?: boolean
  /** Visible label of that Close button. Override to translate it. */
  closeLabel?: string
}) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn(
        // Stacked with the primary action on top below `sm`, a row aligned to
        // the end from `sm` up. `max-sm:` rather than a bare `flex-col-reverse`
        // keeps the pair cascade-safe (see check:cascade).
        'flex gap-2 max-sm:flex-col-reverse sm:flex-row sm:justify-end',
        // default: bleeds to the popup's edges above a hairline.
        '-mx-6 -mb-6 border-t border-border px-6 py-4',
        // band: the same bleed on a subtle band instead of a hairline.
        'group-data-[variant=band]/dialog-content:border-t-0 group-data-[variant=band]/dialog-content:bg-muted',
        // rule: no bleed, actions aligned to the start.
        'group-data-[variant=rule]/dialog-content:mx-0 group-data-[variant=rule]/dialog-content:mb-0 group-data-[variant=rule]/dialog-content:border-t-0 group-data-[variant=rule]/dialog-content:px-0 group-data-[variant=rule]/dialog-content:py-0 group-data-[variant=rule]/dialog-content:sm:justify-start',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant='outline' />}>
          {closeLabel}
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn(
        'font-heading text-2xl font-medium text-foreground',
        // Inverse ink only inside the band — a title placed in the body stays
        // on the popover and must keep the default ink.
        'group-data-[variant=band]/dialog-content:in-data-[slot=dialog-header]:text-primary-foreground',
        'group-data-[variant=rule]/dialog-content:border-b group-data-[variant=rule]/dialog-content:border-foreground group-data-[variant=rule]/dialog-content:pb-3',
        className,
      )}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn(
        'text-base/relaxed text-muted-foreground',
        'group-data-[variant=band]/dialog-content:in-data-[slot=dialog-header]:text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  dialogContentVariants,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
export type { DialogVariant }

'use client'

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import * as React from 'react'

import { Button } from '../components/button.js'
import { IconClose } from '../icons/close.js'
import { ButtonGroupBoundary } from '../lib/button-group-context.js'
import { overlayScrim } from '../lib/overlay.js'
import { cn } from '../lib/utils.js'

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot='sheet' {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot='sheet-close' {...props} />
}

function SheetPortal({ children, ...props }: SheetPrimitive.Portal.Props) {
  return (
    <SheetPrimitive.Portal data-slot='sheet-portal' {...props}>
      {/* Stops a ButtonGroup's context at the portal — see ButtonGroupBoundary. */}
      <ButtonGroupBoundary>{children}</ButtonGroupBoundary>
    </SheetPrimitive.Portal>
  )
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot='sheet-overlay'
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0',
        overlayScrim,
        className,
      )}
      {...props}
    />
  )
}

/**
 * On open, keyboard and mouse users land on the close button, which is first
 * in the DOM, rather than on the first control in the content. With
 * `showCloseButton={false}` the sheet itself takes focus, so a long sheet
 * never opens scrolled to a footer action. Pass `initialFocus` to choose a
 * different target, such as a search field the sheet exists to fill in.
 *
 * With the close button shown, content in the button's corner reserves room
 * at the end edge so text cannot run under it: the SheetHeader, and also the
 * first visible child when that is not (and does not contain) the header —
 * with no header at all, or an intro placed before the header. Add
 * `data-sheet-bleed` to a padded element — a SheetHeader included — to opt
 * out, e.g. for a full-bleed banner or a wrapper whose rows should reach the
 * edge. "Visible" means not `sr-only` or `[hidden]`: a child hidden only
 * at some breakpoints (`hidden sm:block`, `sr-only sm:not-sr-only`) cannot be
 * told apart in CSS, so give that content its own end padding.
 */
function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  closeLabel = 'Close',
  initialFocus,
  ref,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  showCloseButton?: boolean
  /**
   * Screen-reader name for the close button. Override to translate it — the
   * button is icon-only, so this string is the only name AT ever hears.
   */
  closeLabel?: string
}) {
  const popupRef = React.useRef<HTMLDivElement | null>(null)
  // Returns its own cleanup, so React 19 never calls this with null. That
  // cleanup must run the consumer's in turn: React keeps a callback ref's
  // return value as its teardown, and dropping it would skip that teardown.
  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      popupRef.current = node
      if (typeof ref === 'function') {
        const cleanup = ref(node)
        return () => {
          popupRef.current = null
          if (typeof cleanup === 'function') cleanup()
          else ref(null)
        }
      }
      if (ref) ref.current = node
      return () => {
        popupRef.current = null
        if (ref) ref.current = null
      }
    },
    [ref],
  )

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        ref={mergedRef}
        // Without a close button there is no known-safe first control, and the
        // first tabbable may be a footer action below the fold. The popup
        // itself is the one target Base UI focuses with preventScroll.
        initialFocus={initialFocus ?? (showCloseButton ? undefined : popupRef)}
        data-slot='sheet-content'
        data-side={side}
        className={cn(
          'fixed z-50 flex max-h-dvh flex-col overflow-y-auto bg-popover bg-clip-padding text-base/relaxed text-popover-foreground transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm rtl:data-[side=left]:data-ending-style:-translate-x-[-2.5rem] rtl:data-[side=left]:data-starting-style:-translate-x-[-2.5rem] rtl:data-[side=right]:data-ending-style:-translate-x-[2.5rem] rtl:data-[side=right]:data-starting-style:-translate-x-[2.5rem]',
          // These rules anchor on `data-sheet-corner-close`, the built-in button
          // only: a consumer's own SheetClose shares its `data-slot` but is not
          // in the corner, and must not switch the reserved room on.
          //
          // Keep a long title clear of the absolutely placed close button: it
          // spans 1rem-3.5rem from the end edge, so pe-16 clears it. The header
          // matches at any depth (a form often wraps it), as Dialog's does.
          '[&:has(>[data-sheet-corner-close])_[data-slot=sheet-header]:not([data-sheet-bleed])]:pe-16',
          // Whatever sits beside the close button reserves the same room, so its
          // text cannot run under it: the first VISIBLE child (an sr-only title
          // or a [hidden] element is skipped), checked on that element only,
          // not the whole sheet — an intro placed before a header is the
          // content in the button's corner. A child that is or wraps the header
          // (at any depth) is left to the rule above, so a header is never
          // padded twice. If that child wraps the whole sheet with no header,
          // all of it is padded; `data-sheet-bleed` on it opts out, as it does
          // for full-bleed media meant to run under the button.
          '[&:has(>[data-sheet-corner-close])>:nth-child(1_of_:not([data-sheet-corner-close],.sr-only,[hidden])):not(:has([data-slot=sheet-header])):not([data-sheet-bleed])]:pe-16',
          // One level into a first child that wraps the header (the usual
          // <form>): its own first visible child is the content in the corner,
          // e.g. an intro above the header, so it gets the same room.
          '[&:has(>[data-sheet-corner-close])>:nth-child(1_of_:not([data-sheet-corner-close],.sr-only,[hidden])):has([data-slot=sheet-header])>:nth-child(1_of_:not(.sr-only,[hidden])):not(:has([data-slot=sheet-header])):not([data-sheet-bleed])]:pe-16',
          className,
        )}
        {...props}
      >
        {/* The close button comes FIRST in the DOM (it is absolutely placed, so
            the visual order is unchanged). On a keyboard or mouse open, Base UI
            focuses the first tabbable element (on a touch open it focuses the
            popup, and DOM order does not matter); after the content, that is a
            footer button, and a long sheet opens scrolled to the bottom with
            the reader past everything above it. Being first also means it
            would paint UNDER any later positioned child in the corner (a
            Button is `relative`), so it carries z-20: above children up to
            and including the conventional sticky-header z-10. */}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot='sheet-close'
            data-sheet-corner-close=''
            render={
              <Button
                variant='ghost'
                color='grey'
                size='icon'
                aria-label={closeLabel}
                className='absolute end-4 top-4 z-20'
              />
            }
          >
            <IconClose />
          </SheetPrimitive.Close>
        )}
        {children}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sheet-header'
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sheet-footer'
      className={cn('mt-auto flex flex-col gap-2 p-6', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot='sheet-title'
      className={cn('text-lg font-medium text-foreground', className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot='sheet-description'
      className={cn('text-base/relaxed text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}

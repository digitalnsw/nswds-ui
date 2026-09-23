'use client'

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import * as React from 'react'

import { Button } from '../components/button.js'
import { IconClose } from '../icons/close.js'
import { ButtonGroupBoundary } from '../lib/button-group-context.js'
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
        'fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
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
  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      popupRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
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
          'fixed z-50 flex max-h-dvh flex-col overflow-y-auto bg-popover bg-clip-padding text-base/relaxed text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm rtl:data-[side=left]:data-ending-style:-translate-x-[-2.5rem] rtl:data-[side=left]:data-starting-style:-translate-x-[-2.5rem] rtl:data-[side=right]:data-ending-style:-translate-x-[2.5rem] rtl:data-[side=right]:data-starting-style:-translate-x-[2.5rem]',
          // Keep a long title clear of the absolutely placed close button: it
          // spans 1rem-3.5rem from the end edge, so pe-16 clears it.
          '[&:has(>[data-slot=sheet-close])>[data-slot=sheet-header]]:pe-16',
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

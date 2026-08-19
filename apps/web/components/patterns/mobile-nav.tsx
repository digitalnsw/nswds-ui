'use client'

// Copied from packages/ui/src/patterns/mobile-nav.tsx for the docs live preview,
// with imports rewritten to the published @nswds/ui surface — the same
// copy-and-adapt flow registry consumers use. Regenerate by re-copying the
// source if the upstream pattern changes.

import * as React from 'react'

import {
  Button,
  PushMenu,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  type PushMenuItem,
} from '@nswds/ui'
import { IconMenu } from '@nswds/ui/icons/menu'

export type MobileNavProps = {
  /** The menu tree, passed straight to `PushMenu`. Item ids must be unique. */
  navigation: PushMenuItem[]
  /**
   * The app's current pathname. Leaf links whose `href` matches get
   * `aria-current="page"` and the active treatment (see `PushMenu`).
   */
  currentHref?: string
  /**
   * Drawer title: names the dialog for assistive tech (via a visually-hidden
   * `SheetTitle`) and is shown by `PushMenu` as its root level heading.
   * Defaults to `"Menu"`.
   */
  title?: string
  /** Controlled open state. Leave unset for uncontrolled. */
  open?: boolean
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean
  /**
   * Fired whenever the drawer opens or closes — trigger click, Escape,
   * backdrop click, the menu's own close button, and leaf-link clicks all
   * funnel through here. Pair with `open` for a controlled drawer.
   */
  onOpenChange?: (open: boolean) => void
  /** Extra drawer content rendered below the menu — a sign-in link, say. */
  children?: React.ReactNode
}

/**
 * Mobile navigation drawer: a hamburger button that opens a left-side sheet
 * containing the multi-level `PushMenu`. A registry block — copy the source
 * and adapt it — composed entirely from published components: `Button`
 * (trigger), `Sheet` (the drawer, on the Base UI dialog primitive) and
 * `PushMenu` (the drill-down menu).
 *
 * Accessibility contract:
 *
 * - Base UI's dialog provides the modal behaviour — focus trap, scroll lock,
 *   Escape and backdrop dismissal, and focus return to the trigger on close.
 *   Nothing is hand-rolled (the nswds-app source hand-assembled this from
 *   Headless UI Dialog + fixed-position divs).
 * - The dialog's accessible name comes from a visually-hidden `SheetTitle`.
 *   It is `sr-only` because `PushMenu` already renders a visible title in its
 *   header row: a second visible "Menu" heading would duplicate it, but the
 *   per-level heading can't name the dialog either — it changes as the user
 *   drills, and it isn't wired to the popup's `aria-labelledby`. Same
 *   arrangement as sidebar-style sheets elsewhere in the shadcn ecosystem.
 * - The sheet's built-in close button is disabled (`showCloseButton={false}`)
 *   in favour of `PushMenu`'s own header close button — two overlapping close
 *   affordances in the same corner would be one too many, and the menu's
 *   button participates in its focus management. `onClose` is wired to close
 *   the sheet, and leaf-link clicks close it too (`onItemClick`), so choosing
 *   a destination never strands the drawer over the new page.
 * - Open state is controlled-or-uncontrolled: the sheet itself is always
 *   driven from one internal source of truth so the menu's close paths work
 *   in both modes, and `onOpenChange` reports every transition.
 *
 * Departures from the nswds-app source (`MobileHeader`):
 *
 * - The logo/badge/centering row and the `lg:hidden` breakpoint wrapper are
 *   gone — the published `Header` already renders the brand lockup at every
 *   width, so this block is only the navigation drawer. Place it inside
 *   `HeaderActions` and hide it at desktop widths from the outside (e.g. a
 *   `lg:hidden` wrapper) if the service swaps to a horizontal nav there.
 * - `MobileSearch` is out of scope; compose `ExpandableSearch` or your own
 *   search alongside this block in `HeaderActions`.
 * - The hand-written slide transition is replaced by `SheetContent`'s, which
 *   respects `prefers-reduced-motion`.
 */
export function MobileNav({
  navigation,
  currentHref,
  title = 'Menu',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: MobileNavProps) {
  // Controlled-or-uncontrolled: the Sheet is always handed a single resolved
  // `open` so the menu's close paths (header close button, leaf-link clicks)
  // work identically in both modes. When `open` is supplied, the internal
  // state is bypassed and the consumer decides what `onOpenChange` does.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  function setOpen(next: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(next)
    }
    onOpenChange?.(next)
  }

  return (
    <Sheet open={open} onOpenChange={(next) => setOpen(next)}>
      {/* aria-label, not visible text: the trigger is icon-only, and Button's
          dev-only guard would flag it unnamed otherwise (WCAG 2.2, 4.1.2). */}
      <SheetTrigger
        data-slot='mobile-nav-trigger'
        render={
          <Button
            variant='ghost'
            color='grey'
            size='icon'
            aria-label='Open navigation menu'
            leadingVisual={IconMenu}
          />
        }
      />
      {/* Width comes from SheetContent's own left-side treatment (w-3/4,
          sm:max-w-sm) — overriding it needs the data-[side=left]: prefix, or
          the default's higher-specificity variant class wins. p-0 guards
          against any future default padding: PushMenu supplies its own. */}
      <SheetContent side='left' showCloseButton={false} className='p-0'>
        <SheetTitle className='sr-only'>{title}</SheetTitle>
        {/* h-auto + flex-1 override PushMenu's own h-full so extra drawer
            content (children) can share the column; min-h-0 lets the menu's
            internal scroll area shrink instead of overflowing the sheet. */}
        <PushMenu
          navigation={navigation}
          currentHref={currentHref}
          title={title}
          onClose={() => setOpen(false)}
          onItemClick={() => setOpen(false)}
          className='h-auto min-h-0 flex-1'
        />
        {children ? (
          <div data-slot='mobile-nav-extra' className='border-t border-border p-4'>
            {children}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import * as React from 'react'

import { IconCheck } from '../icons/check.js'
import { IconChevronRight } from '../icons/chevron-right.js'
import { ButtonGroupBoundary } from '../lib/button-group-context.js'
import { overlayInk } from '../lib/overlay.js'
import { cn } from '../lib/utils.js'

/**
 * The three approved looks (design-shotgun, overlays-20260923), set on
 * `DropdownMenuContent` and read by every part through `group-data-*`:
 *
 * - `default` (Hairline): a flat surface drawn with a 1px ring. The
 *   highlighted row takes an ink tint, and keyboard focus adds a 2px inset
 *   ring — a tint alone is ~1.1:1 against the menu and is no focus cue.
 * - `band`: the highlighted row is a solid band in the action colour, the
 *   group label sits on a subtle band, and rows run edge to edge.
 * - `rule`: a 4px ink rule caps the top edge and a 4px rail on the start edge
 *   marks the highlighted row, like SideNav's current-page rail.
 *
 * No shadow — depth is drawn (DESIGN.md, The Hairline Rule).
 */
type DropdownMenuVariant = 'default' | 'band' | 'rule'

/** Lets a submenu default to the variant of the menu it opens from. */
const DropdownMenuVariantContext = React.createContext<DropdownMenuVariant>('default')

/**
 * Row geometry shared by every item kind, matching `SelectItem`: 44px minimum
 * target (WCAG 2.2 2.5.8 with room to spare), 16px text, `rounded-sm`. The
 * highlight keys on Base UI's `data-highlighted`, which tracks both pointer
 * hover and keyboard focus; the focus ring keys on `:focus-visible`, which
 * only the keyboard sets. `data-inset` lines an icon-less item up with
 * siblings that lead with a 16px icon (16px padding + 16px icon + 8px gap).
 *
 * The ring states `outline-solid` explicitly: `outline-hidden` sets
 * `--tw-outline-style: none`, which `outline-2` reads, so without it the
 * ring takes its width and colour and still never paints.
 */
const itemClasses = [
  "group/dropdown-menu-item relative flex min-h-11 w-full cursor-default items-center gap-2 rounded-sm ps-4 pe-4 py-2 text-base outline-hidden select-none data-highlighted:bg-foreground/8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:ps-10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  // band: edge-to-edge rows; the highlight is a solid action-colour band,
  // strong enough to be the focus cue on its own, so the ring stands down.
  'group-data-[variant=band]/dropdown-menu-content:rounded-none group-data-[variant=band]/dropdown-menu-content:data-highlighted:bg-primary group-data-[variant=band]/dropdown-menu-content:data-highlighted:text-primary-foreground group-data-[variant=band]/dropdown-menu-content:focus-visible:outline-hidden',
  // rule: a 4px start-edge rail in the ink marks the highlight, and is the
  // focus cue too, so the ring stands down. 12px + the 4px rail keeps text on
  // the same 16px line as the other looks.
  'group-data-[variant=rule]/dropdown-menu-content:rounded-none group-data-[variant=rule]/dropdown-menu-content:border-s-4 group-data-[variant=rule]/dropdown-menu-content:border-transparent group-data-[variant=rule]/dropdown-menu-content:ps-3 group-data-[variant=rule]/dropdown-menu-content:data-inset:ps-9 group-data-[variant=rule]/dropdown-menu-content:data-highlighted:border-s-(--overlay-ink) group-data-[variant=rule]/dropdown-menu-content:data-highlighted:bg-(--overlay-ink)/8 group-data-[variant=rule]/dropdown-menu-content:focus-visible:outline-hidden',
].join(' ')

/**
 * True inside a `DropdownMenuGroup` or `DropdownMenuRadioGroup`. Base UI's
 * group label THROWS when no group encloses it — on first open, not at render
 * — so `DropdownMenuLabel` reads this to supply a group of its own instead.
 */
const DropdownMenuGroupContext = React.createContext(false)

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot='dropdown-menu' {...props} />
}

function DropdownMenuPortal({ children, ...props }: MenuPrimitive.Portal.Props) {
  return (
    <MenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props}>
      {/* Stops a ButtonGroup's context at the portal — see ButtonGroupBoundary. */}
      <ButtonGroupBoundary>{children}</ButtonGroupBoundary>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot='dropdown-menu-trigger' {...props} />
}

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  variant = 'default',
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    variant?: DropdownMenuVariant
  }) {
  return (
    <DropdownMenuPortal>
      <MenuPrimitive.Positioner
        className='isolate z-50 outline-hidden'
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot='dropdown-menu-content'
          data-variant={variant}
          className={cn(
            // At least as wide as the trigger and never narrower than 12rem —
            // shadcn pins the menu to the trigger's width, which squeezes a
            // menu opened from an icon button down to a sliver.
            'group/dropdown-menu-content z-50 max-h-(--available-height) w-max max-w-(--available-width) min-w-[max(var(--anchor-width),12rem)] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
            // The ink `rule` paints its cap and rail with (see overlayInk).
            overlayInk,
            'data-[variant=band]:p-0',
            'data-[variant=rule]:rounded-t-sm data-[variant=rule]:border-t-4 data-[variant=rule]:border-t-(--overlay-ink) data-[variant=rule]:px-0 data-[variant=rule]:pt-0',
            className,
          )}
          {...props}
        >
          <DropdownMenuVariantContext.Provider value={variant}>
            {children}
          </DropdownMenuVariantContext.Provider>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </DropdownMenuPortal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return (
    <DropdownMenuGroupContext.Provider value>
      <MenuPrimitive.Group data-slot='dropdown-menu-group' {...props} />
    </DropdownMenuGroupContext.Provider>
  )
}

/**
 * A heading for a `DropdownMenuGroup`, which it names for assistive tech.
 * Outside a group — the shadcn/Radix habit of dropping a label straight into
 * the content — it wraps itself in a group of its own rather than crash.
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  const inGroup = React.useContext(DropdownMenuGroupContext)
  const label = (
    <MenuPrimitive.GroupLabel
      data-slot='dropdown-menu-label'
      data-inset={inset || undefined}
      className={cn(
        'px-4 py-2 text-base font-semibold text-muted-foreground data-inset:ps-10',
        'group-data-[variant=band]/dropdown-menu-content:bg-muted group-data-[variant=band]/dropdown-menu-content:py-2.5',
        // rule: the label sits on a hairline in the text colour; mx-4 + ps-6
        // puts an inset label's text on the inset items' 40px line.
        'group-data-[variant=rule]/dropdown-menu-content:mx-4 group-data-[variant=rule]/dropdown-menu-content:mb-1 group-data-[variant=rule]/dropdown-menu-content:border-b group-data-[variant=rule]/dropdown-menu-content:border-foreground group-data-[variant=rule]/dropdown-menu-content:px-0 group-data-[variant=rule]/dropdown-menu-content:text-foreground group-data-[variant=rule]/dropdown-menu-content:data-inset:ps-6',
        className,
      )}
      {...props}
    />
  )
  return inGroup ? (
    label
  ) : (
    <MenuPrimitive.Group data-slot='dropdown-menu-group'>{label}</MenuPrimitive.Group>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  /**
   * `destructive` inks the item with the danger role tokens, which carry
   * their own dark values — so it needs no `dark:` variant.
   */
  variant?: 'default' | 'destructive'
}) {
  return (
    <MenuPrimitive.Item
      data-slot='dropdown-menu-item'
      data-inset={inset || undefined}
      data-variant={variant}
      className={cn(
        itemClasses,
        'data-[variant=destructive]:text-(--danger-text) data-[variant=destructive]:data-highlighted:bg-(--danger-surface) data-[variant=destructive]:data-highlighted:text-(--danger-text)',
        // A destructive row keeps the danger colour under each look. These
        // carry one more attribute than the look's own highlight, so they win
        // at any emission order.
        'group-data-[variant=band]/dropdown-menu-content:data-[variant=destructive]:data-highlighted:bg-(--danger-600) group-data-[variant=band]/dropdown-menu-content:data-[variant=destructive]:data-highlighted:text-(--white)',
        'group-data-[variant=rule]/dropdown-menu-content:data-[variant=destructive]:data-highlighted:border-s-destructive group-data-[variant=rule]/dropdown-menu-content:data-[variant=destructive]:data-highlighted:bg-(--danger-surface)',
        className,
      )}
      {...props}
    />
  )
}

/**
 * An item that navigates. Renders a real `<a>`, so the browser's own link
 * behaviour (middle-click, open in new tab, status-bar URL) is kept — use it
 * instead of an `onClick` that sets `location`.
 *
 * `closeOnClick` defaults to `true` here, where Base UI's own default is
 * `false`: with client-side routing (`render={<Link />}`) the page never
 * reloads, so a menu that stayed open would sit over the new route.
 */
function DropdownMenuLinkItem({
  className,
  inset,
  closeOnClick = true,
  ...props
}: MenuPrimitive.LinkItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.LinkItem
      data-slot='dropdown-menu-link-item'
      data-inset={inset || undefined}
      closeOnClick={closeOnClick}
      className={cn(itemClasses, className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot='dropdown-menu-sub' {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot='dropdown-menu-sub-trigger'
      data-inset={inset || undefined}
      className={cn(
        itemClasses,
        // The row whose submenu is open stays marked, in each look's highlight.
        'data-popup-open:bg-foreground/8 group-data-[variant=band]/dropdown-menu-content:data-popup-open:bg-primary group-data-[variant=band]/dropdown-menu-content:data-popup-open:text-primary-foreground group-data-[variant=rule]/dropdown-menu-content:data-popup-open:border-s-(--overlay-ink) group-data-[variant=rule]/dropdown-menu-content:data-popup-open:bg-(--overlay-ink)/8',
        className,
      )}
      {...props}
    >
      {children}
      <IconChevronRight className='ms-auto rtl:rotate-180' />
    </MenuPrimitive.SubmenuTrigger>
  )
}

/**
 * A submenu's popup. It portals out of its parent menu, so it cannot read the
 * parent's `data-variant` from the DOM; `variant` defaults to the parent's
 * through context instead.
 */
function DropdownMenuSubContent({
  align = 'start',
  alignOffset,
  side = 'inline-end',
  sideOffset = 0,
  variant,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  const parentVariant = React.useContext(DropdownMenuVariantContext)
  const resolved = variant ?? parentVariant
  return (
    <DropdownMenuContent
      data-slot='dropdown-menu-sub-content'
      variant={resolved}
      className={cn('min-w-48', className)}
      align={align}
      // Line the submenu's first row up with its trigger row: the submenu's
      // own first row sits 4px below its top edge (its p-1, or rule's 4px
      // cap), except under band, whose rows start flush.
      alignOffset={alignOffset ?? (resolved === 'band' ? 0 : -4)}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot='dropdown-menu-checkbox-item'
      data-inset={inset || undefined}
      className={cn(itemClasses, 'pe-10', className)}
      {...props}
    >
      <span
        className='pointer-events-none absolute end-3 flex items-center justify-center'
        data-slot='dropdown-menu-checkbox-item-indicator'
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <IconCheck />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <DropdownMenuGroupContext.Provider value>
      <MenuPrimitive.RadioGroup data-slot='dropdown-menu-radio-group' {...props} />
    </DropdownMenuGroupContext.Provider>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot='dropdown-menu-radio-item'
      data-inset={inset || undefined}
      className={cn(itemClasses, 'pe-10', className)}
      {...props}
    >
      <span
        className='pointer-events-none absolute end-3 flex items-center justify-center'
        data-slot='dropdown-menu-radio-item-indicator'
      >
        <MenuPrimitive.RadioItemIndicator>
          <IconCheck />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot='dropdown-menu-separator'
      className={cn(
        '-mx-1 my-1 h-px bg-border group-data-[variant=band]/dropdown-menu-content:mx-0 group-data-[variant=band]/dropdown-menu-content:my-0 group-data-[variant=rule]/dropdown-menu-content:mx-4',
        className,
      )}
      {...props}
    />
  )
}

/** A trailing hint such as a keyboard shortcut. Decorative — it binds nothing. */
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn(
        'ms-auto ps-4 text-base tracking-widest text-muted-foreground',
        // On band's solid highlight, muted ink would sit on the action colour.
        'group-data-[variant=band]/dropdown-menu-content:group-data-highlighted/dropdown-menu-item:text-current',
        className,
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
export type { DropdownMenuVariant }

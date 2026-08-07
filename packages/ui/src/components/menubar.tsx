'use client'

import { Menu } from '@base-ui/react/menu'
import { Menubar as MenubarPrimitive } from '@base-ui/react/menubar'
import * as React from 'react'

import { IconCheck } from '../icons/check.js'
import { IconChevronRight } from '../icons/chevron-right.js'
import { IconCircle } from '../icons/circle.js'
import { cn } from '../lib/utils.js'

/**
 * Menubar — a horizontal, always-visible row of menu triggers (the desktop
 * "File / Edit / View" pattern), ported from the nswds-app Radix Menubar
 * wrapper onto Base UI's `Menubar` container + `Menu` parts.
 *
 * A11y contract (all inherited from Base UI — nothing hand-rolled here):
 * - The container renders `role="menubar"`; each trigger inside it becomes a
 *   `role="menuitem"` with `aria-haspopup="menu"` / `aria-controls` wiring.
 * - Left/Right arrows rove between triggers, Down/Enter/Space opens a menu,
 *   Up/Down move item highlight, Escape dismisses, and typeahead matches item
 *   labels — the full WAI-ARIA menubar keyboard pattern (WCAG 2.1.1).
 * - Open/highlight state is exposed through Base UI's own data attributes
 *   (`data-popup-open`, `data-highlighted`, `data-checked`, `data-disabled`),
 *   which is also what the styling below keys off — NOT Radix's
 *   `data-[state=open]` names, which do not exist in Base UI.
 *
 * Departures from the nswds-app source:
 * - Radix `MenubarPrimitive.*` → `@base-ui/react/menubar` + `@base-ui/react/menu`.
 *   Base UI has no per-menubar `Content` part; `MenubarContent` composes
 *   Portal → Positioner → Popup and keeps the shadcn-compatible flat prop
 *   surface (`align`, `alignOffset`, `side`, `sideOffset`).
 * - The dark-mode halo uses `primary-200/10` (the source's light-on-dark
 *   pairing, tokenized) — `primary-800/10` is invisible on dark surfaces.
 * - `data-inset` / `data-variant` are written present-or-absent (house
 *   convention, see header.tsx) so bare `data-inset:` Tailwind variants can't
 *   mis-match a rendered `data-inset="false"`.
 */
function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot='menubar'
      className={cn(
        'flex h-9 items-center gap-1 rounded-sm border border-border bg-background p-1 text-foreground shadow-xs',
        className,
      )}
      {...props}
    />
  )
}

/**
 * One menu inside the bar. Renders no element of its own (Base UI
 * `Menu.Root` is a context provider), so it carries no `data-slot`.
 */
function MenubarMenu(props: Menu.Root.Props) {
  return <Menu.Root {...props} />
}

/** Groups related items. Purely structural; label it with `MenubarLabel`. */
function MenubarGroup({ ...props }: Menu.Group.Props) {
  return <Menu.Group data-slot='menubar-group' {...props} />
}

/**
 * Portal passthrough, kept for shadcn API compatibility. `MenubarContent`
 * already portals its popup — reach for this only when building a custom
 * positioner out of raw parts.
 */
function MenubarPortal(props: Menu.Portal.Props) {
  return <Menu.Portal {...props} />
}

/** Groups radio items into a single-select set. */
function MenubarRadioGroup({ ...props }: Menu.RadioGroup.Props) {
  return <Menu.RadioGroup data-slot='menubar-radio-group' {...props} />
}

/**
 * The button that opens one menu. Keyboard focus and the open state paint the
 * same halo — a 10% ink wash over the bar surface, mirroring the nswds-app
 * treatment — via `focus:` and Base UI's `data-popup-open` attribute.
 */
function MenubarTrigger({ className, ...props }: Menu.Trigger.Props) {
  return (
    <Menu.Trigger
      data-slot='menubar-trigger'
      className={cn(
        'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none',
        // Focus + open halo. Deliberately `focus:` (not `focus-visible:`) —
        // in a menubar the roving focus IS the selection state, so it must
        // paint for pointer interactions too, matching the source.
        'focus:bg-primary-800/10 focus:text-accent-foreground dark:focus:bg-primary-200/10',
        'data-popup-open:bg-primary-800/10 data-popup-open:text-accent-foreground dark:data-popup-open:bg-primary-200/10',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

type MenubarContentProps = Menu.Popup.Props &
  Pick<Menu.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>

/**
 * The dropdown panel for one menu: Portal → Positioner → Popup on the house
 * popup surface (see popover.tsx). Positioning props are lifted onto this
 * component so the call-site stays shadcn-flat; defaults match the source
 * (start-aligned, nudged 4px left, 8px below the bar).
 *
 * Open/close motion keys off Base UI's `data-open` / `data-closed` and the
 * Positioner's `data-side`, and is suppressed for reduced-motion users
 * (WCAG 2.3.3).
 */
function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  side,
  sideOffset = 8,
  ...props
}: MenubarContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className='isolate z-50'
      >
        <Menu.Popup
          data-slot='menubar-content'
          className={cn(
            'z-50 min-w-48 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden',
            'duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'motion-reduce:animate-none',
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

type MenubarItemProps = Menu.Item.Props & {
  /** Indent the item to align with checkbox/radio item labels. */
  inset?: boolean
  /** `destructive` renders in the danger ink for irreversible actions. */
  variant?: 'default' | 'destructive'
}

/**
 * A single action in a menu. Highlight (keyboard roving focus AND pointer
 * hover — Base UI unifies both as `data-highlighted`) paints the same 10% ink
 * halo as the trigger; the `destructive` variant swaps to the danger token so
 * delete-style actions read as such without a raw palette value.
 */
function MenubarItem({ className, inset, variant = 'default', ...props }: MenubarItemProps) {
  return (
    <Menu.Item
      data-slot='menubar-item'
      data-inset={inset ? '' : undefined}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-primary-800/10 data-highlighted:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 data-[variant=destructive]:data-highlighted:text-destructive dark:data-highlighted:bg-primary-200/10 dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive",
        className,
      )}
      {...props}
    />
  )
}

/**
 * A menu item that toggles a setting. The tick indicator only mounts while
 * checked (Base UI `CheckboxItemIndicator`), and the item stays open on
 * activation (`closeOnClick` defaults to `false` upstream) so several options
 * can be toggled in one visit. State is exposed as `data-checked` /
 * `data-unchecked` and announced via `aria-checked`.
 */
function MenubarCheckboxItem({ className, children, checked, ...props }: Menu.CheckboxItem.Props) {
  return (
    <Menu.CheckboxItem
      data-slot='menubar-checkbox-item'
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-highlighted:bg-primary-800/10 data-highlighted:text-accent-foreground dark:data-highlighted:bg-primary-200/10 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        <Menu.CheckboxItemIndicator data-slot='menubar-checkbox-item-indicator'>
          {/* Decorative: the state is already announced via aria-checked, and
              the generated icon components do not self-hide. */}
          <IconCheck aria-hidden='true' className='size-4' />
        </Menu.CheckboxItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  )
}

/**
 * A menu item in a `MenubarRadioGroup` single-select set. The dot indicator
 * mounts only while selected; selection is announced via `aria-checked`
 * within the group.
 */
function MenubarRadioItem({ className, children, ...props }: Menu.RadioItem.Props) {
  return (
    <Menu.RadioItem
      data-slot='menubar-radio-item'
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-highlighted:bg-primary-800/10 data-highlighted:text-accent-foreground dark:data-highlighted:bg-primary-200/10 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        <Menu.RadioItemIndicator data-slot='menubar-radio-item-indicator'>
          {/* Decorative: selection is already announced via aria-checked, and
              the generated icon components do not self-hide. */}
          <IconCircle aria-hidden='true' className='size-2 fill-current' />
        </Menu.RadioItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  )
}

type MenubarLabelProps = Menu.GroupLabel.Props & {
  /** Indent the label to align with checkbox/radio item labels. */
  inset?: boolean
}

/**
 * A non-interactive heading for a group of items. Base UI's `GroupLabel`
 * associates it with its parent `MenubarGroup` via `aria-labelledby`, so
 * screen readers announce the group name — never use a plain styled div for
 * this.
 */
function MenubarLabel({ className, inset, ...props }: MenubarLabelProps) {
  return (
    <Menu.GroupLabel
      data-slot='menubar-label'
      data-inset={inset ? '' : undefined}
      className={cn('px-2 py-1.5 text-sm font-medium data-inset:pl-8', className)}
      {...props}
    />
  )
}

/** A visual and semantic (`role="separator"`) divider between item groups. */
function MenubarSeparator({ className, ...props }: Menu.Separator.Props) {
  return (
    <Menu.Separator
      data-slot='menubar-separator'
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

/**
 * Right-aligned keyboard-shortcut hint inside an item. Purely visual — it
 * does NOT register the shortcut; wire the actual key handling in the app.
 */
function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot='menubar-shortcut'
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
}

/**
 * Groups the parts of a nested submenu. Like `MenubarMenu`, renders no
 * element of its own.
 */
function MenubarSub(props: Menu.SubmenuRoot.Props) {
  return <Menu.SubmenuRoot {...props} />
}

type MenubarSubTriggerProps = Menu.SubmenuTrigger.Props & {
  /** Indent the trigger to align with checkbox/radio item labels. */
  inset?: boolean
}

/**
 * An item that opens a nested submenu (hover, click, or Right arrow — all
 * Base UI behaviour). Shows a trailing chevron affordance and holds its halo
 * while the submenu is open via `data-popup-open`.
 */
function MenubarSubTrigger({ className, inset, children, ...props }: MenubarSubTriggerProps) {
  return (
    <Menu.SubmenuTrigger
      data-slot='menubar-sub-trigger'
      data-inset={inset ? '' : undefined}
      className={cn(
        'flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-primary-800/10 data-highlighted:text-accent-foreground data-inset:pl-8 data-popup-open:bg-primary-800/10 data-popup-open:text-accent-foreground dark:data-highlighted:bg-primary-200/10 dark:data-popup-open:bg-primary-200/10 data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      {/* Decorative: the open state is already announced via aria-expanded,
          and the generated icon components do not self-hide. */}
      <IconChevronRight aria-hidden='true' data-slot='icon' className='ml-auto size-4' />
    </Menu.SubmenuTrigger>
  )
}

type MenubarSubContentProps = Menu.Popup.Props &
  Pick<Menu.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>

/**
 * The panel of a nested submenu. Positioning props are left undefined by
 * default so Base UI's nested-menu defaults apply (opens toward
 * `inline-end`, flipping automatically near the viewport edge — which the
 * Radix source could not do without explicit config).
 */
function MenubarSubContent({
  className,
  align,
  alignOffset,
  side,
  sideOffset,
  ...props
}: MenubarSubContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className='isolate z-50'
      >
        <Menu.Popup
          data-slot='menubar-sub-content'
          className={cn(
            'z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 outline-hidden',
            'duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'motion-reduce:animate-none',
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
export type {
  MenubarContentProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarSubContentProps,
  MenubarSubTriggerProps,
}

'use client'

import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { useIsMobile } from '../hooks/use-is-mobile.js'
import { IconDockToLeft } from '../icons/dock-to-left.js'
import { cn } from '../lib/utils.js'

import { Button } from './button.js'
import { Input } from './input.js'
import { Link } from './link.js'
import { Separator } from './separator.js'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet.js'
import { Skeleton } from './skeleton.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

/**
 * Read the sidebar state from context. Throws outside a `SidebarProvider` so
 * a misplaced part fails loudly instead of rendering a broken shell.
 */
function useSidebar(): SidebarContextProps {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

type SidebarProviderProps = React.ComponentProps<'div'> & {
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Controlled open state — pair with `onOpenChange`. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Key for the Cmd/Ctrl toggle shortcut. Defaults to `'b'` (Cmd+B / Ctrl+B).
   * Pass `null` to disable the shortcut entirely — do this when the host app
   * already binds the combination, rather than letting two handlers race.
   */
  shortcutKey?: string | null
}

/**
 * State container for the application-shell sidebar.
 *
 * Owns the open/collapsed state (desktop) and the Sheet takeover state
 * (mobile), exposes both via `useSidebar`, and provides the `--sidebar-width`
 * / `--sidebar-width-icon` custom properties every descendant sizes against.
 *
 * Persistence: each state change is written to a `sidebar_state` cookie
 * (`path=/; max-age=7d; SameSite=Lax; Secure` on https) so server-rendered
 * apps can read the cookie and pass `defaultOpen` to avoid a flash of the
 * wrong state.
 * This is a plain `document.cookie` write for a functional preference. It
 * happens in controlled mode too (`open` + `onOpenChange`), so controlling
 * the state swaps the source of truth but does not suppress the cookie —
 * apps that must not set any cookie should take this component through the
 * registry channel and remove the write.
 *
 * Keyboard: Cmd/Ctrl+B toggles the sidebar (see `shortcutKey`). This is a
 * global `window` listener; it never fires without a modifier so it cannot
 * shadow typing — SC 2.1.4 (Character Key Shortcuts) is satisfied because
 * the shortcut requires a modifier key.
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  shortcutKey = SIDEBAR_KEYBOARD_SHORTCUT,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // Internal state; openProp/setOpenProp take over when controlled.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // Persist so SSR apps can read the cookie and set `defaultOpen`.
      // `Secure` only on https: browsers silently drop a Secure cookie set
      // from an insecure origin, which would break persistence on the
      // plain-http intranet hosts internal tooling still runs on.
      if (typeof document !== 'undefined') {
        const secure = window.location.protocol === 'https:' ? '; Secure' : ''
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${encodeURIComponent(String(openState))}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax${secure}`
      }
    },
    [setOpenProp, open],
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Cmd/Ctrl+<shortcutKey> toggles; `null` disables.
  React.useEffect(() => {
    if (shortcutKey === null) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Mirrors site-search's guard: AltGr layouts report ctrlKey+altKey
      // while typing ordinary characters, and an editor's own Cmd/Ctrl+B
      // (bold) must win when it preventDefaults first.
      if (
        event.key === shortcutKey &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.defaultPrevented
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar, shortcutKey])

  // Exposed as data-state="expanded|collapsed" for Tailwind targeting.
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider>
        <div
          data-slot='sidebar-wrapper'
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

type SidebarProps = React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}

/**
 * The sidebar surface itself.
 *
 * Three renders depending on context: `collapsible="none"` is a plain
 * in-flow column; mobile viewports get a Sheet takeover (Base UI Dialog under
 * the hood — focus trap, Esc-to-close and aria-modal come from the
 * primitive); desktop gets a fixed panel plus an in-flow "gap" element that
 * reserves layout width, both animating between `--sidebar-width` and the
 * collapsed target. `variant` picks the chrome (flush `sidebar`, bordered
 * `floating` card, `inset` with a raised content area); `collapsible` picks
 * the collapsed form (`offcanvas` slides away, `icon` narrows to
 * `--sidebar-width-icon`).
 *
 * Accessibility contract: the desktop panel is a `<div>`, not `<nav>` or
 * `<aside>` — the sidebar routinely *contains* a `<nav>` (via `SidebarMenu`
 * consumers) alongside search and actions, and nesting landmarks here would
 * double-announce. The mobile Sheet carries a visually-hidden title and
 * description so SC 2.4.6 / 1.3.1 are met for the dialog.
 *
 * Offcanvas-collapsed is off-viewport, not off-DOM: the inner content div
 * gets `inert` so its controls stop being tab-reachable and AT-perceivable
 * behind the visible page (the browser blurs focus out of a subtree the
 * moment it becomes inert, so collapsing can never strand focus off-screen).
 * `inert` lands on the inner div only — direct `SidebarRail` children are
 * lifted out beside it, because the rail is the pointer affordance that
 * reopens the sidebar and must stay clickable while everything else sleeps.
 * A rail wrapped in an intermediate component cannot be lifted and would go
 * inert with the content, so keep `SidebarRail` a direct child.
 *
 * Departure from the nswds-app source: the mobile Sheet hides its built-in
 * close button via the `showCloseButton` prop instead of the
 * `[&>button]:hidden` selector hack — same result, no reliance on DOM order.
 */
function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        data-slot='sidebar'
        className={cn(
          'flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          data-sidebar='sidebar'
          data-slot='sidebar'
          data-mobile='true'
          showCloseButton={false}
          className={cn(
            // SheetContent bakes in data-[side]-prefixed width caps (w-3/4,
            // sm:max-w-sm) that beat a plain `w-(--sidebar-width)` on
            // attribute-variant specificity — and tailwind-merge only dedupes
            // classes sharing the same variant prefix — so the 18rem override
            // must carry the identical prefixes to actually win.
            'data-[side=left]:w-(--sidebar-width) data-[side=right]:w-(--sidebar-width) data-[side=left]:sm:max-w-(--sidebar-width) data-[side=right]:sm:max-w-(--sidebar-width)',
            'bg-sidebar p-0 text-sidebar-foreground',
            className,
          )}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
          {...props}
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Split direct SidebarRail children out of the content that goes inert
  // when offcanvas-collapsed — the rail reopens the sidebar, so it must sit
  // beside the inner div, not inside it (see the inert note above).
  const childArray = React.Children.toArray(children)
  const isRail = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === SidebarRail
  const railChildren = childArray.filter(isRail)
  const contentChildren = childArray.filter((child) => !isRail(child))

  return (
    <div
      className='group peer hidden text-sidebar-foreground md:block'
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot='sidebar'
    >
      {/* In-flow gap: reserves the sidebar's width so SidebarInset lays out
          beside the fixed panel, and animates that width on collapse. */}
      <div
        data-slot='sidebar-gap'
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear motion-reduce:transition-none',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        data-slot='sidebar-container'
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear motion-reduce:transition-none md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Padding differs for the floating/inset chrome.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar='sidebar'
          data-slot='sidebar-inner'
          inert={(state === 'collapsed' && collapsible === 'offcanvas') || undefined}
          className='flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-sm group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm'
        >
          {contentChildren}
        </div>
        {/* Absolutely positioned against the container either way, so lifting
            the rail out of the inner div changes nothing visually. */}
        {railChildren}
      </div>
    </div>
  )
}

type SidebarTriggerProps = React.ComponentProps<typeof Button>

/**
 * Icon button that toggles the sidebar (desktop collapse or mobile Sheet).
 *
 * Renders through the house `Button` (`ghost`/`grey`/`icon`) with the
 * dock-to-left glyph. Carries a default `aria-label="Toggle sidebar"` —
 * override it, don't remove it: an icon-only control must have an accessible
 * name (SC 4.1.2). Departure from the nswds-app source: the label is an
 * `aria-label` rather than an `sr-only` span, matching the house icon-button
 * convention in `button.tsx`.
 *
 * State is conveyed via `aria-expanded` (tracking whichever surface this
 * viewport controls) plus `aria-haspopup="dialog"` on mobile, where the
 * trigger opens the Sheet dialog. Possible follow-up: compose through
 * `SheetTrigger` on mobile so Base UI wires the trigger↔dialog relationship
 * (aria-controls, focus return) itself instead of these manual attributes.
 */
function SidebarTrigger({
  className,
  onClick,
  'aria-label': ariaLabel = 'Toggle sidebar',
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar, isMobile, open, openMobile } = useSidebar()

  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant='ghost'
      color='grey'
      size='icon'
      aria-label={ariaLabel}
      aria-expanded={isMobile ? openMobile : open}
      aria-haspopup={isMobile ? 'dialog' : undefined}
      leadingVisual={IconDockToLeft}
      className={className}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    />
  )
}

type SidebarRailProps = React.ComponentProps<'button'>

/**
 * Invisible grab strip along the sidebar edge that toggles on click.
 *
 * A convenience duplicate of `SidebarTrigger` for mouse users, so it is
 * deliberately removed from the tab order (`tabIndex={-1}`) — keyboard and AT
 * users already have the labelled trigger, and a second stop on an invisible
 * control would only add noise. It keeps `aria-label`/`title` so it is not a
 * nameless button for AT users who do reach it by other means.
 */
function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar='rail'
      data-slot='sidebar-rail'
      aria-label='Toggle sidebar'
      tabIndex={-1}
      onClick={toggleSidebar}
      title='Toggle sidebar'
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border motion-reduce:transition-none sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  )
}

type SidebarInsetProps = React.ComponentProps<'main'>

/**
 * The main content area beside the sidebar.
 *
 * Renders a `<main>` landmark. With `variant="inset"` on the sibling
 * `Sidebar` it becomes the raised, rounded card the inset look is named for.
 * Departure from the nswds-app source: the inset card uses `rounded-lg`
 * (16px token) instead of `rounded-xl` — the house radius scale is
 * none/sm/md/lg/pill and `rounded-xl` has no token behind it.
 */
function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return (
    <main
      data-slot='sidebar-inset'
      className={cn(
        'relative flex w-full flex-1 flex-col bg-background',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      {...props}
    />
  )
}

type SidebarInputProps = React.ComponentProps<typeof Input>

/** House `Input` restyled for the sidebar surface (shorter, shadowless). */
function SidebarInput({ className, ...props }: SidebarInputProps) {
  return (
    <Input
      data-slot='sidebar-input'
      data-sidebar='input'
      className={cn('h-8 w-full bg-background shadow-none', className)}
      {...props}
    />
  )
}

type SidebarHeaderProps = React.ComponentProps<'div'>

/** Sticky-top slot of the sidebar column (brand, search, workspace switcher). */
function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot='sidebar-header'
      data-sidebar='header'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

type SidebarFooterProps = React.ComponentProps<'div'>

/** Bottom slot of the sidebar column (user menu, settings). */
function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot='sidebar-footer'
      data-sidebar='footer'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

type SidebarSeparatorProps = React.ComponentProps<typeof Separator>

/** House `Separator` inset to the sidebar padding, on the sidebar border token. */
function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  return (
    <Separator
      data-slot='sidebar-separator'
      data-sidebar='separator'
      className={cn('mx-2 w-auto bg-sidebar-border', className)}
      {...props}
    />
  )
}

type SidebarContentProps = React.ComponentProps<'div'>

/**
 * Scrollable middle of the sidebar column. In icon-collapsed mode overflow is
 * hidden so truncated labels don't paint outside the rail.
 */
function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      data-slot='sidebar-content'
      data-sidebar='content'
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  )
}

type SidebarGroupProps = React.ComponentProps<'div'>

/** Section wrapper inside `SidebarContent`; positions its label and action. */
function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      data-slot='sidebar-group'
      data-sidebar='group'
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  )
}

type SidebarGroupLabelProps = useRender.ComponentProps<'div'>

/**
 * Muted heading for a sidebar group. Fades and collapses out of the way in
 * icon-collapsed mode.
 *
 * API change from the nswds-app source: `asChild` (Radix Slot) is replaced by
 * Base UI's `render` prop — pass `render={<h3 />}` (element or function)
 * instead of `asChild` + child. Classes, data attributes and refs are merged
 * onto the rendered element by `useRender`.
 */
function SidebarGroupLabel({ render, className, ...props }: SidebarGroupLabelProps) {
  return useRender({
    render,
    defaultTagName: 'div',
    props: {
      'data-slot': 'sidebar-group-label',
      'data-sidebar': 'group-label',
      className: cn(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      ),
      ...props,
    },
  })
}

type SidebarGroupActionProps = useRender.ComponentProps<'button'>

/**
 * Small icon action in a group header's top-right corner (e.g. "add item").
 * Hidden in icon-collapsed mode. Icon-only: give it an accessible name.
 *
 * API change from the nswds-app source: `asChild` is replaced by Base UI's
 * `render` prop — `render={<a href="…" />}` instead of `asChild` + child.
 */
function SidebarGroupAction({ render, className, ...props }: SidebarGroupActionProps) {
  return useRender({
    render,
    defaultTagName: 'button',
    props: {
      'data-slot': 'sidebar-group-action',
      'data-sidebar': 'group-action',
      className: cn(
        'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0',
        // Expanded hit area on touch viewports: w-5 (20px) + 12px each side
        // = 44px, the SC 2.5.5 (AAA) target — AA's SC 2.5.8 only asks 24px.
        'after:absolute after:-inset-3 md:after:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      ),
      ...props,
    },
  })
}

type SidebarGroupContentProps = React.ComponentProps<'div'>

/** Body of a sidebar group — usually wraps a `SidebarMenu`. */
function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return (
    <div
      data-slot='sidebar-group-content'
      data-sidebar='group-content'
      className={cn('w-full text-sm', className)}
      {...props}
    />
  )
}

type SidebarMenuProps = React.ComponentProps<'ul'>

/**
 * Menu list (`<ul>`). Not a `menu`/`menubar` widget on purpose: sidebar items
 * are plain links/buttons navigated with Tab, so list semantics are the
 * correct, least-surprising structure for AT users. Wrap in `<nav>` at the
 * consumer level when the group is site navigation.
 */
function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <ul
      data-slot='sidebar-menu'
      data-sidebar='menu'
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  )
}

type SidebarMenuItemProps = React.ComponentProps<'li'>

/** Menu row (`<li>`); anchors `SidebarMenuAction` / `SidebarMenuBadge`. */
function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground motion-reduce:transition-none data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type SidebarMenuButtonProps = useRender.ComponentProps<'button'> & {
  /** Marks the item as the current one (`data-active` styling hook). */
  isActive?: boolean
  /**
   * Tooltip shown only while the sidebar is icon-collapsed on desktop — the
   * moment labels are hidden and the icon needs a name. String shorthand or
   * full `TooltipContent` props.
   */
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>

/**
 * The main interactive row of a sidebar menu.
 *
 * API change from the nswds-app source: `asChild` (Radix Slot) is replaced by
 * Base UI's `render` prop. For navigation items, render through the house
 * `Link` so a framework link from `LinkProvider` is used:
 * `render={<Link variant="unstyled" href="/inbox" />}`. When it *is*
 * navigation, also pass `aria-current="page"` on the active item — this
 * component only sets the visual `data-active` hook, because it cannot know
 * whether it is a link or a plain action button.
 *
 * The collapsed-state tooltip is composed from the house Base UI Tooltip.
 * Departure from the shadcn original: instead of passing `hidden` to the
 * tooltip content (the HTML `hidden` attribute loses to the popup's own
 * `display` classes under Tailwind), the content is simply not rendered
 * unless the sidebar is icon-collapsed on desktop. The trigger wrapper stays
 * mounted either way, so focus is never lost on toggle.
 */
function SidebarMenuButton({
  render,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar()

  const button = useRender({
    render,
    defaultTagName: 'button',
    props: {
      'data-slot': 'sidebar-menu-button',
      'data-sidebar': 'menu-button',
      'data-size': size,
      // Present-or-absent, per house convention: `false` would still match
      // bare [data-active] selectors and read as truthy in the DOM.
      'data-active': isActive || undefined,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props,
    },
  })

  if (!tooltip) {
    return button
  }

  const tooltipProps = typeof tooltip === 'string' ? { children: tooltip } : tooltip

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      {state === 'collapsed' && !isMobile ? (
        <TooltipContent side='right' align='center' {...tooltipProps} />
      ) : null}
    </Tooltip>
  )
}

type SidebarMenuActionProps = useRender.ComponentProps<'button'> & {
  /**
   * Fade the action in only on row hover/focus (desktop). It stays in the
   * tab order and becomes fully visible on keyboard focus, so hiding is
   * visual-only — no SC 2.1.1 impact.
   */
  showOnHover?: boolean
}

/**
 * Secondary icon action pinned to a menu row's trailing edge (e.g. "more").
 * Icon-only: give it an accessible name. Hidden in icon-collapsed mode.
 *
 * API change from the nswds-app source: `asChild` is replaced by Base UI's
 * `render` prop — `render={<a href="…" />}` instead of `asChild` + child.
 */
function SidebarMenuAction({
  render,
  className,
  showOnHover = false,
  ...props
}: SidebarMenuActionProps) {
  return useRender({
    render,
    defaultTagName: 'button',
    props: {
      'data-slot': 'sidebar-menu-action',
      'data-sidebar': 'menu-action',
      className: cn(
        'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0',
        // Expanded hit area on touch viewports: w-5 (20px) + 12px each side
        // = 44px, the SC 2.5.5 (AAA) target — AA's SC 2.5.8 only asks 24px.
        'after:absolute after:-inset-3 md:after:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
        className,
      ),
      ...props,
    },
  })
}

type SidebarMenuBadgeProps = React.ComponentProps<'div'>

/**
 * Count/status badge on a menu row's trailing edge. Pointer-transparent and
 * unselectable; purely visual. If the count matters to AT users, put it in
 * the row's accessible name too (e.g. `aria-label="Inbox, 3 unread"`).
 */
function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  return (
    <div
      data-slot='sidebar-menu-badge'
      data-sidebar='menu-badge'
      className={cn(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none',
        'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-active/menu-button:text-sidebar-accent-foreground',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}

type SidebarMenuSkeletonProps = React.ComponentProps<'div'> & {
  /** Also render a square icon placeholder before the text bar. */
  showIcon?: boolean
}

/**
 * Placeholder menu row while items load. Composes `Skeleton`.
 *
 * Departure from the nswds-app source: the text bar's varied width
 * (50–90%) is derived from `React.useId()` instead of `Math.random()`.
 * `useId` is stable across server and client for the same tree position, so
 * the width no longer mismatches on hydration — same organic look, no
 * hydration warning and no need to gate behind a mounted flag.
 */
function SidebarMenuSkeleton({ className, showIcon = false, ...props }: SidebarMenuSkeletonProps) {
  const id = React.useId()

  // Deterministic hash of the useId → a width in [50%, 90%].
  const width = React.useMemo(() => {
    let hash = 0
    for (let index = 0; index < id.length; index++) {
      hash = (hash * 31 + id.charCodeAt(index)) | 0
    }
    return `${(Math.abs(hash) % 41) + 50}%`
  }, [id])

  return (
    <div
      data-slot='sidebar-menu-skeleton'
      data-sidebar='menu-skeleton'
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      {...props}
    >
      {showIcon && <Skeleton className='size-4 rounded-md' data-sidebar='menu-skeleton-icon' />}
      <Skeleton
        className='h-4 max-w-(--skeleton-width) flex-1'
        data-sidebar='menu-skeleton-text'
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

type SidebarMenuSubProps = React.ComponentProps<'ul'>

/** Nested menu list, indented under a parent row. Hidden in icon mode. */
function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return (
    <ul
      data-slot='sidebar-menu-sub'
      data-sidebar='menu-sub'
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}

type SidebarMenuSubItemProps = React.ComponentProps<'li'>

/** Nested menu row (`<li>`). */
function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  return (
    <li
      data-slot='sidebar-menu-sub-item'
      data-sidebar='menu-sub-item'
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  )
}

type SidebarMenuSubButtonProps = useRender.ComponentProps<'a'> & {
  size?: 'sm' | 'md'
  /** Marks the current item; also sets `aria-current="page"`. */
  isActive?: boolean
}

/**
 * Link row inside a nested menu.
 *
 * API change from the nswds-app source: `asChild` is replaced by Base UI's
 * `render` prop. When `href` is given and no `render` is supplied, this
 * renders through the house `Link` (`variant="unstyled"`) so a framework
 * link injected via `LinkProvider` (e.g. next/link) is used automatically —
 * the nswds-app version needed `asChild` + `<NextLink>` at every call site.
 * Without an `href` it falls back to a bare `<a>` exactly like the source.
 *
 * When `isActive`, `aria-current="page"` is set alongside the visual
 * `data-active` hook so AT users hear which item is current (SC 4.1.2) — an
 * addition over the source, which styled the active row but never announced
 * it.
 */
function SidebarMenuSubButton({
  render,
  size = 'md',
  isActive = false,
  className,
  href,
  ...props
}: SidebarMenuSubButtonProps) {
  const resolvedRender =
    render ?? (href !== undefined ? <Link variant='unstyled' href={href} /> : undefined)

  return useRender({
    render: resolvedRender,
    defaultTagName: 'a',
    props: {
      'data-slot': 'sidebar-menu-sub-button',
      'data-sidebar': 'menu-sub-button',
      'data-size': size,
      // Present-or-absent, per house convention: `false` would still match
      // bare [data-active] selectors and read as truthy in the DOM.
      'data-active': isActive || undefined,
      'aria-current': isActive ? 'page' : undefined,
      href,
      className: cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
        'data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className,
      ),
      ...props,
    },
  })
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
export type {
  SidebarContentProps,
  SidebarContextProps,
  SidebarFooterProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInputProps,
  SidebarInsetProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubButtonProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
}

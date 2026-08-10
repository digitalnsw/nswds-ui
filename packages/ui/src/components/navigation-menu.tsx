'use client'

import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu'
import { cva } from 'class-variance-authority'
import type * as React from 'react'

import { IconKeyboardArrowDown } from '../icons/keyboard-arrow-down.js'
import { cn } from '../lib/utils.js'

import { Link, type LinkProps } from '../components/link.js'

// ─── Shared motion + ink tokens ───────────────────────────────────────────────

// One easing curve — ease-[cubic-bezier(0.22,1,0.36,1)] — is written literally
// on every animated part (positioner glide, popup resize, content cross-fade,
// chevron flip) so the menu reads as a single surface in motion, not four
// independent animations. It is Base UI's documented nav-menu curve: a strong
// ease-out that settles without overshoot. Written out per-use rather than
// composed from a shared const so every class stays a literal for Tailwind's
// source-text scanner.

// Every interactive tint in the menu derives from a single --nav-menu-ink
// token via color-mix, mirroring the --footer-ink / --link-color pattern
// (see footer.tsx, link.tsx): a restyle only has to swap the one ink value and
// the resting/active halos follow. The derivations are written literally
// (not template-built) because Tailwind scans source text for class names —
// a computed string would never be emitted.
//
// Ink values use the RAW masterbrand tokens (--primary-800 / --primary-200)
// rather than Tailwind's --color-* bridge aliases: Tailwind v4 tree-shakes
// unreferenced @theme keys, and a reference from inside an arbitrary property
// is not a usage signal. The raw tokens are plain :root declarations from
// @nswds/tokens and always resolve.
const navigationMenuInk = [
  '[--nav-menu-ink:var(--primary-800)] dark:[--nav-menu-ink:var(--primary-200)]',
  '[--nav-menu-halo:color-mix(in_oklch,var(--nav-menu-ink)_10%,transparent)]',
  '[--nav-menu-halo-active:color-mix(in_oklch,var(--nav-menu-ink)_18%,transparent)]',
]

// ─── Trigger styling (exported for reuse) ─────────────────────────────────────

/**
 * Trigger chrome, exported as a cva so siblings (e.g. a main-nav pattern) and
 * plain links that should sit visually beside triggers can reuse or extend it —
 * the app source's `Contact` item renders an `<a>` with exactly these classes.
 *
 * The 10% ink halo marks hover/open and the 18% mix marks pressed; both are
 * backgrounds behind unchanged text, so text contrast is untouched. The
 * keyboard focus indicator is a 2px outline in the ink colour itself
 * (primary-800 on light surfaces, primary-200 in dark mode) — well above the
 * 3:1 non-text contrast minimum of WCAG 2.2 SC 1.4.11 against the white/dark
 * popover surfaces, and offset so it is never obscured (SC 2.4.7, 2.4.11).
 */
const navigationMenuTriggerVariants = cva([
  ...navigationMenuInk,
  // Layout — h-9 keeps the row compact; the halo box is the pointer target.
  // mb-2 pairs with the list's bottom hairline, matching the app source.
  'group mb-2 inline-flex h-9 w-max cursor-pointer items-center justify-center gap-1 rounded-sm px-4 py-2 text-sm font-medium whitespace-nowrap select-none',
  'bg-transparent text-foreground',
  'transition-colors motion-reduce:transition-none',
  // Resting halo on hover/focus/open. `focus:` (not focus-visible) is
  // deliberate for the tint — like Button, triggers give click feedback —
  // while the *outline* below stays keyboard-only.
  'hover:bg-(--nav-menu-halo) focus:bg-(--nav-menu-halo) active:bg-(--nav-menu-halo-active)',
  // Base UI marks the trigger whose popup is open with data-popup-open.
  'data-popup-open:bg-(--nav-menu-halo)',
  'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nav-menu-ink)',
  'disabled:pointer-events-none disabled:opacity-50',
])

// ─── Root ─────────────────────────────────────────────────────────────────────

type NavigationMenuProps = Omit<NavigationMenuPrimitive.Root.Props, 'className'> &
  Pick<
    NavigationMenuPrimitive.Positioner.Props,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'collisionPadding' | 'collisionAvoidance'
  > & {
    className?: string
    /** Extra classes for the shared popup surface (sizing, width caps, …). */
    popupClassName?: string
    /**
     * Inline styles for the shared popup surface. The popup normally sizes
     * itself from Base UI's `--popup-width`/`--popup-height`, which are
     * measured ONCE when a section activates — geometry that must track
     * something that can change while the menu is open (MainNav's
     * container-width panels, say) goes stale there. An inline style wins
     * over the measured vars and stays reactive to re-renders.
     */
    popupStyle?: React.CSSProperties
  }

/**
 * Top-level navigation menu — a menubar of triggers whose panels open into one
 * shared, animated popup.
 *
 * INTERNAL to MainNav — not exported from the package barrel, not a registry
 * item, no stories. It began as a public generic wrapper but was pulled from
 * the public API: bare primitive wrappers are not the nswds-ui style (the
 * design system publishes NSW-branded components, not shadcn-alikes), and
 * MainNav is the supported way to get this behaviour. The file ships inside
 * the main-nav registry item, and the module remains reachable through the
 * package's undocumented `components/navigation-menu` export subpath purely
 * as a build artefact — treat that as private API with no stability promise.
 * (The package name is deliberately not written out here: this comment ships
 * in registry content, and the alias-leak guard rejects any occurrence of the
 * package-prefixed import form.)
 *
 * Consumers only write `List > Item > (Trigger + Content)` pairs; the popup
 * plumbing Base UI requires (Portal → Positioner → Popup → Viewport, rendered
 * once at root level, into which every `Content` teleports) is composed here so
 * it cannot be assembled wrong. Positioning knobs (`side`, `sideOffset`,
 * `align`, `collisionPadding`, `collisionAvoidance`) pass through to the
 * internal Positioner.
 *
 * Accessibility is inherited from Base UI: the root renders a `<nav>` landmark
 * (pass `aria-label` when a page has more than one), triggers are real buttons
 * wired with `aria-expanded`/`aria-controls`, ArrowDown/Enter open from the
 * keyboard, arrow keys move along the list, and Escape or focus-out closes
 * (WAI-ARIA disclosure navigation pattern). Do not add ARIA by hand.
 *
 * Departure from the nswds-app source: that wrapper was Radix-based with an
 * optional inline viewport (`viewport` prop); Base UI's model has exactly one
 * viewport, so the prop is gone. Radix's `delayDuration`/`skipDelayDuration`
 * map to Base UI's `delay`/`closeDelay` (both default 50ms).
 */
function NavigationMenu({
  className,
  children,
  side,
  sideOffset = 8,
  align,
  alignOffset,
  // Keep a gutter between the popup and the viewport edge on small screens.
  collisionPadding = 20,
  // Nav panels should never flip beside their menubar — cap size instead.
  collisionAvoidance = { side: 'none' },
  popupClassName,
  popupStyle,
  ...props
}: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot='navigation-menu'
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner
          data-slot='navigation-menu-positioner'
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          collisionAvoidance={collisionAvoidance}
          className={cn(
            // Base UI reports its measured geometry through these vars; sizing
            // the box from them lets top/left glide between triggers.
            'isolate z-50 box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)]',
            'transition-[top,left,right,bottom] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            // data-instant: Base UI disables the glide (e.g. keyboard re-anchor).
            'data-instant:transition-none motion-reduce:transition-none',
          )}
        >
          <NavigationMenuPrimitive.Popup
            data-slot='navigation-menu-popup'
            className={cn(
              // House popup surface (see popover.tsx / sheet.tsx).
              'relative rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10',
              // Width/height track the active Content's size (Base UI measures
              // it into --popup-*), so switching sections morphs the surface
              // instead of jump-cutting.
              'h-[var(--popup-height)] w-[var(--popup-width)] max-w-[var(--available-width)] origin-(--transform-origin)',
              'transition-[opacity,transform,width,height,scale,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              // Open/close via Base UI transition attributes.
              'data-starting-style:scale-95 data-starting-style:opacity-0',
              'data-ending-style:scale-95 data-ending-style:opacity-0',
              popupClassName,
            )}
            style={popupStyle}
          >
            <NavigationMenuPrimitive.Viewport
              data-slot='navigation-menu-viewport'
              // Clips the outgoing/incoming Content pair during a section
              // switch; rounded to match the popup so corners don't leak.
              className='relative size-full overflow-hidden rounded-lg'
            />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>
    </NavigationMenuPrimitive.Root>
  )
}

// ─── List / Item ──────────────────────────────────────────────────────────────

type NavigationMenuListProps = Omit<NavigationMenuPrimitive.List.Props, 'className'> & {
  className?: string
}

/**
 * The menubar row of triggers. Base UI renders a `<ul>` and manages roving
 * arrow-key focus between the items.
 *
 * Carries the app source's bottom hairline (tokenised from raw grey utilities
 * to the semantic `border-border`, which already flips for dark mode) and its
 * hidden-scrollbar overflow so a long menu can pan on narrow screens.
 */
function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  return (
    <NavigationMenuPrimitive.List
      data-slot='navigation-menu-list'
      className={cn(
        'group flex flex-1 list-none items-center justify-center gap-1',
        '[scrollbar-width:none] border-b border-border whitespace-nowrap [&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    />
  )
}

type NavigationMenuItemProps = Omit<NavigationMenuPrimitive.Item.Props, 'className'> & {
  className?: string
}

/**
 * One menubar entry (`<li>`), pairing a `NavigationMenuTrigger` with its
 * `NavigationMenuContent` — or holding a bare `NavigationMenuLink` for items
 * with no panel. Pass `value` when controlling the open item programmatically.
 */
function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot='navigation-menu-item'
      className={cn('relative', className)}
      {...props}
    />
  )
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

type NavigationMenuTriggerProps = Omit<NavigationMenuPrimitive.Trigger.Props, 'className'> & {
  className?: string
}

/**
 * Opens the item's panel. Renders a real `<button>` (never an anchor — the
 * trigger discloses content, it doesn't navigate), which Base UI wires with
 * `aria-expanded`/`aria-controls` and hover/click/keyboard open behaviour.
 *
 * The trailing chevron rides Base UI's Icon part, which mirrors the trigger's
 * `data-popup-open` attribute — the 180° flip is pure CSS off that attribute
 * (no JS state), and is suppressed for reduced-motion users (WCAG 2.3.3).
 * The chevron is decorative, so the Icon part is `aria-hidden`: it never
 * enters the button's accessible name, and the open state it hints at is
 * already conveyed programmatically via `aria-expanded` (SC 4.1.2).
 */
function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot='navigation-menu-trigger'
      className={cn(navigationMenuTriggerVariants(), className)}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Icon
        data-slot='navigation-menu-icon'
        aria-hidden='true'
        className='flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-popup-open:rotate-180 motion-reduce:transition-none'
      >
        <IconKeyboardArrowDown className='size-5' />
      </NavigationMenuPrimitive.Icon>
    </NavigationMenuPrimitive.Trigger>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

type NavigationMenuContentProps = Omit<NavigationMenuPrimitive.Content.Props, 'className'> & {
  className?: string
}

/**
 * The panel for one item. Authored inline next to its Trigger, but rendered
 * (teleported by Base UI) into the shared root-level Viewport while active —
 * so panel-to-panel switches cross-fade inside one popup surface.
 *
 * The directional slide keys off `data-activation-direction` (which adjacent
 * trigger the user came from), matching the app source's from-start/from-end
 * motion. Set `keepMounted` to keep the panel in the DOM for SSR crawlers.
 */
function NavigationMenuContent({ className, ...props }: NavigationMenuContentProps) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot='navigation-menu-content'
      className={cn(
        'h-full w-max max-w-[var(--available-width)] p-2',
        'transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
        // Slide with the direction of travel between adjacent triggers.
        'data-starting-style:data-[activation-direction=left]:-translate-x-1/2',
        'data-starting-style:data-[activation-direction=right]:translate-x-1/2',
        'data-ending-style:data-[activation-direction=left]:translate-x-1/2',
        'data-ending-style:data-[activation-direction=right]:-translate-x-1/2',
        className,
      )}
      {...props}
    />
  )
}

// ─── Link ─────────────────────────────────────────────────────────────────────

type NavigationMenuLinkProps = Omit<
  NavigationMenuPrimitive.Link.Props,
  'className' | 'render' | 'href'
> & {
  className?: string
  /**
   * Link target. Accepts the same string-or-UrlObject union as `Link`, since
   * the rendered element may be a framework link injected via `LinkProvider`.
   */
  href: LinkProps['href']
}

/**
 * A navigation link inside (or beside) the menu. Composes the design system's
 * `Link` through Base UI's `render` prop: Base UI keeps the behaviour —
 * roving focus, focus-out closing, `aria-current='page'` when `active`, close
 * on click — while `Link` supplies the element, so a `LinkProvider` framework
 * component (e.g. next/link) is injected automatically. `Link` renders with
 * `variant='unstyled'`; this component owns the visual treatment (same ink
 * halo/outline contract as the trigger — see `navigationMenuTriggerVariants`).
 *
 * Departure from Base UI's default: `closeOnClick` defaults to **true** here.
 * In an SPA a client-side navigation doesn't reload the document, so a menu
 * that stays open after choosing a destination reads as broken; pass
 * `closeOnClick={false}` for in-page links that should keep the panel open.
 *
 * Set `active` for the current page (the app source's `usePathname` check is
 * a framework API this package must not import — compare in the consumer and
 * pass the result down): it sets `aria-current='page'` (WCAG 2.4.8 support)
 * and the persistent halo via `data-active`.
 */
function NavigationMenuLink({
  className,
  href,
  closeOnClick = true,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot='navigation-menu-link'
      closeOnClick={closeOnClick}
      className={cn(
        navigationMenuInk,
        'flex flex-col gap-1 rounded-sm p-2 text-sm text-foreground',
        'transition-colors motion-reduce:transition-none',
        'hover:bg-(--nav-menu-halo) focus:bg-(--nav-menu-halo) active:bg-(--nav-menu-halo-active)',
        // Persistent tint for the current page (`active` prop → data-active).
        'data-active:bg-(--nav-menu-halo)',
        'outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nav-menu-ink)',
        // Unsized inline icons default to text scale and muted ink; explicit
        // size-*/text-* classes on the icon win.
        "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      render={<Link variant='unstyled' href={href} />}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerVariants,
}
export type {
  NavigationMenuContentProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
}

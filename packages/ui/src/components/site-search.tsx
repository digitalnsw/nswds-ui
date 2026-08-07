'use client'

import { Autocomplete } from '@base-ui/react/autocomplete'
import { Dialog } from '@base-ui/react/dialog'
import React from 'react'

import { IconSearch } from '../icons/search.js'
import { cn } from '../lib/utils.js'

import { Button } from '../components/button.js'

/** A single searchable destination. `keywords` extend matching beyond the title. */
type SiteSearchItem = {
  title: string
  href: string
  keywords?: string[]
}

/** A titled section of results, rendered with a muted group heading. */
type SiteSearchGroup = {
  title: string
  items: SiteSearchItem[]
}

type SiteSearchProps = {
  /** The searchable site map, as titled groups of items. */
  groups: SiteSearchGroup[]
  /**
   * Called with the chosen item on click or Enter, after the palette closes.
   * Navigation is the APP's job — call your router here (e.g. next/navigation's
   * `router.push(item.href)`). The design system ships no framework code, so it
   * never navigates itself; this mirrors the DS-wide framework-free rule
   * (see `Link` / `LinkProvider`).
   */
  onSelect: (item: SiteSearchItem) => void
  /** Whether the palette is open. Use when controlled. */
  open?: boolean
  /** Called whenever the palette asks to open or close. */
  onOpenChange?: (open: boolean) => void
  /** Whether the palette is initially open (uncontrolled). */
  defaultOpen?: boolean
  /**
   * Wire the global Cmd/Ctrl-K toggle on `document`, with cleanup on unmount.
   * Defaults to true. Only one shortcut-enabled SiteSearch should be mounted
   * per page, or each press toggles all of them.
   */
  shortcut?: boolean
  /**
   * Accessible name for the palette, applied as `aria-label` to the dialog
   * panel, the search input and the default trigger. Defaults to
   * `'Search site'`. Mirrors ExpandableSearch's `label` prop — localise it
   * rather than hardcoding English into consumers' pages.
   */
  label?: string
  /** Placeholder for the search input. */
  placeholder?: string
  /** Message shown when no items match the query. */
  emptyMessage?: string
  /**
   * The element that opens the palette. Defaults to a ghost icon `Button`
   * named by `label`. Pass an element to replace it (it is composed via
   * Base UI's `render` prop, so it inherits the trigger behaviour and ARIA);
   * pass `null` to render no trigger at all (open via `open` or the shortcut).
   * A non-element node (e.g. a string) becomes the label of the default button.
   */
  trigger?: React.ReactNode
  /**
   * Extra content rendered at the foot of the panel, below the results —
   * e.g. shortcut hints or a "browse all" link.
   */
  children?: React.ReactNode
  /** Extra classes for the centred panel. */
  className?: string
}

/**
 * Cmd/Ctrl-K command-palette site search: a centred modal panel with a
 * filter-as-you-type input over a grouped list of destinations.
 *
 * Ported from nswds-app's `MobileSearch`, rebuilt framework-free: the app
 * version composed cmdk's `Command*` widgets with next/navigation's router;
 * this version composes Base UI's Autocomplete (the combobox/listbox pattern)
 * inside Base UI's Dialog, and hands the chosen item to `onSelect` instead of
 * navigating. The Autocomplete renders in `inline` mode — its input and list
 * sit statically inside the dialog panel with no popup of their own — which is
 * Base UI's documented composition for palettes (it avoids any portal /
 * focus-trap interplay between the two primitives; the always-`open` inline
 * root unmounts with the dialog, so the query and highlight reset on close).
 *
 * Accessibility contract (inherited, not hand-rolled):
 * - Dialog provides the modal behaviour: focus trap, scroll lock, Escape and
 *   backdrop-press dismissal, and focus restoration to the trigger on close.
 *   The panel is named via `aria-label` (WCAG 2.2, 4.1.2).
 * - Autocomplete provides the combobox pattern: the input is announced as a
 *   combobox controlling a listbox, arrow keys move `aria-activedescendant`
 *   highlight while DOM focus stays in the input, Enter activates the
 *   highlighted item, and the empty state is announced politely.
 * - The trigger (default or custom) renders through `Dialog.Trigger`, so it
 *   carries `aria-haspopup="dialog"` / `aria-expanded` automatically.
 * - Result rows are at least 44px tall (2.5.8 Target Size, AAA-sized).
 * - Panel and backdrop transitions honour `prefers-reduced-motion` (2.3.3).
 *
 * Departures from the nswds-app source, beyond the rebuild above:
 * - `groups`/`onSelect` replace the app's `NavigationItem[]` + router: the
 *   data shape is explicit (`title`/`href`/`keywords`) instead of the app's
 *   nav config, and untitled/unlinked entries can't exist by construction
 *   (the source filtered them at render time).
 * - Filtering matches `title` AND `keywords`, case-insensitively, via the
 *   Autocomplete `filter` prop. Base UI's `useFilter` helper only matches one
 *   string per item, so a custom predicate is the documented escape hatch for
 *   multi-field matching; groups with no matching items are dropped by the
 *   primitive, headings included.
 * - The Cmd/Ctrl-K listener can be disabled (`shortcut={false}`) — required
 *   for pages that mount more than one instance. It still toggles, per the
 *   source.
 */
function SiteSearch({
  groups,
  onSelect,
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  shortcut = true,
  label = 'Search site',
  placeholder = 'Type to search across the site...',
  emptyMessage = 'No results found.',
  trigger,
  children,
  className,
}: SiteSearchProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  const inputRef = React.useRef<HTMLInputElement>(null)

  // Latest-value refs so the document-level shortcut listener (bound once per
  // `shortcut` value) never acts on a stale open state or stale callbacks.
  // They are written in a passive effect (not during render, per
  // react-hooks/refs) — safe because they are only read from event listeners,
  // which always fire after the commit that synced them.
  const openRef = React.useRef(open)
  const requestOpenChangeRef = React.useRef<(next: boolean) => void>(() => {})

  const requestOpenChange = (next: boolean) => {
    if (isControlled) {
      // Dedupe against the render-authoritative prop only — never write
      // openRef optimistically here. An optimistic write would let a parent
      // that vetoes a request (ignores it, so no re-render runs the resync
      // effect) permanently swallow every later identical request. Accepted
      // trade-off: a same-tick duplicate close (Escape reaching both the
      // Autocomplete and the Dialog) may reach `onOpenChange` twice with the
      // same value — idempotent for a setState parent, and correctness in
      // the veto case beats dedupe cosmetics.
      if (open === next) {
        return
      }
      onOpenChange?.(next)
      return
    }
    // Uncontrolled, the component owns the state, so the optimistic write is
    // safe (the commit below confirms it) and dedupes the double-report case
    // (both primitives announcing the same close) down to one callback.
    if (openRef.current === next) {
      return
    }
    openRef.current = next
    setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  React.useEffect(() => {
    // `open` (not `next` from an event) is authoritative here: in controlled
    // mode this effect is the ref's ONLY writer, so the shortcut listener
    // always toggles from the last value the parent actually rendered.
    openRef.current = open
    requestOpenChangeRef.current = requestOpenChange
  })

  React.useEffect(() => {
    if (!shortcut) {
      return undefined
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'k' &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.defaultPrevented
      ) {
        event.preventDefault()
        // Toggle, per the nswds-app source: the same chord opens and closes.
        requestOpenChangeRef.current(!openRef.current)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcut])

  const handleSelect = (item: SiteSearchItem) => {
    // Close first, then hand over — mirrors the source's `runCommand`, so the
    // app's navigation starts from a closed palette.
    requestOpenChange(false)
    onSelect(item)
  }

  const filter = React.useCallback((item: SiteSearchItem, query: string) => {
    const q = query.trim().toLowerCase()
    if (q === '') {
      return true
    }
    if (item.title.toLowerCase().includes(q)) {
      return true
    }
    return (item.keywords ?? []).some((keyword) => keyword.toLowerCase().includes(q))
  }, [])

  const defaultTrigger = (
    <Button
      variant='ghost'
      color='grey'
      size='icon'
      aria-label={label}
      leadingVisual={IconSearch}
    />
  )

  return (
    <Dialog.Root open={open} onOpenChange={(next) => requestOpenChange(next)}>
      {trigger === null ? null : React.isValidElement(trigger) ? (
        <Dialog.Trigger
          data-slot='site-search-trigger'
          render={trigger as React.ReactElement<Record<string, unknown>>}
        />
      ) : (
        <Dialog.Trigger data-slot='site-search-trigger' render={defaultTrigger}>
          {trigger}
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Backdrop
          data-slot='site-search-overlay'
          className='fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs motion-reduce:transition-none'
        />
        <Dialog.Popup
          data-slot='site-search-panel'
          aria-label={label}
          // The default focus target on touch is the panel itself (to keep the
          // virtual keyboard closed) — wrong for a search palette, whose whole
          // purpose is typing. Always focus the input.
          initialFocus={inputRef}
          className={cn(
            // Centred panel on the house popup surface (popover.tsx / sheet.tsx).
            'fixed top-[max(--spacing(4),15vh)] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2',
            'rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden',
            'transition duration-150 ease-out motion-reduce:transition-none',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
        >
          <Autocomplete.Root
            items={groups}
            filter={filter}
            itemToStringValue={(item: SiteSearchItem) => item.title}
            autoHighlight
            // Inline mode: the list renders statically inside the dialog panel
            // (no Autocomplete portal/positioner), with `open` pinned per the
            // Base UI docs. Opening/closing belongs to the Dialog; the whole
            // Autocomplete unmounts with it, resetting query and highlight.
            inline
            open
            onOpenChange={(nextOpen, eventDetails) => {
              // The pinned-open inline Autocomplete still *requests* closes;
              // forward the ones that should dismiss the palette. Other
              // reasons (input-clear, focus-out) must not close the dialog —
              // clearing the query or tabbing within the trap isn't dismissal.
              if (
                !nextOpen &&
                (eventDetails.reason === 'escape-key' || eventDetails.reason === 'item-press')
              ) {
                requestOpenChange(false)
              }
            }}
          >
            <div
              data-slot='site-search-input-row'
              className='flex items-center gap-3 border-b border-foreground/10 px-4'
            >
              <IconSearch aria-hidden='true' className='size-5 shrink-0 text-muted-foreground' />
              <Autocomplete.Input
                data-slot='site-search-input'
                aria-label={label}
                placeholder={placeholder}
                className='h-12 w-full bg-transparent text-base text-foreground outline-hidden placeholder:text-muted-foreground'
                ref={inputRef}
              />
            </div>

            {/* Base UI renders Empty's children only while the list is empty;
                the padding lives on the inner div so the (always-mounted, for
                polite announcements) outer element paints nothing otherwise. */}
            <Autocomplete.Empty data-slot='site-search-empty'>
              <div className='px-4 py-6 text-center text-sm text-muted-foreground'>
                {emptyMessage}
              </div>
            </Autocomplete.Empty>

            <Autocomplete.List
              data-slot='site-search-list'
              className='max-h-[min(--spacing(96),60vh)] overflow-y-auto overscroll-contain p-2 empty:hidden'
            >
              {(group: SiteSearchGroup) => (
                <Autocomplete.Group
                  key={group.title}
                  items={group.items}
                  data-slot='site-search-group'
                >
                  <Autocomplete.GroupLabel
                    data-slot='site-search-group-label'
                    className='px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground'
                  >
                    {group.title}
                  </Autocomplete.GroupLabel>
                  <Autocomplete.Collection>
                    {(item: SiteSearchItem) => (
                      <Autocomplete.Item
                        key={item.href}
                        value={item}
                        data-slot='site-search-item'
                        onClick={() => handleSelect(item)}
                        // Highlight treatment mirrors menubar.tsx: keyboard and
                        // hover unify as data-highlighted, painted as 10% ink.
                        className='flex min-h-11 cursor-default items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground outline-hidden select-none data-highlighted:bg-primary-800/10 data-highlighted:text-accent-foreground dark:data-highlighted:bg-primary-200/10'
                      >
                        {item.title}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.Collection>
                </Autocomplete.Group>
              )}
            </Autocomplete.List>
          </Autocomplete.Root>

          {children != null ? (
            <div
              data-slot='site-search-footer'
              className='border-t border-foreground/10 px-4 py-2 text-xs text-muted-foreground'
            >
              {children}
            </div>
          ) : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { SiteSearch }
export type { SiteSearchGroup, SiteSearchItem, SiteSearchProps }

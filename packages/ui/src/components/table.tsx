'use client'

import * as React from 'react'

import { cn } from '../lib/utils.js'

/**
 * Accessible name of the scroll region when nothing else names the table —
 * no TableCaption, and no `aria-label` / `aria-labelledby` on the table.
 */
const DEFAULT_SCROLL_REGION_LABEL = 'Scrollable table'

type TableContextValue = {
  /** The id a TableCaption takes when the consumer has not given it one. */
  captionId: string
  /** Called by TableCaption with its live id on mount, and `null` on unmount. */
  registerCaption: (id: string | null) => void
}

const TableContext = React.createContext<TableContextValue | null>(null)

/**
 * A data table inside a horizontally scrolling container.
 *
 * The container scrolls whenever the table is wider than the space it has —
 * TableHead and TableCell are `whitespace-nowrap`, so a wide table cannot
 * shrink to fit. A region that scrolls but cannot take focus is unreachable
 * from the keyboard (WCAG 2.1.1; axe reports `scrollable-region-focusable`),
 * so **while the table overflows** the container becomes a named, focusable
 * region: `tabIndex={0}` so the arrow keys scroll it, `role="region"` so the
 * stop is announced, and an accessible name taken from the table's own
 * `aria-labelledby` / `aria-label`, else the TableCaption (linked by id), else
 * "Scrollable table". The `aria-label` / `aria-labelledby` stay on the
 * `<table>` too — the region borrows the name, it does not take it.
 *
 * **While the table fits, the container is a plain `<div>`** — no tab stop,
 * no landmark — so a page of fitting tables gains nothing to tab past. Both
 * states follow the layout live: a ResizeObserver watches the container (the
 * column changing width) and the table (its content changing width, which a
 * `w-full` container does not itself report). The measurement happens on the
 * client, so a server render has no tab stop until hydration; that is the
 * cost of not giving every table one.
 */
function Table({
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: React.ComponentProps<'table'>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const generatedCaptionId = React.useId()
  const [captionId, setCaptionId] = React.useState<string | null>(null)
  const [overflows, setOverflows] = React.useState(false)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    // The observer delivers an initial entry after `observe()`, so the first
    // measurement needs no synchronous read here.
    const observer = new ResizeObserver(() => {
      setOverflows(container.scrollWidth > container.clientWidth)
    })
    observer.observe(container)
    // The container is `w-full`, so it does not resize when its table grows
    // past it — observe the table as well to catch content changes.
    const table = container.firstElementChild
    if (table) {
      observer.observe(table)
    }
    return () => observer.disconnect()
  }, [])

  const context = React.useMemo<TableContextValue>(
    () => ({ captionId: generatedCaptionId, registerCaption: setCaptionId }),
    [generatedCaptionId],
  )

  // The name is only applied together with the role: `aria-label` on a plain
  // <div> is a prohibited attribute (the generic role cannot be named).
  const explicitLabel = ariaLabel?.trim() ? ariaLabel : undefined
  const regionLabelledBy = ariaLabelledBy?.trim()
    ? ariaLabelledBy
    : explicitLabel
      ? undefined
      : (captionId ?? undefined)
  const regionLabel = regionLabelledBy ? undefined : (explicitLabel ?? DEFAULT_SCROLL_REGION_LABEL)

  return (
    <TableContext.Provider value={context}>
      <div
        ref={containerRef}
        data-slot='table-container'
        className='relative w-full overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
        role={overflows ? 'region' : undefined}
        tabIndex={overflows ? 0 : undefined}
        aria-labelledby={overflows ? regionLabelledBy : undefined}
        aria-label={overflows ? regionLabel : undefined}
      >
        <table
          data-slot='table'
          className={cn('w-full caption-bottom text-xs', className)}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          {...props}
        />
      </div>
    </TableContext.Provider>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot='table-body'
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot='table-row'
      className={cn(
        'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'h-10 px-2 text-start align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pe-0',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn('p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0', className)}
      {...props}
    />
  )
}

/**
 * The table's caption. Besides naming the table for everyone, it names the
 * scroll region when no explicit ARIA name is supplied: the caption takes an
 * id (the one given, else a generated one) and reports it to the Table, which
 * points `aria-labelledby` at it.
 */
function TableCaption({ className, id: idProp, ...props }: React.ComponentProps<'caption'>) {
  const context = React.useContext(TableContext)
  const id = idProp ?? context?.captionId

  React.useEffect(() => {
    if (!context || !id) {
      return
    }
    context.registerCaption(id)
    return () => context.registerCaption(null)
  }, [context, id])

  return (
    <caption
      data-slot='table-caption'
      id={id}
      className={cn('mt-4 text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }

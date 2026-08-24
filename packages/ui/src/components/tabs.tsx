'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../lib/utils.js'

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      data-orientation={orientation}
      className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva('group/tabs-list flex items-center text-muted-foreground', {
  variants: {
    variant: {
      // Segmented control — the active tab lifts to a raised surface card.
      default:
        'w-fit justify-center rounded-md bg-muted p-1 group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
      // Underline — left-aligned tabs on a full-width rule (the active tab
      // draws its own marker over it).
      line: 'w-full justify-start gap-6 border-b border-border group-data-vertical/tabs:w-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch group-data-vertical/tabs:gap-1 group-data-vertical/tabs:border-e group-data-vertical/tabs:border-b-0 group-data-vertical/tabs:border-border',
      // Underline stretched to equal columns — the settings-bar idiom. Each
      // cell carries its own bottom rule so the bar can scroll (rather than clip
      // an unreachable tab) once the labels stop fitting, matching TabNav.
      //
      // Horizontal-only: an equal-column bar has no vertical form — use `line`
      // or `default` for `orientation="vertical"`. The `group-data-vertical`
      // `w-fit` is a guard so a stray vertical usage shrinks the list instead of
      // consuming the row and collapsing the panel.
      fullwidth:
        'w-full [scrollbar-width:none] overflow-x-auto group-data-vertical/tabs:w-fit [&::-webkit-scrollbar]:hidden',
      // Enclosed control — equal cells split by dividers inside a bordered card.
      // `overflow-x-auto` both clips each cell's underline to the 4px corner (so
      // the active marker follows the curve) and lets the bar scroll on narrow
      // viewports; the trigger pairs it with a negative outline offset so neither
      // hides focus.
      //
      // Horizontal-only, like `fullwidth` — the `w-fit` guard keeps a stray
      // vertical usage from collapsing the panel.
      bordered:
        'w-full [scrollbar-width:none] overflow-x-auto rounded-sm border border-border bg-background group-data-vertical/tabs:w-fit [&::-webkit-scrollbar]:hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>['variant']>

/**
 * Carries the list's `variant` down to each `TabsTrigger` so a trigger can style
 * itself to match without the caller threading a prop onto every tab. The whole
 * treatment lives in `tabsTriggerVariants`, keyed off this. `default` is the
 * fallback for a trigger rendered outside a `TabsList`, matching the list.
 */
const TabsListContext = React.createContext<TabsVariant>('default')

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsListContext.Provider value={variant ?? 'default'}>
      <TabsPrimitive.List
        data-slot='tabs-list'
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

const tabsTriggerVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap text-foreground/60 motion-safe:transition-[color,background-color,border-color,box-shadow]',
    'hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground',
    // House focus: a 2px outline in the ring colour, offset onto the page. The
    // scroll variants override to a negative offset so the clip can't hide it.
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1',
  ],
  {
    variants: {
      variant: {
        // Pill that lifts to a surface card when active. `h-[calc(100%-1px)]`
        // keeps it inside the list's inset padding.
        default: cn(
          'h-[calc(100%-1px)] flex-1 rounded-sm border border-transparent px-3 py-1',
          'group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-2',
          'data-active:bg-background data-active:text-foreground data-active:shadow-sm',
          'dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground dark:data-active:shadow-none',
        ),
        // Content-width tab with a bottom marker. The 2px border is always
        // present (transparent when idle) so activating a tab never reflows the
        // bar, and `-mb-px` merges the marker with the list's 1px rule.
        line: cn(
          '-mb-px shrink-0 border-b-2 border-transparent px-1 pt-2 pb-3',
          'group-data-vertical/tabs:-me-px group-data-vertical/tabs:mb-0 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:border-e-2 group-data-vertical/tabs:border-b-0 group-data-vertical/tabs:px-3 group-data-vertical/tabs:py-2',
          'data-active:border-primary data-active:text-primary',
        ),
        // The underline marker stretched to fill an equal column. The rule is
        // the cell's own bottom border (idle grey, active primary) so it scrolls
        // with the bar; the negative outline offset keeps focus inside the clip.
        fullwidth: cn(
          'flex-1 justify-center border-b-2 border-b-border px-3 py-4 focus-visible:-outline-offset-2',
          'data-active:border-b-primary data-active:text-primary',
        ),
        // Divided cell inside the bordered card; the active cell darkens to ink
        // and takes a primary underline at its base.
        bordered: cn(
          'flex-1 justify-center border-e border-b-2 border-border border-b-transparent px-3 py-4 last:border-e-0 focus-visible:-outline-offset-2',
          'data-active:border-b-primary data-active:text-foreground',
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const variant = React.useContext(TabsListContext)

  return (
    <TabsPrimitive.Tab
      data-slot='tabs-trigger'
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot='tabs-content'
      className={cn('flex-1 text-sm/relaxed outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger, tabsTriggerVariants }

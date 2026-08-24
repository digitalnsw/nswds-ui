import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'

import { IconExpandLess } from '../icons/expand-less.js'
import { IconExpandMore } from '../icons/expand-more.js'
import { cn } from '../lib/utils.js'

type AccordionVariant = 'default' | 'accent' | 'band'

function Accordion({
  className,
  variant = 'default',
  ...props
}: AccordionPrimitive.Root.Props & { variant?: AccordionVariant }) {
  return (
    <AccordionPrimitive.Root
      data-slot='accordion'
      data-variant={variant}
      className={cn('group/accordion flex w-full flex-col', className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot='accordion-item'
      className={cn(
        'border-t last:border-b',
        // Accent variant: a fine Red 02 (waratah) rule slides in on the inline-start
        // edge when the item is open. A transparent 2px border is always reserved so
        // expanding never shifts the heading.
        'group-data-[variant=accent]/accordion:border-s-2 group-data-[variant=accent]/accordion:border-s-transparent group-data-[variant=accent]/accordion:transition-colors group-data-[variant=accent]/accordion:data-open:border-s-accent-600',
        className,
      )}
      {...props}
    />
  )
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
        data-slot='accordion-trigger'
        className={cn(
          'group/accordion-trigger relative flex min-h-14 flex-1 items-center justify-between gap-6 px-2 py-4 text-start text-lg/snug font-semibold text-primary transition-colors outline-none hover:bg-muted focus-visible:bg-muted focus-visible:underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ms-auto **:data-[slot=accordion-trigger-icon]:size-6',
          // Band variant: every header sits on a grey band (a Grey 01 tint, so it
          // inverts correctly in dark mode) that deepens when hovered, focused or open.
          // All interactive states share one shade so nothing depends on cascade order.
          'group-data-[variant=band]/accordion:bg-foreground/10 group-data-[variant=band]/accordion:hover:bg-foreground/20 group-data-[variant=band]/accordion:focus-visible:bg-foreground/20 group-data-[variant=band]/accordion:aria-expanded:bg-foreground/20',
          className,
        )}
        {...props}
      >
        {children}
        {/* Down chevron (collapsed state) — always brand blue. */}
        <IconExpandMore
          data-slot='accordion-trigger-icon'
          className='pointer-events-none shrink-0 text-primary group-aria-expanded/accordion-trigger:hidden'
        />
        {/* Up chevron (expanded state) — brand blue by default; turns Red 02 in the
            accent variant, so the open item's icon matches its accent rule. */}
        <IconExpandLess
          data-slot='accordion-trigger-icon'
          className='pointer-events-none hidden shrink-0 text-primary group-aria-expanded/accordion-trigger:inline group-data-[variant=accent]/accordion:text-accent-600'
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot='accordion-content'
      className='overflow-hidden px-2 text-base/relaxed data-open:animate-accordion-down data-closed:animate-accordion-up'
      {...props}
    >
      <div
        className={cn(
          'h-(--accordion-panel-height) pt-3 pb-6 text-foreground data-ending-style:h-0 data-starting-style:h-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:decoration-2 [&_p:not(:last-child)]:mb-4',
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
export type { AccordionVariant }

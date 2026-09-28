'use client'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { cn } from '../lib/utils.js'

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot='radio-group'
      className={cn('grid w-full gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot='radio-group-item'
      className={cn(
        'group/radio-group-item peer relative inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-(--text-default) bg-(--input-surface) motion-safe:transition-colors',
        // Read the theme bridge so changing the brand palette updates both modes.
        '[--radio-ink:var(--color-primary-800)] dark:not-data-disabled:not-aria-invalid:[--radio-ink:var(--color-primary-200)]',
        'after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2 after:rounded-full',
        'not-data-disabled:hover:bg-[color-mix(in_srgb,var(--radio-ink)_10%,var(--input-surface))]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--radio-ink)',
        // Match Checkbox and Input, including the selected invalid fill.
        'aria-invalid:not-data-disabled:border-2 aria-invalid:not-data-disabled:border-(--input-invalid-border) aria-invalid:not-data-disabled:[--radio-ink:var(--danger-solid)] aria-invalid:not-data-disabled:hover:bg-(--input-invalid-surface-hover) aria-invalid:focus-visible:outline-offset-2 aria-invalid:focus-visible:outline-(--input-invalid-ring)',
        // Base UI propagates disabled from the item, group or surrounding Field.
        'data-disabled:cursor-not-allowed data-disabled:border-(--text-subtle) data-disabled:[--radio-ink:var(--text-subtle)]',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot='radio-group-indicator'
        className='pointer-events-none absolute top-1/2 left-1/2 size-5.5 -translate-1/2 rounded-full bg-(--radio-ink)'
      />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }

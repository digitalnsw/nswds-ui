import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { IconExpandMore } from '../icons/expand-more.js'
import { cn } from '../lib/utils.js'

const nativeSelectVariants = cva(
  // Field foundation shared with Input (input.tsx) and the Select trigger: the
  // same --input-* semantic tokens, 16px text, and an outline-based focus ring.
  // appearance-none hides the native arrow so our chevron shows; no outline-none
  // (it would suppress the focus-visible outline). Dark mode and brand themes
  // restyle via tokens, so there are no dark: variants.
  'w-full min-w-0 appearance-none rounded-sm text-base text-(--input-foreground) select-none selection:bg-primary selection:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--input-ring) disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-2 aria-invalid:border-(--input-invalid-border) aria-invalid:hover:bg-(--input-invalid-surface-hover) aria-invalid:focus-visible:outline-(--input-invalid-ring) motion-safe:transition-colors',
  {
    variants: {
      variant: {
        // Crisp field — bordered white box; matches Input and Select's default.
        default:
          'border border-(--input-border) bg-(--input-surface) hover:bg-(--input-surface-hover)',
        // Filled band — borderless tinted surface that reveals its border on hover.
        filled: 'border border-transparent bg-secondary hover:border-(--input-border)',
      },
      size: {
        default: 'h-12 ps-4 pe-10',
        sm: 'h-10 ps-3 pe-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type NativeSelectProps = Omit<React.ComponentProps<'select'>, 'size'> &
  VariantProps<typeof nativeSelectVariants>

function NativeSelect({ className, variant, size, ...props }: NativeSelectProps) {
  return (
    <div
      className={cn(
        'group/native-select relative w-fit has-[select:disabled]:opacity-50',
        className,
      )}
      data-slot='native-select-wrapper'
      data-size={size ?? 'default'}
      data-variant={variant ?? 'default'}
    >
      <select
        data-slot='native-select'
        data-size={size ?? 'default'}
        data-variant={variant ?? 'default'}
        className={cn(nativeSelectVariants({ variant, size }))}
        {...props}
      />
      <IconExpandMore
        className='pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-primary select-none'
        aria-hidden='true'
        data-slot='native-select-icon'
      />
    </div>
  )
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<'option'>) {
  return (
    <option
      data-slot='native-select-option'
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<'optgroup'>) {
  return (
    <optgroup
      data-slot='native-select-optgroup'
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption, nativeSelectVariants }

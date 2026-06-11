'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import * as React from 'react'

import { cn } from '../lib/utils.js'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-type={type}
      className={cn(
        // No `outline-none` here: it sets `--tw-outline-style: none` globally
        // on the element, which then suppresses the focus outline below
        // (which reads `outline-style: var(--tw-outline-style)`).
        'h-12 w-full min-w-0 rounded-sm px-4 py-2 text-base transition-colors',
        // Default — 1px grey-02 border on surface-default
        'border border-grey-600 bg-background text-grey-800',
        // Dark mode — flip text to a light grey so it's readable on dark surface
        // (mirrors how border-grey-600 → dark:border-grey-200 is handled below).
        'dark:text-grey-100',
        // Hover
        'hover:bg-grey-100',
        // Focus — Uses `focus:`
        // (not `focus-visible:`) so the ring shows on click as well as keyboard.
        'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-grey-600',
        // File input slot
        'file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-grey-800 dark:file:text-grey-100',
        // Placeholder styles
        'placeholder:text-grey-500',
        'dark:placeholder:text-grey-300',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid — 2px danger-600 border, danger-50 hover surface (Figma error variants)
        'aria-invalid:border-2 aria-invalid:border-danger-600 aria-invalid:hover:bg-danger-50 aria-invalid:focus:outline-danger-600',
        'aria-invalid:dark:border-danger-200 aria-invalid:dark:hover:bg-danger-900/30 aria-invalid:dark:focus:outline-danger-200',
        // Dark mode — invert grey border for sufficient contrast against dark surfaces
        'dark:border-grey-100 dark:bg-input/30',
        'dark:hover:bg-input/50 dark:focus:outline-grey-100',
        className
      )}
      {...props}
    />
  )
}

export { Input }

export type InputProps = React.ComponentProps<typeof Input>

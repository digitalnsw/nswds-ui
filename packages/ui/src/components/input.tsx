'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import * as React from 'react'

import { cn } from '../lib/utils.js'

function Input({ className, type, ref, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      ref={ref}
      type={type}
      data-slot='input'
      data-type={type}
      className={cn(
        // No `outline-none` here: it sets `--tw-outline-style: none` globally
        // on the element, which then suppresses the focus outline below
        // (which reads `outline-style: var(--tw-outline-style)`).
        'h-12 w-full min-w-0 rounded-sm px-4 py-2 text-base transition-colors motion-reduce:transition-none',
        // Every colour routes through the --input-* semantic tokens (layer 3,
        // theme.css / the registry theme item). Dark mode and brand themes
        // restyle the input by remapping tokens — no dark: variants here.
        'border border-(--input-border) bg-(--input-surface) text-(--input-foreground)',
        // Hover
        'hover:bg-(--input-surface-hover)',
        // Focus — `focus-visible:` per the design-system policy (matches
        // Button/Link). For text fields this is behaviour-preserving:
        // browsers flag keyboard-editable controls as :focus-visible even
        // when focused by pointer, so the ring still shows on click.
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--input-ring)',
        // File input slot
        'file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--input-foreground)',
        // Placeholder styles
        'placeholder:text-(--input-placeholder)',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid — 2px danger border, danger hover surface (Figma error variants)
        'aria-invalid:border-2 aria-invalid:border-(--input-invalid-border) aria-invalid:hover:bg-(--input-invalid-surface-hover) aria-invalid:focus-visible:outline-(--input-invalid-ring)',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

export type InputProps = React.ComponentProps<typeof Input>

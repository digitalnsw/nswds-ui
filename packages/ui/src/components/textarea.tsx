'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import * as React from 'react'

import { cn } from '../lib/utils.js'

function Textarea({ className, ref, ...props }: React.ComponentProps<'textarea'>) {
  return (
    // Base UI's Input IS `Field.Control`, so rendering it as a `<textarea>`
    // buys the multi-line control the same Field wiring the single-line Input
    // already has: inside a `<Field>` it is the registered control, so the
    // label association, `aria-describedby` for the description/error and
    // `aria-invalid` are handled for us. The primitive is typed for `<input>`,
    // hence the cast on the otherwise-identical props.
    <InputPrimitive
      ref={ref as React.Ref<HTMLElement>}
      render={<textarea />}
      data-slot='textarea'
      className={cn(
        // No `outline-none` here: it sets `--tw-outline-style: none` globally
        // on the element, which then suppresses the focus outline below
        // (which reads `outline-style: var(--tw-outline-style)`).
        //
        // Sizing is the one deliberate departure from Input: `field-sizing-content`
        // grows the box with its content from a three-line floor instead of
        // pinning it to Input's single-line `h-12`. Everything else — padding,
        // radius, type size, colour, state handling — is Input's.
        'field-sizing-content min-h-24 w-full min-w-0 resize-none rounded-sm px-4 py-2 text-base motion-safe:transition-colors',
        // Every colour routes through the --input-* semantic tokens (layer 3,
        // theme.css / the registry theme item). Dark mode and brand themes
        // restyle the control by remapping tokens — no dark: variants here.
        'border border-(--input-border) bg-(--input-surface) text-(--input-foreground)',
        // Hover
        'hover:bg-(--input-surface-hover)',
        // Focus — `focus-visible:` per the design-system policy (matches
        // Button/Link/Input). For text fields this is behaviour-preserving:
        // browsers flag keyboard-editable controls as :focus-visible even
        // when focused by pointer, so the ring still shows on click.
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--input-ring)',
        // Placeholder styles
        'placeholder:text-(--input-placeholder)',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid — 2px danger border, danger hover surface (Figma error variants)
        'aria-invalid:border-2 aria-invalid:border-(--input-invalid-border) aria-invalid:hover:bg-(--input-invalid-surface-hover) aria-invalid:focus-visible:outline-(--input-invalid-ring)',
        className,
      )}
      // Spread last, mirroring Input: callers must be able to override
      // `data-slot` (InputGroupTextarea relabels it `input-group-control` so
      // the group's wrapper owns the focus treatment).
      {...(props as InputPrimitive.Props)}
    />
  )
}

export { Textarea }

export type TextareaProps = React.ComponentProps<typeof Textarea>

'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../lib/utils.js'
import { Button } from './button.js'
import { Input } from './input.js'
import { Textarea } from './textarea.js'

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='input-group'
      role='group'
      className={cn(
        // No `outline-none` here: it sets `--tw-outline-style: none` on this
        // element, which then suppresses the focus outline below (which reads
        // `outline-style: var(--tw-outline-style)`).
        'group/input-group relative flex h-12 w-full min-w-0 items-center rounded-sm motion-safe:transition-colors',
        // Every colour routes through the --input-* semantic tokens (layer 3,
        // theme.css / the registry theme item) — the same set Input uses, so a
        // group and a bare input are the same control. The role tokens behind
        // them are mode-aware, so there are no dark: variants here.
        'border border-(--input-border) bg-(--input-surface)',
        // Hover — owned by the wrapper so the whole control reacts, addons
        // included, rather than just the inner control's box.
        'hover:bg-(--input-surface-hover)',
        // Focus — the group draws one outline for whichever control is focused;
        // InputGroupInput / InputGroupTextarea suppress their own. Offset and
        // colour are unconditional because neither renders anything until
        // `outline-2` supplies an outline-style, and keeping them off the
        // has-[] variant leaves the invalid colour below a plain specificity
        // win instead of a source-order tie between two has-[] rules.
        'outline-offset-2 outline-(--input-ring)',
        'has-[[data-slot=input-group-control]:focus-visible]:outline-2',
        // Invalid — 2px danger border, danger hover surface and danger focus
        // outline, mirroring Input's aria-invalid treatment. Each rule carries
        // the has-[] selector, so it outranks its unqualified counterpart on
        // specificity rather than on emission order.
        'has-[[data-slot][aria-invalid=true]]:border-2 has-[[data-slot][aria-invalid=true]]:border-(--input-invalid-border)',
        'has-[[data-slot][aria-invalid=true]]:outline-(--input-invalid-ring)',
        'has-[[data-slot][aria-invalid=true]]:hover:bg-(--input-invalid-surface-hover)',
        // Block-aligned addons stack the group and let it grow to fit
        'has-data-[align=block-end]:rounded-sm has-data-[align=block-start]:rounded-sm has-[textarea]:rounded-sm',
        'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto',
        // Addon-driven padding on the inner input
        'has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pe-1.5 has-[>[data-align=inline-start]]:[&>input]:ps-1.5',
        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  // `--input-placeholder` is the input token set's de-emphasised-text role, and
  // an icon or text affix is exactly that — so addons restyle with the input
  // rather than drifting from it. Mode-aware, hence no dark: variants.
  //
  // Glyphs are `size-5` (20px) — 1.25x the control's own `text-base`, matched
  // to the TEXT beside them rather than to the 48px box, the same reasoning
  // Button applies to a label glyph. The old 3.5 (14px) was scaled for the
  // 28px group this component used to be and read as fine print next to 16px
  // input text.
  "flex h-auto cursor-text items-center justify-center gap-1 py-2 text-xs/relaxed font-medium text-(--input-placeholder) select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-[calc(var(--radius-sm)-2px)] **:data-[slot=kbd]:bg-(--input-placeholder)/10 **:data-[slot=kbd]:px-1 **:data-[slot=kbd]:text-[0.625rem] [&>svg:not([class*='size-'])]:size-5",
  {
    variants: {
      align: {
        'inline-start': 'order-first ps-2 has-[>button]:ms-[-0.275rem] has-[>kbd]:ms-[-0.275rem]',
        'inline-end': 'order-last pe-2 has-[>button]:me-[-0.275rem] has-[>kbd]:me-[-0.275rem]',
        'block-start':
          'order-first w-full justify-start px-2 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2',
        'block-end':
          'order-last w-full justify-start px-2 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role='group'
      data-slot='input-group-addon'
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector<HTMLElement>('input, textarea')?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  'flex items-center gap-2 rounded-sm text-xs/relaxed shadow-none',
  {
    variants: {
      size: {
        xs: "h-5 gap-1 rounded-[calc(var(--radius-sm)-2px)] px-1 [&>svg:not([class*='size-'])]:size-3",
        sm: 'gap-1',
        'icon-xs': 'size-6 p-0 has-[>svg]:p-0',
        'icon-sm': 'size-7 p-0 has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
)

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: 'button' | 'submit' | 'reset'
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        // Nested glyph size tracks the addon's, so an icon inside the text
        // affix and one beside it are the same size.
        "flex items-center gap-2 text-xs/relaxed text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot='input-group-control'
      className={cn(
        // The group owns the box, so fill its height (Input is `h-12` on its
        // own) and drop the border, surface and radius to let the group's
        // chrome show through. Hover is left alone: the group paints the same
        // `--input-surface-hover`, so the inner control's copy is invisible.
        //
        // `outline-0` / `border-0` rather than `outline-none` / `border-none`:
        // tailwind-merge treats those as the same group as Input's
        // `focus-visible:outline-2` / `aria-invalid:border-2` and drops them
        // from the class string outright, so there is never a pair of
        // same-specificity rules whose winner depends on stylesheet order.
        'h-full flex-1 rounded-none border-0 bg-transparent focus-visible:outline-0 aria-invalid:border-0',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot='input-group-control'
      className={cn(
        // Same contract as InputGroupInput, but Textarea is still on the old
        // shadcn token set (`bg-input/20` + a `ring-*` focus treatment), so the
        // neutralisers it needs are the ring ones — and it still needs a
        // `dark:` counterpart for `dark:bg-input/30`. These collapse to match
        // InputGroupInput once textarea.tsx moves onto the --input-* tokens.
        'flex-1 rounded-none border-0 bg-transparent py-2 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
        className,
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}

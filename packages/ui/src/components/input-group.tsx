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
        'group/input-group relative flex h-12 w-full min-w-0 items-stretch rounded-sm motion-safe:transition-colors',
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
        // An InputGroupAction sits flush to the trailing edge with square
        // corners, so the group clips it to its own radius — cheaper and
        // RTL-correct next to per-corner arithmetic on the action. Scoped to
        // groups that actually hold one: a bare `overflow-hidden` would clip
        // DESCENDANT outlines, and InputGroupButton's focus ring sits 2px
        // outside itself, so every Combobox chevron would lose its ring.
        'has-[[data-slot=input-group-action]]:overflow-hidden',
        // Block-aligned addons stack the group and let it grow to fit
        'has-data-[align=block-end]:rounded-sm has-data-[align=block-start]:rounded-sm has-[textarea]:rounded-sm',
        'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto',
        // Addon-driven padding on the inner input
        'has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3',
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
  // Type and glyphs are sized off the control's own `text-base`, not off the
  // box. An affix sits on the same line as the value, so 16px is the floor —
  // the old `text-xs/relaxed` (12px) and 10px kbd were scaled for the 28px
  // group this component used to be and read as fine print beside 16px input
  // text. Glyphs are `size-5` (20px), 1.25x the label, the same reasoning
  // button.tsx documents for a label glyph.
  // An addon holding an InputGroupAction yields its own padding on that edge so
  // the action reaches the group's inner border, and takes a 48px floor so the
  // row still has height once the padding is gone (the affix text centres in
  // it via `items-center`). Each override carries the has-[] selector, so it
  // outranks the base padding on specificity rather than on emission order.
  "flex cursor-text items-center justify-center gap-1 text-base font-semibold text-(--input-placeholder) select-none group-data-[disabled=true]/input-group:opacity-50 has-[[data-slot=input-group-action]]:min-h-12 has-[[data-slot=input-group-action]]:py-0 **:data-[slot=kbd]:rounded-[calc(var(--radius-sm)-2px)] **:data-[slot=kbd]:bg-(--input-placeholder)/10 **:data-[slot=kbd]:px-1 [&>svg:not([class*='size-'])]:size-5",
  {
    variants: {
      align: {
        // No negative nudge for buttons. `me-[-0.275rem]` was tuned to cancel a
        // 20px `px-1` button in the 28px group this component used to be; at
        // 32px and `px-3` it under-compensates and left the inline button 3.6px
        // off the group's inner edge while the block-end row sat at 8px. Every
        // inset is now that same 8px, so affixes, buttons and footer rows all
        // land on one grid. The kbd nudge stays — a kbd chip is small enough
        // that the optical correction still reads.
        // The leading affix is a CELL, not floating text: a recessed fill, a
        // hairline on its inner edge, and the group's full height. This is what
        // makes the trailing action read as its mirror — the approved design's
        // words were "the trailing cell mirrors the leading AUD cell exactly".
        // 16px padding matches the value's own, so affix and value sit on one
        // rhythm.
        'inline-start':
          'order-first rounded-s-[calc(var(--radius-sm)-1px)] border-e border-(--border-default) bg-(--surface-sunken) px-4 has-[>kbd]:ms-[-0.275rem]',
        'inline-end':
          'order-last px-2 has-[[data-slot=input-group-action]]:me-0 has-[[data-slot=input-group-action]]:items-stretch has-[[data-slot=input-group-action]]:p-0 has-[>kbd]:me-[-0.275rem]',
        // Block addons are chrome, not content, so they carry the boundary the
        // Hairline Rule asks for and sit on the recessed surface. Without both
        // the row floats in the writing area with nothing dividing it.
        //
        // `--surface-sunken`, NOT `--background-subtle`: the latter resolves to
        // the same value as `--surface-default` in dark, so the tint vanishes
        // there. Sunken differs from the group's surface in BOTH modes.
        //
        // The corners are rounded rather than clipped by the group: a group-level
        // `overflow-hidden` would cut off the focus ring of any button inside
        // the row, since Button rings 2px outside itself.
        'block-start':
          'order-first min-h-12 w-full justify-start rounded-t-[calc(var(--radius-sm)-1px)] border-b border-(--border-default) bg-(--surface-sunken) px-4 has-[[data-slot=input-group-action]]:items-stretch has-[[data-slot=input-group-action]]:pe-0',
        'block-end':
          'order-last min-h-12 w-full justify-start rounded-b-[calc(var(--radius-sm)-1px)] border-t border-(--border-default) bg-(--surface-sunken) px-4 has-[[data-slot=input-group-action]]:items-stretch has-[[data-slot=input-group-action]]:pe-0',
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
  [
    // No font-size here: Button already sets `text-base/7`, and the
    // `text-xs/relaxed` this used to carry shrank its label to 12px.
    'flex items-center gap-2 rounded-sm shadow-none',
    // Every size below was inert until this line. Button pins
    // `min-h-(--btn-h)` — 52px at the default step, 60px below `sm` — which
    // outranks a plain `h-*` because they are different properties, so an
    // `xs` button rendered at full size and inflated the row it sat in.
    'min-h-0',
    // Button's padding is a RESPONSIVE pair (`py-[…] sm:py-[…]`), and a media
    // query adds no specificity, so an unprefixed override loses to the `sm:`
    // rule on emission order. Restating both halves (`py-0 sm:py-0`) fixes the
    // render but pairs a bare utility with a conditional one on the same
    // property — check:cascade rejects that, and rightly: a consumer whose own
    // build emits `.py-0` can have their copy land last on our element.
    //
    // `data-size` is always set by InputGroupButton, so an attribute selector
    // is 0,2,0 against the media rule's 0,1,0 and wins at every width, with no
    // second rule to order against.
    'data-[size]:py-0',
    // Same reason as InputGroupAction: zeroing Button's padding exposes its
    // `items-baseline` base, which no longer centres the label.
    'items-center',
  ],
  {
    variants: {
      // Heights are capped at 32px: the addon pads 8px top and bottom inside a
      // 48px group, so anything taller re-inflates the row it is meant to sit
      // inside. `sm` buys horizontal room rather than height for that reason.
      size: {
        xs: "h-8 gap-1 rounded-[calc(var(--radius-sm)-1px)] data-[size=xs]:px-3 [&>svg:not([class*='size-'])]:size-5",
        sm: "h-8 gap-1 rounded-[calc(var(--radius-sm)-1px)] data-[size=sm]:px-4 [&>svg:not([class*='size-'])]:size-5",
        'icon-xs': 'size-7 data-[size=icon-xs]:px-0',
        'icon-sm': 'size-8 data-[size=icon-sm]:px-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
)

/**
 * The inline button inside an addon — a secondary action or an icon
 * affordance, as opposed to `InputGroupAction`, which attaches to the group's
 * trailing edge.
 *
 * Defaults to `soft` rather than `ghost`: a ghost button inside a control is
 * bare text with no shape, location or formatting to signal it is pressable,
 * which is the one thing an affordance has to do without being hovered. `soft`
 * gives it a 10% ink chip and stays quieter than the attached action beside
 * it. Icon affordances that should stay bare — Combobox's chevron and clear —
 * pass `variant='ghost'` explicitly and are unaffected.
 */
function InputGroupButton({
  className,
  type = 'button',
  variant = 'soft',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: 'button' | 'submit' | 'reset'
  }) {
  return (
    <Button
      type={type}
      data-slot='input-group-button'
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

const inputGroupActionVariants = cva(
  [
    // Fills the group's height and sits flush against its trailing edge — one
    // block, not a button floating in addon padding. Button pins
    // `min-h-(--btn-h)` (52px at the default step, 60px below `sm`), which a
    // 48px group cannot hold, so `self-stretch` sizes the segment off the group
    // and `min-h-0` clears the floor.
    //
    // `min-h-0`, NOT `[--btn-h:0px]`: the size step publishes its height through
    // a RESPONSIVE pair (`[--btn-h:…] sm:[--btn-h:…]`), and a media query adds
    // no specificity, so an unprefixed custom-property override loses to the
    // `sm:` rule on emission order alone. Overriding the property itself lands
    // in tailwind-merge's `min-h` group and drops Button's utility outright.
    'h-auto min-h-0 self-stretch',
    // Square: the group re-rounds the one outer corner by clipping (see
    // `has-[[data-slot=input-group-action]]:overflow-hidden` on InputGroup), so
    // there is no corner arithmetic here. The `before`/`after` fill layers are
    // squared too — left at `calc(var(--radius-sm)-1px)` they notch the flush
    // edges.
    'rounded-none before:rounded-none after:rounded-none dark:after:rounded-none',
    // Flush against the value: no optical border, and no shadow — a `shadow-sm`
    // whisper belongs under a button sitting on the page, not one inset into a
    // control. Padding is restated for both breakpoints because Button's is a
    // responsive pair (see the min-h note above).
    // Padding is keyed on `data-slot` rather than restated at both breakpoints:
    // Button's own padding is a responsive pair, and a bare-plus-conditional
    // override of the same property is what check:cascade forbids. The
    // attribute selector is 0,2,0 and wins at every width on specificity.
    'border-0 before:shadow-none data-[slot=input-group-action]:px-5 data-[slot=input-group-action]:py-0',
    // The seam colour is owned here, for both modes, in the ALL-SIDES form.
    // Button's ghost/soft/solid each set `dark:border-white/5`, which is a
    // border-color shorthand — an inline-start longhand would only beat it by
    // emission order, and white at 5% measures 1.12:1 on the dark surface, so
    // the seam vanished there. Matching the shorthand puts both in one
    // tailwind-merge group and drops Button's outright. Width stays 0 except
    // where a variant below asks for it, so only that one edge paints.
    'border-(--input-border) dark:border-(--input-border)',
    // Focus draws INSIDE the segment: Button's default `outline-offset-2` puts
    // the ring on the page, which the clipping group cuts off.
    // `items-center`, because Button's base is `items-baseline`. Baseline
    // alignment only looks centred while Button's own vertical padding
    // balances the line box; with `py-0` and a stretched box it parked the
    // label 9px above centre in a 46px segment. Measured, not eyeballed.
    'items-center font-semibold focus:-outline-offset-2',
  ],
  {
    variants: {
      // Three fills, mapped onto Button's own variants so hover, active and
      // dark-mode handling come from the button system rather than being
      // restated here. `open` and `subtle` have little or no fill contrast
      // against the input surface, so both carry a leading hairline to read as
      // a distinct cell; `solid` needs one only in dark (see below).
      variant: {
        // `open` and `subtle` have no usable fill contrast against the input
        // surface (1:1 and 1.69:1 measured in dark), so both are bounded by a
        // leading hairline in every mode. Colour comes from the base above.
        open: 'border-s bg-transparent',
        subtle: 'border-s',
        // Button rings in `--btn-bg`, which for a solid button IS the fill, so
        // the inset ring above would be navy-on-navy. `--btn-text` is the label
        // colour: 14.37:1 on the fill in both modes.
        //
        // The dark seam is not decoration. Button's `primary` reads the
        // masterbrand ramp (--color-primary-800, Blue 01), which is
        // theme-invariant, so on the dark group surface the fill measures
        // 1.32:1 — under the 3:1 floor for identifying a UI component. The
        // other three edges are bounded by the group's own border; this
        // continues that hairline inward. Light needs none at 15.26:1, and a
        // grey seam there would read as a gap.
        solid: 'focus:outline-(--btn-text) dark:border-s',
      },
    },
    defaultVariants: {
      variant: 'solid',
    },
  },
)

/** Maps this component's fill names onto Button's variant names. */
const inputGroupActionButtonVariant = {
  open: 'ghost',
  subtle: 'soft',
  solid: 'solid',
} as const

function InputGroupAction({
  className,
  type = 'button',
  variant = 'solid',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size' | 'type' | 'variant'> &
  VariantProps<typeof inputGroupActionVariants> & {
    type?: 'button' | 'submit' | 'reset'
  }) {
  return (
    <Button
      type={type}
      data-slot='input-group-action'
      data-variant-action={variant}
      variant={inputGroupActionButtonVariant[variant ?? 'solid']}
      className={cn(inputGroupActionVariants({ variant }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        // Matches the addon it sits in: 16px type, `--input-placeholder` ink,
        // and a nested glyph the same size as one beside it.
        "flex items-center gap-2 text-base text-(--input-placeholder) [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
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
        // chrome show through.
        //
        // The hover surfaces must be neutralised too, even though the group
        // paints the identical token: this control is `rounded-none` and
        // `flex-1`, so with no inline-end addon its right edge lands 1px
        // inside the group's border and its SQUARE corner fills the group's
        // `rounded-sm` corner notch. Same colour, wrong shape — the group's
        // own paint is clipped to its radius, the control's is not. Letting
        // only the group paint keeps the corners round in both the default
        // and the aria-invalid state (where the notch is 2px, not 1px).
        //
        // `outline-0` / `border-0` rather than `outline-none` / `border-none`:
        // tailwind-merge treats those as the same group as Input's
        // `focus-visible:outline-2` / `aria-invalid:border-2` and drops them
        // from the class string outright, so there is never a pair of
        // same-specificity rules whose winner depends on stylesheet order.
        'h-full flex-1 rounded-none border-0 bg-transparent hover:bg-transparent focus-visible:outline-0 aria-invalid:border-0 aria-invalid:hover:bg-transparent',
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
  InputGroupAction,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}

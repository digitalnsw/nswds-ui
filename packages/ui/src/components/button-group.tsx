'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import {
  ButtonGroupBoundary,
  ButtonGroupContext,
  type ButtonGroupContextValue,
} from '../lib/button-group-context.js'
import { cn } from '../lib/utils.js'
import { buttonColorVariants, type ButtonProps } from './button.js'
import { Separator } from './separator.js'

const DEFAULT_GROUP_VARIANT = 'outline' as const
const DEFAULT_GROUP_ORIENTATION = 'horizontal' as const

/**
 * The group owns the boundary. It draws the frame or the band, the hairline
 * between segments and the 4px corners, and it clips its children to that
 * radius — so a segment never computes a corner of its own. The segments are
 * ordinary Buttons: they read `ButtonGroupContext` and give up the chrome the
 * group now draws (see `styles.segment` in button.tsx).
 *
 * This replaces a wrapper that collapsed borders through `[data-slot]` child
 * selectors copied from shadcn. Button never emitted `data-slot`, so none of
 * those rules matched: every Button kept its own 2px outline and 4px corners,
 * and neighbours met with a 4px doubled border.
 *
 * Every colour is Button's own `--btn-fill` / `--btn-bg` / `--btn-text` pair,
 * applied to the group by `buttonColorVariants`, so a group's `color` means
 * what a Button's does and the ink flips for dark mode the same way.
 * Hairlines take the text colour, per the masterbrand's line system.
 *
 * Every rule that reaches into a child uses the CHILD combinator (`&>`), never
 * a descendant one. A group is not meant to nest, but if one ever does, a
 * descendant rule from the outer band would re-ink the inner group's segments;
 * a child rule cannot.
 */
const buttonGroupVariants = cva(
  [
    'isolate inline-flex w-fit items-stretch overflow-hidden rounded-sm',
    // Dividers. A Button or ButtonGroupText carries `data-slot` and a 1px
    // transparent border, so the divider is that border recoloured on the
    // shared edge: no extra pixel, and the group's outer box stays exactly
    // one button tall. (ButtonGroupSeparator carries `data-slot` too but no
    // border and no size, so the hairline beside it is drawn by the segment
    // after it.) Keyed on orientation both ways so neither rule is a bare
    // utility the other overrides, and written as `[data-slot]~[data-slot]`
    // for specificity: Button's `dark:border-white/5` is a border-color
    // SHORTHAND at (0,2,0), and this longhand only beats it by specificity,
    // never by emission order (AGENTS.md §4, the two-build cascade).
    //
    // A disabled segment fades itself with `opacity-50`, and a divider drawn
    // on its own leading edge would fade with it — every hairline in the row
    // at full strength but the one before the disabled segment. So the
    // boundary before a disabled segment is drawn on the trailing edge of the
    // segment BEFORE it instead, and the disabled segment's own leading edge
    // stays transparent.
    'data-[orientation=horizontal]:[&>[data-slot]~[data-slot]:not([data-disabled])]:border-s-(--divider)',
    'data-[orientation=horizontal]:[&>[data-slot]:has(+[data-slot][data-disabled])]:border-e-(--divider)',
    'data-[orientation=vertical]:[&>[data-slot]~[data-slot]:not([data-disabled])]:border-t-(--divider)',
    'data-[orientation=vertical]:[&>[data-slot]:has(+[data-slot][data-disabled])]:border-b-(--divider)',
    // Two solid segments side by side (a split button): the ink divider would
    // vanish on the fill, so the seam is a reversed hairline in the label
    // colour. Above the general divider on specificity, and with the same
    // disabled handling.
    'data-[orientation=horizontal]:[&>[data-slot][data-variant=solid]+[data-slot][data-variant=solid]:not([data-disabled])]:border-s-(--btn-text)/30',
    'data-[orientation=horizontal]:[&>[data-slot][data-variant=solid]:has(+[data-slot][data-variant=solid][data-disabled])]:border-e-(--btn-text)/30',
    'data-[orientation=vertical]:[&>[data-slot][data-variant=solid]+[data-slot][data-variant=solid]:not([data-disabled])]:border-t-(--btn-text)/30',
    'data-[orientation=vertical]:[&>[data-slot][data-variant=solid]:has(+[data-slot][data-variant=solid][data-disabled])]:border-b-(--btn-text)/30',
  ],
  {
    variants: {
      variant: {
        // A 1px hairline frame in the ink, drawn as an inset ring so it adds
        // no height: the group is exactly as tall as a lone Button beside it.
        // No fill of its own, like Button's outline: the surface shows
        // through, so a `white` outline group on a dark panel stays a frame.
        outline: 'ring-1 ring-(--btn-bg) [--divider:var(--btn-bg)] ring-inset',
        // The band.
        solid: [
          'bg-(--btn-fill) [--divider:color-mix(in_oklab,var(--btn-text)_30%,transparent)]',
          // Any segment that is not itself solid is painted on the band, so
          // its ink becomes the band's label colour: white label, white/10
          // hover, white ring, and a soft child's tint becomes white/10 too.
          // `--btn-text` is the same variable `solid` pairs with `--btn-fill`,
          // so every colour token's label works. The press overlay takes
          // solid's own black/15 so a band and a lone solid Button give the
          // same feedback. (0,3,0) against the colour token's (0,1,0) and its
          // dark-mode ink at (0,2,0).
          '[&>[data-slot=button]:not([data-variant=solid])]:[--btn-bg:var(--btn-text)]',
          '[&>[data-slot=button]:not([data-variant=solid])]:[--btn-active-overlay:var(--color-black)]/15',
          // The text cell sits on the band in its label colour, at the label
          // weight so it reads as a label rather than as another button.
          '[&>[data-slot=button-group-text]]:bg-transparent [&>[data-slot=button-group-text]]:font-medium [&>[data-slot=button-group-text]]:text-(--btn-text)',
        ],
        // Button's soft pair — ink at 10%, 20% in dark — as a band. The text
        // cell sits on the band.
        soft: 'bg-(--btn-bg)/10 [--divider:color-mix(in_oklab,var(--btn-bg)_30%,transparent)] dark:bg-(--btn-bg)/20 [&>[data-slot=button-group-text]]:bg-transparent',
        // Button's surface pair: ink at 5% inside an ink/50 hairline.
        surface:
          'bg-(--btn-bg)/5 ring-1 ring-(--btn-bg)/50 [--divider:color-mix(in_oklab,var(--btn-bg)_50%,transparent)] ring-inset dark:bg-(--btn-bg)/30 [&>[data-slot=button-group-text]]:bg-transparent',
        // No frame, no fill: only the hairlines between segments remain.
        ghost: '[--divider:var(--btn-bg)]',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      variant: DEFAULT_GROUP_VARIANT,
      orientation: DEFAULT_GROUP_ORIENTATION,
    },
  },
)

/** The group variants a ButtonGroup can paint. `link` has no group form. */
type ButtonGroupVariant = NonNullable<VariantProps<typeof buttonGroupVariants>['variant']>

type ButtonGroupProps = Omit<React.ComponentProps<'div'>, 'color'> &
  VariantProps<typeof buttonGroupVariants> & {
    /**
     * Colour token, with Button's meaning: `primary` by default. Sets the
     * ink the frame, band and dividers are drawn in, and the default colour
     * of every segment.
     */
    color?: ButtonProps['color']
    /**
     * Scale step, with Button's meaning. The default size of every segment.
     * `icon` is not offered: it is a 40px chrome square, and the group clips
     * to its own box, so the 44px touch expansion Button adds on a coarse
     * pointer would be cut off. Pair `iconOnly` with `sm` instead.
     */
    size?: Exclude<ButtonProps['size'], 'icon'>
  }

/**
 * Joins a row (or column) of Buttons into one control. Takes Button's variant
 * family — `outline` (the default), `solid`, `soft`, `surface`, `ghost` — and
 * its colour tokens and size steps, and hands them to its segments as
 * defaults. A segment may name its own emphasis: a `solid` Save inside an
 * outline group is the primary action of that row.
 *
 * Children are Buttons (or ButtonLinks), `ButtonGroupText` for an inline
 * label, and `ButtonGroupSeparator` for a semantic boundary. It is a group of
 * buttons, not a general control frame — an input or select with an attached
 * action is InputGroup's job — and groups do not nest.
 *
 * A popup opened from a segment (a split button's menu) renders through a
 * portal, which React context follows. Every popup in this package resets the
 * group context at its portal, so the Buttons inside render normally; wrap
 * the contents of an overlay from another library in `ButtonGroupBoundary`
 * to get the same.
 */
function ButtonGroup({
  className,
  variant,
  orientation,
  color,
  size,
  children,
  ...props
}: ButtonGroupProps) {
  const resolvedVariant = variant ?? DEFAULT_GROUP_VARIANT
  const resolvedOrientation = orientation ?? DEFAULT_GROUP_ORIENTATION
  const context = React.useMemo<ButtonGroupContextValue>(
    () => ({ color, size, orientation: resolvedOrientation }),
    [color, size, resolvedOrientation],
  )

  return (
    <div
      role='group'
      data-slot='button-group'
      data-variant={resolvedVariant}
      data-orientation={resolvedOrientation}
      className={cn(
        buttonColorVariants({ color }),
        buttonGroupVariants({ variant: resolvedVariant, orientation: resolvedOrientation }),
        className,
      )}
      {...props}
    >
      <ButtonGroupContext.Provider value={context}>{children}</ButtonGroupContext.Provider>
    </div>
  )
}

/**
 * An inline label between segments — a unit, a count, a mode. Sits at the
 * body size (16px), never smaller: it shares a line with 16px button labels,
 * so anything below that reads as fine print. Semibold, the weight the
 * InputGroup addon uses for the same job. On a framed or ghost group it sits
 * on the sunken surface so it reads as chrome rather than as a button; on a
 * band it sits on the band, and a solid band gives it the band's label colour
 * at the label weight (see `buttonGroupVariants`).
 */
function ButtonGroupText({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          // The transparent border is what the group's divider recolours, and
          // the background stops at the padding box so the group's inset frame
          // shows through that border on the top and bottom edges.
          'flex items-center gap-2 border border-transparent bg-(--surface-sunken) bg-clip-padding px-4 text-base font-semibold text-muted-foreground select-none',
          // A glyph beside the text matches Button's 24px label glyph.
          "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'button-group-text',
    },
  })
}

/**
 * A semantic boundary between segments. Every segment is already divided by
 * a hairline, so the separator draws nothing of its own — it exists for
 * assistive technology, which hears it as a region boundary, and it follows
 * the group's orientation unless told otherwise.
 */
function ButtonGroupSeparator({
  className,
  orientation,
  ...props
}: React.ComponentProps<typeof Separator>) {
  const group = React.useContext(ButtonGroupContext)
  const resolvedOrientation =
    orientation ?? (group?.orientation === 'vertical' ? 'horizontal' : 'vertical')

  return (
    <Separator
      data-slot='button-group-separator'
      orientation={resolvedOrientation}
      className={cn(
        // Zero-size on its own axis and transparent: the hairline beside it
        // is the group's divider, not this element. Same variant keys as the
        // primitive's own sizing so tailwind-merge resolves them here.
        'self-stretch bg-transparent data-[orientation=horizontal]:h-0 data-[orientation=vertical]:w-0',
        className,
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupBoundary,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
export type { ButtonGroupProps, ButtonGroupVariant }

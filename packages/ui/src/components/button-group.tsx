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
 * what a Button's does: the ink flips for dark mode the same way, and on a
 * soft or surface band it steps to the darker ink those tints need the same
 * way (`styles.tintInk` in button.tsx). The segments learn they sit on that
 * tint from the `band` the context carries, and step their own colour's ink,
 * so a segment naming another colour keeps it. Hairlines take the text
 * colour, per the masterbrand's line system. These classes therefore only
 * paint on an element that also carries `buttonColorVariants` —
 * `ring-(--btn-bg)` is invalid without it — so a consumer extending the
 * group's styling applies the two together, as `ButtonGroup` does.
 *
 * Two kinds of rule reach a segment. What depends on the segment's
 * NEIGHBOURS — dividers, seams, the text cell — lives here and uses the CHILD
 * combinator (`&>`) and sibling combinators, so it needs the segments to be
 * direct children. What depends only on the BAND — the re-ink on a solid
 * band, the frame-revealing `bg-clip-padding` — lives on the segment itself,
 * keyed on the `data-band` the group tells it through context, so it holds
 * for a segment rendered through a trigger's `render` prop or wrapped in a
 * span. Never a descendant rule: a group is not meant to nest, but if one
 * ever does, a descendant rule from the outer band would re-ink the inner
 * group's segments.
 */
const buttonGroupVariants = cva(
  [
    'isolate inline-flex w-fit items-stretch overflow-hidden rounded-sm',
    // `items-stretch` above is what makes every segment the same size across
    // the group's cross axis — except an icon-only one, which `styles.iconOnly`
    // squares with `size-(--btn-h)`. A definite cross size is precisely the
    // case flexbox does NOT stretch (CSS Flexbox §9.4: stretch applies only
    // when the cross-size property computes to `auto`), so the square holds its
    // 52px whatever the segments beside it do. In a column that is every mixed
    // group: a 52px square in a 135px band, with a void beside it and the
    // hairline above it stopping a third of the way across. In a row it needs a
    // label to wrap first, which `min-h-(--btn-h)` on the button explicitly
    // allows — a floor, not a fixed height — and then the square sits at the
    // top of a 136px row.
    //
    // So the group releases the cross dimension and lets `items-stretch` do its
    // work, keeping the main one: the square stays a square whenever its
    // neighbours are one line tall, and grows with them when they are not.
    // Keyed on the group's own orientation, so neither rule is a bare utility
    // the other has to override, and reached through the child combinator, so
    // a nested icon button (inside a popup opened from a segment, say) is not
    // touched. (0,3,0) against `size-(--btn-h)`'s (0,1,0).
    'data-[orientation=horizontal]:[&>[data-slot][data-icon-only]]:h-auto',
    'data-[orientation=vertical]:[&>[data-slot][data-icon-only]]:w-auto',
    // The band's label colour, resolved HERE from the group's own colour
    // token and inherited by every segment as a computed value. A segment on
    // a solid band re-points its ink to this (see `styles.segment` in
    // button.tsx); publishing it from the group is what stops a segment that
    // names its own `color` from reading its own `--btn-text` instead.
    '[--group-label:var(--btn-text)]',
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
    // `loading` reaches these rules as well as `disabled`: Button derives
    // `disabled` from either, so a busy segment is a disabled one here. The
    // boundary therefore moves by a pixel when a request starts, which is the
    // contract holding rather than breaking — the alternative is a
    // half-strength hairline beside an enabled control for as long as the
    // request runs. `Segment Props` pins it.
    //
    // A disabled segment fades itself with `opacity-50`, and a divider drawn
    // on its own leading edge would fade with it — leaving one weak hairline
    // in an otherwise full-strength row, right where the eye reads the join.
    // So the boundary before a disabled segment is drawn on the trailing edge
    // of the segment BEFORE it instead, and the disabled segment's own
    // leading edge stays transparent. A separator between the two has no edge
    // to paint, so the rule also looks through one.
    //
    // The one hairline this does NOT lift out of the fade is the one BETWEEN
    // two adjacent disabled segments: its only available edge belongs to a
    // disabled element either way, so it renders at 50% like the pair it
    // divides. That is the coherent reading — the whole run is unavailable,
    // and a full-strength line inside it would draw more attention than the
    // controls do — and lifting it would mean moving dividers off the
    // segments entirely, onto a layer the group owns. `Disabled` renders the
    // case and pins where each edge lands.
    'data-[orientation=horizontal]:[&>[data-slot]~[data-slot]:not([data-disabled])]:border-s-(--divider)',
    'data-[orientation=horizontal]:[&>[data-slot]:has(+[data-slot][data-disabled])]:border-e-(--divider)',
    'data-[orientation=horizontal]:[&>[data-slot]:has(+[data-slot=button-group-separator]+[data-slot][data-disabled])]:border-e-(--divider)',
    'data-[orientation=vertical]:[&>[data-slot]~[data-slot]:not([data-disabled])]:border-t-(--divider)',
    'data-[orientation=vertical]:[&>[data-slot]:has(+[data-slot][data-disabled])]:border-b-(--divider)',
    'data-[orientation=vertical]:[&>[data-slot]:has(+[data-slot=button-group-separator]+[data-slot][data-disabled])]:border-b-(--divider)',
    // Two solid segments side by side (a split button): the ink divider would
    // vanish on the fill, so the seam is a reversed hairline in the label
    // colour. Above the general divider on specificity, with the same
    // disabled handling, and again looking through a separator.
    'data-[orientation=horizontal]:[&>[data-slot][data-variant=solid]+[data-slot][data-variant=solid]:not([data-disabled])]:border-s-(--btn-text)/30',
    'data-[orientation=horizontal]:[&>[data-slot][data-variant=solid]+[data-slot=button-group-separator]+[data-slot][data-variant=solid]:not([data-disabled])]:border-s-(--btn-text)/30',
    'data-[orientation=horizontal]:[&>[data-slot][data-variant=solid]:has(+[data-slot][data-variant=solid][data-disabled])]:border-e-(--btn-text)/30',
    'data-[orientation=horizontal]:[&>[data-slot][data-variant=solid]:has(+[data-slot=button-group-separator]+[data-slot][data-variant=solid][data-disabled])]:border-e-(--btn-text)/30',
    'data-[orientation=vertical]:[&>[data-slot][data-variant=solid]+[data-slot][data-variant=solid]:not([data-disabled])]:border-t-(--btn-text)/30',
    'data-[orientation=vertical]:[&>[data-slot][data-variant=solid]+[data-slot=button-group-separator]+[data-slot][data-variant=solid]:not([data-disabled])]:border-t-(--btn-text)/30',
    'data-[orientation=vertical]:[&>[data-slot][data-variant=solid]:has(+[data-slot][data-variant=solid][data-disabled])]:border-b-(--btn-text)/30',
    'data-[orientation=vertical]:[&>[data-slot][data-variant=solid]:has(+[data-slot=button-group-separator]+[data-slot][data-variant=solid][data-disabled])]:border-b-(--btn-text)/30',
  ],
  {
    variants: {
      variant: {
        // A 1px hairline frame in the ink, drawn as an inset ring so it adds
        // no height: the group is exactly as tall as a lone Button beside it.
        // No fill of its own, like Button's outline: the surface shows
        // through, so a `white` outline group on a dark panel stays a frame.
        // Forced-colours mode discards box shadows, so the frame is restated
        // there as an outline, which that mode keeps and recolours. The text
        // cell stops its background at the padding box so the frame shows
        // through its transparent border.
        outline: [
          'ring-1 ring-(--btn-bg) [--divider:var(--btn-bg)] ring-inset',
          'forced-colors:outline forced-colors:outline-1 forced-colors:-outline-offset-1',
          '[&>[data-slot=button-group-text]]:bg-clip-padding',
        ],
        // The band. Segments re-ink themselves on it (see `styles.segment` in
        // button.tsx); the text cell sits on the band in its label colour, at
        // the label weight so it reads as a label rather than as another
        // button.
        solid: [
          'bg-(--btn-fill) [--divider:color-mix(in_oklab,var(--btn-text)_30%,transparent)]',
          '[&>[data-slot=button-group-text]]:bg-transparent [&>[data-slot=button-group-text]]:font-medium [&>[data-slot=button-group-text]]:text-(--btn-text)',
        ],
        // Button's soft pair — ink at 10%, 20% in dark — as a band. The text
        // cell sits on the band.
        soft: 'bg-(--btn-bg)/10 [--divider:color-mix(in_oklab,var(--btn-bg)_30%,transparent)] dark:bg-(--btn-bg)/20 [&>[data-slot=button-group-text]]:bg-transparent',
        // Button's surface pair: ink at 5% inside an ink/50 hairline, restated
        // as an outline for forced colours like the outline frame.
        surface: [
          'bg-(--btn-bg)/5 ring-1 ring-(--btn-bg)/50 [--divider:color-mix(in_oklab,var(--btn-bg)_50%,transparent)] ring-inset dark:bg-(--btn-bg)/30',
          'forced-colors:outline forced-colors:outline-1 forced-colors:-outline-offset-1',
          '[&>[data-slot=button-group-text]]:bg-transparent',
        ],
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
     * pointer would be cut off. A segment that asks for `icon` anyway renders
     * as `iconOnly` at the group's own step, so it lines up with the segments
     * beside it.
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
 * label, and `ButtonGroupSeparator` for a semantic boundary, as DIRECT
 * children: the hairlines between segments are drawn on the segments' shared
 * edges, so a segment wrapped in another element (a span holding a tooltip
 * on a disabled segment, say) keeps its label and its band treatment but
 * loses the hairlines it shares with its neighbours — the one before it, and
 * the one after it too when the wrapped segment is the first child. It is a group of buttons, not a general
 * control frame — an input or select with an attached action is InputGroup's
 * job — and groups do not nest.
 *
 * A popup opened from a segment (a split button's menu) renders through a
 * portal, which React context follows. Every popup in this package resets the
 * group context at its portal, so the Buttons inside render normally; wrap
 * the contents of an overlay from another library in `ButtonGroupBoundary`
 * to get the same. Without that reset a Button inside the popup renders as a
 * segment of the group it was opened from, and on a solid band that means its
 * label takes the band's colour — white on the popup's own surface.
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
  // `null` is admitted by both prop types (they borrow Button's, which allow
  // it) and is the idiomatic way to thread an optional prop through a
  // wrapper. cva reads it as "no variant" rather than "unspecified", so an
  // unnormalised `null` would emit no size or colour classes AT ALL — and
  // because a segment resolves `color ?? group.color`, one `null` on the
  // group would turn every child's own `undefined` into an explicit `null`
  // and un-style the whole row: no padding, no height, and a frame still
  // pointing at a `--btn-bg` nothing defines. Normalising here means the
  // group and its segments both fall back to the same cva defaults a lone
  // Button gets.
  const resolvedColor = color ?? undefined
  const resolvedSize = size ?? undefined
  const context = React.useMemo<ButtonGroupContextValue>(
    () => ({
      band: resolvedVariant,
      color: resolvedColor,
      size: resolvedSize,
      orientation: resolvedOrientation,
    }),
    [resolvedVariant, resolvedColor, resolvedSize, resolvedOrientation],
  )

  return (
    <div
      role='group'
      data-slot='button-group'
      className={cn(
        buttonColorVariants({ color: resolvedColor, variant: resolvedVariant }),
        buttonGroupVariants({ variant: resolvedVariant, orientation: resolvedOrientation }),
        className,
      )}
      {...props}
      // AFTER the spread, so that no prop can override these two — unlike
      // `data-slot` above, and unlike Button, which puts its own stamps first
      // so InputGroupButton can relabel them. `data-orientation` is what every
      // divider rule keys on, while the flex direction comes from the cva
      // variant and the separator's axis from the context — neither of which
      // a prop can reach. If a prop could override it, a row handed
      // `data-orientation='vertical'` would paint column dividers across
      // itself. Nothing in the package keys on `data-variant` (the band
      // treatment reaches the segments through `data-band` instead), but it is
      // the group's public description of itself, and stamped last it cannot
      // be made to contradict the variant the group actually paints. The
      // Segment Props play pins both. `data-slot` stays first because
      // relabelling a group is the same escape hatch Button offers.
      data-variant={resolvedVariant}
      data-orientation={resolvedOrientation}
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
          // The transparent border is what the group's divider recolours.
          'flex items-center gap-2 border border-transparent bg-(--surface-sunken) px-4 text-base font-semibold text-muted-foreground select-none',
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

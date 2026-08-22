'use client'

import type * as React from 'react'

import { Slider as SliderPrimitive } from '@base-ui/react/slider'

import { cn } from '../lib/utils.js'

/**
 * Styled Base UI Slider parts, exported for layouts the composed `Slider`
 * below does not cover (a two-thumb range with its own labelling, a vertical
 * slider in a toolbar, a value readout somewhere other than beside the label).
 *
 * All keyboard, pointer, ARIA and form behaviour comes from Base UI —
 * arrow/Home/End/PageUp/PageDown stepping, `role="slider"`,
 * `aria-valuenow`/`-valuemin`/`-valuemax`, thumb focus management, and RTL.
 * Nothing here re-implements any of it (AGENTS.md §8, "never hand-roll ARIA").
 */
function SliderRoot<Value extends number | readonly number[] = number>({
  className,
  ...props
}: SliderPrimitive.Root.Props<Value>) {
  return (
    <SliderPrimitive.Root<Value>
      data-slot='slider'
      className={cn(
        'flex w-full touch-none items-center select-none data-disabled:pointer-events-none',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The interactive area. Larger than the visible track, for a 24px pointer
 * target.
 *
 * The disabled fade lives HERE rather than on the root, which is where the
 * reflex is to put it (and where `Button` puts its own). On a Button, the faded
 * text sits on a solid fill and survives; on a slider the label and value are
 * plain text on the page background, and fading them took the label to 3.55:1
 * and the readout to 2.39:1 — both below the 4.5:1 minimum, caught by the axe
 * check on the Disabled story. A disabled control still has to be readable
 * (WCAG 2.2, 1.4.3), so only the track, indicator and thumb dim; the label and
 * value keep their contrast, and the root just stops taking pointer events.
 */
function SliderControl({ className, ...props }: SliderPrimitive.Control.Props) {
  return (
    <SliderPrimitive.Control
      data-slot='slider-control'
      className={cn(
        'flex w-full flex-1 items-center py-3 data-disabled:opacity-50',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:justify-center data-[orientation=vertical]:px-3 data-[orientation=vertical]:py-0',
        className,
      )}
      {...props}
    />
  )
}

/** The unfilled rail. */
function SliderTrack({ className, ...props }: SliderPrimitive.Track.Props) {
  return (
    <SliderPrimitive.Track
      data-slot='slider-track'
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-muted',
        'data-[orientation=horizontal]:h-2 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2',
        className,
      )}
      {...props}
    />
  )
}

/** The filled portion, from `min` to the current value. */
function SliderIndicator({ className, ...props }: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot='slider-indicator'
      className={cn('rounded-full bg-primary select-none', className)}
      {...props}
    />
  )
}

/**
 * The draggable handle.
 *
 * `border-background` rather than `border-white`: the ring separating the thumb
 * from the track has to read against the page surface, which is near-black in
 * dark mode, so a hardcoded white would invert the effect exactly where it
 * matters most.
 */
function SliderThumb({ className, ...props }: SliderPrimitive.Thumb.Props) {
  return (
    <SliderPrimitive.Thumb
      data-slot='slider-thumb'
      className={cn(
        'size-5 rounded-full border-2 border-background bg-primary shadow-sm',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'data-[dragging]:scale-110 motion-safe:transition-transform',
        className,
      )}
      {...props}
    />
  )
}

/** The current value, rendered as an `<output>` by Base UI. */
function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot='slider-value'
      className={cn('text-base tabular-nums', className)}
      {...props}
    />
  )
}

/** The slider's visible label, associated by Base UI. */
function SliderLabel({ className, ...props }: SliderPrimitive.Label.Props) {
  return (
    <SliderPrimitive.Label
      data-slot='slider-label'
      className={cn('text-base font-semibold', className)}
      {...props}
    />
  )
}

type SliderProps<Value extends number | readonly number[] = number> = Omit<
  SliderPrimitive.Root.Props<Value>,
  'children'
> & {
  /**
   * Visible label. Omit only when the control is labelled from outside — via
   * `Field`/`FieldLabel`, or an `aria-label` on the root — never leave it
   * unnamed (WCAG 2.2, 4.1.2).
   */
  label?: React.ReactNode
  /** Show the live value beside the label. Defaults to `true`. */
  showValue?: boolean
  /**
   * Unit appended to the readout, e.g. `'px'` or `'%'`. Purely visual — Base
   * UI announces the underlying number, so use `format` on the root for a unit
   * assistive tech should hear.
   */
  suffix?: React.ReactNode
  /** Optional leading glyph, sized and hidden from assistive tech here. */
  icon?: React.ElementType
}

/**
 * A slider for choosing a number from a range.
 *
 * Composes the parts above into the common layout: label and live value on one
 * row, track beneath. For anything else, import the parts directly.
 *
 * ```tsx
 * <Slider label='Size' defaultValue={56} min={16} max={140} suffix='px' />
 * ```
 *
 * **Inside a `Field` it needs no `label` of its own.** Base UI's Slider reads
 * the surrounding Field context (`SliderRootState` extends `FieldRootState`),
 * so `FieldLabel`, `FieldDescription` and `FieldError` associate with it the
 * same way they do for `Input` — passing both would name the control twice.
 *
 * **Range sliders work through the parts, not this wrapper.** Pass an array
 * `value` and Base UI renders one thumb per entry, but a single visible label
 * cannot correctly name two thumbs; build those from `SliderRoot` and give
 * each `SliderThumb` its own accessible name.
 */
function Slider<Value extends number | readonly number[] = number>({
  className,
  label,
  showValue = true,
  suffix,
  icon: Icon,
  ...props
}: SliderProps<Value>) {
  return (
    <SliderRoot<Value> className={cn('flex-col items-stretch gap-1', className)} {...props}>
      {label || showValue ? (
        <div data-slot='slider-header' className='flex items-center gap-3'>
          {Icon ? (
            <Icon aria-hidden='true' className='size-5 shrink-0 text-muted-foreground' />
          ) : null}
          {label ? <SliderLabel>{label}</SliderLabel> : null}
          {showValue ? (
            <SliderValue className='ms-auto text-muted-foreground'>
              {(formattedValues) => (
                <>
                  {formattedValues.join(' – ')}
                  {suffix}
                </>
              )}
            </SliderValue>
          ) : null}
        </div>
      ) : null}
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  )
}

export {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
}
export type { SliderProps }

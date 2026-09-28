'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { IconCheck } from '../icons/check.js'
import { cn } from '../lib/utils.js'

function Switch({
  className,
  size = 'default',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default'
}) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      data-size={size}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-(--text-default) bg-(--input-surface) motion-safe:transition-colors',
        // Checkbox's theme bridge, so brand overrides reach both modes. The
        // thumb reads these too: ink for the fill and tick, mark for the thumb
        // on a selected track, off for the ring on an unselected one.
        '[--switch-ink:var(--color-primary-800)] [--switch-mark:var(--surface-default)] [--switch-off:var(--text-default)] dark:not-data-disabled:not-aria-invalid:[--switch-ink:var(--color-primary-200)]',
        // The padding puts the thumb 5px (sm: 4px) inside the outer edge,
        // Checkbox's inset, and fixes its travel at the track minus both insets.
        'data-[size=default]:h-8 data-[size=default]:w-14 data-[size=default]:px-1 data-[size=sm]:h-6 data-[size=sm]:w-10 data-[size=sm]:px-0.75',
        // A 44px hit area without making the visible control larger. The
        // pseudo-element sizes from the padding box, so add the border back.
        'after:absolute after:top-1/2 after:left-1/2 after:h-11 after:w-[calc(100%+2px)] after:min-w-11 after:-translate-1/2',
        'data-checked:border-(--switch-ink) data-checked:bg-(--switch-ink)',
        'not-data-disabled:data-checked:hover:bg-[color-mix(in_srgb,var(--switch-ink)_88%,var(--input-surface))] not-data-disabled:data-unchecked:hover:bg-[color-mix(in_srgb,var(--switch-ink)_10%,var(--input-surface))]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--switch-ink)',
        // Input's invalid roles. The second pixel of the off border is an inset
        // ring rather than border-2, so the thumb does not shift by a pixel.
        'aria-invalid:not-data-disabled:[--switch-ink:var(--danger-solid)] aria-invalid:not-data-disabled:[--switch-mark:var(--white)] aria-invalid:focus-visible:outline-offset-2 aria-invalid:focus-visible:outline-(--input-invalid-ring) aria-invalid:not-data-disabled:data-unchecked:border-(--input-invalid-border) aria-invalid:not-data-disabled:data-unchecked:inset-ring aria-invalid:not-data-disabled:data-unchecked:inset-ring-(--input-invalid-border) aria-invalid:not-data-disabled:data-unchecked:hover:bg-(--input-invalid-surface-hover)',
        // Base UI renders a span: data-disabled covers both the prop and Field.
        'data-disabled:cursor-not-allowed data-disabled:border-(--text-subtle) data-disabled:[--switch-ink:var(--text-subtle)] data-disabled:[--switch-off:var(--text-subtle)]',
        className,
      )}
      {...props}
    >
      {/* Off is a hollow ring, on is a solid thumb with a tick, so the state
          reads by shape as well as by colour and side. */}
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'pointer-events-none grid shrink-0 place-items-center rounded-full bg-(--input-surface) text-(--switch-ink) inset-ring-2 inset-ring-(--switch-off) motion-safe:transition-[translate,background-color,box-shadow]',
          'group-data-[size=default]/switch:size-5.5 group-data-[size=sm]/switch:size-4 group-data-[size=default]/switch:[&>svg]:size-4.5 group-data-[size=sm]/switch:[&>svg]:size-3',
          'not-data-disabled:data-unchecked:group-hover/switch:bg-[color-mix(in_srgb,var(--switch-ink)_10%,var(--input-surface))] group-aria-invalid/switch:not-data-disabled:data-unchecked:group-hover/switch:bg-(--input-invalid-surface-hover)',
          'data-checked:bg-(--switch-mark) data-checked:inset-ring-0',
          'group-data-[size=default]/switch:data-checked:translate-x-6 group-data-[size=sm]/switch:data-checked:translate-x-4 rtl:group-data-[size=default]/switch:data-checked:-translate-x-6 rtl:group-data-[size=sm]/switch:data-checked:-translate-x-4',
        )}
        render={(thumbProps, state) => (
          <span {...thumbProps}>{state.checked ? <IconCheck aria-hidden /> : null}</span>
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

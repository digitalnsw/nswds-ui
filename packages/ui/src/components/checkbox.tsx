'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'

import { IconCheck } from '../icons/check.js'
import { IconRemove } from '../icons/remove.js'
import { cn } from '../lib/utils.js'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn(
        'peer relative inline-flex size-8 shrink-0 items-center justify-center rounded-sm border border-(--text-default) bg-(--input-surface) motion-safe:transition-colors',
        // Use the theme's bridge scale so brand overrides reach both modes.
        // The inset stays centred at 22px even with a 2px invalid border.
        '[--checkbox-ink:var(--color-primary-800)] [--checkbox-mark:var(--surface-default)] dark:not-data-disabled:not-aria-invalid:[--checkbox-ink:var(--color-primary-200)]',
        // A 44px hit area without making the visible 32px control larger.
        'after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2',
        'not-data-disabled:hover:bg-[color-mix(in_srgb,var(--checkbox-ink)_10%,var(--input-surface))]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--checkbox-ink)',
        // Use Input's invalid roles, including its focus and hover treatment.
        'aria-invalid:not-data-disabled:border-2 aria-invalid:not-data-disabled:border-(--input-invalid-border) aria-invalid:not-data-disabled:[--checkbox-ink:var(--danger-solid)] aria-invalid:not-data-disabled:[--checkbox-mark:var(--white)] aria-invalid:not-data-disabled:hover:bg-(--input-invalid-surface-hover) aria-invalid:focus-visible:outline-offset-2 aria-invalid:focus-visible:outline-(--input-invalid-ring)',
        // Base UI renders a span: data-disabled covers both the prop and Field.
        'data-disabled:cursor-not-allowed data-disabled:border-(--text-subtle) data-disabled:[--checkbox-ink:var(--text-subtle)]',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='pointer-events-none absolute top-1/2 left-1/2 size-5.5 -translate-1/2 bg-(--checkbox-ink) text-(--checkbox-mark) [&>svg]:absolute [&>svg]:top-1/2 [&>svg]:left-1/2 [&>svg]:size-6 [&>svg]:-translate-1/2'
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            {state.indeterminate ? <IconRemove aria-hidden /> : <IconCheck aria-hidden />}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

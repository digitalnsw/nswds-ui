'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { IconCheck } from '../icons/check.js'
import { IconClose } from '../icons/close.js'
import { IconRemove } from '../icons/remove.js'
import { labelColorVariants, type LabelColor } from '../lib/label-colors.js'
import { cn } from '../lib/utils.js'
import { Link } from './link.js'

const tagCva = cva(
  [
    'relative isolate inline-flex max-w-full items-center justify-center gap-2 rounded-sm border text-start align-middle font-normal',
    // A variable rather than a fixed size: this descendant rule outranks a
    // class on the icon itself, so a nested control resizes by resetting it.
    '[--tag-icon-size:--spacing(4)] [&_[data-slot=icon]]:inline-block [&_[data-slot=icon]]:size-(--tag-icon-size) [&_[data-slot=icon]]:shrink-0 [&_[data-slot=icon]]:align-middle',
    '[--btn-hover-overlay:color-mix(in_oklab,var(--btn-bg)_10%,transparent)]',
    '[--btn-active-overlay:color-mix(in_oklab,var(--btn-bg)_20%,transparent)]',
  ],
  {
    variants: {
      variant: {
        solid: 'border-transparent bg-(--btn-fill) text-(--btn-text)',
        soft: 'border-transparent bg-(--btn-bg)/10 text-(--btn-bg) dark:bg-(--btn-bg)/20',
        surface: 'border-(--btn-bg)/50 bg-(--btn-bg)/5 text-(--btn-bg) dark:bg-(--btn-bg)/20',
        outline: 'border-(--btn-bg)/40 bg-transparent text-(--btn-bg)',
      },
      size: {
        sm: 'px-2 py-0.5 text-sm/5',
        default: 'px-3 py-1 text-base/6',
        lg: 'px-4 py-2 text-base/6',
      },
      interactive: {
        true: [
          // Actual layout space, so wrapping tags never have overlapping hit areas.
          'min-h-12 min-w-12 cursor-pointer border-(--btn-bg) no-underline hover:no-underline focus:no-underline active:no-underline',
          'motion-safe:transition-[color,background-color,border-color,opacity]',
          'after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit]',
          'not-data-disabled:hover:after:bg-(--btn-hover-overlay) not-data-disabled:active:after:bg-(--btn-active-overlay)',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--btn-bg)',
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          'forced-colors:border-[ButtonText] forced-colors:focus-visible:outline-[Highlight]',
        ],
        false: '',
      },
    },
    compoundVariants: [{ interactive: true, variant: 'solid', className: 'border-transparent' }],
    defaultVariants: { variant: 'outline', size: 'default', interactive: false },
  },
)

type TagVariantProps = NonNullable<Parameters<typeof tagCva>[0]> & { color?: LabelColor | null }

function tagVariants({
  color = 'primary',
  variant = 'outline',
  class: classValue,
  className,
  ...props
}: TagVariantProps = {}) {
  return cn(
    tagCva({ ...props, variant }),
    labelColorVariants(color, variant),
    classValue,
    className,
  )
}

type TagAppearance = Omit<VariantProps<typeof tagVariants>, 'interactive'>
type TagProps = TagAppearance &
  React.ComponentPropsWithoutRef<'span'> & {
    ref?: React.Ref<HTMLSpanElement>
  }

/** A non-interactive category or topic. Use Badge for status and counts. */
function Tag({ variant = 'outline', color, size, className, children, ...props }: TagProps) {
  return (
    <span
      data-slot='tag'
      {...props}
      data-variant={variant}
      className={tagVariants({ variant, color, size, className })}
    >
      <span className='min-w-0 [overflow-wrap:anywhere]'>{children}</span>
    </span>
  )
}

type TagButtonProps = TagAppearance &
  Omit<ButtonPrimitive.Props, 'className'> & { className?: string }
type TagLinkProps = TagAppearance & Omit<React.ComponentProps<typeof Link>, 'variant' | 'color'>

/** A tag-shaped button. Prefer TagCheckbox for selectable filters. */
function TagButton({
  variant = 'outline',
  color,
  size,
  className,
  children,
  ...props
}: TagButtonProps) {
  return (
    <ButtonPrimitive
      data-slot='tag-button'
      {...props}
      data-variant={variant}
      className={tagVariants({ variant, color, size, interactive: true, className })}
    >
      <span className='min-w-0 [overflow-wrap:anywhere]'>{children}</span>
    </ButtonPrimitive>
  )
}

/** Category navigation, including through LinkProvider. Never underlined. */
function TagLink({
  variant = 'outline',
  color,
  size,
  className,
  children,
  ...props
}: TagLinkProps) {
  return (
    <Link
      data-slot='tag-link'
      {...props}
      variant='unstyled'
      data-variant={variant}
      className={tagVariants({ variant, color, size, interactive: true, className })}
    >
      <span className='min-w-0 [overflow-wrap:anywhere]'>{children}</span>
    </Link>
  )
}

type TagCheckboxProps = Omit<TagAppearance, 'variant'> &
  Omit<CheckboxPrimitive.Root.Props, 'className'> & { className?: string }

/** Base UI owns selection, keyboard handling, form submission and disabled state. */
function TagCheckbox({ color, size, className, children, ...props }: TagCheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot='tag-checkbox'
      {...props}
      data-variant='outline'
      className={cn(
        tagVariants({ color, size, interactive: true }),
        // Selected labels sit on a tint, so use the same contrast adjustment as Button.
        labelColorVariants(color, 'surface'),
        color === 'white' || color === 'secondary'
          ? '[--tag-check-mark:var(--btn-text)]'
          : '[--tag-check-mark:var(--surface-default)]',
        'group/tag data-indeterminate:bg-(--btn-bg)/10 dark:data-indeterminate:bg-(--btn-bg)/20 data-checked:bg-(--btn-bg)/10 dark:data-checked:bg-(--btn-bg)/20',
        'aria-invalid:border-(--danger-solid) aria-invalid:focus-visible:outline-(--danger-solid)',
        className,
      )}
    >
      <span
        aria-hidden
        className='flex size-4 shrink-0 items-center justify-center rounded-sm border border-current group-data-indeterminate/tag:bg-(--btn-bg) group-data-checked/tag:bg-(--btn-bg)'
      >
        <CheckboxPrimitive.Indicator
          // Centre the glyph independently of the label's inherited line height.
          className='flex size-full items-center justify-center text-(--tag-check-mark) forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]'
          render={(indicatorProps, state) => (
            <span {...indicatorProps}>
              {state.indeterminate ? (
                <IconRemove className='size-4' />
              ) : (
                <IconCheck className='size-4' />
              )}
            </span>
          )}
        />
      </span>
      <span className='min-w-0 [overflow-wrap:anywhere]'>{children}</span>
    </CheckboxPrimitive.Root>
  )
}

type TagRemovableProps = TagProps & {
  /** Accessible action name, for example "Remove Education filter". */
  removeLabel: string
  onRemove: NonNullable<ButtonPrimitive.Props['onClick']>
  disabled?: boolean
}

/** The label stays static; only its separately named remove button is interactive. */
function TagRemovable({
  variant = 'surface',
  color,
  size,
  className,
  children,
  removeLabel,
  onRemove,
  disabled,
  ...props
}: TagRemovableProps) {
  return (
    <span
      data-slot='tag-removable'
      {...props}
      data-variant={variant}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        tagVariants({ variant, color, size }),
        'group/tag-removable min-h-12 py-0 pe-0',
        className,
      )}
    >
      <span className='min-w-0 [overflow-wrap:anywhere]'>{children}</span>
      <ButtonPrimitive
        aria-label={removeLabel}
        disabled={disabled}
        onClick={onRemove}
        className='flex size-12 shrink-0 items-center justify-center rounded-sm [--tag-icon-size:--spacing(5)] not-data-disabled:hover:bg-(--btn-hover-overlay) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--btn-bg) group-data-[variant=solid]/tag-removable:focus-visible:-outline-offset-2 group-data-[variant=solid]/tag-removable:focus-visible:outline-(--btn-text) not-data-disabled:active:bg-(--btn-active-overlay) forced-colors:focus-visible:outline-[Highlight] data-disabled:cursor-not-allowed data-disabled:opacity-50'
      >
        <IconClose aria-hidden />
      </ButtonPrimitive>
    </span>
  )
}

export { Tag, TagButton, TagCheckbox, TagLink, TagRemovable, tagVariants }
export type { TagButtonProps, TagCheckboxProps, TagLinkProps, TagProps, TagRemovableProps }

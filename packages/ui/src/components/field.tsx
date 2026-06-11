'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { useMemo } from 'react'

import { Label } from '../components/label.js'
import { Separator } from '../components/separator.js'
import { cn } from '../lib/utils.js'

// ─────────────────────────────────────────────────────────────────────────────
// Typography hierarchy (deliberate, do not collapse to a single size)
// ─────────────────────────────────────────────────────────────────────────────
//
// FieldLabel inherits its font-size from the Label primitive (`text-base/
// relaxed` = 16px) — the primary form text users read when scanning a form,
// kept at the 16px ideal for body copy.
// Every supporting element in this file uses `text-sm/relaxed` (14px). That
// is below the 16px body-copy ideal but comfortably above the 12px floor
// older versions used, so it still reads clearly as secondary information.
// The 16/14 gap is intentional: it preserves a scannable visual hierarchy
// (label > description / error / metadata) without shrinking supporting text
// back down to the previous 12px.
//
// If you find yourself wanting to bump these to text-base, do it in
// `label.tsx` so FieldLabel moves with the family. If you want to drop
// them to text-xs, please raise that as a design decision — 12px is below
// the NSW Government digital service standards minimum body-text size.
// ─────────────────────────────────────────────────────────────────────────────

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-2 font-medium data-[variant=label]:text-sm/relaxed data-[variant=legend]:text-sm',
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        // `has-[>[data-slot=…]]:gap-3` matches when FieldGroup CONTAINS a
        // checkbox/radio group child. The original `data-[slot=checkbox-group]:gap-3`
        // was self-referential (this element's slot is `field-group`) and
        // could never apply. Mirrors the rule on FieldSet above.
        'group/field-group @container/field-group flex w-full flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 *:data-[slot=field-group]:gap-4',
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  'group/field flex w-full gap-2 data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
        horizontal:
          'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        responsive:
          'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        'group/field-content flex flex-1 flex-col gap-0.5 leading-snug',
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-2 dark:has-data-checked:bg-primary/10',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'flex w-fit items-center gap-2 text-sm/relaxed font-medium group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        // `group-data-[orientation=horizontal]/field:` matches the actual
        // `data-orientation="horizontal"` attribute Field emits. The previous
        // `group-has-data-horizontal/field:` targeted a non-existent
        // `[data-horizontal]` attribute and never fired.
        'text-start text-sm/relaxed leading-normal font-normal text-muted-foreground group-data-[orientation=horizontal]/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'relative -my-2 h-5 text-sm/relaxed group-data-[variant=outline]/field-group:-mb-2',
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn('text-sm/relaxed font-normal text-destructive', className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}

// Derived prop types — exact component props for consumers wrapping these.
export type FieldProps = React.ComponentProps<typeof Field>
export type FieldSetProps = React.ComponentProps<typeof FieldSet>
export type FieldLegendProps = React.ComponentProps<typeof FieldLegend>
export type FieldGroupProps = React.ComponentProps<typeof FieldGroup>
export type FieldContentProps = React.ComponentProps<typeof FieldContent>
export type FieldLabelProps = React.ComponentProps<typeof FieldLabel>
export type FieldTitleProps = React.ComponentProps<typeof FieldTitle>
export type FieldDescriptionProps = React.ComponentProps<
  typeof FieldDescription
>
export type FieldSeparatorProps = React.ComponentProps<typeof FieldSeparator>
export type FieldErrorProps = React.ComponentProps<typeof FieldError>

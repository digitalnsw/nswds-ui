'use client'

import { Field as FieldPrimitive } from '@base-ui/react/field'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { Label } from '../components/label.js'
import { Separator } from '../components/separator.js'
import { cn } from '../lib/utils.js'

// ─────────────────────────────────────────────────────────────────────────────
// Base UI Field
// ─────────────────────────────────────────────────────────────────────────────
//
// `Field`, `FieldLabel`, `FieldDescription`, and `FieldError` wrap Base UI's
// Field primitive (@base-ui/react/field). Base UI owns the accessible wiring:
// the label is associated with the control, and any description/error ids are
// added to the control's `aria-describedby` automatically — no manual
// `htmlFor` / `aria-describedby` / `aria-invalid` plumbing required. Set
// `invalid` on `Field` (e.g. from react-hook-form) and the control receives
// `aria-invalid` and the wrapper gets `data-invalid` for free.
//
// Base UI's Field parts must live inside a `Field.Root`. To keep the previous
// behaviour where a label/description/error could also be used standalone
// (e.g. a group-level FieldDescription directly inside a FieldSet), FieldLabel/
// FieldDescription/FieldError opt into the Base UI part only when they detect a
// surrounding `Field` (via `InsideFieldContext`) and otherwise render the plain
// element they did before. Inside a Field they gain the automatic association;
// outside one they are unchanged.
//
// `FieldSet` / `FieldLegend` stay native `<fieldset>` / `<legend>` (already
// accessible for grouping); `FieldGroup` / `FieldContent` / `FieldSeparator` /
// `FieldTitle` remain layout-only primitives.
//
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

// True for descendants of our <Field> (which renders Base UI's Field.Root).
const InsideFieldContext = React.createContext(false)

function FieldSet({ className, ref, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      ref={ref}
      data-slot='field-set'
      className={cn(
        'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className,
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ref,
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      ref={ref}
      data-slot='field-legend'
      data-variant={variant}
      className={cn(
        'mb-2 font-medium data-[variant=label]:text-sm/relaxed data-[variant=legend]:text-sm',
        className,
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-slot='field-group'
      className={cn(
        // `has-[>[data-slot=…]]:gap-3` matches when FieldGroup CONTAINS a
        // checkbox/radio group child. The original `data-[slot=checkbox-group]:gap-3`
        // was self-referential (this element's slot is `field-group`) and
        // could never apply. Mirrors the rule on FieldSet above.
        'group/field-group @container/field-group flex w-full flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 *:data-[slot=field-group]:gap-4',
        className,
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  // `data-invalid:` (presence) matches the `data-invalid` attribute Base UI's
  // Field.Root sets when the field is invalid (via the `invalid` prop or native
  // validation) — replacing the old hand-set `data-[invalid=true]`.
  'group/field flex w-full gap-2 data-invalid:text-destructive',
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
  },
)

function Field({
  className,
  orientation = 'vertical',
  ref,
  children,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Root> & VariantProps<typeof fieldVariants>) {
  return (
    <FieldPrimitive.Root
      ref={ref}
      // Preserve the explicit group role + data-orientation the layout and the
      // accessibility tests rely on; Base UI's Root renders a bare <div>.
      role='group'
      data-slot='field'
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    >
      <InsideFieldContext.Provider value={true}>{children}</InsideFieldContext.Provider>
    </FieldPrimitive.Root>
  )
}

function FieldContent({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-slot='field-content'
      className={cn('group/field-content flex flex-1 flex-col gap-0.5 leading-snug', className)}
      {...props}
    />
  )
}

const fieldLabelClassName = cn(
  'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-disabled/field:opacity-50 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-2 dark:has-data-checked:bg-primary/10',
  'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
)

function FieldLabel({ className, ref, ...props }: React.ComponentProps<typeof Label>) {
  const insideField = React.useContext(InsideFieldContext)

  // Standalone (no surrounding Field): render the styled Label directly, as
  // before. Base UI's Field.Label would throw without a Field.Root ancestor.
  if (!insideField) {
    return (
      <Label
        ref={ref}
        data-slot='field-label'
        className={cn(fieldLabelClassName, className)}
        {...props}
      />
    )
  }

  return (
    <FieldPrimitive.Label
      // Base UI's Field.Label types its ref as HTMLElement (it can render a
      // non-label); here it always renders our <Label>, so the ref is an
      // HTMLLabelElement at runtime.
      ref={ref as React.Ref<HTMLElement>}
      // Render through our styled Label so FieldLabel keeps the Label
      // primitive's typography + data-slot, while Base UI supplies the
      // automatic `htmlFor` association with the field control.
      render={<Label />}
      data-slot='field-label'
      className={cn(fieldLabelClassName, className)}
      {...props}
    />
  )
}

function FieldTitle({ className, ref, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      ref={ref}
      data-slot='field-label'
      className={cn(
        'flex w-fit items-center gap-2 text-sm/relaxed font-medium group-data-disabled/field:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

const fieldDescriptionClassName = cn(
  // `group-data-[orientation=horizontal]/field:` matches the
  // `data-orientation="horizontal"` attribute Field emits.
  'text-start text-sm/relaxed leading-normal font-normal text-muted-foreground group-data-[orientation=horizontal]/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
  'last:mt-0 nth-last-2:-mt-1',
  '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
)

function FieldDescription({ className, ref, ...props }: React.ComponentProps<'p'>) {
  const insideField = React.useContext(InsideFieldContext)

  // Standalone (e.g. a group-level description inside a FieldSet): a plain
  // <p>, as before. Inside a Field, Base UI links it to the control via
  // aria-describedby.
  if (!insideField) {
    return (
      <p
        ref={ref}
        data-slot='field-description'
        className={cn(fieldDescriptionClassName, className)}
        {...props}
      />
    )
  }

  return (
    <FieldPrimitive.Description
      ref={ref}
      data-slot='field-description'
      className={cn(fieldDescriptionClassName, className)}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode
}) {
  return (
    <div
      ref={ref}
      data-slot='field-separator'
      data-content={!!children}
      className={cn(
        'relative -my-2 h-5 text-sm/relaxed group-data-[variant=outline]/field-group:-mb-2',
        className,
      )}
      {...props}
    >
      <Separator className='absolute inset-0 top-1/2' />
      {children && (
        <span
          className='relative mx-auto block w-fit bg-background px-2 text-muted-foreground'
          data-slot='field-separator-content'
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
  ref,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const insideField = React.useContext(InsideFieldContext)

  const content = React.useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()]

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className='ms-4 flex list-disc flex-col gap-1'>
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  const errorClassName = cn('text-sm/relaxed font-normal text-destructive', className)

  // Standalone: a plain alert region, as before. Inside a Field, Base UI links
  // it to the control via aria-describedby.
  if (!insideField) {
    return (
      <div ref={ref} role='alert' data-slot='field-error' className={errorClassName} {...props}>
        {content}
      </div>
    )
  }

  return (
    <FieldPrimitive.Error
      ref={ref}
      // `match` lets the `errors` array / external library drive visibility
      // instead of the control's native ValidityState. We only render this when
      // there IS content, so force it visible; Base UI then adds its id to the
      // control's `aria-describedby`.
      match
      role='alert'
      data-slot='field-error'
      className={errorClassName}
      {...props}
    >
      {content}
    </FieldPrimitive.Error>
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
export type FieldDescriptionProps = React.ComponentProps<typeof FieldDescription>
export type FieldSeparatorProps = React.ComponentProps<typeof FieldSeparator>
export type FieldErrorProps = React.ComponentProps<typeof FieldError>

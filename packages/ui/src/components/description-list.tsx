import type * as React from 'react'

import { cn } from '../lib/utils.js'

export function DescriptionList({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'dl'> & {
  ref?: React.Ref<HTMLDListElement>
}) {
  return (
    <dl
      ref={ref}
      {...props}
      className={cn(
        'grid grid-cols-1 text-base/6 sm:grid-cols-[min(50%,--spacing(80))_auto] sm:text-sm/6',
        className
      )}
    />
  )
}

export function DescriptionTerm({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'dt'> & {
  ref?: React.Ref<HTMLElement>
}) {
  return (
    <dt
      ref={ref}
      {...props}
      className={cn(
        'col-start-1 border-t border-border pt-3 text-muted-foreground first:border-none sm:border-t sm:py-3',
        className
      )}
    />
  )
}

export function DescriptionDetails({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'dd'> & {
  ref?: React.Ref<HTMLElement>
}) {
  return (
    <dd
      ref={ref}
      {...props}
      className={cn(
        'pt-1 pb-3 text-foreground sm:border-t sm:border-border sm:py-3 sm:[&:nth-child(2)]:border-none',
        className
      )}
    />
  )
}

export type DescriptionListProps = React.ComponentProps<typeof DescriptionList>
export type DescriptionTermProps = React.ComponentProps<typeof DescriptionTerm>
export type DescriptionDetailsProps = React.ComponentProps<
  typeof DescriptionDetails
>

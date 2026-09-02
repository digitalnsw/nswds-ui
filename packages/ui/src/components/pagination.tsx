import * as React from 'react'

import { IconChevronLeft } from '../icons/chevron-left.js'
import { IconChevronRight } from '../icons/chevron-right.js'
import { IconMoreHoriz } from '../icons/more-horiz.js'
import { cn } from '../lib/utils.js'
import { Button } from './button.js'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  ...props
}: PaginationLinkProps) {
  // The anchor's own props ride on the `render` element; the name and the
  // children go to Button. Button's dev-time icon-button guard reads its own
  // props, so a label or a page number that only the anchor carried was
  // invisible to it — a fully labelled `<PaginationLink aria-label="Page 2">`
  // warned on every render, and so did the bare digits in this component's
  // stories. Base UI merges the two sets onto the one anchor, and routing the
  // children through Button also gives a page link Button's touch target,
  // which it had been skipping.
  return (
    <Button
      variant={isActive ? 'outline' : 'ghost'}
      size={size}
      className={cn(className)}
      nativeButton={false}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      render={
        <a
          aria-current={isActive ? 'page' : undefined}
          data-slot='pagination-link'
          data-active={isActive}
          {...props}
        />
      }
    >
      {children}
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('ps-2!', className)}
      {...props}
    >
      <IconChevronLeft data-icon='inline-start' className='rtl:rotate-180' />
      <span className='max-sm:hidden sm:block'>{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('pe-2!', className)}
      {...props}
    >
      <span className='max-sm:hidden sm:block'>{text}</span>
      <IconChevronRight data-icon='inline-end' className='rtl:rotate-180' />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn(
        "flex size-7 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    >
      <IconMoreHoriz />
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}

'use client'

import * as React from 'react'

import { cn } from '../lib/utils.js'

function Label({ className, ref, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      ref={ref}
      data-slot='label'
      className={cn(
        'flex items-center gap-2 text-base/relaxed font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Label }

export type LabelProps = React.ComponentProps<typeof Label>

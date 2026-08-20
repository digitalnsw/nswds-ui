'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { Spinner } from '../components/spinner.js'
import { IconCheckCircle } from '../icons/check-circle.js'
import { IconError } from '../icons/error.js'
import { IconInfo } from '../icons/info.js'
import { IconWarning } from '../icons/warning.js'
import { cn } from '../lib/utils.js'

/**
 * Binds sonner's own theming variables to the NSW semantic tokens.
 *
 * All four names below are sonner's public CSS API — three `--normal-*` colour
 * variables plus `--border-radius`, which is a separate name rather than part
 * of that family. Sonner's own stylesheet reads each of them.
 *
 * They are set ONLY here: none of the four is defined in the compiled
 * `dist/styles.css`, so this object is the single point at which the design
 * system's tokens reach a toast. Losing it silently drops every toast back to
 * sonner's built-in palette, which is why `style` is merged below rather than
 * overwritten.
 */
const tokenBridge = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius)',
} as React.CSSProperties

/**
 * Toast host. Mount once, near the root.
 *
 * Every prop this component sets a default for is MERGED with the consumer's
 * value rather than replaced. Spreading `{...props}` last — the shadcn default
 * this was scaffolded from — meant a consumer passing `style` for something
 * unrelated (a z-index, an offset) silently discarded the whole token bridge
 * above, and passing one `icons` entry discarded the other four. Object spread
 * replaces keys wholesale; it does not deep-merge.
 */
const Toaster = ({ className, style, icons, toastOptions, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      // `toaster` and `group` are shadcn-compatible styling hooks. Nothing in
      // this package targets them, but consumers migrating from shadcn may, so
      // they are kept and merged rather than dropped.
      className={cn('toaster group', className)}
      icons={{
        success: <IconCheckCircle className='size-4' />,
        info: <IconInfo className='size-4' />,
        warning: <IconWarning className='size-4' />,
        error: <IconError className='size-4' />,
        loading: <Spinner size='sm' color='current' label='' />,
        ...icons,
      }}
      style={{ ...tokenBridge, ...style }}
      // Two levels of merge, not one: a consumer's `toastOptions` must not drop
      // our `classNames`, and their `classNames` must not drop `toast`.
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: 'cn-toast',
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

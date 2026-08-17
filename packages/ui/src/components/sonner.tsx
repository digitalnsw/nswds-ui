'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { Spinner } from '../components/spinner.js'
import { IconCheckCircle } from '../icons/check-circle.js'
import { IconError } from '../icons/error.js'
import { IconInfo } from '../icons/info.js'
import { IconWarning } from '../icons/warning.js'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <IconCheckCircle className='size-4' />,
        info: <IconInfo className='size-4' />,
        warning: <IconWarning className='size-4' />,
        error: <IconError className='size-4' />,
        loading: <Spinner size='sm' color='current' label='' />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

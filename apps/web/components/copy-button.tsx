'use client'

import { Button } from '@nswds/ui'
import { IconCheck } from '@nswds/ui/icons/check'
import { IconContentCopy } from '@nswds/ui/icons/content-copy'
import * as React from 'react'

/** Copies `text` to the clipboard, confirming with a brief tick state. */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return
    }
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <Button
      variant='ghost'
      color='white'
      size='icon'
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      onClick={() => {
        navigator.clipboard.writeText(text).then(
          () => setCopied(true),
          () => {},
        )
      }}
    >
      {copied ? <IconCheck aria-hidden='true' /> : <IconContentCopy aria-hidden='true' />}
    </Button>
  )
}

export { CopyButton }

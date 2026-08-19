import { cn } from '@nswds/ui'

import { CopyButton } from '@/components/copy-button'

type CodeBlockProps = {
  code: string
  /** Short label shown in the block's chrome, e.g. "Terminal" or "app.tsx". */
  label?: string
  className?: string
}

/** A copyable code block in the site's mono type, on a deep ink surface. */
function CodeBlock({ code, label, className }: CodeBlockProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md bg-grey-900 ring-1 ring-white/10 dark:bg-grey-950',
        className,
      )}
    >
      <div className='flex items-center justify-between gap-4 border-b border-white/10 py-1.5 pr-1.5 pl-4'>
        <span className='font-mono text-xs text-grey-400'>{label ?? 'Terminal'}</span>
        <CopyButton text={code} />
      </div>
      <pre className='overflow-x-auto p-4 font-mono text-sm/6 text-grey-100'>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export { CodeBlock }

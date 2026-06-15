// Exercises the public consumption paths of the PACKED @nswds/ui tarball:
// root barrel, per-icon subpath, icons barrel (tree-shaking is asserted by
// scripts/test-consumer-fixture.sh — IconSearch must be in the bundle,
// unimported icons must not), compiled stylesheet, and exported prop types.
import '@nswds/ui/styles.css'

import {
  Button,
  ButtonLink,
  Input,
  Spinner,
  cn,
  type ButtonProps,
} from '@nswds/ui'
import { IconSearch } from '@nswds/ui/icons'
import { IconAdd } from '@nswds/ui/icons/add'
import { useRef } from 'react'
import { createRoot } from 'react-dom/client'

const buttonProps: ButtonProps = { color: 'primary', size: 'default' }

function App() {
  // Ref-forwarding contract (React 19 ref-as-prop): each component must accept
  // a correctly-typed ref to its underlying DOM node. A regression here is a
  // compile error in the fixture's tsc step.
  const buttonRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <main className={cn('space-y-4 p-8')}>
      <Button {...buttonProps} ref={buttonRef} leadingVisual={IconSearch}>
        Search
      </Button>
      <Button leadingVisual={IconAdd}>Add</Button>
      <ButtonLink href="/docs" variant="outline" ref={linkRef}>
        Documentation
      </ButtonLink>
      <Input ref={inputRef} aria-label="Fixture input" />
      <Spinner aria-label="Loading fixture" />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

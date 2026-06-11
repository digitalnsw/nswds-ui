// Exercises the public consumption paths of the PACKED @nswds/ui tarball:
// root barrel, per-icon subpath, icons barrel (tree-shaking is asserted by
// scripts/test-consumer-fixture.sh — IconSearch must be in the bundle,
// unimported icons must not), compiled stylesheet, and exported prop types.
import '@nswds/ui/styles.css'

import { Button, ButtonLink, Spinner, cn, type ButtonProps } from '@nswds/ui'
import { IconSearch } from '@nswds/ui/icons'
import { IconAdd } from '@nswds/ui/icons/add'
import { createRoot } from 'react-dom/client'

const buttonProps: ButtonProps = { color: 'primary', size: 'default' }

function App() {
  return (
    <main className={cn('space-y-4 p-8')}>
      <Button {...buttonProps} leadingVisual={IconSearch}>
        Search
      </Button>
      <Button leadingVisual={IconAdd}>Add</Button>
      <ButtonLink href="/docs" variant="outline">
        Documentation
      </ButtonLink>
      <Spinner aria-label="Loading fixture" />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

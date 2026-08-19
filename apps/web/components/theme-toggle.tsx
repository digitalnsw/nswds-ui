'use client'

import { ThemeSwitcher } from '@nswds/ui'
import { useTheme } from 'next-themes'
import * as React from 'react'

const emptySubscribe = () => () => {}

/**
 * ThemeSwitcher wired to next-themes. `resolvedTheme` is undefined during SSR,
 * so the control renders in its light state until hydrated — `hydrated` is
 * false for the server snapshot and true on the client, which keeps the
 * server- and client-rendered action labels consistent without a
 * setState-in-effect mounted gate.
 */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const hydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  const theme = hydrated && resolvedTheme === 'dark' ? 'dark' : 'light'

  return <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
}

export { ThemeToggle }

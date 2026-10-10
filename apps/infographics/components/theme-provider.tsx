'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

// No single-key theme shortcut here, unlike apps/web: this is a public site, and
// a bare `d` hotkey that cannot be turned off fails WCAG 2.1 SC 2.1.4
// (Character Key Shortcuts). The theme follows the system preference.
function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }

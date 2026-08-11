import type { Viewport } from 'next'
import { JetBrains_Mono, Public_Sans } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
// Import the SOURCE dev entry (not the `@nswds/ui/styles.css` export, which
// is the prebuilt dist/styles.css) so this app's Tailwind build scans
// apps/** live and emits utilities for the sandbox's own classes.
import '../../../packages/ui/src/styles/globals.css'

import { site } from '@/lib/site'

const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

// Icons come from the app/favicon.ico, app/icon.svg and app/apple-icon.png file
// conventions. defineSite deliberately emits no `icons` key — setting one does
// not add to them, it suppresses icon.svg and apple-icon.png while favicon.ico
// survives, so the failure is partial and easy to miss.
export const { metadata } = site

// The one place this app departs from the fleet default, and it is a spread
// rather than an option because the package will not accept the media-array
// form: a manifest's `theme_color` is a bare string with no media equivalent,
// so an array can never agree with it. This app ships no app/manifest.ts and
// genuinely has light and dark themes, so there is nothing here to disagree
// with. Revisit if it ever becomes installable.
export const viewport: Viewport = {
  ...site.viewport,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#22272b' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      data-scroll-behavior='smooth'
      suppressHydrationWarning
      className={`${publicSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

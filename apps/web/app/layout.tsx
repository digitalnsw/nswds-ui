import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Viewport } from 'next'
import { JetBrains_Mono, Public_Sans } from 'next/font/google'

import { AppLinkProvider } from '@/components/link-provider'
import { SiteShell } from '@/components/site-shell'
import { ThemeProvider } from '@/components/theme-provider'
// Import the SOURCE dev entry (not the `@nswds/ui/styles.css` export, which
// is the prebuilt dist/styles.css) so this app's Tailwind build scans
// packages/ui/src live. This app's own classes come from Tailwind's automatic
// detection of the folder it builds in (see the note in globals.css).
import './globals.css'

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

/**
 * The Google Tag Manager container the NSW Design sites share (its GA4 tag fires inside it), or
 * `undefined` to render no tag at all. Unset is the correct state for `next dev` and previews,
 * none of which should report, so this is silent where a missing PostHog token is loud. The ID is
 * a team shared variable in Vercel, on Production only. NEXT_PUBLIC_ values are inlined at build
 * time, so setting it changes nothing until the next deployment.
 */
const gtmContainerId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined

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
      {gtmContainerId ? <GoogleTagManager gtmId={gtmContainerId} /> : null}
      <body>
        <ThemeProvider>
          <AppLinkProvider>
            <SiteShell>{children}</SiteShell>
          </AppLinkProvider>
        </ThemeProvider>
        {/* No URL redaction, unlike the contrast checker: nothing on this site writes a visitor's
            input to its query string. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

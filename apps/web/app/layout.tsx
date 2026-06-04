import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Public_Sans } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
import '@nswds/ui/globals.css'

import {
  siteDescription,
  siteKeywords,
  siteName,
  siteURL,
} from '@/lib/site_name'

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

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteName}`,
    default: siteName,
  },
  description: siteDescription,

  metadataBase: new URL(siteURL),

  keywords: [...siteKeywords],

  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
  },

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteURL,
    siteName: siteName,
    type: 'website',
    locale: 'en_AU',
    images: [
      {
        url: 'https://digitalnsw.github.io/images/nsw-gov-logo-primary.png',
        width: 260,
        height: 280,
        alt: 'NSW Government logo',
      },
      {
        url: 'https://digitalnsw.github.io/images/og.png',
        width: 1200,
        height: 630,
        alt: `${siteName} - NSW Government logo on a colour-block background`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@DigitalNSW',
    creator: '@DigitalNSW',
    title: siteName,
    description: siteDescription,
    images: ['https://digitalnsw.github.io/images/nsw-gov-logo-primary.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${publicSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

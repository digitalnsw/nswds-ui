import { JetBrains_Mono, Public_Sans } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
import '@nswds/ui/globals.css'
import { cn } from '@nswds/ui/lib/utils'

const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        publicSans.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

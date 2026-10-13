import { SignInForm, SignInPanel } from '@workspace/auth/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your account.',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <SignInPanel>
      <SignInForm />
    </SignInPanel>
  )
}

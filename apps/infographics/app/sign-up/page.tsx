import { SignUpForm, SignUpPanel } from '@workspace/auth/components'
import type { Metadata } from 'next'

import { basePath } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create an account.',
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return (
    <SignUpPanel>
      <SignUpForm basePath={basePath} />
    </SignUpPanel>
  )
}

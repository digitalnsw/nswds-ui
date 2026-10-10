/**
 * ForgotPasswordForm — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ForgotPasswordForm } from './forgot-password-form.js'
import {
  AccountEnumerationSafetySection,
  DefaultSection,
  InContextSection,
} from './forgot-password-form.stories.js'

const meta = {
  title: 'Patterns/ForgotPasswordForm/Features',
  component: ForgotPasswordForm,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ForgotPasswordForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <DefaultSection /> }

export const AccountEnumerationSafety: Story = {
  name: 'Account-enumeration safety',
  render: () => <AccountEnumerationSafetySection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

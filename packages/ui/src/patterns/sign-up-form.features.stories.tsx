/**
 * SignUpForm — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { SignUpForm } from './sign-up-form.js'
import {
  DefaultSection,
  InContextSection,
  PasswordManagerSection,
  ReportingAnErrorSection,
} from './sign-up-form.stories.js'

const meta = {
  title: 'Patterns/SignUpForm/Features',
  component: SignUpForm,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SignUpForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <DefaultSection /> }

export const PasswordManager: Story = {
  name: 'Password manager & accessibility',
  render: () => <PasswordManagerSection />,
}

export const ReportingAnError: Story = {
  name: 'Reporting an error',
  render: () => <ReportingAnErrorSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

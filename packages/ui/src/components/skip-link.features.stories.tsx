/**
 * SkipLink — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkipLinks } from './skip-link.js'
import {
  CustomLinksSection,
  DarkModeSection,
  InContextSection,
  UsageSection,
} from './skip-link.stories.js'

const meta = {
  title: 'Components/SkipLink/Features',
  component: SkipLinks,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SkipLinks>

export default meta

type Story = StoryObj<typeof meta>

export const Usage: Story = { render: () => <UsageSection /> }

export const DarkMode: Story = { name: 'Dark mode', render: () => <DarkModeSection /> }

export const CustomLinks: Story = { name: 'Custom links', render: () => <CustomLinksSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

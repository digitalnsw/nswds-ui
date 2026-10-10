/**
 * Section — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Section } from './section.js'
import {
  DividerSection,
  InContextSection,
  NamingSection,
  SpacingSection,
} from './section.stories.js'

const meta = {
  title: 'Components/Section/Features',
  component: Section,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Section>

export default meta

type Story = StoryObj<typeof meta>

export const Spacing: Story = { name: 'Spacing', render: () => <SpacingSection /> }

export const Divider: Story = { name: 'Divider', render: () => <DividerSection /> }

export const NamingTheSection: Story = {
  name: 'Naming the section',
  render: () => <NamingSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

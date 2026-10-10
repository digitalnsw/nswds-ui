/**
 * SiteSearch — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { SiteSearch } from './site-search.js'
import {
  AccessibilitySection,
  InContextSection,
  KeyboardShortcutSection,
  LabelsAndMessagesSection,
  ResultsSection,
  TriggersSection,
} from './site-search.stories.js'

const meta = {
  title: 'Components/SiteSearch/Features',
  component: SiteSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SiteSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Triggers: Story = { render: () => <TriggersSection /> }

export const Results: Story = { render: () => <ResultsSection /> }

export const KeyboardShortcut: Story = {
  name: 'Keyboard shortcut',
  render: () => <KeyboardShortcutSection />,
}

export const LabelsAndMessages: Story = {
  name: 'Labels and messages',
  render: () => <LabelsAndMessagesSection />,
}

export const Accessibility: Story = { render: () => <AccessibilitySection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

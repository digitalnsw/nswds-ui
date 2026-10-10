/**
 * ExpandableSearch — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ExpandableSearch } from './expandable-search.js'
import {
  AccessibilitySection,
  InContextSection,
  LabelsSection,
  StatesSection,
  VariantsSection,
} from './expandable-search.stories.js'

const meta = {
  title: 'Components/ExpandableSearch/Features',
  component: ExpandableSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ExpandableSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const Labels: Story = { render: () => <LabelsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

export const Accessibility: Story = { render: () => <AccessibilitySection /> }

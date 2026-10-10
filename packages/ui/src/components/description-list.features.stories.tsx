/**
 * DescriptionList — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { DescriptionList } from './description-list.js'
import {
  GroupingPairsSection,
  InContextSection,
  LayoutsSection,
  LongContentSection,
} from './description-list.stories.js'

const meta = {
  title: 'Components/DescriptionList/Features',
  component: DescriptionList,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DescriptionList>

export default meta

type Story = StoryObj<typeof meta>

export const Layouts: Story = { render: () => <LayoutsSection /> }

export const GroupingPairs: Story = {
  name: 'Grouping pairs',
  render: () => <GroupingPairsSection />,
}

export const LongContent: Story = { name: 'Long content', render: () => <LongContentSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

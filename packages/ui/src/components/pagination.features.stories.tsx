/**
 * Pagination — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Pagination } from './pagination.js'
import {
  FirstAndLastPagesSection,
  InContextSection,
  LabelsSection,
  StatesSection,
  WithEllipsisSection,
} from './pagination.stories.js'

const meta = {
  title: 'Components/Pagination/Features',
  component: Pagination,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = { render: () => <StatesSection /> }

export const WithEllipsis: Story = { name: 'With ellipsis', render: () => <WithEllipsisSection /> }

export const FirstAndLastPages: Story = {
  name: 'First and last pages',
  render: () => <FirstAndLastPagesSection />,
}

export const Labels: Story = { name: 'Previous and next labels', render: () => <LabelsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

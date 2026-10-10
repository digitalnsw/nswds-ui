/**
 * Tag — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas. The filter stories keep the
 * interaction checks they carried when they lived in the main file.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Tag } from './tag.js'
import {
  ChooseAComponentSection,
  ColoursSection,
  DefaultSection,
  InContextSection,
  LinksSection,
  RemovableFiltersSection,
  SelectableFiltersSection,
  SizesSection,
  StatesSection,
  TopicActionsSection,
  VariantsSection,
} from './tag.stories.js'

const meta = {
  title: 'Components/Tag/Features',
  component: Tag,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tag>

export default meta

type Story = StoryObj<typeof meta>

export const ChooseAComponent: Story = {
  name: 'Choose a component',
  render: () => <ChooseAComponentSection />,
}

export const Default: Story = { render: () => <DefaultSection /> }

export const Variants: Story = { render: () => <VariantsSection /> }

export const Links: Story = { render: () => <LinksSection /> }

export const Selectable: Story = {
  name: 'Selectable filters',
  render: () => <SelectableFiltersSection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const education = canvas.getByRole('checkbox', { name: 'Education' })
    await userEvent.click(education)
    await expect(education).toBeChecked()
    await expect(canvas.getByText('Selected topics: Environment, Education')).toBeVisible()
    await userEvent.keyboard(' ')
    await expect(education).not.toBeChecked()
  },
}

export const Removable: Story = {
  name: 'Removable filters',
  render: () => <RemovableFiltersSection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Environment filter' }))
    await expect(
      canvas.queryByRole('button', { name: 'Remove Environment filter' }),
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Reset filters' })).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Reset filters' }))
    await expect(canvas.getByRole('button', { name: 'Remove Environment filter' })).toBeVisible()
  },
}

export const Actions: Story = { name: 'Topic actions', render: () => <TopicActionsSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const Colours: Story = { render: () => <ColoursSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

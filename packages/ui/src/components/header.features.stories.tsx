/**
 * Header — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Header } from './header.js'
import {
  BorderAndShadowSection,
  BrandSection,
  ColoursSection,
  ContainersSection,
  InContextSection,
  ScrollStateSection,
  WithActionsSection,
} from './header.stories.js'

const meta = {
  title: 'Components/Header/Features',
  component: Header,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const Colours: Story = { render: () => <ColoursSection /> }

export const Brand: Story = { render: () => <BrandSection /> }

export const WithActions: Story = { name: 'With actions', render: () => <WithActionsSection /> }

export const ScrollState: Story = { name: 'Scroll state', render: () => <ScrollStateSection /> }

export const BorderAndShadow: Story = {
  name: 'Border and shadow',
  render: () => <BorderAndShadowSection />,
}

export const Containers: Story = { render: () => <ContainersSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

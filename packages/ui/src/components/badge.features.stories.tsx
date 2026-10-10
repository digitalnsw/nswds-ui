/**
 * Badge — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './badge.js'
import {
  ColoursSection,
  CountsSection,
  DefaultSection,
  InContextSection,
  SizesSection,
  StatusSection,
  VariantsSection,
  WithIconSection,
} from './badge.stories.js'

const meta = {
  title: 'Components/Badge/Features',
  component: Badge,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <DefaultSection /> }

export const Variants: Story = { render: () => <VariantsSection /> }

export const Status: Story = { render: () => <StatusSection /> }

export const Counts: Story = { render: () => <CountsSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const Colours: Story = { render: () => <ColoursSection /> }

export const WithIcon: Story = { name: 'With an icon', render: () => <WithIconSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

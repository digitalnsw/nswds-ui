/**
 * Empty — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Empty } from './empty.js'
import {
  HeadingsSection,
  InContextSection,
  MediaSection,
  SurfacesSection,
  WaysForwardSection,
} from './empty.stories.js'

const meta = {
  title: 'Components/Empty/Features',
  component: Empty,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

export const Media: Story = { render: () => <MediaSection /> }

export const Surfaces: Story = { render: () => <SurfacesSection /> }

export const WaysForward: Story = { name: 'Ways forward', render: () => <WaysForwardSection /> }

export const Headings: Story = { render: () => <HeadingsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

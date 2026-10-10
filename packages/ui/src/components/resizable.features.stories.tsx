/**
 * ResizablePanelGroup — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResizablePanelGroup } from './resizable.js'
import {
  HandleSection,
  InContextSection,
  OrientationSection,
  SizeLimitsSection,
} from './resizable.stories.js'

const meta = {
  title: 'Components/ResizablePanelGroup/Features',
  component: ResizablePanelGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Orientation: Story = { name: 'Orientation', render: () => <OrientationSection /> }

export const Handle: Story = { name: 'Handle', render: () => <HandleSection /> }

export const SizeLimits: Story = { name: 'Size limits', render: () => <SizeLimitsSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

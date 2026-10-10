/**
 * DirectionProvider — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { DirectionProvider } from './direction.js'
import {
  InContextSection,
  ReadingTheDirectionSection,
  RightToLeftSection,
} from './direction.stories.js'

const meta = {
  title: 'Components/DirectionProvider/Features',
  component: DirectionProvider,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DirectionProvider>

export default meta

type Story = StoryObj<typeof meta>

export const ReadingTheDirection: Story = {
  name: 'Reading the direction',
  render: () => <ReadingTheDirectionSection />,
}

export const RightToLeft: Story = { name: 'Right to left', render: () => <RightToLeftSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

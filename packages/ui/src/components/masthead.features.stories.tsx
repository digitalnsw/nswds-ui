/**
 * Masthead — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Masthead } from './masthead.js'
import { ColoursSection, ContainersSection, InContextSection } from './masthead.stories.js'

const meta = {
  title: 'Components/Masthead/Features',
  component: Masthead,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Masthead>

export default meta

type Story = StoryObj<typeof meta>

export const Colours: Story = { render: () => <ColoursSection /> }

export const Containers: Story = { render: () => <ContainersSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

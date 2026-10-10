/**
 * IconBrands — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconLinkedIn } from '../icons/brands/index.js'
import { ColoursSection, InContextSection, MarksSection } from './icon-brands.stories.js'

const meta = {
  title: 'Components/IconBrands/Features',
  component: IconLinkedIn,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof IconLinkedIn>

export default meta

type Story = StoryObj<typeof meta>

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const Marks: Story = { name: 'Marks', render: () => <MarksSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

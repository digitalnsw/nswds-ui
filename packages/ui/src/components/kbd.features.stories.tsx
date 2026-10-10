/**
 * Kbd — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Kbd } from './kbd.js'
import {
  InATooltipSection,
  InContextSection,
  KeyCombinationsSection,
  SingleKeysSection,
  WithIconsSection,
} from './kbd.stories.js'

const meta = {
  title: 'Components/Kbd/Features',
  component: Kbd,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const SingleKeys: Story = { name: 'Single keys', render: () => <SingleKeysSection /> }

export const KeyCombinations: Story = {
  name: 'Key combinations',
  render: () => <KeyCombinationsSection />,
}

export const WithIcons: Story = { name: 'With icons', render: () => <WithIconsSection /> }

export const InATooltip: Story = { name: 'In a tooltip', render: () => <InATooltipSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

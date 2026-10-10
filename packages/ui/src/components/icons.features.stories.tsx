/**
 * Icons — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconSearch } from '../icons/search.js'
import {
  AccessibleNamesSection,
  ColoursSection,
  GallerySection,
  ImportingSection,
  SizesSection,
} from './icons.stories.js'

const meta = {
  title: 'Components/Icons/Features',
  component: IconSearch,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof IconSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Sizes: Story = { name: 'Sizes', render: () => <SizesSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const AccessibleNames: Story = {
  name: 'Accessible names',
  render: () => <AccessibleNamesSection />,
}

export const Importing: Story = { name: 'Importing', render: () => <ImportingSection /> }

export const Gallery: Story = {
  name: 'Gallery',
  parameters: {
    // Skip the axe a11y scan for the gallery. It renders the full ~3,900-icon
    // set, and running axe across that DOM tree blows the 15s Vitest timeout
    // on CI runners. a11y for individual icons is the responsibility of the
    // components that *use* them — the other stories here cover the pattern.
    a11y: { test: 'off' },
    // Exclude from Chromatic for the same reason: the full grid exceeds
    // Chromatic's 25,000,000px capture limit (and a searchable catalogue isn't
    // a visual-regression target — icons are snapshotted via the components
    // that use them).
    chromatic: { disableSnapshot: true },
  },
  render: () => <GallerySection />,
}

/**
 * HeroBlocks — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * block can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  CentredSection,
  ChooserSection,
  ColoursSection,
  FramedSection,
  PanelSection,
  SplitSection,
  StatementSection,
} from './hero-blocks.stories.js'
import { HeroSplit } from './hero-split.js'

const illustration = { src: 'images/hero-illustration.png', alt: '' }

const meta = {
  title: 'Patterns/HeroBlocks/Features',
  component: HeroSplit,
  parameters: { layout: 'padded' },
  args: { media: illustration },
} satisfies Meta<typeof HeroSplit>

export default meta

type Story = StoryObj<typeof meta>

export const Chooser: Story = { render: () => <ChooserSection /> }

export const Split: Story = { render: () => <SplitSection /> }

export const Framed: Story = { render: () => <FramedSection /> }

export const Panel: Story = { render: () => <PanelSection /> }

export const Centred: Story = { render: () => <CentredSection /> }

export const Statement: Story = { render: () => <StatementSection /> }

export const Colours: Story = { render: () => <ColoursSection /> }

/**
 * ThemeSwitcher — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ThemeSwitcher } from './theme-switcher.js'
import {
  ColoursSection,
  ControlledSection,
  InContextSection,
  InStorybookSection,
  SizesSection,
  StatesSection,
  VariantsSection,
  WiringNextThemesSection,
} from './theme-switcher.stories.js'

const meta = {
  title: 'Components/ThemeSwitcher/Features',
  component: ThemeSwitcher,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ThemeSwitcher>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const Colours: Story = { render: () => <ColoursSection /> }

export const Sizes: Story = { render: () => <SizesSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const Controlled: Story = { render: () => <ControlledSection /> }

export const WiringNextThemes: Story = {
  name: 'Wiring next-themes',
  render: () => <WiringNextThemesSection />,
}

export const InStorybook: Story = { render: () => <InStorybookSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

/**
 * MainNav — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { MainNav } from './main-nav.js'
import {
  BordersSection,
  ColoursSection,
  ContainersSection,
  CurrentPageSection,
  InContextSection,
  PanelsAndLinksSection,
  RightToLeftSection,
  StickySection,
} from './main-nav.stories.js'

const meta = {
  title: 'Components/MainNav/Features',
  component: MainNav,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MainNav>

export default meta

type Story = StoryObj<typeof meta>

export const Colours: Story = { render: () => <ColoursSection /> }

export const PanelsAndLinks: Story = {
  name: 'Panels and links',
  render: () => <PanelsAndLinksSection />,
}

export const Borders: Story = { render: () => <BordersSection /> }

export const Containers: Story = { render: () => <ContainersSection /> }

export const CurrentPage: Story = { name: 'Current page', render: () => <CurrentPageSection /> }

export const Sticky: Story = { render: () => <StickySection /> }

export const RightToLeft: Story = { name: 'Right to left', render: () => <RightToLeftSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

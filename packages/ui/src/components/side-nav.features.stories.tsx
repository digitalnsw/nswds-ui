/**
 * SideNav — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { SideNav } from './side-nav.js'
import {
  AnatomySection,
  CurrentPageSection,
  DrawerHookSection,
  InContextSection,
} from './side-nav.stories.js'

const meta = {
  title: 'Components/SideNav/Features',
  component: SideNav,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SideNav>

export default meta

// Every story renders its own example, so none takes the component's
// required props as args.
type Story = StoryObj

export const Anatomy: Story = { render: () => <AnatomySection /> }

export const CurrentPage: Story = { name: 'Current page', render: () => <CurrentPageSection /> }

export const DrawerHook: Story = { name: 'Drawer hook', render: () => <DrawerHookSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

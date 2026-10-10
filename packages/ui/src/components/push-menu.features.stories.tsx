/**
 * PushMenu — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { PushMenu } from './push-menu.js'
import {
  BehaviourSection,
  BreadcrumbTrailSection,
  CloseButtonSection,
  CurrentPageSection,
  DrillingDownSection,
  InContextSection,
} from './push-menu.stories.js'

const meta = {
  title: 'Components/PushMenu/Features',
  component: PushMenu,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PushMenu>

export default meta

// Every story renders its own example, so none takes the component's
// required props as args.
type Story = StoryObj

export const DrillingDown: Story = { name: 'Drilling down', render: () => <DrillingDownSection /> }

export const Behaviour: Story = { render: () => <BehaviourSection /> }

export const CurrentPage: Story = { name: 'Current page', render: () => <CurrentPageSection /> }

export const CloseButton: Story = { name: 'Close button', render: () => <CloseButtonSection /> }

export const BreadcrumbTrail: Story = {
  name: 'Breadcrumb trail',
  render: () => <BreadcrumbTrailSection />,
}

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

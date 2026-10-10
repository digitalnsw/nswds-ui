/**
 * Footer — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Footer } from './footer.js'
import {
  AcknowledgementSection,
  ColoursSection,
  CompositionSection,
  ContainersSection,
  InContextSection,
  SiteMapSection,
  SocialLinksSection,
  WithTheLogoSection,
} from './footer.stories.js'

const meta = {
  title: 'Components/Footer/Features',
  component: Footer,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

export const Colours: Story = { render: () => <ColoursSection /> }

export const Acknowledgement: Story = {
  name: 'Acknowledgement of Country',
  render: () => <AcknowledgementSection />,
}

export const SiteMap: Story = { name: 'Site map', render: () => <SiteMapSection /> }

export const SocialLinks: Story = { name: 'Social links', render: () => <SocialLinksSection /> }

export const WithTheLogo: Story = { name: 'With the logo', render: () => <WithTheLogoSection /> }

export const Composition: Story = { render: () => <CompositionSection /> }

export const Containers: Story = { render: () => <ContainersSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

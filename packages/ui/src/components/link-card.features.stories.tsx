/**
 * LinkCard — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { LinkCard } from './link-card.js'
import {
  ContentSection,
  ExternalLinksSection,
  ExtraContentSection,
  InContextSection,
} from './link-card.stories.js'

const meta = {
  title: 'Components/LinkCard/Features',
  component: LinkCard,
  parameters: { layout: 'padded' },
  args: { href: '#fishing-licence', title: 'Get a fishing licence' },
} satisfies Meta<typeof LinkCard>

export default meta

type Story = StoryObj<typeof meta>

export const Content: Story = { render: () => <ContentSection /> }

export const External: Story = { name: 'External links', render: () => <ExternalLinksSection /> }

export const ExtraContent: Story = { name: 'Extra content', render: () => <ExtraContentSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

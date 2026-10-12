/**
 * PageHeader — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { PageHeader } from './page-header.js'
import {
  ColoursSection,
  ContainedSection,
  InContextSection,
  LongTitleSection,
  MetaSection,
  NamingSection,
  PhoneSection,
  RuleSection,
} from './page-header.stories.js'

const meta = {
  title: 'Components/PageHeader/Features',
  component: PageHeader,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const LongTitles: Story = { name: 'Long titles', render: () => <LongTitleSection /> }

export const WithARule: Story = { name: 'With a rule', render: () => <RuleSection /> }

export const WithAMetaRow: Story = { name: 'With a meta row', render: () => <MetaSection /> }

export const Contained: Story = { name: 'Contained', render: () => <ContainedSection /> }

export const OnAPhone: Story = { name: 'On a phone', render: () => <PhoneSection /> }

export const NamingTheHeader: Story = {
  name: 'Naming the header',
  render: () => <NamingSection />,
}

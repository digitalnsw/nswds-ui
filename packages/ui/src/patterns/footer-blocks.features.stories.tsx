/**
 * FooterBlocks — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * block can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  CallToActionSection,
  ChooserSection,
  CollapsibleSiteMapSection,
  ColoursSection,
  CompactBarSection,
  ContactDetailsSection,
  NewsletterSection,
  SimpleCentredSection,
  SiteMapSection,
  SiteMapWithBrandSection,
} from './footer-blocks.stories.js'
import { FooterSitemap } from './footer-sitemap.js'

const meta = {
  title: 'Patterns/FooterBlocks/Features',
  component: FooterSitemap,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FooterSitemap>

export default meta

type Story = StoryObj<typeof meta>

export const Chooser: Story = { render: () => <ChooserSection /> }

export const Colours: Story = { render: () => <ColoursSection /> }

export const SimpleCentred: Story = {
  name: 'Simple centred',
  render: () => <SimpleCentredSection />,
}

export const Compact: Story = { name: 'Compact bar', render: () => <CompactBarSection /> }

export const Sitemap: Story = { name: 'Site map', render: () => <SiteMapSection /> }

export const SitemapBrand: Story = {
  name: 'Site map with brand',
  render: () => <SiteMapWithBrandSection />,
}

export const Newsletter: Story = { render: () => <NewsletterSection /> }

export const Contact: Story = { name: 'Contact details', render: () => <ContactDetailsSection /> }

export const Cta: Story = { name: 'Call to action', render: () => <CallToActionSection /> }

export const Accordion: Story = {
  name: 'Collapsible site map',
  render: () => <CollapsibleSiteMapSection />,
}

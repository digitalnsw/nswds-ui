/**
 * Hero — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Hero } from './hero.js'
import {
  ColoursSection,
  LayoutsSection,
  MediaSection,
  NamingSection,
  RuleSection,
} from './hero.stories.js'

const meta = {
  title: 'Components/Hero/Features',
  component: Hero,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Hero>

export default meta

type Story = StoryObj<typeof meta>

export const Layouts: Story = { name: 'Layouts', render: () => <LayoutsSection /> }

export const Colours: Story = { name: 'Colours', render: () => <ColoursSection /> }

export const Media: Story = { name: 'Media', render: () => <MediaSection /> }

export const WithoutMedia: Story = { name: 'Without media', render: () => <RuleSection /> }

export const NamingTheHero: Story = { name: 'Naming the hero', render: () => <NamingSection /> }

/**
 * Tabs — Tests
 *
 * CSS check: proves globals.css loaded and the default list's fill resolves.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

const meta = {
  title: 'Components/Tabs/Tests',
  component: Tabs,
  tags: ['!dev', '!autodocs'],
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <Tabs {...args} defaultValue='overview' className='max-w-md'>
      <TabsList>
        <TabsTrigger value='overview'>Overview</TabsTrigger>
        <TabsTrigger value='details'>Details</TabsTrigger>
      </TabsList>
      <TabsContent value='overview'>The overview panel content.</TabsContent>
      <TabsContent value='details'>The details panel content.</TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const CssCheck: Story = {
  name: 'CSS check',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the tabs list's `bg-muted` (default variant)
    // resolves to a real colour rather than staying transparent.
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="tabs-list"]')
    if (!list) {
      throw new Error('Could not find [data-slot="tabs-list"].')
    }
    const background = getComputedStyle(list).backgroundColor
    if (background === '' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
      throw new Error(`Expected the --muted token to resolve, received "${background}".`)
    }
  },
}
